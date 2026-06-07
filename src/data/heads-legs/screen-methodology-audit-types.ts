/** Типы экранного аудита методологии «Головы и ноги». */

export type ScreenRiskLevel = "none" | "low" | "medium" | "high";

export interface ScreenMethodologyAuditItem {
  screenNumber: number;
  screenTitle: string;
  screenKind: string;
  childAction: string;
  expectedAnswer: string | string[];
  whyThisStepExists: string;
  validationRule: string;
  possibleWrongButReasonableAnswers?: string[];
  feedbackForWrongAnswer?: string;
  alternativeValidPath?: boolean;
  riskLevel: ScreenRiskLevel;
  notes?: string;
}

export interface TaskScreenMethodologyAudit {
  taskId: string;
  methodTaskId: string;
  title: string;
  primaryMethod: string;
  preludeType: string;
  solutionMode: string;
  runner: string;
  publishRecommendation: string;
  expectedAnswer: string;
  alternativeValidStrategies: string[];
  screens: ScreenMethodologyAuditItem[];
  validationRisks: string[];
  requiredFixes: string[];
  publicationStatus: string;
}
