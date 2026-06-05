import type { DirichletInferredModel, DirichletTaskMeta } from "../types";

export const RABBITS_STEP_TITLE = "Определим «зайцев»";
export const CELLS_STEP_TITLE = "Определим «клетки»";

/** Метка подшага в фазе «Зайцы и клетки» — по смыслу, не «Шаг 1 из 2» */
export function entitySubStepLabel(stepId: string): string | undefined {
  if (stepId.includes("-rabbits")) return "Зайцы";
  if (stepId.includes("-cells")) return "Клетки";
  return undefined;
}

/**
 * Подсказка без спойлера ответа — ребёнок находит объект в условии сам.
 */
export function rabbitsStepHint(
  _meta: DirichletTaskMeta,
  _model: DirichletInferredModel,
  hasIntro: boolean,
): string {
  if (hasIntro) {
    return "«Зайцы» — это то, что мы считаем и раскладываем. Найди в условии и выбери карточку.";
  }
  return "Посмотри на условие: кого или что здесь можно «раскладывать»? Выбери карточку с объектами из задачи.";
}

export function cellsStepHint(
  _meta: DirichletTaskMeta,
  _model: DirichletInferredModel,
  hasIntro: boolean,
): string {
  if (hasIntro) {
    return "«Клетки» — признаки, по которым объекты делятся на группы. Найди в условии и выбери карточку.";
  }
  return "По какому признаку можно разделить объекты на группы? Найди категории в условии и выбери карточку.";
}
