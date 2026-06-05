/**
 * Проверка guided-сценария для всех 51 задач.
 * Запуск: npx tsx scripts/qa-guided-steps.ts
 */
import { HEADS_LEGS_TASKS } from "../src/data/heads-legs/build-task";

const tasks = Object.values(HEADS_LEGS_TASKS).sort((a, b) => a.number - b.number);

const errors: string[] = [];
const warnings: string[] = [];

for (const task of tasks) {
  const steps = task.steps;
  const types = steps.map((s) => s.type);

  if (types.includes("model_build")) {
    errors.push(`${task.id}: есть лишний шаг model_build`);
  }
  if (types.includes("numeric_solve")) {
    warnings.push(`${task.id}: numeric_solve — возможно лишний для guided`);
  }
  if (!types.includes("word_solution")) {
    errors.push(`${task.id}: нет word_solution`);
  }
  if (!types.includes("drag_select")) {
    errors.push(`${task.id}: нет drag_select (выбор объектов)`);
  }

  const worksheets = steps.filter((s) => s.type === "worksheet_table");
  const wsRows = worksheets.reduce(
    (n, s) => n + (s.type === "worksheet_table" ? s.worksheetRows.length : 0),
    0,
  );
  if (wsRows === 0 && task.headsLegsMeta?.solutionMode !== "D") {
    warnings.push(`${task.id} (${task.headsLegsMeta?.methodTaskId}): 0 строк в worksheet`);
  }

  const meta = task.headsLegsMeta;
  if (meta?.entities?.some((e) => /^вид\s*[12]$/i.test(e.label))) {
    warnings.push(`${task.id} (${meta.methodTaskId}): объекты не распознаны — «Вид 1/2»`);
  }
}

console.log("=== Guided QA: 51 задача ===\n");
console.log(`Задач: ${tasks.length}`);
console.log(
  "Шаги (среднее):",
  (tasks.reduce((n, t) => n + t.steps.length, 0) / tasks.length).toFixed(1),
);

const stepTypes = tasks.flatMap((t) => t.steps.map((s) => s.type));
const typeCounts = stepTypes.reduce<Record<string, number>>((acc, t) => {
  acc[t] = (acc[t] ?? 0) + 1;
  return acc;
}, {});
console.log("Типы шагов:", JSON.stringify(typeCounts));

if (warnings.length) {
  console.log("\nПредупреждения:");
  warnings.forEach((w) => console.log("  ⚠", w));
}

if (errors.length) {
  console.log("\nОШИБКИ:");
  errors.forEach((e) => console.log("  ✗", e));
  process.exit(1);
}

console.log("\n✓ Guided-сценарий: все задачи без model_build, с word_solution.");
process.exit(0);
