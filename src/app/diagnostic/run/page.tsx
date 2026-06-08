"use client";

import { AppShell } from "@/components/AppShell";
import { Header } from "@/components/Header";
import { DiagnosticFlow } from "@/components/entry-diagnostic/DiagnosticFlow";

export default function DiagnosticRunPage() {
  return (
    <AppShell>
      <Header subtitle="Входная диагностика · МышМат" />
      <DiagnosticFlow />
    </AppShell>
  );
}
