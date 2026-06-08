"use client";

import type { ComponentType, ReactNode } from "react";
import type { DiagnosticMiniGameProps } from "./types";
import { getMiniGameSpec } from "@/data/entry-diagnostic/mini-games/specs";
import { useMiniGameState } from "./useMiniGameState";
import { MiniGameShell } from "./MiniGameShell";

export interface ThemedMiniGameProps extends DiagnosticMiniGameProps {
  themeClass: string;
  emoji: string;
  renderTargets: (args: {
    targets: string[];
    pick: (label: string) => boolean;
    showFeedback: boolean;
  }) => ReactNode;
}

export function ThemedMiniGame({
  config,
  mode,
  blockId,
  onComplete,
  onEvent,
  themeClass,
  emoji,
  renderTargets,
}: ThemedMiniGameProps) {
  const spec = getMiniGameSpec(config.miniGameId);
  const state = useMiniGameState({
    config,
    spec: spec ?? {
      miniGameId: config.miniGameId,
      instruction: config.description,
      correctTarget: "—",
      targets: [],
    },
    mode,
    blockId,
    onComplete,
    onEvent,
  });

  if (!spec) return <p>Игра не настроена</p>;

  return (
    <MiniGameShell
      config={config}
      mode={mode}
      timeLeft={state.timeLeft}
      round={state.round}
      totalRounds={state.totalRounds}
      footer={
        mode === "play" && state.round >= state.totalRounds ? (
          <button
            type="button"
            data-testid="mini-game-finish"
            className="mt-4 min-h-11 rounded-xl bg-brand-purple px-6 py-2 text-sm text-white"
            onClick={() =>
              onComplete({
                score: state.score,
                roundsCompleted: state.round,
                catchErrors: state.catchErrors,
                semanticErrors: state.semanticErrors,
              })
            }
          >
            Завершить игру
          </button>
        ) : null
      }
    >
      <p className={`mb-4 rounded-xl p-3 text-sm ${themeClass}`}>
        {emoji} {spec.instruction}
      </p>
      {renderTargets({
        targets: spec.targets,
        pick: state.pick,
        showFeedback: state.showFeedback,
      })}
    </MiniGameShell>
  );
}

export function createThemedMiniGame(
  id: string,
  emoji: string,
  themeClass: string,
  layout: "grid" | "row" | "cards" = "grid",
): ComponentType<DiagnosticMiniGameProps> {
  function Game(props: DiagnosticMiniGameProps) {
    return (
      <ThemedMiniGame
        {...props}
        emoji={emoji}
        themeClass={themeClass}
        renderTargets={({ targets, pick }) => {
          if (layout === "row") {
            return (
              <div className="flex flex-wrap gap-3">
                {targets.map((label) => (
                  <button
                    key={label}
                    type="button"
                    data-testid={`mini-target-${label}`}
                    aria-label={label}
                    onClick={() => pick(label)}
                    className="min-h-[3.25rem] flex-1 rounded-2xl border-2 border-lavender-200 bg-white px-4 py-3 text-sm font-medium hover:border-brand-purple/40"
                  >
                    {label}
                  </button>
                ))}
              </div>
            );
          }
          if (layout === "cards") {
            return (
              <div className="grid grid-cols-2 gap-3">
                {targets.map((label) => (
                  <button
                    key={label}
                    type="button"
                    data-testid={`mini-target-${label}`}
                    aria-label={label}
                    onClick={() => pick(label)}
                    className="min-h-24 rounded-2xl border-2 border-dashed border-lavender-300 bg-gradient-to-br from-white to-lavender-50 p-4 text-center text-sm font-semibold shadow-sm"
                  >
                    {label}
                  </button>
                ))}
              </div>
            );
          }
          return (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {targets.map((label) => (
                <button
                  key={label}
                  type="button"
                  data-testid={`mini-target-${label}`}
                  aria-label={label}
                  onClick={() => pick(label)}
                  className="min-h-[3.25rem] rounded-2xl border-2 border-lavender-200 bg-white px-4 py-4 text-sm font-medium hover:border-brand-purple/40"
                >
                  {label}
                </button>
              ))}
            </div>
          );
        }}
      />
    );
  }
  Game.displayName = `MiniGame_${id}`;
  return Game;
}
