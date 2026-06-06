/**
 * QA: методические правила в runner'ах.
 * npm run qa:method-rules
 */
import { DIRICHLET_TASKS } from "../src/data/dirichlet/build-task";
import { buildRemaindersSteps } from "../src/data/dirichlet/remainders/build-remainders-steps";
import {
  REMAINDERS_CHILD_ROUTE_METHOD_IDS,
} from "../src/data/dirichlet/remainders/models";
import {
  headsLegsBaseRule,
  headsLegsValueBaseRule,
  getMethodRule,
} from "../src/data/method-rules";
import { HEADS_LEGS_TASKS } from "../src/data/heads-legs/build-task";
import {
  BASE_PATTERN_PILOT,
  BASE_PATTERN_PILOT_METHOD_IDS,
} from "../src/data/heads-legs/base-pattern/models";
import {
  VALUE_PATTERN_PILOT,
  VALUE_PATTERN_PILOT_METHOD_IDS,
} from "../src/data/heads-legs/value-pattern/models";
import { ALL_PILOT_METHOD_IDS } from "../src/data/heads-legs/pilot/resolve";
import { buildHeadsLegsPlayerSteps, isHeadsLegsProgressionTask } from "../src/data/heads-legs/base-pattern/build-player-steps";
import { isChildVisible } from "../src/data/task-publishing/resolve";
import { resolveRunnerKind } from "../src/lib/resolve-runner-kind";

const FORBIDDEN_UI_TERMS = [
  "runnerKind",
  "flowId",
  "screenSequence",
  "qaStatus",
  "publishTier",
  "progressionProfile",
  "ruleInstance",
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

const remaindersHousesRule = getMethodRule("remainders-houses")!;

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

console.log("\n--- heads-legs base pattern ---\n");

if (!getMethodRule("heads-legs-base")) {
  fail("heads-legs-base rule не найдено");
} else {
  ok("heads-legs-base в registry");
}

for (const term of FORBIDDEN_UI_TERMS) {
  const inHlRule = headsLegsBaseRule.fullRule.some((l) => l.includes(term));
  if (inHlRule) fail(`headsLegs fullRule содержит «${term}»`);
}
if (!headsLegsBaseRule.anchorPhrase.includes("одного вида")) {
  fail("headsLegs anchorPhrase некорректна");
} else {
  ok("headsLegs fullRule без служебных терминов");
}

const childHeadsLegs = Object.values(HEADS_LEGS_TASKS).filter(
  (t) =>
    resolveRunnerKind(t) === "heads-legs-guided" &&
    t.publishing &&
    isChildVisible(t.publishing),
);

for (const task of childHeadsLegs) {
  const methodId = task.headsLegsMeta?.methodTaskId;
  if (!methodId || !ALL_PILOT_METHOD_IDS.includes(methodId)) continue;
  const ri = task.headsLegsMeta?.ruleInstance;
  if (!ri) {
    fail(`${task.id}: pilot childRoute без ruleInstance`);
  }
}

for (const methodId of BASE_PATTERN_PILOT_METHOD_IDS) {
  const task = Object.values(HEADS_LEGS_TASKS).find((t) => t.headsLegsMeta?.methodTaskId === methodId);
  if (!task) {
    fail(`pilot ${methodId}: задача не найдена`);
    continue;
  }
  const meta = task.headsLegsMeta!;
  const pilot = BASE_PATTERN_PILOT[methodId];

  if (!meta.ruleInstance) fail(`${task.id}: нет ruleInstance`);
  if (!meta.progressionProfile) fail(`${task.id}: нет progressionProfile`);
  if (meta.progressionProfile !== pilot.progressionProfile) {
    fail(`${task.id}: progressionProfile !== ${pilot.progressionProfile}`);
  }

  const ri = meta.ruleInstance!;
  if (ri.totalObjects !== pilot.ruleInstance.totalObjects) {
    fail(`${task.id}: totalObjects не совпадает с эталоном`);
  }
  if (ri.totalFeature !== pilot.ruleInstance.totalFeature) {
    fail(`${task.id}: totalFeature не совпадает с эталоном`);
  }

  const steps = buildHeadsLegsPlayerSteps(task);

  if (methodId === "1.1") {
    if (!steps.some((s) => s.type === "hl_method_rule")) {
      fail("heads-legs-1-01: нет экрана правила (профиль 1)");
    } else {
      ok("heads-legs-1-01: полный экран правила");
    }
    if (!steps.some((s) => s.type === "hl_intro")) {
      fail("heads-legs-1-01: нет intro (профиль 1)");
    }
  }

  if (pilot.progressionProfile === 3) {
    if (!steps.some((s) => s.type === "hl_choose_method")) {
      fail(`${task.id}: нет hl_choose_method (профиль 3)`);
    } else {
      ok(`${task.id}: экран выбора шага метода`);
    }
  }

  if (pilot.progressionProfile === 4) {
    const contentTypes = steps.map((s) => s.type);
    if (!contentTypes.includes("word_solution")) {
      fail(`${task.id}: нет word_solution (профиль 4)`);
    }
    if (contentTypes.includes("drag_select")) {
      fail(`${task.id}: профиль 4 не должен содержать drag_select`);
    } else {
      ok(`${task.id}: профиль 4 — решение с пропусками`);
    }
  }
}

ok(`pilot base pattern: ${BASE_PATTERN_PILOT_METHOD_IDS.length} задач (${BASE_PATTERN_PILOT_METHOD_IDS.join(", ")})`);

console.log("\n--- heads-legs value pattern ---\n");

if (!getMethodRule("heads-legs-value-base")) {
  fail("heads-legs-value-base rule не найдено");
} else {
  ok("heads-legs-value-base в registry");
}

for (const term of FORBIDDEN_UI_TERMS) {
  const inValRule = headsLegsValueBaseRule.fullRule.some((l) => l.includes(term));
  if (inValRule) fail(`headsLegs value fullRule содержит «${term}»`);
}
if (!headsLegsValueBaseRule.fullRule.some((l) => l.includes("спрашивают"))) {
  fail("value fullRule без шага про вопрос задачи");
} else {
  ok("value fullRule без служебных терминов");
}

function auditValuePilot(methodId: string) {
  const task = Object.values(HEADS_LEGS_TASKS).find((t) => t.headsLegsMeta?.methodTaskId === methodId);
  if (!task) {
    fail(`pilot ${methodId}: задача не найдена`);
    return;
  }
  const meta = task.headsLegsMeta!;
  const pilot = VALUE_PATTERN_PILOT[methodId];
  const ri = meta.ruleInstance;

  if (!ri || ri.ruleId !== "heads-legs-value-base") {
    fail(`${task.id}: ruleId !== heads-legs-value-base`);
    return;
  }
  const valueRi = ri;
  if (!meta.progressionProfile) fail(`${task.id}: нет progressionProfile`);
  if (meta.progressionProfile !== pilot.progressionProfile) {
    fail(`${task.id}: progressionProfile !== ${pilot.progressionProfile}`);
  }
  if (valueRi.totalObjects !== pilot.ruleInstance.totalObjects) {
    fail(`${task.id}: totalObjects не совпадает`);
  }
  if (valueRi.totalFeature !== pilot.ruleInstance.totalFeature) {
    fail(`${task.id}: totalFeature не совпадает`);
  }
  const expectedStep = Math.abs(valueRi.secondFeature - valueRi.firstFeature);
  if (valueRi.replacementStep !== expectedStep) {
    fail(`${task.id}: replacementStep !== ${expectedStep}`);
  }
  if (!valueRi.questionAsks?.trim()) {
    fail(`${task.id}: нет questionAsks`);
  }

  const steps = buildHeadsLegsPlayerSteps(task);

  if (methodId === "2.1") {
    if (!steps.some((s) => s.type === "hl_method_rule")) fail("heads-legs-2-01: нет экрана правила");
    if (!steps.some((s) => s.type === "hl_intro")) fail("heads-legs-2-01: нет intro");
    else ok("heads-legs-2-01: полный экран правила");
  }

  if (pilot.progressionProfile === 3) {
    const hub = steps.find((s) => s.type === "hl_choose_method");
    if (!hub || hub.type !== "hl_choose_method" || hub.chooseMode !== "value") {
      fail(`${task.id}: нет value hub (профиль 3)`);
    } else {
      ok(`${task.id}: hub выбора шага (value)`);
    }
  }

  if (pilot.progressionProfile === 4) {
    const types = steps.map((s) => s.type);
    if (!types.includes("word_solution")) fail(`${task.id}: нет word_solution`);
    if (types.includes("drag_select")) fail(`${task.id}: профиль 4 содержит drag_select`);
    else ok(`${task.id}: профиль 4 — текстовое решение`);
  }

  if (methodId === "2.5" && !valueRi.answerTransform) {
    fail("heads-legs-2-05: нет answerTransform");
  } else if (methodId === "2.5") {
    ok("heads-legs-2-05: answerTransform для простых карандашей");
  }
}

for (const methodId of VALUE_PATTERN_PILOT_METHOD_IDS) {
  auditValuePilot(methodId);
}

ok(`pilot value pattern: ${VALUE_PATTERN_PILOT_METHOD_IDS.length} задач (${VALUE_PATTERN_PILOT_METHOD_IDS.join(", ")})`);

const legacy = HEADS_LEGS_TASKS["heads-legs-1-10"];
if (legacy && isHeadsLegsProgressionTask(legacy)) {
  fail("heads-legs-1-10: не должна быть progression-runner");
} else {
  ok("heads-legs-1-10: старый DigitalTaskPlayer");
}

console.log(`\n=== Итого: ${errors} ошибок ===`);
process.exit(errors > 0 ? 1 : 0);
