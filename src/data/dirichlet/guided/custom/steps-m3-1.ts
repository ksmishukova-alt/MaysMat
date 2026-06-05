import type { DiscriminatedTaskStep } from "@/data/task-steps";

/** M3.1 — монеты 1₽ и 2₽ в кармане Пети (не стандартный «неудачник») */
export function buildStepsM31(taskId: string): DiscriminatedTaskStep[] {
  return [
    {
      id: `${taskId}-rule3`,
      type: "single_select",
      title: "Правило для трёх монет",
      selectPrompt: "Среди любых 3 монет есть 1 ₽. Сколько монет НЕ «1 рубль» может быть в кармане?",
      options: [
        { id: "atmost2", label: "Не больше 2 (иначе можно выбрать 3 не-рублёвые)", emoji: "✅", correct: true },
        { id: "any", label: "Сколько угодно", emoji: "❌", correct: false },
      ],
    },
    {
      id: `${taskId}-rule4`,
      type: "single_select",
      title: "Правило для четырёх монет",
      selectPrompt: "Среди любых 4 монет есть 2 ₽. Сколько монет НЕ «2 рубля» может быть?",
      options: [
        { id: "atmost3", label: "Не больше 3", emoji: "✅", correct: true },
        { id: "atmost2", label: "Не больше 2", emoji: "❌", correct: false },
      ],
    },
    {
      id: `${taskId}-count5`,
      type: "worksheet_table",
      title: "Пять вытащенных монет",
      hint: "Среди 5 монет: минимум 3 — по 1 ₽, минимум 2 — по 2 ₽. 3+2=5 — других нет.",
      successMessage: "Верно!",
      worksheetRows: [
        {
          id: "ones",
          question: "Монет «1 рубль»:",
          inputType: "number",
          answer: 3,
        },
        {
          id: "twos",
          question: "Монет «2 рубля»:",
          inputType: "number",
          answer: 2,
        },
      ],
    },
    {
      id: `${taskId}-answer`,
      type: "single_select",
      title: "Назови монеты",
      selectPrompt: "Какие 5 монет вытащил Петя?",
      options: [
        {
          id: "ok",
          label: "1₽, 1₽, 1₽, 2₽, 2₽",
          emoji: "✅",
          correct: true,
        },
        {
          id: "wrong",
          label: "2₽, 2₽, 2₽, 1₽, 1₽ — только две единичные",
          emoji: "❌",
          correct: false,
        },
      ],
    },
  ];
}
