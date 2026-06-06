import type { Task } from "@/data/tasks";
import type { TaskRunnerKind } from "@/data/runner-kind";

/** Единое место выбора task-runner */
export function resolveRunnerKind(task: Task): TaskRunnerKind {
  if (task.runnerKind) {
    return task.runnerKind;
  }

  if (task.requiresUpload) {
    return task.branchId === "proof-constructions" ? "paper-construction" : "paper-generic";
  }

  const flowId = task.dirichletMeta?.flowId;

  if (task.branchId === "proof-unlucky" || flowId === "F3_UNLUCKY") {
    return "dirichlet-unlucky";
  }

  if (task.branchId === "arith-remainders" || flowId === "F4_REMAINDERS") {
    return "dirichlet-remainders";
  }

  if (task.branchId === "modeling-heads-legs" || task.headsLegsMeta) {
    return "heads-legs-guided";
  }

  if (task.branchId === "proof-dirichlet" || task.dirichletMeta) {
    return "dirichlet-guided";
  }

  /** Задачи с inline-шагами без отдельного runner (напр. fairy-caves) */
  if (task.steps.length > 0) {
    return "dirichlet-guided";
  }

  return "unsupported";
}
