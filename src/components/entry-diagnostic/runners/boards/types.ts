import type { DiagnosticTask, RunnerKind } from "@/data/entry-diagnostic/types";
import type { ErrorTelemetryBuckets } from "@/lib/entry-diagnostic/error-telemetry";

export interface RunnerBoardProps {
  task: DiagnosticTask;
  runnerKind: RunnerKind;
  response: Record<string, unknown>;
  onPatch: (key: string, value: unknown) => void;
  onRecordError: (bucket: keyof ErrorTelemetryBuckets, code: string) => void;
}
