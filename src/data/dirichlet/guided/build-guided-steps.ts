import type { DiscriminatedTaskStep } from "@/data/task-steps";
import type { DragOption } from "@/data/tasks";
import { resolveEntityEmoji } from "@/lib/entity-emoji";

import { DIRICHLET_FLOW_PROFILES } from "../flows";
import { DIRICHLET_PROOF_CARDS } from "../proof-cards.generated";
import type { DirichletFlowId, DirichletTaskMeta } from "../types";

import { buildCountWorksheetRows, describeCellCount, describeRabbitCount, extractBooleanQuestion, expectsYesAnswer, inferMinInCell, isBooleanQuestion } from "./count-patterns";
import { buildF1DirectModelSteps } from "./f1-direct-steps";
import { inferDirichletModel, type DirichletEntity, type DirichletInferredModel } from "./infer-model";
import { CELLS_STEP_TITLE, RABBITS_STEP_TITLE, rabbitsStepHint, cellsStepHint } from "./entity-hints";
import { applyDirichletScreenPhases } from "./screen-architecture";
import {
  includeIntroStep,
  resolveWrittenPhase,
  writtenPhaseHint,
  writtenPhaseTitle,
} from "./support-level";

const RABBIT_DISTRACTORS: DragOption[] = [
  { id: "d-time", label: "Время суток", emoji: "⏰", correct: false },
  { id: "d-weather", label: "Погода", emoji: "🌤️", correct: false },
  { id: "d-color", label: "Цвет упаковки", emoji: "🎨", correct: false },
];

const CELL_DISTRACTORS: DragOption[] = [
  { id: "d-sum", label: "Сумма всех предметов", emoji: "➕", correct: false },
  { id: "d-avg", label: "Среднее значение", emoji: "📊", correct: false },
  { id: "d-name", label: "Имена людей", emoji: "📛", correct: false },
];

function buildDragStep(
  taskId: string,
  suffix: string,
  title: string,
  hint: string,
  entities: DirichletEntity[],
  distractors: DragOption[],
  role: "rabbit" | "cell",
): DiscriminatedTaskStep {
  const correct: DragOption[] = entities.map((e) => ({
    id: e.id,
    label: e.label,
    emoji: resolveEntityEmoji(e.label, { id: e.id, role }),
    correct: true,
  }));

  const pool = distractors.filter(
    (d) => !correct.some((c) => c.label.toLowerCase() === d.label.toLowerCase()),
  );

  return {
    id: `${taskId}-${suffix}`,
    type: "drag_select",
    title,
    hint,
    options: [...correct, ...pool.slice(0, 3)],
  };
}

function splitReference(text: string, maxParts = 6): string[] {
  const chunks = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8);
  if (chunks.length <= maxParts) return chunks;
  const size = Math.ceil(chunks.length / maxParts);
  const out: string[] = [];
  for (let i = 0; i < chunks.length; i += size) {
    out.push(chunks.slice(i, i + size).join(" "));
  }
  return out.slice(0, maxParts);
}

function buildIntroStep(meta: DirichletTaskMeta): DiscriminatedTaskStep {
  const flow = DIRICHLET_FLOW_PROFILES[meta.flowId];
  return {
    id: `${meta.id}-intro`,
    type: "auto_explanation",
    title: "Принцип Дирихле",
    hint: "Краткое напоминание перед разбором — алгоритм ты соберёшь на следующих шагах.",
    template: flow.intro.slice(0, 1),
  };
}

function buildRabbitsStep(
  meta: DirichletTaskMeta,
  model: DirichletInferredModel,
  hasIntro: boolean,
): DiscriminatedTaskStep {
  return buildDragStep(
    meta.id,
    "rabbits",
    RABBITS_STEP_TITLE,
    rabbitsStepHint(meta, model, hasIntro),
    model.rabbits,
    RABBIT_DISTRACTORS,
    "rabbit",
  );
}

function buildCellsStep(
  meta: DirichletTaskMeta,
  model: DirichletInferredModel,
  hasIntro: boolean,
): DiscriminatedTaskStep {
  return buildDragStep(
    meta.id,
    "cells",
    CELLS_STEP_TITLE,
    cellsStepHint(meta, model, hasIntro),
    model.cells,
    CELL_DISTRACTORS,
    "cell",
  );
}

function buildCountsStep(meta: DirichletTaskMeta, model: DirichletInferredModel): DiscriminatedTaskStep {
  return {
    id: `${meta.id}-counts`,
    type: "worksheet_table",
    title: "Подсчёт N и M",
    hint: "Выпиши числа из условия — не доказывай пока.",
    successMessage: "Числа на месте!",
    worksheetRows: buildCountWorksheetRows(meta, model),
  };
}

function buildCompareStep(meta: DirichletTaskMeta, model: DirichletInferredModel): DiscriminatedTaskStep {
  const n = model.counts.n ?? "N";
  const m = model.counts.m ?? "M";
  const rabbitLabel = describeRabbitCount(meta, model);
  const cellLabel = describeCellCount(model);
  const nGtM =
    model.counts.n != null && model.counts.m != null
      ? model.counts.n > model.counts.m
      : model.compareOp === "gt";

  return {
    id: `${meta.id}-compare`,
    type: "single_select",
    title: "Сравнение",
    selectPrompt: "Как соотносятся зайцы и клетки?",
    context: `N = ${n} (${rabbitLabel}), M = ${m} (${cellLabel}). Если предметов больше категорий — сработает Дирихле.`,
    options: [
      {
        id: "gt",
        label: `${rabbitLabel.charAt(0).toUpperCase()}${rabbitLabel.slice(1)} больше, чем ${cellLabel} (N > M)`,
        emoji: "✅",
        correct: nGtM,
      },
      {
        id: "le",
        label: `${rabbitLabel.charAt(0).toUpperCase()}${rabbitLabel.slice(1)} не больше, чем ${cellLabel} (N ≤ M)`,
        emoji: "❌",
        correct: !nGtM,
      },
    ],
    successMessage: "Верно! Значит, в одной клетке будет «переполнение».",
  };
}

function buildConclusionStep(meta: DirichletTaskMeta, model: DirichletInferredModel): DiscriminatedTaskStep[] {
  const conclusion = model.conclusionText.charAt(0).toUpperCase() + model.conclusionText.slice(1);

  if (isBooleanQuestion(meta.condition)) {
    const min = inferMinInCell(model);
    const n = model.counts.n ?? "N";
    const m = model.counts.m ?? "M";
    const question = extractBooleanQuestion(meta.condition) ?? "Утверждение из условия верно?";
    const answerYes = expectsYesAnswer(meta, model);

    return [
      {
        id: `${meta.id}-answer`,
        type: "single_select",
        title: "Ответ на вопрос задачи",
        selectPrompt: question,
        context: `N = ${n}, M = ${m}. В одной клетке не менее ${min}.`,
        options: [
          { id: "yes", label: "Да, утверждение верно", emoji: "✅", correct: answerYes },
          { id: "no", label: "Нет, утверждение неверно", emoji: "❌", correct: !answerYes },
        ],
        successMessage: "Верно!",
      },
    ];
  }

  return [
    {
      id: `${meta.id}-conclusion`,
      type: "single_select",
      title: "Вывод",
      selectPrompt: "Что следует из сравнения N и M?",
      options: [
        { id: "ok", label: conclusion, emoji: "✅", correct: true },
        {
          id: "wrong1",
          label: "Предметов не больше, чем клеток — переполнения не будет",
          emoji: "❌",
          correct: false,
        },
        {
          id: "wrong2",
          label: "В каждой клетке ровно по одному предмету",
          emoji: "❌",
          correct: false,
        },
      ],
      successMessage: "Отличный вывод!",
    },
  ];
}

function buildGeneralizedSteps(meta: DirichletTaskMeta, model: DirichletInferredModel): DiscriminatedTaskStep[] {
  const k = model.counts.k ?? (model.counts.minInCell != null ? model.counts.minInCell - 1 : 2);
  const m = model.counts.m ?? 0;
  const n = model.counts.n ?? 0;
  const target = model.counts.minInCell ?? k + 1;

  return [
    {
      id: `${meta.id}-target`,
      type: "single_select",
      title: "Цель",
      selectPrompt: "Сколько минимум должно оказаться в одной клетке?",
      options: [
        { id: "t1", label: `Не менее ${target}`, emoji: "🎯", correct: true },
        { id: "t2", label: "Ровно 1", emoji: "1️⃣", correct: false },
        { id: "t3", label: "Не важно", emoji: "🤷", correct: false },
      ],
    },
    {
      id: `${meta.id}-assume`,
      type: "single_select",
      title: "Предположение «наоборот»",
      selectPrompt: "Что предположим для доказательства?",
      context: "Допустим обратное — тогда посчитаем максимум предметов.",
      options: [
        {
          id: "a1",
          label: `В каждой клетке не более ${k}`,
          emoji: "⚖️",
          correct: true,
        },
        {
          id: "a2",
          label: "В каждой клетке ровно по одному",
          emoji: "1️⃣",
          correct: false,
        },
      ],
    },
    {
      id: `${meta.id}-max-bound`,
      type: "worksheet_table",
      title: "Максимум при предположении",
      hint: `Если в каждой из M=${m} клеток не более ${k}, сколько предметов максимум?`,
      worksheetRows: [
        {
          id: "max-products",
          question: `M × k = ${m} × ${k} =`,
          inputType: "number" as const,
          answer: m * k,
          prefix: `${m} × ${k} =`,
        },
      ],
    },
    {
      id: `${meta.id}-contradiction`,
      type: "single_select",
      title: "Противоречие",
      selectPrompt: "Сравни максимум с N из условия",
      context: `По условию N = ${n}.`,
      options: [
        {
          id: "c1",
          label: `N = ${n} больше, чем M×k — предположение неверно`,
          emoji: "💥",
          correct: n > m * k,
        },
        {
          id: "c2",
          label: "N меньше — всё сходится",
          emoji: "😐",
          correct: !(n > m * k),
        },
      ],
    },
  ];
}

function buildUnluckySteps(meta: DirichletTaskMeta, model: DirichletInferredModel): DiscriminatedTaskStep[] {
  const guarantee = model.counts.minInCell ?? 2;
  const worst = model.counts.k ?? guarantee - 1;

  return [
    {
      id: `${meta.id}-goal`,
      type: "single_select",
      title: "Что нужно гарантировать?",
      selectPrompt: "Выбери цель задачи «вслепую»",
      options: [
        {
          id: "g1",
          label: model.conclusionText.slice(0, 60) || `Найти минимум ${guarantee} одинаковых`,
          emoji: "🎯",
          correct: true,
        },
        { id: "g2", label: "Угадать цвет наугад", emoji: "🎨", correct: false },
      ],
    },
    {
      id: `${meta.id}-worst`,
      type: "worksheet_table",
      title: "Самый неудачный случай",
      hint: "Разложи предметы так, чтобы гарантии ещё не было.",
      worksheetRows: [
        {
          id: "worst-max",
          question: "Максимум предметов без гарантии (худший случай):",
          inputType: "number" as const,
          answer: worst > 0 ? worst : 1,
        },
      ],
    },
    {
      id: `${meta.id}-plus-one`,
      type: "number_input",
      title: "+1 предмет",
      context: "Добавь ещё один предмет к «неудачному» раскладу.",
      question: "Сколько будет, если добавить 1?",
      answer: (worst > 0 ? worst : 0) + 1,
      successMessage: "Теперь гарантия срабатывает!",
    },
  ];
}

function buildRemainderSteps(meta: DirichletTaskMeta, model: DirichletInferredModel): DiscriminatedTaskStep[] {
  const m = model.counts.m ?? 3;
  return [
    {
      id: `${meta.id}-divisor`,
      type: "number_input",
      title: "Делитель",
      context: "Остатки при делении на m дают клетки 0, 1, …, m−1.",
      question: "На что делим (m)?",
      answer: m,
    },
    {
      id: `${meta.id}-remainder-cells`,
      type: "single_select",
      title: "Клетки-остатки",
      selectPrompt: "Что играет роль клеток?",
      options: [
        { id: "r1", label: `Остатки 0, 1, …, ${m - 1}`, emoji: "➗", correct: true },
        { id: "r2", label: "Сами числа из условия", emoji: "🔢", correct: false },
      ],
    },
  ];
}

function buildFlowModelSteps(
  meta: DirichletTaskMeta,
  model: DirichletInferredModel,
): DiscriminatedTaskStep[] {
  const common: DiscriminatedTaskStep[] = [
    buildCountsStep(meta, model),
    buildCompareStep(meta, model),
  ];

  switch (meta.flowId) {
    case "F1_DIRECT":
      return buildF1DirectModelSteps(meta, model);
    case "F2_GENERALIZED":
      return [...buildGeneralizedSteps(meta, model), ...buildConclusionStep(meta, model)];
    case "F3_UNLUCKY":
      return [...buildUnluckySteps(meta, model), ...buildConclusionStep(meta, model)];
    case "F4_REMAINDERS":
      return [...buildRemainderSteps(meta, model), ...common, ...buildConclusionStep(meta, model)];
    case "F5_GEOMETRY_PARTITION":
    case "F6_TABLE_SUMS":
    case "F7_GRAPH_RELATIONS":
    case "F8_COLOR_RAMSEY":
    case "F10_ADVANCED":
      return [...common, ...buildConclusionStep(meta, model)];
    default:
      return buildF1DirectModelSteps(meta, model);
  }
}

function buildWrittenSteps(meta: DirichletTaskMeta): DiscriminatedTaskStep[] {
  const steps: DiscriminatedTaskStep[] = [];
  const plan = resolveWrittenPhase(meta);
  const proofOrder = DIRICHLET_PROOF_CARDS[meta.methodTaskId];

  if (plan.includeProofOrder && proofOrder && proofOrder.length >= 3) {
    steps.push({
      id: `${meta.id}-proof-order`,
      type: "order_questions",
      title: "План доказательства",
      hint: "Расставь шаги доказательства по порядку: зайцы → клетки → числа → вывод.",
      orderItems: proofOrder,
    });
  }

  if (plan.includeProofLines) {
    steps.push({
      id: `${meta.id}-proof-lines`,
      type: "proof_lines",
      title: writtenPhaseTitle(plan),
      hint: writtenPhaseHint(plan),
      solutionLines: meta.solutionLines,
    });
  }

  if (plan.includeWordSolution && plan.wordSolutionMode) {
    steps.push({
      id: `${meta.id}-words`,
      type: "word_solution",
      title: writtenPhaseTitle(plan),
      hint: writtenPhaseHint(plan),
      solutionMode: plan.wordSolutionMode,
      solutionLines: plan.wordSolutionUseLines ? meta.solutionLines : [],
      acceptedAnswers: meta.acceptedAnswers,
      hintLevels: meta.hintLevels,
    });
  }

  const preview = splitReference(meta.acceptedAnswers.solutionReference);
  if (preview.length > 0) {
    steps.push({
      id: `${meta.id}-preview`,
      type: "auto_explanation",
      explanationRole: "preview",
      title: "Финиш · эталон",
      hint: plan.includeWordSolution
        ? "Сверь свой текст с образцом."
        : "Прочитай, как это записывают в методичке — ты уже собрал доказательство на карточках.",
      template: preview,
    });
  }

  return steps;
}

/** 10-экранный runner: E0–E7 по flow + фазы «Этап X из 4» */
export function buildDirichletGuidedSteps(meta: DirichletTaskMeta): DiscriminatedTaskStep[] {
  const model = inferDirichletModel(
    meta.condition,
    meta.acceptedAnswers.solutionReference,
    meta.methodTaskId,
    meta.flowId,
  );

  const hasIntro = includeIntroStep(meta);

  const steps: DiscriminatedTaskStep[] = [];
  if (hasIntro) {
    steps.push(buildIntroStep(meta));
  }
  steps.push(
    buildRabbitsStep(meta, model, hasIntro),
    buildCellsStep(meta, model, hasIntro),
    ...buildFlowModelSteps(meta, model),
    ...buildWrittenSteps(meta),
  );

  return applyDirichletScreenPhases(steps, meta);
}

export function countDirichletRunnerScreens(flowId: DirichletFlowId): number {
  switch (flowId) {
    case "F2_GENERALIZED":
      return 10;
    case "F3_UNLUCKY":
      return 9;
    case "F4_REMAINDERS":
      return 9;
    default:
      return 8;
  }
}
