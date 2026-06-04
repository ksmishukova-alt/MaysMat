"use client";

import { DEFAULT_AVATAR_ID, getAvatarDef, isFreeAvatar, type AvatarGender } from "@/data/avatar-catalog";
import { loadProgress, saveProgress, type UserProgress } from "@/lib/progress";

export const AVATAR_UPDATED_EVENT = "mysmat-avatar-updated";

/** id аватара из спрайт-листа (boy-1 … girl-8) */
export function getAvatarId(progress?: UserProgress | null): string {
  if (progress?.avatarId) return progress.avatarId;

  const legacy = progress?.character;
  if (legacy?.baseId?.includes("boy")) return "boy-1";

  return DEFAULT_AVATAR_ID;
}

/** Пол текущего аватара (для статусов и подписей) */
export function getAvatarGender(progress?: UserProgress | null): AvatarGender {
  const def = getAvatarDef(getAvatarId(progress));
  return def?.gender ?? "girl";
}

export function isAvatarUnlocked(
  avatarId: string,
  progress?: UserProgress | null,
): boolean {
  if (isFreeAvatar(avatarId)) return true;
  return progress?.unlockedAvatars?.includes(avatarId) ?? false;
}

export function setAvatarId(avatarId: string): UserProgress {
  const progress = loadProgress();
  if (!isAvatarUnlocked(avatarId, progress)) return progress;

  progress.avatarId = avatarId;
  saveProgress(progress);
  window.dispatchEvent(new Event(AVATAR_UPDATED_EVENT));
  return progress;
}
