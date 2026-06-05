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
    id: `${taskId}-hl114-${idx}`,
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

/** 1.14: вычитание ног людей 120 − 44 = 76, затем замена (аудит P2) */
export function buildSteps114(taskId: string): DiscriminatedTaskStep[] {
  return [
    ws(
      taskId,
      0,
      "Ноги людей и мебели",
      "На 22 предмета сели 22 человека — у каждого по 2 ноги.",
      [
        num("114-a", "Сколько человек сели?", 22),
        num("114-b", "Сколько ног у людей? (22 × 2)", 44, "22 × 2 ="),
        num("114-c", "Сколько ног у стульев и табуреток? (120 − 44)", 76, "120 − 44 ="),
      ],
      "Дальше — метод замены только для мебели.",
    ),
    ws(
      taskId,
      1,
      "Пробная картина: все табуретки",
      "Представим, что все 22 предмета — трёхногие табуретки.",
      [
        num("114-d", "Сколько ног у мебели было бы? (22 × 3)", 66, "22 × 3 ="),
        num("114-e", "Сколько ног у мебели по расчёту?", 76),
      ],
      "Сравним с 76.",
    ),
    ws(
      taskId,
      2,
      "Лишние ноги и замена",
      "Стул (4 ноги) добавляет на 1 ногу больше, чем табуретка (3 ноги).",
      [
        num("114-f", "Сколько лишних ног? (76 − 66)", 10, "76 − 66 ="),
        num("114-g", "На сколько ног больше у стула, чем у табуретки?", 1, "4 − 3 ="),
        num("114-h", "Сколько стульев?", 10),
      ],
      "Остальные предметы — табуретки.",
    ),
    ws(
      taskId,
      3,
      "Ответ",
      "Всего 22 предмета.",
      [num("114-i", "Сколько табуреток? (22 − 10)", 12, "22 − 10 =")],
      "Ответ: 12 табуреток и 10 стульев.",
    ),
  ];
}
