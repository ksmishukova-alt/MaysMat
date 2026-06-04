import { getStampById } from "@/data/task-stamps";
import type { UserProgress } from "@/lib/progress";

export interface ProfileStatRow {
  label: string;
  value: string | number;
}

export interface ProfileAchievementBadge {
  stampId: string;
  emoji: string;
  title: string;
}

export function getProfileStats(progress: UserProgress): ProfileStatRow[] {
  const completedCount = Object.keys(progress.completedTasks).length;
  const uniqueDays = new Set(
    (progress.activityLog ?? []).map((e) => e.date),
  ).size;

  return [
    { label: "Дней на платформе", value: uniqueDays || (completedCount > 0 ? 1 : 0) },
    { label: "Решено задач", value: completedCount },
    { label: "Звёзд собрано", value: progress.totalStars },
    { label: "Серия дней", value: progress.streakDays },
  ];
}

/** Последние уникальные печати за задачи */
export function getRecentAchievementBadges(
  progress: UserProgress,
  limit = 6,
): ProfileAchievementBadge[] {
  const entries = Object.entries(progress.completedTasks)
    .sort(([, a], [, b]) => b.completedAt.localeCompare(a.completedAt));

  const seen = new Set<string>();
  const badges: ProfileAchievementBadge[] = [];

  for (const [, rec] of entries) {
    if (!rec.stampId || seen.has(rec.stampId)) continue;
    seen.add(rec.stampId);
    const stamp = getStampById(rec.stampId);
    if (!stamp) continue;
    badges.push({
      stampId: stamp.id,
      emoji: stamp.emoji,
      title: stamp.title,
    });
    if (badges.length >= limit) break;
  }

  return badges;
}
