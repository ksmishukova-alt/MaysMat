"use client";

import { useSyncExternalStore } from "react";
import type { DailySubject } from "@/lib/daily";
import type { DailyProgramWeekIndex, DailyWeekdayIndex } from "@/data/daily-content";
import {
  EMPTY_DAILY_STORE,
  resolveDailyExercises,
  resolveDailySubjectPack,
  type DailyStoreData,
} from "@/lib/daily-store";

const STORAGE_KEY = "album-myshleniya-daily-store";

/** Кэш только для React — getSnapshot не должен каждый раз создавать новый объект */
let snapshotCache: DailyStoreData = EMPTY_DAILY_STORE;
let snapshotRaw: string | null | undefined;

function rebuildSnapshot(): DailyStoreData {
  if (typeof window === "undefined") return EMPTY_DAILY_STORE;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === snapshotRaw) return snapshotCache;

  snapshotRaw = raw;
  if (!raw) {
    snapshotCache = EMPTY_DAILY_STORE;
    return snapshotCache;
  }

  try {
    const parsed = JSON.parse(raw) as DailyStoreData;
    const overrides = parsed.overrides ?? {};
    if (Object.keys(overrides).length === 0) {
      snapshotCache = EMPTY_DAILY_STORE;
      return snapshotCache;
    }
    const nextJson = JSON.stringify(overrides);
    const prevJson = JSON.stringify(snapshotCache.overrides);
    if (nextJson === prevJson) return snapshotCache;
    snapshotCache = { overrides };
    return snapshotCache;
  } catch {
    snapshotRaw = null;
    snapshotCache = EMPTY_DAILY_STORE;
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
  window.addEventListener("daily-store-updated", onStoreUpdated);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("daily-store-updated", onStoreUpdated);
  };
}

export function notifyDailyStoreUpdated(): void {
  window.dispatchEvent(new Event("daily-store-updated"));
}

function getSnapshot(): DailyStoreData {
  return rebuildSnapshot();
}

export function useDailyStore(): DailyStoreData {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_DAILY_STORE);
}

export function useDailySubjectPack(subject: DailySubject) {
  const store = useDailyStore();
  return resolveDailySubjectPack(subject, store);
}

export function useDailyExercises(
  subject: DailySubject,
  programWeek: DailyProgramWeekIndex,
  weekdayIndex?: DailyWeekdayIndex
) {
  const store = useDailyStore();
  return resolveDailyExercises(subject, programWeek, weekdayIndex, store);
}
