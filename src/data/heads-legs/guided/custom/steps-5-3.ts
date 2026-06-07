import type { DiscriminatedTaskStep } from "@/data/task-steps";

/** 5.3: transfer — выбор знакомого метода замены */
export function buildTransferMethodStep53(taskId: string): DiscriminatedTaskStep {
  return {
    id: `${taskId}-transfer-method`,
    type: "single_select",
    title: "Выбери метод",
    context: "Какой метод здесь подходит?",
    selectPrompt: "Какой метод здесь подходит?",
    options: [
      {
        id: "assume-all",
        label: "А. Представить, что все существа одного вида.",
        emoji: "🔄",
        correct: true,
      },
      {
        id: "worst-case",
        label: "Б. Искать самый неудачный случай.",
        emoji: "🎲",
        correct: false,
      },
      {
        id: "remainders",
        label: "В. Разложить числа по остаткам.",
        emoji: "📦",
        correct: false,
      },
      {
        id: "not-enough",
        label: "Г. Данных не хватает.",
        emoji: "❓",
        correct: false,
      },
    ],
    successMessage: "Верно! Теперь запиши решение примерами.",
  };
}
