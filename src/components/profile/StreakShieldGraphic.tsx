"use client";

import Image from "next/image";
import {
  getStreakMilestone,
  streakShieldAssetPath,
  type StreakShieldSetId,
} from "@/data/streak-shield-catalog";

interface StreakShieldGraphicProps {
  setId: StreakShieldSetId;
  /** Дни серии — определяют веху и PNG */
  streakDays: number;
  className?: string;
  pixelSize?: number;
}

function tailwindHeightPx(className: string): number | undefined {
  const m = className.match(/\bh-(\d+(?:\.\d+)?)\b/);
  if (!m) return undefined;
  return Math.round(parseFloat(m[1]!) * 4);
}

/** PNG щита без цифр — счётчик дней показывается рядом в бейдже */
export function StreakShieldGraphic({
  setId,
  streakDays,
  className = "h-8 w-8",
  pixelSize,
}: StreakShieldGraphicProps) {
  const milestone = getStreakMilestone(streakDays);
  if (setId !== "classic" || milestone === null) return null;

  const src = streakShieldAssetPath(setId, milestone);

  return (
    <span
      className={`relative inline-block aspect-square shrink-0 ${className}`}
      style={
        pixelSize != null ? { width: pixelSize, height: pixelSize } : undefined
      }
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="64px"
        className="object-contain drop-shadow-sm"
        aria-hidden
      />
    </span>
  );
}
