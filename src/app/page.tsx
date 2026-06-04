"use client";

import { AppShell } from "@/components/AppShell";
import { Header } from "@/components/Header";
import { TopicMapSection } from "@/components/TopicMapSection";
import { HomePrimaryCta } from "@/components/home/HomePrimaryCta";
import { HomeDailyPriorityBlock } from "@/components/home/HomeDailyPriorityBlock";
import { HomeMiddleRow } from "@/components/home/HomeMiddleRow";
import { HomeTodayQuestStrip } from "@/components/home/HomeTodayQuestStrip";
import { MissionHeroBanner } from "@/components/home/MissionHeroBanner";
import { getDailyState } from "@/lib/daily";
import { useProgress } from "@/lib/use-progress";

export default function HomePage() {
  const progress = useProgress();
  const dailyState = getDailyState(progress.daily);
  const showDailyPriority =
    dailyState.isSchoolDay && !dailyState.isTodayDailyComplete;

  return (
    <AppShell>
      <Header />

      <HomePrimaryCta />

      <MissionHeroBanner showCta={false} />

      {showDailyPriority ? (
        <HomeDailyPriorityBlock state={dailyState} />
      ) : (
        <HomeTodayQuestStrip />
      )}

      <HomeMiddleRow />

      <TopicMapSection progress={progress} hideFilters />
    </AppShell>
  );
}
