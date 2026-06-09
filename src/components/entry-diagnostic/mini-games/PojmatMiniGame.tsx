"use client";

import type { DiagnosticMiniGameProps } from "./types";
import { POJMAT_ROUNDS } from "@/data/entry-diagnostic/mini-games/pojmat-rounds";
import { MiniGameShell } from "./MiniGameShell";
import { BrandFrame, MINI_GAME_BRAND } from "./branded-renders";
import { usePojmatGameState } from "./usePojmatGameState";
import { PojmatCatchArena } from "./PojmatCatchArena";

export function PojmatMiniGame(props: DiagnosticMiniGameProps) {
  const state = usePojmatGameState(props);
  const round = POJMAT_ROUNDS[state.roundIndex % POJMAT_ROUNDS.length];
  const brand = MINI_GAME_BRAND.pojmat;

  if (!round || state.finished) {
    return props.mode === "play" && state.finished ? (
      <div>
        <p className="text-sm text-gray-600">Игра завершена! Очки: {state.score}</p>
        <button
          type="button"
          data-testid="mini-game-finish"
          className="mt-4 min-h-11 rounded-xl bg-brand-purple px-6 py-2 text-sm text-white"
          onClick={() => state.finishNow()}
        >
          Завершить игру
        </button>
      </div>
    ) : (
      <p className="text-sm text-gray-500">Игра завершена</p>
    );
  }

  const handlePick = (cardId: string) => state.pick(cardId, round.correctId, round.trapId);

  return (
    <MiniGameShell
      config={props.config}
      mode={props.mode}
      timeLeft={state.timeLeft}
      round={state.roundIndex}
      totalRounds={state.totalRounds}
      footer={
        props.mode === "play" && state.roundIndex >= state.totalRounds ? (
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
      <BrandFrame
        brandTitle={brand?.title ?? props.config.title}
        accentClass={brand?.accent ?? ""}
        showTitle={false}
        compact
      >
        <PojmatCatchArena
          key={`${state.roundIndex}-${props.mode}`}
          round={round}
          mode={props.mode}
          speedMultiplier={state.speedMultiplier}
          onCatch={handlePick}
        />
      </BrandFrame>
    </MiniGameShell>
  );
}

PojmatMiniGame.displayName = "MiniGame_pojmat";
