"use client";

import type { SkillLevel } from "@/data/archipelago";
import type { UserProgress } from "@/lib/progress";

const STORAGE_KEY = "album-myshleniya-archipelago";

export const ARCHIPELAGO_UPDATED_EVENT = "archipelago-updated";

export interface IslandProgressRecord {
  /** Явно выставленный уровень навыка (0–3) */
  skillLevel: SkillLevel;
  /** Пройдено станций из 7 (0 = ни одной) */
  stationsCompleted: number;
  /** Уже показали анимацию всплывания на карте */
  surfaceSeen: boolean;
}

export interface ArchipelagoProgressData {
  islands: Record<string, IslandProgressRecord>;
}

function emptyRecord(): IslandProgressRecord {
  return { skillLevel: 0, stationsCompleted: 0, surfaceSeen: false };
}

export function defaultArchipelagoProgress(): ArchipelagoProgressData {
  return { islands: {} };
}

let cache: ArchipelagoProgressData | null = null;
let cacheRaw: string | null | undefined;

export function readArchipelagoProgress(): ArchipelagoProgressData {
  if (typeof window === "undefined") return defaultArchipelagoProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cacheRaw && cache) return cache;
    cacheRaw = raw;
    if (!raw) {
      cache = defaultArchipelagoProgress();
      return cache;
    }
    cache = JSON.parse(raw) as ArchipelagoProgressData;
    if (!cache.islands) cache.islands = {};
    return cache;
  } catch {
    cacheRaw = null;
    cache = defaultArchipelagoProgress();
    return cache;
  }
}

export function writeArchipelagoProgress(data: ArchipelagoProgressData): void {
  const raw = JSON.stringify(data);
  localStorage.setItem(STORAGE_KEY, raw);
  cache = data;
  cacheRaw = raw;
  window.dispatchEvent(new Event(ARCHIPELAGO_UPDATED_EVENT));
}

export function getIslandRecord(
  islandId: string,
  data = readArchipelagoProgress()
): IslandProgressRecord {
  return data.islands[islandId] ?? emptyRecord();
}

/** Оценка навыка по прогрессу веток (пока нет отдельной диагностики) */
export function inferSkillFromBranches(
  branchIds: readonly string[] | undefined,
  progress: UserProgress
): SkillLevel {
  if (!branchIds?.length) return 0;
  const values = branchIds.map((id) => progress.branchProgress[id] ?? 0);
  const max = Math.max(...values);
  if (max >= 100) return 3;
  if (max >= 50) return 2;
  if (max > 0) return 1;
  return 0;
}

export function effectiveSkillLevel(
  islandId: string,
  branchIds: readonly string[] | undefined,
  userProgress: UserProgress,
  data = readArchipelagoProgress()
): SkillLevel {
  const stored = getIslandRecord(islandId, data).skillLevel;
  let inferred = inferSkillFromBranches(branchIds, userProgress);

  // Причал: если уже есть прогресс в МышМат — база пройдена
  if (islandId === "gear-check") {
    const anyBranch = Object.values(userProgress.branchProgress).some((v) => v > 0);
    if (anyBranch) inferred = Math.max(inferred, 2) as SkillLevel;
  }

  return Math.max(stored, inferred) as SkillLevel;
}

export function setIslandSkillLevel(islandId: string, level: SkillLevel): ArchipelagoProgressData {
  const data = readArchipelagoProgress();
  const rec = getIslandRecord(islandId, data);
  data.islands[islandId] = { ...rec, skillLevel: level };
  writeArchipelagoProgress(data);
  return data;
}

export function completeIslandStation(islandId: string): ArchipelagoProgressData {
  const data = readArchipelagoProgress();
  const rec = getIslandRecord(islandId, data);
  const next = Math.min(7, rec.stationsCompleted + 1);
  data.islands[islandId] = { ...rec, stationsCompleted: next };
  writeArchipelagoProgress(data);
  return data;
}

export function markIslandSurfaceSeen(islandId: string): void {
  const data = readArchipelagoProgress();
  const rec = getIslandRecord(islandId, data);
  if (rec.surfaceSeen) return;
  data.islands[islandId] = { ...rec, surfaceSeen: true };
  writeArchipelagoProgress(data);
}
