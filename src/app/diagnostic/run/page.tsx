"use client";

import "@/components/entry-diagnostic/ui/diagnostic-ui.css";
import { DiagnosticFlow } from "@/components/entry-diagnostic/DiagnosticFlow";

/** Focus mode: полноэкранная диагностика без sidebar и bottom nav */
export default function DiagnosticRunPage() {
  return <DiagnosticFlow />;
}
