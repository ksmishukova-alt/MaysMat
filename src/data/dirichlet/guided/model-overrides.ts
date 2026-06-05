import type { DirichletInferredModel } from "../types";



/** Ручные правки поверх generated overrides (hotfix для эталонных и проблемных задач) */

export const DIRICHLET_MODEL_MANUAL_OVERRIDES: Partial<

  Record<string, Partial<DirichletInferredModel>>

> = {

  "M0.1": {

    rabbits: [{ id: "tourists", label: "Туристы" }],

    cells: [{ id: "ages", label: "Возможные возрасты (20–35)" }],

    counts: { n: 20, m: 16 },

    compareOp: "gt",

    conclusionText: "в одной «клетке» окажутся минимум двое туристов — одногодки",

  },

  "M0.2": {

    rabbits: [{ id: "coins", label: "Медные монеты" }],

    cells: [{ id: "types", label: "Типы монет (1, 2, 3, 5 коп.)" }],

    counts: { n: 25, m: 4, minInCell: 7 },

    compareOp: "gt",

    conclusionText: "найдётся 7 монет одного достоинства",

  },

  "M1.1": {
    rabbits: [{ id: "people", label: "Грибники" }],
    cells: [{ id: "numbers", label: "Варианты числа грибов (0…9)" }],
    counts: { n: 10, m: 10 },
    conclusionText: "0, 1, 2, 3, 4, 5, 6, 7, 8, 10 грибов",
  },

  "M1.2": {
    rabbits: [{ id: "objects", label: "Положения верхней шестерёнки" }],
    cells: [{ id: "categories", label: "Плохие совпадения зубьев" }],
    counts: { n: 14, m: 12 },
    conclusionText: "найдётся хорошее положение — шестерёнки образуют цельную фигуру",
  },

  "M1.4": {
    rabbits: [{ id: "matches", label: "Концы спичек (вершины)" }],
    cells: [{ id: "colors", label: "Цвета концов" }],
    counts: { n: 3, m: 2 },
    compareOp: "gt",
    conclusionText: "а-б) не всегда",
  },

  "M1.5": {
    rabbits: [{ id: "students", label: "Участия учеников в группах" }],
    cells: [{ id: "categories", label: "Группы по именам и фамилиям" }],
    counts: { n: 66, m: 11, minInCell: 2 },
    conclusionText: "найдутся двое с одинаковыми именем и фамилией",
  },

  "M0.3": {

    rabbits: [{ id: "players", label: "Футболисты / жители Москвы" }],

    cells: [{ id: "weekdays", label: "Дни недели / дни рождения" }],

    counts: { n: 11, m: 7 },

    compareOp: "gt",

    conclusionText: "два игрока с одним днём недели или 10000 москвичей с одним днём рождения",

  },

  "M1.3": {

    rabbits: [{ id: "trees", label: "Ёлки" }],

    cells: [{ id: "needle-counts", label: "Число иголок на ёлке" }],

    counts: { n: 1_000_000, m: 600_001 },

    compareOp: "gt",

    conclusionText: "найдутся две елки с одинаковым числом иголок",

  },

  "M2.1": {

    rabbits: [{ id: "students", label: "Ученики класса" }],

    cells: [{ id: "months", label: "Месяцы рождения" }],

    counts: { n: 38, m: 12, minInCell: 4 },

    compareOp: "gt",

    conclusionText: "четверо родились в один месяц",

  },

  "M2.2": {

    rabbits: [{ id: "students", label: "Ученики школы" }],

    cells: [{ id: "days", label: "Дни года" }],

    counts: { n: 800, m: 366, minInCell: 3 },

    compareOp: "gt",

    conclusionText: "хотя бы трое родились в один день",

  },

  "M2.6": {

    rabbits: [{ id: "boxes", label: "Ящики с яблоками" }],

    cells: [{ id: "categories", label: "Сорта яблок" }],

    counts: { n: 25, m: 3, k: 8, minInCell: 9 },

    compareOp: "gt",

    conclusionText: "не менее 9 ящиков одного сорта",

  },

  "M3.1": {

    rabbits: [{ id: "drawn", label: "Вынутые предметы" }],

    cells: [{ id: "colors", label: "Цвета шариков" }],

    counts: { n: 5, m: 4, minInCell: 2 },

    compareOp: "gt",

    conclusionText: "два шарика одного цвета",

  },

  "M3.2": {

    rabbits: [{ id: "balls", label: "Шарики" }],

    cells: [{ id: "colors", label: "Цвета (чёрный и белый)" }],

    conclusionText: "3 шара — заведомо два одного цвета",

  },

  "M4.17": {

    rabbits: [{ id: "objects", label: "Клетки таблицы 13×13" }],

    cells: [{ id: "table-rows", label: "Кресты (строка + столбец)" }],

    conclusionText: "не могут — все клетки диагонали быть хорошими",

  },

  "M4.11": {
    rabbits: [{ id: "numbers", label: "Двузначные числа" }],
    cells: [{ id: "remainders", label: "Остатки при делении на 11" }],
    counts: { n: 12, m: 11 },
    conclusionText: "найдутся два числа с одинаковым остатком — их разность делится на 11",
  },

  "M4.12": {
    rabbits: [{ id: "numbers", label: "Попарные разности" }],
    cells: [{ id: "numbers", label: "Возможные разности (1…14)" }],
    counts: { n: 28, m: 14, minInCell: 3 },
    conclusionText: "найдутся три одинаковые разности",
  },

  "M4.21": {
    rabbits: [{ id: "numbers", label: "Натуральные числа" }],
    cells: [{ id: "remainders", label: "Остатки при делении на 3" }],
    counts: { n: 7, m: 3 },
    conclusionText: "можно выбрать три числа с одинаковым остатком — сумма делится на 3",
  },

  "M5.32": {

    rabbits: [{ id: "parts", label: "Детали конструктора (скобки П)" }],

    cells: [{ id: "construction", label: "Рёбра каркаса куба" }],

    conclusionText: "нельзя",

  },

  "M5.34": {

    rabbits: [{ id: "rects", label: "Прямоугольники 4×1" }],

    cells: [{ id: "parts", label: "Клетки квадрата 6×6" }],

    conclusionText: "8",

  },

  "M5.50": {

    rabbits: [{ id: "marked", label: "Закрашенные клетки" }],

    cells: [{ id: "parts", label: "Позиции для закрашенных клеток" }],

    conclusionText: "не больше 17 закрашенных клеток",

  },

  "M5.53": {

    rabbits: [{ id: "marked", label: "Чёрные клетки" }],

    cells: [{ id: "colors", label: "Чёрные и белые клетки" }],

    conclusionText: "на 9 многоугольников",

  },

  "M6.3": {

    rabbits: [{ id: "pieces", label: "Занятые клетки (фигуры)" }],

    cells: [{ id: "categories", label: "Клетки шахматной доски" }],

    conclusionText: "найдутся две соседние занятые клетки",

  },

  "M6.12": {
    rabbits: [{ id: "objects", label: "Клетки доски 5×5" }],
    cells: [{ id: "colors", label: "Цвета покраски" }],
  },

  "M7.31": {
    rabbits: [{ id: "players", label: "Футболисты" }],
    cells: [{ id: "categories", label: "Футбольные команды" }],
    conclusionText: "хотя бы одна команда доставлена целиком",
  },

};


