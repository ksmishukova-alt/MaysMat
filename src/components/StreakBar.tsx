"use client";

import Link from "next/link";
import type { DailyState } from "@/lib/daily";
import { getTodayFullName } from "@/lib/daily";

interface StreakBarProps {
  state: DailyState;
  compact?: boolean;
}

export function StreakBar({ state, compact }: StreakBarProps) {
  const { weekDaysShort, daily, streakDays, todayIndex, isSchoolDay } = state;
  const todayName = getTodayFullName();

  return (
    <Link
      href="/tasks"
      className={`block rounded-card bg-white p-5 shadow-card transition hover:ring-2 hover:ring-brand-purple/30 ${
        compact ? "" : "mb-6"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-semibold">
          {isSchoolDay && todayIndex >= 0 && !state.isTodayDailyComplete
            ? `Сегодня: ${todayName} — daily ждёт тебя!`
            : isSchoolDay && todayIndex >= 0 && state.isTodayDailyComplete
              ? `Сегодня: ${todayName} — всё сделано!`
              : !isSchoolDay
                ? `Сегодня: ${todayName}`
                : `Серия недели: ${streakDays} из 5 дней`}
        </span>
        <span className="shrink-0 text-xs text-brand-purple">Задачи →</span>
      </div>
      <div className="flex gap-2">
        {weekDaysShort.map((day, i) => {
          const done = daily.completedDays[i];
          const isToday = isSchoolDay && i === todayIndex;
          return (
            <div
              key={day}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition ${
                done
                  ? "bg-amber-400 text-white"
                  : isToday
                    ? "bg-brand-purple text-white ring-2 ring-brand-purple-light ring-offset-2"
                    : "bg-lavender-100 text-gray-400"
              }`}
              title={done ? `${day}: выполнено` : isToday ? `${day}: сегодня` : day}
            >
              {done ? "✓" : day}
            </div>
          );
        })}
      </div>
      {!compact && state.isTodayDailyComplete && state.isSchoolDay ? (
        <p className="mt-3 text-sm text-green-600">✅ Сегодня всё сделано — загляни в МышМат!</p>
      ) : null}
    </Link>
  );
}
