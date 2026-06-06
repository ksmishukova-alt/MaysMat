import type { DiscriminatedTaskStep } from "@/data/task-steps";
import type { WorksheetRow } from "@/data/tasks";

function ws(
  taskId: string,
  suffix: "calc-1" | "calc-2" | "calc-3",
  title: string,
  hint: string,
  rows: WorksheetRow[],
  successMessage: string,
): DiscriminatedTaskStep {
  return {
    id: `${taskId}-${suffix}`,
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

function note(id: string, text: string): WorksheetRow {
  return { id, question: text, inputType: "static", staticValue: "" };
}

/** 4.3: открытки — пробная картина «все по 2», без смешения с «по 3» */
export function buildSteps43(taskId: string): DiscriminatedTaskStep[] {
  return [
    ws(
      taskId,
      "calc-1",
      "Пробная картина",
      "Сначала представим самый простой вариант: все девочки получили одинаково.",
      [
        note("43-intro", "Представим, что каждая девочка получила по 2 открытки."),
        num("43-girls", "Сколько девочек всего?", 12),
        num(
          "43-trial",
          "Сколько открыток было бы, если все 12 девочек получили по 2 открытки?",
          24,
          "12 × 2 =",
        ),
        num("43-total", "Сколько открыток всего по условию задачи?", 25),
      ],
      "Верно! Сравним с условием.",
    ),
    ws(
      taskId,
      "calc-2",
      "Сравнение и разница",
      "Сравни с условием, найди разницу и шаг замены.",
      [
        num("43-diff", "На сколько открыток не хватает до 25? (25 − 24)", 1, "25 − 24 ="),
        num(
          "43-step",
          "Одна девочка с 3 открытками добавляет сколько открыток? (3 − 2)",
          1,
          "3 − 2 =",
        ),
      ],
      "Отлично! Осталось записать ответ.",
    ),
    ws(
      taskId,
      "calc-3",
      "Шаг замены и ответ",
      "Запиши итоговые количества.",
      [num("43-answer", "Сколько девочек получили по 3 открытки?", 1)],
      "Числовой ответ готов!",
    ),
  ];
}
