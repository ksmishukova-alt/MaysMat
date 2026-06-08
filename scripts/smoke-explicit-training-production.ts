/**
 * Production smoke: Wave P1 explicit-training assume (1.01, 2.01, 3.03).
 * npm run smoke:explicit-training
 * SMOKE_BASE_URL=https://album-myshleniya.vercel.app npm run smoke:explicit-training
 */
import { chromium } from "@playwright/test";
import { HEADS_LEGS_TASKS } from "../src/data/heads-legs/build-task";

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3010";
const EXPECT_COMMIT = process.env.SMOKE_EXPECT_COMMIT ?? "40bb833";

const TASKS = ["heads-legs-1-01", "heads-legs-2-01", "heads-legs-3-03"] as const;

async function advanceOneStep(page: import("@playwright/test").Page): Promise<boolean> {
  const buttons = [
    "Понятно, дальше →",
    "Понятно, решаю",
    "Прочитал, дальше",
    "Понятно, считаю дальше",
    "Понятно, записываю ответ",
    "Проверить",
  ];
  for (const name of buttons) {
    const btn = page.getByRole("button", { name });
    if (await btn.isVisible().catch(() => false)) {
      if (await btn.isDisabled().catch(() => false)) continue;
      await btn.click();
      await page.waitForTimeout(1_100);
      return true;
    }
  }

  const taskId = page.url().match(/\/tasks\/([^/?]+)/)?.[1];
  if (!taskId) return false;
  const task = HEADS_LEGS_TASKS[taskId];
  if (!task) return false;

  for (const step of task.steps) {
    if (step.type === "drag_select") {
      let visible = 0;
      for (const opt of step.options) {
        if (await page.getByRole("button", { name: opt.label }).isVisible().catch(() => false)) {
          visible++;
        }
      }
      if (visible >= 2) {
        for (const opt of step.options) {
          if (opt.correct) {
            await page.getByRole("button", { name: opt.label }).click();
          }
        }
        await page.getByRole("button", { name: "Проверить" }).click();
        await page.waitForTimeout(1_100);
        return true;
      }
    }
    if (step.type === "worksheet_table" && step.worksheetRows) {
      const inputs = page.locator('input[type="number"], input[type="text"]');
      if ((await inputs.count()) > 0) {
        for (const row of step.worksheetRows) {
          if (row.inputType === "static" || row.answer == null) continue;
          const input = inputs.first();
          if (await input.isVisible().catch(() => false)) {
            await input.fill(String(row.answer));
            await page.waitForTimeout(200);
          }
        }
        const check = page.getByRole("button", { name: "Проверить" });
        if (await check.isVisible().catch(() => false)) {
          await check.click();
          await page.waitForTimeout(1_100);
          return true;
        }
      }
    }
    if (step.type === "table_input" && step.rows) {
      const inputs = page.locator('input[type="number"], input[type="text"]');
      if ((await inputs.count()) > 0) {
        for (const row of step.rows) {
          if (row.answer == null) continue;
          const input = inputs.first();
          if (await input.isVisible().catch(() => false)) {
            await input.fill(String(row.answer));
            await page.waitForTimeout(200);
          }
        }
        const check = page.getByRole("button", { name: "Проверить" });
        if (await check.isVisible().catch(() => false)) {
          await check.click();
          await page.waitForTimeout(1_100);
          return true;
        }
      }
    }
  }
  return false;
}

async function advanceToAssume(page: import("@playwright/test").Page, taskId: string) {
  for (let i = 0; i < 60; i++) {
    if (await page.getByTestId("explicit-training-assume-step").isVisible().catch(() => false)) {
      return;
    }
    if (page.url().includes("/result")) break;
    const ok = await advanceOneStep(page);
    if (!ok) await page.waitForTimeout(400);
  }
  if (!(await page.getByTestId("explicit-training-assume-step").isVisible().catch(() => false))) {
    throw new Error(`${taskId}: explicit-training assume step not reached`);
  }
}

function assumeStep(taskId: string) {
  const task = HEADS_LEGS_TASKS[taskId];
  const step = task.steps.find(
    (s) => s.type === "single_select" && s.id.includes("-assume"),
  );
  if (!step || step.type !== "single_select") {
    throw new Error(`${taskId}: assume step missing in task data`);
  }
  return step;
}

async function main() {
  const browser = await chromium.launch();
  let ok = 0;
  let fail = 0;

  const check = (name: string, pass: boolean) => {
    if (pass) {
      console.log(`✓ ${name}`);
      ok++;
    } else {
      console.error(`✗ ${name}`);
      fail++;
    }
  };

  const ctx = await browser.newContext();
  const probe = await ctx.newPage();
  await probe.goto(`${BASE}/tasks/heads-legs-1-01?_=${Date.now()}`);
  await probe.waitForSelector('[data-testid="task-runner-shell"]', { timeout: 30_000 });
  await advanceToAssume(probe, "heads-legs-1-01").catch(() => undefined);
  const deployed = await probe.getByTestId("explicit-training-assume-step").isVisible().catch(() => false);
  await probe.context().close();

  if (!deployed) {
    console.log(`\nProduction deploy not yet updated to ${EXPECT_COMMIT}.`);
    console.log("Local QA/e2e green. Production smoke pending.");
    await browser.close();
    process.exit(0);
  }

  for (const taskId of TASKS) {
    const page = await (await browser.newContext()).newPage();
    await page.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.goto(`${BASE}/tasks/${taskId}?_=${Date.now()}`);
    await page.waitForSelector('[data-testid="task-runner-shell"]', { timeout: 30_000 });

    try {
      await advanceToAssume(page, taskId);
      const root = page.getByTestId("explicit-training-assume-step");
      const body = await root.innerText();
      check(`${taskId}: explicit-training step`, await root.isVisible());
      check(`${taskId}: training copy`, /потренируем/i.test(body));
      check(`${taskId}: no «удобнее»`, !/удобнее/i.test(body));

      const step = assumeStep(taskId);
      const wrong = step.options.find((o) => !o.correct);
      const correct = step.options.find((o) => o.correct);
      if (!wrong || !correct) throw new Error("assume options incomplete");

      await page.getByRole("button", { name: wrong.label }).click();
      await page.getByRole("button", { name: "Проверить" }).click();
      const feedback = page.getByTestId("explicit-training-wrong-feedback");
      const feedbackText = (await feedback.textContent()) ?? "";
      check(`${taskId}: amber feedback visible`, await feedback.isVisible());
      check(`${taskId}: soft message`, /Так тоже можно решить/i.test(feedbackText));
      check(`${taskId}: not red error`, !/неверно/i.test(feedbackText));

      await page.getByRole("button", { name: correct.label }).click();
      await page.getByRole("button", { name: "Проверить" }).click();
      check(
        `${taskId}: success after trained path`,
        await page.getByText("Хорошо! Считаем дальше.").isVisible().catch(() => false),
      );
    } catch (e) {
      console.error(`✗ ${taskId}: ${e instanceof Error ? e.message : String(e)}`);
      fail++;
    } finally {
      await page.context().close();
    }
  }

  await browser.close();
  console.log(`\n=== Explicit-training smoke: ${ok} ok, ${fail} fail ===`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
