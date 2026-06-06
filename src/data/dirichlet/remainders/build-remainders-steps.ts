import type { DirichletTaskMeta } from "@/data/dirichlet/types";

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
  9: "divisibility_example",
  10: "explain_divisibility",
  11: "write_solution",
  12: "finish",
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
export function remaindersIntroTemplate(modulus: number): string[] {
  return [
    "Куда поселятся числа?",
    `Когда мы делим число на ${modulus}, у него получается остаток.`,
    "Для каждого остатка сделаем отдельный домик.",
    `Число попадёт в тот домик, какой остаток у него получится при делении на ${modulus}.`,
  ];
}
