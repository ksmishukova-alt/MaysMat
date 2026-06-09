import { test, expect, devices } from "@playwright/test";
import { ENTRY_DIAGNOSTIC_BLOCKS } from "../src/data/entry-diagnostic/blocks/index";
import { completeMiniGame, completeTaskSteps, advanceBlockToMiniGame, startDiagnosticRun, advanceToNextBlock } from "./helpers/diagnostic-autopilot";

const VIEWPORTS = [
  { name: "desktop", ...devices["Desktop Chrome"] },
  { name: "tablet", ...devices["iPad (gen 7)"] },
  { name: "mobile", ...devices["Pixel 5"] },
];

test.describe("Entry Diagnostic responsive", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("entry-diagnostic-fast", "1");
      localStorage.removeItem("entry-diagnostic-session-v2");
    });
  });

  for (const vp of VIEWPORTS) {
    test(`${vp.name}: landing + start visible`, async ({ browser }) => {
      const context = await browser.newContext({ ...vp });
      const page = await context.newPage();
      await page.goto("/diagnostic");
      await expect(page.getByTestId("diagnostic-enter")).toBeVisible();
      await context.close();
    });
  }

  test("mobile: full flow performance budget", async ({ browser }) => {
    test.setTimeout(360_000);
    const context = await browser.newContext({ ...devices["Pixel 5"] });
    const page = await context.newPage();
    await page.addInitScript(() => {
      localStorage.setItem("entry-diagnostic-fast", "1");
      localStorage.removeItem("entry-diagnostic-session-v2");
    });
    const t0 = Date.now();
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
    expect(Date.now() - t0).toBeLessThan(240_000);
    await context.close();
  });

  test("tablet: mini-game diagnostic + play", async ({ browser }) => {
    const context = await browser.newContext({ ...devices["iPad (gen 7)"] });
    const page = await context.newPage();
    await page.addInitScript(() => {
      localStorage.setItem("entry-diagnostic-fast", "1");
      localStorage.removeItem("entry-diagnostic-session-v2");
    });
    await page.goto("/diagnostic/play/pojmat");
    await expect(page.getByTestId("diagnostic-minigame")).toHaveAttribute("data-mode", "play");
    await page.goto("/diagnostic/run");
    await startDiagnosticRun(page);
    await completeTaskSteps(page);
    await context.close();
  });
});
