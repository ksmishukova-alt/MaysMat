"use client";

import { getAllBranches } from "@/data/thinking-map";
import { TASKS, type Task } from "@/data/tasks";
import { resolveTask } from "@/lib/task-store";
import type { UserProgress } from "@/lib/progress";

const STORAGE_KEY = "album-myshleniya-child-path";

export const CHILD_PATH_UPDATED_EVENT = "child-path-updated";

export type PathItemKind = "branch" | "task";

export interface PathItem {
  kind: PathItemKind;
  id: string;
}

export interface ChildPathConfig {
  /** Заголовок, напр. «Неделя 1» */
  title: string;
  note?: string;
  items: PathItem[];
  updatedAt?: string;
}

export interface ChildPathStore {
  /** Ключ — имя ребёнка из профиля */
  byChild: Record<string, ChildPathConfig>;
}

function emptyStore(): ChildPathStore {
  return { byChild: {} };
}

let cache: ChildPathStore | null = null;
let cacheRaw: string | null | undefined;

export function readChildPathStore(): ChildPathStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cacheRaw && cache) return cache;
    cacheRaw = raw;
    if (!raw) {
      cache = emptyStore();
      return cache;
    }
    const parsed = JSON.parse(raw) as ChildPathStore;
    cache = { byChild: parsed.byChild ?? {} };
    return cache;
  } catch {
    cacheRaw = null;
    cache = emptyStore();
    return cache;
  }
}

export function writeChildPathStore(store: ChildPathStore): void {
  const raw = JSON.stringify(store);
  localStorage.setItem(STORAGE_KEY, raw);
  cache = store;
  cacheRaw = raw;
  window.dispatchEvent(new Event(CHILD_PATH_UPDATED_EVENT));
}

export function getChildPath(childName: string): ChildPathConfig | null {
  const cfg = readChildPathStore().byChild[childName.trim()];
  if (!cfg?.items?.length) return null;
  return cfg;
}

export function saveChildPath(childName: string, config: ChildPathConfig): void {
  const store = readChildPathStore();
  store.byChild[childName.trim()] = {
    ...config,
    updatedAt: new Date().toISOString(),
  };
  writeChildPathStore(store);
}

export interface ResolvedPathEntry {
  item: PathItem;
  title: string;
  subtitle?: string;
  href?: string;
  progress?: number;
  available: boolean;
  completed?: boolean;
  stars?: number;
  stampId?: string;
}

export function resolvePathItem(
  item: PathItem,
  progress: Pick<UserProgress, "branchProgress" | "completedTasks">
): ResolvedPathEntry {
  if (item.kind === "branch") {
    const branch = getAllBranches().find((b) => b.id === item.id);
    if (!branch) {
      return { item, title: item.id, available: false };
    }
    const playable = branch.taskCount > 0;
    return {
      item,
      title: branch.title,
      subtitle: playable ? `${branch.taskCount} задач` : "скоро",
      href: playable ? `/branch/${branch.slug}` : undefined,
      progress: progress.branchProgress[branch.id] ?? 0,
      available: playable,
    };
  }

  const task = resolveTask(item.id) ?? (TASKS[item.id] as Task | undefined);
  if (!task) {
    return { item, title: item.id, available: false };
  }
  const completion = progress.completedTasks[item.id];
  return {
    item,
    title: `Задача ${task.number}. ${task.title}`,
    subtitle: task.branchId,
    href: `/tasks/${task.id}`,
    available: true,
    completed: Boolean(completion),
    stars: completion?.stars,
    stampId: completion?.stampId,
  };
}

export function resolveChildPath(
  childName: string,
  progress: Pick<UserProgress, "branchProgress" | "completedTasks">
): { config: ChildPathConfig; entries: ResolvedPathEntry[] } | null {
  const config = getChildPath(childName);
  if (!config) return null;
  return {
    config,
    entries: config.items.map((item) => resolvePathItem(item, progress)),
  };
}

export function listKnownChildren(): string[] {
  return Object.keys(readChildPathStore().byChild);
}
