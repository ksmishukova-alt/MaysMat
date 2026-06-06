/**
 * QA: методические правила в runner'ах.
 * npm run qa:method-rules
 */
import { DIRICHLET_TASKS } from "../src/data/dirichlet/build-task";
import { buildRemaindersSteps } from "../src/data/dirichlet/remainders/build-remainders-steps";
import {
  REMAINDERS_CHILD_ROUTE_METHOD_IDS,
} from "../src/data/dirichlet/remainders/models";
import { remaindersHousesRule, getMethodRule } from "../src/data/method-rules";
import { isChildVisible } from "../src/data/task-publishing/resolve";
import { resolveRunnerKind } from "../src/lib/resolve-runner-kind";

const FORBIDDEN_UI_TERMS = [
  "runnerKind",
  "flowId",
  "screenSequence",
  "qaStatus",
  "publishTier",
  "домики-остатки",
  "домиков-остатков",
  "домиках-остатках",
];

const EXPECTED_CHILD_IDS = [
  "dirichlet-t3-11",
  "dirichlet-t3-22",
  "dirichlet-t3-18",
  "dirichlet-t3-24",
] as const;

let errors = 0;

function fail(msg: string) {
  console.error(`✗ ${msg}`);
  errors++;
}

function ok(msg: string) {
  console.log(`✓ ${msg}`);
}

console.log("=== QA: method-rules ===\n");

if (!getMethodRule("remainders-houses")) {
  fail("remainders-houses rule не найдено");
} else {
  ok("remainders-houses в registry");
}

for (const term of FORBIDDEN_UI_TERMS) {
  const inRule = remaindersHousesRule.fullRule.some((l) => l.includes(term));
  if (inRule) fail(`fullRule содержит «${term}»`);
}
if (!remaindersHousesRule.anchorPhrase.includes("Остаток")) {
  fail("anchorPhrase некорректна");
} else {
  ok("fullRule без служебных терминов");
}

const childRemainders = Object.values(DIRICHLET_TASKS).filter(
  (t) =>
    resolveRunnerKind(t) === "dirichlet-remainders" &&
    t.publishing &&
    isChildVisible(t.publishing),
);

for (const task of childRemainders) {
  const m = task.dirichletMeta?.remaindersModel;
  const ri = m?.ruleInstance;
  if (!ri) {
    fail(`${task.id}: childRoute без ruleInstance`);
    continue;
  }
  if (ri.firstRemainder !== 0) fail(`${task.id}: firstRemainder !== 0`);
  if (ri.lastRemainder !== ri.modulus - 1) fail(`${task.id}: lastRemainder !== modulus - 1`);
  if (ri.housesCount !== ri.modulus) fail(`${task.id}: housesCount !== modulus`);
  if (!m?.writeSolutionLines?.length) fail(`${task.id}: нет writeSolutionLines`);
  if (!m?.progressionProfile) fail(`${task.id}: нет progressionProfile`);
}

for (const id of EXPECTED_CHILD_IDS) {
  const task = DIRICHLET_TASKS[id];
  if (!task?.publishing || !isChildVisible(task.publishing)) {
    fail(`${id}: должна быть в childRoute`);
  }
}

if (childRemainders.length === EXPECTED_CHILD_IDS.length) {
  ok(`childRoute remainders: ${childRemainders.length} задач (${EXPECTED_CHILD_IDS.join(", ")})`);
} else {
  fail(
    `ожидалось ${EXPECTED_CHILD_IDS.length} childRoute remainders, найдено ${childRemainders.length}`,
  );
}

const t11 = DIRICHLET_TASKS["dirichlet-t3-11"];
if (!t11?.dirichletMeta?.remaindersModel?.ruleInstance?.showRuleScreen) {
  fail("dirichlet-t3-11: showRuleScreen (профиль 1)");
} else {
  ok("dirichlet-t3-11: полный экран правила");
}

const t22 = DIRICHLET_TASKS["dirichlet-t3-22"];
if (t22?.dirichletMeta?.remaindersModel?.progressionProfile !== 2) {
  fail("dirichlet-t3-22: progressionProfile !== 2");
}
if (!t22?.dirichletMeta?.remaindersModel?.ruleInstance?.showRuleScreen) {
  fail("dirichlet-t3-22: showRuleScreen (профиль 2)");
}

const t24 = DIRICHLET_TASKS["dirichlet-t3-24"];
const steps24 = t24?.dirichletMeta ? buildRemaindersSteps(t24.dirichletMeta) : [];
if (!steps24.some((s) => s.kind === "choose_method")) {
  fail("dirichlet-t3-24: нет choose_method (профиль 4)");
} else {
  ok("dirichlet-t3-24: самостоятельный выбор шага метода");
}

for (const methodId of REMAINDERS_CHILD_ROUTE_METHOD_IDS) {
  const task = Object.values(DIRICHLET_TASKS).find((t) => t.dirichletMeta?.methodTaskId === methodId);
  if (!task) fail(`childRoute model ${methodId} не найдена в каталоге`);
}

for (const id of ["dirichlet-t3-11", "dirichlet-t3-18", "dirichlet-t3-22", "dirichlet-t3-24"] as const) {
  const task = DIRICHLET_TASKS[id];
  if (!task?.title.includes("остатки")) {
    fail(`${id}: title без кириллического «остатки»`);
  }
}
ok("childRoute-заголовки с «остатки» (кириллица)");

console.log(`\n=== Итого: ${errors} ошибок ===`);
process.exit(errors > 0 ? 1 : 0);
