"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Header } from "@/components/Header";
import { DiagnosticReportView } from "@/components/entry-diagnostic/DiagnosticReportView";
import { loadDiagnosticSession } from "@/lib/entry-diagnostic/session";
import { finalizeReport } from "@/lib/entry-diagnostic/report";
import type { DiagnosticReport } from "@/data/entry-diagnostic/types";

export default function DiagnosticResultPage() {
  const [report, setReport] = useState<DiagnosticReport | null>(null);

  useEffect(() => {
    const session = loadDiagnosticSession();
    if (session) {
      setReport(finalizeReport(session));
    }
  }, []);

  return (
    <AppShell>
      <Header subtitle="Отчёт диагностики" />
      {!report ? (
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <p className="text-sm text-gray-600">Диагностика ещё не пройдена.</p>
          <Link href="/diagnostic/run" className="mt-4 inline-block text-brand-purple">
            Начать
          </Link>
        </div>
      ) : (
        <DiagnosticReportView report={report} />
      )}
    </AppShell>
  );
}
