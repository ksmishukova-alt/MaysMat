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
    id: `${taskId}-hl55-${idx}`,
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

/** 5.5: конечности vs ноги → 120 − 88 = 32 руки (аудит P2) */
export function buildSteps55(taskId: string): DiscriminatedTaskStep[] {
  return [
    {
      id: `${taskId}-hl55-limbs`,
      type: "auto_explanation",
      explanationRole: "intro",
      title: "Конечности и ноги — разные вещи",
      hint: "У водолаза 4 конечности (2 руки + 2 ноги), у осьминога 8 ног.",
      template: [
        "Конечностей видно 120 — это и руки, и ноги водолазов, и ноги осьминогов.",
        "Ног — 88: у осьминога все конечности считаются ногами, у водолаза только 2 из 4.",
        "Разница 120 − 88 = 32 — это руки водолазов (у осьминогов рук нет).",
      ],
    },
    ws(
      taskId,
      0,
      "От конечностей к рукам",
      "Вычти ноги из всех конечностей — получишь руки водолазов.",
      [
        num("55-a", "Сколько всего конечностей?", 120),
        num("55-b", "Сколько всего ног?", 88),
        num("55-c", "Сколько рук у водолазов? (120 − 88)", 32, "120 − 88 ="),
      ],
      "Руки есть только у водолазов.",
    ),
    ws(
      taskId,
      1,
      "Сколько водолазов и их ног",
      "У каждого водолаза 2 руки и 2 ноги.",
      [
        num("55-d", "Сколько водолазов? (32 ÷ 2)", 16, "32 ÷ 2 ="),
        num("55-e", "Сколько ног у водолазов? (16 × 2)", 32, "16 × 2 ="),
      ],
      "Остальные ноги — у осьминогов.",
    ),
    ws(
      taskId,
      2,
      "Ответ",
      "Из 88 ног вычти ноги водолазов и раздели на 8.",
      [
        num("55-f", "Сколько ног у осьминогов? (88 − 32)", 56, "88 − 32 ="),
        num("55-g", "Сколько осьминогов? (56 ÷ 8)", 7, "56 ÷ 8 ="),
      ],
      "Ответ: 7 осьминогов.",
    ),
  ];
}
