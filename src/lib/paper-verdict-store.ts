import fs from "fs";
import path from "path";

export type PaperVerdict = "pending" | "approved" | "redo";

export interface StoredPaperVerdict {
  submissionId: string;
  taskId: string;
  taskTitle: string;
  taskNumber: number;
  childName: string;
  verdict: PaperVerdict;
  verdictComment?: string;
  stars?: number;
  submittedAt: string;
  updatedAt: string;
}

export interface AwaitingPaperComment {
  submissionId: string;
  taskId: string;
  chatId: number;
}

interface PaperVerdictStoreFile {
  verdicts: Record<string, StoredPaperVerdict>;
  awaitingComment: Record<string, AwaitingPaperComment>;
}

function getDataDir(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join("/tmp", "album-myshleniya");
  }
  return path.join(process.cwd(), ".data");
}

function getFilePath(): string {
  return path.join(getDataDir(), "paper-verdicts.json");
}

function emptyStore(): PaperVerdictStoreFile {
  return { verdicts: {}, awaitingComment: {} };
}

function readStore(): PaperVerdictStoreFile {
  const filePath = getFilePath();
  try {
    if (!fs.existsSync(filePath)) return emptyStore();
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as PaperVerdictStoreFile;
  } catch {
    return emptyStore();
  }
}

function writeStore(data: PaperVerdictStoreFile): void {
  const dir = getDataDir();
  const filePath = getFilePath();
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    /* serverless */
  }
}

export function getPaperVerdict(submissionId: string): StoredPaperVerdict | undefined {
  return readStore().verdicts[submissionId];
}

export function getPaperVerdictByTaskId(taskId: string): StoredPaperVerdict | undefined {
  return Object.values(readStore().verdicts).find(
    (v) => v.taskId === taskId && v.verdict === "pending",
  );
}

export function listPendingPaperVerdicts(): StoredPaperVerdict[] {
  return Object.values(readStore().verdicts).filter((v) => v.verdict === "pending");
}

export function registerPaperSubmission(entry: Omit<StoredPaperVerdict, "updatedAt" | "verdict">): StoredPaperVerdict {
  const store = readStore();
  const full: StoredPaperVerdict = {
    ...entry,
    verdict: "pending",
    updatedAt: new Date().toISOString(),
  };
  store.verdicts[entry.submissionId] = full;
  writeStore(store);
  return full;
}

export function setPaperVerdict(
  submissionId: string,
  verdict: "approved" | "redo",
  options?: { stars?: number; comment?: string },
): StoredPaperVerdict | undefined {
  const store = readStore();
  const prev = store.verdicts[submissionId];
  if (!prev) return undefined;

  const entry: StoredPaperVerdict = {
    ...prev,
    verdict,
    stars: verdict === "approved" ? (options?.stars ?? 3) : undefined,
    verdictComment: verdict === "redo" ? options?.comment?.trim() || undefined : undefined,
    updatedAt: new Date().toISOString(),
  };
  store.verdicts[submissionId] = entry;
  writeStore(store);
  return entry;
}

export function setAwaitingPaperComment(
  chatId: number,
  meta: { submissionId: string; taskId: string },
): void {
  const store = readStore();
  store.awaitingComment[String(chatId)] = { ...meta, chatId };
  writeStore(store);
}

export function getAwaitingPaperComment(chatId: number): AwaitingPaperComment | undefined {
  return readStore().awaitingComment[String(chatId)];
}

export function clearAwaitingPaperComment(chatId: number): void {
  const store = readStore();
  delete store.awaitingComment[String(chatId)];
  writeStore(store);
}

export function parsePaperVerdictCallback(data: string): {
  action: "ok" | "no";
  submissionId: string;
} | null {
  if (data.startsWith("pok:")) {
    const submissionId = data.slice(4);
    return submissionId ? { action: "ok", submissionId } : null;
  }
  if (data.startsWith("pno:")) {
    const submissionId = data.slice(4);
    return submissionId ? { action: "no", submissionId } : null;
  }
  return null;
}

export function getVerdictsForTaskIds(taskIds: string[]): Record<string, StoredPaperVerdict> {
  const store = readStore();
  const out: Record<string, StoredPaperVerdict> = {};
  for (const v of Object.values(store.verdicts)) {
    if (taskIds.includes(v.taskId)) {
      const existing = out[v.taskId];
      if (!existing || v.updatedAt > existing.updatedAt) {
        out[v.taskId] = v;
      }
    }
  }
  return out;
}
