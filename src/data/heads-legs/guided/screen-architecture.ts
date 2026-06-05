import type { DiscriminatedTaskStep } from "@/data/task-steps";
import type { HeadsLegsTaskMeta } from "../types";
import type { FlowProfile } from "./task-flow";
import { resolveTaskFlow } from "./task-flow";

export type ScreenModule =
  | "condition"
  | "entities"
  | "model"
  | "solver"
  | "diagnostic"
  | "structural"
  | "secondary"
  | "written";

interface PhaseDef {
  id: ScreenModule;
  title: string;
}

function phasePlan(methodTaskId: string, profile: FlowProfile): PhaseDef[] {
  if (methodTaskId === "3.1") {
    return [
      { id: "entities", title: "Понимаем задачу" },
      { id: "diagnostic", title: "Проверяем, хватает ли данных" },
      { id: "written", title: "Записываем вывод" },
    ];
  }
  if (methodTaskId === "3.5") {
    return [
      { id: "entities", title: "Понимаем задачу" },
      { id: "model", title: "Собираем модель" },
      { id: "solver", title: "Считаем: сколько совят и котят" },
      { id: "secondary", title: "Отвечаем на главный вопрос" },
      { id: "written", title: "Записываем решение" },
    ];
  }
  if (methodTaskId === "6.4" || profile === "structural") {
    return [
      { id: "entities", title: "Понимаем задачу" },
      { id: "structural", title: "Скрытое равенство и замена" },
      { id: "written", title: "Записываем решение" },
    ];
  }
  if (profile === "diagnostic") {
    return [
      { id: "entities", title: "Понимаем задачу" },
      { id: "diagnostic", title: "Диагностика условия" },
      { id: "written", title: "Записываем вывод" },
    ];
  }
  return [
    { id: "entities", title: "Понимаем задачу" },
    { id: "model", title: "Выбираем способ" },
    { id: "solver", title: "Считаем по шагам" },
    { id: "written", title: "Записываем ответ" },
  ];
}

function moduleForStep(step: DiscriminatedTaskStep, methodTaskId: string): ScreenModule {
  if (step.id.includes("-struct-")) return "structural";
  if (step.id.includes("-diag-")) return "diagnostic";
  if (step.id.includes("-secondary-")) return "secondary";

  switch (step.type) {
    case "drag_select":
    case "table_input":
      return "entities";
    case "single_select":
      return methodTaskId === "3.1" ? "diagnostic" : "model";
    case "worksheet_table":
      if (step.id.endsWith("-totals")) return "model";
      return step.id.includes("-struct-")
        ? "structural"
        : step.id.includes("-secondary-")
          ? "secondary"
          : "solver";
    case "auto_explanation":
      if (step.id.includes("-preview")) return "written";
      if (step.id.includes("-struct-intro")) return "structural";
      return methodTaskId === "3.1" ? "diagnostic" : "entities";
    case "word_solution":
      return "written";
    default:
      return "entities";
  }
}

function solverSubStep(step: DiscriminatedTaskStep, solverSteps: DiscriminatedTaskStep[]): string | undefined {
  if (step.type !== "worksheet_table") return undefined;
  const idx = solverSteps.findIndex((s) => s.id === step.id);
  if (idx < 0) return undefined;
  const total = solverSteps.length;
  if (total <= 1) return undefined;
  return `Шаг ${idx + 1} из ${total}`;
}

/** Назначает фазы экранов по архитектурному документу */
export function applyScreenPhases(
  steps: DiscriminatedTaskStep[],
  meta: HeadsLegsTaskMeta,
): DiscriminatedTaskStep[] {
  const flow = resolveTaskFlow(meta);
  const phases = phasePlan(meta.methodTaskId, flow.profile);
  const phaseIndex = (id: ScreenModule) => {
    const i = phases.findIndex((p) => p.id === id);
    return i >= 0 ? i + 1 : 1;
  };
  const phaseTitle = (id: ScreenModule) => phases.find((p) => p.id === id)?.title ?? "";

  const solverSteps = steps.filter(
    (s) =>
      s.type === "worksheet_table" &&
      !s.id.includes("-struct-") &&
      !s.id.includes("-secondary-"),
  );
  const structuralSteps = steps.filter((s) => s.type === "worksheet_table" && s.id.includes("-struct-"));

  const diagnosticSteps = steps.filter((s) => s.type === "worksheet_table" && s.id.includes("-diag-"));

  return steps.map((step) => {
    const module = moduleForStep(step, meta.methodTaskId);
    let subStep = solverSubStep(step, solverSteps);
    if (step.type === "worksheet_table" && step.id.includes("-struct-")) {
      const idx = structuralSteps.findIndex((s) => s.id === step.id);
      if (idx >= 0 && structuralSteps.length > 1) {
        subStep = `Шаг ${idx + 1} из ${structuralSteps.length}`;
      }
    }
    if (step.type === "worksheet_table" && step.id.includes("-diag-")) {
      const idx = diagnosticSteps.findIndex((s) => s.id === step.id);
      if (idx >= 0 && diagnosticSteps.length > 1) {
        subStep = `Шаг ${idx + 1} из ${diagnosticSteps.length}`;
      }
    }

    return {
      ...step,
      screenPhaseId: module,
      screenPhaseTitle: phaseTitle(module),
      screenPhaseIndex: phaseIndex(module),
      screenPhaseCount: phases.length,
      screenSubStep: subStep,
    };
  });
}

export function applyReadConditionPhase<T extends {
  screenPhaseId?: string;
  screenPhaseTitle?: string;
  screenPhaseIndex?: number;
  screenPhaseCount?: number;
}>(
  step: T,
  methodTaskId?: string,
): T {
  const phaseCount = methodTaskId === "3.1" ? 3 : methodTaskId === "3.5" ? 5 : methodTaskId === "6.4" ? 3 : 4;
  return {
    ...step,
    screenPhaseId: "condition",
    screenPhaseTitle: "Понимаем задачу",
    screenPhaseIndex: 1,
    screenPhaseCount: phaseCount,
  };
}
