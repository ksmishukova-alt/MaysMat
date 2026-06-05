import type { DiscriminatedTaskStep } from "@/data/task-steps";
import type { Task } from "@/data/tasks";

import { getThemeBranchConfig } from "@/data/methodology-bank/theme-branches";

import { DIRICHLET_ANSWERS } from "./answers.generated";
import { buildDirichletGuidedSteps } from "./build-steps";
import { DIRICHLET_CATALOG } from "./catalog.generated";
import { resolveIndependenceLevel } from "./guided/support-level";
import { DIRICHLET_HINTS } from "./hints.generated";
import { DIRICHLET_SOLUTION_LINES } from "./solution-lines.generated";
import type { DirichletCatalogEntry, DirichletTaskMeta } from "./types";

function defaultIndependence(meta: DirichletCatalogEntry): 1 | 2 | 3 | 4 | 5 {
  return resolveIndependenceLevel({
    ...meta,
    acceptedAnswers: { kind: "proof", solutionReference: "" },
    solutionLines: [],
    hintLevels: ["", "", ""],
  });
}

export function catalogEntryToMeta(entry: DirichletCatalogEntry): DirichletTaskMeta {
  return {
    ...entry,
    acceptedAnswers: DIRICHLET_ANSWERS[entry.methodTaskId] ?? {
      kind: "proof",
      solutionReference: "См. методичку.",
    },
    solutionLines: DIRICHLET_SOLUTION_LINES[entry.methodTaskId] ?? [],
    hintLevels: DIRICHLET_HINTS[entry.methodTaskId] ?? [
      "Найди «клетки» и «предметы».",
      "Сравни их количества.",
      "Сформулируй вывод.",
    ],
  };
}

export function buildDirichletTask(meta: DirichletTaskMeta): Task {
  const steps: DiscriminatedTaskStep[] = buildDirichletGuidedSteps(meta);
  const branchCfg = getThemeBranchConfig(meta.themeId);

  return {
    id: meta.id,
    branchId: meta.branchId,
    number: meta.number,
    title: meta.title,
    condition: meta.condition,
    stage: meta.stage,
    maxStars: 3,
    independenceLevel: defaultIndependence(meta),
    requiresUpload: false,
    skillWeights: branchCfg?.skillWeights ?? { proof: 0.75, logic: 0.25 },
    enableGivenStep: false,
    steps,
    dirichletMeta: meta,
  };
}

export function buildAllDirichletTasks(): Record<string, Task> {
  const out: Record<string, Task> = {};
  for (const entry of DIRICHLET_CATALOG) {
    const task = buildDirichletTask(catalogEntryToMeta(entry));
    out[task.id] = task;
  }
  return out;
}

export const DIRICHLET_TASKS = buildAllDirichletTasks();
export const DIRICHLET_TASK_LIST = DIRICHLET_CATALOG.map((e) => e.id);

/** Задачи по веткам methodology-bank */
export function getMethodologyBankTasksForBranch(branchId: string): string[] {
  return DIRICHLET_CATALOG.filter((e) => e.branchId === branchId).map((e) => e.id);
}

export function countMethodologyBankTasksByBranch(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const entry of DIRICHLET_CATALOG) {
    out[entry.branchId] = (out[entry.branchId] ?? 0) + 1;
  }
  return out;
}

export function getFirstTaskIdForBranch(branchId: string): string | undefined {
  return DIRICHLET_CATALOG.find((e) => e.branchId === branchId)?.id;
}
