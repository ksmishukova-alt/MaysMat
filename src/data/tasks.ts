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
  | "paper_upload";

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

/** Вес навыков (сумма ≈ 1 или баллы) */
export type SkillWeights = Partial<
  Record<"modeling" | "logic" | "combinatorics" | "proof" | "graphs" | "invariants", number>
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
  /** Нужна загрузка решения на бумаге (есть шаг paper_upload) */
  requiresUpload?: boolean;
  /** Какие навыки тренирует задача */
  skillWeights?: SkillWeights;
  /** Шаг «Дано / Найти» после чтения условия (настраивается в админке модератора) */
  enableGivenStep?: boolean;
  /** Данные для шага «Дано / Найти» */
  givenStep?: ConditionParseData;
  steps: DiscriminatedTaskStep[];
}

export const TASKS: Record<string, Task> = {
  "heads-legs-01": {
    id: "heads-legs-01",
    branchId: "modeling-heads-legs",
    number: 1,
    title: "Цыплята и змеи",
    condition:
      "В инкубаторе лежало 120 яиц. Из некоторых вылупились цыплята, а из остальных — змеи. В сумме у детёнышей оказалось 162 ноги.\n\nСколько вылупилось змей?",
    stage: 1,
    maxStars: 3,
    independenceLevel: 2,
    requiresUpload: true,
    skillWeights: { modeling: 0.8, logic: 0.2 },
    givenStep: {
      given: [
        { id: "g-eggs", text: "120 яиц" },
        { id: "g-legs", text: "162 ноги (всего)" },
      ],
      find: { id: "f-snakes", text: "Сколько вылупилось змей?" },
      distractors: [
        { id: "d-types", text: "Цыплята и змеи — виды" },
        { id: "d-per", text: "У цыплёнка 2 ноги" },
      ],
      findDistractors: [
        { id: "fd-chicks", text: "Сколько вылупилось цыплят?" },
        { id: "fd-babies", text: "Сколько всего детёнышей?" },
      ],
    },
    steps: [
      {
        id: "step-1",
        type: "drag_select",
        title: "Шаг 2. Кто участвует в задаче?",
        hint: "Перетащи участников задачи в рабочую область",
        options: [
          { id: "chick", label: "Цыплёнок", emoji: "🐥", correct: true },
          { id: "snake", label: "Змея", emoji: "🐍", correct: true },
          { id: "cat", label: "Кошка", emoji: "🐱", correct: false },
          { id: "lizard", label: "Ящерица", emoji: "🦎", correct: false },
          { id: "dog", label: "Собака", emoji: "🐶", correct: false },
        ],
      },
      {
        id: "step-2",
        type: "table_input",
        title: "Шаг 3. Сколько ног у каждого?",
        rows: [
          { id: "chick", label: "Цыплёнок", emoji: "🐥", answer: 2 },
          { id: "snake", label: "Змея", emoji: "🐍", answer: 0 },
        ],
      },
      {
        id: "step-3",
        type: "number_input",
        title: "Шаг 4. Сколько всего детёнышей?",
        context: "Из каждого яйца появился один детёныш.",
        question: "Сколько всего детёнышей вылупилось?",
        answer: 120,
        successMessage: "✅ Верно!",
      },
      {
        id: "step-4",
        type: "number_input",
        title: "Шаг 5. Представим, что все детёныши — змеи",
        highlight: true,
        context: "🐍🐍🐍🐍🐍 … всего 120 змей",
        question: "Если бы все 120 детёнышей были змеями, сколько ног было бы всего?",
        answer: 0,
      },
      {
        id: "step-5",
        type: "number_input",
        title: "Шаг 6. Сравни с условием",
        context: "Если все змеи: 0 ног. По условию: 162 ноги.",
        question: "Сколько ног не хватает до условия?",
        answer: 162,
      },
      {
        id: "step-6",
        type: "single_select",
        title: "Шаг 7. Кто может добавить ноги?",
        context: "Не хватает 162 ног. Замену нужно делать на того, у кого ног больше, чем у змеи.",
        selectPrompt: "Кого поставим вместо змеи, чтобы появились ноги?",
        options: [
          { id: "chick", label: "Цыплёнок", emoji: "🐥", correct: true },
          { id: "snake", label: "Змея", emoji: "🐍", correct: false },
        ],
        successMessage: "✅ Верно! Цыплёнок добавляет ноги.",
      },
      {
        id: "step-7",
        type: "number_input",
        title: "Шаг 8. На сколько вырастет число ног?",
        context: "🐍 у змеи 0 ног, 🐥 у цыплёнка 2 ноги.\n\nОдну змею убираем — на её место ставим цыплёнка.",
        question: "На сколько увеличится общее число ног?",
        answer: 2,
      },
      {
        id: "step-8",
        type: "number_input",
        title: "Шаг 9. Сколько цыплят?",
        highlight: true,
        context:
          "Нужно «добавить» 162 ноги.\nКаждая такая замена даёт 2 ноги.\n\n162 ÷ 2 = ?",
        question: "Сколько змей нужно заменить на цыплят?",
        answer: 81,
        successMessage: "✅ Верно! 81 цыплёнок.",
      },
      {
        id: "step-9",
        type: "number_input",
        title: "Шаг 10. Сколько осталось змей?",
        highlight: true,
        context:
          "Всего вылупилось 120 детёнышей.\nЦыплят получилось 81 — мы нашли это на шаге 9.\n\n120 − 81 = ?",
        question: "Сколько вылупилось змей?",
        answer: 39,
        successMessage: "✅ Верно! 39 змей и 81 цыплёнок.",
        animation: {
          items: [
            { emoji: "🐥", count: 81 },
            { emoji: "🐍", count: 39 },
          ],
        },
      },
      {
        id: "step-10",
        type: "auto_explanation",
        title: "Шаг 11. Объясни решение",
        template: [
          "Представим, что все 120 детёнышей были змеями.",
          "Тогда ног было бы 0.",
          "По условию ног 162.",
          "Один цыплёнок добавляет 2 ноги.",
          "Поэтому цыплят было 162 ÷ 2 = 81.",
          "Значит, змей было 120 − 81 = 39.",
        ],
      },
      {
        id: "step-paper",
        type: "paper_upload",
        title: "Шаг 12. Решение на листочке",
        hint: "Сфотографируй аккуратный черновик с ответом 39 змей",
      },
    ],
  },
  "heads-legs-02": {
    id: "heads-legs-02",
    branchId: "modeling-heads-legs",
    number: 2,
    title: "Кролики и утки у бабушки",
    condition:
      "У бабушки на дворе живут кролики и утки. Всего у них 5 голов и 16 лап.\n\nСколько у бабушки кроликов и сколько уток?",
    stage: 1,
    maxStars: 3,
    independenceLevel: 3,
    requiresUpload: true,
    skillWeights: { modeling: 0.9, logic: 0.1 },
    steps: [
      {
        id: "step-1",
        type: "drag_select",
        title: "Шаг 1. Кто участвует в задаче?",
        hint: "Выбери животных из условия",
        options: [
          { id: "rabbit", label: "Кролик", emoji: "🐰", correct: true },
          { id: "duck", label: "Утка", emoji: "🦆", correct: true },
          { id: "dog", label: "Собака", emoji: "🐶", correct: false },
          { id: "cat", label: "Кошка", emoji: "🐱", correct: false },
          { id: "goose", label: "Гусь", emoji: "🪿", correct: false },
        ],
      },
      {
        id: "step-2",
        type: "table_input",
        title: "Шаг 2. Сколько лап у каждого?",
        rows: [
          { id: "rabbit", label: "Кролик", emoji: "🐰", answer: 4 },
          { id: "duck", label: "Утка", emoji: "🦆", answer: 2 },
        ],
      },
      {
        id: "step-3",
        type: "number_input",
        title: "Шаг 3. Сколько всего животных?",
        context: "У кроликов и уток по 1 голове. Голов было 5.",
        question: "Сколько всего кроликов и уток на дворе?",
        answer: 5,
        successMessage: "✅ Верно! 5 голов — значит 5 животных.",
      },
      {
        id: "step-4",
        type: "number_input",
        title: "Шаг 4. Представим, что все — утки",
        highlight: true,
        context: "🦆🦆🦆🦆🦆 — все 5 животных утки, у каждой 2 лапы",
        question: "Если бы все 5 были утками, сколько лап было бы всего?",
        answer: 10,
      },
      {
        id: "step-5",
        type: "number_input",
        title: "Шаг 5. Сравни с условием",
        context: "Если все утки: 10 лап. По условию: 16 лап.",
        question: "Сколько лап не хватает до условия?",
        answer: 6,
      },
      {
        id: "step-6",
        type: "number_input",
        title: "Шаг 6. Кто может добавить лапы?",
        context: "🦆 → 2 лапы. 🐰 → 4 лапы.",
        question: "Если заменить одну утку на одного кролика, на сколько увеличится число лап?",
        answer: 2,
      },
      {
        id: "step-7",
        type: "number_input",
        title: "Шаг 7. Сколько кроликов?",
        highlight: true,
        context:
          "Нужно «добавить» 6 лап.\nКаждый кролик даёт на 2 лапы больше, чем утка.\n\n6 ÷ 2 = ?",
        question: "Сколько уток нужно заменить на кроликов?",
        answer: 3,
        successMessage: "✅ Верно! 3 кролика.",
      },
      {
        id: "step-8",
        type: "number_input",
        title: "Шаг 8. Сколько уток?",
        highlight: true,
        context:
          "Всего на дворе 5 животных.\nКроликов получилось 3 — мы нашли это на шаге 7.\n\n5 − 3 = ?",
        question: "Сколько уток у бабушки?",
        answer: 2,
        successMessage: "✅ Верно! 3 кролика и 2 утки.",
        animation: {
          items: [
            { emoji: "🐰", count: 3 },
            { emoji: "🦆", count: 2 },
          ],
        },
      },
      {
        id: "step-9",
        type: "auto_explanation",
        title: "Шаг 9. Объясни решение",
        template: [
          "Пусть все 5 животных — утки. Тогда лап 5 × 2 = 10.",
          "По условию лап 16 — не хватает 6.",
          "Замена одной утки на кролика добавляет 2 лапы.",
          "Нужно 6 ÷ 2 = 3 замены.",
          "Значит, кроликов 3, а уток 5 − 3 = 2.",
        ],
      },
      {
        id: "step-paper",
        type: "paper_upload",
        title: "Шаг 10. Решение на листочке",
        hint: "Загрузи фото с ответом: 3 кролика и 2 утки",
      },
    ],
  },
  "heads-legs-03": {
    id: "heads-legs-03",
    branchId: "modeling-heads-legs",
    number: 3,
    title: "Наклейки Маши",
    condition:
      "У Маши в альбоме 20 наклеек: с машинками и с велосипедами. У каждой машинки нарисовано 4 колеса, у каждого велосипеда — 2 колеса. Всего на всех наклейках 58 колёс.\n\nСколько наклеек с велосипедами?",
    stage: 2,
    maxStars: 4,
    givenStep: {
      given: [
        { id: "g-stickers", text: "20 наклеек" },
        { id: "g-wheels", text: "58 колёс (всего)" },
        { id: "g-car", text: "4 колеса у машинки" },
        { id: "g-bike", text: "2 колеса у велосипеда" },
      ],
      find: { id: "f-bikes", text: "Сколько наклеек с велосипедами?" },
      distractors: [
        { id: "d-masha", text: "Наклейки Маши" },
        { id: "d-types", text: "Машинки и велосипеды" },
      ],
      findDistractors: [
        { id: "fd-cars", text: "Сколько наклеек с машинками?" },
        { id: "fd-total", text: "Сколько всего колёс у машинок?" },
      ],
    },
    steps: [
      {
        id: "step-1",
        type: "order_questions",
        title: "Шаг 2. Составь план решения",
        hint: "Вспомни метод «головы и ноги»: с чего начинают?",
        orderItems: [
          { id: "q1", text: "Кто участвует в задаче?" },
          { id: "q2", text: "Сколько колёс у каждого типа наклеек?" },
          { id: "q3", text: "Сколько всего наклеек?" },
          { id: "q4", text: "Если бы все наклейки были с велосипедами — сколько колёс?" },
          { id: "q5", text: "Сколько колёс не хватает до условия?" },
          { id: "q6", text: "На сколько растёт число колёс при одной замене?" },
          { id: "q7", text: "Сколько замен нужно сделать?" },
          { id: "q8", text: "Ответ на вопрос задачи" },
        ],
      },
      {
        id: "step-2",
        type: "drag_select",
        title: "Шаг 3. Кто участвует в задаче?",
        hint: "Выбери типы наклеек из условия",
        options: [
          { id: "car", label: "Машинка", emoji: "🚗", correct: true },
          { id: "bike", label: "Велосипед", emoji: "🚲", correct: true },
          { id: "plane", label: "Самолёт", emoji: "✈️", correct: false },
          { id: "train", label: "Поезд", emoji: "🚂", correct: false },
        ],
      },
      {
        id: "step-3",
        type: "table_input",
        title: "Шаг 4. Сколько колёс у каждой наклейки?",
        rows: [
          { id: "car", label: "Машинка", emoji: "🚗", answer: 4 },
          { id: "bike", label: "Велосипед", emoji: "🚲", answer: 2 },
        ],
      },
      {
        id: "step-4",
        type: "number_input",
        title: "Шаг 5. Сколько всего наклеек?",
        question: "Сколько наклеек у Маши?",
        answer: 20,
      },
      {
        id: "step-5",
        type: "number_input",
        title: "Шаг 6. Представим, что все — велосипеды",
        highlight: true,
        context: "🚲🚲🚲 … всего 20 велосипедов",
        question: "Если бы все 20 наклеек были с велосипедами, сколько колёс было бы?",
        answer: 40,
      },
      {
        id: "step-6",
        type: "number_input",
        title: "Шаг 7. Сравни с условием",
        context: "Если все велосипеды: 40 колёс. По условию: 58 колёс.",
        question: "Сколько колёс не хватает?",
        answer: 18,
      },
      {
        id: "step-7",
        type: "number_input",
        title: "Шаг 8. Кто добавляет колёса?",
        context: "🚲 → 2 колеса. 🚗 → 4 колеса.",
        question: "Если заменить одну наклейку с велосипедом на машинку, на сколько вырастет число колёс?",
        answer: 2,
      },
      {
        id: "step-8",
        type: "number_input",
        title: "Шаг 9. Сколько замен?",
        question: "Чтобы получить ещё 18 колёс, сколько велосипедов заменить на машинки?",
        answer: 9,
      },
      {
        id: "step-9",
        type: "number_input",
        title: "Шаг 10. Ответ",
        question: "Сколько наклеек с велосипедами?",
        answer: 11,
        successMessage: "✅ Верно! 11 велосипедов и 9 машинок.",
      },
      {
        id: "step-10",
        type: "auto_explanation",
        title: "Шаг 11. Объясни решение",
        template: [
          "Пусть все 20 наклеек — с велосипедами. Тогда колёс 20 × 2 = 40.",
          "По условию колёс 58 — не хватает 18.",
          "Замена велосипеда на машинку добавляет 2 колеса.",
          "Нужно 18 ÷ 2 = 9 таких замен — это 9 машинок.",
          "Значит, велосипедов 20 − 9 = 11.",
        ],
      },
    ],
  },
  "heads-legs-04": {
    id: "heads-legs-04",
    branchId: "modeling-heads-legs",
    number: 4,
    title: "Гусята и крокодильчики",
    condition:
      "В инкубаторе лежало 200 яиц. Из некоторых вылупились гусята, а из остальных — крокодильчики. Всего из яиц вышло 500 ног.\n\nСколько вылупилось гусят и сколько крокодильчиков?",
    stage: 2,
    maxStars: 3,
    givenStep: {
      given: [
        { id: "g-eggs", text: "200 яиц" },
        { id: "g-legs", text: "500 ног (всего)" },
      ],
      find: {
        id: "f-both",
        text: "Сколько гусят и сколько крокодильчиков?",
      },
      distractors: [
        { id: "d-types", text: "Гусята и крокодильчики" },
        { id: "d-one", text: "Из каждого яйца — один детёныш" },
      ],
      findDistractors: [
        { id: "fd-goose", text: "Сколько только гусят?" },
        { id: "fd-legs-one", text: "Сколько ног у одного гусёнка?" },
      ],
    },
    steps: [
      {
        id: "step-1",
        type: "order_questions",
        title: "Шаг 2. Составь план решения",
        hint: "Вспомни метод «головы и ноги»: с чего начинают?",
        orderItems: [
          { id: "q1", text: "Кто участвует в задаче?" },
          { id: "q2", text: "Сколько ног у каждого?" },
          { id: "q3", text: "Сколько всего детёнышей?" },
          { id: "q4", text: "Если бы все были «лёгкими» (гусятами) — сколько ног?" },
          { id: "q5", text: "Сколько ног не хватает до условия?" },
          { id: "q6", text: "На сколько растёт число ног при одной замене?" },
          { id: "q7", text: "Сколько «тяжёлых» (крокодильчиков)?" },
          { id: "q8", text: "Сколько «лёгких» (гусят)?" },
        ],
      },
      {
        id: "step-2",
        type: "drag_select",
        title: "Шаг 3. Кто участвует в задаче?",
        hint: "Выбери детёнышей из условия",
        options: [
          { id: "goose", label: "Гусёнок", emoji: "🪿", correct: true },
          { id: "croc", label: "Крокодильчик", emoji: "🐊", correct: true },
          { id: "chick", label: "Цыплёнок", emoji: "🐥", correct: false },
          { id: "snake", label: "Змея", emoji: "🐍", correct: false },
        ],
      },
      {
        id: "step-3",
        type: "table_input",
        title: "Шаг 4. Сколько ног у каждого?",
        rows: [
          { id: "goose", label: "Гусёнок", emoji: "🪿", answer: 2 },
          { id: "croc", label: "Крокодильчик", emoji: "🐊", answer: 4 },
        ],
      },
      {
        id: "step-4",
        type: "number_input",
        title: "Шаг 5. Сколько всего детёнышей?",
        question: "Из каждого яйца — один детёныш. Сколько их всего?",
        answer: 200,
      },
      {
        id: "step-5",
        type: "number_input",
        title: "Шаг 6. Представим, что все — gусята",
        highlight: true,
        question: "Если бы все 200 были гусятами, сколько ног?",
        answer: 400,
      },
      {
        id: "step-6",
        type: "number_input",
        title: "Шаг 7. Сравни с условием",
        question: "500 − 400 = ? — сколько ног не хватает?",
        answer: 100,
      },
      {
        id: "step-7",
        type: "number_input",
        title: "Шаг 8. Одна замена",
        context: "Гусёнок → 2 ноги. Крокодильчик → 4 ноги.",
        question: "Замена одного гусёнка на крокодильчика добавляет сколько ног?",
        answer: 2,
      },
      {
        id: "step-8",
        type: "number_input",
        title: "Шаг 9. Сколько крокодильчиков?",
        highlight: true,
        context: "100 ÷ 2 = ?",
        question: "Сколько крокодильчиков?",
        answer: 50,
      },
      {
        id: "step-9",
        type: "number_input",
        title: "Шаг 10. Сколько гусят?",
        context: "200 − 50 = ?",
        question: "Сколько гусят?",
        answer: 150,
        successMessage: "✅ Верно! 150 гусят и 50 крокодильчиков.",
      },
      {
        id: "step-10",
        type: "auto_explanation",
        title: "Шаг 11. Разбор",
        template: [
          "Все гусята: 200 × 2 = 400 ног.",
          "Не хватает 100 ног → 50 крокодильчиков.",
          "Гусят: 200 − 50 = 150.",
        ],
      },
    ],
  },
  "heads-legs-05": {
    id: "heads-legs-05",
    branchId: "modeling-heads-legs",
    number: 5,
    title: "Утята и утконосы",
    condition:
      "В инкубаторе лежало 333 яйца. Из некоторых вылупились утята, а из остальных — утконосики. Лап у всех утят вместе столько же, сколько лап у всех утконосиков.\n\nСколько вылупилось утят и сколько утконосиков?",
    stage: 3,
    maxStars: 3,
    givenStep: {
      given: [
        { id: "g-eggs", text: "333 яйца" },
        { id: "g-equal", text: "Лап у утят и утконосиков поровну" },
      ],
      find: {
        id: "f-both",
        text: "Сколько утят и сколько утконосиков?",
      },
      distractors: [
        { id: "d-types", text: "Утята и утконосики" },
        { id: "d-per", text: "У утёнка 2 лапы" },
      ],
      findDistractors: [
        { id: "fd-plat", text: "Сколько только утконосиков?" },
        { id: "fd-total", text: "Сколько всего детёнышей?" },
      ],
    },
    steps: [
      {
        id: "step-1",
        type: "order_questions",
        title: "Шаг 2. Составь план решения",
        hint: "Особый случай: лап у групп поровну, не «все лёгкие»",
        orderItems: [
          { id: "q1", text: "Кто участвует в задаче?" },
          { id: "q2", text: "Сколько лап у каждого?" },
          { id: "q3", text: "Сколько всего детёнышей?" },
          { id: "q4", text: "Что значит «лап поровну»? Запиши равенство" },
          { id: "q5", text: "Сколько утят, если утконосиков 111?" },
          { id: "q6", text: "Сколько утконосиков?" },
          { id: "q7", text: "Проверка: лап у утят = лап у утконосиков?" },
        ],
      },
      {
        id: "step-2",
        type: "worksheet_table",
        title: "Шаг 3. Ответь на вопросы плана",
        highlight: true,
        successMessage: "✅ Верно! 222 утёнка и 111 утконосиков.",
        worksheetRows: [
          {
            id: "who",
            question: "Кто участвует?",
            inputType: "static",
            staticValue: "🦆 утёнок, 🦫 утконос",
          },
          {
            id: "duck-legs",
            question: "🦆 Лап у утёнка",
            inputType: "number",
            answer: 2,
          },
          {
            id: "plat-legs",
            question: "🦫 Лап у утконоса",
            inputType: "number",
            answer: 4,
          },
          {
            id: "total",
            question: "Сколько всего детёнышей?",
            inputType: "number",
            answer: 333,
          },
          {
            id: "rule",
            question: "Лап поровну: 2 × (утят) = 4 × (утконосов). Утят в",
            inputType: "formula",
            suffix: "раз больше",
            answer: 2,
          },
          {
            id: "ducklings",
            question: "Если утконосиков 111, сколько утят?",
            inputType: "number",
            answer: 222,
          },
          {
            id: "plats",
            question: "222 + (утконосиков) = 333. Утконосиков:",
            inputType: "formula",
            prefix: "333 − 222 =",
            answer: 111,
          },
          {
            id: "check",
            question: "Проверка лап: 222 × 2 =",
            inputType: "formula",
            suffix: "(= 111 × 4)",
            answer: 444,
          },
        ],
      },
      {
        id: "step-3",
        type: "auto_explanation",
        title: "Шаг 4. Разбор",
        template: [
          "2у = 4п → у = 2п.",
          "у + п = 333 → 3п = 333 → п = 111, у = 222.",
          "Проверка лап: 222×2 = 444 = 111×4 ✓",
        ],
      },
    ],
  },
  "heads-legs-06": {
    id: "heads-legs-06",
    branchId: "modeling-heads-legs",
    number: 6,
    title: "Королевское стадо",
    condition:
      "В королевском стаде есть антилопы и единороги. Всего у них 88 ног и 35 рогов.\n\nСколько единорогов в стаде?",
    stage: 3,
    maxStars: 3,
    givenStep: {
      given: [
        { id: "g-legs", text: "88 ног (всего)" },
        { id: "g-horns", text: "35 рогов (всего)" },
      ],
      find: { id: "f-uni", text: "Сколько единорогов в стаде?" },
      distractors: [
        { id: "d-types", text: "Антилопы и единороги" },
        { id: "d-per", text: "У антилопы 2 рога" },
      ],
      findDistractors: [
        { id: "fd-ant", text: "Сколько антилоп?" },
        { id: "fd-animals", text: "Сколько всего животных?" },
      ],
    },
    steps: [
      {
        id: "step-1",
        type: "order_questions",
        title: "Шаг 2. Составь план решения",
        hint: "Сначала ноги → число животных, потом рога",
        orderItems: [
          { id: "q1", text: "Кто участвует в задаче?" },
          { id: "q2", text: "Сколько ног и рогов у каждого?" },
          { id: "q3", text: "Сколько животных по числу ног?" },
          { id: "q4", text: "Если бы все были единорогами — сколько рогов?" },
          { id: "q5", text: "Сколько рогов не хватает до условия?" },
          { id: "q6", text: "На сколько растёт число рогов при одной замене?" },
          { id: "q7", text: "Сколько единорогов в стаде?" },
        ],
      },
      {
        id: "step-2",
        type: "worksheet_table",
        title: "Шаг 3. Ответь на вопросы плана",
        highlight: true,
        successMessage: "✅ Верно! 9 единорогов и 13 антилоп.",
        worksheetRows: [
          {
            id: "who",
            question: "Кто участвует?",
            inputType: "static",
            staticValue: "🦌 антилопа, 🦄 единорог",
          },
          {
            id: "ant-legs",
            question: "🦌 Ног у антилопы",
            inputType: "number",
            answer: 4,
          },
          {
            id: "uni-legs",
            question: "🦄 Ног у единорога",
            inputType: "number",
            answer: 4,
          },
          {
            id: "ant-horns",
            question: "🦌 Рогов у антилопы",
            inputType: "number",
            answer: 2,
          },
          {
            id: "uni-horns",
            question: "🦄 Рогов у единорога",
            inputType: "number",
            answer: 1,
          },
          {
            id: "animals",
            question: "Сколько животных?",
            inputType: "formula",
            prefix: "88 ÷ 4 =",
            answer: 22,
          },
          {
            id: "all-uni",
            question: "Если все 22 — единороги, рогов:",
            inputType: "number",
            answer: 22,
          },
          {
            id: "diff",
            question: "Сколько рогов не хватает?",
            inputType: "formula",
            prefix: "35 − 22 =",
            answer: 13,
          },
          {
            id: "swap",
            question: "Замена единорога на антилопу добавляет рогов:",
            inputType: "number",
            answer: 1,
          },
          {
            id: "answer",
            question: "Единорогов в стаде:",
            inputType: "formula",
            prefix: "22 − 13 =",
            answer: 9,
          },
        ],
      },
      {
        id: "step-3",
        type: "auto_explanation",
        title: "Шаг 4. Разбор",
        template: [
          "88 ÷ 4 = 22 животных.",
          "Все единороги → 22 рога, не хватает 13.",
          "13 антилоп → 9 единорогов.",
        ],
      },
    ],
  },
  "heads-legs-07": {
    id: "heads-legs-07",
    branchId: "modeling-heads-legs",
    number: 7,
    title: "Гномы и пони",
    condition:
      "Несколько гномов, навьючив поклажу на пони, отправились в путь. Тролли насчитали 54 ноги и 17 голов.\n\nСколько было гномов и сколько пони?",
    stage: 2,
    maxStars: 3,
    steps: [
      {
        id: "step-1",
        type: "table_input",
        title: "Шаг 1. Ног у каждого",
        rows: [
          { id: "gnome", label: "Гном", emoji: "🧙", answer: 2 },
          { id: "pony", label: "Пони", emoji: "🐴", answer: 4 },
        ],
      },
      {
        id: "step-2",
        type: "number_input",
        title: "Шаг 2. Всего участников",
        context: "У гнома и пони по 1 голове.",
        question: "17 голов — сколько всего гномов и пони?",
        answer: 17,
      },
      {
        id: "step-3",
        type: "number_input",
        title: "Шаг 3. Все — гномы",
        question: "Если бы все 17 были гномами, сколько ног?",
        answer: 34,
      },
      {
        id: "step-4",
        type: "number_input",
        title: "Шаг 4. Разница",
        question: "54 − 34 = ?",
        answer: 20,
      },
      {
        id: "step-5",
        type: "number_input",
        title: "Шаг 5. Замены",
        question: "20 ÷ 2 = ? — сколько пони?",
        answer: 10,
      },
      {
        id: "step-6",
        type: "number_input",
        title: "Шаг 6. Гномы",
        question: "17 − 10 = ? — сколько гномов?",
        answer: 7,
        successMessage: "✅ Верно! 7 гномов и 10 пони.",
      },
      {
        id: "step-7",
        type: "auto_explanation",
        title: "Шаг 7. Разбор",
        template: [
          "17 голов → 17 участников.",
          "Все гномы: 34 ноги, не хватает 20.",
          "10 пони и 7 гномов.",
        ],
      },
    ],
  },
  "heads-legs-08": {
    id: "heads-legs-08",
    branchId: "modeling-heads-legs",
    number: 8,
    title: "Жирафы и страусы",
    condition:
      "По саванне бегают жирафы и страусы. У них 64 глаза и 84 ноги.\n\nКого больше: страусов или жирафов? И на сколько?",
    stage: 3,
    maxStars: 3,
    steps: [
      {
        id: "step-1",
        type: "table_input",
        title: "Шаг 1. Глаз и ног",
        tableColumnLabel: "Ног",
        rows: [
          { id: "ostrich", label: "Страус", emoji: "🦩", answer: 2 },
          { id: "giraffe", label: "Жираф", emoji: "🦒", answer: 4 },
        ],
      },
      {
        id: "step-2",
        type: "number_input",
        title: "Шаг 2. Сколько животных?",
        context: "У каждого по 2 глаза.",
        question: "64 ÷ 2 = ? — сколько животных?",
        answer: 32,
      },
      {
        id: "step-3",
        type: "number_input",
        title: "Шаг 3. Все — страусы",
        question: "Если все 32 — страусы, сколько ног?",
        answer: 64,
      },
      {
        id: "step-4",
        type: "number_input",
        title: "Шаг 4. Жирафы",
        question: "84 − 64 = 20. 20 ÷ 2 = ? — сколько жирафов?",
        answer: 10,
      },
      {
        id: "step-5",
        type: "number_input",
        title: "Шаг 5. Страусы",
        question: "32 − 10 = ? — сколько страусов?",
        answer: 22,
      },
      {
        id: "step-6",
        type: "number_input",
        title: "Шаг 6. Ответ",
        question: "На сколько страусов больше, чем жирафов?",
        answer: 12,
        successMessage: "✅ Верно! Страусов на 12 больше (22 и 10).",
      },
      {
        id: "step-7",
        type: "auto_explanation",
        title: "Шаг 7. Разбор",
        template: [
          "64 глаза → 32 животных.",
          "10 жирафов, 22 страуса.",
          "22 − 10 = 12 — страусов больше.",
        ],
      },
    ],
  },
  "heads-legs-09": {
    id: "heads-legs-09",
    branchId: "modeling-heads-legs",
    number: 9,
    title: "Снежинки на Новый год",
    condition:
      "К Новому году дети вырезали снежинки. Каждый мальчик — по 15, каждая девочка — по 19. Всего 30 детей и 530 снежинок.\n\nСколько было мальчиков и сколько девочек?",
    stage: 2,
    maxStars: 3,
    steps: [
      {
        id: "step-1",
        type: "table_input",
        title: "Шаг 1. Снежинок у каждого",
        tableColumnLabel: "Снежинок",
        rows: [
          { id: "boy", label: "Мальчик", emoji: "👦", answer: 15 },
          { id: "girl", label: "Девочка", emoji: "👧", answer: 19 },
        ],
      },
      {
        id: "step-2",
        type: "number_input",
        title: "Шаг 2. Всего детей",
        question: "Сколько детей?",
        answer: 30,
      },
      {
        id: "step-3",
        type: "number_input",
        title: "Шаг 3. Все — мальчики",
        question: "Если все 30 — мальчики, сколько снежинок?",
        answer: 450,
      },
      {
        id: "step-4",
        type: "number_input",
        title: "Шаг 4. Разница",
        question: "530 − 450 = ?",
        answer: 80,
      },
      {
        id: "step-5",
        type: "number_input",
        title: "Шаг 5. Девочки",
        context: "Замена мальчика на девочку добавляет 4 снежинки.",
        question: "80 ÷ 4 = ? — сколько девочек?",
        answer: 20,
      },
      {
        id: "step-6",
        type: "number_input",
        title: "Шаг 6. Мальчики",
        question: "30 − 20 = ? — сколько мальчиков?",
        answer: 10,
        successMessage: "✅ Верно! 10 мальчиков и 20 девочек.",
      },
      {
        id: "step-7",
        type: "auto_explanation",
        title: "Шаг 7. Разбор",
        template: [
          "Все мальчики: 30 × 15 = 450.",
          "Не хватает 80 → 20 девочек.",
          "Мальчиков: 10.",
        ],
      },
    ],
  },
  "heads-legs-10": {
    id: "heads-legs-10",
    branchId: "modeling-heads-legs",
    number: 10,
    title: "Жуки и пауки",
    condition:
      "В банке сидят жуки и пауки — всего 40 туловищ и 270 ног. У жука 6 ног, у паука 8 ног.\n\nСколько жуков и сколько пауков?",
    stage: 2,
    maxStars: 3,
    steps: [
      {
        id: "step-1",
        type: "table_input",
        title: "Шаг 1. Ног у каждого",
        rows: [
          { id: "beetle", label: "Жук", emoji: "🪲", answer: 6 },
          { id: "spider", label: "Паук", emoji: "🕷️", answer: 8 },
        ],
      },
      {
        id: "step-2",
        type: "number_input",
        title: "Шаг 2. Всего насекомых",
        question: "40 туловищ — сколько жуков и пауков?",
        answer: 40,
      },
      {
        id: "step-3",
        type: "number_input",
        title: "Шаг 3. Все — жуки",
        question: "40 × 6 = ?",
        answer: 240,
      },
      {
        id: "step-4",
        type: "number_input",
        title: "Шаг 4. Разница",
        question: "270 − 240 = ?",
        answer: 30,
      },
      {
        id: "step-5",
        type: "number_input",
        title: "Шаг 5. Пауки",
        question: "30 ÷ 2 = ? — сколько пауков?",
        answer: 15,
      },
      {
        id: "step-6",
        type: "number_input",
        title: "Шаг 6. Жуки",
        question: "40 − 15 = ? — сколько жуков?",
        answer: 25,
        successMessage: "✅ Верно! 25 жуков и 15 пауков.",
      },
      {
        id: "step-7",
        type: "auto_explanation",
        title: "Шаг 7. Разбор",
        template: [
          "Все жуки: 240 ног.",
          "Не хватает 30 → 15 пауков.",
          "Жуков: 25.",
        ],
      },
    ],
  },
  "heads-legs-11": {
    id: "heads-legs-11",
    branchId: "modeling-heads-legs",
    number: 11,
    title: "Правые ноги",
    condition:
      "В банке 70 жуков и пауков. Насчитали 242 правые ноги. У жука 6 ног, у паука 8.\n\nСколько жуков и сколько пауков?",
    stage: 3,
    maxStars: 3,
    steps: [
      {
        id: "step-1",
        type: "table_input",
        title: "Шаг 1. Ног у каждого",
        rows: [
          { id: "beetle", label: "Жук", emoji: "🪲", answer: 6 },
          { id: "spider", label: "Паук", emoji: "🕷️", answer: 8 },
        ],
      },
      {
        id: "step-2",
        type: "number_input",
        title: "Шаг 2. Всего ног",
        highlight: true,
        context: "242 правые ноги — значит всего ног вдвое больше.",
        question: "242 × 2 = ?",
        answer: 484,
      },
      {
        id: "step-3",
        type: "number_input",
        title: "Шаг 3. Всего насекомых",
        question: "Сколько туловищ?",
        answer: 70,
      },
      {
        id: "step-4",
        type: "number_input",
        title: "Шаг 4. Все — жуки",
        question: "70 × 6 = ?",
        answer: 420,
      },
      {
        id: "step-5",
        type: "number_input",
        title: "Шаг 5. Пауки",
        question: "(484 − 420) ÷ 2 = ? — сколько пауков?",
        answer: 32,
      },
      {
        id: "step-6",
        type: "number_input",
        title: "Шаг 6. Жуки",
        question: "70 − 32 = ?",
        answer: 38,
        successMessage: "✅ Верно! 38 жуков и 32 паука.",
      },
      {
        id: "step-7",
        type: "auto_explanation",
        title: "Шаг 7. Разбор",
        template: [
          "242 правые → 484 ноги всего.",
          "32 паука, 38 жуков.",
        ],
      },
    ],
  },
  "heads-legs-12": {
    id: "heads-legs-12",
    branchId: "modeling-heads-legs",
    number: 12,
    title: "Водолазы и осьминоги",
    condition:
      "На морской глубине водолазы сражаются с осьминогами. Видим 120 конечностей, из них 88 — ноги. У водолаза 2 ноги и 2 руки, у осьминога 8 ног (все конечности — ноги).\n\nСколько осьминогов?",
    stage: 4,
    maxStars: 3,
    steps: [
      {
        id: "step-1",
        type: "table_input",
        title: "Шаг 1. Ног и конечностей",
        tableColumnLabel: "Ног",
        rows: [
          { id: "diver", label: "Водолаз", emoji: "🤿", answer: 2 },
          { id: "octo", label: "Осьминог", emoji: "🐙", answer: 8 },
        ],
      },
      {
        id: "step-2",
        type: "number_input",
        title: "Шаг 2. «Лишние» конечности",
        highlight: true,
        context: "120 конечностей, но ног только 88.\nРазница — руки водолазов (по 2 на человека).",
        question: "120 − 88 = ?",
        answer: 32,
      },
      {
        id: "step-3",
        type: "number_input",
        title: "Шаг 3. Водолазы",
        question: "32 ÷ 2 = ? — сколько водолазов?",
        answer: 16,
      },
      {
        id: "step-4",
        type: "number_input",
        title: "Шаг 4. Осьминоги",
        context: "2 × 16 + 8 × (число осьминогов) = 88",
        question: "Сколько осьминогов?",
        answer: 7,
        successMessage: "✅ Верно! 7 осьминогов и 16 водолазов.",
      },
      {
        id: "step-5",
        type: "auto_explanation",
        title: "Шаг 5. Разбор",
        template: [
          "120 − 88 = 32 — руки водолазов → 16 водолазов.",
          "16×2 + 8×о = 88 → о = 7.",
        ],
      },
    ],
  },
  "heads-legs-13": {
    id: "heads-legs-13",
    branchId: "modeling-heads-legs",
    number: 13,
    title: "Котлеты в зоопарке",
    condition:
      "25 львятам и тигрятам скормили 210 котлет. Львёнку — 10 котлет, тигрёнку — 6.\n\nСколько было тигрят?",
    stage: 2,
    maxStars: 3,
    steps: [
      {
        id: "step-1",
        type: "table_input",
        title: "Шаг 1. Котлет каждому",
        tableColumnLabel: "Котлет",
        rows: [
          { id: "lion", label: "Львёнок", emoji: "🦁", answer: 10 },
          { id: "tiger", label: "Тигрёнок", emoji: "🐯", answer: 6 },
        ],
      },
      {
        id: "step-2",
        type: "number_input",
        title: "Шаг 2. Всего зверят",
        question: "Сколько львят и тигрят?",
        answer: 25,
      },
      {
        id: "step-3",
        type: "number_input",
        title: "Шаг 3. Все — тигрята",
        question: "25 × 6 = ?",
        answer: 150,
      },
      {
        id: "step-4",
        type: "number_input",
        title: "Шаг 4. Львы",
        context: "210 − 150 = 60. Замена тигрёнка на львёнка +4 котлеты.",
        question: "60 ÷ 4 = ? — сколько львят?",
        answer: 15,
      },
      {
        id: "step-5",
        type: "number_input",
        title: "Шаг 5. Ответ",
        question: "25 − 15 = ? — сколько тигрят?",
        answer: 10,
        successMessage: "✅ Верно! 10 тигрят и 15 львят.",
      },
      {
        id: "step-6",
        type: "auto_explanation",
        title: "Шаг 6. Разбор",
        template: [
          "Все тигрята: 150 котлет.",
          "15 львят → 10 тигрят.",
        ],
      },
    ],
  },
  "heads-legs-14": {
    id: "heads-legs-14",
    branchId: "modeling-heads-legs",
    number: 14,
    title: "Пирожные в кондитерской",
    condition:
      "Продали 45 пирожных двух видов — по 100 и по 125 рублей. На сумму 5000 рублей.\n\nСколько продали пирожных по 125 рублей?",
    stage: 2,
    maxStars: 3,
    steps: [
      {
        id: "step-1",
        type: "table_input",
        title: "Шаг 1. Цена",
        tableColumnLabel: "Рублей",
        rows: [
          { id: "cheap", label: "Дешёвое", emoji: "🧁", answer: 100 },
          { id: "dear", label: "Дорогое", emoji: "🍰", answer: 125 },
        ],
      },
      {
        id: "step-2",
        type: "number_input",
        title: "Шаг 2. Всего пирожных",
        question: "Сколько штук продали?",
        answer: 45,
      },
      {
        id: "step-3",
        type: "number_input",
        title: "Шаг 3. Все дешёвые",
        question: "45 × 100 = ?",
        answer: 4500,
      },
      {
        id: "step-4",
        type: "number_input",
        title: "Шаг 4. Дорогие",
        context: "5000 − 4500 = 500. Замена +25 рублей.",
        question: "500 ÷ 25 = ? — сколько по 125 ₽?",
        answer: 20,
        successMessage: "✅ Верно! 20 дорогих и 25 дешёвых.",
      },
      {
        id: "step-5",
        type: "auto_explanation",
        title: "Шаг 5. Разбор",
        template: [
          "Все по 100 ₽ → 4500 ₽.",
          "20 пирожных по 125 ₽.",
        ],
      },
    ],
  },
  "heads-legs-15": {
    id: "heads-legs-15",
    branchId: "modeling-heads-legs",
    number: 15,
    title: "Коробки с карандашами",
    condition:
      "В школу привезли 32 коробки: с простыми (20 в коробке) и цветными (16 в коробке) карандашами. Всего 580 карандашей.\n\nСколько простых карандашей привезли?",
    stage: 3,
    maxStars: 3,
    steps: [
      {
        id: "step-1",
        type: "table_input",
        title: "Шаг 1. Карандашей в коробке",
        tableColumnLabel: "Штук",
        rows: [
          { id: "plain", label: "Простые", emoji: "✏️", answer: 20 },
          { id: "color", label: "Цветные", emoji: "🖍️", answer: 16 },
        ],
      },
      {
        id: "step-2",
        type: "number_input",
        title: "Шаг 2. Всего коробок",
        question: "Сколько коробок?",
        answer: 32,
      },
      {
        id: "step-3",
        type: "number_input",
        title: "Шаг 3. Все цветные",
        question: "32 × 16 = ?",
        answer: 512,
      },
      {
        id: "step-4",
        type: "number_input",
        title: "Шаг 4. Простые коробки",
        context: "580 − 512 = 68. Замена +4 карандаша.",
        question: "68 ÷ 4 = ? — сколько коробок с простыми?",
        answer: 17,
      },
      {
        id: "step-5",
        type: "number_input",
        title: "Шаг 5. Ответ",
        question: "17 × 20 = ? — сколько простых карандашей?",
        answer: 340,
        successMessage: "✅ Верно! 340 простых карандашей.",
      },
      {
        id: "step-6",
        type: "auto_explanation",
        title: "Шаг 6. Разбор",
        template: [
          "Все цветные: 512 карандашей.",
          "17 коробок простых → 340 карандашей.",
        ],
      },
    ],
  },
  "heads-legs-16": {
    id: "heads-legs-16",
    branchId: "modeling-heads-legs",
    number: 16,
    title: "Котята и совята",
    condition:
      "34 совёнка и котёнка охотились на мышей. Котёнок поймал 4, совёнок — 7. Всего 172 мыши.\n\nКто поймал больше мышей: котята или совята? И на сколько?",
    stage: 3,
    maxStars: 3,
    steps: [
      {
        id: "step-1",
        type: "table_input",
        title: "Шаг 1. Мышей у каждого",
        tableColumnLabel: "Мышей",
        rows: [
          { id: "cat", label: "Котёнок", emoji: "🐱", answer: 4 },
          { id: "owl", label: "Совёнок", emoji: "🦉", answer: 7 },
        ],
      },
      {
        id: "step-2",
        type: "number_input",
        title: "Шаг 2. Всего охотников",
        question: "Сколько котят и совят?",
        answer: 34,
      },
      {
        id: "step-3",
        type: "number_input",
        title: "Шаг 3. Все — котята",
        question: "34 × 4 = ?",
        answer: 136,
      },
      {
        id: "step-4",
        type: "number_input",
        title: "Шаг 4. Совята",
        question: "(172 − 136) ÷ 3 = ? — сколько совят?",
        answer: 12,
      },
      {
        id: "step-5",
        type: "number_input",
        title: "Шаг 5. Сравнение",
        context: "12 совят × 7 = 84. 22 котёнка × 4 = 88.",
        question: "На сколько котята поймали больше совят?",
        answer: 4,
        successMessage: "✅ Котята поймали на 4 мыши больше (88 и 84).",
      },
      {
        id: "step-6",
        type: "auto_explanation",
        title: "Шаг 6. Разбор",
        template: [
          "12 совят, 22 котёнка.",
          "Совята: 84 мыши, котята: 88.",
          "Котята поймали на 4 больше.",
        ],
      },
    ],
  },
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
