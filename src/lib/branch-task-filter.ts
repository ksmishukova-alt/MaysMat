import type { Task } from "@/data/tasks";
import { isArchiveVisible, isChildVisible } from "@/data/task-publishing/resolve";

/** Задачи ветки для списка на /branch/[slug] (детский режим + опционально архив) */
export function filterBranchTasksForList(
  tasks: Task[],
  options: { showArchive?: boolean; methodologyBank?: boolean },
): Task[] {
  const { showArchive = false, methodologyBank = false } = options;

  const filtered = tasks.filter((task) => {
    const pub = task.publishing;
    if (!pub) return true;
    if (isChildVisible(pub)) return true;
    if (methodologyBank && showArchive && isArchiveVisible(pub)) return true;
    return false;
  });

  return filtered.sort((a, b) => {
    const ra = a.publishing?.routeOrder ?? a.number;
    const rb = b.publishing?.routeOrder ?? b.number;
    return ra - rb;
  });
}

export function countChildVisibleTasks(tasks: Task[]): number {
  return tasks.filter((t) => t.publishing && isChildVisible(t.publishing)).length;
}

export function countArchiveTasks(tasks: Task[]): number {
  return tasks.filter((t) => t.publishing?.publishTier === "archive").length;
}
