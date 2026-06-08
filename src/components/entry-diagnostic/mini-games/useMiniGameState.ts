"use client";

import { useCallback, useEffect, useState } from "react";
import type { MiniGameConfig, MiniGameMode } from "@/data/entry-diagnostic/types";
import type { MiniGameSpec } from "@/data/entry-diagnostic/mini-games/specs";
import { diagnosticMiniGameDurationSec } from "@/lib/entry-diagnostic/fast-mode";
import type { MiniGameResult } from "./types";

export interface MiniGameStateOptions {
  config: MiniGameConfig;
  spec: MiniGameSpec;
  mode: MiniGameMode;
  blockId: string;
  onComplete: (result: MiniGameResult) => void;
  onEvent: (eventType: string, payload: Record<string, unknown>) => void;
}

export function useMiniGameState({
  config,
  spec,
  mode,
  blockId,
  onComplete,
  onEvent,
}: MiniGameStateOptions) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [catchErrors, setCatchErrors] = useState(0);
  const [semanticErrors, setSemanticErrors] = useState(0);
  const durationSec = diagnosticMiniGameDurationSec(config.diagnostic.durationSec);
  const [timeLeft, setTimeLeft] = useState(mode === "diagnostic" ? durationSec : 120);
  const showFeedback = mode === "play" && config.play.showFeedbackDuringGame;

  useEffect(() => {
    if (mode !== "diagnostic") return;
    const t = window.setInterval(() => {
      setTimeLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [mode]);

  useEffect(() => {
    if (mode === "diagnostic" && timeLeft === 0) {
      onComplete({ score, roundsCompleted: round, catchErrors, semanticErrors });
    }
  }, [timeLeft, mode, score, round, catchErrors, semanticErrors, onComplete]);

  const pick = useCallback(
    (label: string) => {
      onEvent("mini_round_tap", { blockId, label, round, mode, miniGameId: config.miniGameId });
      const ok = label === spec.correctTarget;
      if (!ok) {
        setCatchErrors((e) => e + 1);
        onEvent("mini_catch_error", { blockId, label, round });
        if (spec.semanticTrap && label === spec.semanticTrap) {
          setSemanticErrors((e) => e + 1);
          onEvent("mini_semantic_error", { blockId, label, round });
        }
      }
      const nextScore = score + (ok && mode === "play" ? 10 : ok ? 0 : 0);
      if (mode === "play" && ok) setScore((s) => s + 10);
      const next = round + 1;
      setRound(next);
      if (next >= config.rounds && mode === "play") {
        onComplete({
          score: nextScore,
          roundsCompleted: next,
          catchErrors: catchErrors + (ok ? 0 : 1),
          semanticErrors,
        });
      }
      if (mode === "diagnostic" && durationSec <= 3 && next >= 2) {
        onComplete({
          score,
          roundsCompleted: next,
          catchErrors: catchErrors + (ok ? 0 : 1),
          semanticErrors,
        });
      }
      return ok;
    },
    [
      blockId,
      catchErrors,
      config.miniGameId,
      config.rounds,
      durationSec,
      mode,
      onComplete,
      onEvent,
      round,
      score,
      semanticErrors,
      spec.correctTarget,
      spec.semanticTrap,
    ],
  );

  return {
    round,
    score,
    catchErrors,
    semanticErrors,
    timeLeft,
    showFeedback,
    pick,
    totalRounds: config.rounds,
    durationSec,
  };
}
