import type { Page } from "@playwright/test";
import type { Task } from "../../src/data/tasks";
import { HEADS_LEGS_TASKS } from "../../src/data/heads-legs/build-task";
import { HEADS_LEGS_SOLUTION_LINES } from "../../src/data/heads-legs/solution-lines.generated";
import type { SolutionLine } from "../../src/data/heads-legs/types";

const ADVANCE_MS = 1_100;

function methodTaskId(taskId: string): string {
  return HEADS_LEGS_TASKS[taskId]?.headsLegsMeta?.methodTaskId ?? "";
}

function solutionLines(taskId: string): SolutionLine[] {
  const mid = methodTaskId(taskId);
  return HEADS_LEGS_SOLUTION_LINES[mid] ?? [];
}

function blankAcceptValue(line: SolutionLine, blankIndex: number): string {
  const blank = line.blanks[blankIndex];
  if (!blank) return "";
  const accept = blank.accept;
  if (Array.isArray(accept)) return String(accept[0] ?? "");
  return String(accept ?? "");
}

export function buildModeCText(taskId: string): string {
  const lines = solutionLines(taskId);
  return lines
    .map((line) => {
      let bi = 0;
      return line.template.replace(/\[([^\]]*)\]/g, () => {
        const value = blankAcceptValue(line, bi);
        bi += 1;
        return value;
      });
    })
    .join("\n");
}

async function waitStepAdvance(page: Page) {
  await page.waitForTimeout(ADVANCE_MS);
}

async function clickIfVisible(page: Page, name: string | RegExp): Promise<boolean> {
  const btn = page.getByRole("button", { name });
  if (!(await btn.isVisible().catch(() => false))) return false;
  if (await btn.isDisabled().catch(() => false)) return false;
  await btn.click();
  await waitStepAdvance(page);
  return true;
}

async function clickCardByLabel(page: Page, label: string) {
  await page
    .locator("button")
    .filter({ has: page.locator("span.text-sm.font-medium", { hasText: label }) })
    .first()
    .click();
}

function worksheetMatchScore(question: string, rowQuestion: string): number {
  const q = question.replace(/\s+/g, " ").trim().toLowerCase();
  const rq = rowQuestion.replace(/\s+/g, " ").trim().toLowerCase();
  if (!q || !rq) return 0;

  let score = 0;
  const chunk = rq.slice(0, 24);
  if (q.includes(chunk) || rq.includes(q.slice(0, 24))) {
    score += Math.min(q.length, rq.length);
  }
  if (q.includes("по условию") && rq.includes("по условию")) score += 100;
  if (q.includes("всего") && rq.includes("всего")) score += 40;
  if (q.includes("было бы") && rq.includes("было бы")) score += 80;
  return score;
}

function findWorksheetAnswerByPrefix(task: Task, prefix: string): number | null {
  const p = prefix.replace(/\s+/g, " ").trim().toLowerCase();
  if (!p) return null;

  for (const step of task.steps) {
    if (step.type !== "worksheet_table" || !step.worksheetRows) continue;
    for (const row of step.worksheetRows) {
      if (!row.prefix || row.answer == null) continue;
      const rp = row.prefix.replace(/\s+/g, " ").trim().toLowerCase();
      if (p === rp || p.startsWith(rp.replace("=", "").trim()) || rp.startsWith(p.replace("=", "").trim())) {
        return row.answer;
      }
    }
  }
  return null;
}

function findWorksheetAnswer(task: Task, question: string): number | null {
  let best: { score: number; answer: number } | null = null;

  for (const step of task.steps) {
    if (step.type !== "worksheet_table" || !step.worksheetRows) continue;
    for (const row of step.worksheetRows) {
      if (row.inputType === "static" || row.answer == null) continue;
      const score = worksheetMatchScore(question, row.question);
      if (score > 0 && (!best || score > best.score)) {
        best = { score, answer: row.answer };
      }
    }
  }
  return best?.answer ?? null;
}

async function fillWorksheetTable(page: Page, task: Task): Promise<boolean> {
  const inputRows = page.locator("tbody tr").filter({ has: page.locator('input[type="number"]') });
  const count = await inputRows.count();
  if (count === 0) return false;

  const checkBtn = page.getByRole("button", { name: "Проверить таблицу" });
  if (!(await checkBtn.isVisible().catch(() => false))) return false;

  for (let i = 0; i < count; i++) {
    const row = inputRows.nth(i);
    const question = ((await row.locator("td").first().textContent()) ?? "").trim();
    const prefixEl = row.locator(".font-mono").first();
    const prefix =
      (await prefixEl.isVisible().catch(() => false))
        ? ((await prefixEl.textContent()) ?? "").trim()
        : "";
    const answer =
      findWorksheetAnswerByPrefix(task, prefix) ?? findWorksheetAnswer(task, question);
    if (answer != null) {
      await row.locator('input[type="number"]').fill(String(answer));
    }
  }

  await checkBtn.click({ noWaitAfter: true });
  if (await page.getByText("Проверь ответы").isVisible().catch(() => false)) return false;
  await waitStepAdvance(page);
  return true;
}

async function fillTableInput(page: Page, task: Task): Promise<boolean> {
  if (await page.getByRole("button", { name: "Проверить таблицу" }).isVisible().catch(() => false)) {
    return false;
  }
  const tableInputs = page.locator('table input[type="number"]');
  if ((await tableInputs.count()) === 0) return false;
  const checkBtn = page.getByRole("button", { name: "Проверить" });
  if (!(await checkBtn.first().isVisible().catch(() => false))) return false;

  for (const step of task.steps) {
    if (step.type !== "table_input") continue;
    for (const row of step.rows) {
      const tr = page.locator("tr", { hasText: row.label }).first();
      if (await tr.isVisible().catch(() => false)) {
        await tr.locator('input[type="number"]').fill(String(row.answer));
      }
    }
  }
  await checkBtn.first().click();
  await waitStepAdvance(page);
  return true;
}

function findDragStep(task: Task) {
  return task.steps.find((s) => s.type === "drag_select");
}

async function completeDragSelect(page: Page, task: Task): Promise<boolean> {
  const prompt = page.getByText("Нажми на карточки участников задачи");
  if (!(await prompt.isVisible().catch(() => false))) return false;

  const step = findDragStep(task);
  if (!step || step.type !== "drag_select") return false;

  for (const opt of step.options.filter((o) => o.correct)) {
    await clickCardByLabel(page, opt.label);
  }
  await page.getByRole("button", { name: "Проверить" }).click();
  await waitStepAdvance(page);
  return true;
}

async function completeAssumeSelect(page: Page, task: Task): Promise<boolean> {
  const assumePrompt = page.getByText(
    /Выбери (пробное )?предположение|Представим, что все \d+ (объектов|девочек|существ)/,
  );
  if (!(await assumePrompt.first().isVisible().catch(() => false))) return false;

  for (const step of task.steps) {
    if (step.type !== "single_select" || !step.id.includes("-assume")) continue;
    const correct = step.options.find((o) => o.correct);
    if (!correct) continue;
    const btn = page.getByRole("button", { name: correct.label }).first();
    if (!(await btn.isVisible().catch(() => false))) continue;
    await btn.click();
    await clickIfVisible(page, "Проверить");
    return true;
  }
  return false;
}

async function completeSingleSelect(page: Page, task: Task): Promise<boolean> {
  if (await completeAssumeSelect(page, task)) return true;

  const checkBtn = page.getByRole("button", { name: "Проверить" });
  if (!(await checkBtn.isVisible().catch(() => false))) return false;

  for (const step of task.steps) {
    if (step.type !== "single_select") continue;
    let visibleCount = 0;
    for (const opt of step.options) {
      if (await page.getByRole("button", { name: opt.label }).isVisible().catch(() => false)) {
        visibleCount++;
      }
    }
    if (visibleCount < 2) continue;
    const correct = step.options.find((o) => o.correct);
    if (!correct) continue;
    await page.getByRole("button", { name: correct.label }).click();
    await checkBtn.click();
    await waitStepAdvance(page);
    return true;
  }
  return false;
}

async function completeWordSolution(page: Page, taskId: string): Promise<boolean> {
  const root = page.getByTestId("word-solution-step");
  if (!(await root.isVisible().catch(() => false))) return false;

  const lines = solutionLines(taskId);
  const chipPanel = page.getByText("Карточки для вставки");
  if (await chipPanel.isVisible().catch(() => false)) {
    for (const line of lines) {
      for (let bi = 0; bi < line.blanks.length; bi++) {
        const value = blankAcceptValue(line, bi);
        const empty = root.locator("button.border-dashed").first();
        if (await empty.isVisible().catch(() => false)) await empty.click();
        await page.getByRole("button", { name: value, exact: true }).click();
      }
    }
    await page.getByRole("button", { name: "Проверить решение и ответ" }).click();
    await waitStepAdvance(page);
    return true;
  }

  const textInputs = root.locator('input[type="text"]');
  if ((await textInputs.count()) > 0) {
    let idx = 0;
    for (const line of lines) {
      for (let bi = 0; bi < line.blanks.length; bi++) {
        const value = blankAcceptValue(line, bi);
        if (idx < (await textInputs.count())) {
          await textInputs.nth(idx).fill(value);
          idx++;
        }
      }
    }
    const textarea = root.locator("textarea");
    if (await textarea.isVisible().catch(() => false)) {
      const current = await textarea.inputValue().catch(() => "");
      if (!current.trim()) {
        await textarea.fill(buildModeCText(taskId));
      }
    }
    await page.getByRole("button", { name: /Проверить решение/ }).click();
    await waitStepAdvance(page);
    return true;
  }

  const scaffoldBtn = page.getByRole("button", { name: "Понятно — напишу своими словами →" });
  if (await scaffoldBtn.isVisible().catch(() => false)) {
    await scaffoldBtn.click();
    await page.waitForTimeout(400);
  }

  const textarea = root.locator("textarea");
  if (await textarea.isVisible().catch(() => false)) {
    await textarea.fill(buildModeCText(taskId));
    await page.getByRole("button", { name: /Проверить решение/ }).click();
    await waitStepAdvance(page);
    return true;
  }

  return false;
}

async function completeMethodHub(page: Page, task: Task): Promise<boolean> {
  const backBtn = page.getByRole("button", { name: "← Назад к выбору" });
  if (await backBtn.isVisible().catch(() => false)) {
    if (await completeWordSolution(page, task.id)) return true;
    if (await fillWorksheetTable(page, task)) return true;
    if (await completeSingleSelect(page, task)) return true;
    if (await completeDragSelect(page, task)) return true;
    if (await clickIfVisible(page, "Понятно, считаю дальше")) return true;
    if (await clickIfVisible(page, "Понятно, записываю ответ")) return true;
    return false;
  }

  const hub = page.getByTestId("method-step-hub");
  if (!(await hub.isVisible().catch(() => false))) return false;

  const allDone = page.getByRole("button", { name: "Все шаги пройдены — дальше" });
  if (await allDone.isVisible().catch(() => false)) {
    await allDone.click();
    await waitStepAdvance(page);
    return true;
  }

  const next = hub.locator("button").filter({ has: page.locator("span", { hasText: "?" }) }).first();
  if (await next.isVisible().catch(() => false)) {
    await next.click();
    return true;
  }
  return false;
}

async function completeGenericStep(page: Page, task: Task): Promise<boolean> {
  if (page.url().includes("/result")) return false;

  if (await completeMethodHub(page, task)) return true;
  if (await completeWordSolution(page, task.id)) return true;
  if (await fillWorksheetTable(page, task)) return true;
  if (await fillTableInput(page, task)) return true;
  if (await completeDragSelect(page, task)) return true;
  if (await completeSingleSelect(page, task)) return true;

  if (await page.getByTestId("method-rule-screen").isVisible().catch(() => false)) {
    return clickIfVisible(page, "Понятно, решаю");
  }
  if (await page.getByTestId("answer-transform-step").isVisible().catch(() => false)) {
    return clickIfVisible(page, "Понятно, записываю ответ");
  }
  if (await page.getByTestId("question-check-step").isVisible().catch(() => false)) {
    return clickIfVisible(page, "Понятно, записываю ответ");
  }
  if (await page.getByText("Какой метод здесь подходит?").isVisible().catch(() => false)) {
    await page
      .getByRole("button", { name: /А\. Представить, что все существа одного вида/ })
      .click();
    return clickIfVisible(page, "Проверить");
  }
  if (await page.getByTestId("score-question-check-step").isVisible().catch(() => false)) {
    return clickIfVisible(page, "Понятно, записываю ответ");
  }
  if (await page.getByTestId("score-replacement-step").isVisible().catch(() => false)) {
    return clickIfVisible(page, "Понятно, считаю дальше");
  }
  if (await page.getByTestId("match-total-step").isVisible().catch(() => false)) {
    return clickIfVisible(page, "Понятно, решаю");
  }

  if (await clickIfVisible(page, "Понятно, дальше →")) return true;
  if (await clickIfVisible(page, "Прочитал, дальше")) return true;
  if (await clickIfVisible(page, "Завершить задачу ⭐")) return true;

  return false;
}

export async function advanceOneStep(page: Page, taskId: string): Promise<boolean> {
  const task = HEADS_LEGS_TASKS[taskId];
  if (!task) throw new Error(`Unknown task: ${taskId}`);
  return completeGenericStep(page, task);
}

export async function advanceUntilVisible(
  page: Page,
  taskId: string,
  testId?: string,
  maxSteps = 50,
  text?: string | RegExp,
) {
  for (let i = 0; i < maxSteps; i++) {
    if (testId && (await page.getByTestId(testId).isVisible().catch(() => false))) return;
    if (text && (await page.getByText(text).first().isVisible().catch(() => false))) return;
    if (page.url().includes("/result")) return;
    const ok = await advanceOneStep(page, taskId);
    if (!ok) await page.waitForTimeout(400);
  }
}

/** Пройти задачу до экрана result */
export async function playTaskToFinish(page: Page, taskId: string, maxIterations = 150) {
  const task = HEADS_LEGS_TASKS[taskId];
  if (!task) throw new Error(`Unknown task: ${taskId}`);

  let stale = 0;
  let prevProgress = "";

  for (let i = 0; i < maxIterations; i++) {
    if (page.url().includes("/result")) return;

    const progress = (await page.locator("text=/Шаг \\d+ из \\d+/").first().textContent()) ?? "";
    const onHub = await page.getByTestId("method-step-hub").isVisible().catch(() => false);
    const inHubSub = await page
      .getByRole("button", { name: "← Назад к выбору" })
      .isVisible()
      .catch(() => false);
    if (progress === prevProgress && !onHub && !inHubSub) stale += 1;
    else stale = 0;
    prevProgress = progress;
    if (stale > 15) {
      throw new Error(`Застряли на «${progress}» в задаче ${taskId}`);
    }

    const progressed = await completeGenericStep(page, task);
    if (!progressed) {
      await page.waitForTimeout(500);
      if (page.url().includes("/result")) return;
    }
  }
  throw new Error(`Превышен лимит шагов для ${taskId}`);
}

export { solutionLines, methodTaskId };
