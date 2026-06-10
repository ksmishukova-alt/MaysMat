"use client";

import type { RefObject } from "react";
import { POJMAT_LANE_COUNT } from "./pojmat-lanes";

const LANE_VARIANTS = [
  "pojmat-lane--violet",
  "pojmat-lane--sky",
  "pojmat-lane--amber",
  "pojmat-lane--emerald",
] as const;

export type PojmatLanesLayerProps = {
  laneRefs: RefObject<(HTMLDivElement | null)[]>;
};

/** Четыре игровые дорожки — отдельный слой поверх декоративного фона */
export function PojmatLanesLayer({ laneRefs }: PojmatLanesLayerProps) {
  return (
    <div className="pojmat-lanes" aria-hidden data-testid="pojmat-lanes">
      {Array.from({ length: POJMAT_LANE_COUNT }, (_, lane) => (
        <div
          key={lane}
          ref={(el) => {
            laneRefs.current[lane] = el;
          }}
          className={`pojmat-lane ${LANE_VARIANTS[lane % LANE_VARIANTS.length]}`}
          data-lane={lane}
        >
          <div className="pojmat-lane__inner" />
        </div>
      ))}
    </div>
  );
}
