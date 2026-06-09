"use client";

import { PARKOMAT_ROUNDS } from "@/data/entry-diagnostic/mini-games/parkomat-rounds";
import { diagnosticMiniGameDurationSec } from "@/lib/entry-diagnostic/fast-mode";
import type { DiagnosticMiniGameProps } from "../types";
import { ParkomatGame } from "./ParkomatGame";

export function ParkomatMiniGame({
  config,
  mode,
  blockId,
  onComplete,
  onEvent,
}: DiagnosticMiniGameProps) {
  const durationSec =
    mode === "diagnostic" ? diagnosticMiniGameDurationSec(config.diagnostic.durationSec) : 120;

  return (
    <ParkomatGame
      mode={mode}
      rounds={PARKOMAT_ROUNDS}
      durationSec={durationSec}
      onTelemetry={(event) => {
        onEvent(event.type, { ...event, blockId, miniGameId: "parkomat" });
        if (!event.isCorrect) {
          onEvent("mini_semantic_error", {
            blockId,
            roundId: event.roundId,
            lexicalMarker: event.lexicalMarker,
            selectedGate: event.selectedGate,
            correctGate: event.correctGate,
          });
        }
      }}
      onComplete={(result) => {
        const semanticErrors = result.events.filter((e) => !e.isCorrect).length;
        onComplete({
          score: mode === "play" ? result.correct * 10 : 0,
          roundsCompleted: result.answered,
          catchErrors: 0,
          semanticErrors,
          motorErrors: 0,
        });
      }}
    />
  );
}

ParkomatMiniGame.displayName = "MiniGame_parkomat";
