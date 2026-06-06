/**
 * QA: guard доступа к /tasks/[taskId] в детском режиме.
 * npm run qa:task-access
 */
import { DIRICHLET_TASKS } from "../src/data/dirichlet/build-task";
import { HEADS_LEGS_TASKS } from "../src/data/heads-legs/build-task";
import { isChildVisible } from "../src/data/task-publishing/resolve";
import { canAccessTask } from "../src/lib/task-access-mode";
import type { Task } from "../src/data/tasks";

const allTasks = { ...HEADS_LEGS_TASKS, ...DIRICHLET_TASKS };

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

let errors = 0;

for (const task of Object.values(allTasks)) {
  const pub = task.publishing;
  if (!pub) continue;

  const childOk = canAccessTask(task, "child");
  const methodistOk = canAccessTask(task, "methodist");
  const archiveOk = canAccessTask(task, "archivePreview");

  assert(methodistOk, `${task.id}: methodist mode must allow access`);

  if (isChildVisible(pub)) {
    if (!childOk) {
      console.error(`✗ ${task.id}: child-visible but blocked in child mode`);
      errors++;
    }
    if (archiveOk && pub.publishTier !== "archive") {
      console.error(`✗ ${task.id}: child-route must not open via archivePreview alone`);
      errors++;
    }
  } else if (pub.publishTier === "archive") {
    if (childOk) {
      console.error(`✗ ${task.id}: archive tier must be blocked in child mode`);
      errors++;
    }
    if (!archiveOk) {
      console.error(`✗ ${task.id}: archive tier must open with ?mode=archive`);
      errors++;
    }
  } else {
    if (childOk) {
      console.error(`✗ ${task.id}: ${pub.publishTier}/${pub.qaStatus} must be blocked in child mode`);
      errors++;
    }
    if (archiveOk) {
      console.error(`✗ ${task.id}: non-archive must not open with archivePreview`);
      errors++;
    }
  }
}

const samples: Array<{ id: string; child: boolean; archivePreview: boolean; methodist: boolean }> =
  [
    { id: "heads-legs-1-01", child: true, archivePreview: false, methodist: true },
    { id: "dirichlet-t1-01", child: true, archivePreview: false, methodist: true },
    { id: "dirichlet-t1-07", child: false, archivePreview: false, methodist: true },
    { id: "dirichlet-t9-01", child: false, archivePreview: true, methodist: true },
    { id: "dirichlet-t4-26", child: false, archivePreview: false, methodist: true },
  ];

console.log("=== QA: доступ к задачам ===\n");
for (const s of samples) {
  const task = allTasks[s.id] as Task | undefined;
  if (!task) {
    console.error(`✗ sample ${s.id} not found`);
    errors++;
    continue;
  }
  const c = canAccessTask(task, "child");
  const a = canAccessTask(task, "archivePreview");
  const m = canAccessTask(task, "methodist");
  const pass = c === s.child && a === s.archivePreview && m === s.methodist;
  console.log(`${pass ? "✓" : "✗"} ${s.id} child=${c} archive=${a} methodist=${m}`);
  if (!pass) errors++;
}

if (errors) {
  console.error(`\n${errors} ошибок`);
  process.exit(1);
}

console.log("\n✓ Guard доступа согласован с publishing.");
process.exit(0);
