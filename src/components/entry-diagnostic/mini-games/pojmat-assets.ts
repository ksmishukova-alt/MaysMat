/**
 * Визуальные ассеты ПойМАТ.
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
  laneTopPct: 23,
  laneOverlapMm: 5,
  heightReductionCm: 1,
} as const;

/** Типографика плашки — по макету (Nunito) */
export const POJMAT_PLATE_TYPO = {
  conditionColor: "#1A3673",
  conditionWeight: 700,
  hintColor: "#9586C6",
  hintWeight: 500,
} as const;

/** Низ плашки от верха арены — для clip-path карточек */
export function pojmatPlateBottomInset(): string {
  const { laneTopPct, laneOverlapMm, heightReductionCm } = POJMAT_PLATE_LAYOUT;
  return `calc(${laneTopPct}% + ${laneOverlapMm}mm - ${heightReductionCm}cm)`;
}

export function pojmatPlateHeight(): string {
  const { topMm, laneTopPct, laneOverlapMm, heightReductionCm } = POJMAT_PLATE_LAYOUT;
  return `calc(${laneTopPct}% + ${laneOverlapMm}mm - ${topMm}mm - ${heightReductionCm}cm)`;
}
