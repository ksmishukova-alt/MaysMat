/**
 * Publishing guards для Heads-Legs — без зависимости от build-task (разрыв цикла импортов).
 */
import { HEADS_LEGS_CATALOG } from "./catalog.generated";

export type PublishRecommendation =
  | "childRoute"
  | "publicationCandidate"
  | "reserve"
  | "blocked"
  | "methodistOnly";

/** Каноническая рекомендация публикации по methodTaskId */
export const CANONICAL_PUBLISH_BY_METHOD: Record<string, PublishRecommendation> = {
  "1.1": "childRoute",
  "1.2": "childRoute",
  "1.3": "childRoute",
  "1.4": "childRoute",
  "1.5": "childRoute",
  "1.6": "childRoute",
  "1.7": "childRoute",
  "1.8": "childRoute",
  "1.9": "reserve",
  "1.10": "reserve",
  "1.11": "reserve",
  "1.13": "reserve",
  "1.14": "reserve",
  "2.1": "childRoute",
  "2.2": "childRoute",
  "2.3": "childRoute",
  "2.4": "childRoute",
  "2.5": "childRoute",
  "2.6": "childRoute",
  "2.7": "childRoute",
  "3.1": "reserve",
  "3.2": "childRoute",
  "3.3": "childRoute",
  "3.4": "childRoute",
  "3.5": "childRoute",
  "3.6": "childRoute",
  "3.7": "childRoute",
  "4.1": "childRoute",
  "4.2": "childRoute",
  "4.3": "childRoute",
  "4.4": "childRoute",
  "4.5": "childRoute",
  "5.1": "reserve",
  "5.2": "reserve",
  "5.3": "publicationCandidate",
  "5.4": "reserve",
  "5.5": "blocked",
  "5.6": "publicationCandidate",
  "5.7": "blocked",
  "6.1": "reserve",
  "6.2": "reserve",
  "6.3": "reserve",
  "6.4": "reserve",
  "6.5": "reserve",
  "7.1": "reserve",
  "7.2": "reserve",
  "7.3": "reserve",
  "7.4": "reserve",
  "7.5": "reserve",
  "7.6": "methodistOnly",
  "7.7": "reserve",
};

export const PATTERN5_FROZEN = true;

/** После smoke + e2e — явный allowlist publicationCandidate в childRoute */
export const PUBLICATION_CANDIDATE_CHILD_ROUTE_ALLOWLIST = new Set<string>([]);

export interface HeadsLegsAuditPublishGuard {
  canonicalPublishRecommendation: PublishRecommendation;
  legacyPatternId: number;
  pattern5Frozen: boolean;
  canAutoPublish: boolean;
}

export function getHeadsLegsAuditPublishGuard(taskId: string): HeadsLegsAuditPublishGuard | undefined {
  const entry = HEADS_LEGS_CATALOG.find((e) => e.id === taskId);
  if (!entry) return undefined;
  const canonicalPublishRecommendation = CANONICAL_PUBLISH_BY_METHOD[entry.methodTaskId];
  if (!canonicalPublishRecommendation) return undefined;
  const canAutoPublish =
    canonicalPublishRecommendation === "childRoute" ||
    (canonicalPublishRecommendation === "publicationCandidate" &&
      PUBLICATION_CANDIDATE_CHILD_ROUTE_ALLOWLIST.has(taskId));
  return {
    canonicalPublishRecommendation,
    legacyPatternId: entry.patternId,
    pattern5Frozen: PATTERN5_FROZEN,
    canAutoPublish,
  };
}

export function canAutoPublishToChildRoute(taskId: string): boolean {
  return getHeadsLegsAuditPublishGuard(taskId)?.canAutoPublish ?? false;
}
