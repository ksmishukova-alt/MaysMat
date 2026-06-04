"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PresetAvatar } from "@/components/avatar/PresetAvatar";
import { NotificationsBell } from "@/components/NotificationsBell";
import { AVATAR_UPDATED_EVENT, getAvatarId } from "@/lib/avatar";
import { getGreetingSubtitle } from "@/lib/greetings";
import { loadProgress, PROGRESS_UPDATED_EVENT, starsToNextLevel } from "@/lib/progress";
import { useProgress } from "@/lib/use-progress";

interface HeaderProps {
  subtitle?: string;
}

export function Header({ subtitle }: HeaderProps) {
  const progress = useProgress();
  const toNext = starsToNextLevel(progress.totalStars, progress.level);
  const [dynamicSubtitle, setDynamicSubtitle] = useState<string | null>(null);
  const [avatarId, setAvatarIdState] = useState(() => getAvatarId(progress));

  useEffect(() => {
    if (!subtitle) setDynamicSubtitle(getGreetingSubtitle());
  }, [subtitle]);

  useEffect(() => {
    const refresh = () => setAvatarIdState(getAvatarId(loadProgress()));
    refresh();
    window.addEventListener(PROGRESS_UPDATED_EVENT, refresh);
    window.addEventListener(AVATAR_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener(PROGRESS_UPDATED_EVENT, refresh);
      window.removeEventListener(AVATAR_UPDATED_EVENT, refresh);
    };
  }, [progress]);

  const line = subtitle ?? dynamicSubtitle ?? "Добро пожаловать в МышМат!";

  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-bold text-gray-800">
          Привет, {progress.name?.trim() || "Исследователь"}! 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">{line}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div
          className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-card sm:px-4"
          title={`Уровень ${progress.level}, до следующего ${toNext} ★`}
        >
          <span className="text-sm">🎖️</span>
          <span className="text-sm font-semibold">{progress.level}</span>
        </div>
        <div
          className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-card sm:px-4"
          title="Всего звёзд"
        >
          <span>⭐</span>
          <span className="font-semibold">{progress.totalStars}</span>
        </div>
        <NotificationsBell />
        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-3 shadow-card transition hover:ring-2 hover:ring-brand-purple/20"
          title="Профиль"
        >
          <PresetAvatar avatarId={avatarId} size={36} ring />
          <span className="hidden max-w-[5rem] truncate text-sm font-semibold text-gray-800 sm:inline">
            {progress.name}
          </span>
        </Link>
      </div>
    </header>
  );
}
