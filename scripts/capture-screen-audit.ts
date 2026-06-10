/**
 * Скриншоты всех экранов flow для screen-audit.
 * npm run build && npx next start -p 3012
 * npx tsx scripts/capture-screen-audit.ts
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  advanceBlockToMiniGame,
  advanceToNextBlock,
  completeMiniGame,
  completeTaskSteps,
  startDiagnosticRun,
} from "../e2e/helpers/diagnostic-autopilot";

const OUT = path.join(process.cwd(), "docs", "product-review", "entry-diagnostic", "screen-audit");
const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3012";

type Vp = { tag: string; width: number; height: number };

const VIEWPORTS: Vp[] = [
  { tag: "desktop-1280x900", width: 1280, height: 900 },
  { tag: "desktop-1280x720", width: 1280, height: 720 },
  { tag: "mobile-390x844", width: 390, height: 844 },
];

async function shot(page: import("@playwright/test").Page, vp: Vp, id: string) {
  const dir = path.join(OUT, id);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${vp.tag}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log("saved", file);
}

async function init(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    localStorage.setItem("entry-diagnostic-fast", "1");
    localStorage.removeItem("entry-diagnostic-session-v2");
  });
}

async function captureAll(page: import("@playwright/test").Page, vp: Vp) {
  await page.setViewportSize({ width: vp.width, height: vp.height });

  await page.goto(`${BASE}/diagnostic/run`);
  await page.getByTestId("diagnostic-start").waitFor({ state: "visible", timeout: 30_000 });
  await shot(page, "01-intro");

  await page.getByTestId("diagnostic-start").click();
  await page.getByTestId("diagnostic-block-intro").waitFor({ state: "visible", timeout: 10_000 });
  await shot(page, vp, "02-block-intro");

  await page.getByTestId("diagnostic-block-intro-start").click();
  await page.getByTestId("diagnostic-runner").waitFor({ state: "visible", timeout: 10_000 });
  await shot(page, vp, "03-task-d1-read");

  await page.getByTestId("diagnostic-task-continue").click();
  await page.locator('[data-testid^="diagnostic-choice-"]').first().waitFor({ state: "visible" });
  await shot(page, vp, "04-task-d1-choice");

  await completeTaskSteps(page);
  await page.getByTestId("diagnostic-runner").waitFor({ state: "visible", timeout: 10_000 });
  await shot(page, vp, "05-task-d2");

  await completeTaskSteps(page);
  await completeTaskSteps(page);

  await page.getByTestId("diagnostic-pre-minigame").waitFor({ state: "visible", timeout: 10_000 });
  await shot(page, vp, "06-theme-done");

  await page.getByTestId("diagnostic-pre-minigame-continue").click();
  await page.getByTestId("diagnostic-minigame-rules").waitFor({ state: "visible", timeout: 10_000 });
  await shot(page, vp, "07-minigame-rules");

  await page.getByTestId("diagnostic-minigame-rules-start").click();
  await page.getByTestId("diagnostic-minigame").waitFor({ state: "visible", timeout: 10_000 });
  await page.waitForTimeout(500);
  await shot(page, vp, "08-pojmat");

  await completeMiniGame(page, "pojmat");
  await page.getByTestId("diagnostic-post-block").waitFor({ state: "visible", timeout: 15_000 });
  await shot(page, vp, "09-post-block");

  await advanceToNextBlock(page);
  await page.getByTestId("diagnostic-block-intro-start").click();
  for (let t = 0; t < 3; t++) {
    await page.getByTestId("diagnostic-runner").waitFor({ state: "visible", timeout: 10_000 });
    await completeTaskSteps(page);
  }
  await advanceBlockToMiniGame(page);
  await page.getByTestId("diagnostic-minigame-rules-start").click();
  await page.getByTestId("diagnostic-minigame").waitFor({ state: "visible", timeout: 10_000 });
  await page.waitForTimeout(600);
  await shot(page, vp, "10-parkomat");

  await completeMiniGame(page, "parkomat");
  await page.getByTestId("diagnostic-post-block").waitFor({ state: "visible", timeout: 15_000 });
}

async function captureReport(page: import("@playwright/test").Page, vp: Vp) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(`${BASE}/diagnostic/run`);
  await page.getByTestId("diagnostic-start").waitFor({ state: "visible", timeout: 30_000 });
  await startDiagnosticRun(page);
  for (let b = 0; b < 15; b++) {
    for (let t = 0; t < 3; t++) {
      await page.getByTestId("diagnostic-runner").waitFor({ state: "visible", timeout: 15_000 });
      await completeTaskSteps(page);
    }
    await advanceBlockToMiniGame(page);
    await page.getByTestId("diagnostic-minigame").waitFor({ state: "visible", timeout: 10_000 });
    const game = await page.getByTestId("diagnostic-minigame").getAttribute("data-game");
    await completeMiniGame(page, game ?? "pojmat");
    await page.getByTestId("diagnostic-next-block").waitFor({ state: "visible", timeout: 15_000 });
    const btn = page.getByTestId("diagnostic-next-block");
    const label = (await btn.textContent()) ?? "";
    if (label.includes("отчёт") || label.includes("отчет")) {
      await btn.click();
      break;
    }
    await advanceToNextBlock(page);
    const intro = page.getByTestId("diagnostic-block-intro-start");
    if (await intro.isVisible().catch(() => false)) await intro.click();
  }
  await page.waitForURL(/\/diagnostic\/result/, { timeout: 30_000 });
  await page.getByTestId("diagnostic-report").waitFor({ state: "visible", timeout: 15_000 });
  await shot(page, vp, "11-report");
}

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await init(page);

  for (const vp of VIEWPORTS) {
    await page.addInitScript(() => {
      localStorage.setItem("entry-diagnostic-fast", "1");
      localStorage.removeItem("entry-diagnostic-session-v2");
    });
    await captureAll(page, vp);
  }

  await page.addInitScript(() => {
    localStorage.setItem("entry-diagnostic-fast", "1");
    localStorage.removeItem("entry-diagnostic-session-v2");
  });
  await captureReport(page, VIEWPORTS[0]!);

  await ctx.close();
  await browser.close();
  console.log("Done:", OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
