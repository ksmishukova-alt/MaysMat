import type { ScreenStep } from "@/data/entry-diagnostic/types";

const READING_ONLY_STEP_KINDS = new Set<ScreenStep["kind"]>(["condition_read", "read_prompt"]);

/** Шаг «только прочитай условие» — не показываем отдельным экраном. */
export function isReadingOnlyStep(step: ScreenStep): boolean {
  return READING_ONLY_STEP_KINDS.has(step.kind);
}

/** Убирает экраны «Прочитал»; условие остаётся в шапке задания. */
export function withoutReadingOnlySteps(steps: ScreenStep[]): ScreenStep[] {
  return steps.filter((s) => !isReadingOnlyStep(s));
}
