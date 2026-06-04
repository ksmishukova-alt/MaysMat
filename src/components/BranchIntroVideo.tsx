"use client";

import { useEffect, useState } from "react";
import { VideoModal } from "@/components/VideoModal";
import { getBranchVideo } from "@/data/videos";
import { hasSeenBranchIntro, logVideoEvent } from "@/lib/progress";

interface BranchIntroVideoProps {
  branchId: string;
  branchTitle: string;
}

export function BranchIntroVideo({ branchId, branchTitle }: BranchIntroVideoProps) {
  const meta = getBranchVideo(branchId);
  const [introOpen, setIntroOpen] = useState(false);
  const [replayOpen, setReplayOpen] = useState(false);

  useEffect(() => {
    if (!meta) return;
    if (!hasSeenBranchIntro(branchId)) {
      setIntroOpen(true);
    }
  }, [branchId, meta]);

  if (!meta) return null;

  const durationLabel =
    meta.introVideoDurationSec >= 60
      ? `~${Math.round(meta.introVideoDurationSec / 60)} мин`
      : `~${meta.introVideoDurationSec} сек`;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-card border border-lavender-200 bg-white p-4 shadow-card">
        <div>
          <div className="text-sm font-medium text-brand-purple">Видео о теме</div>
          <p className="text-sm text-gray-600">{meta.introCaption}</p>
          <p className="mt-1 text-xs text-gray-400">{durationLabel} · заглушка пилота</p>
        </div>
        <button
          type="button"
          onClick={() => setReplayOpen(true)}
          className="rounded-xl bg-lavender-100 px-4 py-2 text-sm font-medium text-brand-purple hover:bg-lavender-200"
        >
          🎬 О теме
        </button>
      </div>

      <VideoModal
        open={introOpen}
        onClose={() => setIntroOpen(false)}
        title={`Новая тема: ${branchTitle}`}
        caption={`Посмотри ${durationLabel} — потом решим вместе. ${meta.introCaption}`}
        videoUrl={meta.introVideoUrl}
        primaryLabel="Смотреть →"
        secondaryLabel="Пропустить →"
        autoShowPlayer={false}
        onPrimary={() => logVideoEvent("intro_watched", { branchId, label: branchTitle })}
        onSecondary={() => logVideoEvent("intro_skipped", { branchId, label: branchTitle })}
      />

      <VideoModal
        open={replayOpen}
        onClose={() => setReplayOpen(false)}
        title={branchTitle}
        caption={meta.introCaption}
        videoUrl={meta.introVideoUrl}
        primaryLabel="Закрыть"
        onPrimary={() => logVideoEvent("intro_watched", { branchId, label: `${branchTitle} (повтор)` })}
      />
    </>
  );
}
