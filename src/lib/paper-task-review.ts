"use client";

import type { PaperReviewStatus, PaperTaskSubmission } from "@/data/heads-legs/types";

const STORAGE_KEY = "album-myshleniya-paper-reviews";

export const PAPER_REVIEW_UPDATED_EVENT = "mysmat-paper-review-updated";

export type { PaperReviewStatus } from "@/data/heads-legs/types";

export const PAPER_STATUS_LABEL: Record<PaperReviewStatus, string> = {
  not_started: "",
  pending: "На проверке",
  approved: "Выполнено",
  redo: "Переделать",
};

function readAll(): Record<string, PaperTaskSubmission> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, PaperTaskSubmission>) : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, PaperTaskSubmission>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(PAPER_REVIEW_UPDATED_EVENT));
}

export function getPaperSubmission(taskId: string): PaperTaskSubmission | undefined {
  return readAll()[taskId];
}

export function getPaperReviewStatus(taskId: string): PaperReviewStatus {
  return readAll()[taskId]?.status ?? "not_started";
}

export function submitPaperTask(
  taskId: string,
  paperUpload?: PaperTaskSubmission["paperUpload"],
  submissionId?: string,
): PaperTaskSubmission {
  const all = readAll();
  const entry: PaperTaskSubmission = {
    taskId,
    status: "pending",
    submissionId,
    submittedAt: new Date().toISOString(),
    paperUpload,
  };
  all[taskId] = entry;
  writeAll(all);
  return entry;
}

export function updatePaperSubmission(
  taskId: string,
  patch: Partial<PaperTaskSubmission>,
): PaperTaskSubmission | undefined {
  const all = readAll();
  const prev = all[taskId];
  if (!prev) return undefined;
  all[taskId] = { ...prev, ...patch };
  writeAll(all);
  return all[taskId];
}

export function setPaperReviewVerdict(
  taskId: string,
  verdict: "approved" | "redo",
  stars = 3,
  verdictComment?: string,
): PaperTaskSubmission | undefined {
  const all = readAll();
  const prev = all[taskId];
  if (!prev || prev.status !== "pending") return prev;

  if (verdict === "approved") {
    all[taskId] = {
      ...prev,
      status: "approved",
      reviewedAt: new Date().toISOString(),
      stars,
    };
  } else {
    all[taskId] = {
      ...prev,
      status: "redo",
      reviewedAt: new Date().toISOString(),
      verdictComment,
    };
  }
  writeAll(all);
  return all[taskId];
}

export function clearPaperSubmission(taskId: string): void {
  const all = readAll();
  delete all[taskId];
  writeAll(all);
}

export function listPendingPaperTasks(): PaperTaskSubmission[] {
  return Object.values(readAll()).filter((s) => s.status === "pending");
}
