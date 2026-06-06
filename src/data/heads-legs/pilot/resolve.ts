import { BASE_PATTERN_PILOT } from "../base-pattern/models";
import { VALUE_PATTERN_PILOT } from "../value-pattern/models";
import type { HeadsLegsPilotMeta } from "./types";

export function resolveHeadsLegsPilot(methodTaskId: string): HeadsLegsPilotMeta | undefined {
  const base = BASE_PATTERN_PILOT[methodTaskId];
  if (base) return { ...base, patternKind: "base" as const };
  return VALUE_PATTERN_PILOT[methodTaskId];
}

export const ALL_PILOT_METHOD_IDS = [
  ...Object.keys(BASE_PATTERN_PILOT),
  ...Object.keys(VALUE_PATTERN_PILOT),
];
