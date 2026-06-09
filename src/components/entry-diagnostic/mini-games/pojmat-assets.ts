/**
 * Визуальные ассеты ПойМАТ.
 * SVG/PNG кладите в public/entry-diagnostic/pojmat/ и обновляйте пути.
 */
export const POJMAT_VISUAL_ASSETS = {
  arenaBg: "/entry-diagnostic/pojmat/arena-bg.png",
  character: "/entry-diagnostic/pojmat/myshmat.png",
  conditionIconApples: "/entry-diagnostic/pojmat/condition-icon-apples.png",
} as const;

/** Дорожки на arena-bg.png — для привязки плашки условия */
export const POJMAT_LANE_LAYOUT = {
  leftPct: 18,
  widthPct: 64,
  topPct: 23,
  marginMm: 5,
} as const;
