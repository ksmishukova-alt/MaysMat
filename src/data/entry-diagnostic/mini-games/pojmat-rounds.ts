/** Смысловые карточки блока 1 и «ПойМАТ!» — без дословного повтора вопроса */

export interface PojmatCard {
  id: string;
  label: string;
}

export interface PojmatRound {
  conditionText: string;
  questionPrompt: string;
  correctId: string;
  cards: PojmatCard[];
  /** Карточка-ловушка для semantic telemetry */
  trapId?: string;
}

export const POJMAT_ROUNDS: PojmatRound[] = [
  {
    conditionText: "У Маши 12 яблок, у Пети 8. Сколько всего яблок у детей?",
    questionPrompt: "О чём спрашивают в задаче?",
    correctId: "together",
    trapId: "left",
    cards: [
      { id: "together", label: "Сколько яблок у Маши и Пети вместе?" },
      { id: "masha", label: "Сколько яблок только у Маши?" },
      { id: "peti", label: "Сколько яблок только у Пети?" },
      { id: "left", label: "Сколько яблок осталось?" },
    ],
  },
  {
    conditionText:
      "В корзине 24 конфеты: 10 шоколадных, остальные — карамельки. Сколько карамелек?",
    questionPrompt: "Какой вопрос подходит к задаче?",
    correctId: "non_choco",
    trapId: "total",
    cards: [
      { id: "non_choco", label: "Сколько конфет не шоколадные?" },
      { id: "choco", label: "Сколько шоколадных конфет?" },
      { id: "total", label: "Сколько всего конфет в корзине?" },
      { id: "added", label: "Сколько конфет добавили?" },
    ],
  },
  {
    conditionText: "На полке 5 красных, 7 синих и 3 зелёных книг. Сколько книг не красных?",
    questionPrompt: "Какой ответ подходит к вопросу?",
    correctId: "blue_green",
    trapId: "red",
    cards: [
      { id: "blue_green", label: "Сколько синих и зелёных книг вместе?" },
      { id: "red", label: "Сколько красных книг?" },
      { id: "all", label: "Сколько всех книг на полке?" },
      { id: "green_only", label: "Сколько только зелёных книг?" },
    ],
  },
];

/** Карточки для runner блока 1 (D1–D3) */
export const BLOCK_01_READING_TASKS = POJMAT_ROUNDS.map((round, i) => ({
  difficulty: (["D1", "D2", "D3"] as const)[i],
  ...round,
  errorTypes:
    i === 0
      ? ["reading_error", "question_focus_error"]
      : i === 1
        ? ["reading_error", "data_error"]
        : ["reading_error", "extra_data_error", "question_focus_error"],
}));
