"use client";

import Image from "next/image";
import type { DiagnosticMiniGameProps } from "./types";
import { POJMAT_ROUNDS } from "@/data/entry-diagnostic/mini-games/pojmat-rounds";
import { POJMAT_VISUAL_ASSETS } from "./pojmat-assets";
import { usePojmatGameState } from "./usePojmatGameState";
import { PojmatCatchArena } from "./PojmatCatchArena";
import "./pojmat-game.css";

export function PojmatMiniGame(props: DiagnosticMiniGameProps) {
  const state = usePojmatGameState(props);
  const round = POJMAT_ROUNDS[state.roundIndex % POJMAT_ROUNDS.length];

  if (!round || state.finished) {
    return (
      <section className="pojmat-game pojmat-game--finished" data-testid="diagnostic-minigame" data-game="pojmat">
        {props.mode === "play" && state.finished ? (
          <>
            <p>Игра завершена! Очки: {state.score}</p>
            <button
              type="button"
              data-testid="mini-game-finish"
              className="diagnostic-primary-button"
              onClick={() => state.finishNow()}
            >
              Завершить игру
            </button>
          </>
        ) : (
          <p>Игра завершена</p>
        )}
      </section>
    );
  }

  const handlePick = (cardId: string) => state.pick(cardId, round.correctId, round.trapId);

  return (
    <section
      className="pojmat-game"
      data-testid="diagnostic-minigame"
      data-mode={props.mode}
      data-game="pojmat"
    >
      <header className="pojmat-game__header">
        <Image
          className="pojmat-game__header-img diagnostic-icon-transparent"
          src={POJMAT_VISUAL_ASSETS.titleChip}
          alt="МышМат: ПойМАТ!"
          width={360}
          height={64}
          priority
        />
        {props.mode === "diagnostic" ? (
          <div className="pojmat-game__timer" aria-label={`Осталось ${state.timeLeft} секунд`}>
            ⏱ {state.timeLeft}
          </div>
        ) : (
          <div className="pojmat-game__timer">⭐ {state.score}</div>
        )}
      </header>

      <div className="pojmat-game__body">
        <div className="pojmat-game__arena-wrap">
          <PojmatCatchArena
            key={`${state.roundIndex}-${props.mode}`}
            round={round}
            mode={props.mode}
            speedMultiplier={state.speedMultiplier}
            onCatch={handlePick}
          />
        </div>
      </div>

      {props.mode === "play" && state.roundIndex >= state.totalRounds ? (
        <div className="pojmat-game__controls">
          <button
            type="button"
            data-testid="mini-game-finish"
            className="diagnostic-primary-button"
            onClick={() => state.finishNow()}
          >
            Завершить игру
          </button>
        </div>
      ) : null}
    </section>
  );
}

PojmatMiniGame.displayName = "MiniGame_pojmat";
