import { countIncompleteDailySubjects, getDailyState } from "@/lib/daily";
import { getNextPlayableTask } from "@/lib/next-task";
import type { UserProgress } from "@/lib/progress";

export type HomeCtaKind = "daily" | "mission" | "tasks";

export interface HomePrimaryAction {
  kind: HomeCtaKind;
  href: string;
  label: string;
  subtitle: string;
  emoji: string;
}

/** Единственный главный CTA на главной — daily в приоритете в учебный день */
export function getHomePrimaryAction(progress: UserProgress): HomePrimaryAction {
  const dailyState = getDailyState(progress.daily);

  if (dailyState.isSchoolDay && !dailyState.isTodayDailyComplete) {
    const left = countIncompleteDailySubjects(progress.daily);
    return {
      kind: "daily",
      href: "/tasks",
      label: left === 3 ? "Начать daily" : "Продолжить daily",
      subtitle: `Осталось ${left} из 3 предметов — чтение, русский, мат`,
      emoji: "📅",
    };
  }

  const next = getNextPlayableTask(progress);
  if (next) {
    return {
      kind: "mission",
      href: next.href,
      label: "Продолжить миссию",
      subtitle: `${next.branchTitle} · задача ${next.taskNumber}`,
      emoji: next.adventureEmoji,
    };
  }

  return {
    kind: "tasks",
    href: "/tasks",
    label: "К задачам",
    subtitle: "Выбери тему на карте или в списке",
    emoji: "📝",
  };
}
