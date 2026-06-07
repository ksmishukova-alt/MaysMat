/**
 * Генерация экранного аудита 51 задачи.
 * npm run generate:heads-legs-screen-audit
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { HEADS_LEGS_TASKS } from "../src/data/heads-legs/build-task";
import {
  buildHeadsLegsPlayerSteps,
  isHeadsLegsProgressionTask,
} from "../src/data/heads-legs/base-pattern/build-player-steps";
import {
  HEADS_LEGS_FULL_METHODOLOGY_AUDIT,
  type FullMethodologyAuditRecord,
} from "../src/data/heads-legs/full-methodology-audit";
import { DUAL_ASSUME_PATH_CONFIG } from "../src/data/heads-legs/derive-pattern/dual-assume-paths";
import { HEADS_LEGS_ANSWERS } from "../src/data/heads-legs/answers";
import type {
  ScreenMethodologyAuditItem,
  TaskScreenMethodologyAudit,
} from "../src/data/heads-legs/screen-methodology-audit-types";

function formatExpectedAnswer(methodTaskId: string): string {
  const ans = HEADS_LEGS_ANSWERS[methodTaskId as keyof typeof HEADS_LEGS_ANSWERS];
  if (!ans) return "—";
  if (ans.kind === "single_scalar") return `${ans.value}${ans.label ? ` ${ans.label}` : ""}`;
  if (ans.kind === "text") return ans.format;
  if (ans.kind === "diagnostic") return "диагностический вывод";
  if (ans.kind === "single") return JSON.stringify(ans.values);
  if (ans.kind === "multi_set") return `${ans.sets.length} вариант(ов)`;
  return "—";
}

function runnerLabel(record: FullMethodologyAuditRecord, taskId: string): string {
  const task = HEADS_LEGS_TASKS[taskId];
  if (!task) return "missing";
  if (!isHeadsLegsProgressionTask(task)) return "DigitalTaskPlayer (legacy)";
  const pilot = record.currentFlowMode ?? "standard";
  if (record.preludeType === "unit_conversion" || record.preludeType === "common_resource") {
    return `HeadsLegsRunner / derive (${pilot})`;
  }
  if (record.solutionMode === "transfer") return "HeadsLegsRunner / transfer";
  return `HeadsLegsRunner / ${pilot}`;
}

function subjectivePhrases(text: string): boolean {
  return /удобнее|получили|даёт\s+\d|дает\s+\d/i.test(text);
}

function screenFromStep(
  step: ReturnType<typeof buildHeadsLegsPlayerSteps>[number],
  index: number,
  record: FullMethodologyAuditRecord,
): ScreenMethodologyAuditItem {
  const n = index + 1;
  const base = {
    screenNumber: n,
    screenTitle:
      "title" in step && step.title ? String(step.title) : String(step.type),
    screenKind: String(step.type),
    riskLevel: "none" as const,
  };

  switch (step.type) {
    case "read_condition":
      return {
        ...base,
        childAction: "Прочитать условие и нажать «Прочитал, дальше»",
        expectedAnswer: "—",
        whyThisStepExists: "Ориентация в задаче перед методом.",
        validationRule: "Кнопка продолжения без проверки содержания.",
      };
    case "hl_derive_prelude":
      return {
        ...base,
        childAction: "Выбрать prelude-действие, ввести выведенное число, нормы признака и totals",
        expectedAnswer: "preludeDeriveAnswer + feature norms + totals из ruleInstance",
        whyThisStepExists: `Prelude типа «${record.preludeType}» — получить недостающие данные до замены.`,
        validationRule: "Строгое числовое совпадение с ruleInstance / preludeFeatureNorms.",
        riskLevel: record.preludeType === "none" ? "high" : "none",
        notes: record.preludeType === "none" ? "derive-text без prelude — ошибка" : undefined,
      };
    case "hl_intro":
      return {
        ...base,
        childAction: "Прочитать методическую рамку и продолжить",
        expectedAnswer: "—",
        whyThisStepExists: "Связка prelude → знакомый метод замены.",
        validationRule: "Без проверки.",
        riskLevel:
          record.solutionMode === "transfer" && /сначала нужно собрать/i.test(String(step.template))
            ? "high"
            : "none",
      };
    case "hl_dual_path_assume":
      return {
        ...base,
        childAction: "Выбрать вид для пробной картины (оба пути допустимы)",
        expectedAnswer: step.dualAssumeConfig.entityLabels,
        whyThisStepExists: "Начало метода замены: «представим, что все одного вида».",
        validationRule: "Оба варианта принимаются; word solution ветвится по выбору.",
        alternativeValidPath: true,
        riskLevel: "none",
        notes: "Исправлено: убран субъективный «удобнее».",
      };
    case "single_select": {
      const opts = "options" in step ? step.options ?? [] : [];
      const correct = opts.filter((o) => o.correct).map((o) => o.label);
      const ctx = "context" in step ? String(step.context ?? "") : "";
      const prompt = "selectPrompt" in step ? String(step.selectPrompt ?? "") : "";
      const subjective = subjectivePhrases(`${ctx} ${prompt}`);
      const altPath =
        opts.filter((o) => o.correct).length === 1 &&
        opts.length === 2 &&
        record.primaryMethod.includes("replacement");
      return {
        ...base,
        childAction: prompt || ctx || "Выбрать один вариант",
        expectedAnswer: correct.length ? correct : "—",
        whyThisStepExists: step.id.includes("assume")
          ? "Выбор вида для пробной картины."
          : "Проверка понимания / выбор метода.",
        validationRule: `single_select: correct=${correct.join(", ") || "?"}`,
        possibleWrongButReasonableAnswers:
          altPath && !subjective
            ? ["Второй вид — математически возможен другой путь assume"]
            : undefined,
        alternativeValidPath: altPath,
        riskLevel: subjective ? "high" : altPath ? "medium" : "none",
        notes: subjective ? "Субъективная формулировка без критерия" : undefined,
      };
    }
    case "hl_question_check":
      return {
        ...base,
        childAction: "Подтвердить, что именно спрашивает задача",
        expectedAnswer: step.questionAsks,
        whyThisStepExists: "Question-check перед записью ответа.",
        validationRule: "Подтверждение без альтернатив.",
        riskLevel: "none",
      };
    case "word_solution":
      return {
        ...base,
        childAction: "Заполнить пропуски в тексте решения",
        expectedAnswer: formatExpectedAnswer(record.methodTaskId),
        whyThisStepExists: "Развёрнутая запись метода замены.",
        validationRule: "validateWordSolutionFull: blanks + expression format",
        riskLevel: "low",
      };
    case "auto_explanation":
      return {
        ...base,
        childAction: "Прочитать эталон решения",
        expectedAnswer: formatExpectedAnswer(record.methodTaskId),
        whyThisStepExists: "Preview / ответ после записи.",
        validationRule: "Без проверки.",
        riskLevel: "none",
      };
    case "hl_choose_method":
      return {
        ...base,
        childAction: "Выбрать следующий шаг метода из hub (профиль 3+)",
        expectedAnswer: "Зависит от этапа решения",
        whyThisStepExists: "Снятие опоры: ребёнок выбирает шаг.",
        validationRule: "Сопоставление stepId с текущим этапом worksheets.",
        riskLevel: "low",
      };
    case "worksheet_table":
    case "table_input":
      return {
        ...base,
        childAction: "Ввести числа / формулы в таблицу",
        expectedAnswer: "answers из worksheetRows / table rows",
        whyThisStepExists: "Пробный расчёт или перенос данных из условия.",
        validationRule: "Числовое / formula совпадение по строкам.",
        riskLevel: subjectivePhrases(String("hint" in step ? step.hint : "")) ? "medium" : "low",
      };
    case "drag_select":
      return {
        ...base,
        childAction: "Выбрать участников задачи",
        expectedAnswer: "entities из condition",
        whyThisStepExists: "Модель: кто участвует.",
        validationRule: "Множественный выбор по entities.",
        riskLevel: record.preludeType !== "none" ? "medium" : "none",
        notes:
          record.preludeType !== "none"
            ? "Для derive-задач шаг «кто участвует» не должен показываться"
            : undefined,
      };
    default:
      return {
        ...base,
        childAction: `Взаимодействие: ${step.type}`,
        expectedAnswer: "—",
        whyThisStepExists: "Шаг runner.",
        validationRule: step.type,
        riskLevel: "low",
      };
  }
}

function buildTaskAudit(record: FullMethodologyAuditRecord): TaskScreenMethodologyAudit {
  const task = HEADS_LEGS_TASKS[record.taskId];
  const alt: string[] = [];
  const dual = DUAL_ASSUME_PATH_CONFIG[record.methodTaskId];
  if (dual) {
    alt.push(`assume через ${dual.entityLabels[0]}`);
    alt.push(`assume через ${dual.entityLabels[1]}`);
  } else if (
    record.primaryMethod.includes("replacement") &&
    !record.primaryMethod.includes("transfer")
  ) {
    alt.push("Второй assume-путь возможен математически — проверить single_select assume");
  }

  let screens: ScreenMethodologyAuditItem[] = [];
  const risks: string[] = [];
  const fixes: string[] = [];

  if (task && isHeadsLegsProgressionTask(task)) {
    const steps = buildHeadsLegsPlayerSteps(task);
    screens = steps.map((s, i) => screenFromStep(s, i, record));
  } else {
    screens = [
      {
        screenNumber: 1,
        screenTitle: "Legacy DigitalTaskPlayer",
        screenKind: "legacy_digital",
        childAction: "Прохождение legacy-шагов из task.steps",
        expectedAnswer: formatExpectedAnswer(record.methodTaskId),
        whyThisStepExists: "Reserve / blocked — unified runner не подключён.",
        validationRule: "Legacy step validators",
        riskLevel: record.publishRecommendation === "childRoute" ? "high" : "low",
        notes: record.notes,
      },
    ];
  }

  for (const sc of screens) {
    if (sc.riskLevel === "high") risks.push(`${sc.screenTitle}: ${sc.notes ?? sc.validationRule}`);
    if (sc.riskLevel === "medium" && sc.notes) risks.push(`${sc.screenTitle}: ${sc.notes}`);
  }

  if (record.methodTaskId === "5.2" && dual) {
    fixes.push("FIXED: dual-path assume + ветвление word solution");
  }
  if (record.methodTaskId === "5.6" && dual) {
    fixes.push("FIXED: dual-path assume + ветвление word solution");
  }
  if (record.publishRecommendation === "blocked") {
    risks.push("blocked — не должна открываться в childRoute");
  }

  return {
    taskId: record.taskId,
    methodTaskId: record.methodTaskId,
    title: record.title,
    primaryMethod: record.primaryMethod,
    preludeType: record.preludeType,
    solutionMode: record.solutionMode,
    runner: runnerLabel(record, record.taskId),
    publishRecommendation: record.publishRecommendation,
    expectedAnswer: formatExpectedAnswer(record.methodTaskId),
    alternativeValidStrategies: alt,
    screens,
    validationRisks: risks,
    requiredFixes: fixes,
    publicationStatus: record.canonicalPublishRecommendation,
  };
}

const audits = HEADS_LEGS_FULL_METHODOLOGY_AUDIT.map(buildTaskAudit);

const outTs = join(process.cwd(), "src/data/heads-legs/full-screen-methodology-audit.ts");
const tsBody = `/**
 * Экранный аудит методологии «Головы и ноги» (51 задача).
 * Сгенерировано: scripts/generate-heads-legs-screen-audit.ts
 * Не редактировать вручную — перегенерировать npm run generate:heads-legs-screen-audit
 */
import type { TaskScreenMethodologyAudit } from "./screen-methodology-audit-types";

export type { ScreenMethodologyAuditItem, TaskScreenMethodologyAudit } from "./screen-methodology-audit-types";

export const HEADS_LEGS_SCREEN_METHODOLOGY_AUDIT: TaskScreenMethodologyAudit[] = ${JSON.stringify(audits, null, 2)} as TaskScreenMethodologyAudit[];

export function getScreenMethodologyAudit(taskIdOrMethodId: string): TaskScreenMethodologyAudit | undefined {
  return HEADS_LEGS_SCREEN_METHODOLOGY_AUDIT.find(
    (r) => r.taskId === taskIdOrMethodId || r.methodTaskId === taskIdOrMethodId,
  );
}
`;
writeFileSync(outTs, tsBody, "utf8");

const mdLines: string[] = [
  "# Экранный аудит методологии «Головы и ноги» (51 задача)",
  "",
  "Сгенерировано из player steps + канонической карты методов.",
  "",
  "Перегенерация: `npm run generate:heads-legs-screen-audit`",
  "",
  "Проверка: `npm run audit:heads-legs-screens`",
  "",
];

for (const a of audits) {
  mdLines.push(`## ${a.methodTaskId} — ${a.title}`, "");
  mdLines.push(`| Поле | Значение |`);
  mdLines.push(`|---|---|`);
  mdLines.push(`| taskId | \`${a.taskId}\` |`);
  mdLines.push(`| primaryMethod | ${a.primaryMethod} |`);
  mdLines.push(`| preludeType | ${a.preludeType} |`);
  mdLines.push(`| solutionMode | ${a.solutionMode} |`);
  mdLines.push(`| runner | ${a.runner} |`);
  mdLines.push(`| publish | ${a.publishRecommendation} |`);
  mdLines.push(`| expectedAnswer | ${a.expectedAnswer} |`);
  mdLines.push(`| alternativeStrategies | ${a.alternativeValidStrategies.join("; ") || "—"} |`);
  mdLines.push(`| validationRisks | ${a.validationRisks.join("; ") || "—"} |`);
  mdLines.push(`| requiredFixes | ${a.requiredFixes.join("; ") || "—"} |`);
  mdLines.push("");
  mdLines.push("### Экраны", "");
  mdLines.push("| # | Title | Kind | Expected | Risk |");
  mdLines.push("|---:|---|---|---|---|");
  for (const s of a.screens) {
    const exp = Array.isArray(s.expectedAnswer) ? s.expectedAnswer.join(" / ") : s.expectedAnswer;
    mdLines.push(`| ${s.screenNumber} | ${s.screenTitle} | ${s.screenKind} | ${exp} | ${s.riskLevel} |`);
  }
  mdLines.push("");
}

const outMd = join(process.cwd(), "docs/heads-legs-all-51-screen-methodology.md");
writeFileSync(outMd, mdLines.join("\n"), "utf8");

console.log(`✓ ${audits.length} задач → ${outTs}`);
console.log(`✓ markdown → ${outMd}`);
