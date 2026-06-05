import type { DiscriminatedTaskStep } from "@/data/task-steps";
import type { WorksheetRow } from "@/data/tasks";

function note(id: string, text: string): WorksheetRow {
  return { id, question: text, inputType: "static", staticValue: "" };
}

function num(id: string, question: string, answer: number, prefix?: string): WorksheetRow {
  return prefix
    ? { id, question, inputType: "formula", prefix, answer }
    : { id, question, inputType: "number", answer };
}

/** После нахождения 12 совят и 22 котят — ответ на главный вопрос про мышей */
export function buildSteps35Secondary(taskId: string): DiscriminatedTaskStep[] {
  return [
    {
      id: `${taskId}-secondary-focus`,
      type: "single_select",
      title: "На что отвечаем?",
      selectPrompt: "Что нужно сравнить в конце задачи?",
      context: "Животных мы уже нашли — но вопрос задачи про другое.",
      options: [
        { id: "mice", label: "Сколько мышей поймали", emoji: "🐭", correct: true },
        { id: "animals", label: "Сколько совят и котят", emoji: "🦉", correct: false },
        { id: "legs", label: "Сколько ног у животных", emoji: "🦵", correct: false },
      ],
      successMessage: "Верно! Нужно сравнить именно мышей, а не количество животных.",
    },
    {
      id: `${taskId}-secondary-intro`,
      type: "auto_explanation",
      explanationRole: "intro",
      title: "Главный вопрос задачи",
      hint: "12 совят и 22 котёнка — это ещё не ответ. В условии спрашивают про мышей.",
      template: [
        "Мы нашли: 12 совят и 22 котёнка.",
        "Вопрос задачи: кто поймал больше мышек и на сколько?",
        "Нужно отдельно посчитать мышей у совят и у котят.",
      ],
    },
    {
      id: `${taskId}-secondary-calc`,
      type: "worksheet_table",
      title: "Сравни, кто поймал больше мышей",
      hint: "Сначала умножь количество животных на «норму» мышей у каждого вида.",
      successMessage: "Верно! Котята поймали больше на 4 мышки.",
      worksheetRows: [
        note("35-n1", "💡 Совёнок ловит 7 мышей, котёнок — 4. Сравниваем итог, а не число животных."),
        num("35-a", "Сколько мышей поймали совята? (12 × 7)", 84, "12 × 7 ="),
        num("35-b", "Сколько мышей поймали котята? (22 × 4)", 88, "22 × 4 ="),
        num("35-c", "На сколько котята поймали больше?", 4, "88 − 84 ="),
      ],
    },
    {
      id: `${taskId}-secondary-answer`,
      type: "single_select",
      title: "Кто поймал больше?",
      selectPrompt: "Кто поймал больше мышек?",
      context: "88 > 84 — выбери верный вывод.",
      options: [
        { id: "kittens", label: "Котята — на 4 мышки больше", emoji: "🐱", correct: true },
        { id: "owlets", label: "Совята — на 4 мышки больше", emoji: "🦉", correct: false },
        { id: "equal", label: "Поровну", emoji: "⚖️", correct: false },
      ],
      successMessage: "Отлично! Теперь запиши полное решение словами.",
    },
  ];
}
