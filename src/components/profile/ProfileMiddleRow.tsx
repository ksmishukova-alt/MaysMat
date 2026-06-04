"use client";

import Link from "next/link";
import { getProfileThinkingSkills } from "@/lib/profile-skills";
import {
  getProfileStats,
  getRecentAchievementBadges,
} from "@/lib/profile-stats";
import type { UserProgress } from "@/lib/progress";

interface ProfileMiddleRowProps {
  progress: UserProgress;
}

export function ProfileMiddleRow({ progress }: ProfileMiddleRowProps) {
  const skills = getProfileThinkingSkills(progress);
  const badges = getRecentAchievementBadges(progress);
  const stats = getProfileStats(progress);

  return (
    <div className="mb-6 grid gap-4 lg:grid-cols-3">
      <section className="rounded-card bg-white p-5 shadow-card">
        <h2 className="text-base font-bold">🦸 Мои суперспособности</h2>
        <p className="mt-1 text-xs text-gray-500">
          Типы мышления по твоему прогрессу в темах
        </p>
        <ul className="mt-4 space-y-3">
          {skills.map((skill) => (
            <li key={skill.id}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="font-medium text-gray-700">{skill.title}</span>
                <span className="text-gray-500">{skill.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-lavender-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${skill.progress}%`,
                    backgroundColor: skill.color,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-card bg-white p-5 shadow-card">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-bold">🏅 Мои достижения</h2>
          <Link
            href="/achievements"
            className="text-xs font-medium text-brand-purple hover:underline"
          >
            Все →
          </Link>
        </div>
        {badges.length > 0 ? (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {badges.map((b) => (
              <div
                key={b.stampId}
                className="flex flex-col items-center rounded-xl bg-lavender-50 p-2 text-center"
                title={b.title}
              >
                <span className="text-2xl">{b.emoji}</span>
                <span className="mt-1 line-clamp-2 text-[9px] font-medium leading-tight text-gray-600">
                  {b.title}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500">
            Решай задачи — здесь появятся смешные печати
          </p>
        )}
      </section>

      <section className="rounded-card bg-white p-5 shadow-card">
        <h2 className="text-base font-bold">📊 Моя статистика</h2>
        <ul className="mt-4 space-y-3">
          {stats.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between border-b border-lavender-100 pb-2 last:border-0 last:pb-0"
            >
              <span className="text-sm text-gray-600">{row.label}</span>
              <span className="text-sm font-bold text-gray-800">{row.value}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
