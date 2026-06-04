"use client";

import { getSchoolDayIndex } from "@/lib/daily";
import {
  clearPendingUploads,
  readDailyDayLog,
  writeDailyDayLog,
} from "@/lib/daily-submission-log";
import { loadProgress, saveProgress } from "@/lib/progress";

function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function dailyLogKey(date: string): string {
  return `album-myshleniya-daily-log-${date}`;
}

/** Сброс daily за сегодня: прогресс, лог, загрузки, звёзды за день */
export function resetTodayDaily(date = todayKey()): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(dailyLogKey(date));
  clearPendingUploads(date);

  const progress = loadProgress();
  const dailyTaskKey = `daily-${date}`;

  const dailyRecord = progress.completedTasks[dailyTaskKey];
  if (dailyRecord) {
    progress.totalStars = Math.max(0, progress.totalStars - dailyRecord.stars);
    delete progress.completedTasks[dailyTaskKey];
  }

  if (progress.activityLog) {
    progress.activityLog = progress.activityLog.filter(
      (e) => !(e.kind === "daily" && e.date === date)
    );
  }

  if (progress.daily) {
    progress.daily.today = {
      date,
      reading: false,
      russian: false,
      math: false,
    };

    const idx = getSchoolDayIndex();
    if (idx >= 0) {
      progress.daily.completedDays[idx] = false;
    }
  }

  saveProgress(progress);
}

export function getTodayDailySummary(date = todayKey()): {
  date: string;
  subjectsDone: string[];
  telegramSent: boolean;
  starsAwarded: number;
} {
  const log = readDailyDayLog(date);
  const progress = loadProgress();
  const dailyTaskKey = `daily-${date}`;
  const subjectsDone: string[] = [];

  if (progress.daily?.today.date === date) {
    if (progress.daily.today.reading) subjectsDone.push("чтение");
    if (progress.daily.today.russian) subjectsDone.push("русский");
    if (progress.daily.today.math) subjectsDone.push("математика");
  }

  return {
    date,
    subjectsDone,
    telegramSent: Boolean(log?.telegramSentAt),
    starsAwarded: progress.completedTasks[dailyTaskKey]?.stars ?? 0,
  };
}

/** Снять отметки отправки в Telegram, чтобы можно было отправить снова */
export function clearTodayDailyTelegramFlag(date = todayKey()): void {
  const log = readDailyDayLog(date);
  if (!log) return;
  delete log.telegramSentAt;
  delete log.telegramSubjectsSent;
  delete log.telegramVerdictSentAt;
  delete log.verdict;
  delete log.verdictComment;
  writeDailyDayLog(log);
}
