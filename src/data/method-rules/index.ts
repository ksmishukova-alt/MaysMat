import type {
  HeadsLegsMethodRuleInstance,
  MethodRule,
  RemaindersRuleInstance,
} from "./types";
import type { RemaindersModel } from "@/data/dirichlet/remainders/types";

export type {
  MethodRule,
  RemaindersRuleInstance,
  HeadsLegsRuleInstance,
  HeadsLegsValueRuleInstance,
  HeadsLegsProductionRuleInstance,
  HeadsLegsMethodRuleInstance,
  HeadsLegsValueAnswerTransform,
  HeadsLegsProductionAnswerTransform,
  HeadsLegsAnswerTransform,
  TaskCompletenessStatus,
} from "./types";

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

export const headsLegsValueBaseRule: MethodRule = {
  id: "heads-legs-value-base",
  title: "Головы и ноги",
  childTitle: "Представим, что все одного вида",
  anchorPhrase: "Сначала представим самый простой случай: будто все объекты одного вида.",
  helpButtonLabel: "Запутался? Вспомни правило",
  fullRule: [
    "Найдём, сколько всего объектов.",
    "Выберем простой вариант: будто все объекты одного вида.",
    "Посчитаем, сколько получилось бы всего.",
    "Сравним с тем, что дано в условии.",
    "Найдём разницу.",
    "Поймём, на сколько один объект второго вида отличается от первого.",
    "Разделим разницу на шаг замены.",
    "Найдём количество объектов второго вида.",
    "Найдём количество объектов первого вида.",
    "Проверим, что именно спрашивают в задаче.",
  ],
};

export const headsLegsProductionBaseRule: MethodRule = {
  id: "heads-legs-production-base",
  title: "Кто сколько сделал?",
  childTitle: "Представим, что все участники сделали одинаково",
  anchorPhrase: "Сначала представим, что все участники сделали одинаково.",
  helpButtonLabel: "Запутался? Вспомни правило",
  fullRule: [
    "Найдём, сколько всего участников.",
    "Узнаем, сколько всего они сделали / получили / собрали.",
    "Представим, что все были одного вида.",
    "Посчитаем, сколько получилось бы всего.",
    "Сравним с условием.",
    "Найдём разницу.",
    "Узнаем, на сколько один участник второго вида отличается от первого.",
    "Разделим разницу на шаг замены.",
    "Найдём количество участников второго вида.",
    "Найдём количество участников первого вида.",
    "Проверим, что именно спрашивают в задаче.",
  ],
};

export const METHOD_RULES: Record<string, MethodRule> = {
  "remainders-houses": remaindersHousesRule,
  "heads-legs-base": headsLegsBaseRule,
  "heads-legs-value-base": headsLegsValueBaseRule,
  "heads-legs-production-base": headsLegsProductionBaseRule,
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

function assumeFeature(instance: HeadsLegsMethodRuleInstance): number {
  if (instance.ruleId === "heads-legs-production-base") {
    return instance.assumeKind === instance.firstKind
      ? instance.firstResult
      : instance.secondResult;
  }
  return instance.assumeKind === instance.firstKind
    ? instance.firstFeature
    : instance.secondFeature;
}

function otherKind(instance: HeadsLegsMethodRuleInstance): string {
  return instance.assumeKind === instance.firstKind
    ? instance.secondKind
    : instance.firstKind;
}

function buildProductionRuleExample(instance: import("./types").HeadsLegsProductionRuleInstance): string[] {
  if (instance.totalParticipants == null) {
    return [
      instance.sceneIntro ?? "В задаче два вида участников.",
      "",
      ...(instance.featureLines ? [instance.featureLines[0], instance.featureLines[1], ""] : []),
      `Всего ${instance.totalResult} ${instance.resultName}.`,
      "",
      "Здесь нет числа «сколько всего участников» — ищем ответ перебором или дополнительным условием.",
      "",
      `В этой задаче нужно найти: ${instance.questionAsks}.`,
    ];
  }

  const feat = assumeFeature(instance);
  const trial = instance.totalParticipants * feat;
  const diff = instance.totalResult - trial;
  const otherCount = diff / instance.replacementStep;
  const remainCount = instance.totalParticipants - otherCount;
  const part = instance.participantsLabel ?? "участников";
  const assumePhrase = instance.assumeKindPhrase ?? instance.assumeKind;
  const other = otherKind(instance);
  const resultName = instance.resultName;

  const lines: string[] = [];
  if (instance.sceneIntro) {
    lines.push(instance.sceneIntro, "");
  }
  if (instance.featureLines) {
    lines.push(instance.featureLines[0], instance.featureLines[1], "");
  }

  lines.push(
    `В классе ${instance.totalParticipants} ${part}.`,
    "",
    `Представим, что все были ${assumePhrase}.`,
    "",
    `Каждый ${instance.assumeKind.slice(0, -1) || instance.assumeKind} — ${feat} ${resultName}.`,
    "",
    `Тогда всего ${resultName} было бы:`,
    "",
    `${instance.totalParticipants} × ${feat} = ${trial}`,
    "",
    `По условию ${resultName} ${instance.totalResult}.`,
    "",
  );

  if (diff > 0) {
    lines.push(
      `Не хватает:`,
      "",
      `${instance.totalResult} − ${trial} = ${diff}`,
      "",
      `Один ${other.slice(0, -1) || other} делает на ${instance.replacementStep} ${resultName} больше.`,
      "",
      `Значит, ${other}:`,
      "",
      `${diff} ÷ ${instance.replacementStep} = ${otherCount}`,
    );
    if (remainCount > 0) {
      lines.push("", `${instance.assumeKind}:`, "", `${instance.totalParticipants} − ${otherCount} = ${remainCount}`);
    }
  }

  lines.push("", `В этой задаче нужно найти: ${instance.questionAsks}.`);

  if (instance.answerTransform?.type === "compare_results") {
    lines.push(
      "",
      `После подсчёта участников сравни, кто ${instance.answerTransform.firstKind ?? "первый вид"} и кто ${instance.answerTransform.secondKind ?? "второй вид"} собрал больше ${instance.answerTransform.resultLabel ?? resultName}.`,
    );
  }

  return lines;
}

/** Текст примера для экрана правила «Головы и ноги» */
export function buildHeadsLegsRuleExample(instance: HeadsLegsMethodRuleInstance): string[] {
  if (instance.ruleId === "heads-legs-production-base") {
    return buildProductionRuleExample(instance);
  }

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

  if (instance.ruleId === "heads-legs-value-base") {
    lines.push("", `В этой задаче нужно найти: ${instance.questionAsks}.`);
    if (instance.answerTransform?.type === "multiply_found_objects") {
      lines.push(
        "",
        `После подсчёта ${instance.answerTransform.foundObjectLabel ?? "объектов"} умножь на ${instance.answerTransform.multiplier}, чтобы получить ${instance.answerTransform.resultLabel}.`,
      );
    }
  }

  return lines;
}

/** Вводный экран метода для паттерна 1 (профиль 1) */
export function headsLegsIntroTemplate(): string[] {
  return [
    "Метод «Представим, что все одного вида»",
    "В задаче бывают объекты двух видов — у каждого вида своё число ног, колёс или другого признака.",
    "Сначала представим самый простой случай: будто все объекты одного вида.",
    "Посчитаем, сколько признаков получилось бы, и сравним с условием — так найдём, сколько объектов каждого вида.",
  ];
}

/** Вводный экран для паттерна 2 «Цена / количество / расход» */
export function headsLegsValueIntroTemplate(): string[] {
  return [
    "Тот же метод — другие величины",
    "Раньше мы считали ноги и колёса. Тот же приём работает с карандашами, рублями, котлетами, сосисками и цветами.",
    "Сначала представим самый простой случай: будто все объекты одного вида.",
    "Посчитаем общий расход, сравним с условием — и не забудем проверить, что именно спрашивают в задаче.",
  ];
}

/** Вводный экран для паттерна 3 «Кто сколько сделал» */
export function headsLegsProductionIntroTemplate(): string[] {
  return [
    "Тот же метод — другой сюжет",
    "Раньше мы считали ноги, колёса, карандаши и деньги. Тот же приём работает с задачами, конфетами, снежинками и яблоками.",
    "Сначала представим, что все участники сделали одинаково.",
    "Посчитаем общий результат, сравним с условием — и проверим, что именно спрашивают в задаче.",
  ];
}
