import { ALL_RUNNER_KINDS } from "@/data/entry-diagnostic/blocks/index";
import type { RunnerKind } from "@/data/entry-diagnostic/types";

/** Статический список — для QA без импорта React-компонентов */
const REGISTERED_RUNNER_KINDS: RunnerKind[] = [
  "reading_comprehension_visual",
  "story_add_sub_visual",
  "column_add_sub_visual",
  "column_multiplication_visual",
  "long_division_visual",
  "remainder_interpretation_visual",
  "expression_order_visual_with_embedded_calculation",
  "text_problem_plan_visual",
  "motion_model_visual",
  "geometry_grid_visual",
  "fraction_model_visual",
  "percent_model_visual",
  "logic_if_then_visual",
  "systematic_search_visual",
  "pattern_cycle_visual",
];

export function assertRunnerRegistryComplete(): void {
  for (const kind of ALL_RUNNER_KINDS) {
    if (!REGISTERED_RUNNER_KINDS.includes(kind)) {
      throw new Error(`Runner registry missing: ${kind}`);
    }
  }
  if (REGISTERED_RUNNER_KINDS.length !== ALL_RUNNER_KINDS.length) {
    throw new Error("Runner registry has extra entries");
  }
}
