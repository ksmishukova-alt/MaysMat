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
  headsLegsProductionBaseRule,
  headsLegsScoreBaseRule,
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
import {
  PRODUCTION_PATTERN_PILOT,
  PRODUCTION_PATTERN_PILOT_METHOD_IDS,
} from "../src/data/heads-legs/production-pattern/models";
import {
  SCORE_PATTERN_PILOT,
  SCORE_PATTERN_PILOT_METHOD_IDS,
} from "../src/data/heads-legs/score-pattern/models";
import { getScoreAudit, isMatchTotalPilot } from "../src/data/heads-legs/score-pattern/completeness-audit";
import { isNonStandardProductionPilot } from "../src/data/heads-legs/production-pattern/completeness-audit";
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
  if (ri.ruleId !== "heads-legs-base") {
    fail(`${task.id}: ruleId !== heads-legs-base`);
    continue;
  }
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
  const pilotRi = pilot.ruleInstance as import("../src/data/method-rules/types").HeadsLegsValueRuleInstance;
  if (!meta.progressionProfile) fail(`${task.id}: нет progressionProfile`);
  if (meta.progressionProfile !== pilot.progressionProfile) {
    fail(`${task.id}: progressionProfile !== ${pilot.progressionProfile}`);
  }
  if (valueRi.totalObjects !== pilotRi.totalObjects) {
    fail(`${task.id}: totalObjects не совпадает`);
  }
  if (valueRi.totalFeature !== pilotRi.totalFeature) {
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

console.log("\n--- heads-legs production pattern ---\n");

if (!getMethodRule("heads-legs-production-base")) {
  fail("heads-legs-production-base rule не найдено");
} else {
  ok("heads-legs-production-base в registry");
}

for (const term of FORBIDDEN_UI_TERMS) {
  const inProdRule = headsLegsProductionBaseRule.fullRule.some((l) => l.includes(term));
  if (inProdRule) fail(`production fullRule содержит «${term}»`);
}
if (!headsLegsProductionBaseRule.fullRule.some((l) => l.includes("спрашивают"))) {
  fail("production fullRule без шага про вопрос задачи");
} else {
  ok("production fullRule без служебных терминов");
}

function auditProductionPilot(methodId: string) {
  const task = Object.values(HEADS_LEGS_TASKS).find((t) => t.headsLegsMeta?.methodTaskId === methodId);
  if (!task) {
    fail(`pilot ${methodId}: задача не найдена`);
    return;
  }
  const meta = task.headsLegsMeta!;
  const pilot = PRODUCTION_PATTERN_PILOT[methodId];
  const ri = meta.ruleInstance;

  if (!ri || ri.ruleId !== "heads-legs-production-base") {
    fail(`${task.id}: ruleId !== heads-legs-production-base`);
    return;
  }
  const prodRi = ri;
  if (!meta.progressionProfile) fail(`${task.id}: нет progressionProfile`);
  if (meta.progressionProfile !== pilot.progressionProfile) {
    fail(`${task.id}: progressionProfile !== ${pilot.progressionProfile}`);
  }
  const expectedStep = Math.abs(prodRi.secondResult - prodRi.firstResult);
  if (prodRi.replacementStep !== expectedStep) {
    fail(`${task.id}: replacementStep !== ${expectedStep}`);
  }
  if (!prodRi.questionAsks?.trim()) {
    fail(`${task.id}: нет questionAsks`);
  }
  if (prodRi.requiresPositiveBothKinds !== true) {
    fail(`${task.id}: requiresPositiveBothKinds !== true`);
  }
  if (
    task.publishing &&
    isChildVisible(task.publishing) &&
    prodRi.completenessStatus !== "complete_unique_answer" &&
    prodRi.completenessStatus !== "complete_multiple_answers"
  ) {
    fail(`${task.id}: childRoute с неполным completenessStatus`);
  }
  if (
    !prodRi.totalParticipants &&
    pilot.flowMode === "standard" &&
    prodRi.completenessStatus === "complete_unique_answer"
  ) {
    fail(`${task.id}: standard childRoute без totalParticipants`);
  }

  const steps = buildHeadsLegsPlayerSteps(task);

  if (methodId === "3.3") {
    if (!steps.some((s) => s.type === "hl_method_rule")) fail("heads-legs-3-03: нет экрана правила");
    if (!steps.some((s) => s.type === "hl_intro")) fail("heads-legs-3-03: нет intro");
    else ok("heads-legs-3-03: полный экран правила (profile 1)");
  }

  if (pilot.flowMode === "enumeration") {
    if (!steps.some((s) => s.id.includes("-diag-"))) {
      fail(`${task.id}: enumeration без диагностических/переборных шагов`);
    } else {
      ok(`${task.id}: enumeration-flow`);
    }
  }

  if (pilot.progressionProfile === 3) {
    const hub = steps.find((s) => s.type === "hl_choose_method");
    if (!hub || hub.type !== "hl_choose_method" || hub.chooseMode !== "production") {
      fail(`${task.id}: нет production hub (профиль 3)`);
    } else {
      ok(`${task.id}: hub выбора шага (production)`);
    }
  }

  if (pilot.progressionProfile === 4) {
    const types = steps.map((s) => s.type);
    if (!types.includes("word_solution")) fail(`${task.id}: нет word_solution`);
    if (types.includes("drag_select") && pilot.flowMode !== "multiple_answers") {
      fail(`${task.id}: профиль 4 содержит drag_select`);
    } else {
      ok(`${task.id}: профиль 4 — текстовое решение`);
    }
  }

  if (methodId === "3.5" && prodRi.answerTransform?.type !== "compare_results") {
    fail("heads-legs-3-05: нет compare_results answerTransform");
  } else if (methodId === "3.5") {
    ok("heads-legs-3-05: compare_results для сравнения мышей");
  }

  if (methodId === "3.7") {
    if (meta.acceptedAnswers.kind !== "multi_set") {
      fail("heads-legs-3-07: acceptedAnswers !== multi_set");
    } else {
      ok("heads-legs-3-07: multiple_answers mode");
    }
  }
}

for (const methodId of PRODUCTION_PATTERN_PILOT_METHOD_IDS) {
  auditProductionPilot(methodId);
}

ok(
  `pilot production pattern: ${PRODUCTION_PATTERN_PILOT_METHOD_IDS.length} задач (${PRODUCTION_PATTERN_PILOT_METHOD_IDS.join(", ")})`,
);

const diag31 = HEADS_LEGS_TASKS["heads-legs-3-01"];
if (diag31 && isHeadsLegsProgressionTask(diag31)) {
  fail("heads-legs-3-01: diagnostic, не progression-runner");
} else {
  ok("heads-legs-3-01: diagnostic (DigitalTaskPlayer)");
}

if (isNonStandardProductionPilot("3.1") !== true) {
  fail("3.1: должен быть non-standard production pilot");
}

const legacy = HEADS_LEGS_TASKS["heads-legs-1-10"];
if (legacy && isHeadsLegsProgressionTask(legacy)) {
  fail("heads-legs-1-10: не должна быть progression-runner");
} else {
  ok("heads-legs-1-10: старый DigitalTaskPlayer");
}

console.log("\n--- heads-legs score pattern ---\n");

if (!getMethodRule("heads-legs-score-base")) {
  fail("heads-legs-score-base rule не найдено");
} else {
  ok("heads-legs-score-base в registry");
}

for (const term of FORBIDDEN_UI_TERMS) {
  const inScoreRule = headsLegsScoreBaseRule.fullRule.some((l) => l.includes(term));
  if (inScoreRule) fail(`score fullRule содержит «${term}»`);
}
if (!headsLegsScoreBaseRule.fullRule.some((l) => l.includes("спрашивают"))) {
  fail("score fullRule без шага про вопрос задачи");
} else {
  ok("score fullRule без служебных терминов");
}

function auditScorePilot(methodId: string) {
  const task = Object.values(HEADS_LEGS_TASKS).find((t) => t.headsLegsMeta?.methodTaskId === methodId);
  if (!task) {
    fail(`pilot ${methodId}: задача не найдена`);
    return;
  }
  const meta = task.headsLegsMeta!;
  const pilot = SCORE_PATTERN_PILOT[methodId];
  const audit = getScoreAudit(methodId);
  const ri = meta.ruleInstance;

  if (!audit) {
    fail(`${methodId}: нет audit completeness`);
    return;
  } else {
    ok(`${methodId}: audit completeness`);
  }

  if (!ri || ri.ruleId !== "heads-legs-score-base") {
    fail(`${task.id}: ruleId !== heads-legs-score-base`);
    return;
  }
  const scoreRi = ri;
  if (!meta.progressionProfile) fail(`${task.id}: нет progressionProfile`);
  if (meta.progressionProfile !== pilot.progressionProfile) {
    fail(`${task.id}: progressionProfile !== ${pilot.progressionProfile}`);
  }
  if (scoreRi.scoreMode !== audit.scoreMode) {
    fail(`${task.id}: scoreMode !== ${audit.scoreMode}`);
  }
  const expectedStep =
    scoreRi.scoreMode === "match_total"
      ? (scoreRi.decisiveMatchTotal ?? scoreRi.firstScore) - (scoreRi.drawMatchTotal ?? scoreRi.secondScore)
      : Math.abs(scoreRi.secondScore - scoreRi.firstScore);
  if (scoreRi.replacementStep !== expectedStep) {
    fail(`${task.id}: replacementStep !== ${expectedStep}`);
  }
  if (!scoreRi.questionAsks?.trim()) {
    fail(`${task.id}: нет questionAsks`);
  }
  if (
    task.publishing &&
    isChildVisible(task.publishing) &&
    scoreRi.completenessStatus !== "complete_unique_answer"
  ) {
    fail(`${task.id}: childRoute с неполным completenessStatus`);
  }
  if (!scoreRi.scoreMode) {
    fail(`${task.id}: score-задача без scoreMode`);
  }

  const steps = buildHeadsLegsPlayerSteps(task);

  if (methodId === "4.1") {
    if (!steps.some((s) => s.type === "hl_method_rule")) fail("heads-legs-4-01: нет экрана правила");
    if (!steps.some((s) => s.type === "hl_intro")) fail("heads-legs-4-01: нет intro");
    if (!steps.some((s) => s.type === "hl_score_replacement")) {
      fail("heads-legs-4-01: нет ScoreReplacementStep");
    } else {
      ok("heads-legs-4-01: plus_minus full rule-flow");
    }
  }

  if (methodId === "4.2") {
    if (!steps.some((s) => s.type === "hl_score_question_check")) {
      fail("heads-legs-4-02: нет ScoreQuestionCheckStep");
    } else {
      ok("heads-legs-4-02: question-check для ответа про двойки");
    }
    if (!scoreRi.questionCheckNote) {
      fail("heads-legs-4-02: нет questionCheckNote");
    }
  }

  if (methodId === "4.4") {
    if (scoreRi.scoreMode !== "match_total") {
      fail("heads-legs-4-04: scoreMode !== match_total");
    }
    if (!steps.some((s) => s.type === "hl_match_total")) {
      fail("heads-legs-4-04: нет MatchTotalStep");
    } else {
      ok("heads-legs-4-04: match_total mode");
    }
    if (isMatchTotalPilot(methodId) !== true) {
      fail("4.4: isMatchTotalPilot !== true");
    }
  }

  if (methodId === "4.5") {
    if (pilot.progressionProfile !== 3) {
      fail("heads-legs-4-05: profile !== 3");
    }
    const hub = steps.find((s) => s.type === "hl_choose_method");
    if (!hub || hub.type !== "hl_choose_method" || hub.chooseMode !== "score") {
      fail("heads-legs-4-05: нет score hub (профиль 3)");
    } else {
      ok("heads-legs-4-05: plus_minus hub");
    }
    if (!steps.some((s) => s.type === "hl_score_replacement")) {
      fail("heads-legs-4-05: нет ScoreReplacementStep");
    }
  }

  if (scoreRi.scoreMode === "plus_minus" && scoreRi.firstScore >= 0 && scoreRi.secondScore >= 0) {
    fail(`${task.id}: plus_minus без отрицательного вклада`);
  }

  for (const s of steps) {
    if (s.type === "hl_score_question_check" || s.type === "hl_question_check") continue;
    if (
      scoreRi.scoreMode === "match_total" &&
      s.type === "hl_choose_method" &&
      s.chooseMode !== "score"
    ) {
      fail(`${task.id}: match_total в production/value hub`);
    }
  }
}

for (const methodId of SCORE_PATTERN_PILOT_METHOD_IDS) {
  auditScorePilot(methodId);
}

ok(
  `pilot score pattern: ${SCORE_PATTERN_PILOT_METHOD_IDS.length} задач (${SCORE_PATTERN_PILOT_METHOD_IDS.join(", ")})`,
);

console.log(`\n=== Итого: ${errors} ошибок ===`);
process.exit(errors > 0 ? 1 : 0);
