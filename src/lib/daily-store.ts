"use client";

import type { DailySubject } from "@/lib/daily";
import {
  DAILY_CONTENT,
  type DailyExercise,
  type DailyProgramWeekIndex,
  type DailySubjectPack,
  type DailyWeekdayIndex,
  type DailyWeekGrid,
} from "@/data/daily-content";
import { getSchoolDayIndex } from "@/lib/daily";

const STORAGE_KEY = "album-myshleniya-daily-store";

export interface DailySubjectOverride {
  title?: string;
  emoji?: string;
  description?: string;
  programTitle?: string;
  byWeek?: DailyWeekGrid;
  /** @deprecated */
  byWeekday?: DailySubjectPack["byWeek"][0];
}

export interface DailyStoreData {
  overrides: Partial<Record<DailySubject, DailySubjectOverride>>;
}

/** Стабильная пустая ссылка — для SSR и пустого localStorage */
export const EMPTY_DAILY_STORE: DailyStoreData = { overrides: {} };

let snapshotCache: DailyStoreData = EMPTY_DAILY_STORE;
let snapshotRaw: string | null = null;

export function readDailyStore(): DailyStoreData {
  if (typeof window === "undefined") return EMPTY_DAILY_STORE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === snapshotRaw) return snapshotCache;
    snapshotRaw = raw;
    if (!raw) {
      snapshotCache = EMPTY_DAILY_STORE;
      return snapshotCache;
    }
    const parsed = JSON.parse(raw) as DailyStoreData;
    snapshotCache = { overrides: parsed.overrides ?? {} };
    return snapshotCache;
  } catch {
    snapshotRaw = null;
    snapshotCache = EMPTY_DAILY_STORE;
    return snapshotCache;
  }
}

export function writeDailyStore(store: DailyStoreData): void {
  const raw = JSON.stringify(store);
  localStorage.setItem(STORAGE_KEY, raw);
  snapshotCache = store;
  snapshotRaw = raw;
}

function applyOverride(base: DailySubjectPack, override?: DailySubjectOverride): DailySubjectPack {
  if (!override) return base;
  return {
    ...base,
    title: override.title ?? base.title,
    emoji: override.emoji ?? base.emoji,
    description: override.description ?? base.description,
    programTitle: override.programTitle ?? base.programTitle,
    byWeek: override.byWeek ?? base.byWeek,
  };
}

export function resolveDailySubjectPack(
  subject: DailySubject,
  store = readDailyStore()
): DailySubjectPack {
  const base = DAILY_CONTENT[subject];
  return applyOverride(base, store.overrides[subject]);
}

export function resolveDailyExercises(
  subject: DailySubject,
  programWeek: DailyProgramWeekIndex,
  weekdayIndex?: DailyWeekdayIndex,
  store = readDailyStore()
): DailyExercise[] {
  const pack = resolveDailySubjectPack(subject, store);
  const dayIdx = weekdayIndex ?? getDailyDayIndex();
  const weekIdx = Math.min(5, Math.max(0, programWeek)) as DailyProgramWeekIndex;
  return pack.byWeek[weekIdx]?.[dayIdx] ?? [];
}

export function getDailyDayIndex(d = new Date()): DailyWeekdayIndex {
  const idx = getSchoolDayIndex(d);
  return (idx >= 0 ? idx : 0) as DailyWeekdayIndex;
}

export function workbookDayNumber(
  programWeek: DailyProgramWeekIndex,
  weekdayIndex: DailyWeekdayIndex
): number {
  return programWeek * 5 + weekdayIndex + 1;
}

export function saveDailySubjectOverride(
  subject: DailySubject,
  patch: DailySubjectOverride
): DailyStoreData {
  const store = readDailyStore();
  store.overrides[subject] = { ...store.overrides[subject], ...patch };
  writeDailyStore(store);
  return store;
}

export function saveDailySubjectPack(pack: DailySubjectPack): DailyStoreData {
  return saveDailySubjectOverride(pack.subject, {
    title: pack.title,
    emoji: pack.emoji,
    description: pack.description,
    programTitle: pack.programTitle,
    byWeek: pack.byWeek,
  });
}

export function resetDailySubjectOverride(subject: DailySubject): DailyStoreData {
  const store = readDailyStore();
  delete store.overrides[subject];
  writeDailyStore(store);
  return store;
}

export function hasDailyOverride(subject: DailySubject, store = readDailyStore()): boolean {
  const o = store.overrides[subject];
  return Boolean(o && Object.keys(o).length > 0);
}
