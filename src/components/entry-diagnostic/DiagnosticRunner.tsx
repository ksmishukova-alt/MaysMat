"use client";

import { getRunnerComponent } from "@/lib/entry-diagnostic/runner-registry";
import type { DiagnosticRunnerProps } from "@/components/entry-diagnostic/runners/RunnerCore";

export type { RunnerSubmitMeta } from "@/components/entry-diagnostic/runners/RunnerCore";
export { RUNNER_LABELS } from "@/components/entry-diagnostic/runners/RunnerCore";

export function DiagnosticRunner(props: DiagnosticRunnerProps) {
  const Component = getRunnerComponent(props.runnerKind);
  return <Component {...props} />;
}
