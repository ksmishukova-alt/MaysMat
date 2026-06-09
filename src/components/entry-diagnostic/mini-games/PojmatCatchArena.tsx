"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PojmatRound } from "@/data/entry-diagnostic/mini-games/pojmat-rounds";

const LANES = 4;
const CATCH_Y = 78;
const SPAWN_MS = 2200;

interface FallingCard {
  uid: number;
  id: string;
  label: string;
  lane: number;
  y: number;
}

export function PojmatCatchArena({
  round,
  onCatch,
}: {
  round: PojmatRound;
  onCatch: (cardId: string, correctId: string, trapId?: string) => void;
}) {
  const [mouseLane, setMouseLane] = useState(1);
  const [cards, setCards] = useState<FallingCard[]>([]);
  const uidRef = useRef(0);
  const cardsRef = useRef(cards);
  cardsRef.current = cards;

  const spawnCard = useCallback(() => {
    const pool = round.cards;
    const card = pool[Math.floor(Math.random() * pool.length)];
    const lane = Math.floor(Math.random() * LANES);
    uidRef.current += 1;
    setCards((prev) => [
      ...prev,
      { uid: uidRef.current, id: card.id, label: card.label, lane, y: 0 },
    ]);
  }, [round.cards]);

  useEffect(() => {
    setCards([]);
    spawnCard();
    const spawnTimer = window.setInterval(spawnCard, SPAWN_MS);
    return () => window.clearInterval(spawnTimer);
  }, [round, spawnCard]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setCards((prev) =>
        prev
          .map((c) => ({ ...c, y: c.y + 0.55 }))
          .filter((c) => c.y <= 105),
      );
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [round]);

  const tryCatch = () => {
    const inZone = cardsRef.current
      .filter((c) => c.lane === mouseLane && c.y >= CATCH_Y - 8 && c.y <= CATCH_Y + 12)
      .sort((a, b) => b.y - a.y);
    const target = inZone[0];
    if (!target) return;
    setCards((prev) => prev.filter((c) => c.uid !== target.uid));
    onCatch(target.id, round.correctId, round.trapId);
  };

  return (
    <div data-testid="pojmat-catch-arena">
      <p className="mb-3 rounded-xl border border-lavender-200 bg-lavender-50/80 p-3 text-center text-sm leading-relaxed text-gray-800">
        {round.conditionText}
      </p>
      <div className="relative h-72 overflow-hidden rounded-2xl border-2 border-purple-200 bg-gradient-to-b from-sky-50 to-lavender-100">
        {cards.map((card) => (
          <div
            key={card.uid}
            className="absolute w-[23%] transition-none"
            style={{
              left: `${card.lane * 25 + 1}%`,
              top: `${card.y}%`,
            }}
          >
            <div
              data-testid={`mini-target-${card.id}`}
              className={`rounded-xl border-2 bg-white px-2 py-2 text-center text-[11px] font-medium leading-tight shadow-md ${
                card.lane === mouseLane && card.y >= CATCH_Y - 8
                  ? "border-brand-purple"
                  : "border-lavender-200"
              }`}
            >
              {card.label}
            </div>
          </div>
        ))}
        <div
          className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-brand-purple/40"
          style={{ top: `${CATCH_Y}%` }}
        />
        <div
          className="absolute bottom-2 text-3xl transition-all duration-150"
          style={{ left: `${mouseLane * 25 + 8}%` }}
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
          className="min-h-11 min-w-11 rounded-xl border border-gray-200 bg-white text-lg"
        >
          ←
        </button>
        <button
          type="button"
          data-testid="pojmat-catch-btn"
          onClick={tryCatch}
          className="min-h-11 flex-1 rounded-xl bg-brand-purple px-4 text-sm font-semibold text-white"
        >
          Поймал!
        </button>
        <button
          type="button"
          aria-label="Вправо"
          onClick={() => setMouseLane((l) => Math.min(LANES - 1, l + 1))}
          className="min-h-11 min-w-11 rounded-xl border border-gray-200 bg-white text-lg"
        >
          →
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-gray-500">
        Подведи МышМата под нужную карточку и нажми «Поймал!»
      </p>
    </div>
  );
}
