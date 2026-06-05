/** Статус публикации задачи в продукте */
export type PublishTier =
  | "childRoute"
  | "training"
  | "methodistOnly"
  | "archive"
  | "hidden";

/** Результат автоматического / ручного QA */
export type QaStatus = "ready" | "needsReview" | "blocked";

export type VisualStatus = "notNeeded" | "ready" | "missing" | "needsRedesign";

export type QaIssue =
  | "contains_N_equals_N"
  | "contains_external_reference"
  | "missing_visual_asset"
  | "missing_answer_key"
  | "incomplete_condition"
  | "unsupported_flow"
  | "adult_language"
  | "too_hard_for_child_route"
  | "wrong_method"
  | "duplicate"
  | "requires_manual_review";

export interface TaskPublishingMeta {
  publishTier: PublishTier;
  qaStatus: QaStatus;
  issues: QaIssue[];
  /** Порядок в детском маршруте (1…); только для childRoute/training */
  routeOrder?: number;
  requiresVisual: boolean;
  visualStatus: VisualStatus;
  requiresExpansion?: boolean;
}
