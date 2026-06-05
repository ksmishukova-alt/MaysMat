import type { DiscriminatedTaskStep } from "@/data/task-steps";

/** M2.5 — сколько рядов в зале кинотеатра */
export function buildStepsM25(taskId: string): DiscriminatedTaskStep[] {
  return [
    {
      id: `${taskId}-cond1`,
      type: "single_select",
      title: "Условие про 30 человек",
      selectPrompt: "Класс из 30 человек — в каком-то ряду ≥2 одноклассника. Что следует про число рядов R?",
      context: "Если R ≥ 30, можно посадить по одному в каждый ряд — тогда нигде не будет двух в одном ряду.",
      options: [
        { id: "le29", label: "R ≤ 29 (рядов не больше 29)", emoji: "✅", correct: true },
        { id: "ge30", label: "R ≥ 30", emoji: "❌", correct: false },
      ],
    },
    {
      id: `${taskId}-cond2`,
      type: "single_select",
      title: "Условие про 26 человек",
      selectPrompt: "Класс из 26 — минимум 3 пустых ряда. Что следует про R?",
      context: "Если R ≤ 28, можно рассадить 26 человек так, что пустых рядов ≤ 2.",
      options: [
        { id: "ge29", label: "R ≥ 29 (рядов не меньше 29)", emoji: "✅", correct: true },
        { id: "le28", label: "R ≤ 28", emoji: "❌", correct: false },
      ],
    },
    {
      id: `${taskId}-answer`,
      type: "number_input",
      title: "Сколько рядов?",
      question: "R =",
      answer: 29,
      successMessage: "В зале ровно 29 рядов!",
    },
  ];
}
