"use client";

import { TASKS, type ConditionParseData, type Task, type TaskStep } from "@/data/tasks";

const STORAGE_KEY = "album-myshleniya-task-store";

export interface StoredCustomTask extends Task {
  /** ID исходной задачи при копировании */
  sourceId?: string;
  isCopy?: boolean;
}

export interface TaskOverride {
  enableGivenStep?: boolean;
  givenStep?: ConditionParseData;
  title?: string;
  condition?: string;
  stage?: number;
  maxStars?: number;
  number?: number;
  branchId?: string;
  steps?: TaskStep[];
}

export interface TaskStoreData {
  /** Копии и новые задачи со своим id */
  customTasks: Record<string, StoredCustomTask>;
  /** Правки встроенных задач из tasks.ts */
  overrides: Record<string, TaskOverride>;
}

/** Стабильная пустая ссылка — для SSR и пустого localStorage */
export const EMPTY_TASK_STORE: TaskStoreData = { customTasks: {}, overrides: {} };

let snapshotCache: TaskStoreData = EMPTY_TASK_STORE;
let snapshotRaw: string | null = null;

export function readTaskStore(): TaskStoreData {
  if (typeof window === "undefined") return EMPTY_TASK_STORE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === snapshotRaw) return snapshotCache;
    snapshotRaw = raw;
    if (!raw) {
      snapshotCache = EMPTY_TASK_STORE;
      return snapshotCache;
    }
    const parsed = JSON.parse(raw) as TaskStoreData;
    snapshotCache = {
      customTasks: parsed.customTasks ?? {},
      overrides: parsed.overrides ?? {},
    };
    return snapshotCache;
  } catch {
    snapshotRaw = null;
    snapshotCache = EMPTY_TASK_STORE;
    return snapshotCache;
  }
}

export function writeTaskStore(store: TaskStoreData): void {
  const raw = JSON.stringify(store);
  localStorage.setItem(STORAGE_KEY, raw);
  snapshotCache = store;
  snapshotRaw = raw;
}

export function isBuiltInTaskId(taskId: string): boolean {
  return taskId in TASKS;
}

export function isCustomTaskId(taskId: string): boolean {
  return Boolean(readTaskStore().customTasks[taskId]);
}

function applyOverride(base: Task, override?: TaskOverride): Task {
  if (!override) return base;
  return {
    ...base,
    ...override,
    steps: override.steps ?? base.steps,
    givenStep: override.givenStep ?? base.givenStep,
  };
}

/** Задача как в коде или undefined */
export function getBuiltInTask(id: string): Task | undefined {
  return TASKS[id];
}

/** Итоговая задача: встроенная + override или custom */
export function resolveTask(id: string, store = readTaskStore()): Task | undefined {
  const custom = store.customTasks[id];
  if (custom) return custom;

  const builtIn = TASKS[id];
  if (!builtIn) return undefined;

  return applyOverride(builtIn, store.overrides[id]);
}

export function getAllResolvedTasks(store = readTaskStore()): Task[] {
  const ids = new Set([...Object.keys(TASKS), ...Object.keys(store.customTasks)]);
  const tasks: Task[] = [];
  for (const id of ids) {
    const task = resolveTask(id, store);
    if (task) tasks.push(task);
  }
  return tasks;
}

export function getTasksForBranch(branchId: string, store = readTaskStore()): Task[] {
  return getAllResolvedTasks(store)
    .filter((t) => t.branchId === branchId)
    .sort((a, b) => a.number - b.number || a.title.localeCompare(b.title));
}

export function getTaskModeratorSettings(task: Task, store = readTaskStore()) {
  const override = store.overrides[task.id];
  const custom = store.customTasks[task.id];

  if (custom) {
    return {
      enableGivenStep: custom.enableGivenStep ?? false,
      givenStep: custom.givenStep,
    };
  }

  return {
    enableGivenStep: override?.enableGivenStep ?? task.enableGivenStep ?? false,
    givenStep: override?.givenStep ?? task.givenStep,
  };
}

export function setTaskOverride(taskId: string, patch: TaskOverride): TaskStoreData {
  const store = readTaskStore();
  if (store.customTasks[taskId]) {
    store.customTasks[taskId] = { ...store.customTasks[taskId], ...patch };
  } else {
    store.overrides[taskId] = { ...store.overrides[taskId], ...patch };
  }
  writeTaskStore(store);
  return store;
}

export function saveCustomTask(task: StoredCustomTask): TaskStoreData {
  const store = readTaskStore();
  store.customTasks[task.id] = task;
  writeTaskStore(store);
  return store;
}

export function saveResolvedTask(task: Task): TaskStoreData {
  if (isBuiltInTaskId(task.id) && !readTaskStore().customTasks[task.id]) {
    const { id, branchId, number, title, condition, stage, maxStars, enableGivenStep, givenStep, steps } =
      task;
    return setTaskOverride(task.id, {
      title,
      condition,
      stage,
      maxStars,
      number,
      branchId,
      enableGivenStep,
      givenStep,
      steps,
    });
  }
  return saveCustomTask({ ...task, isCopy: task.id.includes("-copy-") || undefined });
}

export function deleteCustomTask(taskId: string): TaskStoreData {
  const store = readTaskStore();
  delete store.customTasks[taskId];
  writeTaskStore(store);
  return store;
}

export function resetTaskOverride(taskId: string): TaskStoreData {
  const store = readTaskStore();
  delete store.overrides[taskId];
  writeTaskStore(store);
  return store;
}

export function cloneTask(source: Task): StoredCustomTask {
  const copy = structuredClone(source) as StoredCustomTask;
  copy.id = generateCopyId(source.id);
  copy.title = `${source.title} (копия)`;
  copy.sourceId = source.id;
  copy.isCopy = true;

  const branchTasks = getTasksForBranch(source.branchId);
  const maxNumber = branchTasks.reduce((max, t) => Math.max(max, t.number), 0);
  copy.number = maxNumber + 1;

  copy.steps = copy.steps.map((step, index) => ({
    ...step,
    id: `${copy.id}-step-${index + 1}`,
  }));

  return copy;
}

export function copyTask(sourceId: string): StoredCustomTask | undefined {
  const source = resolveTask(sourceId);
  if (!source) return undefined;
  const copy = cloneTask(source);
  saveCustomTask(copy);
  return copy;
}

function generateCopyId(sourceId: string): string {
  const base = sourceId.replace(/-copy-[a-z0-9]+$/i, "");
  let attempt = 0;
  while (attempt < 20) {
    const suffix = `${Date.now().toString(36)}${attempt > 0 ? `-${attempt}` : ""}`;
    const id = `${base}-copy-${suffix}`;
    if (!TASKS[id] && !readTaskStore().customTasks[id]) return id;
    attempt++;
  }
  return `${base}-copy-${crypto.randomUUID().slice(0, 8)}`;
}

export function hasOverride(taskId: string, store = readTaskStore()): boolean {
  return Boolean(store.overrides[taskId] && Object.keys(store.overrides[taskId]).length > 0);
}

export function getTaskEditSource(taskId: string, store = readTaskStore()): {
  task: Task;
  mode: "builtin" | "custom" | "missing";
  hasOverride: boolean;
} | undefined {
  const custom = store.customTasks[taskId];
  if (custom) {
    return { task: custom, mode: "custom", hasOverride: false };
  }

  const builtIn = TASKS[taskId];
  if (!builtIn) return undefined;

  const override = store.overrides[taskId];
  return {
    task: applyOverride(builtIn, override),
    mode: "builtin",
    hasOverride: Boolean(override && Object.keys(override).length > 0),
  };
}

/** @deprecated используйте task-store */
export { getTaskModeratorSettings as getModeratorSettingsFromStore };
