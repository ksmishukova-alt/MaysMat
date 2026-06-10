"use client";

import { use } from "react";
import { AppShell } from "@/components/AppShell";
import { Header } from "@/components/Header";
import { getMiniGameById } from "@/data/entry-diagnostic/mini-games";
import { getMiniGameComponent } from "@/lib/entry-diagnostic/minigame-registry";

export default function DiagnosticPlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const config = getMiniGameById(slug);
  const MiniGame = getMiniGameComponent(slug);

  return (
    <AppShell>
      <Header subtitle="Мини-игра · МышМат" />
      {!config || !MiniGame ? (
        <p>Игра не найдена</p>
      ) : (
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <MiniGame
            config={config}
            mode="play"
            blockId={config.blockId ?? "play"}
            onComplete={() => undefined}
            onEvent={() => undefined}
          />
        </div>
      )}
    </AppShell>
  );
}
