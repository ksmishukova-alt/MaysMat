"use client";

import Link from "next/link";
import { ProgressBar } from "@/components/ProgressBar";
import { TaskCompletionStampById } from "@/components/TaskCompletionStamp";
import { resolveChildPath } from "@/lib/child-path";
import type { UserProgress } from "@/lib/progress";

interface AssignedPathSectionProps {
  progress: UserProgress;
}

export function AssignedPathSection({ progress }: AssignedPathSectionProps) {
  const resolved = resolveChildPath(progress.name, progress);

  if (!resolved) {
    return (
      <section className="rounded-card border border-dashed border-lavender-200 bg-lavender-50/50 p-6 shadow-card">
        <h2 className="text-lg font-bold">🐭 МышМат</h2>
        <p className="mt-2 text-sm text-gray-500">
          Маршрут заданий пока не назначен — его настроят в разделе «Родителям».
        </p>
      </section>
    );
  }

  const { config, entries } = resolved;

  return (
    <section className="rounded-card bg-white p-6 shadow-card">
      <div className="mb-4">
        <h2 className="text-lg font-bold">🐭 Мой маршрут</h2>
        <p className="text-sm font-medium text-brand-purple">{config.title}</p>
        {config.note ? <p className="mt-1 text-sm text-gray-500">{config.note}</p> : null}
      </div>

      <ol className="space-y-3">
        {entries.map((entry, index) => {
          const done = entry.completed && entry.item.kind === "task";

          if (entry.href && entry.available && done && entry.stampId) {
            return (
              <li key={`${entry.item.kind}-${entry.item.id}`}>
                <div className="flex flex-wrap items-center gap-3 rounded-xl border-2 border-emerald-200 bg-emerald-50/40 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                    ✓
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-800">{entry.title}</div>
                    <div className="text-sm text-amber-600">
                      {"★".repeat(entry.stars ?? 0)}
                    </div>
                  </div>
                  <TaskCompletionStampById
                    stampId={entry.stampId}
                    stars={entry.stars}
                    size="sm"
                  />
                </div>
              </li>
            );
          }

          if (entry.href && entry.available) {
            return (
              <li key={`${entry.item.kind}-${entry.item.id}`}>
                <Link
                  href={entry.href}
                  className="flex items-center gap-4 rounded-xl border border-lavender-100 p-4 transition hover:border-brand-purple hover:bg-lavender-50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-purple text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{entry.title}</div>
                    {entry.subtitle ? (
                      <div className="text-sm text-gray-500">{entry.subtitle}</div>
                    ) : null}
                    {entry.item.kind === "branch" && entry.progress !== undefined ? (
                      <div className="mt-2 max-w-xs">
                        <ProgressBar value={entry.progress} />
                      </div>
                    ) : null}
                  </div>
                  <span className="text-brand-purple">→</span>
                </Link>
              </li>
            );
          }

          return (
            <li key={`${entry.item.kind}-${entry.item.id}`}>
              <div className="flex items-center gap-4 rounded-xl border border-dashed border-gray-200 p-4 opacity-60">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-500">
                  {index + 1}
                </span>
                <div>
                  <div className="font-medium text-gray-500">{entry.title}</div>
                  <div className="text-xs text-gray-400">скоро</div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
