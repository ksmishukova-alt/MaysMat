/**
 * Аудит полноты условий pilot-задач паттерна 4 «Баллы / оценки / плюс-минус очки».
 * Используется QA и при сборке score-pattern pilot (следующий инкремент).
 */

export type ScoreCompletenessStatus =
  | "complete_unique_answer"
  | "incomplete_condition";

export type ScoreMode = "ordinary" | "plus_minus" | "match_total";

export type ScorePilotFlowMode = "progression" | "word_solution";

export interface ScoreCompletenessRecord {
  methodTaskId: string;
  taskId: string;
  title: string;
  /** Сколько всего попыток / учеников / матчей / девочек */
  totalObjects: number;
  /** Итоговая сумма баллов / оценок / открыток / очков */
  totalScore: number;
  firstKind: string;
  firstScore: number;
  secondKind: string;
  secondScore: number;
  scoreName: string;
  questionAsks: string;
  /** Есть ли отрицательный вклад хотя бы у одного типа */
  hasNegativeContribution: boolean;
  /** Единственный математически корректный ответ */
  uniqueAnswer: boolean;
  completenessStatus: ScoreCompletenessStatus;
  scoreMode: ScoreMode;
  /** Для match_total: сумма очков обеих команд за матч с победителем */
  decisiveMatchTotal?: number;
  /** Для match_total: сумма очков обеих команд за ничью */
  drawMatchTotal?: number;
  /** Шаг замены: abs(secondScore − firstScore); для 4.4 = decisiveMatchTotal − drawMatchTotal */
  replacementStep: number;
  /** Какой тип берём в шаге «представим, что все…» */
  assumeKind: string;
  /** Ожидаемый числовой ответ (для QA) */
  expectedAnswer: number;
  /** Рекомендуемый режим runner */
  recommendedFlow: ScorePilotFlowMode;
  /** Рекомендуемый progressionProfile */
  recommendedProfile?: 1 | 2 | 3 | 4;
  notes: string;
}

/** Pilot 4.1–4.5 — результат аудита перед реализацией runner */
export const SCORE_COMPLETENESS_AUDIT: ScoreCompletenessRecord[] = [
  {
    methodTaskId: "4.1",
    taskId: "heads-legs-4-01",
    title: "Петя на турнире",
    totalObjects: 10,
    totalScore: 11,
    firstKind: "неверные ответы",
    firstScore: -1,
    secondKind: "верные ответы",
    secondScore: 2,
    scoreName: "баллов",
    questionAsks: "сколько примеров Петя решил правильно",
    hasNegativeContribution: true,
    uniqueAnswer: true,
    completenessStatus: "complete_unique_answer",
    scoreMode: "plus_minus",
    replacementStep: 3,
    assumeKind: "неверные ответы",
    expectedAnswer: 7,
    recommendedFlow: "progression",
    recommendedProfile: 1,
    notes:
      "Plus-minus: 10×(−1)=−10; diff 11−(−10)=21; шаг 2−(−1)=3 → 7 верных. Обязательно объяснить шаг замены с отрицательным вкладом.",
  },
  {
    methodTaskId: "4.2",
    taskId: "heads-legs-4-02",
    title: "Оценки 2 и 3",
    totalObjects: 10,
    totalScore: 27,
    firstKind: "ученики с оценкой 2",
    firstScore: 2,
    secondKind: "ученики с оценкой 3",
    secondScore: 3,
    scoreName: "оценок",
    questionAsks: "сколько учеников получили 2",
    hasNegativeContribution: false,
    uniqueAnswer: true,
    completenessStatus: "complete_unique_answer",
    scoreMode: "ordinary",
    replacementStep: 1,
    assumeKind: "ученики с оценкой 2",
    expectedAnswer: 3,
    recommendedFlow: "progression",
    recommendedProfile: 2,
    notes:
      "Обычная замена: 10×2=20; diff 7; step 1 → 7 троек, 3 двойки. Нет feature override — inference из условия.",
  },
  {
    methodTaskId: "4.3",
    taskId: "heads-legs-4-03",
    title: "Открытки девочкам",
    totalObjects: 12,
    totalScore: 25,
    firstKind: "девочки с 2 открытками",
    firstScore: 2,
    secondKind: "девочки с 3 открытками",
    secondScore: 3,
    scoreName: "открыток",
    questionAsks: "сколько девочек получили по 3 открытки",
    hasNegativeContribution: false,
    uniqueAnswer: true,
    completenessStatus: "complete_unique_answer",
    scoreMode: "ordinary",
    replacementStep: 1,
    assumeKind: "девочки с 2 открытками",
    expectedAnswer: 1,
    recommendedFlow: "progression",
    recommendedProfile: 2,
    notes: "12×2=24; diff 1 → 1 девочка с 3 открытками. Feature override 4.3 есть.",
  },
  {
    methodTaskId: "4.4",
    taskId: "heads-legs-4-04",
    title: "Матчи двух команд",
    totalObjects: 10,
    totalScore: 46,
    firstKind: "матчи с победителем",
    firstScore: 5,
    secondKind: "ничьи",
    secondScore: 4,
    scoreName: "очков",
    questionAsks: "сколько было ничьих",
    hasNegativeContribution: false,
    uniqueAnswer: true,
    completenessStatus: "complete_unique_answer",
    scoreMode: "match_total",
    decisiveMatchTotal: 5,
    drawMatchTotal: 4,
    replacementStep: 1,
    assumeKind: "матчи с победителем",
    expectedAnswer: 4,
    recommendedFlow: "progression",
    recommendedProfile: 2,
    notes:
      "НЕ обычная замена «победы vs ничьи как участники». Сумма за матч: победа+поражение 4+1=5; ничья 2+2=4. 10×5=50; diff 4 → 4 ничьих. entity-overrides «Банты/Ранкоры» — ошибка импорта, исправить на MatchTotalStep.",
  },
  {
    methodTaskId: "4.5",
    taskId: "heads-legs-4-05",
    title: "Экзамен Васи",
    totalObjects: 30,
    totalScore: 77,
    firstKind: "неправильные ответы",
    firstScore: -12,
    secondKind: "правильные ответы",
    secondScore: 7,
    scoreName: "баллов",
    questionAsks: "сколько верных ответов дал Вася",
    hasNegativeContribution: true,
    uniqueAnswer: true,
    completenessStatus: "complete_unique_answer",
    scoreMode: "plus_minus",
    replacementStep: 19,
    assumeKind: "неправильные ответы",
    expectedAnswer: 23,
    recommendedFlow: "progression",
    recommendedProfile: 3,
    notes:
      "Plus-minus hub: 30×(−12)=−360; diff 77−(−360)=437; шаг 7−(−12)=19 → 23 верных. Profile 3 — ребёнок повторяет шаг замены с −12.",
  },
];

export function getScoreAudit(
  methodTaskId: string,
): ScoreCompletenessRecord | undefined {
  return SCORE_COMPLETENESS_AUDIT.find((r) => r.methodTaskId === methodTaskId);
}

/** Задачи паттерна 4, которые нельзя пускать в childRoute без явного scoreMode */
export function requiresScoreMode(methodTaskId: string): boolean {
  return SCORE_COMPLETENESS_AUDIT.some((r) => r.methodTaskId === methodTaskId);
}

/** 4.4 нельзя решать как ordinary/plus_minus participant replacement */
export function isMatchTotalPilot(methodTaskId: string): boolean {
  const rec = getScoreAudit(methodTaskId);
  return rec?.scoreMode === "match_total";
}
