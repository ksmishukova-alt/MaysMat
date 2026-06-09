"use client";

import Image from "next/image";
import type { PojmatRound } from "@/data/entry-diagnostic/mini-games/pojmat-rounds";
import { POJMAT_LANE_LAYOUT, POJMAT_VISUAL_ASSETS } from "./pojmat-assets";

const CONDITION_ICONS: Partial<Record<string, string>> = {
  together: POJMAT_VISUAL_ASSETS.conditionIconApples,
};

const CONDITION_EMOJI: Partial<Record<string, string>> = {
  non_choco: "🍬",
  blue_green: "📚",
};

/** Плашка условия: кремовый фон по ширине дорожек + 5 мм, низ — на 5 мм ниже начала дорожек */
export function PojmatConditionPlate({ round }: { round: PojmatRound }) {
  const iconSrc = CONDITION_ICONS[round.correctId];
  const iconEmoji = CONDITION_EMOJI[round.correctId];
  const { leftPct, widthPct, topPct, marginMm } = POJMAT_LANE_LAYOUT;

  return (
    <div
      data-testid="pojmat-condition-plate"
      className="pointer-events-none absolute z-30 flex overflow-hidden rounded-2xl border border-[#e8dcc8] bg-[#fdf8f0]"
      style={{
        left: `calc(${leftPct}% - ${marginMm}mm)`,
        width: `calc(${widthPct}% + ${marginMm * 2}mm)`,
        top: `${marginMm}mm`,
        height: `calc(${topPct}%)`,
        boxShadow: "0 2px 4px rgba(55, 42, 28, 0.14)",
      }}
    >
      <div className="flex h-full w-[22%] shrink-0 items-center justify-center border-r border-[#efe4d4] bg-[#fbf5ec] p-1.5 sm:p-2">
        {iconSrc ? (
          <div className="relative h-full w-full max-h-[4.5rem] max-w-[4.5rem]">
            <Image
              src={iconSrc}
              alt=""
              fill
              className="object-contain object-center"
              sizes="80px"
            />
          </div>
        ) : iconEmoji ? (
          <span className="text-2xl sm:text-3xl" aria-hidden>
            {iconEmoji}
          </span>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between px-2.5 py-2 sm:px-3 sm:py-2.5">
        <p className="text-[10px] font-bold leading-snug text-[#1a3568] sm:text-xs md:text-sm">
          {round.conditionText}
        </p>
        <div>
          <div className="mb-1 border-t border-dashed border-stone-300/90 sm:mb-1.5" />
          <p className="text-[10px] font-medium leading-snug text-[#8b7fd4] sm:text-[11px]">
            Поймай карточку с правильным смыслом вопроса
          </p>
        </div>
      </div>
    </div>
  );
}
