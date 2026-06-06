import type { DirichletTaskMeta } from "@/data/dirichlet/types";
import { DIRICHLET_FLOW_PROFILES } from "@/data/dirichlet/flows";

import { UNLUCKY_SCREEN_SEQUENCE } from "./screen-sequence";
import type { UnluckyStep, UnluckyStepKind } from "./types";

const KIND_BY_STEP: Record<number, UnluckyStepKind> = {
  1: "intro_video",
  2: "read_condition",
  3: "guarantee_goal",
  4: "worst_case",
  5: "guarantee_plus_one",
  6: "explain_why_less_fails",
  7: "write_solution",
  8: "finish",
};

/** Строит цепочку экранов «Метод неудачника» — не через generic guided-steps */
export function buildUnluckySteps(meta: DirichletTaskMeta): UnluckyStep[] {
  if (!meta.unluckyModel) {
    throw new Error(`unluckyModel отсутствует для ${meta.id}`);
  }

  const sequence = meta.screenSequence?.length ? meta.screenSequence : UNLUCKY_SCREEN_SEQUENCE;
  const phaseCount = sequence.length;

  return sequence.map((spec, index) => {
    const kind =
      (spec.stepKind as UnluckyStepKind | undefined) ??
      KIND_BY_STEP[spec.screen] ??
      "read_condition";

    return {
      id: `${meta.id}-unlucky-${spec.screen}`,
      kind,
      title: spec.title,
      screenPhaseIndex: index + 1,
      screenPhaseCount: phaseCount,
    };
  });
}

/** Текст вводного экрана F3 */
export function unluckyIntroTemplate(): string[] {
  return [
    "Метод неудачника",
    ...DIRICHLET_FLOW_PROFILES.F3_UNLUCKY.intro,
    "Сначала представь самый неприятный расклад — где нужного результата ещё нет.",
    "Потом добавь ещё один предмет — и гарантия появится.",
  ];
}
