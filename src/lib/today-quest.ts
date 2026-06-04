import type { UserProgress } from "@/lib/progress";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Сколько задач МышМат решено сегодня */
export function countTasksSolvedToday(progress: UserProgress): number {
  const day = todayKey();
  let n = 0;
  for (const [id, rec] of Object.entries(progress.completedTasks)) {
    if (id.startsWith("daily-")) continue;
    if (rec.completedAt?.slice(0, 10) === day) n += 1;
  }
  if (progress.activityLog) {
    const fromLog = progress.activityLog.filter(
      (e) => e.date === day && e.kind === "task"
    ).length;
    n = Math.max(n, fromLog);
  }
  return n;
}

/** Дневная норма (v1: простая эвристика; позже — динамика) */
export function getDailyTaskNorm(progress: UserProgress): number {
  const recent = countTasksSolvedToday(progress);
  const totalDone = Object.keys(progress.completedTasks).filter((k) => !k.startsWith("daily-")).length;
  if (totalDone > 80) return 12;
  if (totalDone > 30) return 8;
  return 6;
}

export interface TodayQuestItem {
  id: string;
  label: string;
  done: number;
  total: number;
  locked?: boolean;
  hint?: string;
}

export function buildTodayQuestItems(progress: UserProgress): TodayQuestItem[] {
  const norm = getDailyTaskNorm(progress);
  const solved = countTasksSolvedToday(progress);
  const normDone = solved >= norm;

  return [
    {
      id: "norm",
      label: `Реши ${norm} задач`,
      done: Math.min(solved, norm),
      total: norm,
    },
    {
      id: "skill",
      label: "Потренируй навык",
      done: normDone ? 1 : 0,
      total: 1,
      locked: !normDone,
      hint: "Сначала закрой дневную норму",
    },
    {
      id: "bonus",
      label: "Бонусная задача",
      done: 0,
      total: 1,
      locked: !normDone,
      hint: "Скоро — особые задачи по пройденным темам",
    },
    {
      id: "minigame",
      label: "Мини-игра",
      done: 0,
      total: 1,
      locked: true,
      hint: "Откроется после бонусной задачи",
    },
  ];
}
