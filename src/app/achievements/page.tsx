"use client";

import { AppShell } from "@/components/AppShell";
import { Header } from "@/components/Header";
import { ARCHIPELAGO } from "@/data/archipelago";
import { useProgress } from "@/lib/use-progress";

function islandProgress(
  branchIds: readonly string[] | undefined,
  branchProgress: Record<string, number>
): number {
  if (!branchIds?.length) return 0;
  const sum = branchIds.reduce((acc, id) => acc + (branchProgress[id] ?? 0), 0);
  return Math.round(sum / branchIds.length);
}

export default function AchievementsPage() {
  const progress = useProgress();
  const islands = ARCHIPELAGO.filter((i) => i.kind !== "pier");

  return (
    <AppShell>
      <Header subtitle="Твои суперспособности и прогресс по архипелагу" />

      <section className="mb-6 rounded-card bg-white p-5 shadow-card">
        <h2 className="text-lg font-bold">🦸 Мои суперспособности</h2>
        <p className="mt-1 text-sm text-gray-500">
          Каждый остров МышМата открывает новый способ думать. Пройди темы — и суперспособность
          станет твоей!
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
                  {island.topics.length > 0 ? (
                    <p className="mt-2 line-clamp-2 text-xs text-gray-400">
                      {island.topics.slice(0, 3).join(" · ")}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-card bg-lavender-50 p-5 shadow-card">
        <h3 className="font-bold">🏅 Награды и медали</h3>
        <p className="mt-2 text-sm text-gray-500">
          Раздел в разработке — здесь появятся медали за daily, олимпиадные задачи и дуэли.
        </p>
      </section>
    </AppShell>
  );
}
