"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MiniGameMode } from "@/data/entry-diagnostic/types";
import type { PojmatRound } from "@/data/entry-diagnostic/mini-games/pojmat-rounds";
import { isDiagnosticFastMode } from "@/lib/entry-diagnostic/fast-mode";
import { POJMAT_VISUAL_ASSETS } from "./pojmat-assets";

const LANES = 4;
const LANE_BORDER = ["border-violet-400", "border-sky-400", "border-amber-400", "border-emerald-400"];
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
  const lanes = [0, 1, 2, 3];
  for (let i = lanes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lanes[i], lanes[j]] = [lanes[j], lanes[i]];
  }
  return lanes;
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
      y: -12 - i * 2,
    }));
  }
  return round.cards.map((card, i) => ({
    uid: uidStart + i + 1,
    id: card.id,
    label: card.label,
    lane: laneOrder[i],
    y: -12 - i * 2,
  }));
}

function arenaConfig(mode: MiniGameMode) {
  const fast = isDiagnosticFastMode();
  const diagnostic = mode === "diagnostic";
  return {
    /** % сверху — ниже число = выше на экране; 86 ≈ у корзинки */
    catchY: diagnostic ? 86 : 88,
    catchHalf: diagnostic ? 20 : 12,
    baseSpeed: diagnostic ? (fast ? 0.72 : 0.18) : 0.5,
    fastBoost: fast && diagnostic ? 1.6 : 1,
    cardText: diagnostic ? "text-xs sm:text-sm leading-snug" : "text-[11px] leading-tight",
    cardPad: diagnostic ? "px-2.5 py-3" : "px-2 py-2",
    arenaHeight: diagnostic ? "h-[22rem] sm:h-[26rem]" : "h-80",
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
  const touchStartX = useRef<number | null>(null);
  const dragPointerId = useRef<number | null>(null);
  const sparkRef = useRef(0);

  cardsRef.current = cards;
  mouseLaneRef.current = mouseLane;

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
    setMouseLane((l) => Math.min(LANES - 1, Math.max(0, l + delta)));
  }, []);

  const laneFromClientX = useCallback((clientX: number) => {
    const rect = arenaRef.current?.getBoundingClientRect();
    if (!rect) return mouseLaneRef.current;
    const ratio = (clientX - rect.left) / rect.width;
    return Math.min(LANES - 1, Math.max(0, Math.floor(ratio * LANES)));
  }, []);

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

  const mouseLeft = `${mouseLane * 25 + 4}%`;

  return (
    <div data-testid="pojmat-catch-arena" data-correct-lane={correctLane}>
      <div className="mb-3 rounded-2xl border border-purple-200 bg-white p-3 shadow-sm">
        <p className="text-sm font-medium text-gray-800">
          <span aria-hidden>🎯 </span>
          Поймай карточку с главным вопросом задачи
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">{round.conditionText}</p>
      </div>

      <div
        ref={arenaRef}
        className={`relative ${cfg.arenaHeight} touch-none overflow-hidden rounded-2xl border-2 border-purple-300`}
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
        <Image
          src={POJMAT_VISUAL_ASSETS.arenaBg}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 480px"
        />

        {cards.map((card) => {
          const laneStyle = LANE_BORDER[card.lane % LANE_BORDER.length];
          return (
            <div
              key={card.uid}
              className="pointer-events-none absolute z-10 w-[23%]"
              style={{ left: `${card.lane * 25 + 1}%`, top: `${card.y}%` }}
            >
              <div
                data-testid={`mini-target-${card.id}`}
                data-lane={card.lane}
                className={`w-full rounded-xl border-2 border-dashed bg-white/95 text-center font-medium shadow-lg ${laneStyle} ${cfg.cardText} ${cfg.cardPad}`}
              >
                {card.label}
              </div>
            </div>
          );
        })}

        {catchFx ? (
          <div
            className="pointer-events-none absolute z-20 w-[23%] pojmat-catch-in"
            style={{ left: `${catchFx.lane * 25 + 1}%`, top: `${catchFx.y}%` }}
          >
            <div
              className={`w-full rounded-xl border-2 border-dashed bg-white text-center font-medium shadow-xl ${LANE_BORDER[catchFx.lane % LANE_BORDER.length]} ${cfg.cardText} ${cfg.cardPad}`}
            >
              {catchFx.label}
            </div>
          </div>
        ) : null}

        {catchFx ? (
          <div
            key={catchFx.sparkKey}
            className="pointer-events-none absolute z-30 h-10 w-10 rounded-full bg-amber-200/80 pojmat-sparkle"
            style={{ left: mouseLeft, bottom: "12%" }}
            aria-hidden
          />
        ) : null}

        <div
          data-testid="pojmat-mouse"
          data-lane={mouseLane}
          className={`absolute bottom-0 z-20 flex w-[17%] flex-col items-center transition-[left] duration-150 ease-out ${basketPop ? "pojmat-basket-pop" : ""}`}
          style={{ left: mouseLeft }}
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
          onPointerCancel={(e) => {
            if (dragPointerId.current === e.pointerId) dragPointerId.current = null;
          }}
        >
          <Image
            src={POJMAT_VISUAL_ASSETS.character}
            alt="МышМат"
            width={112}
            height={112}
            className="h-auto w-full max-w-[7rem] drop-shadow-lg"
            draggable={false}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          data-testid="pojmat-lane-left"
          aria-label="Влево"
          onClick={() => moveLane(-1)}
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-purple-200 bg-white text-xl shadow-sm active:scale-95"
        >
          ←
        </button>
        <p className="min-w-[8rem] text-center text-xs text-gray-500">
          {mode === "diagnostic"
            ? "Подведи корзинку под нужную карточку"
            : "Серия ускоряет падение"}
        </p>
        <button
          type="button"
          data-testid="pojmat-lane-right"
          aria-label="Вправо"
          onClick={() => moveLane(1)}
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-purple-200 bg-white text-xl shadow-sm active:scale-95"
        >
          →
        </button>
      </div>

      {mode === "play" && speedMultiplier > 1 ? (
        <p className="mt-2 text-center text-xs font-medium text-brand-purple">
          Серия правильных! Скорость ×{speedMultiplier.toFixed(1)}
        </p>
      ) : null}
    </div>
  );
}
