import type { SolutionLine } from "@/data/heads-legs/types";

/** Стандартные пропуски для write_solution в runner'е «остатки как домики» */
export function buildRemaindersWriteSolutionLines(opts: {
  idPrefix: string;
  modulus: number;
  objectsCount: number;
  objectsLabel: string;
  includeNoRemainderLine?: boolean;
}): SolutionLine[] {
  const { idPrefix, modulus, objectsCount, objectsLabel, includeNoRemainderLine = true } = opts;
  const lastRemainder = modulus - 1;

  const lines: SolutionLine[] = [
    {
      template: `Будем смотреть на остатки ${objectsLabel} при делении на [ ].`,
      blanks: [{ id: `${idPrefix}-w1`, type: "number", accept: modulus }],
    },
    {
      template: "Возможных остатков всего [ ]: от [ ] до [ ].",
      blanks: [
        { id: `${idPrefix}-w2`, type: "number", accept: modulus },
        { id: `${idPrefix}-w3`, type: "number", accept: 0 },
        { id: `${idPrefix}-w4`, type: "number", accept: lastRemainder },
      ],
    },
  ];

  if (includeNoRemainderLine) {
    lines.push({
      template:
        "Остатка [ ] быть не может, потому что остаток всегда меньше числа, на которое делим.",
      blanks: [{ id: `${idPrefix}-w2b`, type: "number", accept: modulus }],
    });
  }

  lines.push(
    {
      template: "Чисел дано [ ], а домиков для остатков только [ ].",
      blanks: [
        { id: `${idPrefix}-w5`, type: "number", accept: objectsCount },
        { id: `${idPrefix}-w6`, type: "number", accept: modulus },
      ],
    },
    {
      template:
        "Значит, по принципу Дирихле два числа попадут в один и тот же домик — у них одинаковый остаток при делении на [ ].",
      blanks: [{ id: `${idPrefix}-w7`, type: "number", accept: modulus }],
    },
    {
      template: "Если у двух чисел одинаковые остатки при делении на [ ], то их разность делится на [ ].",
      blanks: [
        { id: `${idPrefix}-w8`, type: "number", accept: modulus },
        { id: `${idPrefix}-w9`, type: "number", accept: modulus },
      ],
    },
    {
      template:
        "Значит, среди данных чисел можно выбрать два числа, разность которых делится на [ ].",
      blanks: [{ id: `${idPrefix}-w10`, type: "number", accept: modulus }],
    },
  );

  return lines;
}
