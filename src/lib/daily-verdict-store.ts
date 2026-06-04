import fs from "fs";
import path from "path";
import type { DailyVerdict } from "@/lib/daily-submission-log";
import type { DailySubject } from "@/lib/daily";

export interface StoredVerdict {
  submissionId: string;
  date: string;
  subject: DailySubject;
  verdict: DailyVerdict;
  verdictComment?: string;
  updatedAt: string;
}

export interface AwaitingComment {
  submissionId: string;
  date: string;
  subject: DailySubject;
  chatId: number;
}

interface VerdictStoreFile {
  verdicts: Record<string, StoredVerdict>;
  awaitingComment: Record<string, AwaitingComment>;
}

const SUBJECTS: DailySubject[] = ["reading", "russian", "math"];

function verdictKey(date: string, subject: DailySubject): string {
  return `${date}:${subject}`;
}

function getDataDir(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join("/tmp", "album-myshleniya");
  }
  return path.join(process.cwd(), ".data");
}

function getFilePath(): string {
  return path.join(getDataDir(), "daily-verdicts.json");
}

function emptyStore(): VerdictStoreFile {
  return { verdicts: {}, awaitingComment: {} };
}

function normalizeEntry(raw: StoredVerdict): StoredVerdict | null {
  if (!raw.date || !raw.verdict) return null;
  if (raw.subject && SUBJECTS.includes(raw.subject)) return raw;
  // Legacy: вердикт на весь день — размножаем на все сданные предметы при чтении
  return null;
}

function readStore(): VerdictStoreFile {
  const filePath = getFilePath();
  try {
    if (!fs.existsSync(filePath)) return emptyStore();
    const raw: unknown = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (typeof raw === "object" && raw !== null && "verdicts" in raw) {
      const store = raw as VerdictStoreFile;
      const verdicts: Record<string, StoredVerdict> = {};

      for (const [key, entry] of Object.entries(store.verdicts ?? {})) {
        const normalized = normalizeEntry(entry);
        if (normalized) {
          verdicts[verdictKey(normalized.date, normalized.subject)] = normalized;
          continue;
        }
        // Legacy key = date only
        if (!key.includes(":") && entry.date) {
          for (const subject of SUBJECTS) {
            verdicts[verdictKey(entry.date, subject)] = {
              ...entry,
              subject,
            };
          }
        }
      }

      return {
        verdicts,
        awaitingComment: store.awaitingComment ?? {},
      };
    }

    return emptyStore();
  } catch {
    return emptyStore();
  }
}

function writeStore(data: VerdictStoreFile): void {
  const dir = getDataDir();
  const filePath = getFilePath();
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    /* serverless */
  }
}

export function getSubjectVerdict(
  date: string,
  subject: DailySubject,
): StoredVerdict | undefined {
  return readStore().verdicts[verdictKey(date, subject)];
}

export function getVerdictsForDate(date: string): Partial<Record<DailySubject, StoredVerdict>> {
  const store = readStore();
  const out: Partial<Record<DailySubject, StoredVerdict>> = {};
  for (const subject of SUBJECTS) {
    const v = store.verdicts[verdictKey(date, subject)];
    if (v) out[subject] = v;
  }
  return out;
}

export function getVerdictBySubmissionId(
  id: string,
  subject?: DailySubject,
): StoredVerdict | undefined {
  return Object.values(readStore().verdicts).find(
    (v) =>
      (v.submissionId === id ||
        v.submissionId.startsWith(id) ||
        id.startsWith(v.submissionId)) &&
      (subject == null || v.subject === subject),
  );
}

export function setSubjectVerdict(
  submissionId: string,
  date: string,
  subject: DailySubject,
  verdict: DailyVerdict,
  verdictComment?: string,
): StoredVerdict {
  const store = readStore();
  const entry: StoredVerdict = {
    submissionId,
    date,
    subject,
    verdict,
    verdictComment: verdictComment?.trim() || undefined,
    updatedAt: new Date().toISOString(),
  };
  store.verdicts[verdictKey(date, subject)] = entry;
  writeStore(store);
  return entry;
}

/** @deprecated используйте setSubjectVerdict */
export function setVerdict(
  submissionId: string,
  date: string,
  verdict: DailyVerdict,
  verdictComment?: string,
  subject: DailySubject = "reading",
): StoredVerdict {
  return setSubjectVerdict(submissionId, date, subject, verdict, verdictComment);
}

export function clearVerdictsByDate(date: string): boolean {
  const store = readStore();
  let changed = false;
  for (const subject of SUBJECTS) {
    const key = verdictKey(date, subject);
    if (store.verdicts[key]) {
      delete store.verdicts[key];
      changed = true;
    }
  }
  if (store.verdicts[date]) {
    delete store.verdicts[date];
    changed = true;
  }
  if (changed) writeStore(store);
  return changed;
}

/** @deprecated */
export function clearVerdictByDate(date: string): boolean {
  return clearVerdictsByDate(date);
}

export function setAwaitingComment(
  chatId: number,
  meta: { submissionId: string; date: string; subject: DailySubject },
): void {
  const store = readStore();
  store.awaitingComment[String(chatId)] = { ...meta, chatId };
  writeStore(store);
}

export function getAwaitingComment(chatId: number): AwaitingComment | undefined {
  return readStore().awaitingComment[String(chatId)];
}

export function clearAwaitingComment(chatId: number): void {
  const store = readStore();
  delete store.awaitingComment[String(chatId)];
  writeStore(store);
}

export function parseVerdictCallback(data: string): {
  action: "ok" | "no";
  submissionId: string;
  subject: DailySubject;
} | null {
  const parts = data.split(":");
  if (parts.length < 3) return null;
  const action = parts[0];
  const subject = parts[parts.length - 1] as DailySubject;
  if (action !== "ok" && action !== "no") return null;
  if (!SUBJECTS.includes(subject)) return null;
  const submissionId = parts.slice(1, -1).join(":");
  if (!submissionId) return null;
  return { action, submissionId, subject };
}
