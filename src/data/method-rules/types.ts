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
