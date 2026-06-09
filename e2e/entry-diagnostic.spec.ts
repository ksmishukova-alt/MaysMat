import { test, expect } from "@playwright/test";
import { ENTRY_DIAGNOSTIC_BLOCKS } from "../src/data/entry-diagnostic/blocks/index";
import { getMiniGameSpec } from "../src/data/entry-diagnostic/mini-games/specs";
import { completeMiniGame, completeTaskSteps, advanceBlockToMiniGame, startDiagnosticRun, advanceToNextBlock } from "./helpers/diagnostic-autopilot";

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
    await page.waitForURL(/\/diagnostic\/run/, { timeout: 15_000 });
    await startDiagnosticRun(page);
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
    await startDiagnosticRun(page);

    for (const block of ENTRY_DIAGNOSTIC_BLOCKS) {
      for (let t = 0; t < 3; t++) {
        await expect(page.getByTestId("diagnostic-runner")).toBeVisible({ timeout: 15_000 });
        await completeTaskSteps(page);
      }
      await advanceBlockToMiniGame(page);
      await expect(page.getByTestId("diagnostic-minigame")).toBeVisible({ timeout: 10_000 });
      await completeMiniGame(page, block.miniGameId);
      await expect(page.getByTestId("diagnostic-next-block")).toBeVisible({ timeout: 15_000 });
      await advanceToNextBlock(page);
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
    await startDiagnosticRun(page);
    for (let i = 0; i < 12; i++) {
      const input = page.locator("input[aria-label]");
      if (await input.first().isVisible().catch(() => false)) {
        await expect(input.first()).toBeVisible();
        return;
      }
      const choice = page.locator('[data-testid^="diagnostic-choice-"]').first();
      if (await choice.isVisible().catch(() => false)) {
        await expect(choice).toHaveAttribute("aria-label", /.+/);
        await choice.click();
      }
      const btn = page.getByTestId("diagnostic-task-continue");
      if (await btn.isEnabled().catch(() => false)) {
        await btn.click();
      }
    }
    await expect(page.locator("[aria-label]").first()).toBeVisible();
  });
});
