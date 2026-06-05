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

/** 3.7: перебор — девочек 5 или 2 (docx D) */
export function buildSteps37(taskId: string): DiscriminatedTaskStep[] {
  return [
    ws(
      taskId,
      "facts",
      "Данные из условия",
      "Девочка — 4 яблока, мальчик — 6. Всего 26 яблок.",
      [
        num("37-f1", "Сколько яблок у одной девочки?", 4),
        num("37-f2", "Сколько яблок у одного мальчика?", 6),
        num("37-f3", "Сколько всего яблок?", 26),
      ],
      "Подбираем число мальчиков: остаток должен делиться на 4.",
    ),
    {
      id: `${taskId}-diag-intro`,
      type: "auto_explanation",
      explanationRole: "intro",
      title: "Перебор мальчиков",
      hint: "После яблок мальчиков остаток делим на 4 — получим число девочек.",
      template: [
        "Уравнение: 6 × (мальчики) + 4 × (девочки) = 26.",
        "Перебираем положительное число мальчиков.",
        "Остаток после мальчиков должен делиться на 4.",
      ],
    },
    ws(
      taskId,
      "v1",
      "Вариант 1: один мальчик",
      "1 мальчик собрал 6 яблок.",
      [
        num("37-a", "Сколько яблок у 1 мальчика?", 6),
        num("37-b", "Осталось яблок (26 − 6)", 20, "26 − 6 ="),
        num("37-c", "Сколько девочек? (20 ÷ 4)", 5, "20 ÷ 4 ="),
      ],
      "Первый вариант: 5 девочек.",
    ),
    ws(
      taskId,
      "v2",
      "Вариант 2: три мальчика",
      "3 мальчика собрали 18 яблок.",
      [
        num("37-d", "Сколько яблок у 3 мальчиков? (3 × 6)", 18, "3 × 6 ="),
        num("37-e", "Осталось (26 − 18)", 8, "26 − 18 ="),
        num("37-f", "Сколько девочек? (8 ÷ 4)", 2, "8 ÷ 4 ="),
      ],
      "Второй вариант: 2 девочки. Других положительных вариантов нет.",
    ),
    {
      id: `${taskId}-diag-conclude`,
      type: "single_select",
      title: "Сколько могло быть девочек?",
      selectPrompt: "Какой вывод верен?",
      context: "Мы нашли два подходящих варианта.",
      options: [
        { id: "both", label: "5 или 2 девочки", emoji: "✅", correct: true },
        { id: "five", label: "Только 5", emoji: "5️⃣", correct: false },
        { id: "one", label: "Только 1", emoji: "1️⃣", correct: false },
      ],
      successMessage: "Верно! Ответов два — запиши оба в тексте решения.",
    },
  ];
}
