"use client";

import { useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { Header } from "@/components/Header";
import { AvatarPicker } from "@/components/avatar/AvatarPicker";
import { ProfileHeroRow } from "@/components/profile/ProfileHeroRow";
import { ProfileMiddleRow } from "@/components/profile/ProfileMiddleRow";
import { getAvatarId } from "@/lib/avatar";
import { useProgress } from "@/lib/use-progress";

export default function ProfilePage() {
  const progress = useProgress();
  const avatarId = useMemo(() => getAvatarId(progress), [progress.avatarId, progress]);

  return (
    <AppShell>
      <Header subtitle="Твой профиль" />

      <ProfileHeroRow progress={progress} avatarId={avatarId} />
      <ProfileMiddleRow progress={progress} />

      <section>
        <h2 className="mb-3 text-lg font-bold">🎭 Выбери аватар</h2>
        <p className="mb-4 text-sm text-gray-500">
          Нажми на персонажа — он появится в профиле и в шапке сайта.
        </p>
        <div className="rounded-card bg-white p-5 shadow-card">
          <AvatarPicker />
        </div>
      </section>
    </AppShell>
  );
}
