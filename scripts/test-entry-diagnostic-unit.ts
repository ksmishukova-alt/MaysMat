/**
 * Unit tests: validation + scoring + registries
 * npm run test:entry-diagnostic
 */
import { assertRunnerRegistryComplete } from "../src/lib/entry-diagnostic/runner-registry";
import { assertMiniGameRegistryComplete } from "../src/lib/entry-diagnostic/minigame-registry";
import {
  buildDiagnosticReport,
  scoreTaskAttempt,
  assertMaxScoreInvariant,
} from "../src/data/entry-diagnostic/scoring";
import {
  validateTaskResponse,
  validateAllRules,
} from "../src/data/entry-diagnostic/validation";
import { ENTRY_DIAGNOSTIC_BLOCKS } from "../src/data/entry-diagnostic/blocks/index";

let failed = 0;

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`✗ ${msg}`);
    failed++;
  } else {
    console.log(`✓ ${msg}`);
  }
}

console.log("=== Unit: Entry Diagnostic v2 ===\n");

try {
  assertMaxScoreInvariant();
  assertRunnerRegistryComplete();
  assertMiniGameRegistryComplete();
  assert(true, "registries complete");
} catch (e) {
  assert(false, String(e));
}

assert(scoreTaskAttempt(2, true) === 2, "score weight 2 correct");
assert(scoreTaskAttempt(2, false) === 0, "score weight 2 wrong");

const rules = [{ type: "numericEquals" as const, field: "value", value: 42 }];
assert(validateAllRules(rules, { value: 42 }), "numericEquals exact");
assert(!validateAllRules(rules, { value: 41 }), "numericEquals reject");

const exact = [{ type: "exact" as const, field: "focus", value: "всего" }];
assert(validateAllRules(exact, { focus: "  Всего " }), "exact normalized");

const outcome = validateTaskResponse(
  { value: 99 },
  [{ type: "numericEquals", field: "value", value: 10 }],
  { value: 10 },
  undefined,
  ["calculation_error", "order_error"],
);
assert(!outcome.correct, "wrong answer not correct");
assert(outcome.errorTypes.includes("calculation_error"), "error cluster tag");

const report = buildDiagnosticReport("test-1", [], []);
assert(report.maxTotalScore === 90, "report max 90");
assert(report.scoreByBlock.length === 15, "report 15 blocks");

for (const block of ENTRY_DIAGNOSTIC_BLOCKS) {
  for (const task of block.tasks) {
    assert(
      validateAllRules(task.validationRules, task.answer),
      `${task.taskId} canonical answer validates`,
    );
  }
}

console.log(`\n=== Итого: ${failed} failures ===`);
process.exit(failed > 0 ? 1 : 0);
