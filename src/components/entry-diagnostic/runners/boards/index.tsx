"use client";

import type { ComponentType } from "react";
import type { RunnerKind } from "@/data/entry-diagnostic/types";
import type { RunnerBoardProps } from "./types";
import {
  ReadingComprehensionBoard,
  StoryAddSubBoard,
  ColumnAddSubBoard,
  ColumnMultiplicationBoard,
  LongDivisionBoard,
  RemainderBoard,
} from "./boards-basic";
import {
  ExpressionOrderBoard,
  TextProblemPlanBoard,
  MotionModelBoard,
  GeometryGridBoard,
  FractionModelBoard,
  PercentModelBoard,
  LogicIfThenBoard,
  SystematicSearchBoard,
  PatternCycleBoard,
} from "./boards-advanced";

export const RUNNER_BOARD_REGISTRY: Record<RunnerKind, ComponentType<RunnerBoardProps>> = {
  reading_comprehension_visual: ReadingComprehensionBoard,
  story_add_sub_visual: StoryAddSubBoard,
  column_add_sub_visual: ColumnAddSubBoard,
  column_multiplication_visual: ColumnMultiplicationBoard,
  long_division_visual: LongDivisionBoard,
  remainder_interpretation_visual: RemainderBoard,
  expression_order_visual_with_embedded_calculation: ExpressionOrderBoard,
  text_problem_plan_visual: TextProblemPlanBoard,
  motion_model_visual: MotionModelBoard,
  geometry_grid_visual: GeometryGridBoard,
  fraction_model_visual: FractionModelBoard,
  percent_model_visual: PercentModelBoard,
  logic_if_then_visual: LogicIfThenBoard,
  systematic_search_visual: SystematicSearchBoard,
  pattern_cycle_visual: PatternCycleBoard,
};

export function InteractiveRunnerBoard(props: RunnerBoardProps) {
  const Board = RUNNER_BOARD_REGISTRY[props.runnerKind];
  return <Board {...props} />;
}
