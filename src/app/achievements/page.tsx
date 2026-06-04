"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Header } from "@/components/Header";
import { ARCHIPELAGO } from "@/data/archipelago";
import { getAchievementList } from "@/lib/achievements";
import { evaluateAchievements } from "@/lib/achievements";
import { useProgress } from "@/lib/use-progress";

function islandProgress(
  branchIds: readonly string[] | undefined,
  branchProgress: Record<string, number>,
): number {
  if (!branchIds?.length) return 0;
  const sum = branchIds.reduce((acc, id) => acc + (branchProgress[id] ?? 0), 0);
  return Math.round(sum / branchIds.length);
}

export default function AchievementsPage() {
  const progress = useProgress();
  const [achievements, setAchievements] = useState(() => getAchievementList());

  useEffect(() => {
    evaluateAchievements(progress);
    setAchievements(getAchievementList());
  }, [progress]);

  const islands = ARCHIPELAGO.filter((i) => i.kind !== "pier");
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <AppShell>
      <Header subtitle="Твои суперспособности и награды" />

      <section className="mb-6 rounded-card bg-white p-5 shadow-card">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold">🏅 Достижения</h2>
            <p className="mt-1 text-sm text-gray-500">
              Разблокировано {unlockedCount} из {achievements.length}
            </p>
          </div>
          <div className="h-2 w-32 overflow-hidden rounded-full bg-lavender-100">
            <div
              className="h-full rounded-full bg-brand-purple"
              style={{
                width: `${achievements.length ? (unlockedCount / achievements.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`flex gap-3 rounded-xl p-4 ring-1 ${
                a.unlocked
                  ? "bg-emerald-50/80 ring-emerald-200"
                  : "bg-gray-50 ring-gray-200 opacity-75"
              }`}
            >
              <span className="text-3xl">{a.emoji}</span>
              <div className="min-w-0">
                <p className="font-bold text-gray-900">{a.title}</p>
                <p className="mt-0.5 text-sm text-gray-600">{a.description}</p>
                {a.unlocked && a.unlockedAt ? (
                  <p className="mt-1 text-xs text-emerald-700">
                    {new Date(a.unlockedAt).toLocaleDateString("ru-RU")}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-card bg-white p-5 shadow-card">
        <h2 className="text-lg font-bold">🦸 Суперспособности архипелага</h2>
        <p className="mt-1 text-sm text-gray-500">
          Прогресс по островам МышМата — каждый открывает новый способ думать.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {islands.map((island) => {
            const pct = islandProgress(island.branchIds, progress.branchProgress);
            const unlocked = pct > 0;

            return (
              <div
                key={island.id}
                className={`overflow-hidden rounded-xl ring-1 ${
                  unlocked ? "ring-brand-purple/20" : "ring-gray-200 opacity-80"
                }`}
              >
                <div className={`bg-gradient-to-br ${island.accent} px-4 py-3`}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{island.emoji}</span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-900">{island.title}</p>
                      <p className="text-xs font-semibold text-brand-purple">
                        {island.superpower}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white px-4 py-3">
                  <div className="mb-1 flex justify-between text-xs text-gray-500">
                    <span>{unlocked ? "В процессе" : "Ещё впереди"}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-lavender-100">
                    <div
                      className="h-full rounded-full bg-brand-purple transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
