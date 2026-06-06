import type { MethodRule, RemaindersRuleInstance } from "./types";
import type { RemaindersModel } from "@/data/dirichlet/remainders/types";

export type { MethodRule, RemaindersRuleInstance } from "./types";

export const remaindersHousesRule: MethodRule = {
  id: "remainders-houses",
  title: "Остатки как домики",
  childTitle: "Куда поселятся числа?",
  anchorPhrase: "Остаток всегда меньше числа, на которое делим.",
  helpButtonLabel: "Запутался? Вспомни правило",
  fullRule: [
    "Когда мы делим число на m, у него появляется остаток.",
    "Остаток всегда меньше числа, на которое делим.",
    "Значит, при делении на m возможны остатки от 0 до m − 1.",
    "Почему нет остатка m? Если осталось m, можно собрать ещё одну полную группу по m. Тогда остаток станет 0.",
    "Каждый возможный остаток — это домик.",
    "Число попадает в тот домик, какой у него остаток.",
    "Если чисел больше, чем домиков, два числа обязательно попадут в один домик.",
    "Если два числа попали в один домик, значит, у них одинаковый остаток.",
    "Если у двух чисел одинаковый остаток при делении на m, то их разность делится на m.",
  ],
};

export const METHOD_RULES: Record<string, MethodRule> = {
  "remainders-houses": remaindersHousesRule,
};

export function getMethodRule(ruleId: string): MethodRule | undefined {
  return METHOD_RULES[ruleId];
}

/** Собрать ruleInstance из модели остатков */
export function buildRemaindersRuleInstance(
  model: RemaindersModel,
  options?: { showRuleScreen?: boolean },
): RemaindersRuleInstance {
  return {
    ruleId: "remainders-houses",
    modulus: model.modulus,
    firstRemainder: 0,
    lastRemainder: model.modulus - 1,
    housesCount: model.housesCount,
    objectsCount: model.objectsCount,
    objectsLabel: model.objectsLabel,
    showRuleScreen: options?.showRuleScreen ?? false,
  };
}

/** Форматировать диапазон остатков для UI */
export function formatRemainderRange(first: number, last: number, compact = false): string {
  if (last - first <= 12 && !compact) {
    return Array.from({ length: last - first + 1 }, (_, i) => first + i).join(", ");
  }
  return `${first}, ${first + 1}, ${first + 2}, …, ${last}`;
}

/** Текст примера для экрана правила с числами задачи */
export function buildRemaindersRuleExample(instance: RemaindersRuleInstance): string[] {
  const m = instance.modulus;
  const range = formatRemainderRange(instance.firstRemainder, instance.lastRemainder, m >= 20);
  return [
    `Делим на ${m}.`,
    "",
    "Остаток всегда меньше числа, на которое делим.",
    "",
    `Значит, возможны остатки: ${range}.`,
    "",
    `Остатка ${m} нет.`,
    "",
    "Почему?",
    "",
    `Если осталось ${m}, можно собрать ещё одну полную группу по ${m}. Тогда остаток станет 0.`,
    "",
    `Значит, у нас ${instance.housesCount} домиков для остатков.`,
    `А ${instance.objectsLabel}: ${instance.objectsCount}.`,
  ];
}

/** Подставить m в fullRule для конкретного модуля */
export function localizeRuleLines(rule: MethodRule, modulus: number): string[] {
  return rule.fullRule.map((line) => line.replace(/\bm\b/g, String(modulus)));
}
