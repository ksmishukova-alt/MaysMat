export type StepType =
  | "condition_parse"
  | "drag_select"
  | "single_select"
  | "order_questions"
  | "worksheet_table"
  | "table_input"
  | "number_input"
  | "comparison"
  | "auto_explanation"
  | "paper_upload"
  | "model_build"
  | "numeric_solve"
  | "proof_lines"
  | "word_solution";

export interface DragOption {
  id: string;
  label: string;
  emoji: string;
  correct: boolean;
}

export interface OrderQuestionItem {
  id: string;
  text: string;
}

export interface ConditionChip {
  id: string;
  text: string;
}

export interface ConditionParseData {
  given: ConditionChip[];
  find: ConditionChip;
  /** Лишние фразы для блока «Дано» */
  distractors: ConditionChip[];
  /** Неверные формулировки вопроса */
  findDistractors: ConditionChip[];
}

export interface TableRow {
  id: string;
  label: string;
  emoji: string;
  answer: number;
}

/** Строка таблицы-worksheet: ответ на вопрос из плана */
export interface WorksheetRow {
  id: string;
  question: string;
  inputType: "static" | "number" | "formula";
  /** Только для static */
  staticValue?: string;
  /** Для number и formula — числовой ответ */
  answer?: number;
  /** Текст примера слева от поля, напр. «88 ÷ 4 =» */
  prefix?: string;
  suffix?: string;
}

/** Discriminated union шагов — см. task-steps.ts */
export type { DiscriminatedTaskStep, DiscriminatedTaskStep as TaskStep } from "@/data/task-steps";
export type {
  AutoExplanationStep,
  ConditionParseStep,
  DragSelectStep as DragSelectStepDef,
  NumberInputStep as NumberInputStepDef,
  OrderQuestionsStep as OrderQuestionsStepDef,
  SingleSelectStep as SingleSelectStepDef,
  TableInputStep as TableInputStepDef,
  WorksheetTableStep as WorksheetTableStepDef,
} from "@/data/task-steps";
export { assertTaskStepShape, isStepType } from "@/data/task-steps";

import type { DiscriminatedTaskStep } from "@/data/task-steps";
import type { DirichletTaskMeta } from "@/data/dirichlet/types";
import type { HeadsLegsTaskMeta } from "@/data/heads-legs/types";
import { DIRICHLET_TASKS } from "@/data/dirichlet";
import { HEADS_LEGS_TASKS } from "@/data/heads-legs";

/** Вес навыков (сумма ≈ 1 или баллы) */
export type SkillWeights = Partial<
  Record<
    | "modeling"
    | "logic"
    | "combinatorics"
    | "proof"
    | "graphs"
    | "invariants"
    | "arithmetic"
    | "geometry",
    number
  >
>;

export interface Task {
  id: string;
  branchId: string;
  number: number;
  title: string;
  condition: string;
  stage: number;
  maxStars: number;
  /** 1 — много подсказок, 5 — почти самостоятельно */
  independenceLevel?: 1 | 2 | 3 | 4 | 5;
  /** Нужна загрузка решения на бумаге (режим «только бумага») */
  requiresUpload?: boolean;
  /** Дополнение к инструкции в бумажном режиме */
  paperPrompt?: string;
  /** Метаданные методической раскладки «Головы и ноги» */
  headsLegsMeta?: HeadsLegsTaskMeta;
  /** Метаданные ветки «Дирихле» */
  dirichletMeta?: DirichletTaskMeta;
  /** Какие навыки тренирует задача */
  skillWeights?: SkillWeights;
  /** Шаг «Дано / Найти» после чтения условия (настраивается в админке модератора) */
  enableGivenStep?: boolean;
  /** Данные для шага «Дано / Найти» */
  givenStep?: ConditionParseData;
  steps: DiscriminatedTaskStep[];
}

export const TASKS: Record<string, Task> = {
  ...HEADS_LEGS_TASKS,
  ...DIRICHLET_TASKS,
  "fairy-caves-01": {
    id: "fairy-caves-01",
    branchId: "fairy-caves",
    number: 1,
    title: "Первая пещера",
    condition:
      "В сказочной пещере живут двухголовые сороконожки и трёхголовые драконы. Всего у них 36 голов и 396 ног. Голов у всех сороконожек столько же, сколько голов у всех драконов.\n\nСколько ног у трёхголового дракона?",
    stage: 1,
    maxStars: 3,
    steps: [
      {
        id: "step-1",
        type: "drag_select",
        title: "Шаг 1. Кто живёт в пещере?",
        options: [
          { id: "cent", label: "Сороконожка", emoji: "🐛", correct: true },
          { id: "dragon", label: "Дракон", emoji: "🐉", correct: true },
          { id: "bat", label: "Летучая мышь", emoji: "🦇", correct: false },
          { id: "frog", label: "Лягушка", emoji: "🐸", correct: false },
        ],
      },
      {
        id: "step-2",
        type: "table_input",
        title: "Шаг 2. Сколько голов у каждого?",
        tableColumnLabel: "Голов",
        rows: [
          { id: "cent", label: "Сороконожка", emoji: "🐛", answer: 2 },
          { id: "dragon", label: "Дракон", emoji: "🐉", answer: 3 },
        ],
      },
      {
        id: "step-3",
        type: "number_input",
        title: "Шаг 3. Ноги сороконожки",
        context: "В каждой пещере у сороконожки всегда 40 ног.",
        question: "Сколько ног у одной сороконожки?",
        answer: 40,
      },
      {
        id: "step-4",
        type: "number_input",
        title: "Шаг 4. Правило пещеры — голов поровну",
        highlight: true,
        context: "Голов у всех сороконожек = голов у всех драконов.\nЗначит 2 × (число сороконожек) = 3 × (число драконов).\n\nВсего голов 36: 2с + 3д = 36.",
        question: "Сколько драконов в пещере?",
        answer: 6,
      },
      {
        id: "step-5",
        type: "number_input",
        title: "Шаг 5. Сколько сороконожек?",
        context: "Если драконов 6, то 3 × 6 = 18 голов у драконов.\nСтолько же голов у сороконожек.",
        question: "2 × (число сороконожек) = 18. Сколько сороконожек?",
        answer: 9,
      },
      {
        id: "step-6",
        type: "number_input",
        title: "Шаг 6. Ноги в пещере",
        context: "9 сороконожек по 40 ног и 6 драконов.\n\n9 × 40 + 6 × (ног дракона) = 396",
        question: "Сколько ног у одного дракона?",
        answer: 6,
        successMessage: "✅ Верно! У дракона 6 ног.",
      },
      {
        id: "step-7",
        type: "auto_explanation",
        title: "Шаг 7. Как собралось решение",
        template: [
          "2с = 3д — голов поровну.",
          "2с + 3д = 36 → 6д = 36 → д = 6, с = 9.",
          "9 × 40 + 6 × L = 396 → L = 6.",
        ],
      },
    ],
  },
  "fairy-caves-02": {
    id: "fairy-caves-02",
    branchId: "fairy-caves",
    number: 2,
    title: "Вторая пещера",
    condition:
      "В другой пещере — одноголовые сороконожки и четырёхголовые драконы. Всего 25 существ и 850 ног. Голов у сороконожек и драконов поровну.\n\nСколько ног у четырёхголового дракона?",
    stage: 1,
    maxStars: 3,
    steps: [
      {
        id: "step-1",
        type: "drag_select",
        title: "Шаг 1. Кто в пещере?",
        options: [
          { id: "cent", label: "Сороконожка", emoji: "🐛", correct: true },
          { id: "dragon", label: "Дракон", emoji: "🐉", correct: true },
          { id: "spider", label: "Паук", emoji: "🕷️", correct: false },
        ],
      },
      {
        id: "step-2",
        type: "table_input",
        title: "Шаг 2. Голов у каждого",
        tableColumnLabel: "Голов",
        rows: [
          { id: "cent", label: "Сороконожка", emoji: "🐛", answer: 1 },
          { id: "dragon", label: "Дракон", emoji: "🐉", answer: 4 },
        ],
      },
      {
        id: "step-3",
        type: "number_input",
        title: "Шаг 3. Всего существ",
        question: "Сколько всего сороконожек и драконов?",
        answer: 25,
      },
      {
        id: "step-4",
        type: "number_input",
        title: "Шаг 4. Головы поровну",
        highlight: true,
        context: "1 × с = 4 × д  →  с = 4д.\nТакже с + д = 25.",
        question: "Сколько драконов?",
        answer: 5,
      },
      {
        id: "step-5",
        type: "number_input",
        title: "Шаг 5. Сороконожки",
        question: "Сколько сороконожек?",
        answer: 20,
      },
      {
        id: "step-6",
        type: "number_input",
        title: "Шаг 6. Ноги дракона",
        context: "20 × 40 + 5 × L = 850",
        question: "Сколько ног у одного дракона?",
        answer: 10,
        successMessage: "✅ Верно! 10 ног.",
      },
      {
        id: "step-7",
        type: "auto_explanation",
        title: "Шаг 7. Разбор",
        template: [
          "с = 4д и с + д = 25 → 5д = 25 → д = 5, с = 20.",
          "20 × 40 + 5 × L = 850 → L = 10.",
        ],
      },
    ],
  },
  "fairy-caves-03": {
    id: "fairy-caves-03",
    branchId: "fairy-caves",
    number: 3,
    title: "Третья пещера",
    condition:
      "В третьей пещере — одноголовые сороконожки и пятиголовые драконы. Всего 420 ног. Голов у сороконожек и драконов поровну.\n\nСколько ног у пятиголового дракона?",
    stage: 2,
    maxStars: 3,
    steps: [
      {
        id: "step-1",
        type: "table_input",
        title: "Шаг 1. Голов у каждого",
        tableColumnLabel: "Голов",
        rows: [
          { id: "cent", label: "Сороконожка", emoji: "🐛", answer: 1 },
          { id: "dragon", label: "Дракон", emoji: "🐉", answer: 5 },
        ],
      },
      {
        id: "step-2",
        type: "number_input",
        title: "Шаг 2. Правило голов",
        context: "с = 5д — голов у групп поровну.",
        question: "Если драконов 2, сколько сороконожек?",
        answer: 10,
      },
      {
        id: "step-3",
        type: "number_input",
        title: "Шаг 3. Сколько драконов?",
        highlight: true,
        context: "40с + L × д = 420 и с = 5д.\nПолучается: д × (200 + L) = 420.\n\nПодбери целое число драконов.",
        question: "Сколько драконов в пещере?",
        answer: 2,
      },
      {
        id: "step-4",
        type: "number_input",
        title: "Шаг 4. Ноги дракона",
        context: "420 ÷ 2 = 210, значит 200 + L = 210.",
        question: "Сколько ног у одного дракона (L)?",
        answer: 10,
        successMessage: "✅ Верно! 10 ног. Сороконожек 10.",
      },
      {
        id: "step-5",
        type: "auto_explanation",
        title: "Шаг 5. Разбор",
        template: [
          "с = 5д.",
          "40с + Lд = 420 → д(200 + L) = 420.",
          "д = 2, с = 10, L = 10.",
        ],
      },
    ],
  },
};

export function getTask(id: string): Task | undefined {
  return TASKS[id];
}
