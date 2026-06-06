/**
 * E2E smoke (scriptable): ветки, архив, guard прямых ссылок.
 * npm run qa:smoke
 */
import { DIRICHLET_TASKS } from "../src/data/dirichlet/build-task";
import { HEADS_LEGS_TASKS } from "../src/data/heads-legs/build-task";
import { getBranchBySlug, resolveBranchSlug } from "../src/data/thinking-map";
import {
  countArchiveTasks,
  countChildVisibleTasks,
  filterBranchTasksForList,
} from "../src/lib/branch-task-filter";
import { canAccessTask, parseTaskAccessMode } from "../src/lib/task-access-mode";
import { isChildVisible } from "../src/data/task-publishing/resolve";
import { resolveRunnerKind } from "../src/lib/resolve-runner-kind";
import { buildUnluckySteps } from "../src/data/dirichlet/unlucky/build-unlucky-steps";
import { buildRemaindersSteps } from "../src/data/dirichlet/remainders/build-remainders-steps";
import { remaindersHousesRule } from "../src/data/method-rules";
import { validateBlankChipConfiguration } from "../src/lib/word-solution-mode-a";
import type { Task } from "../src/data/tasks";

const allTasks = { ...HEADS_LEGS_TASKS, ...DIRICHLET_TASKS };

function branchTasks(branchId: string): Task[] {
  return Object.values(allTasks).filter((t) => t.branchId === branchId);
}

let errors = 0;

function fail(msg: string) {
  console.error(`✗ ${msg}`);
  errors++;
}

function ok(msg: string) {
  console.log(`✓ ${msg}`);
}

console.log("=== QA: route smoke ===\n");

// 1. Slug alias proof-constructions → constructions
if (resolveBranchSlug("proof-constructions") !== "constructions") {
  fail("resolveBranchSlug(proof-constructions) → constructions");
} else {
  ok("slug alias proof-constructions → constructions");
}

const branchViaAlias = getBranchBySlug("proof-constructions");
if (!branchViaAlias || branchViaAlias.id !== "proof-constructions") {
  fail("getBranchBySlug(proof-constructions) resolves branch");
} else {
  ok("getBranchBySlug(proof-constructions)");
}

// 2. /branch/dirichlet — только child visible
{
  const tasks = branchTasks("proof-dirichlet");
  const listed = filterBranchTasksForList(tasks, { methodologyBank: true, showArchive: false });
  const bad = listed.filter((t) => t.publishing && !isChildVisible(t.publishing));
  if (bad.length) fail(`dirichlet list: ${bad.length} non-child tasks`);
  else ok(`dirichlet: ${listed.length} child-route tasks (expected ≥8)`);
  if (listed.length < 8) fail(`dirichlet: too few tasks (${listed.length})`);
}

// 3. /branch/unlucky — только child visible
{
  const tasks = branchTasks("proof-unlucky");
  const listed = filterBranchTasksForList(tasks, { methodologyBank: true, showArchive: false });
  const bad = listed.filter((t) => t.publishing && !isChildVisible(t.publishing));
  if (bad.length) fail(`unlucky list: ${bad.length} non-child tasks`);
  else ok(`unlucky: ${listed.length} child-route task(s)`);
  if (listed.length < 1) fail("unlucky: expected ≥1 child task (M3.2)");
  for (const t of listed) {
    if (resolveRunnerKind(t) !== "dirichlet-unlucky") {
      fail(`unlucky child ${t.id}: runnerKind !== dirichlet-unlucky`);
    }
    if (t.steps.length > 0) {
      fail(`unlucky child ${t.id}: не должно быть generic steps`);
    }
    const steps = buildUnluckySteps(t.dirichletMeta!);
    const required = [
      "read_condition",
      "guarantee_goal",
      "worst_case",
      "guarantee_plus_one",
      "explain_why_less_fails",
      "write_solution",
      "finish",
    ] as const;
    for (const kind of required) {
      if (!steps.some((s) => s.kind === kind)) {
        fail(`unlucky ${t.id}: нет шага ${kind}`);
      }
    }
  }
  if (listed.length >= 1) {
    ok(`unlucky runner pipeline для childRoute (${listed.map((t) => t.id).join(", ")})`);
  }
}

// 3b. remainders pilot — dirichlet-t3-11 (child route)
{
  const pilot = allTasks["dirichlet-t3-11"];
  if (!pilot) {
    fail("dirichlet-t3-11 не найдена");
  } else {
    if (resolveRunnerKind(pilot) !== "dirichlet-remainders") {
      fail("dirichlet-t3-11: runnerKind !== dirichlet-remainders");
    }
    if (pilot.steps.length > 0) {
      fail("dirichlet-t3-11: не должно быть generic steps");
    }
    if (!canAccessTask(pilot, "child")) {
      fail("dirichlet-t3-11: должна быть доступна без mode=methodist");
    }
    if (!canAccessTask(pilot, "methodist")) {
      fail("dirichlet-t3-11: недоступна в mode=methodist");
    }
    const steps = buildRemaindersSteps(pilot.dirichletMeta!);
    const required = [
      "intro_video",
      "method_rule",
      "read_condition",
      "find_modulus",
      "build_houses",
      "houses_count_quiz",
      "identify_objects",
      "find_collision",
      "divisibility_example",
      "explain_divisibility",
      "write_solution",
      "finish",
    ] as const;
    for (const kind of required) {
      if (!steps.some((s) => s.kind === kind)) {
        fail(`dirichlet-t3-11: нет шага ${kind}`);
      }
    }
    const m = pilot.dirichletMeta!.remaindersModel!;
    if (m.modulus !== 11 || m.objectsCount !== 12) {
      fail(`dirichlet-t3-11: модель ${m.modulus}/${m.objectsCount}`);
    }
    if (!m.ruleInstance?.showRuleScreen) {
      fail("dirichlet-t3-11: showRuleScreen");
    }
    if (!remaindersHousesRule.anchorPhrase.includes("Остаток всегда меньше")) {
      fail("dirichlet-t3-11: anchorPhrase правила");
    }
    const chipCheck = validateBlankChipConfiguration(m.writeSolutionLines ?? [], "reusable");
    if (!chipCheck.ok) fail(`dirichlet-t3-11 write_solution: ${chipCheck.message}`);
    if (pilot.title.includes("…")) fail("dirichlet-t3-11: обрезанный title");
    if (!pilot.condition.includes("12 различных двузначных")) {
      fail("dirichlet-t3-11: condition неполное на этапе read");
    }
    ok("dirichlet-t3-11: childRoute + rule screen + 12 шагов + reusable blanks");
  }
}

// 3b2. arith-remainders branch — t3-11 в детском списке
{
  const tasks = branchTasks("arith-remainders");
  const listed = filterBranchTasksForList(tasks, { methodologyBank: true, showArchive: false });
  const t311 = listed.find((t) => t.id === "dirichlet-t3-11");
  if (!t311) fail("arith-remainders: dirichlet-t3-11 не в childRoute списке");
  else ok(`arith-remainders: ${listed.length} child-route задач(а), включая t3-11`);
}

// 3c. remainders pilot — dirichlet-t3-18
{
  const pilot = allTasks["dirichlet-t3-18"];
  if (!pilot) {
    fail("dirichlet-t3-18 не найдена");
  } else {
    if (resolveRunnerKind(pilot) !== "dirichlet-remainders") {
      fail("dirichlet-t3-18: runnerKind !== dirichlet-remainders");
    }
    const steps = buildRemaindersSteps(pilot.dirichletMeta!);
    if (!steps.some((s) => s.kind === "houses_count_quiz")) {
      fail("dirichlet-t3-18: нет houses_count_quiz");
    }
    if (steps.some((s) => s.kind === "method_rule")) {
      fail("dirichlet-t3-18: лишний method_rule");
    }
    const m = pilot.dirichletMeta!.remaindersModel!;
    if (!m.compactHouses) fail("dirichlet-t3-18: нужен compactHouses");
    const chipCheck = validateBlankChipConfiguration(m.writeSolutionLines ?? [], "reusable");
    if (!chipCheck.ok) fail(`dirichlet-t3-18 write_solution: ${chipCheck.message}`);
    if (pilot.title.includes("…")) fail("dirichlet-t3-18: обрезанный title");
    if (pilot.title !== "2001 число и остатки по модулю 2000") {
      fail(`dirichlet-t3-18: title «${pilot.title}»`);
    }
    if (!pilot.condition.includes("2001 целых чисел")) {
      fail("dirichlet-t3-18: condition неполное");
    }
    ok("dirichlet-t3-18: RemaindersRunner pipeline (2001 > 2000, compact houses)");
  }
}

// 4. /branch/constructions — архив скрыт по умолчанию
{
  const tasks = branchTasks("proof-constructions");
  const childTotal = countChildVisibleTasks(tasks);
  const archiveTotal = countArchiveTasks(tasks);
  const listedDefault = filterBranchTasksForList(tasks, {
    methodologyBank: true,
    showArchive: false,
  });
  const listedArchive = filterBranchTasksForList(tasks, {
    methodologyBank: true,
    showArchive: true,
  });

  if (listedDefault.length !== childTotal) {
    fail(`constructions default: ${listedDefault.length} listed, expected ${childTotal}`);
  } else {
    ok(`constructions default: ${listedDefault.length} tasks (no archive)`);
  }

  if (listedArchive.length !== childTotal + archiveTotal) {
    fail(
      `constructions+archive: ${listedArchive.length} listed, expected ${childTotal + archiveTotal}`,
    );
  } else {
    ok(`constructions+archive toggle: ${listedArchive.length} tasks (${archiveTotal} archive)`);
  }

  if (archiveTotal < 60) fail(`constructions: expected ~63 archive, got ${archiveTotal}`);
}

// 5. parseTaskAccessMode aliases
{
  const cases: Array<[string | null, string]> = [
    [null, "child"],
    ["methodist", "methodist"],
    ["archive", "archivePreview"],
    ["archivePreview", "archivePreview"],
    ["unknown", "child"],
  ];
  for (const [input, expected] of cases) {
    const got = parseTaskAccessMode(input);
    if (got !== expected) fail(`parseTaskAccessMode(${input}) = ${got}, expected ${expected}`);
  }
  ok("parseTaskAccessMode aliases");
}

// 6. Прямые ссылки — hidden/blocked/methodistOnly/archive
const directCases: Array<{
  id: string;
  child: boolean;
  archivePreview: boolean;
  methodist: boolean;
}> = [
  { id: "dirichlet-t1-01", child: true, archivePreview: false, methodist: true },
  { id: "dirichlet-t1-07", child: false, archivePreview: false, methodist: true },
  { id: "dirichlet-t9-01", child: false, archivePreview: true, methodist: true },
  { id: "dirichlet-t4-26", child: false, archivePreview: false, methodist: true },
  { id: "dirichlet-t4-14", child: false, archivePreview: false, methodist: true },
  { id: "dirichlet-t3-11", child: true, archivePreview: false, methodist: true },
  { id: "dirichlet-t3-18", child: false, archivePreview: false, methodist: true },
];

for (const c of directCases) {
  const task = allTasks[c.id];
  if (!task) {
    fail(`missing task ${c.id}`);
    continue;
  }
  const ch = canAccessTask(task, "child");
  const ar = canAccessTask(task, "archivePreview");
  const me = canAccessTask(task, "methodist");
  const pass =
    ch === c.child && ar === c.archivePreview && me === c.methodist;
  console.log(
    `${pass ? "✓" : "✗"} direct ${c.id} child=${ch} archive=${ar} methodist=${me}`,
  );
  if (!pass) errors++;
}

if (errors) {
  console.error(`\n${errors} ошибок`);
  process.exit(1);
}

console.log("\n✓ Route smoke passed.");
process.exit(0);
