"use client";

import { getSchoolDayIndex, type DailySubject } from "@/lib/daily";
import {
  clearSubjectPendingUploads,
  readDailyDayLog,
  syncSubjectVerdictToLocalLog,
  writeDailyDayLog,
} from "@/lib/daily-submission-log";
import { loadProgress, saveProgress } from "@/lib/progress";

function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/** Сброс одного предмета daily для переделки — остальные не трогаем */
export function applySubjectRedo(subject: DailySubject, date?: string): void {
  if (typeof window === "undefined") return;

  const resolvedDate = date ?? readDailyDayLog()?.date ?? todayKey();

  clearSubjectPendingUploads(resolvedDate, subject);

  const log = readDailyDayLog(resolvedDate);
  if (log) {
    delete log.subjects[subject];
    if (log.telegramSubjectsSent) {
      delete log.telegramSubjectsSent[subject];
    }
    if (
      log.telegramSentAt &&
      !log.telegramSubjectsSent?.reading &&
      !log.telegramSubjectsSent?.russian &&
      !log.telegramSubjectsSent?.math
    ) {
      delete log.telegramSentAt;
    }
    writeDailyDayLog(log);
  }

  const progress = loadProgress();
  const dailyTaskKey = `daily-${resolvedDate}`;

  if (progress.daily?.today[subject]) {
    progress.daily.today[subject] = false;

    const idx = getSchoolDayIndex();
    if (idx >= 0) {
      const anyDone = (["reading", "russian", "math"] as DailySubject[]).some(
        (s) => progress.daily!.today[s],
      );
      if (!anyDone) {
        progress.daily.completedDays[idx] = false;
      }
    }
  }

  const dailyRecord = progress.completedTasks[dailyTaskKey];
  if (dailyRecord) {
    progress.totalStars = Math.max(0, progress.totalStars - dailyRecord.stars);
    delete progress.completedTasks[dailyTaskKey];
  }

  if (progress.activityLog) {
    progress.activityLog = progress.activityLog.filter(
      (e) => !(e.kind === "daily" && e.date === resolvedDate),
    );
  }

  saveProgress(progress);
}

/** @deprecated */
export function applyDailyRedo(date = todayKey()): void {
  for (const subject of ["reading", "russian", "math"] as DailySubject[]) {
    applySubjectRedo(subject, date);
  }
}

export async function submitSubjectVerdict(payload: {
  date: string;
  submissionId: string;
  subject: DailySubject;
  verdict: "approved" | "redo";
  comment?: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/daily/verdict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: payload.date,
        submissionId: payload.submissionId,
        subject: payload.subject,
        verdict: payload.verdict,
        comment: payload.comment,
      }),
    });
    const data = (await res.json()) as {
      ok?: boolean;
      error?: string;
      verdict?: "approved" | "redo";
      verdictComment?: string;
    };
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.error ?? "Ошибка сохранения" };
    }
    syncSubjectVerdictToLocalLog(payload.date, payload.subject, {
      verdict: data.verdict ?? payload.verdict,
      verdictComment: data.verdictComment ?? payload.comment,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Нет связи с сервером" };
  }
}

/** @deprecated */
export async function submitDailyVerdict(payload: {
  date: string;
  submissionId: string;
  verdict: "approved" | "redo";
  comment?: string;
}): Promise<{ ok: boolean; error?: string }> {
  return submitSubjectVerdict({ ...payload, subject: "reading" });
}
