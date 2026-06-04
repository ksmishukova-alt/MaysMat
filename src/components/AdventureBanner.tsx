"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { getNextPlayableTask } from "@/lib/next-task";
import { useChildPathStore } from "@/lib/use-child-path";
import { useProgress } from "@/lib/use-progress";

export function AdventureBanner() {
  const progress = useProgress();
  const pathStore = useChildPathStore();
  const next = useMemo(() => getNextPlayableTask(progress), [progress, pathStore]);

  if (!next) {
    return (
      <div className="mb-6 overflow-hidden rounded-card bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white shadow-card">
        <h2 className="text-xl font-bold">🎉 Маршрут пройден!</h2>
        <p className="mt-2 text-sm opacity-90">Все задачи из текущего маршрута решены.</p>
        <Link
          href="/tasks"
          className="mt-4 inline-block rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-emerald-700"
        >
          Задачи →
        </Link>
      </div>
    );
  }

  const branchProgress = progress.branchProgress[next.branchId] ?? 0;

  return (
    <div className="mb-6 overflow-hidden rounded-card bg-gradient-to-r from-brand-purple to-brand-purple-light p-6 text-white shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm opacity-90">
            <span>{next.adventureEmoji}</span>
            <span>{next.adventureTitle}</span>
          </div>
          <h2 className="mt-1 text-xl font-bold">
            Задача {next.taskNumber}. {next.taskTitle}
          </h2>
          <p className="mt-1 text-sm opacity-80">{next.branchTitle}</p>
          {next.microSkill ? (
            <p className="mt-2 max-w-lg text-sm opacity-90">Навык: {next.microSkill}</p>
          ) : null}
          <div className="mt-3 w-52 max-w-full">
            <ProgressBar
              value={branchProgress}
              label="Прогресс темы"
              color="bg-white"
              variant="on-dark"
            />
          </div>
        </div>
        <div className="text-5xl">{next.adventureEmoji}</div>
      </div>
      <Link
        href={next.href}
        className="mt-4 inline-block rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-brand-purple"
      >
        МышМат: продолжить →
      </Link>
    </div>
  );
}
