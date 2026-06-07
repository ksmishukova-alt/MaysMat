import type { Pattern5CompletenessRecord } from "../pattern-5/completeness-audit";

/** Все данные для стандартной замены уже явно в условии — derive-base не нужен */
export function hasExplicitStandardReplacementData(
  record: Pick<
    Pattern5CompletenessRecord,
    | "derivationKind"
    | "totalParticipants"
    | "replacementFeatureTotal"
    | "replacementFeatureFirst"
    | "replacementFeatureSecond"
  >,
): boolean {
  return (
    record.derivationKind === "standard_replace" &&
    record.totalParticipants != null &&
    record.replacementFeatureTotal != null &&
    record.replacementFeatureFirst != null &&
    record.replacementFeatureSecond != null
  );
}
