import type { Page } from "@playwright/test";
import { POJMAT_ROUNDS } from "../../src/data/entry-diagnostic/mini-games/pojmat-rounds";
import { getMiniGameSpec } from "../../src/data/entry-diagnostic/mini-games/specs";

export async function completeTaskSteps(page: Page) {
  const runner = page.getByTestId("diagnostic-runner");
  const answerRaw = await runner.getAttribute("data-test-answer");
  const answer = answerRaw ? (JSON.parse(answerRaw) as Record<string, unknown>) : {};

  for (let guard = 0; guard < 12; guard++) {
    if (!(await runner.isVisible().catch(() => false))) break;

    if (answer.focus != null) {
      const choice = page.getByTestId(`diagnostic-choice-${answer.focus}`);
      if (await choice.isVisible().catch(() => false)) {
        await choice.click();
      }
    }

    const numInput = page.locator('input[type="number"]');
    if (await numInput.isVisible().catch(() => false)) {
      const val = answer.value ?? answer.actionCount;
      if (val != null) await numInput.fill(String(val));
    }

    const textInput = page.locator('input[type="text"]');
    if (await textInput.isVisible().catch(() => false)) {
      const key = Object.keys(answer).find((k) => typeof answer[k] === "string" && k !== "focus");
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
    if (!(await btn.isVisible().catch(() => false))) break;
    const label = (await btn.textContent()) ?? "";
    const disabled = await btn.isDisabled().catch(() => false);
    if (disabled) break;
    await btn.click();
    if (label.includes("Готово") || label.includes("Отправить")) break;
    await page.waitForTimeout(120);
  }
}

/** ПойМАТ: выбрать дорожку и дождаться автоловли в корзинку */
async function movePojmatToLane(page: Page, targetLane: number) {
  for (let guard = 0; guard < 8; guard++) {
    const mouse = page.getByTestId("pojmat-mouse");
    const lane = Number((await mouse.getAttribute("data-lane")) ?? "1");
    if (lane === targetLane) return;
    if (lane < targetLane) {
      await page.getByTestId("pojmat-lane-right").click();
    } else {
      await page.getByTestId("pojmat-lane-left").click();
    }
    await page.waitForTimeout(60);
  }
}

async function catchPojmatRound(page: Page, correctId: string) {
  await page.getByTestId("pojmat-catch-arena").waitFor({ state: "visible", timeout: 10_000 });
  const arena = page.getByTestId("pojmat-catch-arena");
  const correctLane = Number((await arena.getAttribute("data-correct-lane")) ?? "1");
  await movePojmatToLane(page, correctLane);

  await page
    .locator(`[data-testid="pojmat-catch-arena"] [data-testid="mini-target-${correctId}"]`)
    .waitFor({ state: "detached", timeout: 20_000 });
  await page.waitForTimeout(550);
}

export async function completeMiniGame(page: Page, miniGameId: string) {
  if (miniGameId === "pojmat") {
    for (let r = 0; r < 2; r++) {
      const round = POJMAT_ROUNDS[r];
      if (!round) break;
      await catchPojmatRound(page, round.correctId);
      await page.waitForTimeout(400);
    }
    return;
  }

  const spec = getMiniGameSpec(miniGameId);
  if (!spec) return;
  const target = page.getByTestId(`mini-target-${spec.correctTarget}`);
  await target.scrollIntoViewIfNeeded();
  await target.click({ force: true });
  await page.waitForTimeout(200);
  await target.click({ force: true });
  await page.waitForTimeout(600);
}
