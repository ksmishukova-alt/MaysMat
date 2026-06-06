/**
 * Аудит полноты условий pilot-задач паттерна 3 «Кто сколько сделал».
 * Используется QA и при сборке production-pattern pilot (следующий инкремент).
 */

export type TaskCompletenessStatus =
  | "complete_unique_answer"
  | "complete_multiple_answers"
  | "incomplete_condition"
  | "requires_positive_participants_constraint";

export type ProductionPilotFlowMode =
  | "progression"
  | "diagnostic"
  | "enumeration"
  | "multiple_answers";

export interface ProductionCompletenessRecord {
  methodTaskId: string;
  taskId: string;
  title: string;
  /** Сколько всего участников (если явно в условии) */
  totalParticipants?: number;
  /** Общий результат (конфеты, пирожки, снежинки…) */
  totalResult: number;
  firstKind: string;
  firstResult: number;
  secondKind: string;
  secondResult: number;
  resultName: string;
  questionAsks: string;
  requiresPositiveBothKinds: boolean;
  completenessStatus: TaskCompletenessStatus;
  /** Рекомендуемый режим до внедрения progressionProfile */
  recommendedFlow: ProductionPilotFlowMode;
  /** Рекомендуемый progressionProfile (undefined = не progression) */
  recommendedProfile?: 1 | 2 | 3 | 4;
  notes: string;
}

/** Pilot 3.1–3.7 — результат аудита перед реализацией runner */
export const PRODUCTION_COMPLETENESS_AUDIT: ProductionCompletenessRecord[] = [
  {
    methodTaskId: "3.1",
    taskId: "heads-legs-3-01",
    title: "Третьеклассники и пятиклассники",
    totalResult: 42,
    firstKind: "третьеклассники",
    firstResult: 3,
    secondKind: "пятиклассники",
    secondResult: 5,
    resultName: "задач",
    questionAsks: "сколько третьеклассников и пятиклассников",
    requiresPositiveBothKinds: true,
    completenessStatus: "incomplete_condition",
    recommendedFlow: "diagnostic",
    notes:
      "Нет totalParticipants. Два положительных варианта: 9+3 и 4+6. Не использовать как profile 1.",
  },
  {
    methodTaskId: "3.2",
    taskId: "heads-legs-3-02",
    title: "Пирожки мальчиков и девочек",
    totalResult: 18,
    firstKind: "девочки",
    firstResult: 3,
    secondKind: "мальчики",
    secondResult: 4,
    resultName: "пирожков",
    questionAsks: "сколько мальчиков и сколько девочек",
    requiresPositiveBothKinds: true,
    completenessStatus: "complete_unique_answer",
    recommendedFlow: "enumeration",
    recommendedProfile: 2,
    notes: "Уникальный ответ 3 м + 2 д через перебор; totalParticipants не дан.",
  },
  {
    methodTaskId: "3.3",
    taskId: "heads-legs-3-03",
    title: "Конфеты в классе",
    totalParticipants: 30,
    totalResult: 75,
    firstKind: "мальчики",
    firstResult: 2,
    secondKind: "девочки",
    secondResult: 3,
    resultName: "конфет",
    questionAsks: "сколько девочек в классе",
    requiresPositiveBothKinds: true,
    completenessStatus: "complete_unique_answer",
    recommendedFlow: "progression",
    recommendedProfile: 1,
    notes: "Первая полная задача для классического rule-flow (15 девочек).",
  },
  {
    methodTaskId: "3.4",
    taskId: "heads-legs-3-04",
    title: "Снежинки",
    totalParticipants: 30,
    totalResult: 530,
    firstKind: "мальчики",
    firstResult: 15,
    secondKind: "девочки",
    secondResult: 19,
    resultName: "снежинок",
    questionAsks: "сколько мальчиков и сколько девочек",
    requiresPositiveBothKinds: true,
    completenessStatus: "complete_unique_answer",
    recommendedFlow: "progression",
    recommendedProfile: 2,
    notes: "Ответ: 10 мальчиков, 20 девочек.",
  },
  {
    methodTaskId: "3.5",
    taskId: "heads-legs-3-05",
    title: "Совята и котята",
    totalParticipants: 34,
    totalResult: 172,
    firstKind: "совята",
    firstResult: 7,
    secondKind: "котята",
    secondResult: 4,
    resultName: "мышей",
    questionAsks: "кто поймал больше мышек и на сколько",
    requiresPositiveBothKinds: true,
    completenessStatus: "complete_unique_answer",
    recommendedFlow: "progression",
    recommendedProfile: 3,
    notes:
      "12 совят, 22 котёнка; финальный вопрос — сравнение (котята +4 мыши), answerTransform compare_results.",
  },
  {
    methodTaskId: "3.6",
    taskId: "heads-legs-3-06",
    title: "Ученики съели конфеты",
    totalParticipants: 25,
    totalResult: 95,
    firstKind: "мальчики",
    firstResult: 3,
    secondKind: "девочки",
    secondResult: 5,
    resultName: "конфет",
    questionAsks: "сколько мальчиков и сколько девочек",
    requiresPositiveBothKinds: true,
    completenessStatus: "complete_unique_answer",
    recommendedFlow: "progression",
    recommendedProfile: 4,
    notes: "Эталон для MethodRuleScreen (25×3=75, diff 20, step 2 → 10 д, 15 м). Profile 4 — word_solution.",
  },
  {
    methodTaskId: "3.7",
    taskId: "heads-legs-3-07",
    title: "Яблоки на варенье",
    totalResult: 26,
    firstKind: "девочки",
    firstResult: 4,
    secondKind: "мальчики",
    secondResult: 6,
    resultName: "яблок",
    questionAsks: "сколько могло быть девочек",
    requiresPositiveBothKinds: true,
    completenessStatus: "complete_multiple_answers",
    recommendedFlow: "multiple_answers",
    recommendedProfile: 4,
    notes: "Два варианта: 5 девочек (1 м) или 2 девочки (3 м). solutionMode D, multi_set.",
  },
];

export function getProductionAudit(
  methodTaskId: string,
): ProductionCompletenessRecord | undefined {
  return PRODUCTION_COMPLETENESS_AUDIT.find((r) => r.methodTaskId === methodTaskId);
}

/** Задачи, которые нельзя пускать в обычный childRoute progression-flow */
export function isNonStandardProductionPilot(methodTaskId: string): boolean {
  const rec = getProductionAudit(methodTaskId);
  if (!rec) return false;
  return (
    rec.recommendedFlow === "diagnostic" ||
    rec.recommendedFlow === "multiple_answers" ||
    rec.completenessStatus === "incomplete_condition"
  );
}
