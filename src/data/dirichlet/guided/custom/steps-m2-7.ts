import type { DiscriminatedTaskStep } from "@/data/task-steps";

/** M2.7 — 35 задач, 10 школьников, найти того, кто решил ≥5 */
export function buildStepsM27(taskId: string): DiscriminatedTaskStep[] {
  return [
    {
      id: `${taskId}-exclude`,
      type: "worksheet_table",
      title: "Исключаем «особых» школьников",
      hint: "Есть ученики с ровно 1, 2 и 3 задачами — их задачи не пересекаются с остальными?",
      successMessage: "Верно!",
      worksheetRows: [
        {
          id: "left-tasks",
          question: "35 − (1 + 2 + 3) = задач у остальных:",
          inputType: "number",
          answer: 29,
          prefix: "35 − 6 =",
        },
        {
          id: "left-students",
          question: "10 − 3 = школьников без «1, 2, 3»:",
          inputType: "number",
          answer: 7,
          prefix: "10 − 3 =",
        },
      ],
    },
    {
      id: `${taskId}-dirichlet`,
      type: "worksheet_table",
      title: "Дирихле на 29 задач и 7 школьников",
      hint: "29 = 4×7 + 1 — если бы у каждого было ≤4 задач, сумма была бы ≤28.",
      successMessage: "Нашли!",
      worksheetRows: [
        {
          id: "quotient",
          question: "29 ÷ 7 = (целая часть)",
          inputType: "number",
          answer: 4,
        },
        {
          id: "min-five",
          question: "Минимум задач у одного из семи:",
          inputType: "number",
          answer: 5,
        },
      ],
    },
    {
      id: `${taskId}-conclusion`,
      type: "single_select",
      title: "Вывод",
      selectPrompt: "Что доказали?",
      options: [
        {
          id: "ok",
          label: "Есть школьник, решивший не менее пяти задач",
          emoji: "✅",
          correct: true,
        },
        {
          id: "four",
          label: "Достаточно четырёх задач у каждого",
          emoji: "❌",
          correct: false,
        },
      ],
    },
  ];
}
