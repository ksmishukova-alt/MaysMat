"use client";

import type { DailySubject } from "@/lib/daily";
import { getDailyState, markDailySubjectComplete } from "@/lib/daily";
import { pickStampForTask } from "@/data/task-stamps";

const STORAGE_KEY = "album-myshleniya-progress";

export const PROGRESS_UPDATED_EVENT = "mysmat-progress-updated";

export interface CompletedTaskRecord {
  stars: number;
  completedAt: string;
  /** id смешной печати */
  stampId: string;
}

export interface ActivityEntry {
  date: string;
  minutes: number;
  kind: "task" | "daily" | "video";
  branchId?: string;
  taskId?: string;
  label: string;
  stars?: number;
  videoEvent?: "intro_watched" | "intro_skipped" | "help_video_opened";
}

export interface UserProgress {
  name: string;
  level: number;
  totalStars: number;
  streakDays: number;
  cardCharge: number;
  completedTasks: Record<string, CompletedTaskRecord>;
  branchProgress: Record<string, number>;
  daily?: import("@/lib/daily").DailyProgress;
  activityLog?: ActivityEntry[];
  /** Первый intro по ветке уже показан */
  branchIntroSeen?: Record<string, boolean>;
  /** id аватара из спрайт-листа (boy-1 … girl-8) */
  avatarId?: string;
  /** @deprecated старый персонаж — только для миграции из localStorage */
  character?: { baseId?: string };
  /** Дополнительно разблокированные аватары */
  unlockedAvatars?: string[];
  /** Активный набор щитов серии */
  streakShieldSetId?: import("@/data/streak-shield-catalog").StreakShieldSetId;
  /** Купленные наборы щитов (classic не храним — он бесплатный) */
  unlockedStreakShieldSets?: import("@/data/streak-shield-catalog").StreakShieldSetId[];
}

const DEFAULT: UserProgress = {
  name: "София",
  level: 12,
  totalStars: 782,
  streakDays: 0,
  cardCharge: 72,
  completedTasks: {},
  branchProgress: { "modeling-heads-legs": 0 },
};

/** Стартовое значение для SSR — без localStorage */
export const DEFAULT_PROGRESS: UserProgress = DEFAULT;

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  progress.level = computeLevel(progress.totalStars);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event(PROGRESS_UPDATED_EVENT));
}

/** Уровень по сумме звёзд (переход N→N+1 = 2N+1) */
export function computeLevel(totalStars: number): number {
  let level = 1;
  let accumulated = 0;
  while (accumulated + starsForLevel(level) <= totalStars) {
    accumulated += starsForLevel(level);
    level++;
  }
  return level;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function appendActivity(
  progress: UserProgress,
  entry: ActivityEntry
): void {
  if (!progress.activityLog) progress.activityLog = [];
  progress.activityLog.push(entry);
  // Храним последние ~200 записей
  if (progress.activityLog.length > 200) {
    progress.activityLog = progress.activityLog.slice(-200);
  }
}

export function getTaskCompletion(
  taskId: string,
  progress = loadProgress()
): CompletedTaskRecord | undefined {
  const rec = progress.completedTasks[taskId];
  if (!rec) return undefined;
  if (!rec.stampId) {
    return { ...rec, stampId: pickStampForTask(taskId, rec.stars).id };
  }
  return rec;
}

export function isTaskCompleted(taskId: string, progress = loadProgress()): boolean {
  return Boolean(progress.completedTasks[taskId]);
}

export function completeTask(
  taskId: string,
  branchId: string,
  stars: number,
  taskNumber: number,
  totalTasks: number,
  options?: { minutesSpent?: number; taskTitle?: string }
): UserProgress {
  const progress = loadProgress();
  const prev = progress.completedTasks[taskId];
  const isFirst = !prev;
  const stampId = prev?.stampId ?? pickStampForTask(taskId, stars).id;

  if (isFirst) {
    progress.totalStars += stars;
    progress.branchProgress[branchId] = Math.round(
      (taskNumber / totalTasks) * 100
    );
    progress.cardCharge = Math.min(100, progress.cardCharge + 8);

    const minutes = Math.max(3, options?.minutesSpent ?? 12);
    appendActivity(progress, {
      date: todayKey(),
      minutes,
      kind: "task",
      branchId,
      taskId,
      label: options?.taskTitle ?? taskId,
      stars,
    });
  } else if (stars > prev.stars) {
    progress.totalStars += stars - prev.stars;
  }

  progress.completedTasks[taskId] = {
    stars: Math.max(prev?.stars ?? 0, stars),
    completedAt: prev?.completedAt ?? new Date().toISOString(),
    stampId,
  };

  saveProgress(progress);
  return progress;
}

export function hasSeenBranchIntro(branchId: string): boolean {
  const progress = loadProgress();
  return Boolean(progress.branchIntroSeen?.[branchId]);
}

export function logVideoEvent(
  event: "intro_watched" | "intro_skipped" | "help_video_opened",
  options: { branchId?: string; taskId?: string; label: string }
): UserProgress {
  const progress = loadProgress();

  if (event === "intro_watched" || event === "intro_skipped") {
    if (options.branchId) {
      if (!progress.branchIntroSeen) progress.branchIntroSeen = {};
      progress.branchIntroSeen[options.branchId] = true;
    }
  }

  appendActivity(progress, {
    date: todayKey(),
    minutes: 0,
    kind: "video",
    branchId: options.branchId,
    taskId: options.taskId,
    label: options.label,
    videoEvent: event,
  });

  saveProgress(progress);
  return progress;
}

export function starsForLevel(level: number): number {
  return 2 * level + 1;
}

export function starsToNextLevel(totalStars: number, level: number): number {
  let accumulated = 0;
  for (let i = 1; i < level; i++) {
    accumulated += starsForLevel(i);
  }
  const nextThreshold = accumulated + starsForLevel(level);
  return Math.max(0, nextThreshold - totalStars);
}

/** Отметить daily-предмет выполненным */
export function completeDailySubject(subject: DailySubject): UserProgress {
  const progress = loadProgress();
  const updatedDaily = markDailySubjectComplete(progress.daily, subject);
  const state = getDailyState(updatedDaily);

  progress.daily = updatedDaily;
  progress.streakDays = state.streakDays;

  if (state.isTodayDailyComplete && state.todayIndex >= 0) {
    const dayStars = state.todayStarsEarned;
    const alreadyKey = `daily-${updatedDaily.today.date}`;
    if (!progress.completedTasks[alreadyKey]) {
      progress.totalStars += dayStars;
      progress.completedTasks[alreadyKey] = {
        stars: dayStars,
        completedAt: new Date().toISOString(),
        stampId: pickStampForTask(alreadyKey, Math.min(3, dayStars)).id,
      };
      appendActivity(progress, {
        date: updatedDaily.today.date,
        minutes: 15,
        kind: "daily",
        label: "Школьные задачи (Daily)",
        stars: dayStars,
      });
    }
  }

  saveProgress(progress);
  return progress;
}
