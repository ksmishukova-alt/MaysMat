import type { DiscriminatedTaskStep } from "@/data/task-steps";

/** M2.3 — 600 сапог, 100 пар одного размера */
export function buildStepsM23(taskId: string): DiscriminatedTaskStep[] {
  return [
    {
      id: `${taskId}-cells`,
      type: "single_select",
      title: "Клетки — типы сапог",
      selectPrompt: "По каким «клеткам» делим 600 сапог?",
      options: [
        {
          id: "six",
          label: "6 типов: 41L, 41R, 42L, 42R, 43L, 43R",
          emoji: "✅",
          correct: true,
        },
        {
          id: "three",
          label: "3 размера: 41, 42, 43",
          emoji: "❌",
          correct: false,
        },
      ],
    },
    {
      id: `${taskId}-dominant`,
      type: "auto_explanation",
      title: "Доминирующая сторона",
      template: [
        "В каждом размере либо левых не меньше, либо правых не меньше.",
        "Отметим «доминирующую» сторону в каждом из 3 размеров — получим 3 метки (L или R).",
        "По Дирихле: среди 3 меток две одинаковые — скажем, «левый» в 41 и 42.",
      ],
    },
    {
      id: `${taskId}-pairs`,
      type: "worksheet_table",
      title: "Считаем пары",
      hint: "Левых сапог 41-го и 42-го размеров вместе — не меньше 100 (в 43-м левых ≤200).",
      successMessage: "Верно!",
      worksheetRows: [
        {
          id: "min-pairs",
          question: "Минимум годных пар в двух размерах с доминирующей левой стороной:",
          inputType: "number",
          answer: 100,
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
          label: "Можно составить не менее 100 годных пар",
          emoji: "✅",
          correct: true,
        },
        {
          id: "no",
          label: "Пар может быть меньше 100",
          emoji: "❌",
          correct: false,
        },
      ],
    },
  ];
}
