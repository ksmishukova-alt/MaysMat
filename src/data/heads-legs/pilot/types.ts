import type {
  HeadsLegsMethodRuleInstance,
  HeadsLegsProgressionProfile,
} from "@/data/method-rules/types";

export type { HeadsLegsProgressionProfile };

export interface HeadsLegsPilotMeta {
  progressionProfile: HeadsLegsProgressionProfile;
  ruleInstance: HeadsLegsMethodRuleInstance;
  /** base — ноги/колёса; value — расход/цена; production — кто сколько сделал; score — баллы */
  patternKind: "base" | "value" | "production" | "score";
  /** Отдельный режим pilot (не смешивать с классической заменой) */
  flowMode?: "standard" | "enumeration" | "multiple_answers";
}
