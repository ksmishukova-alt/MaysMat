"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import {
  getBranchMissionStats,
  getMissionHeroCopy,
} from "@/lib/mission-hero-display";
import {
  MISSION_HERO_ASPECT,
  MISSION_HERO_BG,
  MISSION_HERO_WIZARD,
  MISSION_WIZARD_LAYOUT,
} from "@/lib/mission-hero-layout";
import { getNextPlayableTask } from "@/lib/next-task";
import { useChildPathStore } from "@/lib/use-child-path";
import { useProgress } from "@/lib/use-progress";

function HeroBackground() {
  return (
    <Image
      src={MISSION_HERO_BG}
      alt=""
      fill
      unoptimized
      priority
      className="object-fill"
      aria-hidden
    />
  );
}

function HeroWizard() {
  const { right, bottom, height, maxWidth } = MISSION_WIZARD_LAYOUT;

  return (
    <div
      className="pointer-events-none absolute z-30"
      style={{ right, bottom, height, maxWidth, width: maxWidth }}
      aria-hidden
    >
      <Image
        src={MISSION_HERO_WIZARD}
        alt=""
        fill
        unoptimized
        className="object-contain object-right-bottom"
        sizes="320px"
      />
    </div>
  );
}

function StatusBar({
  branchTitle,
  missionCurrent,
  missionTotal,
  missionPercent,
  href,
  ctaLabel,
}: {
  branchTitle: string;
  missionCurrent: number;
  missionTotal: number;
  missionPercent: number;
  href: string;
  ctaLabel: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-3 bottom-2.5 z-20 sm:inset-x-4 sm:bottom-3">
      <div className="pointer-events-auto flex flex-col gap-2.5 rounded-xl bg-white/95 px-3.5 py-2.5 shadow-[0_4px_20px_rgba(124,58,237,0.1)] sm:flex-row sm:items-center sm:gap-0 sm:px-4 sm:py-3">
        <div className="min-w-0 flex-1 sm:pr-3">
          <p className="text-xs font-semibold leading-none text-brand-purple/80 sm:text-[13px]">
            Текущая тема
          </p>
          <p className="mt-1 truncate text-sm font-bold text-gray-900 sm:text-base">
            {branchTitle}
          </p>
        </div>

        <div className="min-w-0 flex-1 sm:border-l sm:border-lavender-100 sm:px-3">
          {missionTotal > 0 ? (
            <>
              <p className="mb-1.5 text-xs font-bold text-violet-700/80 sm:text-[13px]">
                Миссия {missionCurrent} из {missionTotal}
              </p>
              <div className="h-2 overflow-hidden rounded-full bg-lavender-100/80">
                <div
                  className="h-full rounded-full bg-brand-purple transition-all"
                  style={{ width: `${missionPercent}%` }}
                />
              </div>
            </>
          ) : (
            <p className="text-xs font-medium text-gray-500 sm:text-[13px]">
              Выбери тему на карте
            </p>
          )}
        </div>

        <div className="shrink-0 sm:pl-3">
          <Link
            href={href}
            className="flex w-full items-center justify-center whitespace-nowrap rounded-lg bg-brand-purple px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-purple/20 transition hover:opacity-95 sm:w-auto"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

function HeroText({ title, description }: { title: string; description: string }) {
  return (
    <div className="relative z-10 max-w-[50%] min-w-0 px-4 pt-4 sm:max-w-[46%] sm:px-6 sm:pt-5">
      <span className="inline-flex items-center gap-1 rounded-full border border-violet-200/90 bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-brand-purple shadow-sm sm:px-3 sm:py-1 sm:text-xs">
        ✨ Суперспособность недели
      </span>
      <h2 className="mt-2 text-xl font-bold leading-tight text-gray-900 sm:mt-2.5 sm:text-[1.65rem]">
        {title}
      </h2>
      <p className="mt-1.5 text-xs leading-snug text-gray-600 sm:text-sm sm:leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export function MissionHeroBanner() {
  const progress = useProgress();
  const pathStore = useChildPathStore();
  const next = useMemo(() => getNextPlayableTask(progress), [progress, pathStore]);

  const copy = useMemo(
    () => (next ? getMissionHeroCopy(next.branchId) : null),
    [next]
  );

  const mission = useMemo(
    () =>
      next ? getBranchMissionStats(next.branchId, progress, next.taskNumber) : null,
    [next, progress]
  );

  return (
    <section
      className="relative mb-6 w-full overflow-hidden rounded-2xl shadow-card ring-1 ring-lavender-200/70"
      style={{ aspectRatio: MISSION_HERO_ASPECT }}
    >
      <HeroBackground />
      <HeroWizard />

      {!next || !copy || !mission ? (
        <>
          <HeroText
            title="МышМат"
            description="Маршрут пройден — выбирай новые темы на карте!"
          />
          <StatusBar
            branchTitle="Свободное плавание"
            missionCurrent={0}
            missionTotal={0}
            missionPercent={0}
            href="/tasks"
            ctaLabel="Задачи →"
          />
        </>
      ) : (
        <>
          <HeroText title={copy.title} description={copy.description} />
          <StatusBar
            branchTitle={next.branchTitle}
            missionCurrent={mission.current}
            missionTotal={mission.total}
            missionPercent={mission.percent}
            href={next.href}
            ctaLabel="Продолжить миссию →"
          />
        </>
      )}
    </section>
  );
}
