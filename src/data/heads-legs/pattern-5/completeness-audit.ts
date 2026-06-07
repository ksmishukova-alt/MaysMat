/**
 * Аудит полноты условий задач паттерна 5 «Сначала нужно понять, что именно считаем».
 * Используется QA и при планировании pattern-5 runner (до согласования — без реализации).
 */

export type Pattern5CompletenessStatus =
  | "complete_unique_answer"
  | "complete_multiple_answers"
  | "incomplete_condition"
  | "requires_positive_participants_constraint"
  | "methodically_unclear";

/** Режим решения на платформе (до выбора конкретного runner-flow) */
export type Pattern5SolutionMode =
  | "standard_replacement"
  | "diagnostic"
  | "enumeration"
  | "multiple_answers"
  | "compare_results"
  | "match_total"
  | "transfer"
  | "paper_solution"
  | "unsupported_for_now";

export type Pattern5PublishDecision =
  | "childRouteCandidate"
  | "methodistOnly"
  | "reserve"
  | "blocked"
  | "archive";

/** Математический подтип задачи паттерна 5 */
export type Pattern5DerivationKind =
  | "feature_switch_then_replace"
  | "unit_conversion_then_replace"
  | "standard_replace"
  | "compare_after_replace"
  | "limb_decompose"
  | "common_resource_then_replace"
  | "ratio_equality";

export type Pattern5PilotFlowMode =
  | "progression"
  | "word_solution"
  | "custom_worksheets";

export interface Pattern5CompletenessRecord {
  methodTaskId: string;
  taskId: string;
  catalogNumber: number;
  title: string;
  condition: string;
  /** Сколько строк в solution-lines.generated (эталон word_solution) */
  solutionLineCount: number;
  /** Режим из catalog.generated (A/B/C/D/E) */
  catalogSolutionMode: string;
  /** Математический подтип */
  derivationKind: Pattern5DerivationKind;
  /** Скрытое или производное «всего объектов», если есть */
  derivedTotalObjects?: number;
  /** Явное totalParticipants в условии */
  totalParticipants?: number;
  /** Признак / ресурс для замены (рога, ноги, зубы, крылья, кристаллы…) */
  replacementFeature: string;
  replacementFeatureFirst: number;
  replacementFeatureSecond: number;
  /** Итог по признаку замены */
  replacementFeatureTotal: number;
  firstKind: string;
  secondKind: string;
  questionAsks: string;
  /** Промежуточный результат, который не является ответом на вопрос задачи */
  intermediateNotAnswer?: string;
  /** Оба вида должны быть > 0 */
  requiresPositiveBothKinds: boolean;
  uniqueAnswer: boolean;
  completenessStatus: Pattern5CompletenessStatus;
  solutionMode: Pattern5SolutionMode;
  recommendedFlow: Pattern5PilotFlowMode;
  recommendedProfile?: 1 | 2 | 3 | 4;
  publishDecision: Pattern5PublishDecision;
  blockers: string[];
  needsRunnerChange: boolean;
  needsExpressionValidation: boolean;
  needsMethodChoice: boolean;
  needsPaperMode: boolean;
  suggestedE2E: string;
  /** Ожидаемый ответ (кратко) */
  expectedAnswer: string;
  notes: string;
}

/** Pilot 5.1–5.7 — результат аудита перед реализацией runner */
export const PATTERN5_COMPLETENESS_AUDIT: Pattern5CompletenessRecord[] = [
  {
    methodTaskId: "5.1",
    taskId: "heads-legs-5-01",
    catalogNumber: 32,
    title: "Антилопы и единороги",
    condition:
      "В королевском стаде есть антилопы и единороги. Всего у них 88 ног и 35 рогов. Сколько единорогов в королевском стаде?",
    solutionLineCount: 10,
    catalogSolutionMode: "C",
    derivationKind: "feature_switch_then_replace",
    derivedTotalObjects: 22,
    replacementFeature: "рога",
    replacementFeatureFirst: 1,
    replacementFeatureSecond: 2,
    replacementFeatureTotal: 35,
    firstKind: "единороги",
    secondKind: "антилопы",
    questionAsks: "сколько единорогов",
    intermediateNotAnswer: "22 животных (из 88 ÷ 4)",
    requiresPositiveBothKinds: true,
    uniqueAnswer: true,
    completenessStatus: "complete_unique_answer",
    solutionMode: "standard_replacement",
    recommendedFlow: "custom_worksheets",
    recommendedProfile: 3,
    publishDecision: "reserve",
    blockers: [
      "Нужен prelude «переключение признака» (ноги → рога) до замены",
      "Custom steps-5-1.ts есть, runner pattern-5 ещё не подключён",
    ],
    needsRunnerChange: true,
    needsExpressionValidation: true,
    needsMethodChoice: false,
    needsPaperMode: false,
    suggestedE2E: "5.01 — feature switch: 88÷4=22, затем рога → 9 единорогов",
    expectedAnswer: "9 единорогов",
    notes:
      "Два признака: ноги (4 у всех) дают 22 животных; замена по рогам (1 vs 2). Ответ — только единороги, не пара (13+9). Guided custom buildSteps51 готов.",
  },
  {
    methodTaskId: "5.2",
    taskId: "heads-legs-5-02",
    catalogNumber: 33,
    title: "Караван Бант и Джав",
    condition:
      "По пустыне Татуина идет караван Бант, на некоторых из них сидят Джавы. Всего по песку бредет 54 пары ног. Сколько Джав едет на Бантах, если голов в караване 44?",
    solutionLineCount: 10,
    catalogSolutionMode: "C",
    derivationKind: "unit_conversion_then_replace",
    totalParticipants: 44,
    replacementFeature: "ноги",
    replacementFeatureFirst: 2,
    replacementFeatureSecond: 4,
    replacementFeatureTotal: 108,
    firstKind: "Джавы",
    secondKind: "Банты",
    questionAsks: "сколько Джав (на Бантах / в караване)",
    intermediateNotAnswer: "108 ног (из 54×2)",
    requiresPositiveBothKinds: true,
    uniqueAnswer: true,
    completenessStatus: "complete_unique_answer",
    solutionMode: "standard_replacement",
    recommendedFlow: "progression",
    recommendedProfile: 2,
    publishDecision: "reserve",
    blockers: [
      "Обязательный шаг: пары ног → 108 ног",
      "Семантика «Банта с Джавом» vs «голова Джава» — нужен экран перевода единиц",
    ],
    needsRunnerChange: true,
    needsExpressionValidation: true,
    needsMethodChoice: false,
    needsPaperMode: false,
    suggestedE2E: "5.02 — 54×2=108, замена 2 vs 4 ноги → 34 Джава",
    expectedAnswer: "34 Джава",
    notes:
      "44 головы; 10 Бант (4 ноги) + 34 Джава (2 ноги). Не путать с match_total паттерна 4. Star Wars сюжет, но модель корректна для HL.",
  },
  {
    methodTaskId: "5.3",
    taskId: "heads-legs-5-03",
    catalogNumber: 34,
    title: "Банты и Ранкоры",
    condition:
      "В зверинце у Джаббы Хатта водятся Банты и Ранкоры. У Бант 18 плоских зубов, у Ранкоров 8 острых клыков. Всего в зверинце 29 существ, у которых вместе 352 зуба. Сколько у Джаббы Ранкоров, а сколько Бант?",
    solutionLineCount: 8,
    catalogSolutionMode: "B",
    derivationKind: "standard_replace",
    totalParticipants: 29,
    replacementFeature: "зубы",
    replacementFeatureFirst: 8,
    replacementFeatureSecond: 18,
    replacementFeatureTotal: 352,
    firstKind: "Ранкоры",
    secondKind: "Банты",
    questionAsks: "сколько Ранкоров и сколько Бант",
    requiresPositiveBothKinds: true,
    uniqueAnswer: true,
    completenessStatus: "complete_unique_answer",
    solutionMode: "standard_replacement",
    recommendedFlow: "word_solution",
    recommendedProfile: 4,
    publishDecision: "childRouteCandidate",
    blockers: [],
    needsRunnerChange: false,
    needsExpressionValidation: true,
    needsMethodChoice: true,
    needsPaperMode: false,
    suggestedE2E: "5.03 — transfer: выбор метода + примеры → 17 Ранкоров, 12 Бант",
    expectedAnswer: "17 Ранкоров и 12 Бант",
    notes:
      "Transfer, не derive: все данные (29 существ, 352 зуба, 8/18) уже в условии. Короткий flow: условие → выбор метода → примеры → ответ.",
  },
  {
    methodTaskId: "5.4",
    taskId: "heads-legs-5-04",
    catalogNumber: 35,
    title: "Имперские истребители и X-Wing",
    condition:
      "У имперских истребителей 2 крыла, а у X-Wing 4 крыла. Соло насчитал 76 кораблей и 226 крыльев. Каких кораблей было больше — Имперских или Республики, и на сколько?",
    solutionLineCount: 9,
    catalogSolutionMode: "B",
    derivationKind: "compare_after_replace",
    totalParticipants: 76,
    replacementFeature: "крылья",
    replacementFeatureFirst: 2,
    replacementFeatureSecond: 4,
    replacementFeatureTotal: 226,
    firstKind: "имперские истребители",
    secondKind: "X-Wing (Республика)",
    questionAsks: "каких кораблей было больше и на сколько",
    intermediateNotAnswer: "39 имперских и 37 X-Wing — не финальный ответ",
    requiresPositiveBothKinds: true,
    uniqueAnswer: true,
    completenessStatus: "complete_unique_answer",
    solutionMode: "compare_results",
    recommendedFlow: "progression",
    recommendedProfile: 3,
    publishDecision: "reserve",
    blockers: [
      "Нужен answerTransform compare_results (как 3.5 / 4.4)",
      "Вопрос про сравнение, не про одно число",
    ],
    needsRunnerChange: true,
    needsExpressionValidation: true,
    needsMethodChoice: false,
    needsPaperMode: false,
    suggestedE2E: "5.04 — замена → 39 vs 37, имперских больше на 2",
    expectedAnswer: "имперских истребителей больше на 2",
    notes:
      "Математика стандартной замены, но финал — compare. Не match_total (это не сумма за «матч»).",
  },
  {
    methodTaskId: "5.5",
    taskId: "heads-legs-5-05",
    catalogNumber: 36,
    title: "Водолазы и осьминоги",
    condition:
      "На морской глубине водолазы сражаются с осьминогами. Мы видим 120 конечностей. Из них 88 — ноги. Сколько осьминогов? Считаем, что все конечности осьминогов — ноги.",
    solutionLineCount: 11,
    catalogSolutionMode: "C",
    derivationKind: "limb_decompose",
    replacementFeature: "ноги (после декомпозиции)",
    replacementFeatureFirst: 2,
    replacementFeatureSecond: 8,
    replacementFeatureTotal: 88,
    firstKind: "водолазы",
    secondKind: "осьминоги",
    questionAsks: "сколько осьминогов",
    intermediateNotAnswer: "16 водолазов, 32 руки, 56 ног осьминогов",
    requiresPositiveBothKinds: true,
    uniqueAnswer: true,
    completenessStatus: "complete_unique_answer",
    solutionMode: "unsupported_for_now",
    recommendedFlow: "custom_worksheets",
    recommendedProfile: 4,
    publishDecision: "methodistOnly",
    blockers: [
      "solutionMode unsupported_for_now — не reserve: нужен отдельный экран limb_decompose",
      "Не решается «все одного вида» без учёта рук водолаза",
      "Custom steps-5-5.ts готов, runner pattern-5 ещё не подключён",
      "blocked_until_runner: не публиковать в childRoute до готовности decompose-flow",
    ],
    needsRunnerChange: true,
    needsExpressionValidation: true,
    needsMethodChoice: false,
    needsPaperMode: false,
    suggestedE2E: "5.05 — 120−88=32 руки → 16 водолазов → 7 осьминогов",
    expectedAnswer: "7 осьминогов",
    notes:
      "Классический «не heads-legs в лоб»: два уровня признаков (конечности vs ноги). unsupported_for_now → methodistOnly, не reserve. Custom steps-5-5.ts — задел под Wave E.",
  },
  {
    methodTaskId: "5.6",
    taskId: "heads-legs-5-06",
    catalogNumber: 37,
    title: "Световые мечи",
    condition:
      "Мастер делает световые мечи. Для обычного меча Джедаев требуется рукоять и зеленый кристалл, а для двойного меча Ситхов — рукоять и два красных кристалла. Мастер использовал 17 рукоятей и 32 кристалла. Сколько мечей Джедаев изготовил мастер?",
    solutionLineCount: 9,
    catalogSolutionMode: "B",
    derivationKind: "common_resource_then_replace",
    derivedTotalObjects: 17,
    replacementFeature: "кристаллы",
    replacementFeatureFirst: 1,
    replacementFeatureSecond: 2,
    replacementFeatureTotal: 32,
    firstKind: "мечи Джедаев",
    secondKind: "мечи Ситхов",
    questionAsks: "сколько мечей Джедаев",
    intermediateNotAnswer: "17 мечей (из 17 рукоятей)",
    requiresPositiveBothKinds: true,
    uniqueAnswer: true,
    completenessStatus: "complete_unique_answer",
    solutionMode: "standard_replacement",
    recommendedFlow: "progression",
    recommendedProfile: 2,
    publishDecision: "childRouteCandidate",
    blockers: ["Prelude: 1 рукоять = 1 меч → всего 17"],
    needsRunnerChange: true,
    needsExpressionValidation: true,
    needsMethodChoice: false,
    needsPaperMode: false,
    suggestedE2E: "5.06 — 17 мечей, замена 1 vs 2 кристалла → 2 меча Джедаев",
    expectedAnswer: "2 меча Джедаев",
    notes:
      "Общий ресурс (рукояти) задаёт totalObjects. Второй pilot после 5.3.",
  },
  {
    methodTaskId: "5.7",
    taskId: "heads-legs-5-07",
    catalogNumber: 38,
    title: "Падаваны, Джедаи и Ситхи",
    condition:
      "В Академии Джедаев учился 21 падаван. Часть стали Джедаями и получили по 2 зеленых меча, а часть стали Ситхами и получили по 4 красных меча. Красных и зеленых мечей было получено поровну. Сколько было Ситхов и сколько Джедаев?",
    solutionLineCount: 10,
    catalogSolutionMode: "C",
    derivationKind: "ratio_equality",
    totalParticipants: 21,
    replacementFeature: "мечи (равенство красных и зелёных)",
    replacementFeatureFirst: 2,
    replacementFeatureSecond: 4,
    replacementFeatureTotal: 0,
    firstKind: "Джедаи",
    secondKind: "Ситхи",
    questionAsks: "сколько Ситхов и сколько Джедаев",
    requiresPositiveBothKinds: true,
    uniqueAnswer: true,
    completenessStatus: "methodically_unclear",
    solutionMode: "unsupported_for_now",
    recommendedFlow: "word_solution",
    recommendedProfile: 4,
    publishDecision: "blocked",
    blockers: [
      "solutionMode unsupported_for_now — ratio/equality, не heads-legs replacement",
      "Метод замены не естественен — равенство мечей → отношение 1:2 (методичка прямо указывает на равенство, не на лишние ноги)",
      "Нужен отдельный mini-runner ratio_equality или отдельный solutionMode",
      "Не публиковать в childRoute до отдельного ratio/equality runner",
    ],
    needsRunnerChange: true,
    needsExpressionValidation: true,
    needsMethodChoice: true,
    needsPaperMode: false,
    suggestedE2E: "5.07 — ratio 1:2 → 7 Ситхов, 14 Джедаев (после согласования runner)",
    expectedAnswer: "7 Ситхов и 14 Джедаев",
    notes:
      "Математически unique (4s=2(21−s) → s=7). Ratio/equality — blocked, не heads-legs replacement. Не публиковать в childRoute до ratio runner.",
  },
];

export function getPattern5Audit(
  methodTaskId: string,
): Pattern5CompletenessRecord | undefined {
  return PATTERN5_COMPLETENESS_AUDIT.find((r) => r.methodTaskId === methodTaskId);
}

export function pattern5AuditByTaskId(taskId: string): Pattern5CompletenessRecord | undefined {
  return PATTERN5_COMPLETENESS_AUDIT.find((r) => r.taskId === taskId);
}

/** Задачи, которые нельзя пускать в childRoute без явного derivationKind / runner */
export function requiresPattern5Runner(methodTaskId: string): boolean {
  return PATTERN5_COMPLETENESS_AUDIT.some((r) => r.methodTaskId === methodTaskId);
}

/** Кандидаты в первую волну child route (после реализации runner) */
export const PATTERN5_CHILD_ROUTE_CANDIDATES = PATTERN5_COMPLETENESS_AUDIT.filter(
  (r) => r.publishDecision === "childRouteCandidate",
).map((r) => r.taskId);

/** Задачи unsupported_for_now — methodistOnly до отдельного runner (не reserve) */
export const PATTERN5_METHODIST_ONLY_UNTIL_RUNNER = PATTERN5_COMPLETENESS_AUDIT.filter(
  (r) =>
    r.publishDecision === "methodistOnly" &&
    r.solutionMode === "unsupported_for_now",
).map((r) => r.taskId);

/** Задачи, заблокированные до ratio/equality runner */
export const PATTERN5_BLOCKED_TASK_IDS = PATTERN5_COMPLETENESS_AUDIT.filter(
  (r) => r.publishDecision === "blocked",
).map((r) => r.taskId);
