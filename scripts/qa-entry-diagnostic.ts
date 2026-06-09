/**
 * QA: Entry Diagnostic v2 — data validation + scoring
 * npm run qa:entry-diagnostic
 */
import {
  ALL_RUNNER_KINDS,
  ENTRY_DIAGNOSTIC_BLOCKS,
  ENTRY_DIAGNOSTIC_MAX_SCORE,
  ALL_MINI_GAME_IDS,
  assertMaxScoreInvariant,
  scoreTaskAttempt,
  validateAllRules,
} from "../src/data/entry-diagnostic";
import { ENTRY_DIAGNOSTIC_MINI_GAMES } from "../src/data/entry-diagnostic/mini-games";
import { assertRunnerRegistryComplete } from "../src/lib/entry-diagnostic/runner-registry-meta";
import { assertMiniGameRegistryComplete } from "../src/lib/entry-diagnostic/minigame-registry-meta";
import { assertRunnerBoardRegistryComplete } from "../src/lib/entry-diagnostic/runner-board-registry-meta";

let errors = 0;

function fail(msg: string) {
  console.error(`✗ ${msg}`);
  errors++;
}

function ok(msg: string) {
  console.log(`✓ ${msg}`);
}

console.log("=== QA: Entry Diagnostic v2 ===\n");

try {
  assertMaxScoreInvariant();
  assertRunnerRegistryComplete();
  assertMiniGameRegistryComplete();
  assertRunnerBoardRegistryComplete();
  ok(`max score = ${ENTRY_DIAGNOSTIC_MAX_SCORE}`);
} catch (e) {
  fail(String(e));
}

if (ENTRY_DIAGNOSTIC_BLOCKS.length !== 15) {
  fail(`expected 15 blocks, got ${ENTRY_DIAGNOSTIC_BLOCKS.length}`);
} else {
  ok("15 blocks");
}

for (const block of ENTRY_DIAGNOSTIC_BLOCKS) {
  if (block.tasks.length !== 3) {
    fail(`${block.blockId}: expected 3 tasks`);
    continue;
  }
  const diffs = block.tasks.map((t) => t.difficulty).sort().join(",");
  if (diffs !== "D1,D2,D3") {
    fail(`${block.blockId}: difficulties ${diffs}`);
  }
  const weights = block.tasks.map((t) => t.scoreWeight).sort((a, b) => a - b).join(",");
  if (weights !== "1,2,3") {
    fail(`${block.blockId}: weights ${weights}`);
  }
  if (!ALL_RUNNER_KINDS.includes(block.runnerKind)) {
    fail(`${block.blockId}: unknown runner ${block.runnerKind}`);
  }
  for (const task of block.tasks) {
    if (!task.validationRules.length) fail(`${task.taskId}: no validationRules`);
    if (!task.errorTypes.length) fail(`${task.taskId}: no errorTypes`);
    if (!task.screenSequence.length) fail(`${task.taskId}: no screenSequence`);
    const valid = validateAllRules(task.validationRules, task.answer);
    if (!valid) fail(`${task.taskId}: canonical answer fails validation`);
  }
}

ok("block task structure");

if (ENTRY_DIAGNOSTIC_MINI_GAMES.length !== 16) {
  fail(`expected 16 mini-games, got ${ENTRY_DIAGNOSTIC_MINI_GAMES.length}`);
} else {
  ok("16 mini-games");
}

for (const mg of ENTRY_DIAGNOSTIC_MINI_GAMES) {
  if (mg.diagnostic.showFeedbackDuringGame !== false) {
    fail(`${mg.miniGameId}: diagnostic must hide feedback`);
  }
  if (!mg.diagnostic.largeTargets) {
    fail(`${mg.miniGameId}: diagnostic needs largeTargets`);
  }
  if (mg.diagnostic.durationSec !== 100) {
    fail(`${mg.miniGameId}: diagnostic durationSec should be 100`);
  }
}

ok("mini-game diagnostic config");

if (scoreTaskAttempt(1, true) !== 1 || scoreTaskAttempt(3, false) !== 0) {
  fail("scoring weights broken");
} else {
  ok("scoring weights");
}

const ids = new Set(ALL_MINI_GAME_IDS);
if (ids.size !== 16) fail("duplicate mini-game ids");

console.log(`\n=== Итого: ${errors} ошибок ===`);
process.exit(errors > 0 ? 1 : 0);
