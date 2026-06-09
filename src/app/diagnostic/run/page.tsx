"use client";

import { AppShell } from "@/components/AppShell";
import { DiagnosticFocusShell } from "@/components/entry-diagnostic/DiagnosticFocusShell";
import { DiagnosticFlow } from "@/components/entry-diagnostic/DiagnosticFlow";

export default function DiagnosticRunPage() {
  return (
    <DiagnosticFocusShell>
      <DiagnosticFlow />
    </DiagnosticFocusShell>
  );
}
