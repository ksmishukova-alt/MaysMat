"use client";

import {
  DEFAULT_STREAK_SHIELD_SET,
  getStreakShieldSet,
  type StreakShieldSetId,
} from "@/data/streak-shield-catalog";
import { loadProgress, saveProgress, type UserProgress } from "@/lib/progress";

export const STREAK_SHIELD_UPDATED_EVENT = "mysmat-streak-shield-updated";

export function getEquippedStreakShieldSet(
  progress?: UserProgress | null,
): StreakShieldSetId {
  const id = progress?.streakShieldSetId ?? DEFAULT_STREAK_SHIELD_SET;
  return getStreakShieldSet(id) ? id : DEFAULT_STREAK_SHIELD_SET;
}

export function isStreakShieldSetUnlocked(
  setId: StreakShieldSetId,
  progress?: UserProgress | null,
): boolean {
  const def = getStreakShieldSet(setId);
  if (!def) return false;
  if (def.free) return true;
  return progress?.unlockedStreakShieldSets?.includes(setId) ?? false;
}

export function purchaseStreakShieldSet(setId: StreakShieldSetId): UserProgress {
  const progress = loadProgress();
  const def = getStreakShieldSet(setId);
  if (!def || def.free || isStreakShieldSetUnlocked(setId, progress)) {
    return progress;
  }
  if (progress.totalStars < def.starPrice) return progress;

  progress.totalStars -= def.starPrice;
  if (!progress.unlockedStreakShieldSets) progress.unlockedStreakShieldSets = [];
  if (!progress.unlockedStreakShieldSets.includes(setId)) {
    progress.unlockedStreakShieldSets.push(setId);
  }
  progress.streakShieldSetId = setId;
  saveProgress(progress);
  window.dispatchEvent(new Event(STREAK_SHIELD_UPDATED_EVENT));
  return progress;
}

export function equipStreakShieldSet(setId: StreakShieldSetId): UserProgress {
  const progress = loadProgress();
  if (!isStreakShieldSetUnlocked(setId, progress)) return progress;
  progress.streakShieldSetId = setId;
  saveProgress(progress);
  window.dispatchEvent(new Event(STREAK_SHIELD_UPDATED_EVENT));
  return progress;
}
