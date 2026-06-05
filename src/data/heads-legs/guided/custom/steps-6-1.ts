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

function num(id: string, question: string, answer: number, prefix?: string): WorksheetRow {
  return prefix
    ? { id, question, inputType: "formula", prefix, answer }
    : { id, question, inputType: "number", answer };
}

/** Базы: адмиралов в 2 раза меньше дипломатов → группа 1+2 (docx 6.1) */
export function buildSteps61(taskId: string): DiscriminatedTaskStep[] {
  return [
    {
      id: `${taskId}-struct-types`,
      type: "drag_select",
      title: "Какие базы в задаче?",
      hint: "На каждой базе захватывали генералов, адмиралов или дипломатов — выбери все три вида.",
      options: [
        { id: "gen", label: "Базы с генералами", emoji: "⭐", correct: true },
        { id: "adm", label: "Базы с адмиралами", emoji: "🎖️", correct: true },
        { id: "dip", label: "Базы с дипломатами", emoji: "🤝", correct: true },
        { id: "soldiers", label: "Базы со штурмовиками", emoji: "🪖", correct: false },
        { id: "droids", label: "Базы с дроидами", emoji: "🤖", correct: false },
      ],
    },
    {
      id: `${taskId}-struct-norms`,
      type: "table_input",
      title: "Сколько пленников на каждой базе?",
      hint: "Перенеси из условия: генералы — 12, адмиралы — 15, дипломаты — 17.",
      tableColumnLabel: "Пленников",
      rows: [
        { id: "gen", label: "Базы с генералами", emoji: "⭐", answer: 12 },
        { id: "adm", label: "Базы с адмиралами", emoji: "🎖️", answer: 15 },
        { id: "dip", label: "Базы с дипломатами", emoji: "🤝", answer: 17 },
      ],
    },
    ws(
      taskId,
      0,
      "Данные из условия",
      "Выпиши общие числа — сколько баз и сколько пленников всего.",
      [
        num("61-f1", "Сколько всего баз?", 40),
        num("61-f2", "Сколько всего пленников?", 571),
      ],
      "Верно! Адмиралов было в два раза меньше, чем дипломатов.",
    ),
    {
      id: `${taskId}-struct-group`,
      type: "auto_explanation",
      explanationRole: "intro",
      title: "Группа «1 адмирал + 2 дипломата»",
      hint: "Адмиралов в 2 раза меньше дипломатов — объединим их в группу из 3 баз.",
      template: [
        "Адмиралов было в два раза меньше, чем дипломатов.",
        "Одна база с адмиралами + две базы с дипломатами = 3 базы и 15 + 17 + 17 = 49 пленников.",
        "Дальше считаем замену: представим, что все 40 баз — с генералами.",
      ],
    },
    ws(
      taskId,
      1,
      "Пробная картина: все базы — с генералами",
      "Если на каждой из 40 баз по 12 генералов.",
      [
        num("61-a", "Сколько пленников было бы? (40 × 12)", 480, "40 × 12 ="),
        num("61-b", "Сколько пленников по условию?", 571),
      ],
      "Сравним с условием.",
    ),
    ws(
      taskId,
      2,
      "Лишние пленники и шаг замены",
      "Группа «1 адмирал + 2 дипломата» вместо 3 генеральских баз добавляет 49 − 3×12 = 13 пленников.",
      [
        num("61-c", "Сколько лишних пленников? (571 − 480)", 91, "571 − 480 ="),
        num("61-d", "На сколько пленников больше даёт группа, чем 3 базы с генералами?", 13, "49 − 3 × 12 ="),
        num("61-e", "Сколько таких групп? (91 ÷ 13)", 7, "91 ÷ 13 ="),
      ],
      "В каждой группе — 1 база с адмиралами и 2 с дипломатами.",
    ),
    ws(
      taskId,
      3,
      "Сколько баз каждого вида",
      "7 групп → 7 баз с адмиралами и 14 с дипломатами. Остальные — с генералами.",
      [
        num("61-f", "Сколько баз с адмиралами?", 7),
        num("61-g", "Сколько баз с дипломатами?", 14),
        num("61-h", "Сколько баз с генералами? (40 − 7 − 14)", 19, "40 − 7 − 14 ="),
      ],
      "Ответ: 19 × 12 = 228 генералов.",
    ),
    ws(
      taskId,
      4,
      "Проверка",
      "Подставь: 19×12 + 7×15 + 14×17 должно быть 571.",
      [
        num("61-v", "19 × 12 + 7 × 15 + 14 × 17 = ?", 571, "19×12 + 7×15 + 14×17 ="),
      ],
      "Всё сходится!",
    ),
  ];
}
