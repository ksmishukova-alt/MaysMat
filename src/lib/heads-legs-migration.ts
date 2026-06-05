"use client";

import { loadProgress, saveProgress, completeTask, PROGRESS_UPDATED_EVENT } from "@/lib/progress";
import { clearPaperSubmission, listPendingPaperTasks } from "@/lib/paper-task-review";

const MIGRATION_KEY = "album-myshleniya-heads-legs-v2-migrated";
const OLD_ID_PATTERN = /^heads-legs-\d{2}$/;

/** Однократный сброс старых heads-legs-01…16 и прогресса ветки. Возвращает true, если был сброс. */
export function migrateHeadsLegsBranch(): boolean {
  if (typeof window === "undefined") return false;
  if (localStorage.getItem(MIGRATION_KEY) === "1") return false;

  const progress = loadProgress();
  let changed = false;

  for (const taskId of Object.keys(progress.completedTasks)) {
    if (OLD_ID_PATTERN.test(taskId)) {
      delete progress.completedTasks[taskId];
      changed = true;
    }
  }

  if (progress.branchProgress["modeling-heads-legs"] != null) {
    progress.branchProgress["modeling-heads-legs"] = 0;
    changed = true;
  }

  if (changed) saveProgress(progress);

  localStorage.setItem(MIGRATION_KEY, "1");
  if (changed) localStorage.setItem("album-myshleniya-heads-legs-banner", "1");
  window.dispatchEvent(new Event(PROGRESS_UPDATED_EVENT));
  return changed;
}

/** Подтверждение бумажной задачи → completedTasks + звёзды */
export function approvePaperTaskCompletion(
  taskId: string,
  branchId: string,
  taskNumber: number,
  totalTasks: number,
  stars: number,
  taskTitle: string,
): void {
  completeTask(taskId, branchId, stars, taskNumber, totalTasks, {
    minutesSpent: 15,
    taskTitle,
  });
  clearPaperSubmission(taskId);
}

export function getPendingPaperCount(): number {
  return listPendingPaperTasks().length;
}
