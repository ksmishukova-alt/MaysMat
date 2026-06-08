import { test, expect } from "@playwright/test";
import { ENTRY_DIAGNOSTIC_BLOCKS } from "../src/data/entry-diagnostic/blocks/index";
import { getMiniGameSpec } from "../src/data/entry-diagnostic/mini-games/specs";

async function completeTaskSteps(page: import("@playwright/test").Page) {
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

async function completeMiniGame(page: import("@playwright/test").Page, miniGameId: string) {
  const spec = getMiniGameSpec(miniGameId);
  if (!spec) return;
  await page.getByTestId(`mini-target-${spec.correctTarget}`).click();
  await page.getByTestId(`mini-target-${spec.correctTarget}`).click();
  await page.waitForTimeout(500);
}

test.describe("Entry Diagnostic v2", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("entry-diagnostic-fast", "1");
      localStorage.removeItem("entry-diagnostic-session-v2");
    });
  });

  test("landing → start → block 1 task visible", async ({ page }) => {
    await page.goto("/diagnostic");
    await expect(page.getByTestId("diagnostic-enter")).toBeVisible();
    await page.getByTestId("diagnostic-enter").click();
    await page.getByTestId("diagnostic-start").click();
    await expect(page.getByTestId("diagnostic-runner")).toBeVisible();
    await expect(page.getByText(/Чтение условия/i)).toBeVisible();
  });

  test("report page loads when no session", async ({ page }) => {
    await page.goto("/diagnostic/result");
    await expect(page.getByText("Диагностика ещё не пройдена.")).toBeVisible();
  });

  test("full flow blocks 1–15 → report", async ({ page }) => {
    test.setTimeout(300_000);
    await page.goto("/diagnostic/run");
    await page.getByTestId("diagnostic-start").click();

    for (const block of ENTRY_DIAGNOSTIC_BLOCKS) {
      for (let t = 0; t < 3; t++) {
        await expect(page.getByTestId("diagnostic-runner")).toBeVisible({ timeout: 15_000 });
        await completeTaskSteps(page);
      }
      await expect(page.getByTestId("diagnostic-minigame")).toBeVisible({ timeout: 10_000 });
      await completeMiniGame(page, block.miniGameId);
      await expect(page.getByTestId("diagnostic-next-block")).toBeVisible({ timeout: 15_000 });
      await page.getByTestId("diagnostic-next-block").click();
    }

    await expect(page).toHaveURL(/\/diagnostic\/result/, { timeout: 15_000 });
    await expect(page.getByTestId("diagnostic-report")).toBeVisible();
    await expect(page.getByText(/\/ 90/)).toBeVisible();
  });

  test("mini-game play mode counting-road", async ({ page }) => {
    await page.goto("/diagnostic/play/counting-road");
    await expect(page.getByTestId("diagnostic-minigame")).toHaveAttribute("data-mode", "play");
    const spec = getMiniGameSpec("counting-road")!;
    await page.getByTestId(`mini-target-${spec.correctTarget}`).click();
    await expect(page.getByTestId("diagnostic-minigame")).toBeVisible();
  });

  test("all 16 mini-games load in play mode", async ({ page }) => {
    const ids = [
      "pojmat", "parkomat", "razryad", "warehouse", "bubbles", "station", "parade",
      "mouse-route", "time-path", "fence-tile", "cheese-share", "percentomat",
      "advocate", "code-chest", "catch-repeat", "counting-road",
    ];
    for (const id of ids) {
      await page.goto(`/diagnostic/play/${id}`);
      await expect(page.getByTestId("diagnostic-minigame")).toHaveAttribute("data-game", id);
    }
  });

  test("a11y: diagnostic runner has labeled inputs", async ({ page }) => {
    await page.goto("/diagnostic/run");
    await page.getByTestId("diagnostic-start").click();
    await expect(page.getByTestId("diagnostic-runner")).toBeVisible();
    for (let i = 0; i < 4; i++) {
      const input = page.locator("input[aria-label]");
      if (await input.first().isVisible().catch(() => false)) {
        await expect(input.first()).toBeVisible();
        return;
      }
      await page.getByTestId("diagnostic-task-continue").click();
    }
    await expect(page.getByRole("region", { name: /параметра|модель|столбик/i }).or(
      page.locator("[aria-label]").first(),
    )).toBeVisible();
  });
});
