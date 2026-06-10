import type { ParkomatGate } from "@/data/entry-diagnostic/mini-games/parkomat-rounds";
import type { ParkomatLayout } from "./parkomat-assets";

export type CarPose = { x: number; y: number; rotate: number };

export type CarPathStep = CarPose & {
  durationMs: number;
  /** Точка шлагбаума — здесь проверяем, открыт ли правильный путь */
  gateTrigger?: boolean;
};

type PathSet = {
  approach: CarPathStep[];
  minusBranch: CarPathStep[];
  plusBranch: CarPathStep[];
};

/** Общий подъезд к развилке + ветка налево / направо (% координаты сцены) */
const PATHS: Record<ParkomatLayout, PathSet> = {
  desktop: {
    approach: [
      { x: 50, y: 86, rotate: 0, durationMs: 0 },
      { x: 50, y: 78, rotate: 0, durationMs: 620 },
      { x: 50, y: 71, rotate: 0, durationMs: 580 },
      { x: 50, y: 64, rotate: 0, durationMs: 520 },
    ],
    minusBranch: [
      { x: 48, y: 58, rotate: -5, durationMs: 420 },
      { x: 44, y: 52, rotate: -11, durationMs: 420 },
      { x: 40, y: 47, rotate: -15, durationMs: 400 },
      { x: 36, y: 42, rotate: -19, durationMs: 380, gateTrigger: true },
      { x: 31, y: 35, rotate: -22, durationMs: 480 },
      { x: 26, y: 27, rotate: -25, durationMs: 520 },
      { x: 22, y: 19, rotate: -27, durationMs: 560 },
    ],
    plusBranch: [
      { x: 52, y: 58, rotate: 5, durationMs: 420 },
      { x: 56, y: 52, rotate: 11, durationMs: 420 },
      { x: 60, y: 47, rotate: 15, durationMs: 400 },
      { x: 64, y: 42, rotate: 19, durationMs: 380, gateTrigger: true },
      { x: 69, y: 35, rotate: 22, durationMs: 480 },
      { x: 74, y: 27, rotate: 25, durationMs: 520 },
      { x: 78, y: 19, rotate: 27, durationMs: 560 },
    ],
  },
  tablet: {
    approach: [
      { x: 50, y: 88, rotate: 0, durationMs: 0 },
      { x: 50, y: 79, rotate: 0, durationMs: 620 },
      { x: 50, y: 72, rotate: 0, durationMs: 580 },
      { x: 50, y: 66, rotate: 0, durationMs: 520 },
    ],
    minusBranch: [
      { x: 48, y: 60, rotate: -5, durationMs: 420 },
      { x: 43, y: 54, rotate: -11, durationMs: 420 },
      { x: 38, y: 49, rotate: -15, durationMs: 400 },
      { x: 34, y: 44, rotate: -18, durationMs: 380, gateTrigger: true },
      { x: 29, y: 37, rotate: -21, durationMs: 480 },
      { x: 24, y: 29, rotate: -24, durationMs: 520 },
      { x: 20, y: 21, rotate: -26, durationMs: 560 },
    ],
    plusBranch: [
      { x: 52, y: 60, rotate: 5, durationMs: 420 },
      { x: 57, y: 54, rotate: 11, durationMs: 420 },
      { x: 62, y: 49, rotate: 15, durationMs: 400 },
      { x: 66, y: 44, rotate: 18, durationMs: 380, gateTrigger: true },
      { x: 71, y: 37, rotate: 21, durationMs: 480 },
      { x: 76, y: 29, rotate: 24, durationMs: 520 },
      { x: 80, y: 21, rotate: 26, durationMs: 560 },
    ],
  },
  mobile: {
    approach: [
      { x: 50, y: 90, rotate: 0, durationMs: 0 },
      { x: 50, y: 81, rotate: 0, durationMs: 620 },
      { x: 50, y: 74, rotate: 0, durationMs: 580 },
      { x: 50, y: 67, rotate: 0, durationMs: 520 },
    ],
    minusBranch: [
      { x: 48, y: 61, rotate: -5, durationMs: 420 },
      { x: 43, y: 55, rotate: -10, durationMs: 420 },
      { x: 38, y: 50, rotate: -14, durationMs: 400 },
      { x: 33, y: 45, rotate: -17, durationMs: 380, gateTrigger: true },
      { x: 28, y: 38, rotate: -20, durationMs: 480 },
      { x: 23, y: 30, rotate: -23, durationMs: 520 },
      { x: 19, y: 22, rotate: -25, durationMs: 560 },
    ],
    plusBranch: [
      { x: 52, y: 61, rotate: 5, durationMs: 420 },
      { x: 57, y: 55, rotate: 10, durationMs: 420 },
      { x: 62, y: 50, rotate: 14, durationMs: 400 },
      { x: 67, y: 45, rotate: 17, durationMs: 380, gateTrigger: true },
      { x: 72, y: 38, rotate: 20, durationMs: 480 },
      { x: 77, y: 30, rotate: 23, durationMs: 520 },
      { x: 81, y: 22, rotate: 25, durationMs: 560 },
    ],
  },
};

export function getApproachPath(layout: ParkomatLayout): CarPathStep[] {
  return PATHS[layout].approach;
}

export function getBranchPath(layout: ParkomatLayout, branch: ParkomatGate): CarPathStep[] {
  return branch === "minus" ? PATHS[layout].minusBranch : PATHS[layout].plusBranch;
}

/** Траектория раунда — всегда по правильной ветке условия */
export function getRoundDrivePath(layout: ParkomatLayout, correctGate: ParkomatGate): CarPathStep[] {
  return [...getApproachPath(layout), ...getBranchPath(layout, correctGate)];
}

export function findGateTriggerIndex(steps: CarPathStep[]): number {
  return steps.findIndex((s) => s.gateTrigger);
}
