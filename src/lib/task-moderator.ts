"use client";

export {
  getTaskModeratorSettings,
  readTaskStore as readModeratorStore,
  setTaskOverride as setTaskModeratorOverride,
  type TaskOverride as TaskModeratorOverride,
  type TaskStoreData as TaskModeratorStore,
} from "@/lib/task-store";

// Совместимость: раньше был отдельный ключ localStorage
import { readTaskStore, setTaskOverride, writeTaskStore, type TaskOverride } from "@/lib/task-store";

const LEGACY_KEY = "album-myshleniya-task-moderator";

export function migrateLegacyModeratorStore(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return;
    const legacy = JSON.parse(raw) as Record<string, { enableGivenStep?: boolean; givenStep?: unknown }>;
    const store = readTaskStore();
    let changed = false;
    for (const [taskId, patch] of Object.entries(legacy)) {
      if (!store.overrides[taskId]) {
        store.overrides[taskId] = patch as TaskOverride;
        changed = true;
      }
    }
    if (changed) writeTaskStore(store);
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    /* ignore */
  }
}

export function setTaskModeratorOverrideLegacy(
  taskId: string,
  patch: { enableGivenStep?: boolean; givenStep?: import("@/data/tasks").ConditionParseData }
) {
  migrateLegacyModeratorStore();
  return setTaskOverride(taskId, patch);
}
