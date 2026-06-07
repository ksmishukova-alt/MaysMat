import type { HeadsLegsPilotMeta } from "../pilot/types";

/**
 * Pilot паттерна 5: prelude → стандартная замена.
 * 5.3 — transfer (отдельный registry). Wave B: methodist-only derive smoke.
 */
export const DERIVE_PATTERN_PILOT: Record<string, HeadsLegsPilotMeta> = {
  "5.6": {
    patternKind: "derive",
    flowMode: "derive",
    progressionProfile: 2,
    ruleInstance: {
      ruleId: "heads-legs-derive-base",
      totalObjects: 17,
      totalFeature: 32,
      firstKind: "мечи Джедаев",
      firstFeature: 1,
      secondKind: "мечи Ситхов",
      secondFeature: 2,
      featureName: "кристаллов",
      assumeKind: "мечами Джедаев",
      assumeKindPhrase: "мечами Джедаев",
      objectsLabel: "мечей",
      replacementStep: 1,
      questionAsks: "сколько мечей Джедаев изготовил мастер",
      preludeQuestion:
        "Что нужно узнать из условия, прежде чем считать замену по кристаллам?",
      preludeChoices: [
        {
          id: "total-swords",
          label: "Сколько всего мечей (из 17 рукоятей)",
          correct: true,
        },
        {
          id: "per-type",
          label: "Сколько кристаллов у каждого вида",
          correct: false,
        },
        {
          id: "handles-left",
          label: "Сколько рукоятей осталось",
          correct: false,
        },
      ],
      preludeDerivePrompt:
        "На каждый меч нужна одна рукоять. Мастер использовал 17 рукоятей. Сколько всего мечей?",
      preludeDeriveAnswer: 17,
      preludeFeatureNorms: {
        columnLabel: "Кристаллов",
        stepHint:
          "Укажи, сколько кристаллов требуется для каждого вида меча по условию.",
        rows: [
          { id: "f1", label: "Меч Джедая", emoji: "⚔️", answer: 1 },
          { id: "f2", label: "Меч Ситха", emoji: "🗡️", answer: 2 },
        ],
      },
      sceneIntro: "Мастер делает мечи Джедаев и Ситхов.",
      featureLines: [
        "Для меча Джедая — 1 кристалл.",
        "Для двойного меча Ситха — 2 кристалла.",
      ],
      showRuleScreen: false,
    },
  },
};

export const DERIVE_PATTERN_PILOT_METHOD_IDS = Object.keys(DERIVE_PATTERN_PILOT);

export const DERIVE_TRANSITION_TEMPLATE = [
  "Теперь решаем знакомым методом замены.",
  "",
  "Представим, что все объекты одного вида — и посчитаем.",
];
