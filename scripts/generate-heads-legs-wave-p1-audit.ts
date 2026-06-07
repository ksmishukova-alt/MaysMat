/**
 * Генерация Wave P1 audit: single-path assume для childRoute 1.x–3.x
 * npm run generate:heads-legs-wave-p1
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { HEADS_LEGS_CATALOG } from "../src/data/heads-legs/catalog.generated";
import { HEADS_LEGS_TASKS } from "../src/data/heads-legs/build-task";
import { HEADS_LEGS_SCREEN_METHODOLOGY_AUDIT } from "../src/data/heads-legs/full-screen-methodology-audit";
import { DUAL_ASSUME_PATH_CONFIG } from "../src/data/heads-legs/derive-pattern/dual-assume-paths";
import { isChildVisible } from "../src/data/task-publishing/resolve";
import type {
  WaveP1AssumeAuditRow,
  WaveP1AssumeApproach,
  WaveP1AssumeCurrentState,
  WaveP1SecondPathStatus,
} from "../src/data/heads-legs/wave-p1/single-path-assume-audit.types";
import { WAVE_P1_RULE } from "../src/data/heads-legs/wave-p1/single-path-assume-audit.types";

const SPECIAL_DEFER: Record<string, { secondPath: WaveP1SecondPathStatus; approach: WaveP1AssumeApproach; decision: string; notes: string }> = {
  "1.2": {
    secondPath: "special",
    approach: "explicit_training_path",
    decision: "pending — explicit: тренируем через цыплят (змеи дают 0 ног)",
    notes: "Путь «все змеи» тривиален (0 ног); dual-path не нужен, нужна явная pedagogy.",
  },
  "1.5": {
    secondPath: "special",
    approach: "defer_special_flow",
    decision: "pending — derived_half_feature; assume вне scope классической замены",
    notes: "Prelude derived_half_feature; отдельный runner-контур.",
  },
  "1.8": {
    secondPath: "special",
    approach: "defer_legacy",
    decision: "pending — миграция DigitalTaskPlayer → progression pilot",
    notes: "Legacy digital; assume не в HeadsLegsRunner.",
  },
  "3.2": {
    secondPath: "no",
    approach: "already_ok",
    decision: "no change — enumeration flow, не classic assume",
    notes: "Перебор вариантов, не «представим что все одного вида».",
  },
  "3.7": {
    secondPath: "special",
    approach: "defer_special_flow",
    decision: "pending — multiple_answers / diagnostic",
    notes: "Несколько допустимых составов; assume не применим.",
  },
};

function stageFromMethodId(methodTaskId: string): 1 | 2 | 3 | null {
  const m = methodTaskId.match(/^(\d)\./);
  if (!m) return null;
  const s = Number(m[1]);
  if (s === 1 || s === 2 || s === 3) return s;
  return null;
}

function findAssumeScreen(audit: (typeof HEADS_LEGS_SCREEN_METHODOLOGY_AUDIT)[0]) {
  return audit.screens.find(
    (s) =>
      s.screenKind === "hl_dual_path_assume" ||
      (s.screenKind === "single_select" &&
        (/assume|предположение/i.test(s.screenTitle) || /assume/i.test(s.validationRule))),
  );
}

function currentState(
  audit: (typeof HEADS_LEGS_SCREEN_METHODOLOGY_AUDIT)[0],
  assume: ReturnType<typeof findAssumeScreen>,
): WaveP1AssumeCurrentState {
  if (audit.runner.includes("legacy")) return "legacy_digital";
  if (!assume) return "no_assume";
  if (assume.screenKind === "hl_dual_path_assume") return "dual_path";
  if (/explicitTrainingPath|тренируем путь|меньшего числа/i.test(assume.notes ?? "")) {
    return "explicit_training";
  }
  return "single_path_assume";
}

function recommendedApproach(
  secondPath: WaveP1SecondPathStatus,
  state: WaveP1AssumeCurrentState,
  profile: number,
): WaveP1AssumeApproach {
  if (state === "dual_path" || state === "explicit_training") return "already_ok";
  if (state === "no_assume" || state === "legacy_digital") return "defer_special_flow";
  if (secondPath === "no") return "already_ok";
  if (secondPath === "special") return "pending_review";
  // yes + single_path
  return profile <= 2 ? "explicit_training_path" : "dual_path";
}

function riskLevel(
  secondPath: WaveP1SecondPathStatus,
  state: WaveP1AssumeCurrentState,
  assume: ReturnType<typeof findAssumeScreen>,
): WaveP1AssumeAuditRow["risk"] {
  if (state === "dual_path" || state === "explicit_training" || secondPath === "no") return "none";
  if (state === "legacy_digital") return "high";
  if (secondPath === "special") return "low";
  const subjective = assume && /удобнее|получили/i.test(`${assume.childAction} ${assume.notes ?? ""}`);
  if (subjective) return "high";
  if (secondPath === "yes" && state === "single_path_assume") return "medium";
  return "low";
}

const rows: WaveP1AssumeAuditRow[] = [];

for (const entry of HEADS_LEGS_CATALOG) {
  const stage = stageFromMethodId(entry.methodTaskId);
  if (!stage) continue;

  const audit = HEADS_LEGS_SCREEN_METHODOLOGY_AUDIT.find((a) => a.taskId === entry.id);
  if (!audit) continue;

  const task = HEADS_LEGS_TASKS[entry.id];
  const childRoute = Boolean(task?.publishing && isChildVisible(task.publishing));
  const assume = findAssumeScreen(audit);
  const special = SPECIAL_DEFER[entry.methodTaskId];
  const hasDual = Boolean(DUAL_ASSUME_PATH_CONFIG[entry.methodTaskId]);
  const altPath = assume?.alternativeValidPath === true || audit.alternativeValidStrategies.length > 0;

  let secondPath: WaveP1SecondPathStatus = special?.secondPath ?? (altPath ? "yes" : "no");
  const state = hasDual ? "dual_path" : currentState(audit, assume);
  const profile = task?.headsLegsMeta?.progressionProfile ?? 1;

  let approach = special?.approach ?? recommendedApproach(secondPath, state, profile);
  if (hasDual) approach = "already_ok";

  let decision = special?.decision ?? "pending — выбрать dual_path или explicit_training_path";
  if (approach === "already_ok") decision = "no change";
  if (state === "single_path_assume" && secondPath === "yes") {
    decision = `pending — ${approach === "dual_path" ? "dual_path" : "explicit_training_path"} (profile ${profile})`;
  }

  const notes =
    special?.notes ??
    (assume?.notes ||
      (secondPath === "yes"
        ? `assumeKind=${task?.headsLegsMeta?.ruleInstance && "assumeKind" in task.headsLegsMeta.ruleInstance ? task.headsLegsMeta.ruleInstance.assumeKind : "?"}; второй путь не принимается`
        : undefined));

  rows.push({
    taskId: entry.id,
    methodTaskId: entry.methodTaskId,
    title: entry.title,
    stage,
    uiNumber: entry.number,
    childRoute,
    secondPathValid: secondPath,
    currentState: state,
    recommendedApproach: approach,
    risk: riskLevel(secondPath, state, assume),
    decision,
    notes,
  });
}

rows.sort((a, b) => a.uiNumber - b.uiNumber);

const inScope = rows.filter((r) => r.childRoute);
const p1Candidates = inScope.filter(
  (r) => r.secondPathValid === "yes" && r.currentState === "single_path_assume",
);

const outTs = join(process.cwd(), "src/data/heads-legs/wave-p1/single-path-assume-audit.ts");
const tsBody = `/**
 * Wave P1: single-path assume audit (stages 1–3).
 * Сгенерировано: scripts/generate-heads-legs-wave-p1-audit.ts
 */
import type { WaveP1AssumeAuditRow } from "./single-path-assume-audit.types";
export { WAVE_P1_RULE } from "./single-path-assume-audit.types";
export type { WaveP1AssumeAuditRow } from "./single-path-assume-audit.types";

/** Все задачи stages 1–3 (включая reserve). */
export const WAVE_P1_ASSUME_AUDIT: WaveP1AssumeAuditRow[] = ${JSON.stringify(rows, null, 2)} as WaveP1AssumeAuditRow[];

/** childRoute 1.x–3.x — scope волны P1 */
export const WAVE_P1_CHILD_ROUTE_SCOPE = WAVE_P1_ASSUME_AUDIT.filter((r) => r.childRoute);

/** Кандидаты на fix: второй путь valid + single-path assume */
export const WAVE_P1_FIX_CANDIDATES = WAVE_P1_CHILD_ROUTE_SCOPE.filter(
  (r) => r.secondPathValid === "yes" && r.currentState === "single_path_assume",
);
`;
writeFileSync(outTs, tsBody, "utf8");

const mdLines = [
  "# Wave P1: single-path assume cleanup (childRoute 1.x–3.x)",
  "",
  "Мини-проект **после** dual-path fix 5.2/5.6. **Не меняет** childRoute, allowlist, публикацию.",
  "",
  "## Правило волны",
  "",
  WAVE_P1_RULE,
  "",
  "Перегенерация: `npm run generate:heads-legs-wave-p1`",
  "",
  "## Сводка",
  "",
  `| Метрика | Значение |`,
  `|---|---|`,
  `| Задач stages 1–3 (все) | ${rows.length} |`,
  `| childRoute scope | ${inScope.length} |`,
  `| **P1 fix candidates** (2-й путь + single-path) | **${p1Candidates.length}** |`,
  `| Уже OK (dual/explicit/no assume) | ${inScope.filter((r) => r.recommendedApproach === "already_ok").length} |`,
  `| Defer (legacy/special) | ${inScope.filter((r) => r.recommendedApproach.startsWith("defer")).length} |`,
  "",
  "## P1 fix candidates (приоритет волны)",
  "",
  "| UI | ID | taskId | 2-й путь | Сейчас | Рекомендация | Риск | Решение |",
  "|---:|---|---|---|---|---|---|---|",
];

for (const r of p1Candidates) {
  mdLines.push(
    `| ${r.uiNumber} | ${r.methodTaskId} | \`${r.taskId}\` | ${r.secondPathValid} | ${r.currentState} | ${r.recommendedApproach} | ${r.risk} | ${r.decision} |`,
  );
}

mdLines.push("", "## Полная таблица (childRoute 1.x–3.x)", "");
mdLines.push("| UI | ID | title | 2-й путь | runner | рекомендация | риск | решение |");
mdLines.push("|---:|---|---|---|---|---|---|---|");
for (const r of inScope) {
  mdLines.push(
    `| ${r.uiNumber} | ${r.methodTaskId} | ${r.title} | ${r.secondPathValid} | ${r.currentState} | ${r.recommendedApproach} | ${r.risk} | ${r.decision} |`,
  );
}

mdLines.push("", "## Representative tasks для e2e/smoke (предложение)", "");
mdLines.push("- **1.1** — base pattern, profile 1, эталон explicit_training или dual_path");
mdLines.push("- **2.1** — value pattern, profile 1");
mdLines.push("- **3.3** — production pattern, profile 1");
mdLines.push("", "## Вне scope этой волны", "");
mdLines.push("- 4.x / 5.x (4.3 уже explicit_training; 5.2/5.6 dual_path methodistOnly)");
mdLines.push("- legacy reserve в childRoute (1.8) — отдельная миграция");
mdLines.push("- blocked 5.5/5.7");

const outMd = join(process.cwd(), "docs/heads-legs-wave-p1-single-path-assume.md");
writeFileSync(outMd, mdLines.join("\n"), "utf8");

console.log(`✓ ${rows.length} rows → ${outTs}`);
console.log(`✓ P1 candidates (childRoute): ${p1Candidates.length}`);
console.log(`✓ markdown → ${outMd}`);
