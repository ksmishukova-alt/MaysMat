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

/** 6.5: перебор лет трёх мастеров — найди все варианты */
export function buildSteps65(taskId: string): DiscriminatedTaskStep[] {
  return [
    {
      id: `${taskId}-diag-types`,
      type: "drag_select",
      title: "Кто обучал юнлингов?",
      hint: "Выбери всех трёх мастеров из условия.",
      options: [
        { id: "yoda", label: "Йода", emoji: "🟢", correct: true },
        { id: "obi", label: "Оби-Ван", emoji: "⚔️", correct: true },
        { id: "quigon", label: "Квай-Гон", emoji: "🗡️", correct: true },
        { id: "anakin", label: "Анакин", emoji: "❌", correct: false },
      ],
    },
    {
      id: `${taskId}-struct-norms`,
      type: "table_input",
      title: "Сколько юнлингов за год?",
      hint: "Йода — 23, Оби-Ван — 20, Квай-Гон — 25.",
      tableColumnLabel: "Юнлингов/год",
      rows: [
        { id: "yoda", label: "Йода", emoji: "🟢", answer: 23 },
        { id: "obi", label: "Оби-Ван", emoji: "⚔️", answer: 20 },
        { id: "quigon", label: "Квай-Гон", emoji: "🗡️", answer: 25 },
      ],
    },
    ws(
      taskId,
      "facts",
      "Данные из условия",
      "30 лет, каждый год учил только один мастер. Всего 643 юнлинга.",
      [
        num("65-f1", "Сколько всего лет?", 30),
        num("65-f2", "Сколько всего юнлингов?", 643),
      ],
      "Если бы все 30 лет учил Оби-Ван (по 20 в год)…",
    ),
    ws(
      taskId,
      "trial",
      "Пробная картина: все годы — Оби-Ван",
      "30 × 20 = 600 — меньше, чем 643.",
      [
        num("65-a", "Сколько юнлингов было бы? (30 × 20)", 600, "30 × 20 ="),
        num("65-b", "Лишних юнлингов (643 − 600)", 43, "643 − 600 ="),
        num("65-c", "Год Йоды вместо Оби-Вана добавляет", 3, "23 − 20 ="),
        num("65-d", "Год Квай-Гона вместо Оби-Вана добавляет", 5, "25 − 20 ="),
      ],
      "Нужно набрать 43 из комбинаций +3 и +5 за 30 лет.",
    ),
    ws(
      taskId,
      "enum1",
      "Вариант 1 — сколько лет каждый мастер",
      "11×3 + 2×5 = 43 лишних юнлинга.",
      [
        num("65-v1-y", "Лет Йода", 11),
        num("65-v1-o", "Лет Оби-Ван (30 − 11 − 2)", 17, "30 − 11 − 2 ="),
        num("65-v1-q", "Лет Квай-Гон", 2),
      ],
      "Проверка: 11×23 + 17×20 + 2×25 = 643.",
    ),
    ws(
      taskId,
      "enum2",
      "Вариант 2 — сколько лет каждый мастер",
      "6×3 + 5×5 = 43 лишних юнлинга.",
      [
        num("65-v2-y", "Лет Йода", 6),
        num("65-v2-o", "Лет Оби-Ван (30 − 6 − 5)", 19, "30 − 6 − 5 ="),
        num("65-v2-q", "Лет Квай-Гон", 5),
      ],
      "Второй подходящий вариант.",
    ),
    ws(
      taskId,
      "enum3",
      "Вариант 3 — сколько лет каждый мастер",
      "1×3 + 8×5 = 43 лишних юнлинга.",
      [
        num("65-v3-y", "Лет Йода", 1),
        num("65-v3-o", "Лет Оби-Ван (30 − 1 − 8)", 21, "30 − 1 − 8 ="),
        num("65-v3-q", "Лет Квай-Гон", 8),
      ],
      "Найди все три варианта — запиши в тексте решения.",
    ),
  ];
}
