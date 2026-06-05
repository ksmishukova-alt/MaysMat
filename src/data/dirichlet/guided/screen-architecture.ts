import type { DiscriminatedTaskStep } from "@/data/task-steps";

import { entitySubStepLabel } from "./entity-hints";
import type { DirichletFlowId } from "../types";
import type { DirichletTaskMeta } from "../types";

export type DirichletScreenModule =
  | "condition"
  | "intro"
  | "entities"
  | "model"
  | "conclusion"
  | "written";

interface PhaseDef {
  id: DirichletScreenModule;
  title: string;
}

const PHASE_PLANS: Record<DirichletFlowId, PhaseDef[]> = {
  F1_DIRECT: [
    { id: "condition", title: "Понимаем задачу" },
    { id: "entities", title: "Зайцы и клетки" },
    { id: "model", title: "Собираем модель" },
    { id: "written", title: "Записываем доказательство" },
  ],
  F2_GENERALIZED: [
    { id: "condition", title: "Понимаем задачу" },
    { id: "entities", title: "Зайцы и клетки" },
    { id: "model", title: "Обобщённый Дирихле" },
    { id: "written", title: "Записываем доказательство" },
  ],
  F3_UNLUCKY: [
    { id: "condition", title: "Понимаем задачу" },
    { id: "entities", title: "Что гарантируем" },
    { id: "model", title: "Метод неудачника" },
    { id: "written", title: "Записываем доказательство" },
  ],
  F4_REMAINDERS: [
    { id: "condition", title: "Понимаем задачу" },
    { id: "entities", title: "Объекты и остатки" },
    { id: "model", title: "Остатки как клетки" },
    { id: "written", title: "Записываем доказательство" },
  ],
  F5_GEOMETRY_PARTITION: [
    { id: "condition", title: "Понимаем задачу" },
    { id: "entities", title: "Части и объекты" },
    { id: "model", title: "Геометрическое разбиение" },
    { id: "written", title: "Записываем доказательство" },
  ],
  F6_TABLE_SUMS: [
    { id: "condition", title: "Понимаем задачу" },
    { id: "entities", title: "Таблица и значения" },
    { id: "model", title: "Суммы и клетки" },
    { id: "written", title: "Записываем доказательство" },
  ],
  F7_GRAPH_RELATIONS: [
    { id: "condition", title: "Понимаем задачу" },
    { id: "entities", title: "Вершины и связи" },
    { id: "model", title: "Связи и Дирихле" },
    { id: "written", title: "Записываем доказательство" },
  ],
  F8_COLOR_RAMSEY: [
    { id: "condition", title: "Понимаем задачу" },
    { id: "entities", title: "Раскраски и пары" },
    { id: "model", title: "Однотонная пара" },
    { id: "written", title: "Записываем доказательство" },
  ],
  F10_ADVANCED: [
    { id: "condition", title: "Понимаем задачу" },
    { id: "entities", title: "Конструкция" },
    { id: "model", title: "Проверяем условия" },
    { id: "written", title: "Записываем решение" },
  ],
};

export function resolveDirichletPhaseCount(flowId: DirichletFlowId): number {
  return PHASE_PLANS[flowId]?.length ?? 4;
}

function moduleForStep(step: DiscriminatedTaskStep): DirichletScreenModule {
  if (step.id.includes("-intro")) return "intro";
  if (step.id.includes("-rabbits") || step.id.includes("-cells") || step.id.includes("-goal")) {
    return "entities";
  }
  if (step.id.includes("-conclusion") || step.id.includes("-answer") || step.id.includes("-min-cell")) {
    return "conclusion";
  }
  if (step.id.includes("-proof-order") || step.type === "proof_lines") return "written";
  if (step.type === "word_solution" || step.id.includes("-preview")) return "written";
  if (
    step.type === "worksheet_table" ||
    step.type === "single_select" ||
    step.type === "number_input" ||
    step.type === "order_questions"
  ) {
    return step.id.includes("-conclusion") ? "conclusion" : "model";
  }
  if (step.type === "auto_explanation") {
    return step.id.includes("-preview") ? "written" : "intro";
  }
  if (step.type === "drag_select") return "entities";
  return "model";
}

function subStepLabel(
  step: DiscriminatedTaskStep,
  stepsInModule: DiscriminatedTaskStep[],
): string | undefined {
  const entityLabel = entitySubStepLabel(step.id);
  if (entityLabel) return entityLabel;

  const idx = stepsInModule.findIndex((s) => s.id === step.id);
  if (idx < 0 || stepsInModule.length <= 1) return undefined;
  return `Шаг ${idx + 1} из ${stepsInModule.length}`;
}

/** Назначает фазы экранов runner (4 этапа + подшаги) */
export function applyDirichletScreenPhases(
  steps: DiscriminatedTaskStep[],
  meta: DirichletTaskMeta,
): DiscriminatedTaskStep[] {
  const phases = PHASE_PLANS[meta.flowId] ?? PHASE_PLANS.F1_DIRECT;
  const phaseIndex = (id: DirichletScreenModule) => {
    const mapped =
      id === "intro" ? "entities" : id === "conclusion" ? "model" : id;
    const i = phases.findIndex((p) => p.id === mapped);
    return i >= 0 ? i + 1 : 1;
  };
  const phaseTitle = (id: DirichletScreenModule) => {
    const mapped =
      id === "intro" ? "entities" : id === "conclusion" ? "model" : id;
    return phases.find((p) => p.id === mapped)?.title ?? "";
  };

  const byModule = new Map<DirichletScreenModule, DiscriminatedTaskStep[]>();
  for (const step of steps) {
    const mod = moduleForStep(step);
    const list = byModule.get(mod) ?? [];
    list.push(step);
    byModule.set(mod, list);
  }

  const entitySteps = byModule.get("entities") ?? [];
  const introSteps = byModule.get("intro") ?? [];
  const modelSteps = [
    ...(byModule.get("model") ?? []),
    ...(byModule.get("conclusion") ?? []),
  ];
  const writtenSteps = byModule.get("written") ?? [];

  return steps.map((step) => {
    const module = moduleForStep(step);
    let pool = byModule.get(module) ?? [];
    if (module === "intro") pool = introSteps;
    if (module === "entities") pool = entitySteps;
    if (module === "model" || module === "conclusion") pool = modelSteps;
    if (module === "written") pool = writtenSteps;

    return {
      ...step,
      screenPhaseId: module,
      screenPhaseTitle: phaseTitle(module),
      screenPhaseIndex: phaseIndex(module),
      screenPhaseCount: phases.length,
      screenSubStep: subStepLabel(step, pool),
    };
  });
}

export function applyDirichletReadPhase<T extends {
  screenPhaseId?: string;
  screenPhaseTitle?: string;
  screenPhaseIndex?: number;
  screenPhaseCount?: number;
}>(
  step: T,
  flowId: DirichletFlowId,
): T {
  return {
    ...step,
    screenPhaseId: "condition",
    screenPhaseTitle: "Понимаем задачу",
    screenPhaseIndex: 1,
    screenPhaseCount: resolveDirichletPhaseCount(flowId),
  };
}
