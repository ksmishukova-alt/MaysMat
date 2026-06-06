import type { DirichletTaskMeta } from "@/data/dirichlet/types";
import { DIRICHLET_FLOW_PROFILES } from "@/data/dirichlet/flows";

import { REMAINDERS_SCREEN_SEQUENCE } from "./screen-sequence";
import type { RemaindersStep, RemaindersStepKind } from "./types";

const KIND_BY_STEP: Record<number, RemaindersStepKind> = {
  1: "intro_video",
  2: "method_rule",
  3: "read_condition",
  4: "find_modulus",
  5: "build_houses",
  6: "houses_count_quiz",
  7: "identify_objects",
  8: "find_collision",
  9: "explain_divisibility",
  10: "write_solution",
  11: "finish",
};

function filterSequence(meta: DirichletTaskMeta) {
  const raw = meta.screenSequence?.length ? meta.screenSequence : REMAINDERS_SCREEN_SEQUENCE;
  const showRule = meta.remaindersModel?.ruleInstance?.showRuleScreen ?? false;

  return raw.filter((spec) => {
    if (spec.stepKind === "method_rule") return showRule;
    return true;
  });
}

/** Строит цепочку экранов «Остатки как домики» */
export function buildRemaindersSteps(meta: DirichletTaskMeta): RemaindersStep[] {
  if (!meta.remaindersModel) {
    throw new Error(`remaindersModel отсутствует для ${meta.id}`);
  }

  const sequence = filterSequence(meta);
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
    "Если чисел больше, чем домиков для остатков, два числа обязательно попадут в один домик.",
    ...DIRICHLET_FLOW_PROFILES.F4_REMAINDERS.intro.slice(0, 1),
  ];
}
