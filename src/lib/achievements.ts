import type { AchievementId } from "@/data/achievements";
import { ACHIEVEMENTS } from "@/data/achievements";
import type { UserProgress } from "@/lib/progress";
import { loadProgress, saveProgress, PROGRESS_UPDATED_EVENT } from "@/lib/progress";

const UNLOCKS_KEY = "album-myshleniya-achievements";

export interface UnlockedAchievement {
  id: AchievementId;
  unlockedAt: string;
}

function readUnlocks(): UnlockedAchievement[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(UNLOCKS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as UnlockedAchievement[];
  } catch {
    return [];
  }
}

function writeUnlocks(list: UnlockedAchievement[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(UNLOCKS_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(PROGRESS_UPDATED_EVENT));
}

export function getUnlockedAchievements(): UnlockedAchievement[] {
  return readUnlocks();
}

export function isAchievementUnlocked(id: AchievementId): boolean {
  return readUnlocks().some((u) => u.id === id);
}

export function unlockAchievement(id: AchievementId): boolean {
  if (isAchievementUnlocked(id)) return false;
  writeUnlocks([...readUnlocks(), { id, unlockedAt: new Date().toISOString() }]);
  return true;
}

function countHeadsLegsTasks(progress: UserProgress): number {
  return Object.keys(progress.completedTasks).filter((k) => k.startsWith("heads-legs-")).length;
}

function hasDailyComplete(progress: UserProgress): boolean {
  return Object.keys(progress.completedTasks).some((k) => k.startsWith("daily-"));
}

/** Проверить прогресс и разблокировать новые ачивки */
export function evaluateAchievements(progress = loadProgress()): AchievementId[] {
  const newly: AchievementId[] = [];

  const tryUnlock = (id: AchievementId, condition: boolean) => {
    if (condition && unlockAchievement(id)) newly.push(id);
  };

  const taskCount = Object.keys(progress.completedTasks).filter(
    (k) => !k.startsWith("daily-"),
  ).length;

  tryUnlock("first_task", taskCount >= 1);
  tryUnlock("first_daily", hasDailyComplete(progress));
  tryUnlock("stars_25", progress.totalStars >= 25);
  tryUnlock("stars_100", progress.totalStars >= 100);
  tryUnlock("level_5", progress.level >= 5);
  tryUnlock("streak_3", progress.streakDays >= 3);
  tryUnlock("streak_7", progress.streakDays >= 7);
  tryUnlock("heads_legs_5", countHeadsLegsTasks(progress) >= 5);

  const threeStar = Object.values(progress.completedTasks).some((r) => r.stars >= 3);
  tryUnlock("help_free_task", threeStar);

  return newly;
}

export function unlockPaperSolutionAchievement(): void {
  unlockAchievement("paper_solution");
}

export interface AchievementViewModel {
  id: AchievementId;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: string;
  secret?: boolean;
}

export function getAchievementList(): AchievementViewModel[] {
  const unlocks = readUnlocks();
  const byId = new Map(unlocks.map((u) => [u.id, u.unlockedAt]));

  return ACHIEVEMENTS.map((def) => {
    const unlockedAt = byId.get(def.id);
    const unlocked = Boolean(unlockedAt);
    return {
      id: def.id,
      title: def.secret && !unlocked ? "???" : def.title,
      description: def.secret && !unlocked ? "Секретное достижение" : def.description,
      emoji: def.secret && !unlocked ? "🔒" : def.emoji,
      unlocked,
      unlockedAt,
      secret: def.secret,
    };
  });
}
