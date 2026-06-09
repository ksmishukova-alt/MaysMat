/**
 * Визуальные ассеты ПойМАТ.
 * SVG/PNG кладите в public/entry-diagnostic/pojmat/ и обновите пути.
 */
export const POJMAT_VISUAL_ASSETS = {
  arenaBg: "/entry-diagnostic/pojmat/arena-bg.png",
  character: "/entry-diagnostic/pojmat/myshmat.png",
  conditionIconApples: "/entry-diagnostic/pojmat/condition-icon-apples.png",
} as const;

/** Плашка условия внутри арены */
export const POJMAT_PLATE_LAYOUT = {
  topMm: 2,
  sideCm: 0.7,
  /** Низ плашки — чуть ниже начала дорожек на arena-bg */
  laneTopPct: 23,
  laneOverlapMm: 5,
} as const;
