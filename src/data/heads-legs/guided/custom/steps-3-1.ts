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

/** Диагностика 3.1 — неполное условие, без «метода замены» */
export function buildSteps31(taskId: string): DiscriminatedTaskStep[] {
  return [
    ws(
      taskId,
      "facts",
      "Выдели данные из условия",
      "Перенеси числа из текста. Сколько всего учеников — в условии не сказано.",
      [
        num("31-f1", "Сколько всего задач проверено?", 42),
        num("31-f2", "Сколько задач решил один третьеклассник?", 3),
        num("31-f3", "Сколько задач решил один пятиклассник?", 5),
      ],
      "Верно! Теперь проверим, хватает ли этих данных.",
    ),
    {
      id: `${taskId}-diag-intro`,
      type: "auto_explanation",
      explanationRole: "intro",
      title: "Что дано, а чего не хватает?",
      hint: "Здесь нельзя «додумать» число — его нет в условии.",
      template: [
        "Дано: учительница проверила всего 42 задачи.",
        "Третьеклассник решает по 3 задачи, пятиклассник — по 5.",
        "Не сказано, сколько всего было учеников.",
        "По смыслу участвовали и третьеклассники, и пятиклассники — у каждого вида должно быть больше 0.",
      ],
    },
    {
      id: `${taskId}-diag-sufficient`,
      type: "single_select",
      title: "Хватает ли данных для одного ответа?",
      selectPrompt: "Можно ли однозначно узнать, сколько было третьеклассников и пятиклассников?",
      context: "Выбери вывод — не подставляй число, которого нет в условии.",
      options: [
        { id: "no", label: "Нет — ответов может быть несколько", emoji: "⚠️", correct: true },
        { id: "yes", label: "Да — можно найти один ответ", emoji: "✓", correct: false },
        { id: "unknown", label: "Не знаю", emoji: "❓", correct: false },
      ],
      successMessage: "Верно! Нужен перебор или дополнительное условие.",
    },
    ws(
      taskId,
      "examples",
      "Найди два положительных варианта",
      "Подбери целые числа: 3×(третьеклассники) + 5×(пятиклассники) = 42. Оба вида должны участвовать.",
      [
        num("31-e1", "Сколько пятиклассников, если третьеклассников 9? (9×3 + ?×5 = 42)", 3),
        num("31-e2", "Сколько третьеклассников при 3 пятиклассниках?", 9, "9 × 3 + 3 × 5 ="),
        num("31-e3", "Сколько пятиклассников, если третьеклассников 4?", 6),
        num("31-e4", "Сколько третьеклассников при 6 пятиклассниках?", 4, "4 × 3 + 6 × 5 ="),
      ],
      "Два разных варианта — значит, единственный ответ найти нельзя.",
    ),
    {
      id: `${taskId}-diag-hint`,
      type: "auto_explanation",
      explanationRole: "intro",
      title: "Как искать варианты",
      hint: "На следующем экране соберёшь перебор и вывод словами.",
      template: [
        "Составь уравнение: 3 × (третьеклассники) + 5 × (пятиклассники) = 42.",
        "Подбери положительные целые числа — оба вида должны участвовать.",
        "Пример: 9 третьеклассников и 3 пятиклассника (9×3 + 3×5 = 42).",
        "Другой пример: 4 третьеклассника и 6 пятиклассников.",
        "Вывод: единственный ответ найти нельзя — не хватает «сколько всего учеников».",
      ],
    },
    {
      id: `${taskId}-diag-missing`,
      type: "single_select",
      title: "Что нужно добавить в условие?",
      selectPrompt: "Какое дополнительное условие сделало бы задачу обычной — с одним ответом?",
      context: "Выбери то, чего не хватает в тексте задачи.",
      options: [
        { id: "total", label: "Сколько всего учеников участвовало", emoji: "👥", correct: true },
        { id: "color", label: "Цвет тетрадей", emoji: "📓", correct: false },
        { id: "tasks", label: "Сколько задач в контрольной", emoji: "📝", correct: false },
      ],
      successMessage: "Верно! С общим числом учеников задача стала бы обычной.",
    },
  ];
}
