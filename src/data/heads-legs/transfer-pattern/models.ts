import type { HeadsLegsPilotMeta } from "../pilot/types";

/** Короткие задачи на перенос метода замены (без score-рамки) */
export const TRANSFER_PATTERN_PILOT: Record<string, HeadsLegsPilotMeta> = {
  "4.3": {
    patternKind: "base",
    flowMode: "transfer",
    progressionProfile: 4,
    ruleInstance: {
      ruleId: "heads-legs-base",
      totalObjects: 12,
      totalFeature: 25,
      firstKind: "по 2 открытки",
      firstFeature: 2,
      secondKind: "по 3 открытки",
      secondFeature: 3,
      featureName: "открыток",
      assumeKind: "по 2 открытки",
      assumeKindPhrase: "по 2 открытки",
      objectsLabel: "девочек",
      replacementStep: 1,
      sceneIntro: "12 девочек получили по 2 или 3 открытки.",
      featureLines: ["По 2 открытки.", "По 3 открытки."],
      showRuleScreen: false,
    },
  },
  "5.3": {
    patternKind: "base",
    flowMode: "transfer",
    progressionProfile: 4,
    ruleInstance: {
      ruleId: "heads-legs-base",
      totalObjects: 29,
      totalFeature: 352,
      firstKind: "Ранкоры",
      firstFeature: 8,
      secondKind: "Банты",
      secondFeature: 18,
      featureName: "зубов",
      assumeKind: "Ранкоры",
      assumeKindPhrase: "Ранкорами",
      objectsLabel: "существ",
      replacementStep: 10,
      sceneIntro: "В зверинце есть Банты и Ранкоры.",
      featureLines: ["У Ранкора 8 зубов.", "У Банта 18 зубов."],
      showRuleScreen: false,
    },
  },
};

export const TRANSFER_PATTERN_PILOT_METHOD_IDS = Object.keys(TRANSFER_PATTERN_PILOT);

export const TRANSFER_43_READ_HINT =
  "Это уже знакомый тип задачи: есть два варианта — по 2 открытки или по 3 открытки.\nПопробуй решить почти самостоятельно.";

export const TRANSFER_53_READ_HINT =
  "Прочитай задачу. Это знакомый тип: два вида существ и разное количество зубов у каждого.";

/** Подсказка шага word_solution — только формат записи, без чисел из условия */
export const TRANSFER_WORD_SOLUTION_HINT =
  "В каждый пропуск — полный пример: числа, знак действия и результат через «=» (образец: 12 × 2 = 24).";

export const TRANSFER_WORD_SOLUTION_TITLE = "Запиши решение с пропусками";
