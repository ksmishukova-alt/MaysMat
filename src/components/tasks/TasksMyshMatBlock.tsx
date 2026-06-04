"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import type { DailyState } from "@/lib/daily";
import { getNextPlayableTask } from "@/lib/next-task";
import {
  DAILY_KAMYSH_BANNER,
  DAILY_KAMYSH_BANNER_ASPECT,
} from "@/lib/tasks-myshmat-block";
import { buildTodayQuestItems, type TodayQuestItem } from "@/lib/today-quest";
import type { UserProgress } from "@/lib/progress";

const QUEST_EMOJI: Record<string, string> = {
  norm: "📝",
  skill: "🎯",
  bonus: "🎁",
  minigame: "🎮",
};

function KamyshGateBlock() {
  return (
    <section
      className="relative w-full overflow-hidden rounded-card shadow-card ring-1 ring-lavender-200/80"
      style={{ aspectRatio: DAILY_KAMYSH_BANNER_ASPECT }}
    >
      <Image
        src={DAILY_KAMYSH_BANNER}
        alt="Пока DAILY не решишь, будет только лишь камыш!"
        fill
        unoptimized
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 1024px"
      />
    </section>
  );
}

function QuestCard({ item, href }: { item: TodayQuestItem; href?: string }) {
  const pct = item.total > 0 ? Math.round((item.done / item.total) * 100) : 0;
  const complete = item.done >= item.total;

  const inner = (
    <div
      className={`flex h-full flex-col rounded-xl p-4 transition ${
        item.locked
          ? "bg-lavender-50/80 opacity-75"
          : complete
            ? "bg-emerald-50 ring-1 ring-emerald-200"
            : "bg-lavender-50 ring-1 ring-lavender-200 hover:ring-brand-purple/30"
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-2xl">{QUEST_EMOJI[item.id] ?? "✦"}</span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            complete
              ? "bg-emerald-100 text-emerald-800"
              : item.locked
                ? "bg-gray-200 text-gray-500"
                : "bg-brand-purple/10 text-brand-purple"
          }`}
        >
          {complete ? "✓ готово" : item.locked ? "🔒" : `${item.done}/${item.total}`}
        </span>
      </div>
      <p className="text-sm font-bold text-gray-900">{item.label}</p>
      {!item.locked && !complete ? (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-lavender-200">
          <div
            className="h-full rounded-full bg-brand-purple transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      ) : null}
      {item.hint ? <p className="mt-auto pt-2 text-xs text-gray-400">{item.hint}</p> : null}
      {!item.locked && !complete && href ? (
        <p className="mt-3 text-sm font-semibold text-brand-purple">Начать →</p>
      ) : null}
    </div>
  );

  if (href && !item.locked && !complete) {
    return (
      <Link href={href} className="block h-full">
        {inner}
      </Link>
    );
  }

  return inner;
}

function TodayMyshMatQuestBlock({ progress }: { progress: UserProgress }) {
  const items = useMemo(() => buildTodayQuestItems(progress), [progress]);
  const nextTask = useMemo(() => getNextPlayableTask(progress), [progress]);

  const hrefFor = (id: string): string | undefined => {
    if (id === "norm" && nextTask) return nextTask.href;
    if (id === "skill" && nextTask) return nextTask.href;
    return undefined;
  };

  return (
    <section className="overflow-hidden rounded-card bg-white shadow-card ring-1 ring-lavender-200/80">
      <div className="border-b border-lavender-100 px-5 py-4">
        <h2 className="text-lg font-bold text-gray-900">★ Задания МышМат на сегодня</h2>
        <p className="mt-1 text-sm text-gray-500">
          Daily сдан — норма, навык, бонус и мини-игра
        </p>
      </div>
      <div
        className="grid grid-cols-2 gap-3 p-4 lg:grid-cols-4"
        style={{ aspectRatio: DAILY_KAMYSH_BANNER_ASPECT }}
      >
        {items.map((item) => (
          <QuestCard key={item.id} item={item} href={hrefFor(item.id)} />
        ))}
      </div>
    </section>
  );
}

interface TasksMyshMatBlockProps {
  progress: UserProgress;
  dailyState: DailyState;
}

/** Блок под daily: камыш, пока не сдан; задания дня — когда сдан */
export function TasksMyshMatBlock({ progress, dailyState }: TasksMyshMatBlockProps) {
  const dailyGate =
    dailyState.isSchoolDay && !dailyState.isTodayDailyComplete;

  if (dailyGate) {
    return <KamyshGateBlock />;
  }

  return <TodayMyshMatQuestBlock progress={progress} />;
}
