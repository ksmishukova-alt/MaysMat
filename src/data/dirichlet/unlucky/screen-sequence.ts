import type { ScreenSpec } from "@/data/screen-spec";

/** Базовая последовательность экранов «Метод неудачника» */
export const UNLUCKY_SCREEN_SEQUENCE: ScreenSpec[] = [
  {
    screen: 1,
    title: "Объяснение метода",
    childAction: "Объяснить: сначала строим самый неприятный вариант без нужного результата.",
    stepKind: "intro_video",
  },
  {
    screen: 2,
    title: "Прочитай условие",
    childAction: "Ребёнок читает условие и готовится ответить, что нужно гарантировать.",
    stepKind: "read_condition",
  },
  {
    screen: 3,
    title: "Что нужно гарантировать?",
    childAction: "Выбрать или подтвердить цель гарантии.",
    stepKind: "guarantee_goal",
  },
  {
    screen: 4,
    title: "Собери самый неудачный расклад",
    childAction: "Собрать максимум предметов, при котором результата ещё нет.",
    stepKind: "worst_case",
  },
  {
    screen: 5,
    title: "Найди порог гарантии",
    childAction: "maxWithoutSuccess + 1 = ответ.",
    stepKind: "guarantee_plus_one",
  },
  {
    screen: 6,
    title: "Почему меньше не хватит?",
    childAction: "Объяснить, почему меньшего числа недостаточно.",
    stepKind: "explain_why_less_fails",
  },
  {
    screen: 7,
    title: "Запиши решение словами",
    childAction: "Записать ответ и краткое обоснование.",
    stepKind: "write_solution",
  },
  {
    screen: 8,
    title: "Проверка и завершение",
    childAction: "Сверить с эталоном и завершить задачу.",
    stepKind: "finish",
  },
];
