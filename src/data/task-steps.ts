import type {
  ConditionParseData,
  DragOption,
  OrderQuestionItem,
  StepType,
  TableRow,
  WorksheetRow,
} from "@/data/tasks";
import type { AcceptedAnswer, HeadsLegsEntity, HeadsLegsFeature, SolutionLine } from "@/data/heads-legs/types";
import type { SolutionMode } from "@/data/heads-legs/solution-modes";

/** Общие поля шага задачи */
export interface TaskStepBase {
  id: string;
  title: string;
  hint?: string;
  highlight?: boolean;
  /** Фаза экрана по архитектуре «Головы и ноги» */
  screenPhaseId?: string;
  screenPhaseTitle?: string;
  screenPhaseIndex?: number;
  screenPhaseCount?: number;
  /** Подпись внутри фазы, напр. «Шаг 1 из 3» */
  screenSubStep?: string;
}

export interface ConditionParseStep extends TaskStepBase {
  type: "condition_parse";
  parseData: ConditionParseData;
}

export interface DragSelectStep extends TaskStepBase {
  type: "drag_select";
  options: DragOption[];
}

export interface SingleSelectStep extends TaskStepBase {
  type: "single_select";
  options: DragOption[];
  selectPrompt?: string;
  context?: string;
  successMessage?: string;
  /** Wave P1: мягкий feedback, если выбран другой математически допустимый путь */
  alternativeWrongFeedback?: string;
  explicitTrainingPath?: boolean;
}

export interface OrderQuestionsStep extends TaskStepBase {
  type: "order_questions";
  orderItems: OrderQuestionItem[];
}

export interface WorksheetTableStep extends TaskStepBase {
  type: "worksheet_table";
  worksheetRows: WorksheetRow[];
  successMessage?: string;
}

export interface TableInputStep extends TaskStepBase {
  type: "table_input";
  rows: TableRow[];
  tableColumnLabel?: string;
}

export interface NumberInputStep extends TaskStepBase {
  type: "number_input";
  question?: string;
  context?: string;
  answer: number;
  successMessage?: string;
  animation?: { items: { emoji: string; count: number }[] };
}

export interface ComparisonStep extends TaskStepBase {
  type: "comparison";
  leftLabel?: string;
  leftValue?: string;
  rightLabel?: string;
  rightValue?: string;
}

export interface AutoExplanationStep extends TaskStepBase {
  type: "auto_explanation";
  template: string[];
  /** intro — разбор условия; preview — итоговый текст перед завершением */
  explanationRole?: "intro" | "preview";
  animation?: { items: { emoji: string; count: number }[] };
}

export interface PaperUploadStep extends TaskStepBase {
  type: "paper_upload";
  /** Текст над полем загрузки */
  uploadPrompt?: string;
}

export interface ModelBuildStep extends TaskStepBase {
  type: "model_build";
  modelLevel?: number;
  /** Только числа в слоты — выбор объектов на отдельном шаге */
  skipEntitySelection?: boolean;
  entities?: HeadsLegsEntity[];
  features?: HeadsLegsFeature[];
  totals?: { totalObjects?: number | null; totalFeature?: number | null };
  constraints?: { bothTypesPresent?: boolean; allowZero?: boolean };
}

export interface ProofLinesStep extends TaskStepBase {
  type: "proof_lines";
  solutionLines: SolutionLine[];
}

export interface NumericSolveStep extends TaskStepBase {
  type: "numeric_solve";
  acceptedAnswers: AcceptedAnswer;
}

export interface WordSolutionStep extends TaskStepBase {
  type: "word_solution";
  solutionMode: SolutionMode;
  solutionLines?: SolutionLine[];
  acceptedAnswers: AcceptedAnswer;
  hintLevels?: [string?, string?, string?];
  /** Только пропуски — без textarea «полное решение» */
  blanksOnly?: boolean;
  /** Для type=expression: принимать только полный пример (12 × 2 = 24), не «24» */
  requireExpressionFormat?: boolean;
}

/** Discriminated union — каждый тип шага со своими полями */
export type DiscriminatedTaskStep =
  | ConditionParseStep
  | DragSelectStep
  | SingleSelectStep
  | OrderQuestionsStep
  | WorksheetTableStep
  | TableInputStep
  | NumberInputStep
  | ComparisonStep
  | AutoExplanationStep
  | PaperUploadStep
  | ModelBuildStep
  | NumericSolveStep
  | ProofLinesStep
  | WordSolutionStep;

export function isStepType<T extends StepType>(
  step: DiscriminatedTaskStep,
  type: T,
): step is Extract<DiscriminatedTaskStep, { type: T }> {
  return step.type === type;
}

/** Проверка, что шаг из JSON соответствует union (для админки) */
export function assertTaskStepShape(step: DiscriminatedTaskStep): string | null {
  switch (step.type) {
    case "condition_parse":
      return step.parseData ? null : "condition_parse: нужен parseData";
    case "drag_select":
    case "single_select":
      return step.options?.length ? null : `${step.type}: нужны options`;
    case "order_questions":
      return step.orderItems?.length ? null : "order_questions: нужны orderItems";
    case "worksheet_table":
      return step.worksheetRows?.length ? null : "worksheet_table: нужны worksheetRows";
    case "table_input":
      return step.rows?.length ? null : "table_input: нужны rows";
    case "number_input":
      return step.answer != null ? null : "number_input: нужен answer";
    case "auto_explanation":
      return step.template?.length ? null : "auto_explanation: нужен template";
    case "paper_upload":
      return null;
    case "model_build":
      return null;
    case "numeric_solve":
      return step.acceptedAnswers ? null : "numeric_solve: нужен acceptedAnswers";
    case "proof_lines":
      return step.solutionLines?.length ? null : "proof_lines: нужны solutionLines";
    case "word_solution":
      return step.acceptedAnswers && step.solutionMode ? null : "word_solution: нужны acceptedAnswers и solutionMode";
    case "comparison":
      return null;
    default:
      return "неизвестный тип шага";
  }
}

/** intro — читаем и идём дальше; preview — финальный текст и завершение задачи */
export function resolveExplanationRole(
  step: Pick<AutoExplanationStep, "id" | "explanationRole">,
  isLastStep: boolean,
): "intro" | "preview" {
  if (step.explanationRole) return step.explanationRole;
  if (step.id.includes("-preview") || isLastStep) return "preview";
  return "intro";
}
