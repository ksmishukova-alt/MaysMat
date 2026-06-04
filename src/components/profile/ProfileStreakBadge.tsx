"use client";

import {
  streakShieldHint,
  streakShieldTitle,
} from "@/data/streak-shield-catalog";
import { getStreakMilestoneIndex } from "@/data/streak-shield-catalog";
import { StreakShieldIcon, streakBadgeStyle } from "@/components/profile/StreakShieldIcon";
import {
  PROFILE_STAT_BADGE,
  PROFILE_STAT_ICON,
} from "@/components/profile/ProfileStarsBadge";
import { getEquippedStreakShieldSet } from "@/lib/streak-shields";
import { formatStreakDays } from "@/lib/streak-visual";
import { useProgress } from "@/lib/use-progress";

interface ProfileStreakBadgeProps {
  days: number;
}

export function ProfileStreakBadge({ days }: ProfileStreakBadgeProps) {
  const progress = useProgress();
  const setId = getEquippedStreakShieldSet(progress);
  const milestoneIndex = getStreakMilestoneIndex(days);
  const title = streakShieldTitle(days);
  const hint = streakShieldHint(days);

  return (
    <div
      className={`${PROFILE_STAT_BADGE} bg-gradient-to-br ${streakBadgeStyle(milestoneIndex)}`}
      title={`${title}: ${hint}`}
    >
      <StreakShieldIcon
        setId={setId}
        milestoneIndex={milestoneIndex}
        className={PROFILE_STAT_ICON}
      />
      <div className="flex items-baseline gap-1 leading-none">
        <span className="text-lg font-bold tabular-nums">{days}</span>
        <span className="text-xs font-medium opacity-80">
          {formatStreakDays(days)}
        </span>
      </div>
    </div>
  );
}
