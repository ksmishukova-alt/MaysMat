"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MiniGameMode } from "@/data/entry-diagnostic/types";
import type { PojmatRound } from "@/data/entry-diagnostic/mini-games/pojmat-rounds";
import { isDiagnosticFastMode } from "@/lib/entry-diagnostic/fast-mode";

const LANES = 4;
const LANE_BORDER = ["border-violet-400", "border-sky-400", "border-amber-400", "border-emerald-400"];

interface FallingCard {
  uid: number;
  id: string;
  label: string;
  lane: number;
  y: number;
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
    catchY: diagnostic ? 70 : 76,
    catchHalf: diagnostic ? 22 : 10,
    baseSpeed: diagnostic ? (fast ? 0.65 : 0.2) : 0.46,
    fastBoost: fast && diagnostic ? 1.8 : 1,
    cardText: diagnostic ? "text-xs sm:text-sm leading-snug" : "text-[11px] leading-tight",
    cardPad: diagnostic ? "px-2.5 py-3" : "px-2 py-2",
    arenaHeight: diagnostic ? "h-[22rem] sm:h-96" : "h-80",
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
  const cardsRef = useRef(cards);
  const mouseLaneRef = useRef(mouseLane);
  const roundLockedRef = useRef(false);
  const arenaRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const dragPointerId = useRef<number | null>(null);

  cardsRef.current = cards;
  mouseLaneRef.current = mouseLane;

  const catchCard = useCallback(
    (uid: number, cardId: string) => {
      if (roundLockedRef.current) return;
      roundLockedRef.current = true;
      setCards((prev) => prev.filter((c) => c.uid !== uid));
      onCatch(cardId, round.correctId, round.trapId);
    },
    [onCatch, round.correctId, round.trapId],
  );

  useEffect(() => {
    setCards(initialCards);
    setMouseLane(1);
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

      let caught: FallingCard | null = null;
      const next: FallingCard[] = [];

      for (const c of cardsRef.current) {
        const newY = c.y + dy;
        if (!caught && c.lane === lane && newY >= catchTop && newY <= catchBottom) {
          caught = c;
          continue;
        }
        if (newY <= 108) next.push({ ...c, y: newY });
      }

      if (caught) {
        catchCard(caught.uid, caught.id);
        setCards(next);
      } else {
        setCards(next);
      }

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [round, mode, speedMultiplier, cfg, catchCard]);

  return (
    <div
      data-testid="pojmat-catch-arena"
      data-correct-lane={correctLane}
      data-round-locked={roundLockedRef.current ? "1" : "0"}
    >
      <div className="mb-3 rounded-2xl border border-purple-200 bg-white p-3 shadow-sm">
        <p className="text-sm font-medium text-gray-800">
          <span aria-hidden>🎯 </span>
          Поймай карточку с главным вопросом задачи
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">{round.conditionText}</p>
      </div>

      <div
        ref={arenaRef}
        className={`relative ${cfg.arenaHeight} touch-none overflow-hidden rounded-2xl border-2 border-purple-300 bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200`}
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
        <div className="pointer-events-none absolute inset-0 opacity-25">
          <div className="absolute left-[8%] top-[6%] text-2xl font-bold text-white/90">2+3</div>
          <div className="absolute right-[10%] top-[12%] text-xl text-white/80">5</div>
          <div className="absolute left-[42%] top-[4%] text-lg text-white/70">=</div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-emerald-400/70 to-transparent" />

        {Array.from({ length: LANES }).map((_, lane) => (
          <div
            key={lane}
            className="pointer-events-none absolute bottom-0 top-0 border-r border-dashed border-white/50 last:border-r-0"
            style={{ left: `${lane * 25}%`, width: "25%" }}
          />
        ))}

        {cards.map((card) => {
          const laneStyle = LANE_BORDER[card.lane % LANE_BORDER.length];
          return (
            <div
              key={card.uid}
              className="pointer-events-none absolute w-[23%]"
              style={{ left: `${card.lane * 25 + 1}%`, top: `${card.y}%` }}
            >
              <div
                data-testid={`mini-target-${card.id}`}
                data-lane={card.lane}
                className={`w-full rounded-xl border-2 border-dashed bg-white/95 text-center font-medium shadow-md ${laneStyle} ${cfg.cardText} ${cfg.cardPad}`}
              >
                {card.label}
              </div>
            </div>
          );
        })}

        <div
          className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-brand-purple/40"
          style={{ top: `${cfg.catchY}%` }}
        />

        <div
          data-testid="pojmat-mouse"
          data-lane={mouseLane}
          className="absolute bottom-2 flex cursor-grab flex-col items-center transition-[left] duration-150 ease-out active:cursor-grabbing"
          style={{ left: `${mouseLane * 25 + 6}%`, width: "13%" }}
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
          <span className="text-3xl drop-shadow-md" aria-hidden>
            🧺
          </span>
          <span className="-mt-1 text-4xl drop-shadow-md" aria-hidden>
            🐭
          </span>
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
