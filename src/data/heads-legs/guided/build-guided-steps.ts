import type { DiscriminatedTaskStep } from "@/data/task-steps";
import { resolveEntityEmoji } from "@/lib/entity-emoji";
import type { SolutionMode } from "../solution-modes";
import type { HeadsLegsTaskMeta } from "../types";
import { inferFeatureTable, featureStepMeta } from "./feature-table";
import { inferFeatureSumLabel } from "./feature-overrides";
import { TOTALS_OVERRIDES } from "./totals-overrides";
import { buildParticipantStep, inferTaskEntities } from "./participants";
import { buildCalcWorksheets } from "./worksheets";
import { resolveTaskFlow } from "./task-flow";
import { buildSolutionPreviewLines } from "./solution-preview";
import { applyScreenPhases } from "./screen-architecture";
import {
  buildCustomMiddleSteps,
  buildCustomTailSteps,
  hasCustomMiddleSteps,
  hasCustomTailSteps,
  skipsDefaultParticipant,
} from "./custom";
import { buildTransferAssumeStep43 } from "./custom/steps-4-3";

function assumptionObjectPhrase(condition: string, totalObjects: number | null | undefined): string {
  if (totalObjects != null) {
    if (/девоч/i.test(condition)) return ` все ${totalObjects} девочек`;
    if (/клумб/i.test(condition)) return ` все ${totalObjects} клумб`;
    if (/голов/i.test(condition)) return ` все ${totalObjects} животных`;
    if (/яиц|детёныш/i.test(condition)) return ` все ${totalObjects} детёнышей`;
    return ` все ${totalObjects} объектов`;
  }
  if (/девоч/i.test(condition)) return " все девочки";
  if (/клумб/i.test(condition)) return " все клумбы";
  return " все объекты";
}

function entityMatchesAssumeKind(entityLabel: string, assumeKind: string): boolean {
  const el = entityLabel.toLowerCase().trim();
  const ak = assumeKind.toLowerCase().trim();
  if (el === ak) return true;
  const words = ak.split(/\s+/).filter((w) => w.length > 3);
  return words.length > 0 && words.every((w) => el.includes(w));
}

function resolveAssumeEntityIndex(
  entities: ReturnType<typeof inferTaskEntities>,
  meta: HeadsLegsTaskMeta,
): 0 | 1 {
  const ri = meta.ruleInstance;
  if (ri?.ruleId === "heads-legs-score-base") {
    const key = ri.assumeKind.toLowerCase();
    const byKind = entities.findIndex((e) => entityMatchesAssumeKind(e.label, key));
    if (byKind >= 0) return byKind as 0 | 1;
    if (/2|двой/i.test(key)) {
      const idx = entities.findIndex((e) => /2|двой/i.test(e.label));
      if (idx >= 0) return idx as 0 | 1;
    }
    if (/3|трой/i.test(key)) {
      const idx = entities.findIndex((e) => /3|трой/i.test(e.label));
      if (idx >= 0) return idx as 0 | 1;
    }
  }
  // По умолчанию — первый вид (обычно меньший вклад / «простой» вариант)
  return 0;
}

function buildAssumptionStep(
  taskId: string,
  entities: ReturnType<typeof inferTaskEntities>,
  condition: string,
  totalObjects: number | null | undefined,
  meta: HeadsLegsTaskMeta,
): DiscriminatedTaskStep {
  const totalHint = assumptionObjectPhrase(condition, totalObjects);
  const assumeIdx = resolveAssumeEntityIndex(entities, meta);
  return {
    id: `${taskId}-assume`,
    type: "single_select",
    title: "Выбери предположение",
    selectPrompt: `Представим, что${totalHint} получили…`,
    context: "С какого вида удобнее начать пробный расчёт?",
    options: [
      {
        id: "type1",
        label: entities[0]?.label ?? "вид 1",
        emoji: resolveEntityEmoji(entities[0]?.label ?? "вид 1", { id: "type1", role: "object" }),
        correct: assumeIdx === 0,
      },
      {
        id: "type2",
        label: entities[1]?.label ?? "вид 2",
        emoji: resolveEntityEmoji(entities[1]?.label ?? "вид 2", { id: "type2", role: "object" }),
        correct: assumeIdx === 1,
      },
    ],
    successMessage: "Хорошо! Считаем дальше.",
  };
}

/** FactExtractor: общие числа из условия (docx экран 4 для 1.1 / 1.3) */
function buildTotalsWorksheet(meta: HeadsLegsTaskMeta): DiscriminatedTaskStep | null {
  const override = TOTALS_OVERRIDES[meta.methodTaskId];
  const objects = override?.totalObjects ?? meta.totals?.totalObjects;
  const feature = override?.totalFeature ?? meta.totals?.totalFeature;
  if (objects == null && feature == null) return null;

  const featMeta = featureStepMeta(meta.condition, meta.methodTaskId);
  const objectLabel = /\d+\s+голов/i.test(meta.condition)
    ? "животных (голов)"
    : /яиц|детёныш/i.test(meta.condition)
      ? "детёнышей"
      : /девоч/i.test(meta.condition)
        ? "девочек"
        : /клумб/i.test(meta.condition)
          ? "клумб"
          : "объектов";
  const featureLabel = inferFeatureSumLabel(featMeta.columnLabel).toLowerCase();

  const rows = [];
  if (objects != null) {
    const objectsHint = /одиннадцат(?:и|ь)\s+клумб/i.test(meta.condition)
      ? " (в условии: «одиннадцати» — это 11)"
      : "";
    rows.push({
      id: "totals-objects",
      question: `Сколько всего ${objectLabel} по условию?${objectsHint}`,
      inputType: "number" as const,
      answer: objects,
    });
  }
  if (feature != null) {
    rows.push({
      id: "totals-feature",
      question: `Сколько всего ${featureLabel} по условию?`,
      inputType: "number" as const,
      answer: feature,
    });
  }
  if (rows.length === 0) return null;

  return {
    id: `${meta.id}-totals`,
    type: "worksheet_table",
    title: "Собери известные данные",
    hint: "Перенеси числа из условия задачи — не считай, только выпиши.",
    successMessage: "Отлично! Данные на месте — можно считать.",
    worksheetRows: rows,
  };
}

function wordStepTitle(mode: SolutionMode, profile: ReturnType<typeof resolveTaskFlow>["profile"]): string {
  if (profile === "diagnostic") return "Запиши диагностический вывод";
  if (profile === "enumeration") return "Запиши перебор и вывод";
  if (mode === "A") return "Запиши решение словами";
  return "Запиши решение словами";
}

export function buildGuidedSteps(meta: HeadsLegsTaskMeta): DiscriminatedTaskStep[] {
  const lines = meta.solutionLines ?? [];
  const mode = meta.solutionMode;
  const flow = resolveTaskFlow(meta);
  const entities = inferTaskEntities(meta.condition, meta.methodTaskId, lines);

  const steps: DiscriminatedTaskStep[] = [];

  if (!skipsDefaultParticipant(meta.methodTaskId)) {
    steps.push(buildParticipantStep(meta.id, meta.condition, entities));
  }

  if (flow.featureTable) {
    const featureRows = inferFeatureTable(meta.condition, entities, lines, meta.methodTaskId);
    if (featureRows) {
      const feat = featureStepMeta(meta.condition, meta.methodTaskId);
      steps.push({
        id: `${meta.id}-features`,
        type: "table_input",
        title: feat.stepTitle.replace(/^③\s*/, ""),
        hint: feat.stepHint,
        tableColumnLabel: feat.columnLabel,
        rows: featureRows,
      });
    }
  }

  const totalsStep = flow.featureTable ? buildTotalsWorksheet(meta) : null;
  if (totalsStep) steps.push(totalsStep);

  if (flow.assumptionStep) {
    steps.push(buildAssumptionStep(meta.id, entities, meta.condition, meta.totals?.totalObjects, meta));
  }

  if (meta.methodTaskId === "4.3") {
    steps.push(buildTransferAssumeStep43(meta.id));
  } else if (hasCustomMiddleSteps(meta.methodTaskId)) {
    const custom = buildCustomMiddleSteps(meta.methodTaskId, meta.id);
    if (custom) steps.push(...custom);
  } else if (flow.calcWorksheets) {
    steps.push(...buildCalcWorksheets(meta.id, lines, flow.profile, meta, entities));
  }

  if (hasCustomTailSteps(meta.methodTaskId)) {
    const tail = buildCustomTailSteps(meta.methodTaskId, meta.id);
    if (tail) steps.push(...tail);
  }

  steps.push({
    id: `${meta.id}-words`,
    type: "word_solution",
    title:
      meta.methodTaskId === "4.3" ? "Запиши решение с пропусками" : wordStepTitle(mode, flow.profile),
    hint:
      meta.methodTaskId === "4.3"
        ? "В каждый пропуск — полный пример, например 12 × 2 = 24."
        : flow.profile === "diagnostic"
          ? "Объясни, какого числа не хватает и приведи примеры вариантов."
          : flow.profile === "enumeration"
            ? "Запиши проверку вариантов и итоговый ответ."
            : "Собери полный текст решения. Ответ — полным предложением.",
    solutionMode: mode,
    solutionLines: lines,
    acceptedAnswers: meta.acceptedAnswers,
    hintLevels: meta.hintLevels,
    ...(meta.methodTaskId === "4.3"
      ? { blanksOnly: true, requireExpressionFormat: true }
      : {}),
  });

  if (flow.solutionPreview && lines.length > 0) {
    steps.push({
      id: `${meta.id}-preview`,
      type: "auto_explanation",
      explanationRole: "preview",
      title: meta.methodTaskId === "4.3" ? "Ответ" : "Что мы сделали?",
      hint: "Прочитай готовый текст — так пишут на контрольной.",
      template: buildSolutionPreviewLines(lines),
    });
  }

  return applyScreenPhases(steps, meta);
}
