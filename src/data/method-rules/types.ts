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

export type HeadsLegsMethodRuleInstance =
  | HeadsLegsRuleInstance
  | HeadsLegsValueRuleInstance
  | HeadsLegsProductionRuleInstance;

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
