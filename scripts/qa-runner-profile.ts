/**
 * QA: runnerKind для F3 (unlucky) и F4 (remainders).
 * npm run qa:runner-profile
 */
import { buildUnluckySteps } from "../src/data/dirichlet/unlucky/build-unlucky-steps";
import { UNLUCKY_SCREEN_SEQUENCE } from "../src/data/dirichlet/unlucky/screen-sequence";
import { buildRemaindersSteps } from "../src/data/dirichlet/remainders/build-remainders-steps";
import { REMAINDERS_SCREEN_SEQUENCE } from "../src/data/dirichlet/remainders/screen-sequence";
import { REMAINDERS_PILOT_METHOD_IDS } from "../src/data/dirichlet/remainders/models";
import { validateBlankChipConfiguration } from "../src/lib/word-solution-mode-a";
import { DIRICHLET_TASKS } from "../src/data/dirichlet/build-task";
import { isChildVisible } from "../src/data/task-publishing/resolve";
import { resolveRunnerKind } from "../src/lib/resolve-runner-kind";
import { resolveProgressTotalForBranch } from "../src/lib/branch-task-filter";
import { TASKS } from "../src/data/tasks";

let errors = 0;

function fail(msg: string) {
  console.error(`✗ ${msg}`);
  errors++;
}

function ok(msg: string) {
  console.log(`✓ ${msg}`);
}

console.log("=== QA: runner-profile ===\n");

const f3Tasks = Object.values(DIRICHLET_TASKS).filter(
  (t) => t.dirichletMeta?.flowId === "F3_UNLUCKY",
);

if (f3Tasks.length !== 5) {
  fail(`ожидалось 5 F3-задач, найдено ${f3Tasks.length}`);
} else {
  ok(`F3 задач в каталоге: ${f3Tasks.length}`);
}

for (const task of f3Tasks) {
  const id = task.id;
  const kind = resolveRunnerKind(task);

  if (kind !== "dirichlet-unlucky") {
    fail(`${id}: runnerKind=${kind}, ожидалось dirichlet-unlucky`);
  }

  if (task.steps.length > 0) {
    fail(`${id}: не должно быть generic steps (${task.steps.length})`);
  }

  const model = task.dirichletMeta?.unluckyModel;
  if (!model) {
    fail(`${id}: нет unluckyModel`);
    continue;
  }

  for (const field of ["goal", "maxWithoutSuccess", "answer", "categories"] as const) {
    if (model[field] == null || (field === "categories" && model.categories.length === 0)) {
      fail(`${id}: unluckyModel.${field} не заполнен`);
    }
  }

  if (model.variant !== "deduction" && model.answer !== model.maxWithoutSuccess + 1) {
    fail(
      `${id}: answer (${model.answer}) !== maxWithoutSuccess+1 (${model.maxWithoutSuccess + 1})`,
    );
  }

  const catSum = model.categories.reduce((s, c) => s + c.maxInWorstCase, 0);
  if (catSum !== model.maxWithoutSuccess) {
    fail(`${id}: сумма categories (${catSum}) !== maxWithoutSuccess (${model.maxWithoutSuccess})`);
  }

  if (!task.dirichletMeta?.screenSequence?.length) {
    fail(`${id}: нет screenSequence`);
  }

  try {
    const steps = buildUnluckySteps(task.dirichletMeta!);
    if (steps.length < 6) {
      fail(`${id}: buildUnluckySteps вернул ${steps.length} шагов`);
    }
    const intro = steps.find((s) => s.kind === "intro_video");
    if (!intro || intro.title !== "Объяснение метода") {
      fail(`${id}: intro-экран должен называться «Объяснение метода», сейчас: ${intro?.title ?? "нет"}`);
    }
    const hasWorst = steps.some((s) => s.kind === "worst_case");
    const hasRabbits = steps.some((s) => s.title.toLowerCase().includes("зайц"));
    if (!hasWorst) fail(`${id}: нет шага worst_case`);
    if (hasRabbits) fail(`${id}: screenSequence содержит «зайц» — generic flow`);
  } catch (e) {
    fail(`${id}: buildUnluckySteps — ${e instanceof Error ? e.message : e}`);
  }

  if (model.variant !== "deduction") {
    if (!model.writeSolutionLines?.length) {
      fail(`${id}: threshold-задача без writeSolutionLines`);
    }
  }

  if (task.publishing && isChildVisible(task.publishing) && task.publishing.qaStatus !== "ready") {
    fail(`${id}: childRoute при qaStatus=${task.publishing.qaStatus}`);
  }
}

// Smoke: dirichlet-t2-02 end-to-end data path
{
  const demo = DIRICHLET_TASKS["dirichlet-t2-02"];
  if (!demo) {
    fail("dirichlet-t2-02 не найдена");
  } else {
    const steps = buildUnluckySteps(demo.dirichletMeta!);
    const kinds = steps.map((s) => s.kind).join(" → ");
    ok(`dirichlet-t2-02 pipeline: ${kinds}`);
    if (resolveRunnerKind(demo) !== "dirichlet-unlucky") {
      fail("dirichlet-t2-02: неверный runnerKind");
    }
    const m = demo.dirichletMeta!.unluckyModel!;
    if (m.answer !== 3 || m.maxWithoutSuccess !== 2) {
      fail("dirichlet-t2-02: неверная модель шариков");
    } else {
      ok("dirichlet-t2-02: модель 2+1=3 (два цвета)");
    }
  }
}

// Child-route unlucky uses unlucky runner
{
  const child = f3Tasks.filter((t) => t.publishing && isChildVisible(t.publishing));
  for (const t of child) {
    if (resolveRunnerKind(t) !== "dirichlet-unlucky") {
      fail(`${t.id} в childRoute, но runner не unlucky`);
    }
  }
  ok(`childRoute F3 с unlucky runner: ${child.length} задач(и)`);
}

// Дефолтная screenSequence: intro без «Видеоввод»
{
  const introSpec = UNLUCKY_SCREEN_SEQUENCE.find((s) => s.stepKind === "intro_video");
  if (!introSpec || introSpec.title !== "Объяснение метода") {
    fail(`UNLUCKY_SCREEN_SEQUENCE: intro title = ${introSpec?.title ?? "нет"}`);
  } else {
    ok("UNLUCKY_SCREEN_SEQUENCE: intro = «Объяснение метода»");
  }
}

// Прогресс ветки unlucky — только childRoute
{
  const allTasks = Object.values(TASKS);
  const childTotal = resolveProgressTotalForBranch("proof-unlucky", allTasks, "child");
  const childVisible = f3Tasks.filter((t) => t.publishing && isChildVisible(t.publishing)).length;
  if (childTotal !== childVisible) {
    fail(`proof-unlucky progress total=${childTotal}, childVisible=${childVisible}`);
  } else {
    ok(`proof-unlucky progress total = ${childTotal} (детский маршрут)`);
  }
}

// Непомеченная задача не должна попадать в dirichlet-guided
{
  const stub = {
    id: "qa-stub-unknown",
    branchId: "unknown-branch",
    number: 1,
    title: "stub",
    condition: "",
    stage: 1,
    maxStars: 3,
    steps: [],
  } satisfies import("../src/data/tasks").Task;
  if (resolveRunnerKind(stub) !== "unsupported") {
    fail(`unknown task: resolveRunnerKind=${resolveRunnerKind(stub)}, ожидалось unsupported`);
  } else {
    ok("resolveRunnerKind: неизвестная задача → unsupported");
  }
}

console.log("\n--- F4 remainders ---\n");

const f4Tasks = Object.values(DIRICHLET_TASKS).filter(
  (t) => t.dirichletMeta?.flowId === "F4_REMAINDERS",
);

if (f4Tasks.length !== 23) {
  fail(`ожидалось 23 F4-задач, найдено ${f4Tasks.length}`);
} else {
  ok(`F4 задач в каталоге: ${f4Tasks.length}`);
}

for (const task of f4Tasks) {
  const id = task.id;
  const kind = resolveRunnerKind(task);

  if (kind !== "dirichlet-remainders") {
    fail(`${id}: runnerKind=${kind}, ожидалось dirichlet-remainders`);
  }

  if (task.steps.length > 0) {
    fail(`${id}: не должно быть generic steps (${task.steps.length})`);
  }

  const hasRabbits = task.dirichletMeta?.screenSequence?.some((s) =>
    s.title.toLowerCase().includes("зайц"),
  );
  if (hasRabbits) {
    fail(`${id}: screenSequence содержит «зайц» — generic flow`);
  }

  const model = task.dirichletMeta?.remaindersModel;
  if (task.publishing && isChildVisible(task.publishing) && !model) {
    fail(`${id}: childRoute без remaindersModel`);
  }

  if (model) {
    if (model.objectsCount <= model.housesCount) {
      fail(`${id}: objectsCount (${model.objectsCount}) <= housesCount (${model.housesCount})`);
    }
    if (model.modulus !== model.housesCount) {
      fail(`${id}: modulus (${model.modulus}) !== housesCount (${model.housesCount})`);
    }
    try {
      const steps = buildRemaindersSteps(task.dirichletMeta!);
      if (steps.length < 7) {
        fail(`${id}: buildRemaindersSteps вернул ${steps.length} шагов`);
      }
      const required = [
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
      for (const k of required) {
        if (!steps.some((s) => s.kind === k)) {
          fail(`${id}: нет шага ${k}`);
        }
      }
      if (model.compactHouses && model.modulus < 20) {
        fail(`${id}: compactHouses при маленьком модуле ${model.modulus}`);
      }
    } catch (e) {
      fail(`${id}: buildRemaindersSteps — ${e instanceof Error ? e.message : e}`);
    }
  }
}

// Pilot-задачи F4
for (const methodId of REMAINDERS_PILOT_METHOD_IDS) {
  const pilot = f4Tasks.find((t) => t.dirichletMeta?.methodTaskId === methodId);
  if (!pilot) {
    fail(`pilot ${methodId} не найден в каталоге`);
    continue;
  }
  const m = pilot.dirichletMeta?.remaindersModel;
  if (!m) {
    fail(`${pilot.id}: pilot без remaindersModel`);
    continue;
  }
  for (const field of ["modulus", "objectsCount", "housesCount"] as const) {
    if (m[field] == null) fail(`${pilot.id}: remaindersModel.${field} не заполнен`);
  }
  if (m.objectsCount <= m.housesCount) {
    fail(`${pilot.id}: pilot objectsCount <= housesCount`);
  }
  if (!m.writeSolutionLines?.length) {
    fail(`${pilot.id}: pilot без writeSolutionLines`);
  }
  if (methodId === "M4.18" && !m.compactHouses) {
    fail(`${pilot.id}: M4.18 должна использовать compactHouses`);
  }
  if (m.writeSolutionLines?.length) {
    const chipCheck = validateBlankChipConfiguration(m.writeSolutionLines, "reusable");
    if (!chipCheck.ok) {
      fail(`${pilot.id}: writeSolutionLines — ${chipCheck.message}`);
    }
  }
  if (pilot.title.includes("…")) {
    fail(`${pilot.id}: обрезанный title «${pilot.title}»`);
  }
  const ri = m.ruleInstance;
  if (!ri || ri.ruleId !== "remainders-houses") {
    fail(`${pilot.id}: нет ruleInstance remainders-houses`);
  } else if (ri.lastRemainder !== ri.modulus - 1 || ri.housesCount !== ri.modulus) {
    fail(`${pilot.id}: ruleInstance некорректен`);
  }
  if (methodId === "M4.11" && !ri?.showRuleScreen) {
    fail(`${pilot.id}: M4.11 должна показывать экран правила`);
  }
  if (methodId === "M4.18" && ri?.showRuleScreen) {
    fail(`${pilot.id}: M4.18 не должна требовать экран правила`);
  }
}
ok(`pilot F4 (M4.11, M4.18): ${REMAINDERS_PILOT_METHOD_IDS.length} задач с полной моделью`);

// Smoke: dirichlet-t3-11 pipeline
{
  const demo = DIRICHLET_TASKS["dirichlet-t3-11"];
  if (!demo) {
    fail("dirichlet-t3-11 не найдена");
  } else {
    if (resolveRunnerKind(demo) !== "dirichlet-remainders") {
      fail("dirichlet-t3-11: неверный runnerKind");
    }
    const steps = buildRemaindersSteps(demo.dirichletMeta!);
    ok(`dirichlet-t3-11 pipeline: ${steps.map((s) => s.kind).join(" → ")}`);
    const m = demo.dirichletMeta!.remaindersModel!;
    if (m.modulus !== 11 || m.objectsCount !== 12 || m.housesCount !== 11) {
      fail(`dirichlet-t3-11: неверная модель (${m.modulus}, ${m.objectsCount}, ${m.housesCount})`);
    } else {
      ok("dirichlet-t3-11: 12 чисел > 11 домиков (mod 11)");
    }
    if (demo.title !== "12 чисел и остатки по модулю 11") {
      fail(`dirichlet-t3-11: title = «${demo.title}»`);
    }
    if (!demo.condition.includes("12 различных двузначных")) {
      fail("dirichlet-t3-11: condition неполное");
    }
    if (!steps.some((s) => s.kind === "method_rule")) {
      fail("dirichlet-t3-11: нет method_rule");
    }
    if (!steps.some((s) => s.kind === "houses_count_quiz")) {
      fail("dirichlet-t3-11: нет houses_count_quiz");
    }
    if (demo.publishing && !isChildVisible(demo.publishing)) {
      fail("dirichlet-t3-11: должна быть в childRoute");
    }
  }
}

// Smoke: dirichlet-t3-18 pipeline + заголовки
{
  const demo = DIRICHLET_TASKS["dirichlet-t3-18"];
  if (!demo) {
    fail("dirichlet-t3-18 не найдена");
  } else {
    if (resolveRunnerKind(demo) !== "dirichlet-remainders") {
      fail("dirichlet-t3-18: неверный runnerKind");
    }
    const steps = buildRemaindersSteps(demo.dirichletMeta!);
    ok(`dirichlet-t3-18 pipeline: ${steps.length} шагов, finish=${steps.some((s) => s.kind === "finish")}`);
    if (demo.title !== "2001 число и остатки по модулю 2000") {
      fail(`dirichlet-t3-18: title = «${demo.title}»`);
    }
    if (demo.shortTitle !== "2001 число и 2000 остатков") {
      fail(`dirichlet-t3-18: shortTitle = «${demo.shortTitle ?? "нет"}»`);
    }
    if (demo.title.includes("…")) {
      fail("dirichlet-t3-18: обрезанный title");
    }
    if (!demo.condition.includes("2001 целых чисел")) {
      fail("dirichlet-t3-18: condition неполное");
    }
    if (steps.some((s) => s.kind === "method_rule")) {
      fail("dirichlet-t3-18: не должно быть method_rule");
    }
    if (demo.publishing && isChildVisible(demo.publishing)) {
      fail("dirichlet-t3-18: не должна быть в childRoute");
    }
    const m = demo.dirichletMeta!.remaindersModel!;
    const chipCheck = validateBlankChipConfiguration(m.writeSolutionLines ?? [], "reusable");
    if (!chipCheck.ok) fail(`dirichlet-t3-18: ${chipCheck.message}`);
    else ok("dirichlet-t3-18: write_solution reusable cards OK");
  }
}

// REMAINDERS_SCREEN_SEQUENCE intro
{
  const introSpec = REMAINDERS_SCREEN_SEQUENCE.find((s) => s.stepKind === "intro_video");
  if (!introSpec || introSpec.title !== "Куда поселятся числа?") {
    fail(`REMAINDERS_SCREEN_SEQUENCE: intro title = ${introSpec?.title ?? "нет"}`);
  } else {
    ok("REMAINDERS_SCREEN_SEQUENCE: intro = «Куда поселятся числа?»");
  }
}

console.log(`\n=== Итого: ${errors} ошибок ===`);
process.exit(errors > 0 ? 1 : 0);
