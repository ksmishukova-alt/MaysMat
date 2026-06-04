"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getHomePrimaryAction } from "@/lib/home-cta";
import { useChildPathStore } from "@/lib/use-child-path";
import { useProgress } from "@/lib/use-progress";

export function HomePrimaryCta() {
  const progress = useProgress();
  const pathStore = useChildPathStore();
  const action = useMemo(
    () => getHomePrimaryAction(progress),
    [progress, pathStore],
  );

  return (
    <section className="mb-6">
      <Link
        href={action.href}
        className="group flex items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-purple via-violet-600 to-indigo-600 p-5 text-white shadow-lg shadow-brand-purple/25 transition hover:shadow-xl hover:shadow-brand-purple/30 md:p-6"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-3xl backdrop-blur-sm">
          {action.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/75">
            {action.kind === "daily" ? "Главная цель" : "Следующий шаг"}
          </p>
          <p className="mt-0.5 text-xl font-bold leading-tight">{action.label}</p>
          <p className="mt-1 text-sm text-white/85">{action.subtitle}</p>
        </div>
        <span
          className="hidden shrink-0 text-2xl transition group-hover:translate-x-1 sm:inline"
          aria-hidden
        >
          →
        </span>
      </Link>
    </section>
  );
}
