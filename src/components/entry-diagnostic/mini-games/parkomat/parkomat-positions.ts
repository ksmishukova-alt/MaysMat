export type CarPositionKey =
  | "start"
  | "approach"
  | "minusGate"
  | "plusGate"
  | "minusExit"
  | "plusExit";

export type CarPosition = { x: number; y: number; rotate: number };

export const CAR_POSITIONS: Record<CarPositionKey, CarPosition> = {
  start: { x: 50, y: 86, rotate: 0 },
  approach: { x: 50, y: 62, rotate: 0 },
  minusGate: { x: 36, y: 42, rotate: -18 },
  plusGate: { x: 64, y: 42, rotate: 18 },
  minusExit: { x: 25, y: 20, rotate: -24 },
  plusExit: { x: 75, y: 20, rotate: 24 },
};

export const CAR_POSITIONS_MOBILE: Partial<Record<CarPositionKey, CarPosition>> = {
  start: { x: 50, y: 88, rotate: 0 },
  approach: { x: 50, y: 64, rotate: 0 },
  minusGate: { x: 32, y: 44, rotate: -16 },
  plusGate: { x: 68, y: 44, rotate: 16 },
};
