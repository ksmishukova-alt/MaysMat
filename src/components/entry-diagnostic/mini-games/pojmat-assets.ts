import { ENTRY_DIAGNOSTIC_ASSETS } from "@/data/entry-diagnostic/visual-assets";

/**
 * Визуальные ассеты ПойМАТ.
 */
export const POJMAT_VISUAL_ASSETS = {
  arenaBgMobile: ENTRY_DIAGNOSTIC_ASSETS.pojmat.arena.mobile,
  arenaBgDesktop: ENTRY_DIAGNOSTIC_ASSETS.pojmat.arena.desktop,
  /** @deprecated используйте arenaBgMobile / arenaBgDesktop */
  arenaBg: ENTRY_DIAGNOSTIC_ASSETS.pojmat.arena.mobile,
  character: ENTRY_DIAGNOSTIC_ASSETS.characters.myshmatBasketLarge,
  characterLegacy: ENTRY_DIAGNOSTIC_ASSETS.characters.myshmatLegacy,
  conditionIconApples: ENTRY_DIAGNOSTIC_ASSETS.pojmat.conditionIconApples,
  btnNavArrow: ENTRY_DIAGNOSTIC_ASSETS.icons.btnNavArrow,
  btnArrowLeft: ENTRY_DIAGNOSTIC_ASSETS.icons.btnNavArrow,
  btnArrowRight: ENTRY_DIAGNOSTIC_ASSETS.icons.btnNavArrow,
  titleChip: ENTRY_DIAGNOSTIC_ASSETS.pojmat.titleChip,
  chipTimer: ENTRY_DIAGNOSTIC_ASSETS.icons.chipTimer,
  chipStarScore: ENTRY_DIAGNOSTIC_ASSETS.icons.chipStarScore,
} as const;

/** Плашка условия внутри арены */
export const POJMAT_PLATE_LAYOUT = {
  topMm: 2,
  sideCm: 0.7,
  laneTopPct: 21,
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
