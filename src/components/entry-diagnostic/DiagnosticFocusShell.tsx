"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/** Focus mode для прохождения диагностики — без sidebar, монет и отвлечений */
export function DiagnosticFocusShell({
  children,
  eyebrow = "Входная диагностика",
}: {
  children: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="min-h-screen bg-lavender-100 px-4 py-5 pb-8 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <header className="mb-5 flex items-center justify-between gap-3">
          <Link
            href="/diagnostic"
            className="min-h-10 rounded-lg px-2 py-2 text-sm text-gray-500 transition hover:text-brand-purple"
          >
            ← К описанию
          </Link>
          <span className="text-xs font-medium tracking-wide text-gray-400">{eyebrow}</span>
        </header>
        {children}
      </div>
    </div>
  );
}
