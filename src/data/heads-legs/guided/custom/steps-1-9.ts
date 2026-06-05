import type { DiscriminatedTaskStep } from "@/data/task-steps";
import type { WorksheetRow } from "@/data/tasks";

function ws(
  taskId: string,
  idx: number,
  title: string,
  hint: string,
  rows: WorksheetRow[],
  successMessage: string,
): DiscriminatedTaskStep {
  return {
    id: `${taskId}-hl19-${idx}`,
    type: "worksheet_table",
    title,
    hint,
    successMessage,
    worksheetRows: rows,
  };
}

function num(id: string, question: string, answer: number, prefix?: string): WorksheetRow {
  return prefix
    ? { id, question, inputType: "formula", prefix, answer }
    : { id, question, inputType: "number", answer };
}

/** 1.9: сначала 20 ног → 10 существ, затем метод замены по рукам (аудит P2) */
export function buildSteps19(taskId: string): DiscriminatedTaskStep[] {
  return [
    ws(
      taskId,
      0,
      "От ног — к числу существ",
      "У каждого по 2 ноги — делим общее число ног на 2.",
      [
        num("19-legs", "Сколько ног у каждого существа?", 2),
        num("19-creatures", "Сколько всего существ? (20 ÷ 2)", 10, "20 ÷ 2 ="),
      ],
      "Теперь считаем по рукам.",
    ),
    ws(
      taskId,
      1,
      "Пробная картина: все дроиды",
      "Представим, что все 10 существ — дроиды (по 2 руки).",
      [
        num("19-a", "Сколько рук было бы у 10 дроидов? (10 × 2)", 20, "10 × 2 ="),
        num("19-b", "Сколько рук по условию?", 26),
      ],
      "Сравним с условием.",
    ),
    ws(
      taskId,
      2,
      "Лишние руки и замена",
      "Генерал Гривус добавляет 4 − 2 = 2 лишние руки по сравнению с дроидом.",
      [
        num("19-c", "Сколько лишних рук? (26 − 20)", 6, "26 − 20 ="),
        num("19-d", "На сколько рук больше у Гривуса, чем у дроида?", 2, "4 − 2 ="),
        num("19-e", "Сколько генералов Гривуса? (6 ÷ 2)", 3, "6 ÷ 2 ="),
      ],
      "Остальные — дроиды.",
    ),
    ws(
      taskId,
      3,
      "Ответ",
      "Из 10 существ вычти генералов Гривуса.",
      [num("19-f", "Сколько дроидов? (10 − 3)", 7, "10 − 3 =")],
      "Ответ: 7 дроидов.",
    ),
  ];
}
