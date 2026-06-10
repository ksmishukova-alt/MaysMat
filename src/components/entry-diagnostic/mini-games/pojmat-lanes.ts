/** Центры дорожек (% от ширины арены) — desktop / mobile */
export const LANE_CENTERS_DESKTOP = [18, 39, 61, 82] as const;
export const LANE_CENTERS_MOBILE = [14, 38, 62, 86] as const;

export function laneCenterPercent(lane: number, mobile: boolean): number {
  const centers = mobile ? LANE_CENTERS_MOBILE : LANE_CENTERS_DESKTOP;
  return centers[Math.min(Math.max(lane, 0), centers.length - 1)] ?? centers[0];
}

export function laneLeftStyle(lane: number, mobile: boolean): { left: string; transform?: string } {
  return {
    left: `${laneCenterPercent(lane, mobile)}%`,
    transform: "translateX(-50%)",
  };
}
