import type { PlayerStep } from "@/lib/task-player-steps";
import type { HeadsLegsProgressionProfile } from "./models";

export type ChooseMethodAction = "assume_all" | "find_diff" | "divide_step" | "write_answer";

export const CHOOSE_METHOD_ACTIONS: ChooseMethodAction[] = [
  "assume_all",
  "find_diff",
  "divide_step",
  "write_answer",
];

export const CHOOSE_METHOD_LABELS: Record<ChooseMethodAction, string> = {
  assume_all: "А. Представить, что все одного вида.",
  find_diff: "Б. Найти разницу с условием.",
  divide_step: "В. Разделить на шаг замены.",
  write_answer: "Г. Записать ответ.",
};

export function shouldShowRuleScreen(profile: HeadsLegsProgressionProfile): boolean {
  return profile <= 2;
}

export function isCompactRuleScreen(profile: HeadsLegsProgressionProfile): boolean {
  return profile === 2;
}

function isAssumeOrCalc1(step: PlayerStep): boolean {
  if (step.type === "single_select" && step.id.includes("-assume")) return true;
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

function isPreview(step: PlayerStep): boolean {
  return step.type === "auto_explanation" && step.id.includes("-preview");
}

function isSetupStep(step: PlayerStep): boolean {
  if (step.type === "read_condition") return true;
  if (step.type === "drag_select") return true;
  if (step.type === "table_input" && step.id.includes("-features")) return true;
  if (step.type === "worksheet_table" && step.id.includes("-totals")) return true;
  return false;
}

/** Отфильтровать шаги контента по progressionProfile */
export function filterContentStepsByProfile(
  steps: PlayerStep[],
  profile: HeadsLegsProgressionProfile,
): PlayerStep[] {
  if (profile <= 2) return steps;

  if (profile === 4) {
    return steps.filter((s) => isWordSolution(s) || isPreview(s));
  }

  // Профиль 3: подготовка + word + preview; assume/calc идут через choose_method
  return steps.filter(
    (s) =>
      isSetupStep(s) ||
      isWordSolution(s) ||
      isPreview(s) ||
      (!isAssumeOrCalc1(s) && !isCalc2(s) && !isCalc3(s)),
  );
}

export function findSubStepsForAction(
  steps: PlayerStep[],
  action: ChooseMethodAction,
): PlayerStep[] {
  switch (action) {
    case "assume_all":
      return steps.filter(isAssumeOrCalc1);
    case "find_diff":
      return steps.filter(isCalc2);
    case "divide_step":
      return steps.filter(isCalc3);
    case "write_answer":
      return steps.filter(isWordSolution);
    default:
      return [];
  }
}
