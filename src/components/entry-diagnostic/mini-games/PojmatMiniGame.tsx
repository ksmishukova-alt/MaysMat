"use client";

import type { DiagnosticMiniGameProps } from "./types";
import { POJMAT_ROUNDS } from "@/data/entry-diagnostic/mini-games/pojmat-rounds";
import { MiniGameShell } from "./MiniGameShell";
import { BrandFrame, MINI_GAME_BRAND } from "./branded-renders";
import { usePojmatGameState } from "./usePojmatGameState";

export function PojmatMiniGame(props: DiagnosticMiniGameProps) {
  const state = usePojmatGameState(props);
  const round = POJMAT_ROUNDS[state.roundIndex];
  const brand = MINI_GAME_BRAND.pojmat;

  if (!round) {
    return <p className="text-sm text-gray-500">Игра завершена</p>;
  }

  return (
    <MiniGameShell
      config={props.config}
      mode={props.mode}
      timeLeft={state.timeLeft}
      round={state.roundIndex}
      totalRounds={state.totalRounds}
      footer={
        props.mode === "play" && state.finished ? (
          <button
            type="button"
            data-testid="mini-game-finish"
            className="mt-4 min-h-11 rounded-xl bg-brand-purple px-6 py-2 text-sm text-white"
            onClick={() => state.finishNow()}
          >
            Завершить игру
          </button>
        ) : null
      }
    >
      <BrandFrame brandTitle={brand?.title ?? props.config.title} accentClass={brand?.accent ?? ""}>
        <p className="mb-2 text-center text-xs text-gray-500">🎯 Поймай карточку с главным вопросом</p>
        <p className="mb-4 rounded-xl border border-lavender-200 bg-lavender-50/80 p-4 text-center text-sm leading-relaxed text-gray-800">
          {round.conditionText}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {round.cards.map((card) => (
            <button
              key={card.id}
              type="button"
              data-testid={`mini-target-${card.id}`}
              aria-label={card.label}
              onClick={() => state.pick(card.id, round.correctId, round.trapId)}
              className="min-h-20 rounded-2xl border-2 border-lavender-200 bg-white p-4 text-left text-sm font-medium leading-snug shadow-sm transition hover:border-brand-purple/50 hover:bg-lavender-50/50"
            >
              {card.label}
            </button>
          ))}
        </div>
      </BrandFrame>
    </MiniGameShell>
  );
}

PojmatMiniGame.displayName = "MiniGame_pojmat";
