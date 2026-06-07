/**
 * QA экранного аудита «Головы и ноги».
 * npm run audit:heads-legs-screens
 */
import { HEADS_LEGS_TASKS } from "../src/data/heads-legs/build-task";
import { isChildVisible } from "../src/data/task-publishing/resolve";
import {
  HEADS_LEGS_SCREEN_METHODOLOGY_AUDIT,
  type TaskScreenMethodologyAudit,
} from "../src/data/heads-legs/full-screen-methodology-audit";
import { DUAL_ASSUME_PATH_CONFIG } from "../src/data/heads-legs/derive-pattern/dual-assume-paths";
import { hasExplicitTrainingPath } from "../src/data/heads-legs/wave-p1/explicit-training-paths";
import { DERIVE_PRELUDE_TYPES } from "../src/data/heads-legs/full-methodology-audit";

let errors = 0;
let warnings = 0;

function fail(msg: string) {
  console.error(`✗ ${msg}`);
  errors++;
}

function warn(msg: string) {
  console.warn(`⚠ ${msg}`);
  warnings++;
}

console.log("=== Heads-Legs screen methodology audit ===\n");

for (const audit of HEADS_LEGS_SCREEN_METHODOLOGY_AUDIT) {
  if (audit.screens.length === 0) {
    fail(`${audit.taskId}: нет экранов`);
    continue;
  }

  for (const sc of audit.screens) {
    if (!sc.expectedAnswer || sc.expectedAnswer === "") {
      fail(`${audit.taskId} экран ${sc.screenNumber}: пустой expectedAnswer`);
    }
    if (!sc.validationRule || sc.validationRule === "") {
      fail(`${audit.taskId} экран ${sc.screenNumber}: пустой validationRule`);
    }
    if (sc.screenKind === "single_select" && /удобнее/i.test(`${sc.childAction}`)) {
      fail(`${audit.taskId} экран ${sc.screenNumber}: субъективный вопрос без критерия`);
    }
  }

  if (audit.alternativeValidStrategies.length > 0) {
    const dual = DUAL_ASSUME_PATH_CONFIG[audit.methodTaskId];
    const hasDualStep = audit.screens.some((s) => s.screenKind === "hl_dual_path_assume");
    const hasExplicitTraining =
      hasExplicitTrainingPath(audit.methodTaskId) ||
      audit.requiredFixes.some((f) => /explicitTrainingPath/i.test(f));
    if (dual && !hasDualStep && !hasExplicitTraining) {
      fail(
        `${audit.taskId}: alternativeValidStrategies без dual-path runner или explicitTrainingPath`,
      );
    }
  }

  const needsDerive = DERIVE_PRELUDE_TYPES.includes(
    audit.preludeType as (typeof DERIVE_PRELUDE_TYPES)[number],
  );
  if (needsDerive && audit.runner.includes("derive")) {
    const firstMeaningful = audit.screens.find(
      (s) => s.screenKind !== "read_condition",
    );
    if (firstMeaningful?.screenKind !== "hl_derive_prelude") {
      fail(`${audit.taskId}: derive-задача — первый смысловой шаг не prelude`);
    }
  }

  if (audit.solutionMode === "transfer") {
    for (const sc of audit.screens) {
      if (/сначала нужно собрать|derive-prelude/i.test(sc.notes ?? "")) {
        fail(`${audit.taskId}: transfer с derive-text на экране ${sc.screenNumber}`);
      }
    }
  }

  const task = HEADS_LEGS_TASKS[audit.taskId];
  const childVisible = Boolean(task?.publishing && isChildVisible(task.publishing));
  if (childVisible) {
    const high = audit.screens.filter((s) => s.riskLevel === "high");
    const mediumAssume = audit.screens.filter(
      (s) => s.riskLevel === "medium" && s.screenKind === "single_select" && /assume|предположение/i.test(s.screenTitle),
    );
    if (high.length) {
      if (audit.runner.includes("legacy")) {
        warn(
          `${audit.taskId} childRoute legacy tolerated: ${high.map((h) => h.screenTitle).join(", ")}`,
        );
      } else {
        fail(
          `${audit.taskId} childRoute: high-risk экраны: ${high.map((h) => h.screenTitle).join(", ")}`,
        );
      }
    }
    if (mediumAssume.length) {
      warn(
        `${audit.taskId} childRoute: assume single-path (P1): ${mediumAssume.map((h) => h.screenTitle).join(", ")}`,
      );
    }
  }

  if (audit.publishRecommendation === "blocked" && childVisible) {
    fail(`${audit.taskId}: blocked, но видна в childRoute`);
  }
}

// P0 sanity
const p0 = ["5.2", "5.6", "5.3"];
for (const id of p0) {
  const a = HEADS_LEGS_SCREEN_METHODOLOGY_AUDIT.find((r) => r.methodTaskId === id);
  if (!a) fail(`P0 ${id}: нет в аудите`);
}

const dual52 = HEADS_LEGS_SCREEN_METHODOLOGY_AUDIT.find((r) => r.methodTaskId === "5.2");
if (dual52 && !dual52.screens.some((s) => s.screenKind === "hl_dual_path_assume")) {
  fail("5.2: нет hl_dual_path_assume");
}

console.log(`\n=== Итого: ${errors} ошибок, ${warnings} предупреждений ===`);
process.exit(errors > 0 ? 1 : 0);
