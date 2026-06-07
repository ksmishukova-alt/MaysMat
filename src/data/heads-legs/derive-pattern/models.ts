import type { HeadsLegsPilotMeta } from "../pilot/types";

/**
 * Pilot паттерна 5: prelude → стандартная замена.
 * 5.3 — transfer (отдельный registry). Wave B: methodist-only derive smoke.
 */
export const DERIVE_PATTERN_PILOT: Record<string, HeadsLegsPilotMeta> = {
  "5.2": {
    patternKind: "derive",
    flowMode: "derive",
    progressionProfile: 2,
    ruleInstance: {
      ruleId: "heads-legs-derive-base",
      totalObjects: 44,
      totalFeature: 108,
      firstKind: "Джавы",
      firstFeature: 2,
      secondKind: "Банты",
      secondFeature: 4,
      featureName: "ног",
      assumeKind: "Джавам",
      assumeKindPhrase: "Джавам",
      objectsLabel: "голов в караване",
      replacementStep: 2,
      questionAsks: "сколько Джав едет на Бантах",
      preludeQuestion:
        "Что нужно сделать с «54 парами ног» перед заменой по ногам?",
      preludeChoices: [
        {
          id: "convert",
          label: "Перевести пары ног в общее число ног (54 × 2)",
          correct: true,
        },
        {
          id: "as-heads",
          label: "Считать 54 как число голов",
          correct: false,
        },
        {
          id: "skip",
          label: "Ничего — 54 уже и есть число ног",
          correct: false,
        },
      ],
      preludeDeriveTarget: "feature",
      preludeDerivePrompt:
        "В условии сказано «54 пары ног». Сколько это ног, если в одной паре 2 ноги?",
      preludeDeriveAnswer: 108,
      preludeDeriveWrongHint: "Переведи пары в ноги: 54 × 2.",
      preludeFeatureNorms: {
        columnLabel: "Ног",
        rowLabel: "Участник",
        stepHint: "Укажи, сколько ног у каждого вида по условию.",
        rows: [
          { id: "f1", label: "Банты", emoji: "🐫", answer: 4 },
          { id: "f2", label: "Джавы", emoji: "👤", answer: 2 },
        ],
      },
      sceneIntro: "Караван Бантов; на части из них сидят Джавы.",
      featureLines: ["У Банта 4 ноги.", "У \u0414\u0436\u0430\u0432\u0430 \u043d\u0430 \u0411\u0430\u043d\u0442\u0435 \u2014 2 \u043d\u043e\u0433\u0438."],
      showRuleScreen: false,
    },
  },
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
      preludeDeriveTarget: "objects",
      preludeDerivePrompt:
        "На каждый меч нужна одна рукоять. Мастер использовал 17 рукоятей. Сколько всего мечей?",
      preludeDeriveAnswer: 17,
      preludeDeriveWrongHint: "Посчитай: одна рукоять — один меч.",
      preludeFeatureNorms: {
        columnLabel: "Кристаллов",
        rowLabel: "Вид меча",
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
