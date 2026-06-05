import type { DiscriminatedTaskStep } from "@/data/task-steps";

import type { DirichletInferredModel, DirichletTaskMeta } from "../../types";

import { buildStepsM01 } from "./steps-m0-1";
import { buildStepsM04 } from "./steps-m0-4";
import { buildStepsM23 } from "./steps-m2-3";
import { buildStepsM25 } from "./steps-m2-5";
import { buildStepsM27 } from "./steps-m2-7";
import { buildStepsM31 } from "./steps-m3-1";

type FlowCustomBuilder = (
  taskId: string,
  model: DirichletInferredModel,
  meta: DirichletTaskMeta,
) => DiscriminatedTaskStep[];

/** Полная замена model-шагов flow (после drag зайцев/клеток) */
const FLOW_MODEL_CUSTOM: Record<string, FlowCustomBuilder> = {
  "M0.4": (taskId) => buildStepsM04(taskId),
  "M2.3": (taskId) => buildStepsM23(taskId),
  "M2.5": (taskId) => buildStepsM25(taskId),
  "M2.7": (taskId) => buildStepsM27(taskId),
  "M3.1": (taskId) => buildStepsM31(taskId),
};

const F1_CUSTOM: Record<string, (taskId: string, model: DirichletInferredModel) => DiscriminatedTaskStep[]> = {
  "M0.1": buildStepsM01,
};

/** Задачи без generic drag «зайцы/клетки» */
export function skipsDefaultEntityDrag(methodTaskId: string): boolean {
  return (
    methodTaskId === "M0.4" ||
    methodTaskId === "M2.5" ||
    methodTaskId === "M3.1" ||
    methodTaskId === "M2.3" ||
    methodTaskId === "M2.7"
  );
}

export function hasCustomFlowModelSteps(methodTaskId: string): boolean {
  return methodTaskId in FLOW_MODEL_CUSTOM;
}

export function buildCustomFlowModelSteps(
  methodTaskId: string,
  taskId: string,
  model: DirichletInferredModel,
  meta: DirichletTaskMeta,
): DiscriminatedTaskStep[] | null {
  const fn = FLOW_MODEL_CUSTOM[methodTaskId];
  return fn ? fn(taskId, model, meta) : null;
}

export function hasCustomF1Steps(methodTaskId: string): boolean {
  return methodTaskId in F1_CUSTOM;
}

export function buildCustomF1Steps(
  methodTaskId: string,
  taskId: string,
  model: DirichletInferredModel,
): DiscriminatedTaskStep[] | null {
  const fn = F1_CUSTOM[methodTaskId];
  return fn ? fn(taskId, model) : null;
}
