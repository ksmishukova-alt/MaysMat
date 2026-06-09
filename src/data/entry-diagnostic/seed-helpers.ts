import type {
  DiagnosticBlock,
  DiagnosticDifficulty,
  DiagnosticTask,
  RunnerKind,
  ScoreWeight,
  ScreenStep,
  ValidationRule,
} from "./types";

const DIFFICULTIES: DiagnosticDifficulty[] = ["D1", "D2", "D3"];
const WEIGHTS: ScoreWeight[] = [1, 2, 3];

export function makeTask(
  blockId: string,
  difficulty: DiagnosticDifficulty,
  taskText: string,
  answer: Record<string, unknown>,
  validationRules: ValidationRule[],
  errorTypes: string[],
  extra?: Partial<Pick<DiagnosticTask, "acceptedSolutions" | "screenSequence">>,
): DiagnosticTask {
  const idx = DIFFICULTIES.indexOf(difficulty);
  return {
    taskId: `${blockId}-${difficulty.toLowerCase()}`,
    blockId,
    difficulty,
    scoreWeight: WEIGHTS[idx],
    taskText,
    answer,
    screenSequence: extra?.screenSequence ?? defaultScreenSequence(difficulty, taskText),
    validationRules,
    errorTypes,
    acceptedSolutions: extra?.acceptedSolutions,
  };
}

function defaultScreenSequence(_difficulty: DiagnosticDifficulty, taskText: string) {
  return [
    { stepId: "read", kind: "read_prompt" as const, prompt: taskText },
    {
      stepId: "visual",
      kind: "visual_board" as const,
      prompt: "Посмотри на картинку-помощник и подумай, как решать.",
    },
    {
      stepId: "answer",
      kind: "number_input" as const,
      prompt: "Запиши ответ",
      fieldKey: "value",
      placeholder: "Число",
    },
    {
      stepId: "submit",
      kind: "confirm_submit" as const,
      prompt: "Если всё готово — нажми кнопку внизу.",
    },
  ];
}

/** Блок 2: сюжет → выбор операции + / − */
export function makeStoryOperationTask(
  blockId: string,
  difficulty: DiagnosticDifficulty,
  conditionText: string,
  questionPrompt: string,
  choices: { id: string; label: string }[],
  answerOperation: string,
  errorTypes: string[],
): DiagnosticTask {
  const steps: ScreenStep[] = [
    { stepId: "read", kind: "condition_read", prompt: conditionText },
    {
      stepId: "choose",
      kind: "single_select",
      prompt: questionPrompt,
      fieldKey: "operation",
      options: choices,
    },
  ];

  return {
    taskId: `${blockId}-${difficulty.toLowerCase()}`,
    blockId,
    difficulty,
    scoreWeight: WEIGHTS[DIFFICULTIES.indexOf(difficulty)],
    taskText: conditionText,
    answer: { operation: answerOperation },
    screenSequence: steps,
    validationRules: [{ type: "exact", field: "operation", value: answerOperation }],
    errorTypes,
  };
}

export function makeReadingTask(
  blockId: string,
  difficulty: DiagnosticDifficulty,
  conditionText: string,
  questionPrompt: string,
  choices: { id: string; label: string }[],
  answerFocus: string,
  errorTypes: string[],
): DiagnosticTask {
  const steps: ScreenStep[] = [
    { stepId: "read", kind: "condition_read", prompt: conditionText },
    {
      stepId: "choose",
      kind: "single_select",
      prompt: questionPrompt,
      fieldKey: "focus",
      options: choices,
    },
  ];

  return {
    taskId: `${blockId}-${difficulty.toLowerCase()}`,
    blockId,
    difficulty,
    scoreWeight: WEIGHTS[DIFFICULTIES.indexOf(difficulty)],
    taskText: conditionText,
    answer: { focus: answerFocus },
    screenSequence: steps,
    validationRules: [{ type: "exact", field: "focus", value: answerFocus }],
    errorTypes,
  };
}

export function makePlanTask(
  blockId: string,
  difficulty: DiagnosticDifficulty,
  taskText: string,
  actionCount: number,
  errorTypes: string[],
): DiagnosticTask {
  return makeTask(
    blockId,
    difficulty,
    taskText,
    { actionCount, plan: ["step1", "step2"].slice(0, actionCount) },
    [
      { type: "actionCountAtLeast", field: "actionCount", min: 1 },
      { type: "numericEquals", field: "actionCount", value: actionCount },
    ],
    errorTypes,
    {
      screenSequence: [
        { stepId: "read", kind: "read_prompt", prompt: taskText },
        {
          stepId: "plan-visual",
          kind: "visual_board",
          prompt: "Вот маршрут решения — посмотри на него.",
        },
        {
          stepId: "hypothesis",
          kind: "action_count_hypothesis",
          prompt: "Сколько действий понадобится? Можно изменить позже.",
          fieldKey: "actionCount",
        },
        {
          stepId: "plan",
          kind: "action_plan_builder",
          prompt: "Собери свой план действий",
          fieldKey: "plan",
        },
        { stepId: "submit", kind: "confirm_submit", prompt: "Если план готов — продолжай." },
      ],
    },
  );
}

export function makeExpressionTask(
  blockId: string,
  difficulty: DiagnosticDifficulty,
  taskText: string,
  answer: number,
  errorTypes: string[],
): DiagnosticTask {
  return makeTask(
    blockId,
    difficulty,
    taskText,
    { value: answer },
    [{ type: "numericEquals", field: "value", value: answer }],
    errorTypes,
    {
      screenSequence: [
        { stepId: "read", kind: "read_prompt", prompt: taskText },
        {
          stepId: "order",
          kind: "visual_board",
          prompt: "Сначала умножение и деление, потом сложение и вычитание.",
        },
        {
          stepId: "calc",
          kind: "embedded_calculator",
          prompt: "Можешь посчитать на помощнике",
        },
        {
          stepId: "answer",
          kind: "number_input",
          prompt: "Запиши итоговый ответ",
          fieldKey: "value",
          placeholder: "Число",
        },
        { stepId: "submit", kind: "confirm_submit", prompt: "Если всё готово — продолжай." },
      ],
    },
  );
}

export interface BlockSeed {
  blockId: string;
  blockIndex: number;
  title: string;
  skill: string;
  runnerKind: RunnerKind;
  miniGameId: string;
  tasks: [DiagnosticTask, DiagnosticTask, DiagnosticTask];
}

export function toBlock(seed: BlockSeed): DiagnosticBlock {
  return { ...seed, maxScore: 6 };
}
