import type { SolutionMode } from "@/data/heads-legs/solution-modes";
import type { TaskRunnerKind } from "@/data/runner-kind";
import type { ScreenSpec } from "@/data/screen-spec";
import type { UnluckyModel } from "@/data/dirichlet/unlucky/types";

export type { SolutionMode };

export type DirichletFlowId =
  | "F1_DIRECT"
  | "F2_GENERALIZED"
  | "F3_UNLUCKY"
  | "F4_REMAINDERS"
  | "F5_GEOMETRY_PARTITION"
  | "F6_TABLE_SUMS"
  | "F7_GRAPH_RELATIONS"
  | "F8_COLOR_RAMSEY"
  | "F10_ADVANCED";

export interface DirichletEntity {
  id: string;
  label: string;
}

export interface DirichletInferredModel {
  rabbits: DirichletEntity[];
  cells: DirichletEntity[];
  counts: {
    n: number | null;
    m: number | null;
    k?: number | null;
    minInCell?: number | null;
  };
  compareOp: "gt" | "gte";
  conclusionText: string;
}

export interface DirichletSolutionBlank {
  id: string;
  type: "number" | "object" | "expression" | "conclusion";
  accept?: (string | number) | (string | number)[];
  placeholder?: string;
}

export interface DirichletSolutionLine {
  template: string;
  blanks: DirichletSolutionBlank[];
}

export interface DirichletAcceptedAnswer {
  kind: "proof";
  answerPhrase?: string;
  answerTokens?: string[];
  signatureNumbers?: number[];
  solutionReference: string;
}

export interface DirichletCatalogEntry {
  id: string;
  methodTaskId: string;
  /** Номер внутри ветки */
  number: number;
  /** Сквозной номер в банке (для отладки) */
  globalNumber?: number;
  title: string;
  condition: string;
  difficultyLevel: number;
  stage: number;
  themeId: string;
  themeTitle: string;
  branchId: string;
  flowId: DirichletFlowId;
  supportMode: string;
  writingMode: string;
  solutionMode: SolutionMode;
  sourcePi?: number;
}

export interface DirichletTaskMeta extends DirichletCatalogEntry {
  acceptedAnswers: DirichletAcceptedAnswer;
  solutionLines: DirichletSolutionLine[];
  hintLevels: [string, string, string];
  runnerKind?: TaskRunnerKind;
  screenSequence?: ScreenSpec[];
  unluckyModel?: UnluckyModel;
}
