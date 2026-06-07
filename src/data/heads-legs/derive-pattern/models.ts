import type { HeadsLegsDeriveRuleInstance } from "@/data/method-rules/types";
import type { HeadsLegsPilotMeta } from "../pilot/types";

/** Pilot паттерна 5: prelude → стандартная замена */
export const DERIVE_PATTERN_PILOT: Record<string, HeadsLegsPilotMeta> = {
  "5.3": {
    patternKind: "derive",
    flowMode: "derive",
    progressionProfile: 2,
    ruleInstance: {
      ruleId: "heads-legs-derive-base",
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
      questionAsks: "сколько Ранкоров и сколько Бант",
      preludeQuestion: "Что сначала нужно получить?",
      preludeChoices: [
        {
          id: "totals",
          label: "Сколько всего существ и сколько зубов",
          correct: true,
        },
        {
          id: "one",
          label: "Сколько зубов у одного Ранкора",
          correct: false,
        },
        {
          id: "diff",
          label: "На сколько зубов отличаются Банты и Ранкоры",
          correct: false,
        },
      ],
      sceneIntro: "В зверинце есть Банты и Ранкоры.",
      featureLines: ["У Ранкора 8 зубов.", "У Банта 18 зубов."],
      showRuleScreen: false,
    } satisfies HeadsLegsDeriveRuleInstance,
  },
};

export const DERIVE_PATTERN_PILOT_METHOD_IDS = Object.keys(DERIVE_PATTERN_PILOT);

export const DERIVE_53_READ_HINT =
  "Иногда сначала нужно собрать все данные из условия.\nПотом — знакомая замена: представим, что все одного вида.";

export const DERIVE_TRANSITION_TEMPLATE = [
  "Теперь решаем знакомым методом замены.",
  "",
  "Представим, что все существа одного вида — и посчитаем зубы.",
];
