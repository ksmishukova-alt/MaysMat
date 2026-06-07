/** Wave P1: single-path assume cleanup — типы аудита (childRoute 1.x–3.x). */

export type WaveP1AssumeApproach =
  | "dual_path"
  | "explicit_training_path"
  | "already_ok"
  | "defer_special_flow"
  | "defer_legacy"
  | "pending_review";

export type WaveP1AssumeCurrentState =
  | "single_path_assume"
  | "dual_path"
  | "explicit_training"
  | "no_assume"
  | "legacy_digital";

export type WaveP1SecondPathStatus = "yes" | "no" | "special";

export interface WaveP1AssumeAuditRow {
  taskId: string;
  methodTaskId: string;
  title: string;
  stage: 1 | 2 | 3;
  uiNumber: number;
  childRoute: boolean;
  /** Есть ли второй математически корректный assume-путь */
  secondPathValid: WaveP1SecondPathStatus;
  /** Что сейчас делает runner на шаге assume */
  currentState: WaveP1AssumeCurrentState;
  /** Рекомендуемый подход волны P1 */
  recommendedApproach: WaveP1AssumeApproach;
  risk: "none" | "low" | "medium" | "high";
  /** Решение волны — заполняется перед имплементацией */
  decision: string;
  notes?: string;
}

export const WAVE_P1_RULE =
  "Если оба пути математически корректны: либо dual-path runner, либо explicitTrainingPath с честной формулировкой. Запрещено: «удобнее» при single-path validation.";
