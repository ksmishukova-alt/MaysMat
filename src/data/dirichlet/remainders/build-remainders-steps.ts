import type { DirichletTaskMeta } from "@/data/dirichlet/types";
import { DIRICHLET_FLOW_PROFILES } from "@/data/dirichlet/flows";

import { REMAINDERS_SCREEN_SEQUENCE } from "./screen-sequence";
import type { RemaindersStep, RemaindersStepKind } from "./types";

const KIND_BY_STEP: Record<number, RemaindersStepKind> = {
  1: "intro_video",
  2: "read_condition",
  3: "find_modulus",
  4: "build_houses",
  5: "identify_objects",
  6: "find_collision",
  7: "explain_divisibility",
  8: "write_solution",
  9: "finish",
};

/** Строит цепочку экранов «Остатки как домики» */
export function buildRemaindersSteps(meta: DirichletTaskMeta): RemaindersStep[] {
  if (!meta.remaindersModel) {
    throw new Error(`remaindersModel отсутствует для ${meta.id}`);
  }

  const sequence = meta.screenSequence?.length ? meta.screenSequence : REMAINDERS_SCREEN_SEQUENCE;
  const phaseCount = sequence.length;

  return sequence.map((spec, index) => {
    const kind =
      (spec.stepKind as RemaindersStepKind | undefined) ??
      KIND_BY_STEP[spec.screen] ??
      "read_condition";

    return {
      id: `${meta.id}-remainders-${spec.screen}`,
      kind,
      title: spec.title,
      screenPhaseIndex: index + 1,
      screenPhaseCount: phaseCount,
    };
  });
}

/** Текст вводного экрана F4 */
export function remaindersIntroTemplate(): string[] {
  return [
    "Остатки как домики",
    "Когда мы делим числа на одно и то же число, у каждого числа появляется остаток.",
    "Остаток можно представить как домик.",
    "Если чисел больше, чем домиков-остатков, два числа обязательно попадут в один домик.",
    ...DIRICHLET_FLOW_PROFILES.F4_REMAINDERS.intro.slice(0, 1),
  ];
}
