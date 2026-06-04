"use client";

import { useEffect, useRef, useState } from "react";

export interface VideoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  caption?: string;
  videoUrl: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  /** false — сначала кнопка «Смотреть», true — плеер сразу */
  autoShowPlayer?: boolean;
}

export function VideoModal({
  open,
  onClose,
  title,
  caption,
  videoUrl,
  primaryLabel = "Закрыть",
  secondaryLabel,
  onPrimary,
  onSecondary,
  autoShowPlayer = true,
}: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(autoShowPlayer);

  useEffect(() => {
    if (!open) {
      setPlaying(autoShowPlayer);
      videoRef.current?.pause();
    }
  }, [open, autoShowPlayer]);

  if (!open) return null;

  const handlePrimary = () => {
    if (!playing) {
      setPlaying(true);
      return;
    }
    onPrimary?.();
    onClose();
  };

  const primaryText =
    !playing && !autoShowPlayer
      ? primaryLabel
      : primaryLabel === "Закрыть"
        ? "Закрыть"
        : "Продолжить →";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-lavender-100 px-5 py-4">
          <h2 id="video-modal-title" className="text-lg font-bold">
            🎬 {title}
          </h2>
          {caption ? <p className="mt-1 text-sm text-gray-500">{caption}</p> : null}
        </div>

        <div className="bg-gray-900 p-2">
          {playing ? (
            <video
              ref={videoRef}
              className="aspect-video w-full rounded-lg bg-black"
              controls
              playsInline
              preload="metadata"
              src={videoUrl}
            >
              Ваш браузер не поддерживает воспроизведение видео.
            </video>
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="flex aspect-video w-full flex-col items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple to-brand-purple-light text-white"
            >
              <span className="mb-2 text-5xl">▶</span>
              <span className="text-sm font-medium">Смотреть</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 px-5 py-4">
          {secondaryLabel ? (
            <button
              type="button"
              onClick={() => {
                onSecondary?.();
                onClose();
              }}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {secondaryLabel}
            </button>
          ) : null}
          <button
            type="button"
            onClick={handlePrimary}
            className="flex-1 rounded-xl bg-brand-purple py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            {primaryText}
          </button>
        </div>
      </div>
    </div>
  );
}
