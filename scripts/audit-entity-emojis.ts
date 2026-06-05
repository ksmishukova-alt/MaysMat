/**
 * Проверка эмодзи на карточках вариантов (Дирихле + Головы и ноги).
 * Запуск: npx tsx scripts/audit-entity-emojis.ts
 */
import type { DiscriminatedTaskStep } from "../src/data/task-steps";
import { DIRICHLET_TASKS } from "../src/data/dirichlet/build-task";
import { HEADS_LEGS_TASKS } from "../src/data/heads-legs/build-task";

const BOX_OK = /коробк|ящик/i;

type OptionLike = { label: string; emoji: string };

function collectOptions(steps: DiscriminatedTaskStep[]): Array<{ taskId: string; stepId: string; opt: OptionLike }> {
  const out: Array<{ taskId: string; stepId: string; opt: OptionLike }> = [];
  for (const step of steps) {
    if (step.type === "drag_select" || step.type === "single_select") {
      for (const opt of step.options ?? []) {
        out.push({ taskId: "", stepId: step.id, opt });
      }
    }
    if (step.type === "table_input") {
      for (const row of step.rows ?? []) {
        if (row.emoji && row.label) {
          out.push({ taskId: "", stepId: step.id, opt: { label: row.label, emoji: row.emoji } });
        }
      }
    }
  }
  return out;
}

const issues: string[] = [];

for (const task of Object.values(DIRICHLET_TASKS)) {
  for (const { stepId, opt } of collectOptions(task.steps)) {
    if (opt.emoji === "📦" && !BOX_OK.test(opt.label)) {
      issues.push(`dirichlet ${task.id} · ${stepId}: «${opt.label}» → 📦`);
    }
  }
}

for (const task of Object.values(HEADS_LEGS_TASKS)) {
  for (const { stepId, opt } of collectOptions(task.steps)) {
    if (opt.emoji === "📦" && !BOX_OK.test(opt.label)) {
      issues.push(`heads-legs ${task.id} · ${stepId}: «${opt.label}» → 📦`);
    }
  }
}

console.log("=== Audit entity emojis ===\n");
console.log(`Dirichlet: ${Object.keys(DIRICHLET_TASKS).length} задач`);
console.log(`Heads-legs: ${Object.keys(HEADS_LEGS_TASKS).length} задач`);

if (issues.length === 0) {
  console.log("\n✓ Нет карточек с 📦 вне контекста коробок/ящиков.");
  process.exit(0);
}

console.log(`\nНайдено ${issues.length} проблем:`);
for (const line of issues.slice(0, 40)) {
  console.log("  ✗", line);
}
if (issues.length > 40) {
  console.log(`  … ещё ${issues.length - 40}`);
}
process.exit(1);
