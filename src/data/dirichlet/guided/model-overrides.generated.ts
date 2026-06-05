/** AUTO-GENERATED — scripts/generate-dirichlet-content.mjs */
import type { DirichletInferredModel } from "../types";

export const DIRICHLET_MODEL_OVERRIDES_GENERATED: Partial<
  Record<string, Partial<DirichletInferredModel>>
> = {
  "M0.1": {
    rabbits: [
      {
        label: "Туристы",
        id: "tourists",
      },
    ],
    cells: [
      {
        label: "Группы по признаку из условия",
        id: "categories",
      },
    ],
    counts: {
      n: 20,
      m: 16,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "верно",
  },
  "M0.2": {
    rabbits: [
      {
        label: "Монеты",
        id: "coins",
      },
    ],
    cells: [
      {
        id: "coin-types",
        label: "Типы монет",
      },
    ],
    counts: {
      n: 5,
      m: 4,
      k: 6,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "да",
  },
  "M0.3": {
    rabbits: [
      {
        label: "Футболисты",
        id: "players",
      },
    ],
    cells: [
      {
        label: "Дни недели",
        id: "categories",
      },
    ],
    counts: {
      n: 11,
      m: 7,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "но отсюда следует, что во всей москве не больше 366 * 9999 = 3659634 жителей, что, конечно, неверно",
  },
  "M1.1": {
    rabbits: [
      {
        label: "Грибники",
        id: "mushrooms",
      },
      {
        label: "Люди",
        id: "people",
      },
    ],
    cells: [
      {
        label: "Группы по признаку из условия",
        id: "categories",
      },
    ],
    counts: {
      n: 10,
      m: 10,
      k: 0,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "0, 1, 2, 3, 4, 5, 6, 7, 8, 10 грибов",
  },
  "M1.2": {
    rabbits: [
      {
        label: "Положения шестерёнок",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "Группы по признаку из условия",
        id: "categories",
      },
    ],
    counts: {
      n: 14,
      m: 12,
      k: 12,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "имеется и хорошее положение",
  },
  "M1.3": {
    rabbits: [
      {
        label: "Ёлки",
        id: "trees",
      },
    ],
    cells: [
      {
        label: "Елка сажается нами в клетку с номером",
        id: "trees",
      },
    ],
    counts: {
      n: 1000000,
      m: 600001,
      k: 600001,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "но ведь, если два ``кролика''-елки сидят в одной клетке, то количество иголок у них одинаково",
  },
  "M0.4": {
    rabbits: [
      {
        label: "Автомобили",
        id: "cars",
      },
      {
        label: "Люди",
        id: "people",
      },
    ],
    cells: [
      {
        id: "weekdays",
        label: "Дни недели",
      },
    ],
    counts: {
      n: 5,
      m: 7,
      k: null,
      minInCell: 8,
    },
    compareOp: "gt",
    conclusionText: "а) 6; б) 10 автомобилей",
  },
  "M1.4": {
    rabbits: [
      {
        label: "Спички",
        id: "matches",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 3,
      m: 2,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "а-б) не всегда",
  },
  "M2.1": {
    rabbits: [
      {
        label: "Ученики",
        id: "students",
      },
      {
        label: "Люди",
        id: "people",
      },
    ],
    cells: [
      {
        label: "Группы для оценки не более k",
        id: "categories",
      },
    ],
    counts: {
      n: 38,
      m: 12,
      k: 3,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "среди них найдутся четверо, родившихся в один месяц",
  },
  "M2.2": {
    rabbits: [
      {
        label: "Ученики",
        id: "students",
      },
    ],
    cells: [
      {
        label: "Дни года",
        id: "year-days",
      },
    ],
    counts: {
      n: 800,
      m: 366,
      k: 366,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "в какой-то день родились хотя бы трое",
  },
  "M2.3": {
    rabbits: [
      {
        label: "Сапоги",
        id: "boots",
      },
    ],
    cells: [
      {
        label: "Группы для оценки не более k",
        id: "categories",
      },
    ],
    counts: {
      n: 200,
      m: null,
      k: 99,
      minInCell: 100,
    },
    compareOp: "gt",
    conclusionText: "какой-то тип, например, левый, повторится по крайней мере дважды, например, в 41 и 42 размерах",
  },
  "M2.4": {
    rabbits: [
      {
        label: "Люди",
        id: "people",
      },
      {
        label: "Жители",
        id: "residents",
      },
    ],
    cells: [
      {
        label: "Группы для оценки не более k",
        id: "categories",
      },
    ],
    counts: {
      n: 1000000,
      m: 400001,
      k: 19,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "тогда всего жителей в москве не более 19·400001 < 8000000",
  },
  "M1.5": {
    rabbits: [
      {
        label: "Ученики",
        id: "students",
      },
      {
        label: "Люди",
        id: "people",
      },
    ],
    cells: [
      {
        label: "Группы по признаку из условия",
        id: "categories",
      },
    ],
    counts: {
      n: 33,
      m: 11,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "больше групп нет",
  },
  "M2.5": {
    rabbits: [
      {
        label: "Ученики",
        id: "students",
      },
      {
        label: "Люди",
        id: "people",
      },
    ],
    cells: [
      {
        label: "Группы для оценки не более k",
        id: "categories",
      },
    ],
    counts: {
      n: 30,
      m: null,
      k: 29,
      minInCell: 29,
    },
    compareOp: "gt",
    conclusionText: "в кинотеатре 29 рядов",
  },
  "M2.6": {
    rabbits: [
      {
        label: "Ящики",
        id: "boxes",
      },
      {
        label: "Ящики с яблоками",
        id: "apples",
      },
    ],
    cells: [
      {
        label: "Сорта / категории",
        id: "categories",
      },
    ],
    counts: {
      n: 25,
      m: 3,
      k: 8,
      minInCell: 9,
    },
    compareOp: "gt",
    conclusionText: "25 ящиков - кроликов рассадим по 3 клеткам-сортам",
  },
  "M2.7": {
    rabbits: [
      {
        label: "Ученики",
        id: "students",
      },
      {
        label: "Школьники",
        id: "pupils",
      },
    ],
    cells: [
      {
        label: "Группы для оценки не более k",
        id: "categories",
      },
    ],
    counts: {
      n: 10,
      m: 30,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "так как 29 = 4 · 7 + 1, то найдется школьник, решивший не менее пяти задач",
  },
  "M3.1": {
    rabbits: [
      {
        label: "Монеты",
        id: "coins",
      },
    ],
    cells: [
      {
        label: "Варианты раскладки (худший случай)",
        id: "colors",
      },
    ],
    counts: {
      n: 3,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "1 рубль, 1 рубль, 1 рубль, 2 рубля, 2 рубля",
  },
  "M3.2": {
    rabbits: [
      {
        label: "Шары",
        id: "balls",
      },
    ],
    cells: [
      {
        label: "Цвета",
        id: "colors",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "3 шара",
  },
  "M3.3": {
    rabbits: [
      {
        label: "Красны",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "colors",
        label: "Чёрные и белые клетки",
      },
    ],
    counts: {
      n: 70,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "38 шаров",
  },
  "M3.4": {
    rabbits: [
      {
        label: "Вынимаемые предметы",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "Варианты раскладки (худший случай)",
        id: "colors",
      },
    ],
    counts: {
      n: 49,
      m: null,
      k: 42,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "8 карточек",
  },
  "M3.5": {
    rabbits: [
      {
        label: "Ящики",
        id: "boxes",
      },
      {
        label: "Шарики",
        id: "balls",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 111,
      m: 88,
      k: 12,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "88 шариков",
  },
  "M4.1": {
    rabbits: [
      {
        label: "Числа из условия",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 57,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "найдётся",
  },
  "M4.2": {
    rabbits: [
      {
        label: "Разности",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 7,
      m: 14,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "13",
  },
  "M4.3": {
    rabbits: [
      {
        label: "Натуральные числа",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 200,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "поэтому одна из этих сумм равна 100 или обе равны 50, то есть нужный набор чисел найден",
  },
  "M4.4": {
    rabbits: [
      {
        label: "Числа / величины",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 101,
      m: 101,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "вычитая из неё b, получим искомую сумму",
  },
  "M4.5": {
    rabbits: [
      {
        label: "Числа / величины",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 5,
      m: 4,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "можно выбрать два числа, одно из которых делит другое",
  },
  "M4.6": {
    rabbits: [
      {
        label: "Разности",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 1987,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "подсказка: рассмотрите 1988 степеней и их остатки по модулю 1987",
  },
  "M4.7": {
    rabbits: [
      {
        label: "Числа / величины",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 1987,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "среди чисел, записываемых только единицами, есть число, которое делится на 1987",
  },
  "M4.8": {
    rabbits: [
      {
        label: "Целые числа",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 52,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "найдутся два числа с одинаковым остатком — разность делится на 11",
  },
  "M4.9": {
    rabbits: [
      {
        label: "Ученики",
        id: "students",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 2001,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "он может записать число, которое делится на 2001",
  },
  "M4.10": {
    rabbits: [
      {
        label: "Числа / величины",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 100,
      m: 100,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "в любом случае x² – y² делится на 100",
  },
  "M4.11": {
    rabbits: [
      {
        label: "Двузначные числа",
        id: "numbers",
      },
    ],
    cells: [
      {
        label: "Остатки при делении на 11",
        id: "remainders",
      },
    ],
    counts: {
      n: 12,
      m: 11,
      k: null,
      minInCell: 2,
    },
    compareOp: "gt",
    conclusionText: "у двух чисел остатки одинаковые, их разность делится на 11",
  },
  "M4.12": {
    rabbits: [
      {
        label: "Попарные разности",
        id: "numbers",
      },
    ],
    cells: [
      {
        label: "Различные разности (1…14)",
        id: "numbers",
      },
    ],
    counts: {
      n: 8,
      m: 14,
      k: null,
      minInCell: 3,
    },
    compareOp: "gt",
    conclusionText: "в каждой меньше трех)",
  },
  "M4.13": {
    rabbits: [
      {
        label: "Различны",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 11,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "можно выбрать два числа, одно из которых делит другое",
  },
  "M4.14": {
    rabbits: [
      {
        label: "Числа в таблице",
        id: "numbers",
      },
      {
        label: "Вершины",
        id: "points",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 2006,
      m: 4,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "в каждом квадратике – ровно один нуль",
  },
  "M4.15": {
    rabbits: [
      {
        label: "Числа / величины",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "а) существуют; б) не существуют",
  },
  "M4.16": {
    rabbits: [
      {
        label: "Различны",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 17,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "сть в порядке их возрастания",
  },
  "M4.17": {
    rabbits: [
      {
        label: "Числа в таблице",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "table-rows",
        label: "Кресты (строка + столбец)",
      },
    ],
    counts: {
      n: 25,
      m: 13,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "не могут",
  },
  "M4.18": {
    rabbits: [
      {
        label: "Целые числа",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 2001,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "найдутся два числа с одинаковым остатком — разность делится на 11",
  },
  "M4.19": {
    rabbits: [
      {
        label: "Целые числа",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 10,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "можно выбрать три числа с одинаковым остатком — сумма делится на 3",
  },
  "M4.20": {
    rabbits: [
      {
        label: "Различны",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 27,
      m: null,
      k: 25,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "в наборе есть два числа с общим простым делителем, то есть два числа, не являющихся взаимно простыми",
  },
  "M4.21": {
    rabbits: [
      {
        label: "Числа / величины",
        id: "numbers",
      },
    ],
    cells: [
      {
        label: "Остатки при делении на 3",
        id: "remainders",
      },
    ],
    counts: {
      n: 7,
      m: 3,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "их сумма делится на 3",
  },
  "M4.22": {
    rabbits: [
      {
        label: "Целые числа",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 6,
      m: 5,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "б) не останется",
  },
  "M4.23": {
    rabbits: [
      {
        label: "Числа / величины",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 1000,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "m = 499",
  },
  "M5.1": {
    rabbits: [
      {
        label: "Объекты на фигуре или доске",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "categories",
        label: "Клетки шахматной доски",
      },
    ],
    counts: {
      n: 8,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "ладей можно поставить не больше, чем горизонталей у доски, а их восемь",
  },
  "M5.2": {
    rabbits: [
      {
        label: "Клетки квадрата",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 15,
      m: null,
      k: null,
      minInCell: 12,
    },
    compareOp: "gt",
    conclusionText: "разрежем наш квадрат на 16 квадратиков 1×1",
  },
  "M5.3": {
    rabbits: [
      {
        label: "Разности",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 12,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "заметим, что числа 1, 2, 3, 10, 11, 12 не могут стоять рядом",
  },
  "M5.5": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "решение задачи 79344",
  },
  "M5.6": {
    rabbits: [
      {
        label: "Метра",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 15,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "хотя бы один из 16 квадратов не содержит дырки внутри",
  },
  "M5.7": {
    rabbits: [
      {
        label: "Объекты на фигуре или доске",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 100,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "50 м",
  },
  "M5.8": {
    rabbits: [
      {
        label: "Расположены",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 51,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "по крайней мере, проекция двух кругов имеет общую точку",
  },
  "M5.9": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 400,
      m: null,
      k: 40,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "ландышей должно быть столько же, сколько внутри аллеи поместится отрезков по 40 м",
  },
  "M5.10": {
    rabbits: [
      {
        label: "Шахматные фигуры",
        id: "pieces",
      },
    ],
    cells: [
      {
        id: "categories",
        label: "Клетки шахматной доски",
      },
    ],
    counts: {
      n: 44,
      m: 21,
      k: 42,
      minInCell: 21,
    },
    compareOp: "gt",
    conclusionText: "не бьёт не более 42 других клеток",
  },
  "M5.11": {
    rabbits: [
      {
        label: "Клетки доски",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "categories",
        label: "Клетки шахматной доски",
      },
    ],
    counts: {
      n: 8,
      m: null,
      k: 16,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "можно поставить не более 16 королей",
  },
  "M5.12": {
    rabbits: [
      {
        label: "Треугольники",
        id: "parts",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "каждый из меньших треугольников не может накрывать более одной вершины большого треугольника",
  },
  "M5.13": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 1,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "некоторые две из этих трех его вершин имеют одинаковый цвет (согласно принципу дирихле)",
  },
  "M5.14": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 51,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "по обобщенному принципу дирихле, в какой-то из них попадет по крайней мере три точки из 51 брошенной",
  },
  "M5.15": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
      {
        label: "Прямоугольники из условия",
        id: "rects",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 6,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "разрежем прямоугольник на пять фигур, как показано на рис",
  },
  "M5.16": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 7,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "расстояние между ними не будет превосходить стороны треугольника",
  },
  "M5.17": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "найдутся две точки, из которых выходит поровну отрезков",
  },
  "M5.18": {
    rabbits: [
      {
        label: "Треугольники",
        id: "parts",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 5,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "расстояние между этими точками меньше 0,5",
  },
  "M5.19": {
    rabbits: [
      {
        label: "Шахматные фигуры",
        id: "pieces",
      },
      {
        label: "Клетки квадрата",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "categories",
        label: "Клетки шахматной доски",
      },
    ],
    counts: {
      n: 100,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "но оба этих квадрата покрываются 99 диагоналями, поэтому ферзей там не больше 99",
  },
  "M5.20": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 17,
      m: null,
      k: null,
      minInCell: 24,
    },
    compareOp: "gt",
    conclusionText: "найдутся две прямые, угол между которыми меньше 17 градусов",
  },
  "M5.21": {
    rabbits: [
      {
        label: "Треугольники",
        id: "parts",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 200,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "больше третьего числа",
  },
  "M5.22": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "если все эти три точки окрашены в другой цвет, то тогда они будут искомой тройкой",
  },
  "M5.23": {
    rabbits: [
      {
        label: "Клетки доски",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "categories",
        label: "Клетки шахматной доски",
      },
    ],
    counts: {
      n: 17,
      m: null,
      k: null,
      minInCell: 16,
    },
    compareOp: "gt",
    conclusionText: "по принципу дирихле какие-то две из 17 отмеченных клеток попадут в одну из этих фигур",
  },
  "M5.24": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
    ],
    cells: [
      {
        id: "colors",
        label: "Раскраски / цвета",
      },
    ],
    counts: {
      n: null,
      m: 8,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "вертикальные прямые, проходящие через эти точки, вместе с ранее выбранными двумя горизонтальными являются искомыми",
  },
  "M5.25": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
      {
        label: "Закрашенные клетки",
        id: "marked",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 19,
      m: 5,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "есть квадрат 2×2 с не менее чем тремя закрашенными клетками",
  },
  "M5.26": {
    rabbits: [
      {
        label: "Прямоугольники из условия",
        id: "rects",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 100,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "среди этих квадратов найдутся два равных между собой",
  },
  "M5.27": {
    rabbits: [
      {
        label: "Многоугольники",
        id: "parts",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "да",
  },
  "M5.28": {
    rabbits: [
      {
        label: "Треугольники",
        id: "parts",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "а) можно; б) нельзя",
  },
  "M5.29": {
    rabbits: [
      {
        label: "Рёбра",
        id: "links",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 1,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "этого сделать нельзя",
  },
  "M5.30": {
    rabbits: [
      {
        label: "Объекты на фигуре или доске",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 720,
      m: 721,
      k: 720,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "в одной клетке окажется не меньше двух предметов",
  },
  "M5.31": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 1000,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "фотоаппарат, расположенный в этом углу, не может сфотографировать сразу все остальные фотоаппараты",
  },
  "M5.32": {
    rabbits: [
      {
        label: "Попарные разности",
        id: "numbers",
      },
    ],
    cells: [
      {
        label: "Цвета",
        id: "colors",
      },
    ],
    counts: {
      n: 2,
      m: 64,
      k: 8,
      minInCell: 300,
    },
    compareOp: "gt",
    conclusionText: "нельзя",
  },
  "M5.33": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 24,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "в этом случае зрителю придётся добавить к ним непарную карточку, которую сможет опознать второй фокусник",
  },
  "M5.34": {
    rabbits: [
      {
        label: "Прямоугольники из условия",
        id: "rects",
      },
      {
        label: "Клетки квадрата",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Клетки квадрата 6×6",
      },
    ],
    counts: {
      n: 6,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "8",
  },
  "M5.35": {
    rabbits: [
      {
        label: "Объекты на фигуре или доске",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "categories",
        label: "Клетки шахматной доски",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "16 королей",
  },
  "M5.36": {
    rabbits: [
      {
        label: "Шахматные фигуры",
        id: "pieces",
      },
      {
        label: "Треугольники",
        id: "parts",
      },
    ],
    cells: [
      {
        id: "categories",
        label: "Клетки шахматной доски",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "на 18 треугольников",
  },
  "M5.37": {
    rabbits: [
      {
        label: "Объекты на фигуре или доске",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "colors",
        label: "Чёрные и белые клетки",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "отрезок, соединяющий эти вершины, искомый",
  },
  "M5.38": {
    rabbits: [
      {
        label: "Точки",
        id: "points",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 25,
      m: null,
      k: null,
      minInCell: 13,
    },
    compareOp: "gt",
    conclusionText: "один из них содержит не менее 13 точек",
  },
  "M5.39": {
    rabbits: [
      {
        label: "Метров",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 1000,
      m: null,
      k: 1,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "11 кусков",
  },
  "M5.40": {
    rabbits: [
      {
        label: "Фишки",
        id: "chips",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 2,
      m: null,
      k: 3,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "что в новой расстановке число дуг уменьшится",
  },
  "M5.41": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 101,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "на одной из этих прямых l лежит не менее десяти из них",
  },
  "M5.42": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 2014,
      m: 19,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "18",
  },
  "M5.43": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
      {
        label: "Треугольники",
        id: "parts",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "среди данных точек можно выбрать такие три, что все стороны образованного ими треугольника",
  },
  "M5.44": {
    rabbits: [
      {
        label: "Шахматные фигуры",
        id: "pieces",
      },
    ],
    cells: [
      {
        id: "categories",
        label: "Клетки шахматной доски",
      },
    ],
    counts: {
      n: 8,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "поскольку на третьей горизонтали три фигуры, хотя бы одну из них можно отметить, и так далее",
  },
  "M5.45": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 99,
      m: 50,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "что на одной из карточек на обеих сторонах будут написаны нечётные числа",
  },
  "M5.46": {
    rabbits: [
      {
        label: "Выложи",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 18,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "в одной клетке окажется не меньше двух предметов",
  },
  "M5.47": {
    rabbits: [
      {
        label: "Одинаковы",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 40,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "сможет",
  },
  "M5.48": {
    rabbits: [
      {
        label: "Клетки доски",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 10,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "до квадрата 7×7",
  },
  "M5.49": {
    rabbits: [
      {
        label: "Объекты на фигуре или доске",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 1,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "1998",
  },
  "M5.50": {
    rabbits: [
      {
        label: "Закрашенные клетки",
        id: "marked",
      },
      {
        label: "Клетки квадрата",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "М из двух закрашенных клеток в квадрате 3",
        id: "marked",
      },
    ],
    counts: {
      n: 81,
      m: 18,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "а) см",
  },
  "M5.51": {
    rabbits: [
      {
        label: "Ёлки",
        id: "trees",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 10000,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "поэтому наибольшее число деревьев, которые можно срубить, равно 2500",
  },
  "M5.52": {
    rabbits: [
      {
        label: "Закрашенные клетки",
        id: "marked",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 8,
      m: null,
      k: 32,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "а)-б) 32 поля",
  },
  "M5.53": {
    rabbits: [
      {
        label: "Закрашенные клетки",
        id: "marked",
      },
      {
        label: "Многоугольники",
        id: "parts",
      },
    ],
    cells: [
      {
        id: "colors",
        label: "Чёрные и белые клетки",
      },
    ],
    counts: {
      n: 10,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "на 9 многоугольников",
  },
  "M5.54": {
    rabbits: [
      {
        label: "Треугольники",
        id: "parts",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 100,
      m: null,
      k: 25,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "25",
  },
  "M5.55": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "9",
  },
  "M6.1": {
    rabbits: [
      {
        label: "Числа в таблице",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Клетки квадрата 6×6",
      },
    ],
    counts: {
      n: 6,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "в одной клетке окажется не меньше двух предметов",
  },
  "M6.2": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
    ],
    cells: [
      {
        id: "table-rows",
        label: "Строки / суммы таблицы",
      },
    ],
    counts: {
      n: 25,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "нет девяти диагоналей, проходящих через одну внутреннюю точку 25-угольника",
  },
  "M6.3": {
    rabbits: [
      {
        label: "Шахматные фигуры",
        id: "pieces",
      },
    ],
    cells: [
      {
        id: "categories",
        label: "Клетки шахматной доски",
      },
    ],
    counts: {
      n: null,
      m: 16,
      k: 16,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "в каком-то из квадратиков фишками занято не менее двух клеток",
  },
  "M6.4": {
    rabbits: [
      {
        label: "Числа в таблице",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "table-rows",
        label: "Строки / суммы таблицы",
      },
    ],
    counts: {
      n: 10,
      m: null,
      k: 19,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "среди этих чисел не более 96 различных",
  },
  "M6.5": {
    rabbits: [
      {
        label: "Числа в таблице",
        id: "numbers",
      },
      {
        label: "Клетки квадрата",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "table-rows",
        label: "Строки / суммы таблицы",
      },
    ],
    counts: {
      n: 15,
      m: 315,
      k: null,
      minInCell: 0,
    },
    compareOp: "gt",
    conclusionText: "тогда всего в таблице должно быть не менее 3·105 = 315 клеток, в то время как всего их 15² = 225",
  },
  "M6.6": {
    rabbits: [
      {
        label: "Числа в таблице",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "table-rows",
        label: "Строки / суммы таблицы",
      },
    ],
    counts: {
      n: 3,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "хотя бы две суммы совпадут",
  },
  "M6.7": {
    rabbits: [
      {
        label: "Числа в таблице",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "table-rows",
        label: "Строки / суммы таблицы",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "аналогично доказывается, что b ≤ a",
  },
  "M6.8": {
    rabbits: [
      {
        label: "Числа в таблице",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "table-rows",
        label: "Строки / суммы таблицы",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "есть строка с 2n плюсами и строка без плюсов",
  },
  "M6.9": {
    rabbits: [
      {
        label: "Детали конструктора",
        id: "parts",
      },
    ],
    cells: [
      {
        id: "table-rows",
        label: "Строки / суммы таблицы",
      },
    ],
    counts: {
      n: 2000,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "расставим знаки сложения между числами, входящими в эту сумму ai + ..",
  },
  "M6.10": {
    rabbits: [
      {
        label: "Числа в таблице",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "table-rows",
        label: "Строки / суммы таблицы",
      },
    ],
    counts: {
      n: 2002,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "нельзя",
  },
  "M6.11": {
    rabbits: [
      {
        label: "Числа в таблице",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "table-rows",
        label: "Строки / суммы таблицы",
      },
    ],
    counts: {
      n: 25,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "в одной клетке окажется не меньше двух предметов",
  },
  "M6.12": {
    rabbits: [
      {
        label: "Клетки доски",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "Цвета",
        id: "colors",
      },
    ],
    counts: {
      n: 5,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "нельзя",
  },
  "M6.13": {
    rabbits: [
      {
        label: "Фишки",
        id: "chips",
      },
    ],
    cells: [
      {
        id: "categories",
        label: "Клетки шахматной доски",
      },
    ],
    counts: {
      n: null,
      m: 49,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "48",
  },
  "M6.14": {
    rabbits: [
      {
        label: "Шахматные фигуры",
        id: "pieces",
      },
    ],
    cells: [
      {
        id: "categories",
        label: "Клетки шахматной доски",
      },
    ],
    counts: {
      n: 8,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "4 ладьи",
  },
  "M6.15": {
    rabbits: [
      {
        label: "Числа в таблице",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "table-rows",
        label: "Строки / суммы таблицы",
      },
    ],
    counts: {
      n: 25,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "наименьшее – 45, наибольшее – 85",
  },
  "M6.16": {
    rabbits: [
      {
        label: "Клетки доски",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "table-rows",
        label: "Строки / суммы таблицы",
      },
    ],
    counts: {
      n: 5,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "16 крестиков",
  },
  "M6.17": {
    rabbits: [
      {
        label: "Конфеты",
        id: "candies",
      },
    ],
    cells: [
      {
        id: "categories",
        label: "Клетки шахматной доски",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "48",
  },
  "M6.18": {
    rabbits: [
      {
        label: "Числа в таблице",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "table-rows",
        label: "Строки / суммы таблицы",
      },
    ],
    counts: {
      n: 1,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "нельзя",
  },
  "M6.19": {
    rabbits: [
      {
        label: "Вершины",
        id: "points",
      },
    ],
    cells: [
      {
        id: "table-rows",
        label: "Строки / суммы таблицы",
      },
    ],
    counts: {
      n: 1,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "на некоторых двух гранях будут написаны совпадающие числа",
  },
  "M6.20": {
    rabbits: [
      {
        label: "Числа в таблице",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "table-rows",
        label: "Строки / суммы таблицы",
      },
    ],
    counts: {
      n: 5,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "не может",
  },
  "M7.1": {
    rabbits: [
      {
        label: "Ученики",
        id: "students",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: 28,
      m: 29,
      k: 14,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "у оставшихся петиных одноклассников снова будет разное число друзей среди одноклассников",
  },
  "M7.2": {
    rabbits: [
      {
        label: "Вершины",
        id: "points",
      },
      {
        label: "Рёбра",
        id: "links",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "в одной клетке окажется не меньше двух предметов",
  },
  "M7.3": {
    rabbits: [
      {
        label: "Вершины",
        id: "points",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: 1006,
      m: null,
      k: 2011,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "нельзя",
  },
  "M7.4": {
    rabbits: [
      {
        label: "Команды",
        id: "players",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 30,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "найдутся два одинаковых по выбранному признаку",
  },
  "M7.5": {
    rabbits: [
      {
        label: "Элементы / пары из условия",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "эти люди имеют 1, 2, 3,",
  },
  "M7.6": {
    rabbits: [
      {
        label: "Люди",
        id: "people",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: 0,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "количество друзей может принимать n различных значений: 0, 1, 2,",
  },
  "M7.7": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
      {
        label: "Треугольники",
        id: "parts",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "сторона, соединяющая эти вершины, не пересекает прямую",
  },
  "M7.8": {
    rabbits: [
      {
        label: "Люди",
        id: "people",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "найдутся двое с общим знакомым или нужная пара связей",
  },
  "M7.9": {
    rabbits: [
      {
        label: "Вершины",
        id: "points",
      },
      {
        label: "Рёбра",
        id: "links",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: 8,
      m: 8,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "поскольку, 8 – 1 > 3·2, то на концах одного из этих рёбер цифры отличаются не менее чем на 3",
  },
  "M7.10": {
    rabbits: [
      {
        label: "Люди",
        id: "people",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "ясно, что в одной из этих пар оба человека – мужчины",
  },
  "M7.11": {
    rabbits: [
      {
        label: "Вершины",
        id: "points",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: 6,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "есть три вершины, все рёбра между которыми – одного цвета",
  },
  "M7.12": {
    rabbits: [
      {
        label: "Вершины",
        id: "points",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: 17,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "в противном случае этот граф – двухцветный, и согласно задаче 30815 в нём есть одноцветный треугольник",
  },
  "M7.13": {
    rabbits: [
      {
        label: "Элементы / пары из условия",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "в любой момент турнира найдутся две команды, сыгравшие к этому моменту одинаковое число ма",
  },
  "M7.14": {
    rabbits: [
      {
        label: "У участников",
        id: "people",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 10,
      m: null,
      k: 10,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "тогда всего полученных открыток не более 10×4=40, противоречие",
  },
  "M7.15": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "что две данные точки лежат в оставшемся четырехугольнике",
  },
  "M7.16": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
      {
        label: "Треугольники",
        id: "parts",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "аналогично, если все горизонтали одного цвета",
  },
  "M7.17": {
    rabbits: [
      {
        label: "Вершины",
        id: "points",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: 9,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "если же все они синие, то образовался полный синий граф на четырёх вершинах",
  },
  "M7.18": {
    rabbits: [
      {
        label: "Люди",
        id: "people",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 50,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "у них есть по крайней мере два общих знакомых",
  },
  "M7.19": {
    rabbits: [
      {
        label: "Люди",
        id: "people",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: 33,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "рядом сидят представители одного племени, что и требовалось доказать",
  },
  "M7.20": {
    rabbits: [
      {
        label: "Ученики",
        id: "students",
      },
      {
        label: "Люди",
        id: "people",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: 25,
      m: null,
      k: 24,
      minInCell: 12,
    },
    compareOp: "gt",
    conclusionText: "у каждого ученика имеется 24 друга, и задача решена",
  },
  "M7.21": {
    rabbits: [
      {
        label: "Ученики",
        id: "students",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: 25,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "13",
  },
  "M7.22": {
    rabbits: [
      {
        label: "Люди",
        id: "people",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: 2,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "4-х человек сомнения не вызывает",
  },
  "M7.23": {
    rabbits: [
      {
        label: "Вершины",
        id: "points",
      },
      {
        label: "Клетки квадрата",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "colors",
        label: "Чёрные и белые клетки",
      },
    ],
    counts: {
      n: 100,
      m: null,
      k: 2500,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "2500 плит",
  },
  "M7.24": {
    rabbits: [
      {
        label: "Элементы / пары из условия",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "1 очко; проиграла",
  },
  "M7.25": {
    rabbits: [
      {
        label: "Люди",
        id: "people",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "разберём, например, первый случай",
  },
  "M7.26": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
      {
        label: "Треугольники",
        id: "parts",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "можно понять, как обойтись n - 2 точками: достаточно отметить по одной точке в каждом зачерненном треугольнике",
  },
  "M7.27": {
    rabbits: [
      {
        label: "Вершины",
        id: "points",
      },
    ],
    cells: [
      {
        id: "categories",
        label: "Клетки шахматной доски",
      },
    ],
    counts: {
      n: 2,
      m: 9,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "9 клеток",
  },
  "M7.28": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
      {
        label: "Прямоугольники из условия",
        id: "rects",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "для решения задачи с произвольным числом цветов, примените индукцию",
  },
  "M7.29": {
    rabbits: [
      {
        label: "Вершины",
        id: "points",
      },
      {
        label: "Рёбра",
        id: "links",
      },
    ],
    cells: [
      {
        id: "colors",
        label: "Раскраски / цвета",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "6 цветов",
  },
  "M7.30": {
    rabbits: [
      {
        label: "Команды",
        id: "players",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 21,
      m: 169,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "на долю семи первых команд остается не более чем 240 – 72 = 168 очков",
  },
  "M7.31": {
    rabbits: [
      {
        label: "Игроки",
        id: "players",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: 11,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "что в какой-то клетке сидит 11 футболистов",
  },
  "M7.32": {
    rabbits: [
      {
        label: "Вершины",
        id: "points",
      },
      {
        label: "Многоугольники",
        id: "parts",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 100,
      m: null,
      k: 99,
      minInCell: 9901,
    },
    compareOp: "gt",
    conclusionText: "у нас есть не более 100 типов многоугольников",
  },
  "M7.33": {
    rabbits: [
      {
        label: "Шахматные фигуры",
        id: "pieces",
      },
    ],
    cells: [
      {
        id: "categories",
        label: "Клетки шахматной доски",
      },
    ],
    counts: {
      n: 1,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "не мог выиграть и эту",
  },
  "M7.34": {
    rabbits: [
      {
        label: "Элементы / пары из условия",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: 1,
    },
    compareOp: "gt",
    conclusionText: "6 игр",
  },
  "M8.1": {
    rabbits: [
      {
        label: "Пуговица",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "colors",
        label: "Раскраски / цвета",
      },
    ],
    counts: {
      n: 101,
      m: null,
      k: 100,
      minInCell: 11,
    },
    compareOp: "gt",
    conclusionText: "пуговиц какого-то одного цвета не менее 11, что и нужно было показать",
  },
  "M8.2": {
    rabbits: [
      {
        label: "Автомобили",
        id: "cars",
      },
    ],
    cells: [
      {
        id: "colors",
        label: "Раскраски / цвета",
      },
    ],
    counts: {
      n: 100,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "поставить можно только 32 пары",
  },
  "M5.4": {
    rabbits: [
      {
        label: "Точки / отрезки",
        id: "points",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 1000,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "чтобы ось oy не была параллельна ни одному из отрезков",
  },
  "M9.1": {
    rabbits: [
      {
        label: "Ученики",
        id: "students",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 16,
      m: 12,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "4 месяца",
  },
  "M9.2": {
    rabbits: [
      {
        label: "Ученики",
        id: "students",
      },
      {
        label: "Конфеты",
        id: "candies",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 200,
      m: null,
      k: 20,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "21 ученик",
  },
  "M9.3": {
    rabbits: [
      {
        label: "Ученики",
        id: "students",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 27,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "найдётся кружок, в котором занимаются не менее 18 учеников",
  },
  "M9.4": {
    rabbits: [
      {
        label: "Двузначные числа",
        id: "numbers",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: 2,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "не существуют",
  },
  "M9.5": {
    rabbits: [
      {
        label: "Двузначные числа",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "table-rows",
        label: "Строки / суммы таблицы",
      },
    ],
    counts: {
      n: 57,
      m: null,
      k: 41,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "нет, нельзя",
  },
  "M9.6": {
    rabbits: [
      {
        label: "Люди",
        id: "people",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 21,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "в одной клетке окажется не меньше двух предметов",
  },
  "M9.7": {
    rabbits: [
      {
        label: "Числа из условия",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "table-rows",
        label: "Строки / суммы таблицы",
      },
    ],
    counts: {
      n: 3813,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "сумма 100 наибольших чисел не меньше 100/123 суммы всех чисел, то есть не меньше 100/123·3813 = 3100",
  },
  "M9.8": {
    rabbits: [
      {
        label: "Шарики",
        id: "balls",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 44,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "нельзя",
  },
  "M9.9": {
    rabbits: [
      {
        label: "Камней",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 468,
      m: null,
      k: 49,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "нельзя",
  },
  "M9.10": {
    rabbits: [
      {
        label: "Числа из условия",
        id: "numbers",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 50,
      m: 2,
      k: 25,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "обязательно",
  },
  "M9.11": {
    rabbits: [
      {
        label: "Целые числа",
        id: "numbers",
      },
    ],
    cells: [
      {
        id: "table-rows",
        label: "Строки / суммы таблицы",
      },
    ],
    counts: {
      n: 100,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "а) необязательно; б) обязательно",
  },
  "M9.12": {
    rabbits: [
      {
        label: "Объекты доказательства",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "на 0",
  },
  "M9.13": {
    rabbits: [
      {
        label: "Разложи",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 100,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "нельзя",
  },
  "M9.14": {
    rabbits: [
      {
        label: "Разности",
        id: "numbers",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 468,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "нельзя",
  },
  "M9.15": {
    rabbits: [
      {
        label: "Объекты доказательства",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 19890,
      m: 1988,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "их разность будет делится на 1988",
  },
  "M9.16": {
    rabbits: [
      {
        label: "Объекты доказательства",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "table-rows",
        label: "Строки / суммы таблицы",
      },
    ],
    counts: {
      n: 1234096,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "встретятся",
  },
  "M9.17": {
    rabbits: [
      {
        label: "Ученики",
        id: "students",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 7,
      m: null,
      k: 7,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "не могло",
  },
  "M9.18": {
    rabbits: [
      {
        label: "Депутатов",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 15,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "при k = 8",
  },
  "M9.19": {
    rabbits: [
      {
        label: "Заняти",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 1987,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "6-го, 9-го, 13-го, 16-го, 20-го, 23-го, 27-го и 30-го занятия кружка проводились",
  },
  "M9.20": {
    rabbits: [
      {
        label: "Порци",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 16,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "одна мисочка",
  },
  "M9.21": {
    rabbits: [
      {
        label: "Объекты доказательства",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "трое детей, каждому из них принадлежало по три носка",
  },
  "M9.22": {
    rabbits: [
      {
        label: "Люди",
        id: "people",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 100,
      m: null,
      k: null,
      minInCell: 4,
    },
    compareOp: "gt",
    conclusionText: "рёбер не менее 4·2 : 2 = 4",
  },
  "M9.23": {
    rabbits: [
      {
        label: "Объекты доказательства",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "5 раз",
  },
  "M9.24": {
    rabbits: [
      {
        label: "Дети",
        id: "people",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 20,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "можно",
  },
  "M9.25": {
    rabbits: [
      {
        label: "Объекты доказательства",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 100,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "не сможет",
  },
  "M9.26": {
    rabbits: [
      {
        label: "Объекты доказательства",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "table-rows",
        label: "Строки / суммы таблицы",
      },
    ],
    counts: {
      n: 60,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "нельзя",
  },
  "M9.27": {
    rabbits: [
      {
        label: "Скворцов",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "links",
        label: "Связи / пары",
      },
    ],
    counts: {
      n: 20,
      m: 14,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "7 снимков",
  },
  "M9.28": {
    rabbits: [
      {
        label: "Объекты доказательства",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "люся егорова катается с юрой воробьёвым",
  },
  "M9.29": {
    rabbits: [
      {
        label: "Люди",
        id: "people",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 32,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "при восьми лжецах",
  },
  "M9.30": {
    rabbits: [
      {
        label: "Депутатов",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "table-rows",
        label: "Строки / суммы таблицы",
      },
    ],
    counts: {
      n: 2000,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "k = 1991",
  },
  "M9.31": {
    rabbits: [
      {
        label: "Объекты доказательства",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 1,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "существует степень тройки, оканчивающаяся на 001",
  },
  "M9.32": {
    rabbits: [
      {
        label: "Многоугольники",
        id: "parts",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 170,
      m: 36,
      k: null,
      minInCell: 36,
    },
    compareOp: "gt",
    conclusionText: "180o(n-2) < 170o· 36 + 180o(n-36), т",
  },
  "M9.33": {
    rabbits: [
      {
        label: "Объекты доказательства",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 1978,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "не существует",
  },
  "M9.34": {
    rabbits: [
      {
        label: "Ученики",
        id: "students",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 1989,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "он может написать число, делящееся на 1989",
  },
  "M9.35": {
    rabbits: [
      {
        label: "Разбили",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 72,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "= 362880, а 713 = 357911 < 9!",
  },
  "M9.36": {
    rabbits: [
      {
        label: "Шахматные фигуры",
        id: "pieces",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 16,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "16",
  },
  "M9.37": {
    rabbits: [
      {
        label: "Объекты доказательства",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 9,
      m: 3,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "каково бы ни было целое число n, среди чисел n, n + 1, n + 2,",
  },
  "M9.38": {
    rabbits: [
      {
        label: "Люди",
        id: "people",
      },
    ],
    cells: [
      {
        id: "ages",
        label: "Возможные возрасты",
      },
    ],
    counts: {
      n: 7,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "есть тройка, суммарный возраст в которой не меньше, чем 15 · 332/35, что больше 142",
  },
  "M9.39": {
    rabbits: [
      {
        label: "Объекты доказательства",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 1,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "они не могут пересекаться в точке c",
  },
  "M9.40": {
    rabbits: [
      {
        label: "Пионеров",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 11,
      m: null,
      k: 1,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "найдутся два пионера а и в такие, что все кружки, которые посещает а, посещает и в",
  },
  "M9.41": {
    rabbits: [
      {
        label: "Рёбра / связи",
        id: "links",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 10,
      m: null,
      k: 10,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "у деда, соответствующего этой вершине, семь внуков",
  },
  "M9.42": {
    rabbits: [
      {
        label: "Ученики",
        id: "students",
      },
      {
        label: "Школьники",
        id: "pupils",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 16,
      m: null,
      k: 14,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "а) обязательно; б) не обязательно",
  },
  "M9.43": {
    rabbits: [
      {
        label: "Дети",
        id: "people",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 20,
      m: null,
      k: null,
      minInCell: 14,
    },
    compareOp: "gt",
    conclusionText: "у школьников b и c есть общий дед z",
  },
  "M9.44": {
    rabbits: [
      {
        label: "Объекты доказательства",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "тогда можно из a попасть в b по маршруту acb",
  },
  "M9.45": {
    rabbits: [
      {
        label: "Объекты доказательства",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 19,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "стрелки ведут от всех котов, что и требовалось",
  },
  "M9.46": {
    rabbits: [
      {
        label: "Объекты доказательства",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: 15,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "рассматриваемая ломаная должна иметь еще по крайней мере шесть звеньев, то есть не меньше 15 звеньев",
  },
  "M9.47": {
    rabbits: [
      {
        label: "Люди",
        id: "people",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 150,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "в a не меньше 150 депутатов",
  },
  "M9.48": {
    rabbits: [
      {
        label: "Ученики",
        id: "students",
      },
      {
        label: "Школьники",
        id: "pupils",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 1,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "требуемый школьник найдётся",
  },
  "M9.49": {
    rabbits: [
      {
        label: "Рабочие",
        id: "workers",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 1500,
      m: null,
      k: null,
      minInCell: 5,
    },
    compareOp: "gt",
    conclusionText: "если бы каждый из рабочих мог купить магнитофон, то у них в сумме было бы не менее 5 · 320 = 1600 рублей",
  },
  "M9.50": {
    rabbits: [
      {
        label: "Террори",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 11,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "он участвовал в вылазках со всеми 11 террористами вылазки z, причём все эти вылазки различны",
  },
  "M9.51": {
    rabbits: [
      {
        label: "Люди",
        id: "people",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 11,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "на 20 кусков",
  },
  "M9.52": {
    rabbits: [
      {
        label: "Ученики",
        id: "students",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "с кем-то из математиков он ходит ещё в один кружок, например, в танцевальный",
  },
  "M9.53": {
    rabbits: [
      {
        label: "Дети",
        id: "people",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 50,
      m: null,
      k: 49,
      minInCell: 8,
    },
    compareOp: "gt",
    conclusionText: "есть ряд, в котором сидело не менее 8 детей",
  },
  "M9.54": {
    rabbits: [
      {
        label: "Ёлки",
        id: "trees",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 1010,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "если какие-то две сосны стоят подряд, то задача решена – дерево с буквой в между ними удовлетворяет условиям",
  },
  "M9.55": {
    rabbits: [
      {
        label: "Объекты доказательства",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: 9,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "за 4 концерта",
  },
  "M9.56": {
    rabbits: [
      {
        label: "Ученики",
        id: "students",
      },
      {
        label: "Школьники",
        id: "pupils",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 20,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "тогда на каждом из этих пяти занятий все остальные школьники разные",
  },
  "M9.57": {
    rabbits: [
      {
        label: "Пары элементов",
        id: "objects",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 12,
      m: 13,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "что за дни с (i+1)-го по j-й теннисист сыграл ровно 20 партий",
  },
  "M9.58": {
    rabbits: [
      {
        label: "Ученики",
        id: "students",
      },
      {
        label: "Школьники",
        id: "pupils",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: null,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "всего отмечено 24 тройки",
  },
  "M9.59": {
    rabbits: [
      {
        label: "Согласны",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 22,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "что гласных в ней достаточно, чтобы заполнить все промежутки между согласными",
  },
  "M9.60": {
    rabbits: [
      {
        label: "Ученики",
        id: "students",
      },
      {
        label: "Школьники",
        id: "pupils",
      },
    ],
    cells: [
      {
        label: "Варианты построения",
        id: "construction",
      },
    ],
    counts: {
      n: 19,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "б) нет",
  },
  "M9.61": {
    rabbits: [
      {
        label: "Объекты доказательства",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "parts",
        label: "Части разбиения",
      },
    ],
    counts: {
      n: 16,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "мы нашли две карты, которые при всех операциях либо снимались, либо оставались в колоде вместе",
  },
  "M9.62": {
    rabbits: [
      {
        label: "Объекты доказательства",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 15,
      m: null,
      k: null,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "хотя бы одно из восьми стекол, предназначавшихся заранее для восьми оставшихся окон, осталось",
  },
  "M9.63": {
    rabbits: [
      {
        label: "Вагонов",
        id: "objects",
      },
    ],
    cells: [
      {
        id: "remainders",
        label: "Остатки при делении",
      },
    ],
    counts: {
      n: 76,
      m: null,
      k: 1,
      minInCell: null,
    },
    compareOp: "gt",
    conclusionText: "82 мудреца",
  },
};
