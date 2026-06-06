import type { RemaindersModel } from "./types";
import { REMAINDERS_COMPACT_THRESHOLD } from "./types";

/** Полные модели pilot-задач F4 */
export const REMAINDERS_MODELS: Record<string, RemaindersModel> = {
  "M4.11": {
    modulus: 11,
    objectsCount: 12,
    objectsLabel: "двузначных чисел",
    housesCount: 11,
    housesLabel: "остатков",
    targetRelation: "разность делится на 11",
    conclusionTemplate:
      "Найдутся два числа с одинаковым остатком при делении на 11, поэтому их разность делится на 11.",
    writeSolutionLines: [
      {
        template: "Будем смотреть на остатки двузначных чисел при делении на [ ].",
        blanks: [{ id: "m411-w1", type: "number", accept: 11 }],
      },
      {
        template: "Возможных остатков всего [ ]: от [ ] до [ ].",
        blanks: [
          { id: "m411-w2", type: "number", accept: 11 },
          { id: "m411-w3", type: "number", accept: 0 },
          { id: "m411-w4", type: "number", accept: 10 },
        ],
      },
      {
        template: "Чисел дано [ ], а домиков-остатков только [ ].",
        blanks: [
          { id: "m411-w5", type: "number", accept: 12 },
          { id: "m411-w6", type: "number", accept: 11 },
        ],
      },
      {
        template:
          "Значит, по принципу Дирихле два числа попадут в один и тот же домик — у них одинаковый остаток при делении на [ ].",
        blanks: [{ id: "m411-w7", type: "number", accept: 11 }],
      },
      {
        template: "Если у двух чисел одинаковые остатки при делении на [ ], то их разность делится на [ ].",
        blanks: [
          { id: "m411-w8", type: "number", accept: 11 },
          { id: "m411-w9", type: "number", accept: 11 },
        ],
      },
      {
        template:
          "Значит, среди данных чисел можно выбрать два числа, разность которых делится на [ ].",
        blanks: [{ id: "m411-w10", type: "number", accept: 11 }],
      },
    ],
  },
  "M4.18": {
    modulus: 2000,
    objectsCount: 2001,
    objectsLabel: "целых чисел",
    housesCount: 2000,
    housesLabel: "остатков",
    targetRelation: "разность делится на 2000",
    conclusionTemplate:
      "Найдутся два числа с одинаковым остатком при делении на 2000, поэтому их разность делится на 2000.",
    compactHouses: true,
    writeSolutionLines: [
      {
        template: "Будем смотреть на остатки целых чисел при делении на [ ].",
        blanks: [{ id: "m418-w1", type: "number", accept: 2000 }],
      },
      {
        template: "Возможных остатков всего [ ]: от [ ] до [ ].",
        blanks: [
          { id: "m418-w2", type: "number", accept: 2000 },
          { id: "m418-w3", type: "number", accept: 0 },
          { id: "m418-w4", type: "number", accept: 1999 },
        ],
      },
      {
        template: "Чисел дано [ ], а домиков-остатков только [ ].",
        blanks: [
          { id: "m418-w5", type: "number", accept: 2001 },
          { id: "m418-w6", type: "number", accept: 2000 },
        ],
      },
      {
        template:
          "Значит, по принципу Дирихле два числа попадут в один и тот же домик — у них одинаковый остаток при делении на [ ].",
        blanks: [{ id: "m418-w7", type: "number", accept: 2000 }],
      },
      {
        template: "Если у двух чисел одинаковые остатки при делении на [ ], то их разность делится на [ ].",
        blanks: [
          { id: "m418-w8", type: "number", accept: 2000 },
          { id: "m418-w9", type: "number", accept: 2000 },
        ],
      },
      {
        template:
          "Значит, среди данных чисел можно выбрать два числа, разность которых делится на [ ].",
        blanks: [{ id: "m418-w10", type: "number", accept: 2000 }],
      },
    ],
  },
};

export const REMAINDERS_PILOT_METHOD_IDS = Object.keys(REMAINDERS_MODELS);

/** Применить compactHouses по умолчанию для больших модулей */
export function withCompactDefaults(model: RemaindersModel): RemaindersModel {
  if (model.compactHouses != null) return model;
  return {
    ...model,
    compactHouses: model.modulus >= REMAINDERS_COMPACT_THRESHOLD,
  };
}
