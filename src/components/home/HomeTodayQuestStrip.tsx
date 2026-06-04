"use client";

import Link from "next/link";
import { useMemo } from "react";
import { buildTodayQuestItems } from "@/lib/today-quest";
import { useProgress } from "@/lib/use-progress";

export function HomeTodayQuestStrip() {
  const progress = useProgress();
  const items = useMemo(() => buildTodayQuestItems(progress), [progress]);

  return (
    <section className="mb-6 rounded-card bg-white p-5 shadow-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold">★ Задания на сегодня</h2>
          <p className="text-xs text-gray-500">
            Daily сдан — теперь МышМат: норма, навык, бонус и мини-игра
          </p>
        </div>
        <Link href="/tasks" className="text-xs font-semibold text-brand-purple hover:underline">
          Все задачи →
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const pct = item.total > 0 ? Math.round((item.done / item.total) * 100) : 0;
          const complete = item.done >= item.total;

          return (
            <div
              key={item.id}
              className={`rounded-xl p-4 transition ${
                item.locked
                  ? "bg-lavender-50 opacity-70"
                  : complete
                    ? "bg-emerald-50 ring-1 ring-emerald-200"
                    : "bg-lavender-50 ring-1 ring-lavender-200"
              }`}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-lg">
                  {item.id === "norm"
                    ? "📝"
                    : item.id === "skill"
                      ? "🎯"
                      : item.id === "bonus"
                        ? "🎁"
                        : "🎮"}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    complete
                      ? "bg-emerald-100 text-emerald-800"
                      : item.locked
                        ? "bg-gray-200 text-gray-500"
                        : "bg-brand-purple/10 text-brand-purple"
                  }`}
                >
                  {complete ? "✓" : item.locked ? "🔒" : `${item.done}/${item.total}`}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-800">{item.label}</p>
              {!item.locked && !complete ? (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-lavender-200">
                  <div
                    className="h-full rounded-full bg-brand-purple transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              ) : null}
              {item.hint ? (
                <p className="mt-2 text-xs text-gray-400">{item.hint}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
