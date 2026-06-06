import type { RemaindersModel } from "./types";
import { REMAINDERS_COMPACT_THRESHOLD } from "./types";
import { buildRemaindersRuleInstance } from "@/data/method-rules";
import { buildRemaindersWriteSolutionLines } from "./write-solution-lines";

function baseModel(
  partial: Omit<RemaindersModel, "ruleInstance" | "writeSolutionLines"> & {
    idPrefix: string;
    showRuleScreen: boolean;
    includeNoRemainderLine?: boolean;
  },
): RemaindersModel {
  const {
    idPrefix,
    showRuleScreen,
    includeNoRemainderLine,
    progressionProfile,
    ...core
  } = partial;

  return {
    ...core,
    progressionProfile,
    writeSolutionLines: buildRemaindersWriteSolutionLines({
      idPrefix,
      modulus: core.modulus,
      objectsCount: core.objectsCount,
      objectsLabel: core.objectsLabel,
      includeNoRemainderLine,
    }),
    ruleInstance: buildRemaindersRuleInstance(
      {
        modulus: core.modulus,
        objectsCount: core.objectsCount,
        objectsLabel: core.objectsLabel,
        housesCount: core.housesCount,
        housesLabel: core.housesLabel,
        targetRelation: core.targetRelation,
        conclusionTemplate: "",
        compactHouses: core.compactHouses,
      },
      { showRuleScreen },
    ),
  };
}

/** Полные модели pilot / childRoute задач F4 */
export const REMAINDERS_MODELS: Record<string, RemaindersModel> = {
  "M4.11": baseModel({
    idPrefix: "m411",
    showRuleScreen: true,
    progressionProfile: 1,
    modulus: 11,
    objectsCount: 12,
    objectsLabel: "двузначных чисел",
    housesCount: 11,
    housesLabel: "остатков",
    targetRelation: "разность делится на 11",
    conclusionTemplate:
      "Найдутся два числа с одинаковым остатком при делении на 11, поэтому их разность делится на 11.",
  }),
  "M4.22": baseModel({
    idPrefix: "m422",
    showRuleScreen: true,
    progressionProfile: 2,
    modulus: 5,
    objectsCount: 6,
    objectsLabel: "целых чисел",
    housesCount: 5,
    housesLabel: "остатков",
    targetRelation: "разность делится на 5",
    conclusionTemplate:
      "Найдутся два числа с одинаковым остатком при делении на 5, поэтому их разность делится на 5.",
  }),
  "M4.18": baseModel({
    idPrefix: "m418",
    showRuleScreen: false,
    progressionProfile: 3,
    includeNoRemainderLine: true,
    modulus: 2000,
    objectsCount: 2001,
    objectsLabel: "целых чисел",
    housesCount: 2000,
    housesLabel: "остатков",
    targetRelation: "разность делится на 2000",
    conclusionTemplate:
      "Найдутся два числа с одинаковым остатком при делении на 2000, поэтому их разность делится на 2000.",
    compactHouses: true,
  }),
  "M4.24": baseModel({
    idPrefix: "m424",
    showRuleScreen: false,
    progressionProfile: 4,
    includeNoRemainderLine: false,
    modulus: 7,
    objectsCount: 8,
    objectsLabel: "целых чисел",
    housesCount: 7,
    housesLabel: "остатков",
    targetRelation: "разность делится на 7",
    conclusionTemplate:
      "Найдутся два числа с одинаковым остатком при делении на 7, поэтому их разность делится на 7.",
  }),
};

/** Задачи с явной моделью для childRoute и QA */
export const REMAINDERS_PILOT_METHOD_IDS = Object.keys(REMAINDERS_MODELS);

/** Детский маршрут подтемы «Остатки как домики» (простой подтип) */
export const REMAINDERS_CHILD_ROUTE_METHOD_IDS = ["M4.11", "M4.22", "M4.18", "M4.24"] as const;

/** Применить compactHouses по умолчанию для больших модулей */
export function withCompactDefaults(model: RemaindersModel): RemaindersModel {
  if (model.compactHouses != null) return model;
  return {
    ...model,
    compactHouses: model.modulus >= REMAINDERS_COMPACT_THRESHOLD,
  };
}
