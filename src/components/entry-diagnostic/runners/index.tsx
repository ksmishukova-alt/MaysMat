"use client";

import type { RunnerKind } from "@/data/entry-diagnostic/types";
import {
  DiagnosticRunnerCore,
  type DiagnosticRunnerProps,
} from "@/components/entry-diagnostic/runners/RunnerCore";

export { ReadingComprehensionRunner } from "./ReadingComprehensionRunner";

function makeRunner(kind: RunnerKind) {
  return function Runner(props: DiagnosticRunnerProps) {
    return (
      <div data-runner-component={kind}>
        <DiagnosticRunnerCore {...props} runnerKind={kind} />
      </div>
    );
  };
}

export const StoryAddSubRunner = makeRunner("story_add_sub_visual");
export const ColumnAddSubRunner = makeRunner("column_add_sub_visual");
export const ColumnMultiplicationRunner = makeRunner("column_multiplication_visual");
export const LongDivisionRunner = makeRunner("long_division_visual");
export const RemainderInterpretationRunner = makeRunner("remainder_interpretation_visual");
export const ExpressionOrderRunner = makeRunner(
  "expression_order_visual_with_embedded_calculation",
);
export const TextProblemPlanRunner = makeRunner("text_problem_plan_visual");
export const MotionModelRunner = makeRunner("motion_model_visual");
export const GeometryGridRunner = makeRunner("geometry_grid_visual");
export const FractionModelRunner = makeRunner("fraction_model_visual");
export const PercentModelRunner = makeRunner("percent_model_visual");
export const LogicIfThenRunner = makeRunner("logic_if_then_visual");
export const SystematicSearchRunner = makeRunner("systematic_search_visual");
export const PatternCycleRunner = makeRunner("pattern_cycle_visual");
