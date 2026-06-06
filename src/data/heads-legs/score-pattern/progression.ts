import type { PlayerStep } from "@/lib/task-player-steps";
import type { HeadsLegsProgressionProfile } from "@/data/method-rules/types";

export type ScoreChooseMethodAction =
  | "assume_all"
  | "trial_case"
  | "find_diff"
  | "divide_step"
  | "plus_minus_step"
  | "check_question";

export const SCORE_CHOOSE_METHOD_ACTIONS: ScoreChooseMethodAction[] = [
  "assume_all",
  "trial_case",
  "find_diff",
  "divide_step",
  "plus_minus_step",
  "check_question",
];

export const SCORE_CHOOSE_METHOD_LABELS: Record<ScoreChooseMethodAction, string> = {
  assume_all: "А. Представить, что все одного типа.",
  trial_case: "Б. Посчитать пробный случай.",
  find_diff: "В. Найти разницу с условием.",
  divide_step: "Г. Разделить на шаг замены.",
  plus_minus_step: "Д. Посчитать шаг замены с отрицательными баллами.",
  check_question: "Е. Проверить, что именно спрашивают.",
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

export function findScoreSubStepsForAction(
  steps: PlayerStep[],
  action: ScoreChooseMethodAction,
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
    case "plus_minus_step":
      return [];
    case "check_question":
      return steps.filter(isWordSolution);
    default:
      return [];
  }
}

/** Все pilot score-задачи получают шаг проверки вопроса (особенно 4.2) */
export function shouldInjectScoreQuestionCheck(
  profile: HeadsLegsProgressionProfile,
  patternKind: string,
): boolean {
  return patternKind === "score" && profile <= 3;
}

export function scoreHubActionsForMode(
  scoreMode: "ordinary" | "plus_minus" | "match_total",
): ScoreChooseMethodAction[] {
  if (scoreMode === "plus_minus") {
    return SCORE_CHOOSE_METHOD_ACTIONS;
  }
  return SCORE_CHOOSE_METHOD_ACTIONS.filter((a) => a !== "plus_minus_step");
}
