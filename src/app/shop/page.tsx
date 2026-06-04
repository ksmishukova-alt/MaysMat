"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Header } from "@/components/Header";
import { StreakShieldIcon } from "@/components/profile/StreakShieldIcon";
import {
  STREAK_SHIELD_SETS,
  type StreakShieldSetId,
} from "@/data/streak-shield-catalog";
import {
  equipStreakShieldSet,
  getEquippedStreakShieldSet,
  isStreakShieldSetUnlocked,
  purchaseStreakShieldSet,
} from "@/lib/streak-shields";
import { useProgress } from "@/lib/use-progress";

export default function ShopPage() {
  const progress = useProgress();
  const equipped = getEquippedStreakShieldSet(progress);
  const [msg, setMsg] = useState<string | null>(null);

  const previewMilestone = useMemo(() => {
    if (progress.streakDays >= 60) return 5;
    if (progress.streakDays >= 15) return 3;
    if (progress.streakDays >= 3) return 1;
    return 0;
  }, [progress.streakDays]);

  function handleBuy(setId: StreakShieldSetId) {
    const def = STREAK_SHIELD_SETS.find((s) => s.id === setId);
    const updated = purchaseStreakShieldSet(setId);
    if (isStreakShieldSetUnlocked(setId, updated)) {
      setMsg(`Куплено и надето: «${def?.label}»`);
    } else {
      setMsg(`Не хватает звёзд — нужно ${def?.starPrice ?? 0} ★`);
    }
  }

  function handleEquip(setId: StreakShieldSetId) {
    equipStreakShieldSet(setId);
    setMsg(`Надет набор «${STREAK_SHIELD_SETS.find((s) => s.id === setId)?.label}»`);
  }

  return (
    <AppShell>
      <Header subtitle="Магазин" />

      <section className="mb-6 rounded-card bg-white p-5 shadow-card">
        <h2 className="text-lg font-bold">🛡️ Наборы щитов серии</h2>
        <p className="mt-1 text-sm text-gray-500">
          Классический — бесплатно. Остальные меняют вид щита в профиле по мере роста
          серии дней.
        </p>
        {msg && <p className="mt-3 text-sm text-brand-purple">{msg}</p>}
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {STREAK_SHIELD_SETS.map((set) => {
          const unlocked = isStreakShieldSetUnlocked(set.id, progress);
          const isEquipped = equipped === set.id;

          return (
            <article
              key={set.id}
              className={`rounded-card bg-white p-5 shadow-card ring-1 ${
                isEquipped ? "ring-brand-purple/40" : "ring-transparent"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-lavender-50">
                  <StreakShieldIcon
                    setId={set.id}
                    milestoneIndex={previewMilestone}
                    className="h-12 w-12"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold">
                    {set.previewEmoji} {set.label}
                    {set.free && (
                      <span className="ml-2 text-xs font-normal text-emerald-600">
                        бесплатно
                      </span>
                    )}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{set.description}</p>
                  {!set.free && (
                    <p className="mt-2 text-sm font-semibold text-amber-700">
                      {set.starPrice} ★
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {unlocked ? (
                  <button
                    type="button"
                    onClick={() => handleEquip(set.id)}
                    disabled={isEquipped}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                      isEquipped
                        ? "bg-brand-purple text-white"
                        : "bg-lavender-100 text-gray-700 hover:bg-lavender-200"
                    }`}
                  >
                    {isEquipped ? "Надет" : "Надеть"}
                  </button>
                ) : set.free ? (
                  <button
                    type="button"
                    onClick={() => handleEquip(set.id)}
                    className="rounded-full bg-brand-purple px-4 py-1.5 text-sm font-medium text-white"
                  >
                    Надеть
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleBuy(set.id)}
                    className="rounded-full bg-brand-purple px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-purple-dark"
                  >
                    Купить за {set.starPrice} ★
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
