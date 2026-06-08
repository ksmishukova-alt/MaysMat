import { buildDiagnosticReport } from "@/data/entry-diagnostic/scoring";
import type { DiagnosticSession, DiagnosticReport } from "@/data/entry-diagnostic/types";

export function finalizeReport(session: DiagnosticSession): DiagnosticReport {
  return buildDiagnosticReport(session.attemptId, session.taskAttempts, session.miniGameAttempts);
}

export function exportTelemetryJson(session: DiagnosticSession): string {
  return JSON.stringify(
    {
      attemptId: session.attemptId,
      startedAt: session.startedAt,
      finishedAt: session.finishedAt,
      taskAttempts: session.taskAttempts,
      miniGameAttempts: session.miniGameAttempts,
      events: session.events,
    },
    null,
    2,
  );
}
