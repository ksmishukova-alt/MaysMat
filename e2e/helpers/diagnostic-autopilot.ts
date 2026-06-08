import type { Page } from "@playwright/test";
import { getMiniGameSpec } from "../../src/data/entry-diagnostic/mini-games/specs";

export async function completeTaskSteps(page: Page) {
  const runner = page.getByTestId("diagnostic-runner");
  const answerRaw = await runner.getAttribute("data-test-answer");
  const answer = answerRaw ? (JSON.parse(answerRaw) as Record<string, unknown>) : {};

  for (let guard = 0; guard < 12; guard++) {
    if (!(await runner.isVisible().catch(() => false))) break;

    const numInput = page.locator('input[type="number"]');
    if (await numInput.isVisible().catch(() => false)) {
      const val = answer.value ?? answer.actionCount;
      if (val != null) await numInput.fill(String(val));
    }

    const textInput = page.locator('input[type="text"]');
    if (await textInput.isVisible().catch(() => false)) {
      const key = Object.keys(answer).find((k) => typeof answer[k] === "string");
      if (key) await textInput.fill(String(answer[key]));
    }

    if (answer.actionCount != null) {
      const hypothesis = page.getByRole("button", {
        name: `${answer.actionCount} действий`,
      });
      if (await hypothesis.isVisible().catch(() => false)) {
        await hypothesis.click();
      }
    }

    const addPlan = page.getByRole("button", { name: "+ Добавить действие" });
    if (answer.actionCount != null && (await addPlan.isVisible().catch(() => false))) {
      const count = Number(answer.actionCount);
      for (let i = 0; i < count; i++) {
        await addPlan.click();
      }
    }

    const btn = page.getByTestId("diagnostic-task-continue");
    const label = (await btn.textContent()) ?? "";
    await btn.click();
    if (label.includes("Отправить")) break;
    await page.waitForTimeout(120);
  }
}

export async function completeMiniGame(page: Page, miniGameId: string) {
  const spec = getMiniGameSpec(miniGameId);
  if (!spec) return;
  const target = page.getByTestId(`mini-target-${spec.correctTarget}`);
  await target.scrollIntoViewIfNeeded();
  await target.click({ force: true });
  await page.waitForTimeout(200);
  await target.click({ force: true });
  await page.waitForTimeout(600);
}
