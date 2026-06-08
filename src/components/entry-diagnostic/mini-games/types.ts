import type { MiniGameConfig, MiniGameMode } from "@/data/entry-diagnostic/types";

export interface MiniGameResult {
  score: number;
  roundsCompleted: number;
  catchErrors: number;
  semanticErrors: number;
  motorErrors: number;
}

export interface DiagnosticMiniGameProps {
  config: MiniGameConfig;
  mode: MiniGameMode;
  blockId: string;
  onComplete: (result: MiniGameResult) => void;
  onEvent: (eventType: string, payload: Record<string, unknown>) => void;
}
