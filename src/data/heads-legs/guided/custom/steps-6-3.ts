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
    id: `${taskId}-enum-${idx}`,
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

/** Перебор: 3 типа кораблей, лишние залпы (docx 6.3) */
export function buildSteps63(taskId: string): DiscriminatedTaskStep[] {
  return [
    {
      id: `${taskId}-enum-types`,
      type: "drag_select",
      title: "Какие корабли в задаче?",
      hint: "В условии три типа кораблей — выбери все три.",
      options: [
        { id: "fighter", label: "Истребители", emoji: "🚀", correct: true },
        { id: "cruiser", label: "Крейсеры", emoji: "🛸", correct: true },
        { id: "flagship", label: "Флагманы", emoji: "⭐", correct: true },
        { id: "transport", label: "Транспорты", emoji: "🚢", correct: false },
        { id: "satellite", label: "Спутники", emoji: "🛰️", correct: false },
      ],
    },
    {
      id: `${taskId}-enum-norms`,
      type: "table_input",
      title: "Сколько залпов нужно на каждый тип?",
      hint: "Перенеси из условия: истребитель — 3, крейсер — 7, флагман — 9.",
      tableColumnLabel: "Залпов",
      rows: [
        { id: "fighter", label: "Истребитель", emoji: "🚀", answer: 3 },
        { id: "cruiser", label: "Крейсер", emoji: "🛸", answer: 7 },
        { id: "flagship", label: "Флагман", emoji: "⭐", answer: 9 },
      ],
    },
    ws(
      taskId,
      0,
      "Данные из условия",
      "Выпиши, сколько залпов сделали и сколько кораблей уничтожили.",
      [
        num("63-f1", "Сколько всего залпов?", 61),
        num("63-f2", "Сколько кораблей уничтожено?", 11),
      ],
      "Верно! Начнём с пробной картины.",
    ),
    ws(
      taskId,
      1,
      "Пробная картина: все — истребители",
      "Если все 11 кораблей — истребители (по 3 залпа).",
      [
        num("63-a", "Сколько залпов было бы? (11 × 3)", 33, "11 × 3 ="),
        num("63-b", "Сколько залпов по условию?", 61),
      ],
      "Сравним с условием.",
    ),
    ws(
      taskId,
      2,
      "Лишние залпы и шаги замены",
      "Крейсер вместо истребителя +4 залпа, флагман вместо истребителя +6 залпов.",
      [
        num("63-c", "Сколько лишних залпов? (61 − 33)", 28, "61 − 33 ="),
        num("63-d", "Крейсер вместо истребителя добавляет залпов", 4, "7 − 3 ="),
        num("63-e", "Флагман вместо истребителя добавляет залпов", 6, "9 − 3 ="),
      ],
      "Нужно набрать 28 лишних залпов комбинациями +4 и +6.",
    ),
    ws(
      taskId,
      3,
      "Вариант 1 — запиши полный состав флота",
      "7 крейсеров вместо истребителей дают 28 лишних залпов.",
      [
        num("63-v1-f", "Истребителей", 4),
        num("63-v1-c", "Крейсеров", 7),
        num("63-v1-g", "Флагманов", 0),
      ],
      "Проверка: 4×3 + 7×7 = 61. Сумма кораблей 11.",
    ),
    ws(
      taskId,
      4,
      "Вариант 2 — запиши полный состав флота",
      "4 крейсера и 2 флагмана дают 28 лишних залпов.",
      [
        num("63-v2-f", "Истребителей", 5),
        num("63-v2-c", "Крейсеров", 4),
        num("63-v2-g", "Флагманов", 2),
      ],
      "Проверка: 5×3 + 4×7 + 2×9 = 61.",
    ),
    ws(
      taskId,
      5,
      "Вариант 3 — запиши полный состав флота",
      "1 крейсер и 4 флагмана дают 28 лишних залпов.",
      [
        num("63-v3-f", "Истребителей", 6),
        num("63-v3-c", "Крейсеров", 1),
        num("63-v3-g", "Флагманов", 4),
      ],
      "Три полных ответа — запиши все в тексте решения.",
    ),
  ];
}
