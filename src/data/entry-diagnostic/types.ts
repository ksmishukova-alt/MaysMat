/** Entry Diagnostic v2 — типы data-driven модуля */

export type DiagnosticDifficulty = "D1" | "D2" | "D3";
export type ScoreWeight = 1 | 2 | 3;

export type RunnerKind =
  | "reading_comprehension_visual"
  | "story_add_sub_visual"
  | "column_add_sub_visual"
  | "column_multiplication_visual"
  | "long_division_visual"
  | "remainder_interpretation_visual"
  | "expression_order_visual_with_embedded_calculation"
  | "text_problem_plan_visual"
  | "motion_model_visual"
  | "geometry_grid_visual"
  | "fraction_model_visual"
  | "percent_model_visual"
  | "logic_if_then_visual"
  | "systematic_search_visual"
  | "pattern_cycle_visual";

export type MiniGameMode = "diagnostic" | "play";

export type ScreenStepKind =
  | "condition_read"
  | "read_prompt"
  | "visual_board"
  | "number_input"
  | "text_input"
  | "single_select"
  | "multi_select"
  | "action_count_hypothesis"
  | "action_plan_builder"
  | "embedded_calculator"
  | "confirm_submit";

export interface ScreenStep {
  stepId: string;
  kind: ScreenStepKind;
  prompt: string;
  options?: { id: string; label: string }[];
  placeholder?: string;
  /** Ключ поля в ответе ребёнка */
  fieldKey?: string;
}

export type ValidationRule =
  | { type: "exact"; field: string; value: string | number }
  | { type: "numericEquals"; field: string; value: number; tolerance?: number }
  | { type: "oneOf"; field: string; values: (string | number)[] }
  | { type: "actionCountAtLeast"; field: string; min: number }
  | { type: "actionPlanMatches"; field: string; acceptedPlans: string[][] }
  | { type: "composite"; rules: ValidationRule[]; mode: "all" | "any" };

export interface DiagnosticTask {
  taskId: string;
  blockId: string;
  difficulty: DiagnosticDifficulty;
  scoreWeight: ScoreWeight;
  taskText: string;
  answer: Record<string, unknown>;
  acceptedSolutions?: Record<string, unknown>[];
  screenSequence: ScreenStep[];
  validationRules: ValidationRule[];
  errorTypes: string[];
}

export interface DiagnosticBlock {
  blockId: string;
  blockIndex: number;
  title: string;
  skill: string;
  tasks: [DiagnosticTask, DiagnosticTask, DiagnosticTask];
  runnerKind: RunnerKind;
  miniGameId: string;
  maxScore: 6;
}

export interface MiniGameConfig {
  miniGameId: string;
  title: string;
  description: string;
  blockId?: string;
  diagnostic: {
    durationSec: number;
    showFeedbackDuringGame: false;
    largeTargets: true;
  };
  play: {
    showFeedbackDuringGame: true;
    scoringEnabled: true;
  };
  rounds: number;
}

export interface TaskAttemptRecord {
  taskId: string;
  blockId: string;
  difficulty: DiagnosticDifficulty;
  scoreWeight: ScoreWeight;
  startedAt: number;
  finishedAt: number;
  response: Record<string, unknown>;
  score: number;
  correct: boolean;
  errorTypes: string[];
  initialActionCount?: number;
  finalActionCount?: number;
  actionCountRevised: boolean;
  selfCorrection: boolean;
  computationErrors: string[];
  orderErrors: string[];
  readingErrors: string[];
  dataErrors: string[];
  unitErrors: string[];
}

export interface MiniGameAttemptRecord {
  miniGameId: string;
  blockId: string;
  mode: MiniGameMode;
  startedAt: number;
  finishedAt: number;
  score: number;
  roundsCompleted: number;
  catchErrors: number;
  semanticErrors: number;
  /** Ошибки моторики (промах по карточке), отдельно от semantic */
  motorErrors: number;
}

export interface AttemptEvent {
  eventId: string;
  attemptId: string;
  timestamp: number;
  blockId?: string;
  taskId?: string;
  miniGameId?: string;
  eventType: string;
  payload: Record<string, unknown>;
}

export interface DiagnosticSession {
  attemptId: string;
  startedAt: number;
  finishedAt?: number;
  currentBlockIndex: number;
  phase:
    | "intro"
    | "task"
    | "pre_minigame"
    | "minigame_rules"
    | "minigame"
    | "post_block"
    | "complete"
    /** @deprecated миграция старых сессий */
    | "block_summary";
  currentTaskIndex: number;
  taskAttempts: TaskAttemptRecord[];
  miniGameAttempts: MiniGameAttemptRecord[];
  events: AttemptEvent[];
}

export interface BlockScore {
  blockId: string;
  title: string;
  score: number;
  maxScore: 6;
  skill: string;
}

export interface DiagnosticReport {
  attemptId: string;
  totalScore: number;
  maxTotalScore: 90;
  scoreByBlock: BlockScore[];
  accuracyBySkill: Record<string, number>;
  errorClusters: Record<string, number>;
  strengths: string[];
  risks: string[];
  routeRecommendations: string[];
  miniGameMetrics: MiniGameAttemptRecord[];
}
