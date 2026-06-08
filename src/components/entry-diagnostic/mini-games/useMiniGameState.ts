"use client";

import { useCallback, useEffect, useState } from "react";
import type { MiniGameConfig, MiniGameMode } from "@/data/entry-diagnostic/types";
import type { MiniGameSpec } from "@/data/entry-diagnostic/mini-games/specs";
import { diagnosticMiniGameDurationSec } from "@/lib/entry-diagnostic/fast-mode";
import { miniGameErrorEventKind } from "@/lib/entry-diagnostic/error-telemetry";
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
  const [motorErrors, setMotorErrors] = useState(0);
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

  const finish = useCallback(
    (nextRound: number, nextMotor: number, nextSemantic: number, nextScore: number) => {
      onComplete({
        score: nextScore,
        roundsCompleted: nextRound,
        catchErrors: nextMotor,
        semanticErrors: nextSemantic,
        motorErrors: nextMotor,
      });
    },
    [onComplete],
  );

  useEffect(() => {
    if (mode === "diagnostic" && timeLeft === 0) {
      finish(round, motorErrors, semanticErrors, score);
    }
  }, [timeLeft, mode, score, round, motorErrors, semanticErrors, finish]);

  const pick = useCallback(
    (label: string) => {
      onEvent("mini_round_tap", { blockId, label, round, mode, miniGameId: config.miniGameId });
      const ok = label === spec.correctTarget;
      let nextMotor = motorErrors;
      let nextSemantic = semanticErrors;

      if (!ok) {
        const kind = miniGameErrorEventKind(label, spec.correctTarget, spec.semanticTrap);
        if (kind === "motor") {
          nextMotor += 1;
          onEvent("mini_motor_error", { blockId, label, round, errorKind: "motor" });
        } else {
          nextSemantic += 1;
          onEvent("mini_semantic_error", { blockId, label, round, errorKind: "semantic" });
        }
      }

      let nextScore = score;
      if (mode === "play" && ok) nextScore += 10;

      const next = round + 1;
      setMotorErrors(nextMotor);
      setSemanticErrors(nextSemantic);
      setScore(nextScore);
      setRound(next);

      if (next >= config.rounds && mode === "play") {
        finish(next, nextMotor, nextSemantic, nextScore);
      }
      if (mode === "diagnostic" && durationSec <= 3 && next >= 2) {
        finish(next, nextMotor, nextSemantic, nextScore);
      }
      return ok;
    },
    [
      blockId,
      config.miniGameId,
      config.rounds,
      durationSec,
      finish,
      mode,
      motorErrors,
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
    motorErrors,
    semanticErrors,
    timeLeft,
    showFeedback,
    pick,
    totalRounds: config.rounds,
    durationSec,
  };
}
