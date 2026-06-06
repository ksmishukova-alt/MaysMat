/**
 * QA: runnerKind и unluckyModel для F3.
 * npm run qa:runner-profile
 */
import { buildUnluckySteps } from "../src/data/dirichlet/unlucky/build-unlucky-steps";
import { UNLUCKY_SCREEN_SEQUENCE } from "../src/data/dirichlet/unlucky/screen-sequence";
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

console.log(`\n=== Итого: ${errors} ошибок ===`);
process.exit(errors > 0 ? 1 : 0);
