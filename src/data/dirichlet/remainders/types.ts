/** Экранный сценарий «Остатки как домики» */
import type { SolutionLine } from "@/data/heads-legs/types";

export type RemaindersStepKind =
  | "intro_video"
  | "read_condition"
  | "find_modulus"
  | "build_houses"
  | "identify_objects"
  | "find_collision"
  | "explain_divisibility"
  | "write_solution"
  | "finish";

export interface RemaindersModel {
  /** Модуль деления (число домиков-остатков) */
  modulus: number;
  objectsCount: number;
  objectsLabel: string;
  housesCount: number;
  housesLabel: string;
  /** Формулировка цели из условия */
  targetRelation: string;
  conclusionTemplate: string;
  /** Пропуски для экрана «Запиши решение словами» */
  writeSolutionLines?: SolutionLine[];
  /** Сжатая визуализация при большом модуле */
  compactHouses?: boolean;
}

export interface RemaindersStep {
  id: string;
  kind: RemaindersStepKind;
  title: string;
  screenPhaseIndex: number;
  screenPhaseCount: number;
}

/** Порог: выше — сжатая лента домиков вместо сетки */
export const REMAINDERS_COMPACT_THRESHOLD = 20;
