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

/** 7.4: равенство голов + 40 ног у сороконожки (docx) */
export function buildSteps74(taskId: string): DiscriminatedTaskStep[] {
  return [
    {
      id: `${taskId}-struct-types`,
      type: "drag_select",
      title: "Кто живёт в пещере?",
      hint: "Выбери оба вида существ из условия.",
      options: [
        { id: "cent", label: "Двухголовые сороконожки", emoji: "🐛", correct: true },
        { id: "drag", label: "Трёхголовые драконы", emoji: "🐉", correct: true },
        { id: "fish", label: "Рыбы", emoji: "🐟", correct: false },
        { id: "people", label: "Люди", emoji: "🧑", correct: false },
      ],
    },
    {
      id: `${taskId}-struct-norms`,
      type: "table_input",
      title: "Сколько голов у каждого вида?",
      hint: "Перенеси из условия: у сороконожки 2 головы, у дракона 3.",
      tableColumnLabel: "Голов",
      rows: [
        { id: "cent", label: "Сороконожка", emoji: "🐛", answer: 2 },
        { id: "drag", label: "Дракон", emoji: "🐉", answer: 3 },
      ],
    },
    ws(
      taskId,
      0,
      "Данные из условия",
      "Выпиши общие числа — сколько голов и ног всего.",
      [
        num("74-f1", "Сколько всего голов?", 36),
        num("74-f2", "Сколько всего ног?", 396),
      ],
      "Верно! Голов у всех сороконожек столько же, сколько у всех драконов.",
    ),
    {
      id: `${taskId}-struct-intro`,
      type: "auto_explanation",
      explanationRole: "intro",
      title: "Равенство голов",
      hint: "Сначала делим 36 голов попол между видами, потом считаем ноги.",
      template: [
        "Голов у всех сороконожек = голов у всех драконов.",
        "Всего 36 голов → по 18 голов у каждого вида.",
        "У одной сороконожки 40 ног — это нужно вспомнить самому.",
      ],
    },
    ws(
      taskId,
      1,
      "Сколько существ каждого вида",
      "18 голов ÷ 2 = сороконожки; 18 голов ÷ 3 = драконы.",
      [
        num("74-a", "Сколько голов у всех сороконожек? (36 ÷ 2)", 18, "36 ÷ 2 ="),
        num("74-b", "Сколько сороконожек? (18 ÷ 2)", 9, "18 ÷ 2 ="),
        num("74-c", "Сколько драконов? (18 ÷ 3)", 6, "18 ÷ 3 ="),
      ],
      "Теперь посчитаем ноги.",
    ),
    ws(
      taskId,
      2,
      "Ноги сороконожек и драконов",
      "У одной сороконожки 40 ног. Остальные ноги — у драконов.",
      [
        num("74-d", "Сколько ног у одной сороконожки?", 40),
        num("74-e", "Сколько ног у всех сороконожек? (9 × 40)", 360, "9 × 40 ="),
        num("74-f", "Сколько ног у всех драконов? (396 − 360)", 36, "396 − 360 ="),
        num("74-g", "Сколько ног у одного дракона? (36 ÷ 6)", 6, "36 ÷ 6 ="),
      ],
      "Ответ: у трёхголового дракона 6 ног.",
    ),
  ];
}
