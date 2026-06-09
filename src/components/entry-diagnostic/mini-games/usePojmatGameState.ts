"use client";

import { useCallback, useEffect, useState } from "react";
import { POJMAT_ROUNDS } from "@/data/entry-diagnostic/mini-games/pojmat-rounds";
import { diagnosticMiniGameDurationSec } from "@/lib/entry-diagnostic/fast-mode";
import { miniGameErrorEventKind } from "@/lib/entry-diagnostic/error-telemetry";
import type { DiagnosticMiniGameProps } from "./types";
import type { MiniGameResult } from "./types";

export function usePojmatGameState({
  config,
  mode,
  blockId,
  onComplete,
  onEvent,
}: DiagnosticMiniGameProps) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [motorErrors, setMotorErrors] = useState(0);
  const [semanticErrors, setSemanticErrors] = useState(0);
  const [finished, setFinished] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const durationSec = diagnosticMiniGameDurationSec(config.diagnostic.durationSec);
  const [timeLeft, setTimeLeft] = useState(mode === "diagnostic" ? durationSec : 120);

  const totalRounds = config.rounds;

  const speedMultiplier =
    mode === "play" ? 1 + Math.min(consecutiveCorrect, 6) * 0.25 : 1;

  const finishNow = useCallback(
    (nextRound = roundIndex, nextMotor = motorErrors, nextSemantic = semanticErrors, nextScore = score) => {
      setFinished(true);
      onComplete({
        score: nextScore,
        roundsCompleted: nextRound,
        catchErrors: nextMotor,
        semanticErrors: nextSemantic,
        motorErrors: nextMotor,
      });
    },
    [motorErrors, onComplete, roundIndex, score, semanticErrors],
  );

  useEffect(() => {
    if (mode !== "diagnostic") return;
    const t = window.setInterval(() => {
      setTimeLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [mode]);

  useEffect(() => {
    if (mode === "diagnostic" && timeLeft === 0 && !finished) {
      finishNow();
    }
  }, [timeLeft, mode, finished, finishNow]);

  const pick = useCallback(
    (cardId: string, correctId: string, trapId?: string) => {
      if (finished) return false;
      onEvent("mini_round_tap", { blockId, label: cardId, round: roundIndex, mode, miniGameId: "pojmat" });

      const ok = cardId === correctId;
      let nextMotor = motorErrors;
      let nextSemantic = semanticErrors;

      if (!ok) {
        setConsecutiveCorrect(0);
        const kind = miniGameErrorEventKind(cardId, correctId, trapId);
        if (kind === "motor") {
          nextMotor += 1;
          onEvent("mini_motor_error", { blockId, label: cardId, round: roundIndex, errorKind: "motor" });
        } else {
          nextSemantic += 1;
          onEvent("mini_semantic_error", { blockId, label: cardId, round: roundIndex, errorKind: "semantic" });
        }
      } else {
        setConsecutiveCorrect((s) => s + 1);
      }

      let nextScore = score;
      if (mode === "play" && ok) nextScore += 10;

      const nextRound = roundIndex + 1;
      setMotorErrors(nextMotor);
      setSemanticErrors(nextSemantic);
      setScore(nextScore);
      setRoundIndex(nextRound);

      if (mode === "diagnostic") {
        if (durationSec <= 3 && nextRound >= 2) {
          finishNow(nextRound, nextMotor, nextSemantic, nextScore);
        }
      } else if (nextRound >= totalRounds) {
        setFinished(true);
      }

      return ok;
    },
    [
      blockId,
      durationSec,
      finishNow,
      finished,
      mode,
      motorErrors,
      onEvent,
      roundIndex,
      score,
      semanticErrors,
      totalRounds,
    ],
  );

  return {
    roundIndex,
    score,
    timeLeft,
    totalRounds,
    finished,
    speedMultiplier,
    pick,
    finishNow: () => finishNow(roundIndex, motorErrors, semanticErrors, score),
  };
}

export type { MiniGameResult };
