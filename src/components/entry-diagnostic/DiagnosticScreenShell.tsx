"use client";

import type { ReactNode } from "react";

/** Упрощённая оболочка задания диагностики */
export function DiagnosticScreenShell({
  taskLabel,
  blockTitle,
  children,
}: {
  taskLabel: string;
  blockTitle: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-0.5">
        <p className="text-sm font-medium text-gray-700">{taskLabel}</p>
        <p className="text-xs text-gray-400">{blockTitle}</p>
      </div>
      <div className="rounded-2xl border border-lavender-100 bg-lavender-50/40 p-1.5 shadow-sm">
        <div className="rounded-xl bg-white p-5 shadow-card sm:p-6">{children}</div>
      </div>
    </div>
  );
}
