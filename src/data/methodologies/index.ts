import { DIRICHLET_METHODOLOGY } from "./dirichlet";
import { FAIRY_CAVES_METHODOLOGY } from "./fairy-caves";
import { HEADS_LEGS_METHODOLOGY } from "./heads-legs";
import type { TopicMethodology } from "./types";

export type { TopicMethodology, MethodLadderStep } from "./types";

const BY_BRANCH: Record<string, TopicMethodology> = {
  "modeling-heads-legs": HEADS_LEGS_METHODOLOGY,
  "fairy-caves": FAIRY_CAVES_METHODOLOGY,
  "proof-dirichlet": DIRICHLET_METHODOLOGY,
};

export function getMethodology(branchId: string): TopicMethodology | undefined {
  return BY_BRANCH[branchId];
}
