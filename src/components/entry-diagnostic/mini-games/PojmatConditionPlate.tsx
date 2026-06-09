"use client";

import Image from "next/image";
import { Nunito } from "next/font/google";
import type { PojmatRound } from "@/data/entry-diagnostic/mini-games/pojmat-rounds";
import {
  POJMAT_PLATE_LAYOUT,
  POJMAT_PLATE_TYPO,
  POJMAT_VISUAL_ASSETS,
  pojmatPlateHeight,
} from "./pojmat-assets";

const nunito = Nunito({
  subsets: ["cyrillic", "latin"],
  weight: ["500", "700"],
});

const CONDITION_ICONS: Partial<Record<string, string>> = {
  together: POJMAT_VISUAL_ASSETS.conditionIconApples,
};

const CONDITION_EMOJI: Partial<Record<string, string>> = {
  non_choco: "🍬",
  blue_green: "📚",
};

/** Плашка условия по макету: Nunito, компактная высота */
export function PojmatConditionPlate({ round }: { round: PojmatRound }) {
  const iconSrc = CONDITION_ICONS[round.correctId];
  const iconEmoji = CONDITION_EMOJI[round.correctId];
  const { topMm, sideCm } = POJMAT_PLATE_LAYOUT;

  return (
    <div
      data-testid="pojmat-condition-plate"
      className={`pointer-events-none absolute z-30 flex overflow-hidden rounded-2xl border border-[#e8dcc8] bg-[#fdf8f0] ${nunito.className}`}
      style={{
        left: `${sideCm}cm`,
        width: `calc(100% - ${sideCm * 2}cm)`,
        top: `${topMm}mm`,
        height: pojmatPlateHeight(),
        boxShadow: "0 2px 4px rgba(55, 42, 28, 0.14)",
      }}
    >
      <div className="flex h-full w-[22%] shrink-0 items-center justify-center border-r border-[#efe4d4] bg-[#fbf5ec] p-1 sm:p-1.5">
        {iconSrc ? (
          <div className="relative h-full w-full max-h-[3.25rem] max-w-[3.25rem]">
            <Image
              src={iconSrc}
              alt=""
              fill
              className="object-contain object-center"
              sizes="64px"
            />
          </div>
        ) : iconEmoji ? (
          <span className="text-xl sm:text-2xl" aria-hidden>
            {iconEmoji}
          </span>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between bg-[#fdf8f0] px-2 py-1.5 sm:px-2.5 sm:py-2">
        <p
          className="text-[11px] leading-tight sm:text-xs"
          style={{
            color: POJMAT_PLATE_TYPO.conditionColor,
            fontWeight: POJMAT_PLATE_TYPO.conditionWeight,
          }}
        >
          {round.conditionText}
        </p>
        <div>
          <div className="mb-0.5 border-t border-dashed border-[#ddd0c0] sm:mb-1" />
          <p
            className="text-[10px] leading-tight sm:text-[11px]"
            style={{
              color: POJMAT_PLATE_TYPO.hintColor,
              fontWeight: POJMAT_PLATE_TYPO.hintWeight,
            }}
          >
            Поймай карточку с правильным смыслом вопроса
          </p>
        </div>
      </div>
    </div>
  );
}
