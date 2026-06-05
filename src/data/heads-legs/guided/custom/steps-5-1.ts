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
    id: `${taskId}-hl51-${idx}`,
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

/** 5.1: переключение признака ноги → рога (аудит P2) */
export function buildSteps51(taskId: string): DiscriminatedTaskStep[] {
  return [
    {
      id: `${taskId}-hl51-switch`,
      type: "auto_explanation",
      explanationRole: "intro",
      title: "Переключаем признак",
      hint: "Сначала узнаём число животных по ногам, потом считаем рога.",
      template: [
        "В задаче два признака: ноги (одинаково у всех — по 4) и рога (у единорога 1, у антилопы 2).",
        "Сначала по ногам: 88 ÷ 4 = 22 животных.",
        "Затем переключаемся на рога и применяем метод замены.",
      ],
    },
    ws(
      taskId,
      0,
      "Шаг 1: сколько животных",
      "У каждого животного по 4 ноги.",
      [
        num("51-a", "Сколько ног у каждого животного?", 4),
        num("51-b", "Сколько всего животных? (88 ÷ 4)", 22, "88 ÷ 4 ="),
      ],
      "Теперь считаем рога.",
    ),
    ws(
      taskId,
      1,
      "Шаг 2: пробная картина по рогам",
      "Представим, что все 22 животных — единороги (по 1 рогу).",
      [
        num("51-c", "Сколько рогов было бы? (22 × 1)", 22, "22 × 1 ="),
        num("51-d", "Сколько рогов по условию?", 35),
      ],
      "Сравним с 35.",
    ),
    ws(
      taskId,
      2,
      "Лишние рога и замена",
      "Антилопа добавляет 2 − 1 = 1 лишний рог.",
      [
        num("51-e", "Сколько лишних рогов? (35 − 22)", 13, "35 − 22 ="),
        num("51-f", "На сколько рогов больше у антилопы?", 1, "2 − 1 ="),
        num("51-g", "Сколько антилоп?", 13),
      ],
      "Остальные — единороги.",
    ),
    ws(
      taskId,
      3,
      "Ответ",
      "Из 22 животных вычти антилоп.",
      [num("51-h", "Сколько единорогов? (22 − 13)", 9, "22 − 13 =")],
      "Ответ: 9 единорогов.",
    ),
  ];
}
