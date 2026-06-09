"use client";

import Image from "next/image";
import type { ReactNode } from "react";

/** Детская оболочка задания диагностики — мягкая рамка, без «белой формы» */
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
        <p className="text-sm font-semibold text-brand-purple/90">{taskLabel}</p>
        <p className="text-xs font-medium text-gray-500">{blockTitle}</p>
      </div>
      <div className="relative overflow-hidden rounded-3xl border-2 border-lavender-200 bg-gradient-to-br from-lavender-50 via-white to-purple-50/40 p-2 shadow-card">
        <div
          className="pointer-events-none absolute -left-1 top-3 z-0 opacity-80"
          aria-hidden
        >
          <Image
            src="/entry-diagnostic/pojmat/myshmat.png"
            alt=""
            width={72}
            height={72}
            className="drop-shadow-sm"
          />
        </div>
        <div className="relative z-10 rounded-2xl border border-lavender-100/80 bg-[#fefcff]/95 p-5 pl-16 shadow-sm sm:p-6 sm:pl-20">
          {children}
        </div>
      </div>
    </div>
  );
}
