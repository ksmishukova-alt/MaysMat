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

  if (task.branchId === "modeling-heads-legs") {
    return "heads-legs-guided";
  }

  if (task.branchId === "proof-dirichlet" || task.dirichletMeta) {
    return "dirichlet-guided";
  }

  return "dirichlet-guided";
}
