import type { DiscriminatedTaskStep } from "@/data/task-steps";
import type { DragOption } from "@/data/tasks";

import type { DirichletInferredModel, DirichletTaskMeta } from "../types";

import {
  buildCountWorksheetRows,
  describeCellCount,
  describeRabbitCount,
  extractBooleanQuestion,
  expectsYesAnswer,
  inferMinInCell,
  isBooleanQuestion,
} from "./count-patterns";
import { buildCustomF1Steps, hasCustomF1Steps } from "./custom";

function buildCountsStep(meta: DirichletTaskMeta, model: DirichletInferredModel): DiscriminatedTaskStep {
  return {
    id: `${meta.id}-counts`,
    type: "worksheet_table",
    title: "Подсчёт N и M",
    hint: "Сначала выпиши число предметов, затем посчитай число клеток — не доказывай пока.",
    successMessage: "Числа на месте!",
    worksheetRows: buildCountWorksheetRows(meta, model),
  };
}

function buildCompareStep(meta: DirichletTaskMeta, model: DirichletInferredModel): DiscriminatedTaskStep | null {
  const n = model.counts.n;
  const m = model.counts.m;
  if (n == null || m == null) {
    return null;
  }

  const rabbitLabel = describeRabbitCount(meta, model);
  const cellLabel = describeCellCount(model);
  const nGtM = n > m;

  return {
    id: `${meta.id}-compare`,
    type: "single_select",
    title: "Сравнение",
    selectPrompt: "Как соотносятся зайцы и клетки?",
    context: `N = ${n} (${rabbitLabel}), M = ${m} (${cellLabel}). Если предметов больше категорий — сработает принцип Дирихле.`,
    options: [
      {
        id: "gt",
        label: `${capFirst(rabbitLabel)} больше, чем ${cellLabel} (N > M)`,
        emoji: "✅",
        correct: nGtM,
      },
      {
        id: "le",
        label: `${capFirst(rabbitLabel)} не больше, чем ${cellLabel} (N ≤ M)`,
        emoji: "❌",
        correct: !nGtM,
      },
    ],
    successMessage: "Верно! Значит, в одной клетке будет «переполнение».",
  };
}

function capFirst(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildMinInCellStep(meta: DirichletTaskMeta, model: DirichletInferredModel): DiscriminatedTaskStep {
  const min = inferMinInCell(model);
  const n = model.counts.n ?? "N";
  const m = model.counts.m ?? "M";
  const rabbitLabel = describeRabbitCount(meta, model);
  const cellLabel = describeCellCount(model);

  return {
    id: `${meta.id}-min-cell`,
    type: "single_select",
    title: "Следствие Дирихле",
    hint: "N > M — значит, все предметы не поместятся по одному в каждую клетку.",
    selectPrompt: "Сколько минимум предметов окажется в одной клетке?",
    context: `N = ${n} (${rabbitLabel}), M = ${m} (${cellLabel}), N > M.`,
    options: [
      { id: "min-ok", label: `Не менее ${min}`, emoji: "🎯", correct: true },
      { id: "min-1", label: "Ровно 1", emoji: "1️⃣", correct: false },
      { id: "min-0", label: "Может быть 0", emoji: "0️⃣", correct: false },
    ],
    successMessage: `Верно! В одной клетке — не менее ${min}.`,
  };
}

function buildFormulationStep(meta: DirichletTaskMeta, model: DirichletInferredModel): DiscriminatedTaskStep {
  const conclusion = model.conclusionText.charAt(0).toUpperCase() + model.conclusionText.slice(1);
  const min = inferMinInCell(model);

  const distractors: DragOption[] = [
    {
      id: "wrong-le",
      label: "Предметов не больше, чем клеток — переполнения не будет",
      emoji: "❌",
      correct: false,
    },
    {
      id: "wrong-one",
      label: "В каждой клетке ровно по одному предмету",
      emoji: "❌",
      correct: false,
    },
  ];

  if (min > 2) {
    distractors.push({
      id: "wrong-min2",
      label: "В одной клетке может быть только двое",
      emoji: "❌",
      correct: false,
    });
  }

  return {
    id: `${meta.id}-conclusion`,
    type: "single_select",
    title: "Вывод",
    hint: "Сформулируй, что следует из принципа Дирихле.",
    selectPrompt: "Что следует из сравнения N и M?",
    options: [{ id: "ok", label: conclusion, emoji: "✅", correct: true }, ...distractors.slice(0, 2)],
    successMessage: "Отличный вывод!",
  };
}

function buildBooleanAnswerStep(meta: DirichletTaskMeta, model: DirichletInferredModel): DiscriminatedTaskStep {
  const min = inferMinInCell(model);
  const n = model.counts.n ?? "N";
  const m = model.counts.m ?? "M";
  const rabbitLabel = describeRabbitCount(meta, model);
  const cellLabel = describeCellCount(model);
  const question = extractBooleanQuestion(meta.condition) ?? "Утверждение из условия верно?";
  const answerYes = expectsYesAnswer(meta, model);

  return {
    id: `${meta.id}-answer`,
    type: "single_select",
    title: "Ответ на вопрос задачи",
    hint: "Сопоставь следствие Дирихле с вопросом в условии.",
    selectPrompt: question,
    context: `N = ${n} (${rabbitLabel}), M = ${m} (${cellLabel}). В одной клетке не менее ${min}.`,
    options: [
      { id: "yes", label: "Да, утверждение верно", emoji: "✅", correct: answerYes },
      { id: "no", label: "Нет, утверждение неверно", emoji: "❌", correct: !answerYes },
    ],
    successMessage: "Верно! Дирихле даёт нужный ответ.",
  };
}

function buildDefaultF1Steps(meta: DirichletTaskMeta, model: DirichletInferredModel): DiscriminatedTaskStep[] {
  const steps: DiscriminatedTaskStep[] = [buildCountsStep(meta, model)];
  const compare = buildCompareStep(meta, model);
  if (compare) steps.push(compare);

  const nGtM =
    model.counts.n != null && model.counts.m != null
      ? model.counts.n > model.counts.m
      : model.compareOp === "gt";

  if (nGtM) {
    steps.push(buildMinInCellStep(meta, model));
  }

  if (isBooleanQuestion(meta.condition)) {
    steps.push(buildBooleanAnswerStep(meta, model));
  } else {
    steps.push(buildFormulationStep(meta, model));
  }

  return steps;
}

/** F1_DIRECT: подсчёт N/M → сравнение → min в клетке → вывод / ответ «верно ли» */
export function buildF1DirectModelSteps(
  meta: DirichletTaskMeta,
  model: DirichletInferredModel,
): DiscriminatedTaskStep[] {
  if (hasCustomF1Steps(meta.methodTaskId)) {
    const custom = buildCustomF1Steps(meta.methodTaskId, meta.id, model);
    if (custom) return custom;
  }
  return buildDefaultF1Steps(meta, model);
}
