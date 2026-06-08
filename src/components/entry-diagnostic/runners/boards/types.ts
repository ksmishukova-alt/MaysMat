import type { DiagnosticTask, RunnerKind } from "@/data/entry-diagnostic/types";

export interface RunnerBoardProps {
  task: DiagnosticTask;
  runnerKind: RunnerKind;
  response: Record<string, unknown>;
  onPatch: (key: string, value: unknown) => void;
}
