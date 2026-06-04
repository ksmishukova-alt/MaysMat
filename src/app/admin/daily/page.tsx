"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DAILY_SUBJECTS, DAILY_PROGRAM_WEEKS } from "@/data/daily-content";
import { hasDailyOverride, resolveDailySubjectPack } from "@/lib/daily-store";
import { getTodayDailySummary, resetTodayDaily } from "@/lib/reset-today-daily";
import { AdminDailyVerdictPanel } from "@/components/admin/AdminDailyVerdictPanel";
import { useDailyStore } from "@/lib/use-daily-store";

export default function AdminDailyPage() {
  const store = useDailyStore();
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const summary = useMemo(() => getTodayDailySummary(), []);

  const handleResetToday = async () => {
    const today = summary.date;
    const detail =
      summary.subjectsDone.length > 0
        ? `Сдано: ${summary.subjectsDone.join(", ")}.`
        : "Предметы за сегодня не отмечены.";
    if (
      !confirm(
        `Обнулить daily за ${today}?\n\n${detail}\nЗвёзды за день: ${summary.starsAwarded}. Отчёт в Telegram: ${summary.telegramSent ? "отправлен" : "нет"}.`
      )
    ) {
      return;
    }

    resetTodayDaily(today);
    try {
      await fetch(`/api/daily/verdict?date=${encodeURIComponent(today)}`, { method: "DELETE" });
    } catch {
      /* вердикт на сервере необязателен */
    }
    setResetMsg(`Daily за ${today} обнулён. Можно проходить заново.`);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/tasks" className="mb-4 inline-block text-sm text-brand-purple hover:underline">
          ← Модерация задач
        </Link>
        <Link href="/admin/telegram" className="mb-4 ml-4 inline-block text-sm text-brand-purple hover:underline">
          Telegram →
        </Link>

        <h1 className="mb-2 text-2xl font-bold">Daily — задания на каждый день</h1>
        <p className="mb-4 text-sm text-gray-600">
          «СлышМышь, задания решишь?» — {DAILY_PROGRAM_WEEKS} недель × Пн–Пт (30 дней). Редактируйте
          тексты, тесты и задачи. Сохранение — в localStorage браузера.
        </p>

        <section className="mb-6 rounded-card border border-amber-100 bg-amber-50/60 p-4">
          <h2 className="font-semibold text-amber-950">Сегодня ({summary.date})</h2>
          <p className="mt-1 text-sm text-amber-900">
            {summary.subjectsDone.length > 0
              ? `Сдано: ${summary.subjectsDone.join(", ")}`
              : "Предметы ещё не отмечены"}
            {summary.telegramSent ? " · отчёт в Telegram отправлен" : ""}
            {summary.starsAwarded > 0 ? ` · +${summary.starsAwarded} ⭐` : ""}
          </p>
          <button
            type="button"
            onClick={() => void handleResetToday()}
            className="mt-3 rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-50"
          >
            Обнулить daily за сегодня
          </button>
          {resetMsg ? <p className="mt-2 text-sm text-green-800">{resetMsg}</p> : null}
        </section>

        <AdminDailyVerdictPanel />

        <div className="grid gap-4 md:grid-cols-3">
          {DAILY_SUBJECTS.map((subject) => {
            const pack = resolveDailySubjectPack(subject, store);
            const total = pack.byWeek.reduce(
              (sum, week) => sum + week.reduce((s, day) => s + day.length, 0),
              0
            );
            const edited = hasDailyOverride(subject, store);

            return (
              <Link
                key={subject}
                href={`/admin/daily/${subject}`}
                className="rounded-card bg-white p-6 shadow-card transition hover:ring-2 hover:ring-brand-purple"
              >
                <div className="text-4xl">{pack.emoji}</div>
                <h2 className="mt-3 font-bold">{pack.title}</h2>
                <p className="text-sm text-gray-500">{pack.description}</p>
                <p className="mt-2 text-xs text-gray-400">
                  {total} упражнений · {DAILY_PROGRAM_WEEKS} нед.
                  {edited ? " · изменено" : ""}
                </p>
                <span className="mt-4 inline-block text-sm text-brand-purple">Редактировать →</span>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
