"use client";

import { forwardRef } from "react";
import type { PojmatRound } from "@/data/entry-diagnostic/mini-games/pojmat-rounds";

const CONDITION_EMOJI: Partial<Record<string, string>> = {
  together: "🍎",
  non_choco: "🍬",
  blue_green: "📚",
};

/** Плашка условия — тот же стиль, что diagnostic-task__condition */
export const PojmatConditionPlate = forwardRef<HTMLDivElement, { round: PojmatRound }>(
  function PojmatConditionPlate({ round }, ref) {
    const iconEmoji = CONDITION_EMOJI[round.correctId];

    return (
      <div
        ref={ref}
        data-testid="pojmat-condition-plate"
        className="pojmat-condition diagnostic-card pointer-events-none absolute z-30"
      >
        {iconEmoji ? (
          <span className="pojmat-condition__emoji" aria-hidden>
            {iconEmoji}
          </span>
        ) : null}
        <div className="pojmat-condition__body">
          <p className="pojmat-condition__text">{round.conditionText}</p>
          <div className="pojmat-condition__dash" />
          <p className="pojmat-condition__hint">Поймай карточку с правильным смыслом вопроса</p>
        </div>
      </div>
    );
  },
);
