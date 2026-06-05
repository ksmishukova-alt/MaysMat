#!/usr/bin/env node
/**
 * QA всех 51 задач ветки «Головы и ноги».
 * Запуск: npm run qa:heads-legs
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const HL = path.join(ROOT, "src", "data", "heads-legs");

const errors = [];
const warnings = [];

function read(name) {
  return fs.readFileSync(path.join(HL, name), "utf-8");
}

function countRegex(text, re) {
  return [...text.matchAll(re)].length;
}

function extractRecordKeys(text) {
  return [...text.matchAll(/^\s+"(\d+\.\d+)":/gm)].map((x) => x[1]);
}

function extractCatalogIds(text) {
  return [...text.matchAll(/"id":\s*"(heads-legs-\d+-\d+)"/g)].map((x) => x[1]);
}

function extractMethodIds(text) {
  return [...text.matchAll(/"methodTaskId":\s*"(\d+\.\d+)"/g)].map((x) => x[1]);
}

function extractSolutionModes(text) {
  return [...text.matchAll(/"solutionMode":\s*"([A-E])"/g)].map((x) => x[1]);
}

function checkSpecialTasks(answersText, catalogText) {
  if (!answersText.includes('"1.13"') || !/value:\s*12/.test(answersText)) {
    errors.push("1.13: ожидается single_scalar value 12");
  }
  if (!catalogText.includes("12 роботов") && !catalogText.includes("12 робот")) {
    warnings.push("1.13: в условии не найдено «12 роботов»");
  }
  if (!answersText.includes('"6.1"') || !/228/.test(answersText.split('"6.1"')[1]?.slice(0, 200) ?? "")) {
    errors.push("6.1: ожидается ответ 228");
  }
  if (!catalogText.includes("захвачено всего")) {
    warnings.push("6.1: формулировка «захвачено всего» не найдена в каталоге");
  }
}

function checkModeCoverage(modes) {
  const need = ["A", "B", "C", "D", "E"];
  for (const m of need) {
    if (!modes.includes(m)) errors.push(`Нет ни одной задачи с solutionMode ${m}`);
  }
}

function checkBlankIds(solutionText) {
  const ids = [...solutionText.matchAll(/"id":\s*"([^"]+)"/g)].map((x) => x[1]);
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) errors.push(`Дублирующийся blank id: ${id}`);
    seen.add(id);
  }
}

function checkBuildTask() {
  const text = read("build-task.ts");
  if (!text.includes("HEADS_LEGS_TASKS")) {
    errors.push("build-task.ts: нет экспорта HEADS_LEGS_TASKS");
  }
  if (!text.includes("buildGuidedSteps")) {
    errors.push("build-task.ts: нет buildGuidedSteps");
  }
  const guided = read("guided/build-guided-steps.ts");
  if (guided.includes("model_build")) {
    errors.push("build-guided-steps.ts: не должно быть model_build");
  }
  if (!guided.includes("word_solution")) {
    errors.push("build-guided-steps.ts: нет шага word_solution");
  }
}

function runGuidedQa() {
  const r = spawnSync("npx", ["tsx", "scripts/qa-guided-steps.ts"], {
    cwd: ROOT,
    encoding: "utf-8",
    shell: true,
  });
  if (r.status !== 0) {
    const out = (r.stdout || "") + (r.stderr || "");
    errors.push(`Guided QA:\n${out.slice(0, 2000)}`);
  } else if (r.stdout) {
    console.log(r.stdout);
  }
}

function runTsc() {
  const tsc = path.join(ROOT, "node_modules", ".bin", process.platform === "win32" ? "tsc.cmd" : "tsc");
  const r = spawnSync(tsc, ["--noEmit"], {
    cwd: ROOT,
    encoding: "utf-8",
    shell: process.platform === "win32",
  });
  if (r.status !== 0) {
    errors.push(`TypeScript: ${(r.stdout || r.stderr || `exit ${r.status}`).slice(0, 800)}`);
  }
}

// --- run ---
const catalog = read("catalog.generated.ts");
const solutions = read("solution-lines.generated.ts");
const hints = read("hints.generated.ts");
const answers = read("answers.ts");

const catalogIds = extractCatalogIds(catalog);
const methodIds = extractMethodIds(catalog);
const solutionKeys = extractRecordKeys(solutions);
const hintKeys = extractRecordKeys(hints);
const answerKeys = extractRecordKeys(answers);
const modes = extractSolutionModes(catalog);

console.log("=== QA: Головы и ноги (51 задача) ===\n");

if (catalogIds.length !== 51) errors.push(`Каталог: ${catalogIds.length} задач, ожидалось 51`);
if (methodIds.length !== 51) errors.push(`methodTaskId: ${methodIds.length}, ожидалось 51`);
if (solutionKeys.length !== 51) errors.push(`solution_lines: ${solutionKeys.length} ключей, ожидалось 51`);
if (hintKeys.length !== 51) errors.push(`hints: ${hintKeys.length} ключей, ожидалось 51`);
if (answerKeys.length !== 51) errors.push(`answers: ${answerKeys.length} ключей, ожидалось 51`);

const methodSet = new Set(methodIds);
if (methodSet.has("1.12")) errors.push("Задача 1.12 не должна быть в каталоге");

for (const mid of methodIds) {
  if (!solutionKeys.includes(mid)) errors.push(`${mid}: нет solution_lines`);
  if (!hintKeys.includes(mid)) errors.push(`${mid}: нет hints`);
  if (!answerKeys.includes(mid)) errors.push(`${mid}: нет answer`);
}

const dupMethod = methodIds.filter((id, i) => methodIds.indexOf(id) !== i);
if (dupMethod.length) errors.push(`Дубли methodTaskId: ${[...new Set(dupMethod)].join(", ")}`);

checkSpecialTasks(answers, catalog);
checkModeCoverage(modes);
checkBlankIds(solutions);
checkBuildTask();
runTsc();
runGuidedQa();

const modeCounts = modes.reduce((acc, m) => {
  acc[m] = (acc[m] ?? 0) + 1;
  return acc;
}, {});

console.log("Каталог:", catalogIds.length);
console.log("solution_lines:", solutionKeys.length);
console.log("hints:", hintKeys.length);
console.log("answers:", answerKeys.length);
console.log("Режимы A–E:", JSON.stringify(modeCounts));
console.log("");

if (warnings.length) {
  console.log("Предупреждения:");
  warnings.forEach((w) => console.log("  ⚠", w));
  console.log("");
}

if (errors.length) {
  console.log("ОШИБКИ:");
  errors.forEach((e) => console.log("  ✗", e));
  process.exit(1);
}

console.log("✓ QA пройден: все 51 задача на месте, TypeScript OK.");
process.exit(0);
