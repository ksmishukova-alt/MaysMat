"use client";

import { PresetAvatar } from "@/components/avatar/PresetAvatar";
import { ProfileStarsBadge, StarIcon } from "@/components/profile/ProfileStarsBadge";
import { ProfileStreakBadge } from "@/components/profile/ProfileStreakBadge";
import { getAvatarGender } from "@/lib/avatar";
import { getDailyProfileStatus } from "@/lib/profile-status";
import {
  daysUntilSeasonEnd,
  formatSeasonDeadline,
  levelProgressPercent,
  SEASON_GOAL_TITLE,
} from "@/lib/season-goal";
import { getOverallRouteProgress } from "@/lib/profile-skills";
import { starsToNextLevel, type UserProgress } from "@/lib/progress";

interface ProfileHeroRowProps {
  progress: UserProgress;
  avatarId: string;
}

/** ~12% крупнее прежних 96 px */
const PROFILE_AVATAR_SIZE = 110;

export function ProfileHeroRow({ progress, avatarId }: ProfileHeroRowProps) {
  const dailyStatus = getDailyProfileStatus(
    progress.name,
    getAvatarGender(progress),
  );
  const levelPct = levelProgressPercent(progress.totalStars, progress.level);
  const toNext = starsToNextLevel(progress.totalStars, progress.level);
  const routePct = getOverallRouteProgress(progress);
  const daysLeft = daysUntilSeasonEnd();

  return (
    <div className="mb-6 grid gap-4 lg:grid-cols-2">
      <div className="rounded-card bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-start gap-5">
          <PresetAvatar avatarId={avatarId} size={PROFILE_AVATAR_SIZE} ring />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold">{progress.name?.trim() || "Исследователь"}</h1>
            {progress.child?.grade ? (
              <p className="mt-0.5 text-sm text-gray-500">{progress.child.grade} класс</p>
            ) : null}
            <p className="mt-1 text-sm font-medium text-brand-purple">{dailyStatus}</p>
            <p className="mt-2 text-gray-500">Уровень {progress.level}</p>

            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-gray-500">
                <span>До уровня {progress.level + 1}</span>
                <span>{levelPct}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-lavender-100">
                <div
                  className="h-full rounded-full bg-brand-purple transition-all"
                  style={{ width: `${levelPct}%` }}
                />
              </div>
              <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
                <span>Ещё {toNext}</span>
                <StarIcon className="h-3.5 w-3.5 opacity-80" />
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <ProfileStarsBadge count={progress.totalStars} />
              <ProfileStreakBadge days={progress.streakDays} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-card bg-gradient-to-br from-lavender-50 to-white p-6 shadow-card ring-1 ring-lavender-200/80">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-purple">
              Цель сезона
            </p>
            <h2 className="mt-1 text-xl font-bold">{SEASON_GOAL_TITLE}</h2>
          </div>
          <span className="text-3xl" aria-hidden>
            🏆
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          Пройди темы и собери звёзды на маршруте мышления
        </p>

        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-gray-500">
            <span>Прогресс маршрута</span>
            <span>{routePct}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/80">
            <div
              className="h-full rounded-full bg-amber-400 transition-all"
              style={{ width: `${routePct}%` }}
            />
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          До {formatSeasonDeadline()}
          {daysLeft > 0 && (
            <span className="ml-1 font-medium text-gray-700">
              · осталось {daysLeft} дн.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
