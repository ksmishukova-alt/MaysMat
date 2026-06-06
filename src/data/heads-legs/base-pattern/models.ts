import type { HeadsLegsRuleInstance } from "@/data/method-rules/types";

/** Профиль снятия опоры для первого паттерна «Головы и ноги» */
export type HeadsLegsProgressionProfile = 1 | 2 | 3 | 4;

export interface BasePatternPilotMeta {
  progressionProfile: HeadsLegsProgressionProfile;
  ruleInstance: HeadsLegsRuleInstance;
}

/** Pilot 1.1–1.7: ruleInstance + progressionProfile */
export const BASE_PATTERN_PILOT: Record<string, BasePatternPilotMeta> = {
  "1.1": {
    progressionProfile: 1,
    ruleInstance: {
      ruleId: "heads-legs-base",
      totalObjects: 30,
      totalFeature: 100,
      firstKind: "птицы",
      firstFeature: 2,
      secondKind: "звери",
      secondFeature: 4,
      featureName: "ног",
      assumeKind: "птицы",
      assumeKindPhrase: "птицы",
      objectsLabel: "животных",
      replacementStep: 2,
      sceneIntro: "В задаче есть звери и птицы.",
      featureLines: ["У птицы 2 ноги.", "У зверя 4 ноги."],
      showRuleScreen: true,
    },
  },
  "1.2": {
    progressionProfile: 2,
    ruleInstance: {
      ruleId: "heads-legs-base",
      totalObjects: 120,
      totalFeature: 162,
      firstKind: "змеи",
      firstFeature: 0,
      secondKind: "цыплята",
      secondFeature: 2,
      featureName: "ног",
      assumeKind: "змеи",
      assumeKindPhrase: "змеями",
      objectsLabel: "детёнышей",
      replacementStep: 2,
      sceneIntro: "В задаче есть цыплята и змеи.",
      featureLines: ["У змеи 0 ног.", "У цыплёнка 2 ноги."],
      showRuleScreen: true,
    },
  },
  "1.3": {
    progressionProfile: 2,
    ruleInstance: {
      ruleId: "heads-legs-base",
      totalObjects: 200,
      totalFeature: 500,
      firstKind: "гусята",
      firstFeature: 2,
      secondKind: "крокодильчики",
      secondFeature: 4,
      featureName: "ног",
      assumeKind: "гусята",
      assumeKindPhrase: "гусятами",
      objectsLabel: "детёнышей",
      replacementStep: 2,
      sceneIntro: "В задаче есть гусята и крокодильчики.",
      featureLines: ["У гусёнка 2 ноги.", "У крокодильчика 4 ноги."],
      showRuleScreen: true,
    },
  },
  "1.4": {
    progressionProfile: 3,
    ruleInstance: {
      ruleId: "heads-legs-base",
      totalObjects: 40,
      totalFeature: 270,
      firstKind: "жуки",
      firstFeature: 6,
      secondKind: "пауки",
      secondFeature: 8,
      featureName: "ног",
      assumeKind: "жуки",
      assumeKindPhrase: "жуками",
      objectsLabel: "существ",
      replacementStep: 2,
      sceneIntro: "В задаче есть жуки и пауки.",
      featureLines: ["У жука 6 ног.", "У паука 8 ног."],
      showRuleScreen: false,
    },
  },
  "1.5": {
    progressionProfile: 3,
    ruleInstance: {
      ruleId: "heads-legs-base",
      totalObjects: 70,
      totalFeature: 242,
      firstKind: "жуки",
      firstFeature: 3,
      secondKind: "пауки",
      secondFeature: 4,
      featureName: "правых ног",
      assumeKind: "жуки",
      assumeKindPhrase: "жуками",
      objectsLabel: "существ",
      replacementStep: 1,
      sceneIntro: "В задаче есть жуки и пауки — считаем правые ноги.",
      featureLines: ["У жука 3 правые ноги.", "У паука 4 правые ноги."],
      showRuleScreen: false,
    },
  },
  "1.6": {
    progressionProfile: 4,
    ruleInstance: {
      ruleId: "heads-legs-base",
      totalObjects: 35,
      totalFeature: 102,
      firstKind: "двухколёсные",
      firstFeature: 2,
      secondKind: "трёхколёсные",
      secondFeature: 3,
      featureName: "колёс",
      assumeKind: "двухколёсные",
      assumeKindPhrase: "двухколёсными",
      objectsLabel: "велосипедистов",
      replacementStep: 1,
      sceneIntro: "В задаче есть двух- и трёхколёсные велосипеды.",
      featureLines: ["У двухколёсного 2 колеса.", "У трёхколёсного 3 колеса."],
      showRuleScreen: false,
    },
  },
  "1.7": {
    progressionProfile: 4,
    ruleInstance: {
      ruleId: "heads-legs-base",
      totalObjects: 42,
      totalFeature: 88,
      firstKind: "двухколёсные",
      firstFeature: 2,
      secondKind: "трёхколёсные",
      secondFeature: 3,
      featureName: "колёс",
      assumeKind: "двухколёсные",
      assumeKindPhrase: "двухколёсными",
      objectsLabel: "велосипедов",
      replacementStep: 1,
      sceneIntro: "На парковке двух- и трёхколёсные велосипеды.",
      featureLines: ["У двухколёсного 2 колеса.", "У трёхколёсного 3 колеса."],
      showRuleScreen: false,
    },
  },
};

export const BASE_PATTERN_PILOT_METHOD_IDS = Object.keys(BASE_PATTERN_PILOT);

export function resolveBasePatternPilot(methodTaskId: string): BasePatternPilotMeta | undefined {
  return BASE_PATTERN_PILOT[methodTaskId];
}
