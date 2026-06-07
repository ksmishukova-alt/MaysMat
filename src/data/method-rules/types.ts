/** Методическое правило для подтемы банка задач */
export interface MethodRule {
  id: string;
  title: string;
  childTitle: string;
  anchorPhrase: string;
  fullRule: string[];
  helpButtonLabel: string;
}

/** Числа из конкретной задачи для примера на экране правила */
export interface RemaindersRuleInstance {
  ruleId: string;
  modulus: number;
  firstRemainder: number;
  lastRemainder: number;
  housesCount: number;
  objectsCount: number;
  objectsLabel: string;
  /** Обязательный экран правила в начале задачи (первая в подтеме) */
  showRuleScreen?: boolean;
}

/** Числа из задачи «Головы и ноги» для экрана правила (паттерн 1) */
export interface HeadsLegsRuleInstance {
  ruleId: "heads-legs-base";
  totalObjects: number;
  totalFeature: number;
  firstKind: string;
  firstFeature: number;
  secondKind: string;
  secondFeature: number;
  featureName: string;
  assumeKind: string;
  replacementStep: number;
  assumeKindPhrase?: string;
  objectsLabel?: string;
  sceneIntro?: string;
  featureLines?: [string, string];
  showRuleScreen?: boolean;
}

/** Дополнительное действие для ответа (паттерн 2) */
export interface HeadsLegsValueAnswerTransform {
  type: "multiply_found_objects";
  multiplier: number;
  resultLabel: string;
  foundObjectLabel?: string;
}

/** Числа из задачи «Цена / количество / расход» (паттерн 2) */
export interface HeadsLegsValueRuleInstance {
  ruleId: "heads-legs-value-base";
  totalObjects: number;
  totalFeature: number;
  firstKind: string;
  firstFeature: number;
  secondKind: string;
  secondFeature: number;
  featureName: string;
  assumeKind: string;
  replacementStep: number;
  questionAsks: string;
  assumeKindPhrase?: string;
  objectsLabel?: string;
  sceneIntro?: string;
  featureLines?: [string, string];
  answerTransform?: HeadsLegsValueAnswerTransform;
  showRuleScreen?: boolean;
}

export type ScoreMode = "ordinary" | "plus_minus" | "match_total";

/** Числа из задачи «Баллы / оценки / плюс-минус очки» (паттерн 4) */
export interface HeadsLegsScoreRuleInstance {
  ruleId: "heads-legs-score-base";
  totalObjects: number;
  totalScore: number;
  firstKind: string;
  firstScore: number;
  secondKind: string;
  secondScore: number;
  scoreName: string;
  assumeKind: string;
  replacementStep: number;
  questionAsks: string;
  scoreMode: ScoreMode;
  /** Только для match_total (4.4) */
  decisiveMatchTotal?: number;
  drawMatchTotal?: number;
  completenessStatus: TaskCompletenessStatus;
  assumeKindPhrase?: string;
  objectsLabel?: string;
  sceneIntro?: string;
  featureLines?: [string, string];
  /** Подсказка на шаге «что спрашивают» (напр. 4.2: не перепутать 3 и 7) */
  questionCheckNote?: string;
  explanationNote?: string;
  showRuleScreen?: boolean;
}

/** Нормы признака в derive-prelude (напр. кристаллов на меч) */
export interface HeadsLegsDeriveFeatureNorms {
  columnLabel: string;
  stepHint: string;
  rows: Array<{ id: string; label: string; emoji: string; answer: number }>;
}

/** Prelude + стандартная замена (паттерн 5) */
export interface HeadsLegsDeriveRuleInstance {
  ruleId: "heads-legs-derive-base";
  totalObjects: number;
  totalFeature: number;
  firstKind: string;
  firstFeature: number;
  secondKind: string;
  secondFeature: number;
  featureName: string;
  assumeKind: string;
  replacementStep: number;
  questionAsks: string;
  preludeQuestion: string;
  preludeChoices: Array<{ id: string; label: string; correct: boolean }>;
  /** Вывод числа из условия (напр. 17 мечей из рукоятей) */
  preludeDerivePrompt?: string;
  preludeDeriveAnswer?: number;
  /** Таблица «сколько требуется» на объект — один раз в prelude */
  preludeFeatureNorms?: HeadsLegsDeriveFeatureNorms;
  assumeKindPhrase?: string;
  objectsLabel?: string;
  sceneIntro?: string;
  featureLines?: [string, string];
  showRuleScreen?: boolean;
}

export type HeadsLegsMethodRuleInstance =
  | HeadsLegsRuleInstance
  | HeadsLegsValueRuleInstance
  | HeadsLegsProductionRuleInstance
  | HeadsLegsScoreRuleInstance
  | HeadsLegsDeriveRuleInstance;

export type TaskCompletenessStatus =
  | "complete_unique_answer"
  | "complete_multiple_answers"
  | "incomplete_condition"
  | "requires_positive_participants_constraint";

/** Доп. шаг для ответа (паттерн 3) */
export interface HeadsLegsProductionAnswerTransform {
  type: "compare_results" | "difference_between_results" | "none";
  resultLabel?: string;
  firstKind?: string;
  secondKind?: string;
}

/** Числа из задачи «Кто сколько сделал» (паттерн 3) */
export interface HeadsLegsProductionRuleInstance {
  ruleId: "heads-legs-production-base";
  totalParticipants?: number;
  totalResult: number;
  firstKind: string;
  firstResult: number;
  secondKind: string;
  secondResult: number;
  resultName: string;
  assumeKind: string;
  replacementStep: number;
  questionAsks: string;
  requiresPositiveBothKinds?: boolean;
  completenessStatus: TaskCompletenessStatus;
  assumeKindPhrase?: string;
  participantsLabel?: string;
  sceneIntro?: string;
  featureLines?: [string, string];
  answerTransform?: HeadsLegsProductionAnswerTransform;
  showRuleScreen?: boolean;
}

export type HeadsLegsAnswerTransform =
  | HeadsLegsValueAnswerTransform
  | HeadsLegsProductionAnswerTransform;

export type HeadsLegsProgressionProfile = 1 | 2 | 3 | 4;

export type MethodRuleInstance =
  | RemaindersRuleInstance
  | HeadsLegsMethodRuleInstance;
