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
    id: `${taskId}-struct-${idx}`,
    type: "worksheet_table",
    title,
    hint,
    successMessage,
    worksheetRows: rows,
  };
}

function note(id: string, text: string): WorksheetRow {
  return { id, question: text, inputType: "static", staticValue: "" };
}

function num(id: string, question: string, answer: number, prefix?: string): WorksheetRow {
  return prefix
    ? { id, question, inputType: "formula", prefix, answer }
    : { id, question, inputType: "number", answer };
}

/** Дроиды: механики = медики, затем замена солдат (docx 6.2) */
export function buildSteps62(taskId: string): DiscriminatedTaskStep[] {
  return [
    {
      id: `${taskId}-struct-types`,
      type: "drag_select",
      title: "Какие дроиды в задаче?",
      hint: "В условии три вида дроидов — выбери все три.",
      options: [
        { id: "mech", label: "Дроиды-механики", emoji: "🔧", correct: true },
        { id: "medic", label: "Дроиды-медики", emoji: "💉", correct: true },
        { id: "soldier", label: "Дроиды-солдаты", emoji: "🤖", correct: true },
        { id: "people", label: "Люди", emoji: "🧑", correct: false },
        { id: "cars", label: "Машины", emoji: "🚗", correct: false },
      ],
    },
    {
      id: `${taskId}-struct-norms`,
      type: "table_input",
      title: "Сколько рук у каждого вида?",
      hint: "Перенеси из условия: механики — 8, медики — 3, солдаты — 2.",
      tableColumnLabel: "Рук",
      rows: [
        { id: "mech", label: "Дроиды-механики", emoji: "🔧", answer: 8 },
        { id: "medic", label: "Дроиды-медики", emoji: "💉", answer: 3 },
        { id: "soldier", label: "Дроиды-солдаты", emoji: "🤖", answer: 2 },
      ],
    },
    ws(
      taskId,
      0,
      "Данные из условия",
      "Выпиши общие числа — сколько дроидов и сколько рук всего.",
      [
        num("62-f1", "Сколько всего дроидов?", 92),
        num("62-f2", "Сколько всего рук?", 275),
      ],
      "Верно! Обрати внимание: механиков и медиков поровну.",
    ),
    {
      id: `${taskId}-struct-pair`,
      type: "auto_explanation",
      explanationRole: "intro",
      title: "Пара «механик + медик»",
      hint: "Механиков и медиков одинаковое количество — объединим их в пары.",
      template: [
        "Дроидов-механиков и дроидов-медиков поровну.",
        "Один механик + один медик = 2 дроида и 8 + 3 = 11 рук.",
        "Дальше считаем, как в обычной задаче на замену: представим, что все 92 дроида — солдаты.",
      ],
    },
    ws(
      taskId,
      1,
      "Пробная картина: все — солдаты",
      "Если все 92 дроида — солдаты (по 2 руки у каждого).",
      [
        num("62-a", "Сколько рук было бы у 92 солдат?", 184, "92 × 2 ="),
        num("62-b", "Сколько рук по условию?", 275),
      ],
      "Сравним с условием.",
    ),
    ws(
      taskId,
      2,
      "Лишние руки и шаг замены",
      "Пара «механик + медик» вместо двух солдат добавляет 11 − 2×2 = 7 рук.",
      [
        num("62-c", "Сколько лишних рук? (275 − 184)", 91, "275 − 184 ="),
        num("62-d", "На сколько рук больше даёт пара «механик + медик», чем 2 солдата?", 7, "11 − 2 × 2 ="),
        num("62-e", "Сколько таких пар? (91 ÷ 7)", 13, "91 ÷ 7 ="),
      ],
      "В каждой паре — 1 механик и 1 медик.",
    ),
    ws(
      taskId,
      3,
      "Сколько дроидов каждого вида",
      "13 пар → 13 механиков и 13 медиков. Остальные — солдаты.",
      [
        num("62-f", "Сколько дроидов-механиков?", 13),
        num("62-g", "Сколько дроидов-медиков?", 13),
        num("62-h", "Сколько дроидов-солдат? (92 − 13 − 13)", 66, "92 − 13 − 13 ="),
      ],
      "Ответ: 13 механиков, 13 медиков и 66 солдат.",
    ),
    ws(
      taskId,
      4,
      "Проверка",
      "Подставь числа: 13×8 + 13×3 + 66×2 должно быть 275.",
      [
        num("62-v", "13 × 8 + 13 × 3 + 66 × 2 = ?", 275, "13×8 + 13×3 + 66×2 ="),
      ],
      "Всё сходится!",
    ),
  ];
}
