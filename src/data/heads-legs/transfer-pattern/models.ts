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
};

export const TRANSFER_PATTERN_PILOT_METHOD_IDS = Object.keys(TRANSFER_PATTERN_PILOT);

export const TRANSFER_43_READ_HINT =
  "Это уже знакомый тип задачи: есть два варианта — по 2 открытки или по 3 открытки.\nПопробуй решить почти самостоятельно.";
