import type { SolutionLine } from "../types";

/** Строки решения после prelude (замена по ногам/кристаллам). */
export type DualAssumeSolutionPaths = [SolutionLine[], SolutionLine[]];

export interface DualAssumePathConfig {
  methodTaskId: string;
  entityLabels: [string, string];
  totalCount: number;
  totalUnit: string;
  selectPrompt: string;
  context: string;
  successMessages: [string, string];
  /** [путь через entityLabels[0], путь через entityLabels[1]] */
  solutionLinesByPath: DualAssumeSolutionPaths;
}

/** Задачи derive-base с двумя математически корректными путями assume. */
export const DUAL_ASSUME_PATH_CONFIG: Record<string, DualAssumePathConfig> = {
  "5.2": {
    methodTaskId: "5.2",
    entityLabels: ["Банты", "Джавы"],
    totalCount: 44,
    totalUnit: "животных",
    selectPrompt: "Представим, что все 44 животных — …",
    context:
      "Оба пути верны и приведут к одному ответу. С каким видом начнём пробную картину?",
    successMessages: [
      "Хорошо! Посчитаем, сколько лишних ног было бы, если бы все были Бантами.",
      "Хорошо! Посчитаем, сколько ног не хватало бы, если бы все были Джавами.",
    ],
    solutionLinesByPath: [
      // Путь через Бантов (больше ног на объект)
      [
        {
          template: "Представим, что все [44] головы принадлежали [Бантам].",
          blanks: [
            { id: "5.2-p0-b0", type: "number", accept: [44, "44"] },
            { id: "5.2-p0-b1", type: "object", accept: ["Бантам"] },
          ],
        },
        {
          template: "Тогда ног было бы [44 x 4 = 176].",
          blanks: [{ id: "5.2-p0-b2", type: "expression", accept: ["44 x 4 = 176"] }],
        },
        {
          template: "По условию ног [108].",
          blanks: [{ id: "5.2-p0-b3", type: "number", accept: [108, "108"] }],
        },
        {
          template: "Лишних ног [176 - 108 = 68].",
          blanks: [{ id: "5.2-p0-b4", type: "expression", accept: ["176 - 108 = 68"] }],
        },
        {
          template: "Джав вместо Банта уменьшает число ног на [4 - 2 = 2].",
          blanks: [{ id: "5.2-p0-b5", type: "expression", accept: ["4 - 2 = 2"] }],
        },
        {
          template: "Джав было [68 ÷ 2 = 34].",
          blanks: [{ id: "5.2-p0-b6", type: "expression", accept: ["68 ÷ 2 = 34"] }],
        },
        {
          template: "Бантов [44 - 34 = 10].",
          blanks: [{ id: "5.2-p0-b7", type: "expression", accept: ["44 - 34 = 10"] }],
        },
        {
          template: "Ответ: [34 Джавы].",
          blanks: [{ id: "5.2-p0-b8", type: "object", accept: ["34 Джавы"] }],
        },
      ],
      // Путь через Джав (меньше ног на объект)
      [
        {
          template: "Представим, что все [44] головы принадлежали [Джавам].",
          blanks: [
            { id: "5.2-p1-b0", type: "number", accept: [44, "44"] },
            { id: "5.2-p1-b1", type: "object", accept: ["Джавам"] },
          ],
        },
        {
          template: "Тогда ног было бы [44 x 2 = 88].",
          blanks: [{ id: "5.2-p1-b2", type: "expression", accept: ["44 x 2 = 88"] }],
        },
        {
          template: "По условию ног [108].",
          blanks: [{ id: "5.2-p1-b3", type: "number", accept: [108, "108"] }],
        },
        {
          template: "Не хватает ног [108 - 88 = 20].",
          blanks: [{ id: "5.2-p1-b4", type: "expression", accept: ["108 - 88 = 20"] }],
        },
        {
          template: "Бант вместо Джав добавляет [4 - 2 = 2] ноги.",
          blanks: [{ id: "5.2-p1-b5", type: "expression", accept: ["4 - 2 = 2"] }],
        },
        {
          template: "Бантов [20 ÷ 2 = 10].",
          blanks: [{ id: "5.2-p1-b6", type: "expression", accept: ["20 ÷ 2 = 10"] }],
        },
        {
          template: "Джав было [44 - 10 = 34].",
          blanks: [{ id: "5.2-p1-b7", type: "expression", accept: ["44 - 10 = 34"] }],
        },
        {
          template: "Ответ: [34 Джавы].",
          blanks: [{ id: "5.2-p1-b8", type: "object", accept: ["34 Джавы"] }],
        },
      ],
    ],
  },
  "5.6": {
    methodTaskId: "5.6",
    entityLabels: ["мечи Джедаев", "мечи Ситхов"],
    totalCount: 17,
    totalUnit: "мечей",
    selectPrompt: "Представим, что все 17 мечей — …",
    context:
      "Оба пути верны и приведут к одному ответу. С каким видом мечей начнём пробную картину?",
    successMessages: [
      "Хорошо! Посчитаем, сколько кристаллов не хватало бы, если бы все мечи были мечами Джедаев.",
      "Хорошо! Посчитаем, сколько лишних кристаллов было бы, если бы все мечи были мечами Ситхов.",
    ],
    solutionLinesByPath: [
      // Путь через мечи Джедаев (меньше кристаллов)
      [
        {
          template: "Представим, что все [17] мечей были [мечами Джедаев].",
          blanks: [
            { id: "5.6-p0-b0", type: "number", accept: [17, "17"] },
            { id: "5.6-p0-b1", type: "object", accept: ["мечами Джедаев"] },
          ],
        },
        {
          template: "Тогда кристаллов понадобилось бы [17 x 1 = 17].",
          blanks: [{ id: "5.6-p0-b2", type: "expression", accept: ["17 x 1 = 17"] }],
        },
        {
          template: "По условию кристаллов [32].",
          blanks: [{ id: "5.6-p0-b3", type: "number", accept: [32, "32"] }],
        },
        {
          template: "Не хватает кристаллов [32 - 17 = 15].",
          blanks: [{ id: "5.6-p0-b4", type: "expression", accept: ["32 - 17 = 15"] }],
        },
        {
          template: "Один меч Ситха добавляет [2 - 1 = 1] кристалл.",
          blanks: [{ id: "5.6-p0-b5", type: "expression", accept: ["2 - 1 = 1"] }],
        },
        {
          template: "Мечей Ситхов было [15 ÷ 1 = 15].",
          blanks: [{ id: "5.6-p0-b6", type: "expression", accept: ["15 ÷ 1 = 15", "15"] }],
        },
        {
          template: "Мечей Джедаев было [17 - 15 = 2].",
          blanks: [{ id: "5.6-p0-b7", type: "expression", accept: ["17 - 15 = 2"] }],
        },
        {
          template: "Ответ: [2 меча Джедаев].",
          blanks: [{ id: "5.6-p0-b8", type: "object", accept: ["2 меча Джедаев"] }],
        },
      ],
      // Путь через мечи Ситхов (больше кристаллов)
      [
        {
          template: "Представим, что все [17] мечей были [мечами Ситхов].",
          blanks: [
            { id: "5.6-p1-b0", type: "number", accept: [17, "17"] },
            { id: "5.6-p1-b1", type: "object", accept: ["мечами Ситхов"] },
          ],
        },
        {
          template: "Тогда кристаллов понадобилось бы [17 x 2 = 34].",
          blanks: [{ id: "5.6-p1-b2", type: "expression", accept: ["17 x 2 = 34"] }],
        },
        {
          template: "По условию кристаллов [32].",
          blanks: [{ id: "5.6-p1-b3", type: "number", accept: [32, "32"] }],
        },
        {
          template: "Лишних кристаллов [34 - 32 = 2].",
          blanks: [{ id: "5.6-p1-b4", type: "expression", accept: ["34 - 32 = 2"] }],
        },
        {
          template: "Один меч Джедая уменьшает число кристаллов на [2 - 1 = 1].",
          blanks: [{ id: "5.6-p1-b5", type: "expression", accept: ["2 - 1 = 1"] }],
        },
        {
          template: "Мечей Джедаев было [2 ÷ 1 = 2].",
          blanks: [{ id: "5.6-p1-b6", type: "expression", accept: ["2 ÷ 1 = 2", "2"] }],
        },
        {
          template: "Мечей Ситхов было [17 - 2 = 15].",
          blanks: [{ id: "5.6-p1-b7", type: "expression", accept: ["17 - 2 = 15"] }],
        },
        {
          template: "Ответ: [2 меча Джедаев].",
          blanks: [{ id: "5.6-p1-b8", type: "object", accept: ["2 меча Джедаев"] }],
        },
      ],
    ],
  },
};

export function hasDualAssumePath(methodTaskId: string): boolean {
  return methodTaskId in DUAL_ASSUME_PATH_CONFIG;
}

export function resolveDualAssumeSolutionLines(
  methodTaskId: string,
  pathIndex: 0 | 1,
): SolutionLine[] | undefined {
  const cfg = DUAL_ASSUME_PATH_CONFIG[methodTaskId];
  if (!cfg) return undefined;
  return cfg.solutionLinesByPath[pathIndex];
}
