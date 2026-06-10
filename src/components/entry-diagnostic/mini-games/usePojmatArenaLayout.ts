"use client";

import { useEffect, useState, type RefObject } from "react";
import { DEFAULT_LANE_CENTERS_PCT } from "./pojmat-lanes";

export type PojmatArenaLayout = {
  /** Центры дорожек в % ширины арены — общие для визуала и логики */
  laneCentersPct: number[];
  /** Ширина карточки в % ширины арены */
  cardWidthPct: number;
  /** Верх зоны падения (ниже плашки условия), % высоты арены */
  playfieldTopPct: number;
};

const DEFAULT_LAYOUT: PojmatArenaLayout = {
  laneCentersPct: [...DEFAULT_LANE_CENTERS_PCT],
  cardWidthPct: 22,
  playfieldTopPct: 22,
};

export function usePojmatArenaLayout(
  arenaRef: RefObject<HTMLDivElement | null>,
  laneRefs: RefObject<(HTMLDivElement | null)[]>,
  plateRef: RefObject<HTMLDivElement | null>,
): PojmatArenaLayout {
  const [layout, setLayout] = useState<PojmatArenaLayout>(DEFAULT_LAYOUT);

  useEffect(() => {
    const measure = () => {
      const arena = arenaRef.current;
      if (!arena) return;

      const arenaRect = arena.getBoundingClientRect();
      if (arenaRect.width <= 0 || arenaRect.height <= 0) return;

      const laneCentersPct = laneRefs.current.map((el, index) => {
        if (!el) return DEFAULT_LANE_CENTERS_PCT[index] ?? 12.5;
        const laneRect = el.getBoundingClientRect();
        return ((laneRect.left + laneRect.width / 2 - arenaRect.left) / arenaRect.width) * 100;
      });

      let cardWidthPct = DEFAULT_LAYOUT.cardWidthPct;
      const sampleLane = laneRefs.current[0];
      if (sampleLane) {
        const laneRect = sampleLane.getBoundingClientRect();
        cardWidthPct = Math.min(30, Math.max(14, (laneRect.width / arenaRect.width) * 100 * 0.9));
      }

      let playfieldTopPct = DEFAULT_LAYOUT.playfieldTopPct;
      const plate = plateRef.current;
      if (plate) {
        const plateRect = plate.getBoundingClientRect();
        playfieldTopPct = Math.min(
          42,
          Math.max(16, ((plateRect.bottom - arenaRect.top) / arenaRect.height) * 100 + 0.4),
        );
      }

      setLayout({ laneCentersPct, cardWidthPct, playfieldTopPct });
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (arenaRef.current) observer.observe(arenaRef.current);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [arenaRef, laneRefs, plateRef]);

  return layout;
}
