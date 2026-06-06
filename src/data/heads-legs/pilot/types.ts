import type {
  HeadsLegsMethodRuleInstance,
  HeadsLegsProgressionProfile,
} from "@/data/method-rules/types";

export type { HeadsLegsProgressionProfile };

export interface HeadsLegsPilotMeta {
  progressionProfile: HeadsLegsProgressionProfile;
  ruleInstance: HeadsLegsMethodRuleInstance;
  /** base — ноги/колёса; value — расход/цена/количество */
  patternKind: "base" | "value";
}
