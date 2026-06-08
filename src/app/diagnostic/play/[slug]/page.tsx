"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Header } from "@/components/Header";
import { getMiniGameById } from "@/data/entry-diagnostic/mini-games";
import { getMiniGameComponent } from "@/lib/entry-diagnostic/minigame-registry";

export default function DiagnosticPlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <AppShell>
      <Header subtitle="Мини-игра · МышМат" />
      <PlayInner params={params} />
    </AppShell>
  );
}

function PlayInner({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  const config = slug ? getMiniGameById(slug) : undefined;
  const MiniGame = slug ? getMiniGameComponent(slug) : undefined;

  if (!slug) return null;
  if (!config || !MiniGame) return <p>Игра не найдена</p>;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card">
      <MiniGame
        config={config}
        mode="play"
        blockId={config.blockId ?? "play"}
        onComplete={() => undefined}
        onEvent={() => undefined}
      />
    </div>
  );
}
