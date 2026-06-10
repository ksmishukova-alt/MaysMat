/** Количество игровых дорожек (первая версия) */
export const POJMAT_LANE_COUNT = 4;

/** Fallback-центры равной сетки 4×1 до первого измерения DOM */
export const DEFAULT_LANE_CENTERS_PCT = [12.5, 37.5, 62.5, 87.5] as const;

export function laneLeftStyle(
  lane: number,
  centersPct: readonly number[],
): { left: string; transform: string } {
  const index = Math.min(Math.max(lane, 0), centersPct.length - 1);
  return {
    left: `${centersPct[index] ?? 50}%`,
    transform: "translateX(-50%)",
  };
}

/** Ближайшая дорожка по X внутри арены */
export function laneIndexFromClientX(
  clientX: number,
  arenaRect: DOMRect,
  centersPct: readonly number[],
): number {
  const ratio = ((clientX - arenaRect.left) / arenaRect.width) * 100;
  let best = 0;
  let bestDist = Infinity;
  centersPct.forEach((center, index) => {
    const dist = Math.abs(ratio - center);
    if (dist < bestDist) {
      bestDist = dist;
      best = index;
    }
  });
  return best;
}
