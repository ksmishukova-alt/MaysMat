/**
 * Полный аудит задач: UI/UX, методология, грамматика, логика шагов.
 * Запуск: npx tsx scripts/audit-all-tasks-report.ts
 * Выход: docs/TASK-AUDIT-REPORT.md
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import type { DiscriminatedTaskStep } from "../src/data/task-steps";
import type { Task } from "../src/data/tasks";
import { DIRICHLET_TASKS } from "../src/data/dirichlet/build-task";
import { HEADS_LEGS_TASKS } from "../src/data/heads-legs/build-task";
import { TASKS } from "../src/data/tasks";
import { parseSupportLevel, resolveWrittenPhase } from "../src/data/dirichlet/guided/support-level";
import { inferDirichletModel } from "../src/data/dirichlet/guided/infer-model";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../docs/TASK-AUDIT-REPORT.md");

type Finding = { severity: "error" | "warn" | "info"; text: string };

const HL_TERMS =
  /голов(?:а|ы|ам|ами)?|(?<![а-яё])ног(?:а|и|ам|ами)?(?![а-яё])|heads-legs|сороконожк/i;
const BOX_OK = /коробк|ящик/i;
const BAD_LABEL = /^(это|сортам|елок и|from-key)$/i;
const GENERIC_RABBIT = /предметы из условия/i;
const GENERIC_CELL = /категории \(«клетки»\)/i;
const MIXED_SCRIPT = /[а-яё][a-z]{2,}|[a-z]{2,}[а-яё]/i;

function collectText(steps: DiscriminatedTaskStep[]): string {
  const parts: string[] = [];
  for (const s of steps) {
    if ("title" in s && s.title) parts.push(s.title);
    if ("hint" in s && s.hint) parts.push(s.hint);
    if ("selectPrompt" in s && s.selectPrompt) parts.push(s.selectPrompt);
    if ("context" in s && s.context) parts.push(s.context);
    if ("question" in s && s.question) parts.push(s.question);
    if ("successMessage" in s && s.successMessage) parts.push(s.successMessage);
    if (s.type === "drag_select" || s.type === "single_select") {
      for (const o of s.options ?? []) {
        parts.push(o.label);
      }
    }
    if (s.type === "worksheet_table") {
      for (const r of s.worksheetRows ?? []) {
        parts.push(r.question);
        if (r.staticValue) parts.push(r.staticValue);
      }
    }
    if (s.type === "order_questions") {
      for (const it of s.orderItems ?? []) parts.push(it.text);
    }
    if (s.type === "proof_lines") {
      for (const c of s.proofCards ?? []) parts.push(c.text);
    }
    if (s.type === "word_solution") {
      for (const ln of s.solutionLines ?? []) parts.push(ln.template);
    }
  }
  return parts.join("\n");
}

function auditDirichlet(task: Task): Finding[] {
  const f: Finding[] = [];
  const meta = task.dirichletMeta!;
  const steps = task.steps;
  const allText = collectText(steps);
  const model = inferDirichletModel(
    meta.condition,
    meta.acceptedAnswers.solutionReference ?? "",
    meta.methodTaskId,
    meta.flowId,
  );

  if (HL_TERMS.test(allText)) {
    f.push({ severity: "error", text: "Терминология «голов и ног» / «участников» в шагах Дирихле" });
  }
  if (MIXED_SCRIPT.test(allText)) {
    f.push({ severity: "warn", text: "Смешение кириллицы и латиницы в тексте (напр. «минимum»)" });
  }

  for (const r of model.rabbits) {
    if (r.id === "from-key" || BAD_LABEL.test(r.label.trim())) {
      f.push({ severity: "error", text: `Зайцы: некорректная подпись «${r.label}» (id=${r.id}) — ошибка парсера модели` });
    }
    if (GENERIC_RABBIT.test(r.label.trim())) {
      f.push({ severity: "warn", text: "Зайцы: generic «Предметы из условия» — ребёнок не поймёт объект" });
    }
    if (r.label.length > 52) {
      f.push({ severity: "warn", text: `Зайцы: слишком длинная подпись карточки (${r.label.length} симв.)` });
    }
  }
  for (const c of model.cells) {
    if (c.id === "from-key" || BAD_LABEL.test(c.label.trim())) {
      f.push({ severity: "error", text: `Клетки: некорректная подпись «${c.label}» (id=${c.id})` });
    }
    if (GENERIC_CELL.test(c.label.trim())) {
      f.push({ severity: "warn", text: "Клетки: generic «Категории («клетки»)» — не привязано к условию" });
    }
    if (/^\d/.test(c.label) || /так как/i.test(c.label)) {
      f.push({ severity: "error", text: `Клетки: обрывок текста «${c.label}»` });
    }
  }

  if (meta.flowId === "F1_DIRECT" && (model.counts.n == null || model.counts.m == null)) {
    f.push({ severity: "warn", text: `F1: не выведены N или M (n=${model.counts.n}, m=${model.counts.m}) — шаги сравнения могут быть формальными` });
  }

  if (/утверждение верно по принципу дирихле/i.test(model.conclusionText)) {
    f.push({ severity: "warn", text: "Вывод: шаблонный conclusionText без связи с условием" });
  }

  const support = parseSupportLevel(meta.supportMode);
  const plan = resolveWrittenPhase(meta);
  const types = steps.map((s) => s.type);
  if (support <= 2 && steps.some((s) => s.id.includes("-intro"))) {
    f.push({ severity: "warn", text: `L${support}: лишний intro-шаг (лекция до drag)` });
  }
  if (support >= 3 && !steps.some((s) => s.id.includes("-intro"))) {
    f.push({ severity: "warn", text: `L${support}: нет intro — для уровня нужна мини-теория` });
  }
  if (plan.includeProofOrder && !types.includes("order_questions")) {
    f.push({ severity: "error", text: `L${support}: нет order_questions по плану записи` });
  }
  if (!plan.includeWordSolution && types.includes("word_solution")) {
    f.push({ severity: "warn", text: `L${support}: word_solution раньше времени` });
  }
  if (plan.includeProofLines && !types.includes("proof_lines")) {
    f.push({ severity: "error", text: `L${support}: нет proof_lines` });
  }

  for (const s of steps) {
    if (s.type === "drag_select") {
      for (const o of s.options ?? []) {
        if (o.emoji === "📦" && !BOX_OK.test(o.label)) {
          f.push({ severity: "warn", text: `${s.id}: «${o.label}» → 📦 (эмодзи не по смыслу)` });
        }
      }
    }
    if (s.type === "worksheet_table") {
      for (const r of s.worksheetRows ?? []) {
        if (/учеников\?\s*$/i.test(r.question) && !/ученик/i.test(meta.condition)) {
          f.push({ severity: "info", text: `${s.id}: падеж «учеников» может не совпасть с объектом задачи` });
        }
      }
    }
    if (s.id.includes("-compare") && s.type === "single_select" && !task.id.includes("t1-01")) {
      const opts = s.options?.map((o) => o.label).join(" ") ?? "";
      if (/турист|возраст/i.test(opts) && !/турист|возраст/i.test(meta.condition)) {
        f.push({ severity: "warn", text: "compare: шаблон M0.1 (туристы/возрасты) не по теме задачи" });
      }
    }
  }

  if (steps.length < 5 && meta.flowId === "F1_DIRECT") {
    f.push({ severity: "warn", text: `Мало шагов (${steps.length}) для F1_DIRECT` });
  }

  if (!steps.some((s) => s.id.includes("-rabbits"))) {
    f.push({ severity: "error", text: "Нет шага «зайцы»" });
  }
  if (!steps.some((s) => s.id.includes("-cells"))) {
    f.push({ severity: "error", text: "Нет шага «клетки»" });
  }

  const readStep = steps.find((s) => s.type === "read_condition");
  void readStep; // read_condition добавляется в TaskPlayer, не в guided steps

  return f;
}

function auditHeadsLegs(task: Task): Finding[] {
  const f: Finding[] = [];
  const meta = task.headsLegsMeta!;
  const steps = task.steps;
  const allText = collectText(steps);

  if (/minimum|mininum|минимum/i.test(allText)) {
    f.push({ severity: "warn", text: "Опечатка «минимum/minimum» в тексте шага" });
  }

  const objects = steps.find((s) => s.id.includes("-objects") || s.title?.includes("участв"));
  if (objects?.type === "drag_select") {
    for (const o of objects.options.filter((x) => x.correct)) {
      if (o.label === "Вид 1" || o.label === "Вид 2") {
        f.push({ severity: "error", text: "Объекты не распознаны — «Вид 1/2» (эвристика провалилась)" });
      }
      if (o.emoji === "📦" && !BOX_OK.test(o.label)) {
        f.push({ severity: "warn", text: `objects: «${o.label}» → 📦` });
      }
    }
  }

  const feature = steps.find((s) => s.type === "worksheet_table" && s.id.includes("feature"));
  if (feature?.type === "worksheet_table") {
    for (const r of feature.worksheetRows ?? []) {
      if (r.emoji === "📦" && !BOX_OK.test(r.label)) {
        f.push({ severity: "warn", text: `feature: «${r.label}» → 📦` });
      }
    }
  }

  if (!steps.some((s) => s.type === "read_condition")) {
    f.push({ severity: "info", text: "read_condition в TaskPlayer (не в массиве steps)" });
  }

  if (meta.solutionMode === "E" && !task.requiresUpload && !steps.some((s) => s.type === "paper_upload")) {
    f.push({ severity: "info", text: "Режим E: paper_upload на уровне TaskPlayer (не в guided steps)" });
  }

  if (steps.length < 4) {
    f.push({ severity: "warn", text: `Мало шагов (${steps.length})` });
  }

  if (/🅰|🅱/.test(allText)) {
    f.push({ severity: "info", text: "Шаг предположения с 🅰/🅱 вместо смысловых эмодзи (если не обновлён build)" });
  }

  return f;
}

function auditLegacy(task: Task): Finding[] {
  const f: Finding[] = [];
  if (!task.steps.length) f.push({ severity: "error", text: "Нет шагов" });
  if (task.steps.every((s) => s.type === "auto_explanation")) {
    f.push({ severity: "info", text: "Legacy: только auto_explanation, без guided-runner" });
  }
  return f;
}

function taskNumber(task: Task): string {
  if (task.dirichletMeta) return task.dirichletMeta.methodTaskId;
  if (task.headsLegsMeta) return task.headsLegsMeta.methodTaskId;
  return task.id;
}

function formatFindings(findings: Finding[]): string {
  const significant = findings.filter((x) => x.severity !== "info");
  if (significant.length === 0) return "**ОК**";
  return significant
    .map((x) => {
      const icon = x.severity === "error" ? "🔴" : x.severity === "warn" ? "🟡" : "🔵";
      return `- ${icon} ${x.text}`;
    })
    .join("\n");
}

function section(title: string, tasks: Task[], auditFn: (t: Task) => Finding[]): string {
  const sorted = [...tasks].sort((a, b) => {
    const na = taskNumber(a);
    const nb = taskNumber(b);
    return na.localeCompare(nb, undefined, { numeric: true });
  });

  let ok = 0;
  let issues = 0;
  const lines: string[] = [`## ${title}`, "", `| № | ID | Статус |`, `|---|-----|--------|`];

  const details: string[] = [];

  for (const task of sorted) {
    const num = taskNumber(task);
    const findings = auditFn(task);
    const significant = findings.filter((x) => x.severity !== "info");
    if (significant.length === 0) {
      ok++;
      lines.push(`| ${num} | \`${task.id}\` | **ОК** |`);
    } else {
      issues++;
      const err = significant.filter((x) => x.severity === "error").length;
      const warn = significant.filter((x) => x.severity === "warn").length;
      lines.push(`| ${num} | \`${task.id}\` | ${err}🔴 ${warn}🟡 |`);
      details.push(`### ${num} — \`${task.id}\`\n\n${formatFindings(findings)}\n`);
    }
  }

  lines.push("", `**Итого:** ${sorted.length} задач — **ОК:** ${ok}, **с замечаниями:** ${issues}`, "");

  if (details.length) {
    lines.push("### Детали замечаний", "", ...details);
  }

  return lines.join("\n");
}

const dirichlet = Object.values(DIRICHLET_TASKS);
const headsLegs = Object.values(HEADS_LEGS_TASKS);
const legacy = Object.values(TASKS).filter(
  (t) => !t.dirichletMeta && !t.headsLegsMeta,
);

const summaryStats = {
  dOk: 0,
  dIssues: 0,
  hlOk: 0,
  hlIssues: 0,
};

for (const t of dirichlet) {
  const f = auditDirichlet(t).filter((x) => x.severity !== "info");
  if (f.length === 0) summaryStats.dOk++;
  else summaryStats.dIssues++;
}
for (const t of headsLegs) {
  const f = auditHeadsLegs(t).filter((x) => x.severity !== "info");
  if (f.length === 0) summaryStats.hlOk++;
  else summaryStats.hlIssues++;
}

const now = new Date().toISOString().slice(0, 10);

const md = `# Отчёт тестирования задач (${now})

Автоматический аудит + эвристики UI/UX, методологии (L1–L5, flow F1–F10), падежи, парсинг модели.

| Блок | Всего | ОК | С замечаниями |
|------|------:|---:|--------------:|
| Дирихле (methodology-bank) | ${dirichlet.length} | ${summaryStats.dOk} | ${summaryStats.dIssues} |
| Головы и ноги | ${headsLegs.length} | ${summaryStats.hlOk} | ${summaryStats.hlIssues} |
| Прочие (legacy) | ${legacy.length} | — | — |

**Легенда:** 🔴 ошибка/блокер · 🟡 предупреждение · 🔵 замечание · **ОК** — замечаний нет

---

${section("Дирихле — methodology-bank", dirichlet, auditDirichlet)}

---

${section("Головы и ноги", headsLegs, auditHeadsLegs)}

---

${legacy.length ? section("Прочие задачи", legacy, auditLegacy) : ""}

---

## Системные проблемы (сквозные)

1. **F5/F10 без N/M** — у части геометрических задач compare-шаг формальный (нет явных N, M в условии).
2. **Legacy fairy-caves** — старый runner без guided methodology-bank.

## Рекомендации по приоритету

1. Ручная вычитка L4–L5 задач с «См. задачу …» в ключе (внешние ссылки методички).
2. Прогнать \`npm run qa:entity-emojis\` после правок эмодзи.
3. F1 compare, conclusionText F4/F7 и generic-категории закрыты (218/218 ОК в \`qa:task-audit\`).
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, md, "utf8");
console.log(`Written ${OUT}`);
console.log(`Dirichlet: ${summaryStats.dOk} OK / ${summaryStats.dIssues} with issues`);
console.log(`Heads-legs: ${summaryStats.hlOk} OK / ${summaryStats.hlIssues} with issues`);
