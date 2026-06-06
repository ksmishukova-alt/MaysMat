import type { HeadsLegsRuleInstance, MethodRule, RemaindersRuleInstance } from "./types";
import type { RemaindersModel } from "@/data/dirichlet/remainders/types";

export type { MethodRule, RemaindersRuleInstance, HeadsLegsRuleInstance } from "./types";

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

export const headsLegsBaseRule: MethodRule = {
  id: "heads-legs-base",
  title: "Головы и ноги",
  childTitle: "Представим, что все одного вида",
  anchorPhrase: "Сначала представим самый простой случай: будто все объекты одного вида.",
  helpButtonLabel: "Запутался? Вспомни правило",
  fullRule: [
    "Найдём, сколько всего объектов.",
    "Представим, что все объекты одного вида.",
    "Посчитаем, сколько признаков получилось бы.",
    "Сравним с тем, что дано в условии.",
    "Найдём разницу.",
    "Поймём, на сколько один объект отличается от другого.",
    "Разделим разницу на шаг замены.",
    "Найдём количество объектов второго вида.",
    "Найдём количество объектов первого вида.",
    "Проверим, что спрашивали в задаче.",
  ],
};

export const METHOD_RULES: Record<string, MethodRule> = {
  "remainders-houses": remaindersHousesRule,
  "heads-legs-base": headsLegsBaseRule,
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

/** Блок «Почему домики идут от 0 до m−1?» для экрана правила */
export function buildWhyRemaindersRangeBlock(instance: RemaindersRuleInstance): string[] {
  const m = instance.modulus;
  const range = formatRemainderRange(instance.firstRemainder, instance.lastRemainder, m >= 20);
  return [
    `Почему домики идут от ${instance.firstRemainder} до ${instance.lastRemainder}?`,
    "",
    "Остаток всегда меньше числа, на которое делим.",
    "",
    `Если после деления осталось ${m}, можно собрать ещё одну полную группу по ${m}.`,
    "",
    "Тогда остаток станет 0.",
    "",
    `Поэтому при делении на ${m} возможны остатки только:`,
    range + ".",
  ];
}
/** Подставить m в fullRule для конкретного модуля */
export function localizeRuleLines(rule: MethodRule, modulus: number): string[] {
  return rule.fullRule.map((line) => line.replace(/\bm\b/g, String(modulus)));
}

function assumeFeature(instance: HeadsLegsRuleInstance): number {
  return instance.assumeKind === instance.firstKind
    ? instance.firstFeature
    : instance.secondFeature;
}

function otherKind(instance: HeadsLegsRuleInstance): string {
  return instance.assumeKind === instance.firstKind
    ? instance.secondKind
    : instance.firstKind;
}

/** Текст примера для экрана правила «Головы и ноги» */
export function buildHeadsLegsRuleExample(instance: HeadsLegsRuleInstance): string[] {
  const feat = assumeFeature(instance);
  const trial = instance.totalObjects * feat;
  const diff = instance.totalFeature - trial;
  const otherCount = diff / instance.replacementStep;
  const remainCount = instance.totalObjects - otherCount;
  const obj = instance.objectsLabel ?? "объектов";
  const assumePhrase = instance.assumeKindPhrase ?? instance.assumeKind;
  const featName = instance.featureName;
  const other = otherKind(instance);

  const lines: string[] = [];
  if (instance.sceneIntro) {
    lines.push(instance.sceneIntro, "");
  }
  if (instance.featureLines) {
    lines.push(instance.featureLines[0], instance.featureLines[1], "");
  }

  lines.push(
    `Сначала представим, что все ${instance.totalObjects} ${obj} — ${assumePhrase}.`,
    "",
    `Тогда ${featName} было бы:`,
    "",
    `${instance.totalObjects} × ${feat} = ${trial}`,
    "",
    `Но по условию ${featName} ${instance.totalFeature}.`,
    "",
  );

  if (diff > 0) {
    lines.push(
      `Значит, ${featName} не хватает:`,
      "",
      `${instance.totalFeature} − ${trial} = ${diff}`,
      "",
      `Каждая замена «${assumePhrase} → ${other}» добавляет ${instance.replacementStep} ${featName}.`,
      "",
      `Значит, ${other}:`,
      "",
      `${diff} ÷ ${instance.replacementStep} = ${otherCount}`,
    );
    if (remainCount > 0) {
      lines.push("", `А ${assumePhrase}:`, "", `${instance.totalObjects} − ${otherCount} = ${remainCount}`);
    }
  } else if (diff < 0) {
    const excess = -diff;
    lines.push(
      `Значит, ${featName} лишних:`,
      "",
      `${trial} − ${instance.totalFeature} = ${excess}`,
      "",
      `Один ${assumePhrase} добавляет ${instance.replacementStep} ${featName}.`,
      "",
      `${other}:`,
      "",
      `${excess} ÷ ${instance.replacementStep} = ${otherCount}`,
    );
  }

  return lines;
}

/** Вводный экран метода для профиля 1 */
export function headsLegsIntroTemplate(): string[] {
  return [
    "Метод «Представим, что все одного вида»",
    "В задаче бывают объекты двух видов — у каждого вида своё число ног, колёс или другого признака.",
    "Сначала представим самый простой случай: будто все объекты одного вида.",
    "Посчитаем, сколько признаков получилось бы, и сравним с условием — так найдём, сколько объектов каждого вида.",
  ];
}
