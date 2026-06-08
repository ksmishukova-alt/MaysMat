import type { ComponentType } from "react";
import type { RunnerKind } from "@/data/entry-diagnostic/types";
import { ALL_RUNNER_KINDS } from "@/data/entry-diagnostic/blocks/index";
import type { DiagnosticRunnerProps } from "@/components/entry-diagnostic/runners/RunnerCore";
import {
  ReadingComprehensionRunner,
  StoryAddSubRunner,
  ColumnAddSubRunner,
  ColumnMultiplicationRunner,
  LongDivisionRunner,
  RemainderInterpretationRunner,
  ExpressionOrderRunner,
  TextProblemPlanRunner,
  MotionModelRunner,
  GeometryGridRunner,
  FractionModelRunner,
  PercentModelRunner,
  LogicIfThenRunner,
  SystematicSearchRunner,
  PatternCycleRunner,
} from "@/components/entry-diagnostic/runners/index";

export type DiagnosticRunnerComponent = ComponentType<DiagnosticRunnerProps>;

export const RUNNER_REGISTRY: Record<RunnerKind, DiagnosticRunnerComponent> = {
  reading_comprehension_visual: ReadingComprehensionRunner,
  story_add_sub_visual: StoryAddSubRunner,
  column_add_sub_visual: ColumnAddSubRunner,
  column_multiplication_visual: ColumnMultiplicationRunner,
  long_division_visual: LongDivisionRunner,
  remainder_interpretation_visual: RemainderInterpretationRunner,
  expression_order_visual_with_embedded_calculation: ExpressionOrderRunner,
  text_problem_plan_visual: TextProblemPlanRunner,
  motion_model_visual: MotionModelRunner,
  geometry_grid_visual: GeometryGridRunner,
  fraction_model_visual: FractionModelRunner,
  percent_model_visual: PercentModelRunner,
  logic_if_then_visual: LogicIfThenRunner,
  systematic_search_visual: SystematicSearchRunner,
  pattern_cycle_visual: PatternCycleRunner,
};

export function getRunnerComponent(kind: RunnerKind): DiagnosticRunnerComponent {
  return RUNNER_REGISTRY[kind];
}

export function assertRunnerRegistryComplete(): void {
  for (const kind of ALL_RUNNER_KINDS) {
    if (!RUNNER_REGISTRY[kind]) {
      throw new Error(`Runner registry missing: ${kind}`);
    }
  }
  if (Object.keys(RUNNER_REGISTRY).length !== ALL_RUNNER_KINDS.length) {
    throw new Error("Runner registry has extra entries");
  }
}
