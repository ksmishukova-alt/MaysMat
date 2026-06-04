"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Header } from "@/components/Header";
import { useProgress } from "@/lib/use-progress";
import {
  buildParentReport,
  formatMinutes,
  type ReportPeriodDays,
} from "@/lib/parent-report";

function Stars({ count }: { count: number }) {
  return (
    <span className="text-amber-500" aria-label={`${count} звёзд`}>
      {"★".repeat(count)}
      <span className="text-gray-200">{"★".repeat(Math.max(0, 3 - count))}</span>
    </span>
  );
}

export default function ParentsPage() {
  const progress = useProgress();
  const [period, setPeriod] = useState<ReportPeriodDays>(7);
  const report = useMemo(
    () => buildParentReport(progress, period),
    [progress, period]
  );

  const periodLabel = period === 7 ? "за неделю" : "за месяц";

  return (
    <AppShell>
      <Header />
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Для родителей</h1>
            <p className="mt-1 text-sm text-gray-500">
              Краткий отчёт по занятиям {progress.name} — без лишних деталей
            </p>
          </div>
          <div
            className="flex rounded-xl bg-lavender-50 p-1"
            role="tablist"
            aria-label="Период отчёта"
          >
            {([7, 30] as const).map((days) => (
              <button
                key={days}
                type="button"
                role="tab"
                aria-selected={period === days}
                onClick={() => setPeriod(days)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  period === days
                    ? "bg-white text-brand-purple shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {days === 7 ? "Неделя" : "Месяц"}
              </button>
            ))}
          </div>
        </div>

        {/* Время */}
        <section className="mb-4 rounded-card bg-white p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lavender-100 text-2xl">
              ⏱️
            </div>
            <div>
              <div className="text-sm text-gray-500">Время {periodLabel}</div>
              <div className="text-3xl font-bold text-brand-purple">
                {formatMinutes(report.totalMinutes)}
              </div>
              {report.totalMinutes === 0 ? (
                <p className="mt-1 text-sm text-gray-400">
                  Пока нет записей — отчёт появится после первых задач
                </p>
              ) : null}
            </div>
          </div>
          {report.skillMinutes.length > 0 ? (
            <div className="mt-5 border-t border-gray-100 pt-4">
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                По типам мышления
              </div>
              <div className="space-y-2">
                {report.skillMinutes.map((s) => (
                  <div key={s.skillId} className="flex items-center gap-3 text-sm">
                    <span className="w-40 shrink-0 truncate text-gray-600">{s.label}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-lavender-100">
                      <div
                        className="h-full rounded-full bg-brand-purple"
                        style={{
                          width: `${Math.min(100, (s.minutes / Math.max(report.totalMinutes, 1)) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="w-16 shrink-0 text-right text-gray-500">
                      {formatMinutes(s.minutes)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        {/* Что изучал */}
        <section className="mb-4 rounded-card bg-white p-6 shadow-card">
          <h2 className="mb-4 flex items-center gap-2 font-bold">
            <span>📚</span> Что изучал {periodLabel}
          </h2>
          {report.topics.length === 0 ? (
            <p className="text-sm text-gray-400">Тем пока нет</p>
          ) : (
            <ul className="space-y-3">
              {report.topics.map((t) => (
                <li
                  key={t.branchId}
                  className="rounded-xl border border-lavender-100 bg-lavender-50/50 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="text-xs text-brand-purple">{t.adventureTitle}</div>
                      <div className="font-semibold">{t.branchTitle}</div>
                      {t.microSkill ? (
                        <div className="mt-1 text-sm text-gray-500">{t.microSkill}</div>
                      ) : null}
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>{t.taskCount} задач</div>
                      <div>{formatMinutes(t.minutes)}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Успехи */}
          <section className="rounded-card bg-white p-6 shadow-card">
            <h2 className="mb-4 flex items-center gap-2 font-bold text-emerald-700">
              <span>✅</span> Успехи
            </h2>
            {report.successes.length === 0 ? (
              <p className="text-sm text-gray-400">Пока нет задач с 3★ и выше</p>
            ) : (
              <ul className="space-y-3">
                {report.successes.slice(0, 8).map((t) => (
                  <li key={t.taskId} className="text-sm">
                    <div className="font-medium">{t.title}</div>
                    <div className="flex items-center justify-between gap-2 text-gray-500">
                      <span>{t.branchTitle}</span>
                      <Stars count={Math.min(3, t.stars)} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Непонятки */}
          <section className="rounded-card bg-white p-6 shadow-card">
            <h2 className="mb-4 flex items-center gap-2 font-bold text-amber-700">
              <span>💡</span> Нужна помощь
            </h2>
            {report.struggles.length === 0 ? (
              <p className="text-sm text-gray-400">
                Нет задач с низкой оценкой — отлично!
              </p>
            ) : (
              <ul className="space-y-3">
                {report.struggles.slice(0, 8).map((t) => (
                  <li key={t.taskId} className="text-sm">
                    <div className="font-medium">{t.title}</div>
                    <div className="flex items-center justify-between gap-2 text-gray-500">
                      <span>{t.branchTitle}</span>
                      <Stars count={t.stars} />
                    </div>
                    <p className="mt-1 text-xs text-amber-600">
                      Спросите, на каком шаге застряли
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Только для родителей — не показываем ребёнку в меню */}
        <section className="mt-8 rounded-card border border-dashed border-lavender-200 bg-lavender-50/50 p-6">
          <h2 className="mb-1 font-bold text-gray-700">⚙️ Настройки (для родителей)</h2>
          <p className="mb-4 text-sm text-gray-500">
            Редактирование маршрута, задач, daily и Telegram — здесь, не в меню ребёнка
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/path"
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium shadow-sm hover:ring-2 hover:ring-brand-purple/30"
            >
              Маршрут ребёнка
            </Link>
            <Link
              href="/admin/tasks"
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium shadow-sm hover:ring-2 hover:ring-brand-purple/30"
            >
              Модерация задач
            </Link>
            <Link
              href="/admin/daily"
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium shadow-sm hover:ring-2 hover:ring-brand-purple/30"
            >
              Daily (школьные задания)
            </Link>
            <Link
              href="/admin/telegram"
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium shadow-sm hover:ring-2 hover:ring-brand-purple/30"
            >
              Telegram-отчёты
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
