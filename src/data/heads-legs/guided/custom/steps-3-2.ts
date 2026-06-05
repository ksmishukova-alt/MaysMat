import type { DiscriminatedTaskStep } from "@/data/task-steps";
import type { WorksheetRow } from "@/data/tasks";

function ws(
  taskId: string,
  idSuffix: string,
  title: string,
  hint: string,
  rows: WorksheetRow[],
  successMessage: string,
): DiscriminatedTaskStep {
  return {
    id: `${taskId}-diag-${idSuffix}`,
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

/** 3.2: перебор мальчиков, оба вида > 0 (docx E/D+) */
export function buildSteps32(taskId: string): DiscriminatedTaskStep[] {
  return [
    ws(
      taskId,
      "facts",
      "Сколько всего пирожков",
      "9 тарелочек по 2 пирожка — сначала найди общее число.",
      [
        num("32-f1", "Сколько всего пирожков? (9 × 2)", 18, "9 × 2 ="),
        num("32-f2", "Сколько пирожков у одной девочки?", 3),
        num("32-f3", "Сколько пирожков у одного мальчика?", 4),
      ],
      "Теперь переберём число мальчиков.",
    ),
    {
      id: `${taskId}-diag-rule`,
      type: "auto_explanation",
      explanationRole: "intro",
      title: "Оба вида участвуют",
      hint: "В условии и мальчики, и девочки — у каждого вида должно быть больше 0.",
      template: [
        "Всего 18 пирожков.",
        "Девочка — 3 пирожка, мальчик — 4.",
        "Перебираем число мальчиков: остаток должен делиться на 3.",
        "Вариант «0 мальчиков» или «0 девочек» не подходит.",
      ],
    },
    ws(
      taskId,
      "try",
      "Перебор: сколько мальчиков?",
      "Если мальчиков 1 или 2 — остаток не делится на 3. Проверь 3.",
      [
        note("32-n1", "✗ Мальчиков 1: осталось 14 — не делится на 3"),
        note("32-n2", "✗ Мальчиков 2: осталось 10 — не делится на 3"),
        num("32-t3", "Мальчиков 3 → испекли 12, осталось 6. Сколько девочек? (6 ÷ 3)", 2, "6 ÷ 3 ="),
      ],
      "Единственный вариант: 3 мальчика и 2 девочки.",
    ),
    ws(
      taskId,
      "check",
      "Проверка",
      "2 × 3 + 3 × 4 должно быть 18.",
      [num("32-v", "2 × 3 + 3 × 4 = ?", 18, "2×3 + 3×4 =")],
      "Ответ: 3 мальчика и 2 девочки.",
    ),
  ];
}
