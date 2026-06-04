"use client";

/** Статус прохождения задачи в сессии */
export type TaskSessionStatus = "in_progress" | "completed";

/** Ответ на один шаг (сериализуемый) */
export interface TaskStepAnswer {
  stepId: string;
  /** Тип шага на момент ответа */
  stepType: string;
  /** Упрощённый снимок ответа */
  value: string | number | boolean | Record<string, unknown>;
  answeredAt: string;
}

export interface TaskSession {
  taskId: string;
  stepIndex: number;
  answers: TaskStepAnswer[];
  hintsUsed: number;
  helpVideoUsed: boolean;
  startedAt: string;
  updatedAt: string;
  status: TaskSessionStatus;
  /** Загрузка решения на бумаге (dataUrl храним отдельно — может быть большим) */
  paperUpload?: { fileName: string; mimeType: string; stepId: string };
}

const STORAGE_PREFIX = "album-myshleniya-task-session-";
const PAPER_PREFIX = "album-myshleniya-task-paper-";

function storageKey(taskId: string): string {
  return `${STORAGE_PREFIX}${taskId}`;
}

export function loadTaskSession(taskId: string): TaskSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey(taskId));
    if (!raw) return null;
    return JSON.parse(raw) as TaskSession;
  } catch {
    return null;
  }
}

export function saveTaskSession(session: TaskSession): void {
  if (typeof window === "undefined") return;
  const next: TaskSession = {
    ...session,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(storageKey(session.taskId), JSON.stringify(next));
}

export function savePaperUploadData(
  taskId: string,
  dataUrl: string,
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${PAPER_PREFIX}${taskId}`, dataUrl);
}

export function loadPaperUploadData(taskId: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`${PAPER_PREFIX}${taskId}`);
}

export function clearPaperUploadData(taskId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${PAPER_PREFIX}${taskId}`);
}

export function clearTaskSession(taskId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(storageKey(taskId));
  clearPaperUploadData(taskId);
}

export function createTaskSession(taskId: string): TaskSession {
  const now = new Date().toISOString();
  return {
    taskId,
    stepIndex: 0,
    answers: [],
    hintsUsed: 0,
    helpVideoUsed: false,
    startedAt: now,
    updatedAt: now,
    status: "in_progress",
  };
}

export function recordStepAnswer(
  session: TaskSession,
  answer: Omit<TaskStepAnswer, "answeredAt">
): TaskSession {
  const filtered = session.answers.filter((a) => a.stepId !== answer.stepId);
  return {
    ...session,
    answers: [
      ...filtered,
      { ...answer, answeredAt: new Date().toISOString() },
    ],
  };
}
