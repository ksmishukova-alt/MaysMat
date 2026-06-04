import type { DailyExercise } from "@/data/daily-content";
import type { DailySubject } from "@/lib/daily";
import type { DailyDayLog, DailyVerdict } from "@/lib/daily-submission-log";
import { getSubjectVerdict } from "@/lib/daily-submission-log";

/** Статус предмета daily в UI */
export type DailySubjectUiStatus =
  | "not_started"
  | "on_review"
  | "approved"
  | "redo";

/** Нужна ли проверка родителем (позже — галочка в админке на упражнение/предмет) */
export function exerciseRequiresReview(exercise: DailyExercise): boolean {
  if (exercise.requiresReview != null) return exercise.requiresReview;
  // Пока все daily-предметы уходят на проверку; файловые ответы — точно
  return true;
}

/** Предмет daily целиком требует проверки, если хотя бы одно упражнение — или явный флаг */
export function subjectRequiresReview(
  _subject: DailySubject,
  exercises: DailyExercise[] = [],
): boolean {
  if (exercises.length === 0) return true;
  return exercises.some(exerciseRequiresReview);
}

export function getDailySubjectUiStatus(
  done: boolean,
  log: DailyDayLog | null | undefined,
  subject: DailySubject,
  requiresReview = true,
): DailySubjectUiStatus {
  const verdict: DailyVerdict = getSubjectVerdict(log ?? null, subject);
  const hasSubjectLog = Boolean(log?.subjects[subject]);

  if (verdict === "redo") return "redo";
  if (!done) return "not_started";
  // Лог сброшен (переделка), но в progress ещё «сдано» — даём пройти заново
  if (!hasSubjectLog) return "not_started";
  if (!requiresReview) return "approved";
  if (verdict === "approved") return "approved";
  return "on_review";
}

export function isSubjectUiComplete(status: DailySubjectUiStatus): boolean {
  return status === "approved";
}

export const DAILY_SUBJECT_STATUS_LABEL: Record<DailySubjectUiStatus, string> = {
  not_started: "",
  on_review: "На проверке",
  approved: "Выполнено",
  redo: "Переделать",
};
