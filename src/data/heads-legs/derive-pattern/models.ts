import type { HeadsLegsPilotMeta } from "../pilot/types";

/**
 * Pilot паттерна 5: prelude → стандартная замена.
 * Пока без подключённых задач — 5.3 это transfer, не derive.
 */
export const DERIVE_PATTERN_PILOT: Record<string, HeadsLegsPilotMeta> = {};

export const DERIVE_PATTERN_PILOT_METHOD_IDS = Object.keys(DERIVE_PATTERN_PILOT);

export const DERIVE_TRANSITION_TEMPLATE = [
  "Теперь решаем знакомым методом замены.",
  "",
  "Представим, что все существа одного вида — и посчитаем.",
];
