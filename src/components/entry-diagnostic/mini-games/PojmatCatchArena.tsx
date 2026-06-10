"use client";

import { DiagnosticAssetImage } from "@/components/entry-diagnostic/ui/DiagnosticAssetImage";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MiniGameMode } from "@/data/entry-diagnostic/types";
import type { PojmatRound } from "@/data/entry-diagnostic/mini-games/pojmat-rounds";
import { isDiagnosticFastMode } from "@/lib/entry-diagnostic/fast-mode";
import { POJMAT_VISUAL_ASSETS } from "./pojmat-assets";
import { laneIndexFromClientX, laneLeftStyle, POJMAT_LANE_COUNT } from "./pojmat-lanes";
import { PojmatConditionPlate } from "./PojmatConditionPlate";
import { PojmatLanesLayer } from "./PojmatLanesLayer";
import { usePojmatArenaLayout } from "./usePojmatArenaLayout";

const LANE_BORDER = ["border-violet-300", "border-sky-300", "border-amber-300", "border-emerald-300"];
const CATCH_ANIM_MS = 480;

interface FallingCard {
  uid: number;
  id: string;
  label: string;
  lane: number;
  y: number;
}

interface CatchFx extends FallingCard {
  sparkKey: number;
}

function shuffleLanes(): number[] {
  const lanes = Array.from({ length: POJMAT_LANE_COUNT }, (_, i) => i);
  for (let i = lanes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lanes[i], lanes[j]] = [lanes[j], lanes[i]];
  }
  return lanes;
}

const CARD_STAGGER = [0, 10, 4, 14];

function cardStartY(index: number): number {
  return -6 - index * 11 - (CARD_STAGGER[index] ?? 0);
}

function buildInitialCards(round: PojmatRound, mode: MiniGameMode, uidStart: number): FallingCard[] {
  const fast = isDiagnosticFastMode();
  const laneOrder = shuffleLanes();
  if (fast && mode === "diagnostic") {
    const correctIdx = round.cards.findIndex((c) => c.id === round.correctId);
    const others = round.cards.map((c, i) => ({ c, i })).filter(({ i }) => i !== correctIdx);
    const assigned: number[] = new Array(round.cards.length);
    assigned[correctIdx] = 1;
    const freeLanes = [0, 2, 3];
    others.forEach(({ i }, idx) => {
      assigned[i] = freeLanes[idx] ?? idx;
    });
    return round.cards.map((card, i) => ({
      uid: uidStart + i + 1,
      id: card.id,
      label: card.label,
      lane: assigned[i] ?? laneOrder[i],
      y: cardStartY(i),
    }));
  }
  return round.cards.map((card, i) => ({
    uid: uidStart + i + 1,
    id: card.id,
    label: card.label,
    lane: laneOrder[i],
    y: cardStartY(i),
  }));
}

function arenaConfig(mode: MiniGameMode) {
  const fast = isDiagnosticFastMode();
  const diagnostic = mode === "diagnostic";
  return {
    catchY: diagnostic ? 86 : 88,
    catchHalf: diagnostic ? 20 : 12,
    baseSpeed: diagnostic ? (fast ? 0.72 : 0.18) : 0.5,
    fastBoost: fast && diagnostic ? 1.6 : 1,
    cardText: diagnostic
      ? "text-[10px] leading-tight font-bold sm:text-xs sm:leading-snug md:text-sm"
      : "text-[11px] leading-tight",
    cardPad: diagnostic ? "px-2 py-2 sm:px-2.5 sm:py-2.5" : "px-2 py-2",
    arenaClass: diagnostic ? "pojmat-arena pojmat-arena--diagnostic" : "pojmat-arena pojmat-arena--play",
    fallLimit: 118,
  };
}

export function PojmatCatchArena({
  round,
  mode,
  speedMultiplier = 1,
  onCatch,
}: {
  round: PojmatRound;
  mode: MiniGameMode;
  speedMultiplier?: number;
  onCatch: (cardId: string, correctId: string, trapId?: string) => boolean;
}) {
  const cfg = useMemo(() => arenaConfig(mode), [mode]);
  const uidRef = useRef(0);
  const initialCards = useMemo(() => {
    uidRef.current += 100;
    return buildInitialCards(round, mode, uidRef.current);
  }, [round, mode]);

  const correctLane = initialCards.find((c) => c.id === round.correctId)?.lane ?? 0;

  const [mouseLane, setMouseLane] = useState(1);
  const [cards, setCards] = useState<FallingCard[]>(initialCards);
  const [catchFx, setCatchFx] = useState<CatchFx | null>(null);
  const [basketPop, setBasketPop] = useState(false);
  const cardsRef = useRef(cards);
  const mouseLaneRef = useRef(mouseLane);
  const roundLockedRef = useRef(false);
  const arenaRef = useRef<HTMLDivElement>(null);
  const laneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const plateRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const dragPointerId = useRef<number | null>(null);
  const sparkRef = useRef(0);

  const layout = usePojmatArenaLayout(arenaRef, laneRefs, plateRef);

  cardsRef.current = cards;
  mouseLaneRef.current = mouseLane;

  const posForLane = useCallback(
    (lane: number) => laneLeftStyle(lane, layout.laneCentersPct),
    [layout.laneCentersPct],
  );

  const finishCatch = useCallback(
    (caught: FallingCard) => {
      setCatchFx(null);
      setBasketPop(false);
      onCatch(caught.id, round.correctId, round.trapId);
    },
    [onCatch, round.correctId, round.trapId],
  );

  const triggerCatch = useCallback(
    (caught: FallingCard, y: number) => {
      if (roundLockedRef.current) return;
      roundLockedRef.current = true;
      setCards((prev) => prev.filter((c) => c.uid !== caught.uid));
      sparkRef.current += 1;
      setCatchFx({ ...caught, y, sparkKey: sparkRef.current });
      setBasketPop(true);
      window.setTimeout(() => finishCatch(caught), CATCH_ANIM_MS);
    },
    [finishCatch],
  );

  useEffect(() => {
    setCards(initialCards);
    setMouseLane(1);
    setCatchFx(null);
    setBasketPop(false);
    roundLockedRef.current = false;
  }, [initialCards]);

  const moveLane = useCallback((delta: number) => {
    if (roundLockedRef.current) return;
    setMouseLane((lane) => Math.min(POJMAT_LANE_COUNT - 1, Math.max(0, lane + delta)));
  }, []);

  const laneFromClientX = useCallback(
    (clientX: number) => {
      const rect = arenaRef.current?.getBoundingClientRect();
      if (!rect) return mouseLaneRef.current;
      return laneIndexFromClientX(clientX, rect, layout.laneCentersPct);
    },
    [layout.laneCentersPct],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (roundLockedRef.current) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        moveLane(-1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        moveLane(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moveLane]);

  useEffect(() => {
    let raf = 0;
    const playMul = mode === "play" ? speedMultiplier : 1;

    const tick = () => {
      if (roundLockedRef.current) {
        raf = window.requestAnimationFrame(tick);
        return;
      }

      const dy = cfg.baseSpeed * cfg.fastBoost * playMul;
      const catchTop = cfg.catchY - cfg.catchHalf;
      const catchBottom = cfg.catchY + cfg.catchHalf;
      const lane = mouseLaneRef.current;

      let caught: { card: FallingCard; y: number } | null = null;
      const next: FallingCard[] = [];

      for (const c of cardsRef.current) {
        const newY = c.y + dy;
        if (!caught && c.lane === lane && newY >= catchTop && newY <= catchBottom) {
          caught = { card: c, y: newY };
          continue;
        }
        if (newY <= cfg.fallLimit) next.push({ ...c, y: newY });
      }

      if (caught) {
        triggerCatch(caught.card, caught.y);
        setCards(next);
      } else {
        setCards(next);
      }

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [round, mode, speedMultiplier, cfg, triggerCatch]);

  const mousePos = posForLane(mouseLane);

  return (
    <div className="pojmat-catch-arena-root" data-testid="pojmat-catch-arena" data-correct-lane={correctLane}>
      <div
        ref={arenaRef}
        className={`relative touch-none overflow-hidden rounded-xl border-2 border-purple-200/80 md:rounded-2xl ${cfg.arenaClass}`}
        onClick={(e) => {
          if (roundLockedRef.current) return;
          setMouseLane(laneFromClientX(e.clientX));
        }}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current == null || roundLockedRef.current) return;
          const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
          const delta = endX - touchStartX.current;
          if (Math.abs(delta) >= 36) {
            moveLane(delta > 0 ? -1 : 1);
          } else {
            setMouseLane(laneFromClientX(endX));
          }
          touchStartX.current = null;
        }}
      >
        <div className="pojmat-arena__decor" aria-hidden />

        <PojmatLanesLayer laneRefs={laneRefs} />

        <PojmatConditionPlate ref={plateRef} round={round} />

        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{ clipPath: `inset(${layout.playfieldTopPct}% 0 0 0)` }}
        >
          {cards.map((card) => {
            const laneStyle = LANE_BORDER[card.lane % LANE_BORDER.length];
            const pos = posForLane(card.lane);
            return (
              <div
                key={card.uid}
                className="absolute"
                style={{
                  left: pos.left,
                  transform: pos.transform,
                  top: `${card.y}%`,
                  width: `${layout.cardWidthPct}%`,
                }}
              >
                <div
                  data-testid={`mini-target-${card.id}`}
                  data-lane={card.lane}
                  className={`w-full rounded-xl border-2 bg-white/95 text-center font-medium shadow-lg ${laneStyle} ${cfg.cardText} ${cfg.cardPad}`}
                >
                  {card.label}
                </div>
              </div>
            );
          })}
        </div>

        {catchFx ? (
          <div
            className="pointer-events-none absolute z-20 pojmat-catch-in"
            style={{
              left: posForLane(catchFx.lane).left,
              transform: posForLane(catchFx.lane).transform,
              top: `${catchFx.y}%`,
              width: `${layout.cardWidthPct}%`,
            }}
          >
            <div
              className={`w-full rounded-xl border-2 bg-white text-center font-medium shadow-xl ${LANE_BORDER[catchFx.lane % LANE_BORDER.length]} ${cfg.cardText} ${cfg.cardPad}`}
            >
              {catchFx.label}
            </div>
          </div>
        ) : null}

        {catchFx ? (
          <div
            key={catchFx.sparkKey}
            className="pointer-events-none absolute z-30 h-10 w-10 rounded-full bg-amber-200/80 pojmat-sparkle"
            style={{ left: mousePos.left, transform: mousePos.transform, bottom: "12%" }}
            aria-hidden
          />
        ) : null}

        <div
          data-testid="pojmat-mouse"
          data-lane={mouseLane}
          className={`absolute bottom-0 z-20 flex flex-col items-center transition-[left,transform] duration-200 ease-out ${basketPop ? "pojmat-basket-pop" : ""}`}
          style={{
            left: mousePos.left,
            transform: mousePos.transform,
            width: `${layout.cardWidthPct * 1.05}%`,
          }}
          onPointerDown={(e) => {
            if (roundLockedRef.current) return;
            dragPointerId.current = e.pointerId;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (dragPointerId.current !== e.pointerId || roundLockedRef.current) return;
            setMouseLane(laneFromClientX(e.clientX));
          }}
          onPointerUp={(e) => {
            if (dragPointerId.current === e.pointerId) {
              dragPointerId.current = null;
              e.currentTarget.releasePointerCapture(e.pointerId);
            }
          }}
          onPointerCancel={() => {
            dragPointerId.current = null;
          }}
        >
          <DiagnosticAssetImage
            src={POJMAT_VISUAL_ASSETS.character}
            alt="МышМат"
            width={123}
            height={123}
            className="pojmat-mouse-character h-auto w-full max-w-[8.75rem] drop-shadow-lg sm:max-w-[7.75rem]"
            draggable={false}
          />
        </div>
      </div>

      {mode === "play" && speedMultiplier > 1 ? (
        <p className="mt-2 text-center text-xs font-medium text-brand-purple">
          Серия правильных! Скорость ×{speedMultiplier.toFixed(1)}
        </p>
      ) : null}
    </div>
  );
}
