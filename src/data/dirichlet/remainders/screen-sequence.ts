import type { ScreenSpec } from "@/data/screen-spec";

/** Базовая последовательность экранов «Остатки как домики» */
export const REMAINDERS_SCREEN_SEQUENCE: ScreenSpec[] = [
  {
    screen: 1,
    title: "Куда поселятся числа?",
    childAction: "Объяснить: для каждого остатка — домик; число попадает в домик своего остатка.",
    stepKind: "intro_video",
  },
  {
    screen: 2,
    title: "Остаток всегда меньше числа, на которое делим",
    childAction: "Экран методического правила подтемы.",
    stepKind: "method_rule",
  },
  {
    screen: 3,
    title: "Прочитай условие",
    childAction: "Ребёнок читает условие.",
    stepKind: "read_condition",
  },
  {
    screen: 4,
    title: "Найди модуль деления",
    childAction: "На какое число должна делиться разность?",
    stepKind: "find_modulus",
  },
  {
    screen: 5,
    title: "Построй домики для остатков",
    childAction: "Показать домики 0 … m−1.",
    stepKind: "build_houses",
  },
  {
    screen: 6,
    title: "Почему столько домиков?",
    childAction: "Микро-проверка: остатки от 0 до m−1.",
    stepKind: "houses_count_quiz",
  },
  {
    screen: 7,
    title: "Кто живёт в домиках?",
    childAction: "Что раскладываем по домикам?",
    stepKind: "identify_objects",
  },
  {
    screen: 8,
    title: "Найди столкновение",
    childAction: "Чисел больше, чем домиков — два попадут в один домик.",
    stepKind: "find_collision",
  },
  {
    screen: 9,
    title: "Пример с одинаковым остатком",
    childAction: "23 и 34 → остаток 1 → разность делится на 11.",
    stepKind: "divisibility_example",
  },
  {
    screen: 10,
    title: "Почему это решает задачу?",
    childAction: "Расставить рассуждение: домик → остаток → делимость разности.",
    stepKind: "explain_divisibility",
  },
  {
    screen: 11,
    title: "Запиши решение словами",
    childAction: "Собрать полный текст решения с пропусками.",
    stepKind: "write_solution",
  },
  {
    screen: 12,
    title: "Проверка и завершение",
    childAction: "Сверить с эталоном и завершить задачу.",
    stepKind: "finish",
  },
];
