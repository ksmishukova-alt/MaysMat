import type { Task } from "@/data/tasks";
import type { TaskAccessMode } from "@/lib/task-access-mode";
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

/** Порядковый номер задачи в детском маршруте ветки (1, 2, 3…), не внутренний номер банка */
export function resolveChildRouteDisplayNumber(task: Task, branchTasks: Task[]): number {
  const listed = filterBranchTasksForList(branchTasks, {
    methodologyBank: true,
    showArchive: false,
  });
  const index = listed.findIndex((t) => t.id === task.id);
  if (index >= 0) return index + 1;
  return task.number;
}

export function countArchiveTasks(tasks: Task[]): number {
  return tasks.filter((t) => t.publishing?.publishTier === "archive").length;
}

/** Сколько задач учитывать в прогрессе ветки (детский маршрут vs режим методиста) */
export function resolveProgressTotalForBranch(
  branchId: string,
  allTasks: Task[],
  accessMode: TaskAccessMode,
): number {
  const branchTasks = allTasks.filter((t) => t.branchId === branchId);
  if (accessMode === "methodist") {
    return Math.max(1, branchTasks.length);
  }
  if (accessMode === "archivePreview") {
    const archiveCount = countArchiveTasks(branchTasks);
    return Math.max(1, archiveCount);
  }
  const childCount = countChildVisibleTasks(branchTasks);
  return Math.max(1, childCount);
}

/** «1 задача», «2 задачи», «5 задач» */
export function formatChildRouteTaskCount(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return `${n} задач`;
  if (mod10 === 1) return `${n} задача`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} задачи`;
  return `${n} задач`;
}
