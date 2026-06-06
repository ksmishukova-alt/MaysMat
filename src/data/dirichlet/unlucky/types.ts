/** Экранный сценарий «Метод неудачника» */
import type { SolutionLine } from "@/data/heads-legs/types";

export type UnluckyStepKind =
  | "intro_video"
  | "read_condition"
  | "guarantee_goal"
  | "worst_case"
  | "guarantee_plus_one"
  | "explain_why_less_fails"
  | "write_solution"
  | "finish";

export interface UnluckyCategory {
  id: string;
  label: string;
  emoji?: string;
  /** Сколько предметов этого типа в самом неудачном раскладе */
  maxInWorstCase: number;
}

export interface UnluckyModel {
  /** threshold — классический max+1; deduction — задачи на вывод состава (M3.1) */
  variant?: "threshold" | "deduction";
  goal: string;
  /** Полная фраза для экрана «Что гарантируем?» */
  goalPhrase: string;
  categories: UnluckyCategory[];
  maxPerCategoryWithoutSuccess?: number;
  maxWithoutSuccess: number;
  answer: number;
  itemLabel?: string;
  itemLabelGenitive?: string;
  explanation: string[];
  /** Краткое описание худшего расклада для подсказки */
  worstCaseHint?: string;
  /** Пропуски для экрана «Запиши решение словами» */
  writeSolutionLines?: SolutionLine[];
}

export interface UnluckyStep {
  id: string;
  kind: UnluckyStepKind;
  title: string;
  screenPhaseIndex: number;
  screenPhaseCount: number;
}

