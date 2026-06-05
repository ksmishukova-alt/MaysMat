"use client";

import { loadProgress } from "@/lib/progress";
import {
  getPaperSubmission,
  setPaperReviewVerdict,
  submitPaperTask,
  updatePaperSubmission,
} from "@/lib/paper-task-review";
import { approvePaperTaskCompletion } from "@/lib/heads-legs-migration";
import { HEADS_LEGS_TASK_LIST } from "@/data/heads-legs";
import { resolveTask } from "@/lib/task-store";

const BRANCH_ID = "modeling-heads-legs";
const TOTAL = HEADS_LEGS_TASK_LIST.length;

function makeSubmissionId(taskId: string): string {
  return `paper-${taskId}-${Date.now()}`;
}

export async function sendPaperTaskToTelegram(
  taskId: string,
  paperUpload?: { fileName: string; mimeType: string; dataUrl?: string },
): Promise<{ ok: boolean; error?: string; submissionId?: string; telegramError?: string }> {
  const task = resolveTask(taskId);
  if (!task) return { ok: false, error: "Задача не найдена" };

  const progress = loadProgress();
  const submissionId = makeSubmissionId(taskId);

  try {
    const res = await fetch("/api/telegram/paper", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submissionId,
        taskId,
        taskNumber: task.number,
        taskTitle: task.title,
        childName: progress.name || "Ребёнок",
        condition: task.condition,
        paperUpload,
      }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string; submissionId?: string; telegramError?: string };
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.error ?? "Не удалось отправить в Telegram" };
    }
    return {
      ok: true,
      submissionId: data.submissionId ?? submissionId,
      telegramError: data.telegramError,
    };
  } catch {
    return { ok: false, error: "Нет связи с сервером" };
  }
}

export function applyPaperVerdictFromServer(
  taskId: string,
  verdict: "approved" | "redo",
  options?: { stars?: number; comment?: string },
): void {
  const task = resolveTask(taskId);
  if (verdict === "approved") {
    const stars = options?.stars ?? 3;
    setPaperReviewVerdict(taskId, "approved", stars);
    if (task) {
      approvePaperTaskCompletion(taskId, BRANCH_ID, task.number, TOTAL, stars, task.title);
    }
    return;
  }
  setPaperReviewVerdict(taskId, "redo", 0, options?.comment);
}

export async function syncPaperVerdicts(taskIds: string[]): Promise<void> {
  if (typeof window === "undefined" || taskIds.length === 0) return;
  try {
    const res = await fetch(
      `/api/paper/verdict?taskIds=${encodeURIComponent(taskIds.join(","))}`,
    );
    if (!res.ok) return;
    const data = (await res.json()) as {
      verdicts?: Record<
        string,
        { verdict: string; stars?: number; verdictComment?: string; submissionId: string }
      >;
    };
    if (!data.verdicts) return;

    for (const [taskId, v] of Object.entries(data.verdicts)) {
      const local = getPaperSubmission(taskId);
      if (local?.status === "approved") continue;
      if (local?.status !== "pending") continue;

      if (v.verdict === "approved") {
        applyPaperVerdictFromServer(taskId, "approved", { stars: v.stars });
      } else if (v.verdict === "redo") {
        applyPaperVerdictFromServer(taskId, "redo", { comment: v.verdictComment });
      }
    }
  } catch {
    /* offline */
  }
}

export async function submitPaperVerdictAdmin(payload: {
  submissionId: string;
  taskId: string;
  verdict: "approved" | "redo";
  stars?: number;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/paper/verdict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok || !data.ok) {
      if (res.status === 404) {
        if (payload.verdict === "approved") {
          applyPaperVerdictFromServer(payload.taskId, "approved", { stars: payload.stars ?? 3 });
        } else {
          applyPaperVerdictFromServer(payload.taskId, "redo");
        }
        return { ok: true };
      }
      return { ok: false, error: data.error ?? "Ошибка" };
    }

    if (payload.verdict === "approved") {
      applyPaperVerdictFromServer(payload.taskId, "approved", { stars: payload.stars ?? 3 });
    } else {
      applyPaperVerdictFromServer(payload.taskId, "redo");
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Нет связи" };
  }
}

export async function submitPaperWithTelegram(
  taskId: string,
  paperUpload?: { fileName: string; mimeType: string; dataUrl?: string },
): Promise<{ ok: boolean; telegramError?: string }> {
  const localSubmissionId = makeSubmissionId(taskId);
  const tg = await sendPaperTaskToTelegram(taskId, paperUpload);
  const submissionId = tg.submissionId ?? localSubmissionId;
  submitPaperTask(taskId, paperUpload, submissionId);
  updatePaperSubmission(taskId, {
    telegramSentAt: tg.ok && !tg.telegramError ? new Date().toISOString() : undefined,
    submissionId,
  });
  return { ok: true, telegramError: tg.error ?? tg.telegramError };
}
