import type { ScreenSpec } from "@/data/screen-spec";
import type { RemaindersStepKind } from "./types";

/** Профиль снятия опоры в детском маршруте «Остатки как домики» */
export type RemaindersProgressionProfile = 1 | 2 | 3 | 4;

const SKIPPED_KINDS: Record<RemaindersProgressionProfile, RemaindersStepKind[]> = {
  1: [],
  2: ["intro_video"],
  3: ["intro_video", "method_rule", "divisibility_example", "houses_count_quiz"],
  4: ["intro_video", "method_rule", "divisibility_example", "houses_count_quiz"],
};

/** Линейные шаги метода, которые в профиле 4 собираются в choose_method */
export const CHOOSE_METHOD_SUBSTEPS = [
  "find_modulus",
  "build_houses",
  "identify_objects",
  "find_collision",
  "explain_divisibility",
] as const satisfies readonly RemaindersStepKind[];

export type ChooseMethodSubstep = (typeof CHOOSE_METHOD_SUBSTEPS)[number];

export function shouldShowRuleScreen(profile: RemaindersProgressionProfile): boolean {
  return profile <= 2;
}

export function isCompactRuleScreen(profile: RemaindersProgressionProfile): boolean {
  return profile === 2;
}

/** Отфильтровать screenSequence по progressionProfile */
export function filterSequenceByProfile(
  sequence: ScreenSpec[],
  profile: RemaindersProgressionProfile,
  showRuleScreen: boolean,
): ScreenSpec[] {
  const skipped = new Set(SKIPPED_KINDS[profile]);

  const filtered = sequence.filter((spec) => {
    const kind = spec.stepKind as RemaindersStepKind | undefined;
    if (!kind) return true;
    if (kind === "method_rule") return showRuleScreen && !skipped.has(kind);
    if (skipped.has(kind)) return false;
    if (profile === 4 && CHOOSE_METHOD_SUBSTEPS.includes(kind as ChooseMethodSubstep)) return false;
    return true;
  });

  if (profile !== 4) return filtered;

  const readIdx = filtered.findIndex((s) => s.stepKind === "read_condition");
  const writeIdx = filtered.findIndex((s) => s.stepKind === "write_solution");
  if (readIdx < 0 || writeIdx < 0) return filtered;

  const hub: ScreenSpec = {
    screen: 0,
    title: "Выбери следующий шаг",
    childAction: "Самостоятельно пройти шаги метода в удобном порядке.",
    stepKind: "choose_method",
  };

  const before = filtered.slice(0, readIdx + 1);
  const after = filtered.slice(writeIdx);
  return [...before, hub, ...after];
}
