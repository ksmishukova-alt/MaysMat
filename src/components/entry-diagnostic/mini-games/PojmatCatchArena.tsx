"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MiniGameMode } from "@/data/entry-diagnostic/types";
import type { PojmatRound } from "@/data/entry-diagnostic/mini-games/pojmat-rounds";
import { isDiagnosticFastMode } from "@/lib/entry-diagnostic/fast-mode";

const LANES = 4;
const CATCH_Y = 76;
const BASE_SPEED = 0.42;
const BASE_SPAWN_MS = 2400;
const LANE_BORDER = ["border-violet-400", "border-sky-400", "border-amber-400", "border-emerald-400"];

interface FallingCard {
  uid: number;
  id: string;
  label: string;
  lane: number;
  y: number;
}

export function PojmatCatchArena({
  round,
  mode,
  speedMultiplier = 1,
  onCatch,
}: {
  round: PojmatRound;
  mode: MiniGameMode;
  /** Play: растёт при серии правильных ловлей */
  speedMultiplier?: number;
  onCatch: (cardId: string, correctId: string, trapId?: string) => boolean;
}) {
  const [mouseLane, setMouseLane] = useState(1);
  const [cards, setCards] = useState<FallingCard[]>([]);
  const uidRef = useRef(0);
  const cardsRef = useRef(cards);
  const mouseLaneRef = useRef(mouseLane);
  cardsRef.current = cards;
  mouseLaneRef.current = mouseLane;
  const speedRef = useRef(BASE_SPEED * speedMultiplier);
  speedRef.current = BASE_SPEED * speedMultiplier;

  const catchCard = useCallback(
    (uid: number, cardId: string) => {
      setCards((prev) => prev.filter((c) => c.uid !== uid));
      onCatch(cardId, round.correctId, round.trapId);
    },
    [onCatch, round.correctId, round.trapId],
  );

  const spawnCard = useCallback(() => {
    const pool = round.cards;
    const fast = isDiagnosticFastMode();
    const correct = pool.find((c) => c.id === round.correctId) ?? pool[0];
    const card = fast && Math.random() > 0.35 ? correct : pool[Math.floor(Math.random() * pool.length)];
    const lane = fast && card.id === round.correctId ? mouseLaneRef.current : Math.floor(Math.random() * LANES);
    uidRef.current += 1;
    setCards((prev) => [
      ...prev,
      { uid: uidRef.current, id: card.id, label: card.label, lane, y: -8 },
    ]);
  }, [round.cards, round.correctId]);

  useEffect(() => {
    setCards([]);
    setMouseLane(1);
    if (isDiagnosticFastMode() && mode === "diagnostic") {
      const correct = round.cards.find((c) => c.id === round.correctId);
      if (correct) {
        uidRef.current += 1;
        setCards([
          {
            uid: uidRef.current,
            id: correct.id,
            label: correct.label,
            lane: 1,
            y: CATCH_Y,
          },
        ]);
      }
    } else {
      spawnCard();
    }
    const spawnMs = isDiagnosticFastMode()
      ? Math.max(600, BASE_SPAWN_MS / speedMultiplier / 2)
      : Math.max(900, BASE_SPAWN_MS / speedMultiplier);
    const spawnTimer = window.setInterval(spawnCard, spawnMs);
    return () => window.clearInterval(spawnTimer);
  }, [round, spawnCard, speedMultiplier, mode]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const dy = speedRef.current * (isDiagnosticFastMode() ? 2.2 : 1);
      setCards((prev) => prev.map((c) => ({ ...c, y: c.y + dy })).filter((c) => c.y <= 108));
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [round]);

  const tryCatch = () => {
    const inZone = cardsRef.current
      .filter((c) => c.lane === mouseLaneRef.current && c.y >= CATCH_Y - 10 && c.y <= CATCH_Y + 14)
      .sort((a, b) => b.y - a.y);
    const target = inZone[0];
    if (!target) return;
    catchCard(target.uid, target.id);
  };

  return (
    <div data-testid="pojmat-catch-arena">
      <div className="mb-3 rounded-2xl border border-amber-100 bg-white p-3 shadow-sm">
        <div className="flex gap-3">
          <span className="text-3xl" aria-hidden>
            🧺
          </span>
          <div>
            <p className="text-sm leading-relaxed text-gray-800">{round.conditionText}</p>
            <p className="mt-1 text-xs text-gray-500">
              Поймай карточку с правильным смыслом вопроса
            </p>
          </div>
        </div>
      </div>

      <div className="relative h-80 overflow-hidden rounded-2xl border-2 border-purple-200 bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute left-[10%] top-[8%] text-2xl text-white/80">2+3</div>
          <div className="absolute right-[12%] top-[14%] text-xl text-white/70">5</div>
          <div className="absolute left-[40%] top-[5%] text-lg text-white/60">=</div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-emerald-300/80 to-transparent" />

        {Array.from({ length: LANES }).map((_, lane) => (
          <div
            key={lane}
            className="pointer-events-none absolute bottom-0 top-0 border-r border-dashed border-white/40"
            style={{ left: `${lane * 25}%`, width: "25%" }}
          />
        ))}

        {cards.map((card) => {
          const laneStyle = LANE_BORDER[card.lane % LANE_BORDER.length];
          const inCatchZone = card.lane === mouseLane && card.y >= CATCH_Y - 10;
          return (
            <div
              key={card.uid}
              className="absolute w-[23%]"
              style={{ left: `${card.lane * 25 + 1}%`, top: `${card.y}%` }}
            >
              <button
                type="button"
                data-testid={`mini-target-${card.id}`}
                disabled={!inCatchZone}
                onClick={() => inCatchZone && catchCard(card.uid, card.id)}
                className={`w-full rounded-xl border-2 bg-white/95 px-2 py-2 text-center text-[11px] font-medium leading-tight shadow-md ${laneStyle} ${
                  inCatchZone ? "cursor-pointer ring-2 ring-brand-purple/40" : "pointer-events-none opacity-90"
                }`}
              >
                {card.label}
              </button>
            </div>
          );
        })}

        <div
          className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-brand-purple/50"
          style={{ top: `${CATCH_Y}%` }}
        />
        <div
          className="pointer-events-none absolute rounded-lg border-2 border-dashed border-brand-purple/60 bg-white/20"
          style={{
            left: `${mouseLane * 25 + 2}%`,
            width: "21%",
            top: `${CATCH_Y + 2}%`,
            height: "18%",
          }}
        />

        <div
          className="absolute bottom-3 text-4xl drop-shadow-md transition-all duration-150"
          style={{ left: `${mouseLane * 25 + 9}%` }}
          aria-hidden
        >
          🐭
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="Влево"
          onClick={() => setMouseLane((l) => Math.max(0, l - 1))}
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-purple-200 bg-white text-xl shadow-sm"
        >
          ←
        </button>
        <button
          type="button"
          data-testid="pojmat-catch-btn"
          onClick={tryCatch}
          className="min-h-12 flex-1 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-500 px-4 text-base font-bold text-white shadow-md"
        >
          Поймал!
        </button>
        <button
          type="button"
          aria-label="Вправо"
          onClick={() => setMouseLane((l) => Math.min(LANES - 1, l + 1))}
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-purple-200 bg-white text-xl shadow-sm"
        >
          →
        </button>
      </div>
      {mode === "play" && speedMultiplier > 1 ? (
        <p className="mt-2 text-center text-xs font-medium text-brand-purple">
          Серия правильных! Скорость ×{speedMultiplier.toFixed(1)}
        </p>
      ) : (
        <p className="mt-2 text-center text-xs text-gray-500">
          Подведи МышМата под нужную карточку и нажми «Поймал!»
        </p>
      )}
    </div>
  );
}
