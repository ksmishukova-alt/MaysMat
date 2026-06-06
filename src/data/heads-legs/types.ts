import type { SolutionMode } from "@/data/heads-legs/solution-modes";

export type { SolutionMode };

export interface HeadsLegsEntity {
  id: string;
  label: string;
  emoji?: string;
}

export interface HeadsLegsFeature {
  entityId: string;
  featureKey: string;
  value: number;
}

export type AcceptedAnswer =
  | { kind: "single_scalar"; value: number; label?: string }
  | { kind: "single"; values: Record<string, number> }
  | { kind: "multi_set"; sets: Array<Record<string, number>> }
  | { kind: "diagnostic" }
  | { kind: "text"; format: string }
  | {
      kind: "proof";
      answerPhrase?: string;
      answerTokens?: string[];
      signatureNumbers?: number[];
      solutionReference?: string;
    };

export interface SolutionBlank {
  id: string;
  type: "number" | "object" | "expression" | "conclusion";
  accept?: (string | number) | (string | number)[];
  placeholder?: string;
}

export interface SolutionLine {
  template: string;
  blanks: SolutionBlank[];
}

export interface HeadsLegsCatalogEntry {
  id: string;
  methodTaskId: string;
  number: number;
  title: string;
  condition: string;
  difficultyLevel: number;
  patternId: number;
  solutionMode: SolutionMode;
  stage: number;
}

export interface HeadsLegsTaskMeta extends HeadsLegsCatalogEntry {
  entities?: HeadsLegsEntity[];
  features?: HeadsLegsFeature[];
  totals?: {
    totalObjects?: number | null;
    totalFeature?: number | null;
  };
  constraints?: {
    bothTypesPresent?: boolean;
    allowZero?: boolean;
  };
  modelIndependenceLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  acceptedAnswers: AcceptedAnswer;
  solutionLines?: SolutionLine[];
  hintLevels?: [string?, string?, string?];
  /** Pilot первого паттерна: методическое правило с числами задачи */
  ruleInstance?: import("@/data/method-rules/types").HeadsLegsRuleInstance;
  /** Профиль снятия опоры (1 — полная, 4 — только запись решения) */
  progressionProfile?: 1 | 2 | 3 | 4;
}

export type PaperReviewStatus = "not_started" | "pending" | "approved" | "redo";

export interface PaperTaskSubmission {
  taskId: string;
  status: PaperReviewStatus;
  submissionId?: string;
  submittedAt?: string;
  reviewedAt?: string;
  stars?: number;
  verdictComment?: string;
  telegramSentAt?: string;
  paperUpload?: {
    fileName: string;
    mimeType: string;
    dataUrl?: string;
  };
}
