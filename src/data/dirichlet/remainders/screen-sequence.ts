import type { ScreenSpec } from "@/data/screen-spec";

/** Базовая последовательность экранов «Остатки как домики» */
export const REMAINDERS_SCREEN_SEQUENCE: ScreenSpec[] = [
  {
    screen: 1,
    title: "Остатки как домики",
    childAction: "Объяснить: остаток — это домик; если чисел больше домиков — будет столкновение.",
    stepKind: "intro_video",
  },
  {
    screen: 2,
    title: "Прочитай условие",
    childAction: "Ребёнок читает условие.",
    stepKind: "read_condition",
  },
  {
    screen: 3,
    title: "Найди модуль деления",
    childAction: "На какое число должна делиться разность?",
    stepKind: "find_modulus",
  },
  {
    screen: 4,
    title: "Построй домики-остатки",
    childAction: "Показать домики 0 … m−1.",
    stepKind: "build_houses",
  },
  {
    screen: 5,
    title: "Кто живёт в домиках?",
    childAction: "Что раскладываем по домикам?",
    stepKind: "identify_objects",
  },
  {
    screen: 6,
    title: "Найди столкновение",
    childAction: "Чисел больше, чем домиков — два попадут в один домик.",
    stepKind: "find_collision",
  },
  {
    screen: 7,
    title: "Почему это решает задачу?",
    childAction: "Одинаковые остатки ⇒ разность делится на модуль.",
    stepKind: "explain_divisibility",
  },
  {
    screen: 8,
    title: "Запиши решение словами",
    childAction: "Собрать полный текст решения с пропусками.",
    stepKind: "write_solution",
  },
  {
    screen: 9,
    title: "Проверка и завершение",
    childAction: "Сверить с эталоном и завершить задачу.",
    stepKind: "finish",
  },
];
