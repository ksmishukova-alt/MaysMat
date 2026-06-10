import type { ParkomatGate } from "@/data/entry-diagnostic/mini-games/parkomat-rounds";

export type ParkomatMode = "diagnostic" | "play";

export type ParkomatPhase =
  | "reading"
  | "drivingStraight"
  | "choiceMade"
  | "gateOpening"
  | "turning"
  | "successPass"
  | "failHit";

export type GateState = "closed" | "opening" | "open";

export type ParkomatTelemetryEvent = {
  type: "parkomat_round_answered";
  roundId: string;
  mode: ParkomatMode;
  selectedGate: ParkomatGate;
  correctGate: ParkomatGate;
  isCorrect: boolean;
  reactionTimeMs: number;
  lexicalMarker: string;
  roundType: string;
  semanticError: boolean;
  operationDirectionError: boolean;
  timestamp: number;
};
