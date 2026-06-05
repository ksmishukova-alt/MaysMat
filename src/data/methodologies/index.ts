import { DIRICHLET_METHODOLOGY } from "./dirichlet";
import { FAIRY_CAVES_METHODOLOGY } from "./fairy-caves";
import { HEADS_LEGS_METHODOLOGY } from "./heads-legs";
import {
  getMethodologyForTheme,
  THEME_BRANCH_MAP,
} from "@/data/methodology-bank/theme-branches";
import type { TopicMethodology } from "./types";

export type { TopicMethodology, MethodLadderStep } from "./types";

const BY_BRANCH: Record<string, TopicMethodology> = {
  "modeling-heads-legs": HEADS_LEGS_METHODOLOGY,
  "fairy-caves": FAIRY_CAVES_METHODOLOGY,
  "proof-dirichlet": DIRICHLET_METHODOLOGY,
};

for (const themeId of Object.keys(THEME_BRANCH_MAP)) {
  const methodology = getMethodologyForTheme(themeId);
  if (methodology && methodology.branchId !== "proof-dirichlet") {
    BY_BRANCH[methodology.branchId] = methodology;
  }
}

export function getMethodology(branchId: string): TopicMethodology | undefined {
  return BY_BRANCH[branchId];
}
