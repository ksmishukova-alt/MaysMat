"use client";

import Image from "next/image";
import type { PojmatRound } from "@/data/entry-diagnostic/mini-games/pojmat-rounds";
import { POJMAT_VISUAL_ASSETS } from "./pojmat-assets";

const CONDITION_ICONS: Partial<Record<string, string>> = {
  together: POJMAT_VISUAL_ASSETS.conditionIconApples,
};

const CONDITION_EMOJI: Partial<Record<string, string>> = {
  non_choco: "🍬",
  blue_green: "📚",
};

/** Плашка условия на игровом поле — фон из макета + динамический текст и иконка */
export function PojmatConditionPlate({ round }: { round: PojmatRound }) {
  const iconSrc = CONDITION_ICONS[round.correctId];
  const iconEmoji = CONDITION_EMOJI[round.correctId];

  return (
    <div
      data-testid="pojmat-condition-plate"
      className="pointer-events-none absolute left-1/2 top-2.5 z-30 w-[96%] max-w-xl -translate-x-1/2 sm:top-3"
    >
      <div className="relative mx-auto w-full" style={{ aspectRatio: "1024 / 341" }}>
        <Image
          src={POJMAT_VISUAL_ASSETS.conditionPlateEmpty}
          alt=""
          fill
          priority
          className="object-contain drop-shadow-md"
          sizes="(max-width: 768px) 96vw, 560px"
        />

        <div className="absolute left-[4.8%] top-[11%] flex h-[78%] w-[20.5%] items-center justify-center">
          {iconSrc ? (
            <div className="relative h-full w-full">
              <Image
                src={iconSrc}
                alt=""
                fill
                className="object-contain object-center"
                sizes="120px"
              />
            </div>
          ) : iconEmoji ? (
            <span className="text-3xl drop-shadow-sm sm:text-4xl" aria-hidden>
              {iconEmoji}
            </span>
          ) : null}
        </div>

        <p className="absolute left-[26.5%] right-[4%] top-[15%] text-[11px] font-bold leading-snug text-[#1a3568] sm:text-xs md:text-sm">
          {round.conditionText}
        </p>
      </div>
    </div>
  );
}
