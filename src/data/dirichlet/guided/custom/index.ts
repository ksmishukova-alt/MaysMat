import type { DiscriminatedTaskStep } from "@/data/task-steps";

import type { DirichletInferredModel } from "../../types";

import { buildStepsM01 } from "./steps-m0-1";

const F1_CUSTOM: Record<
  string,
  (taskId: string, model: DirichletInferredModel) => DiscriminatedTaskStep[]
> = {
  "M0.1": buildStepsM01,
};

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
