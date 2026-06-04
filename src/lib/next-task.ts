import { getAdventureForBranch, getBranchMeta } from "@/data/branch-meta";
import { getBranchById } from "@/data/thinking-map";
import type { Task } from "@/data/tasks";
import { resolveChildPath } from "@/lib/child-path";
import { isTaskCompleted, type UserProgress } from "@/lib/progress";
import { getTasksForBranch, readTaskStore, resolveTask } from "@/lib/task-store";

const DEFAULT_BRANCH_ID = "modeling-heads-legs";

export interface NextPlayableTask {
  href: string;
  taskId: string;
  taskNumber: number;
  taskTitle: string;
  branchId: string;
  branchTitle: string;
  adventureEmoji: string;
  adventureTitle: string;
  microSkill?: string;
}

function buildNext(task: Task): NextPlayableTask {
  const branch = getBranchById(task.branchId);
  const adventure = getAdventureForBranch(task.branchId);
  const meta = getBranchMeta(task.branchId);

  return {
    href: `/tasks/${task.id}`,
    taskId: task.id,
    taskNumber: task.number,
    taskTitle: task.title,
    branchId: task.branchId,
    branchTitle: branch?.title ?? task.branchId,
    adventureEmoji: adventure?.emoji ?? "🐭",
    adventureTitle: adventure?.title ?? "МышМат",
    microSkill: meta?.microSkill,
  };
}

function nextInBranch(branchId: string, progress: UserProgress): NextPlayableTask | null {
  const branch = getBranchById(branchId);
  if (!branch || branch.taskCount === 0) return null;

  const store = readTaskStore();
  const tasks = getTasksForBranch(branchId, store);
  for (const task of tasks) {
    if (!isTaskCompleted(task.id, progress)) {
      return buildNext(task);
    }
  }
  return null;
}

/** Первая нерешённая задача по маршруту ребёнка или в теме по умолчанию */
export function getNextPlayableTask(progress: UserProgress): NextPlayableTask | null {
  const path = resolveChildPath(progress.name, progress);

  if (path) {
    for (const entry of path.entries) {
      if (!entry.available) continue;

      if (entry.item.kind === "task") {
        if (!entry.completed) {
          const task = resolveTask(entry.item.id);
          if (task) return buildNext(task);
        }
        continue;
      }

      const fromBranch = nextInBranch(entry.item.id, progress);
      if (fromBranch) return fromBranch;
    }
    return null;
  }

  return nextInBranch(DEFAULT_BRANCH_ID, progress);
}
