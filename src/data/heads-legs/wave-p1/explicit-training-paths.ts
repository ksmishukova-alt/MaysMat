import type { HeadsLegsTaskMeta } from "../types";
import type { HeadsLegsEntity } from "../types";

/** Wave P1: childRoute 1.x–3.x — explicit training path (не dual-path). */
export const WAVE_P1_EXPLICIT_TRAINING_METHOD_IDS = new Set([
  "1.1",
  "1.3",
  "2.1",
  "2.2",
  "2.3",
  "3.3",
  "3.4",
]);

export function hasExplicitTrainingPath(methodTaskId: string): boolean {
  return WAVE_P1_EXPLICIT_TRAINING_METHOD_IDS.has(methodTaskId);
}

function featurePair(meta: HeadsLegsTaskMeta): [number, number] {
  const ri = meta.ruleInstance;
  if (!ri) return [0, 0];
  if ("firstFeature" in ri && "secondFeature" in ri) {
    return [ri.firstFeature, ri.secondFeature];
  }
  if ("firstResult" in ri && "secondResult" in ri) {
    return [ri.firstResult, ri.secondResult];
  }
  return [0, 0];
}

export interface ExplicitTrainingAssumeCopy {
  context: string;
  selectPrompt: string;
  alternativeWrongFeedback: string;
}

/** Тексты assume для honest explicit training path. */
export function buildExplicitTrainingAssumeCopy(
  meta: HeadsLegsTaskMeta,
  entities: HeadsLegsEntity[],
  totalHint: string,
  trainedEntityIndex: 0 | 1,
): ExplicitTrainingAssumeCopy {
  const trainedLabel = entities[trainedEntityIndex]?.label ?? "вид 1";
  const [f0, f1] = featurePair(meta);
  const trainedFeature = trainedEntityIndex === 0 ? f0 : f1;
  const otherFeature = trainedEntityIndex === 0 ? f1 : f0;
  const throughLower = trainedFeature <= otherFeature;

  const context =
    "Сейчас потренируем один путь решения. Второй путь тоже возможен, но его пока не разбираем.";

  const pathIntro = throughLower
    ? "Сейчас потренируем путь через меньшее число."
    : "Сейчас потренируем путь через большее число.";

  const pathTail = throughLower
    ? "Потом посмотрим, сколько не хватает."
    : "Потом посмотрим, сколько получилось лишним.";

  const selectPrompt = `${pathIntro} Начнём так, будто${totalHint} — ${trainedLabel}. ${pathTail} Выбери этот вид:`;

  const alternativeWrongFeedback = `Так тоже можно решить, но сейчас мы тренируем путь через ${trainedLabel}. Выбери этот вариант.`;

  return { context, selectPrompt, alternativeWrongFeedback };
}
