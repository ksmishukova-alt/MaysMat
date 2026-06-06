/** Экранный сценарий «Остатки как домики» */
import type { SolutionLine } from "@/data/heads-legs/types";
import type { RemaindersRuleInstance } from "@/data/method-rules/types";

import type { RemaindersProgressionProfile } from "./progression";

export type { RemaindersProgressionProfile };

export type RemaindersStepKind =
  | "intro_video"
  | "method_rule"
  | "read_condition"
  | "find_modulus"
  | "build_houses"
  | "houses_count_quiz"
  | "identify_objects"
  | "find_collision"
  | "divisibility_example"
  | "explain_divisibility"
  | "choose_method"
  | "write_solution"
  | "finish";

export interface RemaindersModel {
  /** Модуль деления (число домиков остатков) */
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
  /** Методическое правило с числами задачи */
  ruleInstance?: RemaindersRuleInstance;
  /** Снятие опоры в детском маршруте (1 — полное объяснение … 4 — выбор шага) */
  progressionProfile?: RemaindersProgressionProfile;
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
