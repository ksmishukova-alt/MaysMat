import type {
  ConditionParseData,
  DragOption,
  OrderQuestionItem,
  StepType,
  TableRow,
  WorksheetRow,
} from "@/data/tasks";

/** Общие поля шага задачи */
export interface TaskStepBase {
  id: string;
  title: string;
  hint?: string;
  highlight?: boolean;
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
  animation?: { items: { emoji: string; count: number }[] };
}

export interface PaperUploadStep extends TaskStepBase {
  type: "paper_upload";
  /** Текст над полем загрузки */
  uploadPrompt?: string;
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
  | PaperUploadStep;

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
    case "comparison":
      return null;
    default:
      return "неизвестный тип шага";
  }
}
