"use client";

import { Nunito } from "next/font/google";
import type { PojmatRound } from "@/data/entry-diagnostic/mini-games/pojmat-rounds";
import { POJMAT_PLATE_TYPO } from "./pojmat-assets";

const nunito = Nunito({
  subsets: ["cyrillic", "latin"],
  weight: ["500", "700"],
});

const CONDITION_EMOJI: Partial<Record<string, string>> = {
  together: "🍎",
  non_choco: "🍬",
  blue_green: "📚",
};

/** Компактная плашка условия — без широкой колонки иконки */
export function PojmatConditionPlate({ round }: { round: PojmatRound }) {
  const iconEmoji = CONDITION_EMOJI[round.correctId];

  return (
    <div
      data-testid="pojmat-condition-plate"
      className={`pojmat-condition pointer-events-none absolute z-30 ${nunito.className}`}
    >
      {iconEmoji ? (
        <span className="pojmat-condition__emoji" aria-hidden>
          {iconEmoji}
        </span>
      ) : null}
      <div className="pojmat-condition__body">
        <p
          className="pojmat-condition__text"
          style={{
            color: POJMAT_PLATE_TYPO.conditionColor,
            fontWeight: POJMAT_PLATE_TYPO.conditionWeight,
          }}
        >
          {round.conditionText}
        </p>
        <div className="pojmat-condition__dash" />
        <p
          className="pojmat-condition__hint"
          style={{
            color: POJMAT_PLATE_TYPO.hintColor,
            fontWeight: POJMAT_PLATE_TYPO.hintWeight,
          }}
        >
          Поймай карточку с правильным смыслом вопроса
        </p>
      </div>
    </div>
  );
}
