import type { AttemptEvent, DiagnosticSession } from "@/data/entry-diagnostic/types";

const STORAGE_KEY = "entry-diagnostic-session-v2";

function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createDiagnosticSession(): DiagnosticSession {
  return {
    attemptId: newId("diag"),
    startedAt: Date.now(),
    currentBlockIndex: 1,
    phase: "intro",
    currentTaskIndex: 0,
    taskAttempts: [],
    miniGameAttempts: [],
    events: [],
  };
}

export function loadDiagnosticSession(): DiagnosticSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DiagnosticSession;
  } catch {
    return null;
  }
}

export function saveDiagnosticSession(session: DiagnosticSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearDiagnosticSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function appendEvent(
  session: DiagnosticSession,
  event: Omit<AttemptEvent, "eventId" | "attemptId" | "timestamp">,
): DiagnosticSession {
  const next: DiagnosticSession = {
    ...session,
    events: [
      ...session.events,
      {
        eventId: newId("evt"),
        attemptId: session.attemptId,
        timestamp: Date.now(),
        ...event,
      },
    ],
  };
  saveDiagnosticSession(next);
  return next;
}

export function patchSession(session: DiagnosticSession, patch: Partial<DiagnosticSession>): DiagnosticSession {
  const next = { ...session, ...patch };
  saveDiagnosticSession(next);
  return next;
}
