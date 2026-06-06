/**
 * QA guided-runner для methodology-bank (218 задач).
 * Запуск: npx tsx scripts/qa-dirichlet-guided.ts
 */
import { DIRICHLET_TASKS } from "../src/data/dirichlet/build-task";
import { skipsDefaultEntityDrag } from "../src/data/dirichlet/guided/custom";
import { parseSupportLevel, resolveWrittenPhase } from "../src/data/dirichlet/guided/support-level";

const tasks = Object.values(DIRICHLET_TASKS).sort((a, b) => a.number - b.number);

const errors: string[] = [];
const warnings: string[] = [];

for (const task of tasks) {
  const meta = task.dirichletMeta;
  if (meta?.flowId === "F3_UNLUCKY") {
    continue;
  }

  const steps = task.steps;
  const types = steps.map((s) => s.type);
  const plan = meta ? resolveWrittenPhase(meta) : null;
  const support = meta ? parseSupportLevel(meta.supportMode) : null;

  const methodId = meta?.methodTaskId ?? "";
  const skipEntityDrag = skipsDefaultEntityDrag(methodId);

  if (!skipEntityDrag) {
    if (!types.includes("drag_select")) {
      errors.push(`${task.id}: нет drag_select (зайцы/клетки)`);
    }
    if (!steps.some((s) => s.id.includes("-rabbits"))) {
      errors.push(`${task.id}: нет шага «зайцы»`);
    }
    if (!steps.some((s) => s.id.includes("-cells"))) {
      errors.push(`${task.id}: нет шага «клетки»`);
    }
  }

  const withoutPhase = steps.filter((s) => s.screenPhaseCount == null);
  if (withoutPhase.length > 0) {
    errors.push(`${task.id}: ${withoutPhase.length} шаг(ов) без screenPhaseCount`);
  }

  if (plan) {
    const hasOrder = types.includes("order_questions");
    const hasProofLines = types.includes("proof_lines");
    const hasWord = types.includes("word_solution");

    if (plan.includeProofOrder && !hasOrder) {
      errors.push(`${task.id}: L${support} — нужен proof-order`);
    }
    if (!plan.includeProofOrder && hasOrder) {
      errors.push(`${task.id}: L${support} — лишний proof-order (рано для уровня опоры)`);
    }
    if (plan.includeProofLines && !hasProofLines) {
      errors.push(`${task.id}: L${support} — нужен proof_lines`);
    }
    if (!plan.includeProofLines && hasProofLines) {
      errors.push(`${task.id}: L${support} — лишний proof_lines`);
    }
    if (plan.includeWordSolution && !hasWord) {
      errors.push(`${task.id}: L${support} — нужен word_solution`);
    }
    if (!plan.includeWordSolution && hasWord) {
      errors.push(`${task.id}: L${support} — лишний word_solution (полная запись рано)`);
    }

    if (support != null && support <= 2 && steps.some((s) => s.id.includes("-intro"))) {
      errors.push(`${task.id}: L${support} — лишний intro (теория после read_condition)`);
    }
    if (support != null && support >= 3 && !steps.some((s) => s.id.includes("-intro"))) {
      errors.push(`${task.id}: L${support} — нужен intro`);
    }

    if (hasProofLines && hasWord && support === 1) {
      errors.push(`${task.id}: L1 — карточки и полная запись вместе`);
    }
  }

  const rabbits = steps.find((s) => s.id.includes("-rabbits"));
  if (rabbits?.type === "drag_select" && rabbits.options.filter((o) => o.correct).length === 0) {
    errors.push(`${task.id}: у зайцев нет correct options`);
  }

  if (steps.length < 6) {
    warnings.push(`${task.id} (${meta?.flowId}): мало шагов (${steps.length})`);
  }
}

console.log("=== Dirichlet guided QA ===\n");
console.log(`Задач: ${tasks.length}`);
console.log(
  "Шагов (среднее):",
  (tasks.reduce((n, t) => n + t.steps.length, 0) / tasks.length).toFixed(1),
);

const sample = tasks.find((t) => t.id === "dirichlet-t1-01");
if (sample?.dirichletMeta) {
  const plan = resolveWrittenPhase(sample.dirichletMeta);
  console.log("\nПример dirichlet-t1-01 (L1):");
  console.log("  support:", sample.dirichletMeta.supportMode);
  console.log("  independence:", sample.independenceLevel);
  console.log("  written plan:", plan);
  for (const s of sample.steps) {
    console.log(
      `  - ${s.id} [${s.type}] фаза ${s.screenPhaseIndex}/${s.screenPhaseCount}${s.screenSubStep ? ` · ${s.screenSubStep}` : ""}`,
    );
  }
}

const bySupport: Record<number, number> = {};
for (const t of tasks) {
  if (!t.dirichletMeta) continue;
  const L = parseSupportLevel(t.dirichletMeta.supportMode);
  bySupport[L] = (bySupport[L] ?? 0) + 1;
}
console.log("\nПо уровням опоры:", bySupport);

if (warnings.length) {
  console.log("\nПредупреждения:");
  warnings.slice(0, 8).forEach((w) => console.log("  ⚠", w));
}

if (errors.length) {
  console.log("\nОШИБКИ:");
  errors.slice(0, 25).forEach((e) => console.log("  ✗", e));
  if (errors.length > 25) console.log(`  … ещё ${errors.length - 25}`);
  process.exit(1);
}

console.log("\n✓ Фаза записи согласована с L1–L5 (support_mode).");
process.exit(0);
