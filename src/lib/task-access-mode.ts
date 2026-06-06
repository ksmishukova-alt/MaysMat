import type { Task } from "@/data/tasks";
import { isChildVisible } from "@/data/task-publishing/resolve";

/** Режим просмотра задачи в плеере */
export type TaskAccessMode = "child" | "methodist" | "archivePreview";

const MODE_ALIASES: Record<string, TaskAccessMode> = {
  methodist: "methodist",
  archive: "archivePreview",
  archivePreview: "archivePreview",
};

export function parseTaskAccessMode(modeParam: string | null | undefined): TaskAccessMode {
  if (!modeParam) return "child";
  return MODE_ALIASES[modeParam] ?? "child";
}

export function isMethodistMode(mode: TaskAccessMode): boolean {
  return mode === "methodist";
}

export function isArchivePreviewMode(mode: TaskAccessMode): boolean {
  return mode === "archivePreview";
}

/** Доступ к TaskPlayer: child — только isChildVisible; archive — только archive tier; methodist — всё */
export function canAccessTask(task: Task, mode: TaskAccessMode): boolean {
  const pub = task.publishing;
  if (!pub) return true;

  switch (mode) {
    case "methodist":
      return true;
    case "archivePreview":
      return pub.publishTier === "archive";
    case "child":
    default:
      return isChildVisible(pub);
  }
}

export function taskPlayHref(taskId: string, mode?: TaskAccessMode): string {
  const base = `/tasks/${taskId}`;
  if (mode === "methodist") return `${base}?mode=methodist`;
  if (mode === "archivePreview") return `${base}?mode=archive`;
  return base;
}
