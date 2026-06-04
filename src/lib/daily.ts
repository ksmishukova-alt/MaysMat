"use client";

const WEEK_DAYS_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт"] as const;
const WEEK_DAYS_FULL = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
] as const;

export type DailySubject = "reading" | "russian" | "math";

export interface DailyProgress {
  /** ISO week key, e.g. 2025-W23 */
  weekKey: string;
  /** Неделя программы «СлышМышь, задания решишь?» 0–5 (6 недель) */
  programWeek: number;
  /** Пн–Пт: день недели полностью выполнен */
  completedDays: [boolean, boolean, boolean, boolean, boolean];
  /** Сегодняшние предметы */
  today: {
    date: string;
    reading: boolean;
    russian: boolean;
    math: boolean;
  };
}

export interface DailyState {
  weekDaysShort: typeof WEEK_DAYS_SHORT;
  weekDaysFull: typeof WEEK_DAYS_FULL;
  /** Индекс сегодняшнего учебного дня 0–4 или -1 если выходной */
  todayIndex: number;
  isWeekend: boolean;
  isSchoolDay: boolean;
  /** Все daily на сегодня сделаны */
  isTodayDailyComplete: boolean;
  /** Показывать блок daily-заданий */
  showDailyBlock: boolean;
  /** Показывать «молодец» + МышМат */
  showCelebration: boolean;
  /** Сколько дней Пн–Пт выполнено на 100% за неделю */
  streakDays: number;
  /** Звёзды за сегодняшний daily (если день завершён) */
  todayStarsEarned: number;
  daily: DailyProgress;
  celebrationMessage: string;
  celebrationSubtext: string;
}

function getWeekKey(d: Date): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function todayISO(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/** Пн=0 … Пт=4, выходные = -1 */
export function getSchoolDayIndex(d = new Date()): number {
  const day = d.getDay();
  if (day >= 1 && day <= 5) return day - 1;
  return -1;
}

function emptyDaily(): DailyProgress {
  return {
    weekKey: getWeekKey(new Date()),
    programWeek: 0,
    completedDays: [false, false, false, false, false],
    today: {
      date: todayISO(),
      reading: false,
      russian: false,
      math: false,
    },
  };
}

export function normalizeDaily(raw?: Partial<DailyProgress> | null): DailyProgress {
  const now = new Date();
  const base = emptyDaily();
  if (!raw) return base;

  const daily: DailyProgress = {
    weekKey: raw.weekKey ?? base.weekKey,
    programWeek: raw.programWeek ?? base.programWeek,
    completedDays: raw.completedDays?.length === 5
      ? ([...raw.completedDays] as DailyProgress["completedDays"])
      : base.completedDays,
    today: { ...base.today, ...raw.today },
  };

  // Новая календарная неделя — сброс полоски Пн–Пт (прогресс программы не трогаем)
  if (daily.weekKey !== getWeekKey(now)) {
    daily.weekKey = getWeekKey(now);
    daily.completedDays = [false, false, false, false, false];
  }

  // Новый день — сброс today-предметов
  if (daily.today.date !== todayISO(now)) {
    daily.today = {
      date: todayISO(now),
      reading: false,
      russian: false,
      math: false,
    };
  }

  return daily;
}

export function isTodaySubjectComplete(daily: DailyProgress): boolean {
  return daily.today.reading && daily.today.russian && daily.today.math;
}

export function isSubjectDoneToday(
  dailyRaw: Partial<DailyProgress> | null | undefined,
  subject: DailySubject
): boolean {
  const daily = normalizeDaily(dailyRaw);
  return daily.today[subject];
}

/** Звёзды за день: 1+2+3+4+5 по номеру дня недели */
export function starsForDayIndex(index: number): number {
  return index + 1;
}

export function getDailyState(dailyRaw?: Partial<DailyProgress> | null): DailyState {
  const now = new Date();
  const daily = normalizeDaily(dailyRaw);
  const todayIndex = getSchoolDayIndex(now);
  const isWeekend = todayIndex === -1;
  const isSchoolDay = !isWeekend;
  const isTodayDailyComplete = isTodaySubjectComplete(daily);

  const streakDays = daily.completedDays.filter(Boolean).length;

  const showDailyBlock = isSchoolDay && !isTodayDailyComplete;
  const showCelebration = isWeekend || isTodayDailyComplete;

  let celebrationMessage = "";
  let celebrationSubtext = "";

  if (isWeekend) {
    celebrationMessage = "Сегодня выходной — отдыхай! 🌟";
    celebrationSubtext =
      "Daily-задания будут в понедельник. А пока можешь потренировать МышМат и заработать звёзды!";
  } else if (isTodayDailyComplete) {
    celebrationMessage = "Ты молодец! Всё на сегодня сделано! 🎉";
    celebrationSubtext =
      "Чтение, русский и математика закрыты. Хочешь ещё звёзд? Потренируйся в МышМат!";
  }

  const todayStarsEarned =
    isTodayDailyComplete && todayIndex >= 0 ? starsForDayIndex(todayIndex) : 0;

  return {
    weekDaysShort: WEEK_DAYS_SHORT,
    weekDaysFull: WEEK_DAYS_FULL,
    todayIndex,
    isWeekend,
    isSchoolDay,
    isTodayDailyComplete,
    showDailyBlock,
    showCelebration,
    streakDays,
    todayStarsEarned,
    daily,
    celebrationMessage,
    celebrationSubtext,
  };
}

export function markDailySubjectComplete(
  dailyRaw: Partial<DailyProgress> | null | undefined,
  subject: DailySubject
): DailyProgress {
  const daily = normalizeDaily(dailyRaw);
  daily.today[subject] = true;

  const idx = getSchoolDayIndex();
  if (idx >= 0 && isTodaySubjectComplete(daily)) {
    daily.completedDays[idx] = true;
  }

  if (daily.completedDays.every(Boolean) && daily.programWeek < 5) {
    daily.programWeek += 1;
    daily.completedDays = [false, false, false, false, false];
  }

  return daily;
}

export { WEEK_DAYS_SHORT, WEEK_DAYS_FULL };

export function getProgramWeek(daily?: Partial<DailyProgress> | null): number {
  const normalized = normalizeDaily(daily);
  return Math.min(5, Math.max(0, normalized.programWeek));
}

export function getTodayFullName(d = new Date()): string {
  const idx = getSchoolDayIndex(d);
  if (idx < 0) {
    return d.getDay() === 0 ? "Воскресенье" : "Суббота";
  }
  return WEEK_DAYS_FULL[idx];
}

/** Сколько предметов daily ещё не сдано сегодня (0–3) */
export function countIncompleteDailySubjects(
  dailyRaw?: Partial<DailyProgress> | null
): number {
  const daily = normalizeDaily(dailyRaw);
  let n = 0;
  if (!daily.today.reading) n += 1;
  if (!daily.today.russian) n += 1;
  if (!daily.today.math) n += 1;
  return n;
}
