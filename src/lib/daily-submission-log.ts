"use client";

import type { DailySubject } from "@/lib/daily";
import { getProgramWeek } from "@/lib/daily";
import { getDailyDayIndex, workbookDayNumber } from "@/lib/daily-store";
import { loadProgress } from "@/lib/progress";

const STORAGE_PREFIX = "album-myshleniya-daily-log-";
const UPLOADS_PREFIX = "album-myshleniya-daily-uploads-";

export interface DailyExerciseUploadMeta {
  fileName: string;
  mimeType: string;
}

export interface DailyExerciseResult {
  exerciseId: string;
  type: string;
  question: string;
  userAnswer: string;
  correct: boolean;
  passagePreview?: string;
  /** Метаданные загруженного файла (сам файл передаётся отдельно при отправке) */
  upload?: DailyExerciseUploadMeta;
}

/** Вложение для отправки в Telegram (только в памяти до POST) */
export interface DailyExerciseUploadPayload extends DailyExerciseUploadMeta {
  dataUrl: string;
  subject: DailySubject;
  exerciseId: string;
}

export interface DailySubjectLog {
  subject: DailySubject;
  completedAt: string;
  exercises: DailyExerciseResult[];
  /** Вердикт по этому предмету */
  verdict?: DailyVerdict;
  verdictComment?: string;
}

export type DailyVerdict = "pending" | "approved" | "redo";

export interface DailyDayLog {
  submissionId: string;
  date: string;
  programWeek: number;
  weekdayIndex: number;
  workbookDay: number;
  childName: string;
  subjects: Partial<Record<DailySubject, DailySubjectLog>>;
  /** Когда каждый предмет уже отправлен в Telegram */
  telegramSubjectsSent?: Partial<Record<DailySubject, string>>;
  /** Все три предмета отправлены */
  telegramSentAt?: string;
  /** Сообщение с кнопками вердикта отправлено */
  telegramVerdictSentAt?: string;
  /** @deprecated общий вердикт — используйте subjects[s].verdict */
  verdict?: DailyVerdict;
  /** @deprecated */
  verdictComment?: string;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function uploadsKey(date = todayKey()): string {
  return `${UPLOADS_PREFIX}${date}`;
}

export function readPendingUploads(date = todayKey()): DailyExerciseUploadPayload[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(uploadsKey(date));
    if (!raw) return [];
    return JSON.parse(raw) as DailyExerciseUploadPayload[];
  } catch {
    return [];
  }
}

export function savePendingUpload(upload: DailyExerciseUploadPayload, date = todayKey()): void {
  const list = readPendingUploads(date).filter(
    (u) => !(u.subject === upload.subject && u.exerciseId === upload.exerciseId)
  );
  list.push(upload);
  sessionStorage.setItem(uploadsKey(date), JSON.stringify(list));
}

export function clearPendingUploads(date = todayKey()): void {
  sessionStorage.removeItem(uploadsKey(date));
}

function storageKey(date = todayKey()): string {
  return `${STORAGE_PREFIX}${date}`;
}

export function readDailyDayLog(date = todayKey()): DailyDayLog | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey(date));
    if (!raw) return null;
    return JSON.parse(raw) as DailyDayLog;
  } catch {
    return null;
  }
}

export function ensureDailyDayLog(meta: {
  programWeek: number;
  weekdayIndex: number;
  workbookDay: number;
  childName: string;
}): DailyDayLog {
  const date = todayKey();
  const existing = readDailyDayLog(date);
  if (existing) return existing;

  const log: DailyDayLog = {
    submissionId: `daily-${date}-${crypto.randomUUID().slice(0, 8)}`,
    date,
    programWeek: meta.programWeek,
    weekdayIndex: meta.weekdayIndex,
    workbookDay: meta.workbookDay,
    childName: meta.childName,
    subjects: {},
    verdict: "pending",
  };
  writeDailyDayLog(log);
  return log;
}

export function writeDailyDayLog(log: DailyDayLog): void {
  localStorage.setItem(storageKey(log.date), JSON.stringify(log));
}

export function saveSubjectLog(subject: DailySubject, exercises: DailyExerciseResult[]): DailyDayLog {
  const progress = loadProgress();
  const weekdayIndex = getDailyDayIndex();
  const programWeek = getProgramWeek(progress.daily);

  const log = ensureDailyDayLog({
    programWeek,
    weekdayIndex,
    workbookDay: workbookDayNumber(programWeek as 0 | 1 | 2 | 3 | 4 | 5, weekdayIndex),
    childName: progress.name,
  });

  log.subjects[subject] = {
    subject,
    completedAt: new Date().toISOString(),
    exercises,
    verdict: "pending",
  };
  writeDailyDayLog(log);
  return log;
}

export function markTelegramSent(date = todayKey()): void {
  const log = readDailyDayLog(date);
  if (!log) return;
  log.telegramSentAt = new Date().toISOString();
  writeDailyDayLog(log);
}

const SUBJECTS: DailySubject[] = ["reading", "russian", "math"];

export function isDailyLogComplete(log: DailyDayLog): boolean {
  return Boolean(log.subjects.reading && log.subjects.russian && log.subjects.math);
}

export function isSubjectTelegramSent(log: DailyDayLog, subject: DailySubject): boolean {
  return Boolean(log.telegramSubjectsSent?.[subject]);
}

export function isAllSubjectsTelegramSent(log: DailyDayLog): boolean {
  return SUBJECTS.every((s) => Boolean(log.telegramSubjectsSent?.[s]));
}

export function markSubjectTelegramSent(date: string, subject: DailySubject): void {
  const log = readDailyDayLog(date);
  if (!log) return;
  log.telegramSubjectsSent = {
    ...log.telegramSubjectsSent,
    [subject]: new Date().toISOString(),
  };
  if (isAllSubjectsTelegramSent(log)) {
    log.telegramSentAt = new Date().toISOString();
  }
  writeDailyDayLog(log);
}

export function markVerdictPromptSent(date: string): void {
  const log = readDailyDayLog(date);
  if (!log) return;
  log.telegramVerdictSentAt = new Date().toISOString();
  writeDailyDayLog(log);
}

export function isVerdictPromptSent(log: DailyDayLog): boolean {
  return Boolean(log.telegramVerdictSentAt);
}

export function getSubjectVerdict(
  log: DailyDayLog | null | undefined,
  subject: DailySubject,
): DailyVerdict {
  return log?.subjects[subject]?.verdict ?? "pending";
}

export function isSubjectApproved(
  log: DailyDayLog | null | undefined,
  subject: DailySubject,
): boolean {
  return getSubjectVerdict(log, subject) === "approved";
}

export function isSubjectRedo(
  log: DailyDayLog | null | undefined,
  subject: DailySubject,
): boolean {
  return getSubjectVerdict(log, subject) === "redo";
}

export function isDayFullyApproved(log: DailyDayLog | null | undefined): boolean {
  if (!log) return false;
  return SUBJECTS.every((s) => Boolean(log.subjects[s]) && isSubjectApproved(log, s));
}

export function subjectsNeedingRedo(log: DailyDayLog | null | undefined): DailySubject[] {
  if (!log) return [];
  return SUBJECTS.filter((s) => isSubjectRedo(log, s));
}

export const DAILY_VERDICT_UPDATED_EVENT = "mysmat-daily-verdict-updated";

export function syncSubjectVerdictToLocalLog(
  date: string,
  subject: DailySubject,
  data: { verdict: DailyVerdict; verdictComment?: string },
): DailyDayLog | null {
  const log = readDailyDayLog(date);
  if (!log) return null;
  let sub = log.subjects[subject];
  if (!sub) {
    sub = {
      subject,
      completedAt: new Date().toISOString(),
      exercises: [],
    };
    log.subjects[subject] = sub;
  }
  sub.verdict = data.verdict;
  sub.verdictComment = data.verdictComment;
  writeDailyDayLog(log);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(DAILY_VERDICT_UPDATED_EVENT));
  }
  return log;
}

/** @deprecated */
export function syncVerdictToLocalLog(
  date: string,
  data: { verdict: DailyVerdict; verdictComment?: string },
): DailyDayLog | null {
  const log = readDailyDayLog(date);
  if (!log) return null;
  for (const subject of SUBJECTS) {
    if (log.subjects[subject]) {
      syncSubjectVerdictToLocalLog(date, subject, data);
    }
  }
  return readDailyDayLog(date);
}

export function clearSubjectPendingUploads(date: string, subject: DailySubject): void {
  const list = readPendingUploads(date).filter((u) => u.subject !== subject);
  if (list.length === 0) {
    sessionStorage.removeItem(uploadsKey(date));
  } else {
    sessionStorage.setItem(uploadsKey(date), JSON.stringify(list));
  }
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "application/octet-stream";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export async function sendDailySubjectToTelegram(
  log: DailyDayLog,
  subject: DailySubject,
  extraUploads: DailyExerciseUploadPayload[] = []
): Promise<{ ok: boolean; error?: string }> {
  const freshLog = readDailyDayLog(log.date) ?? log;
  if (isSubjectTelegramSent(freshLog, subject)) return { ok: true };

  const inFlightKey = `album-myshleniya-daily-sending-${log.date}-${subject}`;
  if (typeof window !== "undefined" && sessionStorage.getItem(inFlightKey)) {
    return { ok: true };
  }
  if (typeof window !== "undefined") {
    sessionStorage.setItem(inFlightKey, "1");
  }

  const stored = readPendingUploads(log.date).filter((u) => u.subject === subject);
  const uploads = [...stored];
  for (const u of extraUploads) {
    if (
      u.subject === subject &&
      !uploads.some((x) => x.exerciseId === u.exerciseId)
    ) {
      uploads.push(u);
    }
  }

  const withVerdictPrompt = Boolean(freshLog.subjects[subject]);

  try {
    const formData = new FormData();
    formData.append("log", JSON.stringify(freshLog));
    formData.append("subject", subject);
    if (withVerdictPrompt) formData.append("withSubjectVerdict", "1");

    for (const file of uploads) {
      formData.append(
        `file:${file.subject}:${file.exerciseId}`,
        dataUrlToBlob(file.dataUrl),
        file.fileName
      );
    }

    const res = await fetch("/api/telegram/daily", {
      method: "POST",
      body: formData,
    });
    const data = (await res.json()) as {
      ok?: boolean;
      error?: string;
      subjectVerdictSent?: boolean;
    };
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.error ?? "Ошибка отправки" };
    }
    markSubjectTelegramSent(log.date, subject);
    if (data.subjectVerdictSent && log.subjects[subject]) {
      log.subjects[subject]!.verdict = "pending";
      writeDailyDayLog(log);
    }
    clearSubjectPendingUploads(log.date, subject);
    return { ok: true };
  } catch {
    return { ok: false, error: "Нет связи с сервером" };
  } finally {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(inFlightKey);
    }
  }
}

/** @deprecated используйте sendDailySubjectToTelegram */
export async function sendDailyReportToTelegram(
  log: DailyDayLog,
  extraUploads: DailyExerciseUploadPayload[] = []
): Promise<{ ok: boolean; error?: string }> {
  const subjects = SUBJECTS.filter((s) => log.subjects[s] && !isSubjectTelegramSent(log, s));
  for (const subject of subjects) {
    const uploads = extraUploads.filter((u) => u.subject === subject);
    const result = await sendDailySubjectToTelegram(log, subject, uploads);
    if (!result.ok) return result;
  }
  return { ok: true };
}

export async function fetchDailyVerdict(date = todayKey()): Promise<DailyDayLog | null> {
  try {
    const res = await fetch(`/api/daily/verdict?date=${encodeURIComponent(date)}`);
    if (!res.ok) return readDailyDayLog(date);
    const data = (await res.json()) as {
      subjects?: Partial<
        Record<
          DailySubject,
          { verdict: DailyVerdict; verdictComment?: string } | null
        >
      >;
    };
    if (!data.subjects) return readDailyDayLog(date);
    for (const subject of SUBJECTS) {
      const v = data.subjects[subject];
      if (v?.verdict) {
        syncSubjectVerdictToLocalLog(date, subject, {
          verdict: v.verdict,
          verdictComment: v.verdictComment,
        });
      }
    }
    return readDailyDayLog(date);
  } catch {
    return readDailyDayLog(date);
  }
}
