import type { PlayerStep } from "@/lib/task-player-steps";
import type { HeadsLegsProgressionProfile } from "@/data/method-rules/types";

export type ProductionChooseMethodAction =
  | "assume_all"
  | "trial_case"
  | "find_diff"
  | "divide_step"
  | "check_question";

export const PRODUCTION_CHOOSE_METHOD_ACTIONS: ProductionChooseMethodAction[] = [
  "assume_all",
  "trial_case",
  "find_diff",
  "divide_step",
  "check_question",
];

export const PRODUCTION_CHOOSE_METHOD_LABELS: Record<ProductionChooseMethodAction, string> = {
  assume_all: "А. Представить, что все участники одного вида.",
  trial_case: "Б. Посчитать пробный случай.",
  find_diff: "В. Найти разницу с условием.",
  divide_step: "Г. Разделить на шаг замены.",
  check_question: "Д. Проверить, что именно спрашивают.",
};

function isAssumeOnly(step: PlayerStep): boolean {
  return step.type === "single_select" && step.id.includes("-assume");
}

function isCalc1(step: PlayerStep): boolean {
  return step.type === "worksheet_table" && step.id.includes("-calc-1");
}

function isCalc2(step: PlayerStep): boolean {
  return step.type === "worksheet_table" && step.id.includes("-calc-2");
}

function isCalc3(step: PlayerStep): boolean {
  return step.type === "worksheet_table" && step.id.includes("-calc-3");
}

function isWordSolution(step: PlayerStep): boolean {
  return step.type === "word_solution";
}

function isCustomDiag(step: PlayerStep): boolean {
  return step.id.includes("-diag-") || step.id.includes("-secondary-");
}

/** Фильтр шагов для profile 4 с multiple_answers — сохраняем диагностические экраны */
export function filterMultipleAnswersSteps(steps: PlayerStep[]): PlayerStep[] {
  return steps.filter(
    (s) => isWordSolution(s) || isCustomDiag(s) || (s.type === "auto_explanation" && s.id.includes("-preview")),
  );
}

export function findProductionSubStepsForAction(
  steps: PlayerStep[],
  action: ProductionChooseMethodAction,
): PlayerStep[] {
  switch (action) {
    case "assume_all":
      return steps.filter(isAssumeOnly);
    case "trial_case":
      return steps.filter(isCalc1);
    case "find_diff":
      return steps.filter(isCalc2);
    case "divide_step":
      return steps.filter(isCalc3);
    case "check_question":
      return steps.filter(isWordSolution);
    default:
      return [];
  }
}

export function shouldInjectProductionQuestionCheck(
  profile: HeadsLegsProgressionProfile,
): boolean {
  return profile <= 2;
}
