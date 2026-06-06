import type { PlayerStep } from "@/lib/task-player-steps";
import type { HeadsLegsProgressionProfile } from "@/data/method-rules/types";

export type ValueChooseMethodAction =
  | "assume_all"
  | "trial_case"
  | "find_diff"
  | "divide_step"
  | "check_question";

export const VALUE_CHOOSE_METHOD_ACTIONS: ValueChooseMethodAction[] = [
  "assume_all",
  "trial_case",
  "find_diff",
  "divide_step",
  "check_question",
];

export const VALUE_CHOOSE_METHOD_LABELS: Record<ValueChooseMethodAction, string> = {
  assume_all: "А. Представить, что все объекты одного вида.",
  trial_case: "Б. Посчитать пробный случай.",
  find_diff: "В. Найти разницу с условием.",
  divide_step: "Г. Разделить на шаг замены.",
  check_question: "Д. Проверить, что спрашивали в задаче.",
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

export function findValueSubStepsForAction(
  steps: PlayerStep[],
  action: ValueChooseMethodAction,
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

export function shouldInjectQuestionCheck(
  profile: HeadsLegsProgressionProfile,
  patternKind: "base" | "value",
): boolean {
  return patternKind === "value" && profile <= 2;
}
