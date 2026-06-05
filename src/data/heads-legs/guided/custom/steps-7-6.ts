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

/** 7.6: данных не хватает — разные ответы (docx D) */
export function buildSteps76(taskId: string): DiscriminatedTaskStep[] {
  return [
    {
      id: `${taskId}-diag-types`,
      type: "drag_select",
      title: "Кто в пещере?",
      hint: "Выбери оба вида из условия.",
      options: [
        { id: "cent", label: "Одноголовые сороконожки", emoji: "🐛", correct: true },
        { id: "drag", label: "Пятиголовые драконы", emoji: "🐉", correct: true },
        { id: "spider", label: "Пауки", emoji: "🕷️", correct: false },
      ],
    },
    ws(
      taskId,
      "facts",
      "Что известно",
      "Выпиши числа из условия.",
      [
        num("76-f1", "Сколько всего ног?", 420),
        num("76-f2", "Голов у одной сороконожки?", 1),
        num("76-f3", "Голов у одного дракона?", 5),
      ],
      "Голов у сороконожек столько же, сколько у драконов — но всего голов не сказано.",
    ),
    {
      id: `${taskId}-diag-sufficient`,
      type: "single_select",
      title: "Хватает ли данных?",
      selectPrompt: "Можно ли однозначно узнать, сколько ног у пятиголового дракона?",
      context: "Не придумывай число, которого нет в условии.",
      options: [
        { id: "no", label: "Нет — ответов может быть несколько", emoji: "⚠️", correct: true },
        { id: "yes", label: "Да — один ответ", emoji: "✓", correct: false },
      ],
      successMessage: "Верно! Нужны примеры с разным числом драконов.",
    },
    {
      id: `${taskId}-diag-intro`,
      type: "auto_explanation",
      explanationRole: "intro",
      title: "Почему ответ не один",
      hint: "Сороконожек в 5 раз больше, чем драконов, но без «всего существ» число драконов любое.",
      template: [
        "Голов у сороконожек = голов у драконов → сороконожек в 5 раз больше.",
        "Не сказано, сколько всего существ или голов.",
        "Можно взять 2 драконов, 10 сороконожек — и получить одно число ног у дракона.",
        "Другой пример даст другой ответ.",
      ],
    },
    ws(
      taskId,
      "ex1",
      "Пример 1: 2 дракона",
      "У сороконожки 40 ног. Если драконов 2, сороконожек 10.",
      [
        num("76-e1", "Сороконожек (2 × 5)", 10, "2 × 5 ="),
        num("76-e2", "Ног у сороконожек (10 × 40)", 400, "10 × 40 ="),
        num("76-e3", "Ног у драконов (420 − 400)", 20, "420 − 400 ="),
        num("76-e4", "Ног у одного дракона (20 ÷ 2)", 10, "20 ÷ 2 ="),
      ],
      "При 2 драконах — 10 ног у каждого.",
    ),
    ws(
      taskId,
      "ex2",
      "Пример 2: 1 дракон",
      "Если дракон один, сороконожек пять.",
      [
        num("76-g1", "Сороконожек", 5),
        num("76-g2", "Ног у сороконожек (5 × 40)", 200, "5 × 40 ="),
        num("76-g3", "Ног у одного дракона (420 − 200)", 220, "420 − 200 ="),
      ],
      "При 1 драконе — 220 ног у дракона.",
    ),
    ws(
      taskId,
      "summary",
      "Два разных ответа",
      "Запиши оба варианта в тексте решения.",
      [
        num("76-s1", "Ног у дракона, если драконов 2", 10),
        num("76-s2", "Ног у дракона, если дракон 1", 220),
      ],
      "Ответ не единственный — это нормально для этой задачи.",
    ),
  ];
}
