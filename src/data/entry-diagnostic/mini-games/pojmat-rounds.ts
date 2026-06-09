/** Смысловые раунды «ПойМАТ!» — живые вопросы, не методические зоны */

export interface PojmatCard {
  id: string;
  label: string;
}

export interface PojmatRound {
  conditionText: string;
  correctId: string;
  cards: PojmatCard[];
  /** Карточка-ловушка для semantic telemetry */
  trapId?: string;
}

export const POJMAT_ROUNDS: PojmatRound[] = [
  {
    conditionText: "У Маши 12 яблок, у Пети 8. Сколько всего яблок у детей?",
    correctId: "together",
    trapId: "extra",
    cards: [
      { id: "together", label: "Сколько яблок у Маши и Пети вместе?" },
      { id: "masha", label: "Сколько яблок у Маши?" },
      { id: "peti", label: "Сколько яблок у Пети?" },
      { id: "extra", label: "Сколько яблок лишние?" },
    ],
  },
  {
    conditionText: "В корзине 24 конфеты: 10 шоколадных, остальные — карамельки.",
    correctId: "caramel",
    trapId: "total",
    cards: [
      { id: "caramel", label: "Сколько карамелек в корзине?" },
      { id: "choco", label: "Сколько шоколадных конфет?" },
      { id: "total", label: "Сколько конфет всего?" },
      { id: "extra", label: "Сколько конфет лишних?" },
    ],
  },
  {
    conditionText: "На полке 5 красных, 7 синих и 3 зелёных книг.",
    correctId: "not_red",
    trapId: "red",
    cards: [
      { id: "not_red", label: "Сколько книг не красных?" },
      { id: "red", label: "Сколько красных книг?" },
      { id: "blue", label: "Сколько синих книг?" },
      { id: "green", label: "Сколько зелёных книг?" },
    ],
  },
];
