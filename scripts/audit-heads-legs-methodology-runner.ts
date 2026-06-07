/**
 * Аудит runner vs каноническая методология (51 задача).
 * npm run audit:heads-legs-runner
 */
import { HEADS_LEGS_TASKS } from "../src/data/heads-legs/build-task";
import {
  buildHeadsLegsPlayerSteps,
  isHeadsLegsProgressionTask,
} from "../src/data/heads-legs/base-pattern/build-player-steps";
import {
  HEADS_LEGS_FULL_METHODOLOGY_AUDIT,
  collectMethodologyAuditIssues,
  expectedPilotFlowMode,
  DERIVE_PRELUDE_TYPES,
  type FullMethodologyAuditRecord,
} from "../src/data/heads-legs/full-methodology-audit";
import { resolveHeadsLegsPilot } from "../src/data/heads-legs/pilot/resolve";
import { isChildVisible } from "../src/data/task-publishing/resolve";

type RunnerStatus =
  | "ok"
  | "legacy_digital"
  | "legacy_guided"
  | "derive_pilot"
  | "transfer_pilot"
  | "pattern_pilot"
  | "derive_expected_missing"
  | "classic_derive_path"
  | "flow_mismatch";

interface AuditRow {
  ui: number;
  methodId: string;
  title: string;
  primaryMethod: string;
  preludeType: string;
  profile: number;
  publish: string;
  runnerStatus: RunnerStatus;
  pilotFlow: string;
  expectedFlow: string;
  issues: string;
  action: string;
}

function classifyRunner(record: FullMethodologyAuditRecord): {
  status: RunnerStatus;
  action: string;
} {
  const task = HEADS_LEGS_TASKS[record.taskId];
  if (!task) return { status: "legacy_guided", action: "нет задачи" };

  if (!isHeadsLegsProgressionTask(task)) {
    return { status: "legacy_digital", action: "DigitalTaskPlayer (legacy)" };
  }

  const pilot = resolveHeadsLegsPilot(record.methodTaskId);
  const expected = expectedPilotFlowMode(record);
  const steps = buildHeadsLegsPlayerSteps(task);
  const hasParticipant = steps.some(
    (s) => s.type === "drag_select" && s.id.includes("-objects"),
  );
  const hasDerivePrelude = steps.some((s) => s.type === "hl_derive_prelude");

  const needsDerive = DERIVE_PRELUDE_TYPES.includes(
    record.preludeType as (typeof DERIVE_PRELUDE_TYPES)[number],
  );

  if (needsDerive && !pilot) {
    if (record.methodTaskId === "5.1") {
      return {
        status: "legacy_guided",
        action: "custom steps-5-1 (feature_switch) — OK для reserve",
      };
    }
    return {
      status: "derive_expected_missing",
      action: "нужен DERIVE_PATTERN_PILOT",
    };
  }

  if (needsDerive && pilot && !hasDerivePrelude) {
    return {
      status: "classic_derive_path",
      action: "derive в карте, но classic path (ошибка 5.6)",
    };
  }

  if (needsDerive && hasDerivePrelude) {
    return { status: "derive_pilot", action: "derive-base pilot" };
  }

  if (needsDerive && hasParticipant) {
    return {
      status: "classic_derive_path",
      action: "classic + «кто участвует» вместо derive",
    };
  }

  if (pilot?.flowMode === "transfer") {
    return { status: "transfer_pilot", action: "transfer pilot" };
  }

  if (pilot) {
    const effectiveFlow = pilot.flowMode ?? "standard";
    if (expected && effectiveFlow !== expected) {
      return {
        status: "flow_mismatch",
        action: `pilot ${effectiveFlow} ≠ expected ${expected}`,
      };
    }
    return {
      status: "pattern_pilot",
      action: `${pilot.patternKind} pilot p${pilot.progressionProfile}`,
    };
  }

  if (record.publishRecommendation === "childRoute") {
    return {
      status: "legacy_guided",
      action: "legacy guided в childRoute — см. warnings",
    };
  }

  return { status: "legacy_guided", action: "legacy guided / custom steps" };
}

const rows: AuditRow[] = [];

for (const record of [...HEADS_LEGS_FULL_METHODOLOGY_AUDIT].sort(
  (a, b) => a.catalogNumber - b.catalogNumber,
)) {
  const task = HEADS_LEGS_TASKS[record.taskId];
  const pilot = resolveHeadsLegsPilot(record.methodTaskId);
  const expected = expectedPilotFlowMode(record);
  const child = Boolean(task?.publishing && isChildVisible(task.publishing));
  const auditIssues = collectMethodologyAuditIssues(record, {
    childRouteVisible: child,
  });
  const { status, action } = classifyRunner(record);
  const effectiveFlow = pilot ? (pilot.flowMode ?? "standard") : "—";

  rows.push({
    ui: record.catalogNumber,
    methodId: record.methodTaskId,
    title: task?.title ?? record.taskId,
    primaryMethod: record.primaryMethod,
    preludeType: record.preludeType,
    profile: record.progressionProfile,
    publish: record.canonicalPublishRecommendation,
    runnerStatus: status,
    pilotFlow: effectiveFlow,
    expectedFlow: expected ?? "—",
    issues: auditIssues.length ? auditIssues.join(", ") : "—",
    action,
  });
}

console.log("=== Heads-Legs: runner vs методология (51) ===\n");

const fixed: AuditRow[] = [];
const ok: AuditRow[] = [];
const knownReserve: AuditRow[] = [];
const needsWork: AuditRow[] = [];

for (const r of rows) {
  if (r.methodId === "5.1") {
    knownReserve.push({
      ...r,
      action: "custom steps-5-1 (feature_switch) — OK для reserve",
    });
    continue;
  }
  if (r.methodId === "5.2" || r.methodId === "5.6") {
    if (r.runnerStatus === "derive_pilot") fixed.push(r);
    else needsWork.push(r);
  } else if (
    r.runnerStatus === "ok" ||
    r.runnerStatus === "derive_pilot" ||
    r.runnerStatus === "transfer_pilot" ||
    r.runnerStatus === "pattern_pilot"
  ) {
    ok.push(r);
  } else if (
    r.runnerStatus === "legacy_digital" ||
    r.runnerStatus === "legacy_guided" ||
    r.publish !== "childRoute"
  ) {
    knownReserve.push(r);
  } else {
    needsWork.push(r);
  }
}

function printTable(title: string, subset: AuditRow[]) {
  if (!subset.length) return;
  console.log(`\n### ${title} (${subset.length})\n`);
  console.log(
    "| UI | ID | Метод | Prelude | Prof | Публикация | Runner | Pilot | Действие |",
  );
  console.log("|---:|---|---|---|---:|---|---|---|---|");
  for (const r of subset) {
    console.log(
      `| ${r.ui} | ${r.methodId} | ${r.primaryMethod.slice(0, 22)} | ${r.preludeType} | ${r.profile} | ${r.publish} | ${r.runnerStatus} | ${r.pilotFlow} | ${r.action} |`,
    );
  }
}

printTable("Исправлено в этом инкременте (derive pilot)", fixed);
printTable("Соответствует методологии (pilot OK)", ok);
printTable("Reserve / legacy — по карте, не childRoute", knownReserve);
printTable("Требует отдельной работы", needsWork);

const errors = needsWork.filter(
  (r) =>
    r.runnerStatus === "derive_expected_missing" ||
    r.runnerStatus === "classic_derive_path" ||
    r.runnerStatus === "flow_mismatch",
).length;

console.log(`\n=== Критичных расхождений: ${errors} ===`);
process.exit(errors > 0 ? 1 : 0);
