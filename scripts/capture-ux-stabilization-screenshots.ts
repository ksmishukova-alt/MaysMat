/**
 * Скриншоты visual-fix (desktop 1280×900 + mobile 390×844).
 * npm run build && npx next start -p 3012
 * npx tsx scripts/capture-ux-stabilization-screenshots.ts
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  advanceBlockToMiniGame,
  completeMiniGame,
  completeTaskSteps,
  startDiagnosticRun,
} from "../e2e/helpers/diagnostic-autopilot";

const OUT = path.join(process.cwd(), "docs", "product-review", "entry-diagnostic", "ux-stabilization");
const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3012";
const SUFFIX = process.env.SCREENSHOT_SUFFIX ?? "-fixed";

async function shot(page: import("@playwright/test").Page, name: string, fullPage = false) {
  fs.mkdirSync(OUT, { recursive: true });
  const file = path.join(OUT, `${name}${SUFFIX}.png`);
  await page.screenshot({ path: file, fullPage });
  console.log("saved", file);
}

async function captureDesktop(page: import("@playwright/test").Page) {
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto(`${BASE}/diagnostic/run`);
  await page.getByTestId("diagnostic-start").waitFor({ state: "visible", timeout: 30_000 });
  await shot(page, "01-intro-desktop");

  await startDiagnosticRun(page);
  await page.getByTestId("diagnostic-task-continue").click();
  await page.locator('[data-testid^="diagnostic-choice-"]').first().waitFor({ state: "visible" });
  await shot(page, "02-block1-task-desktop");

  for (let t = 0; t < 3; t++) {
    await completeTaskSteps(page);
  }
  await advanceBlockToMiniGame(page);
  await page.getByTestId("diagnostic-minigame").waitFor({ state: "visible", timeout: 15_000 });
  await page.waitForTimeout(600);
  await shot(page, "03-pojmat-desktop");

  await completeMiniGame(page, "pojmat");
  await page.getByTestId("diagnostic-next-block").click();
  const blockIntro = page.getByTestId("diagnostic-block-intro-start");
  if (await blockIntro.isVisible().catch(() => false)) {
    await blockIntro.click();
  }

  await page.getByTestId("diagnostic-task-continue").click();
  await page.locator('[data-testid^="diagnostic-choice-"]').first().waitFor({ state: "visible" });
  await shot(page, "04-block2-task-desktop");

  for (let t = 0; t < 3; t++) {
    await completeTaskSteps(page);
  }
  await advanceBlockToMiniGame(page);
  await page.getByTestId("diagnostic-minigame").waitFor({ state: "visible", timeout: 15_000 });
  await page.waitForTimeout(800);
  await shot(page, "05-parkomat-desktop");
}

async function captureMobile(page: import("@playwright/test").Page) {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto(`${BASE}/diagnostic/run`);
  await page.getByTestId("diagnostic-start").waitFor({ state: "visible", timeout: 30_000 });
  await shot(page, "01-intro-mobile");

  await startDiagnosticRun(page);
  for (let t = 0; t < 3; t++) {
    await completeTaskSteps(page);
  }
  await advanceBlockToMiniGame(page);
  await page.getByTestId("diagnostic-minigame").waitFor({ state: "visible", timeout: 15_000 });
  await page.waitForTimeout(600);
  await shot(page, "03-pojmat-mobile");

  await completeMiniGame(page, "pojmat");
  await page.getByTestId("diagnostic-next-block").click();
  const blockIntro = page.getByTestId("diagnostic-block-intro-start");
  if (await blockIntro.isVisible().catch(() => false)) {
    await blockIntro.click();
  }

  for (let t = 0; t < 3; t++) {
    await completeTaskSteps(page);
  }
  await advanceBlockToMiniGame(page);
  await page.getByTestId("diagnostic-minigame").waitFor({ state: "visible", timeout: 15_000 });
  await page.waitForTimeout(800);
  await shot(page, "05-parkomat-mobile");
}

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => {
    localStorage.setItem("entry-diagnostic-fast", "1");
    localStorage.removeItem("entry-diagnostic-session-v2");
  });
  const page = await ctx.newPage();

  await captureDesktop(page);
  await captureMobile(page);

  await ctx.close();
  await browser.close();
  console.log("Done:", OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
