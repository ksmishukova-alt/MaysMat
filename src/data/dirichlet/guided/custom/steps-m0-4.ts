import type { DiscriminatedTaskStep } from "@/data/task-steps";

/** M0.4 — покрытие дней недели автомобилями (а: 5 взрослых, б: 8) */
export function buildStepsM04(taskId: string): DiscriminatedTaskStep[] {
  return [
    {
      id: `${taskId}-setup`,
      type: "auto_explanation",
      title: "Что моделируем?",
      hint: "Здесь «клетки» — дни недели, а «зайцы» — автомобили, которые должны быть доступны каждый день.",
      template: [
        "Каждый автомобиль один день в неделю «отдыхает» — в этот день им нельзя ехать.",
        "Все взрослые хотят ездить каждый день — значит, в любой день должно хватить машин.",
      ],
    },
    {
      id: `${taskId}-part-a`,
      type: "worksheet_table",
      title: "а) Пять взрослых",
      hint: "Представь худший день: один автомобиль отдыхает. Сколько машин нужно, чтобы все пятеро могли ехать?",
      successMessage: "Верно!",
      worksheetRows: [
        {
          id: "a-min",
          question: "Минимум автомобилей для 5 взрослых:",
          inputType: "number",
          answer: 6,
        },
      ],
    },
    {
      id: `${taskId}-part-a-why`,
      type: "single_select",
      title: "Почему не хватит пяти?",
      selectPrompt: "Почему пяти автомобилей мало?",
      options: [
        {
          id: "rest",
          label: "В день «отдыха» одной машины пятерым не на чем ехать",
          emoji: "✅",
          correct: true,
        },
        {
          id: "week",
          label: "Потому что в неделе 7 дней, а машин 5",
          emoji: "❌",
          correct: false,
        },
      ],
    },
    {
      id: `${taskId}-part-b`,
      type: "worksheet_table",
      title: "б) Восемь взрослых",
      hint: "Если каждый день отдыхает не больше одной машины — всего машин не больше 7. Но в какой-то день отдыхают две…",
      successMessage: "Отлично!",
      worksheetRows: [
        {
          id: "b-one-rest",
          question: "Если каждый день отдыхает ≤1 машина, максимум машин:",
          inputType: "number",
          answer: 7,
        },
        {
          id: "b-min",
          question: "Минимум автомобилей для 8 взрослых:",
          inputType: "number",
          answer: 10,
        },
      ],
    },
    {
      id: `${taskId}-conclusion`,
      type: "single_select",
      title: "Ответ",
      selectPrompt: "Сколько машин нужно минимум?",
      options: [
        { id: "a6b10", label: "а) 6; б) 10", emoji: "✅", correct: true },
        { id: "a5b8", label: "а) 5; б) 8", emoji: "❌", correct: false },
        { id: "a6b8", label: "а) 6; б) 8", emoji: "❌", correct: false },
      ],
      successMessage: "Верно!",
    },
  ];
}
