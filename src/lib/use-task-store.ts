"use client";

import { useSyncExternalStore } from "react";
import {
  EMPTY_TASK_STORE,
  getAllResolvedTasks,
  getTasksForBranch,
  resolveTask,
  type TaskStoreData,
} from "@/lib/task-store";
import type { Task } from "@/data/tasks";

const STORAGE_KEY = "album-myshleniya-task-store";

let snapshotCache: TaskStoreData = EMPTY_TASK_STORE;
let snapshotRaw: string | null | undefined;

function rebuildSnapshot(): TaskStoreData {
  if (typeof window === "undefined") return EMPTY_TASK_STORE;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === snapshotRaw) return snapshotCache;

  snapshotRaw = raw;
  if (!raw) {
    snapshotCache = EMPTY_TASK_STORE;
    return snapshotCache;
  }

  try {
    const parsed = JSON.parse(raw) as TaskStoreData;
    const customTasks = parsed.customTasks ?? {};
    const overrides = parsed.overrides ?? {};
    const nextJson = JSON.stringify({ customTasks, overrides });
    const prevJson = JSON.stringify({
      customTasks: snapshotCache.customTasks,
      overrides: snapshotCache.overrides,
    });
    if (nextJson === prevJson) return snapshotCache;
    if (Object.keys(customTasks).length === 0 && Object.keys(overrides).length === 0) {
      snapshotCache = EMPTY_TASK_STORE;
    } else {
      snapshotCache = { customTasks, overrides };
    }
    return snapshotCache;
  } catch {
    snapshotRaw = null;
    snapshotCache = EMPTY_TASK_STORE;
    return snapshotCache;
  }
}

function subscribe(callback: () => void) {
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) callback();
  };
  const onStoreUpdated = () => {
    snapshotRaw = undefined;
    callback();
  };

  window.addEventListener("storage", handler);
  window.addEventListener("task-store-updated", onStoreUpdated);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("task-store-updated", onStoreUpdated);
  };
}

export function notifyTaskStoreUpdated(): void {
  window.dispatchEvent(new Event("task-store-updated"));
}

function getSnapshot(): TaskStoreData {
  return rebuildSnapshot();
}

export function useTaskStore(): TaskStoreData {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_TASK_STORE);
}

export function useResolvedTask(taskId: string): Task | undefined {
  const store = useTaskStore();
  return resolveTask(taskId, store);
}

export function useResolvedTasksForBranch(branchId: string): Task[] {
  const store = useTaskStore();
  return getTasksForBranch(branchId, store);
}

export function useAllResolvedTasks(): Task[] {
  const store = useTaskStore();
  return getAllResolvedTasks(store);
}
