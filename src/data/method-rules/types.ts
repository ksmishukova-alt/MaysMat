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

/** Числа из задачи «Головы и ноги» для экрана правила */
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
  /** Склонение для фразы «все N … — …» */
  assumeKindPhrase?: string;
  /** «30 животных», «120 детёнышей» */
  objectsLabel?: string;
  /** «В задаче есть звери и птицы.» */
  sceneIntro?: string;
  /** «У птицы 2 ноги.» / «У зверя 4 ноги.» */
  featureLines?: [string, string];
  showRuleScreen?: boolean;
}

export type MethodRuleInstance = RemaindersRuleInstance | HeadsLegsRuleInstance;
