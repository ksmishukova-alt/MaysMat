/**
 * QA: методические правила в runner'ах.
 * npm run qa:method-rules
 */
import { DIRICHLET_TASKS } from "../src/data/dirichlet/build-task";
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

let errors = 0;

function fail(msg: string) {
  console.error(`✗ ${msg}`);
  errors++;
}

function ok(msg: string) {
  console.log(`✓ ${msg}`);
}

console.log("=== QA: method-rules ===\n");

// Registry
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

// ChildRoute remainders
const childRemainders = Object.values(DIRICHLET_TASKS).filter(
  (t) =>
    resolveRunnerKind(t) === "dirichlet-remainders" &&
    t.publishing &&
    isChildVisible(t.publishing),
);

for (const task of childRemainders) {
  const ri = task.dirichletMeta?.remaindersModel?.ruleInstance;
  if (!ri) {
    fail(`${task.id}: childRoute без ruleInstance`);
    continue;
  }
  if (ri.firstRemainder !== 0) {
    fail(`${task.id}: firstRemainder !== 0`);
  }
  if (ri.lastRemainder !== ri.modulus - 1) {
    fail(`${task.id}: lastRemainder !== modulus - 1`);
  }
  if (ri.housesCount !== ri.modulus) {
    fail(`${task.id}: housesCount !== modulus`);
  }
  if (!ri.showRuleScreen) {
    fail(`${task.id}: первая childRoute-задача должна показывать экран правила`);
  }
}

if (childRemainders.length === 1 && childRemainders[0]?.id === "dirichlet-t3-11") {
  ok("childRoute remainders: dirichlet-t3-11 с ruleInstance и showRuleScreen");
} else {
  fail(`ожидалась 1 childRoute remainders (t3-11), найдено ${childRemainders.length}`);
}

// t3-18 не в childRoute
{
  const t18 = DIRICHLET_TASKS["dirichlet-t3-18"];
  if (!t18) {
    fail("dirichlet-t3-18 не найдена");
  } else if (t18.publishing && isChildVisible(t18.publishing)) {
    fail("dirichlet-t3-18 не должна быть в childRoute");
  } else {
    ok("dirichlet-t3-18: methodistOnly (не childRoute)");
  }
  const ri = t18?.dirichletMeta?.remaindersModel?.ruleInstance;
  if (ri?.showRuleScreen) {
    fail("dirichlet-t3-18: showRuleScreen должен быть false");
  }
}

// Pilot ruleInstance fields
for (const id of ["dirichlet-t3-11", "dirichlet-t3-18"] as const) {
  const task = DIRICHLET_TASKS[id];
  const ri = task?.dirichletMeta?.remaindersModel?.ruleInstance;
  if (!ri || ri.ruleId !== "remainders-houses") {
    fail(`${id}: нет ruleInstance remainders-houses`);
  }
}

// Кириллица «остатки» в заголовках pilot
for (const id of ["dirichlet-t3-11", "dirichlet-t3-18"] as const) {
  const task = DIRICHLET_TASKS[id];
  if (!task?.title.includes("остатки")) {
    fail(`${id}: title без кириллического «остатки»`);
  }
}
ok("pilot-заголовки с «остатки» (кириллица)");

console.log(`\n=== Итого: ${errors} ошибок ===`);
process.exit(errors > 0 ? 1 : 0);
