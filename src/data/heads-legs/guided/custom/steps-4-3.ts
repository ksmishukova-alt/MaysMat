import type { DiscriminatedTaskStep } from "@/data/task-steps";

/** 4.3: короткий transfer-сценарий — только выбор пробного предположения */
export function buildTransferAssumeStep43(taskId: string): DiscriminatedTaskStep {
  return {
    id: `${taskId}-assume`,
    type: "single_select",
    title: "Выбери пробное предположение",
    context:
      "Начнём с меньшего числа открыток на девочку — так проще увидеть, сколько «не хватает» до суммы из условия.",
    selectPrompt: "Какое пробное предположение подходит для этого шага?",
    options: [
      {
        id: "all-2",
        label: "Представить, что все девочки получили по 2 открытки.",
        emoji: "💌",
        correct: true,
      },
      {
        id: "all-3",
        label: "Представить, что все девочки получили по 3 открытки.",
        emoji: "💐",
        correct: false,
      },
      {
        id: "sum-23",
        label: "Сложить 2 и 3.",
        emoji: "➕",
        correct: false,
      },
    ],
    successMessage: "Верно! Запиши решение с пропусками.",
  };
}
