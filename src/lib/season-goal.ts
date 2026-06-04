import { starsForLevel } from "@/lib/progress";

export const SEASON_GOAL_TITLE = "Маршрут МышЛения";
export const SEASON_GOAL_END = new Date("2027-01-20T23:59:59");

export function daysUntilSeasonEnd(from: Date = new Date()): number {
  const ms = SEASON_GOAL_END.getTime() - from.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function levelProgressPercent(totalStars: number, level: number): number {
  let accumulated = 0;
  for (let i = 1; i < level; i++) {
    accumulated += starsForLevel(i);
  }
  const need = starsForLevel(level);
  const earned = totalStars - accumulated;
  if (need <= 0) return 100;
  return Math.min(100, Math.max(0, Math.round((earned / need) * 100)));
}

export function formatSeasonDeadline(): string {
  return SEASON_GOAL_END.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
