/**
 * Скриншоты для продуктовой проверки Entry Diagnostic v2.
 * Запуск: npm run dev (в другом терминале), затем:
 *   npx tsx scripts/capture-entry-diagnostic-screenshots.ts
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { ENTRY_DIAGNOSTIC_BLOCKS } from "../src/data/entry-diagnostic/blocks/index";
import { completeMiniGame, completeTaskSteps, advanceBlockToMiniGame } from "../e2e/helpers/diagnostic-autopilot";

const OUT = path.join(process.cwd(), "docs", "product-review", "entry-diagnostic");
const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

async function shot(page: import("@playwright/test").Page, name: string) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log("saved", file);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.addInitScript(() => {
    localStorage.setItem("entry-diagnostic-fast", "1");
    localStorage.removeItem("entry-diagnostic-session-v2");
  });
  const page = await context.newPage();

  await page.goto(`${BASE}/diagnostic`);
  await page.waitForLoadState("networkidle");
  await shot(page, "01-landing");

  await page.getByTestId("diagnostic-enter").click();
  await page.getByTestId("diagnostic-start").click();
  await page.waitForSelector('[data-testid="diagnostic-runner"]');
  await shot(page, "02-block1-task-d1");

  // Блок 3 — столбик
  for (let b = 0; b < 2; b++) {
    for (let t = 0; t < 3; t++) {
      await completeTaskSteps(page);
    }
    await advanceBlockToMiniGame(page);
    await completeMiniGame(page, ENTRY_DIAGNOSTIC_BLOCKS[b].miniGameId);
    await page.getByTestId("diagnostic-next-block").click();
  }
  await page.waitForSelector('[data-testid="diagnostic-runner"]');
  await shot(page, "03-column-add-sub-runner");

  // До блока 5 — деление
  for (let b = 2; b < 4; b++) {
    for (let t = 0; t < 3; t++) {
      await completeTaskSteps(page);
    }
    await advanceBlockToMiniGame(page);
    await completeMiniGame(page, ENTRY_DIAGNOSTIC_BLOCKS[b].miniGameId);
    await page.getByTestId("diagnostic-next-block").click();
  }
  await page.waitForSelector('[data-testid="diagnostic-runner"]');
  await shot(page, "04-long-division-runner");
  await context.close();

  const page2 = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  await page2.goto(`${BASE}/diagnostic/play/pojmat`);
  await page2.waitForLoadState("networkidle");
  await shot(page2, "05-minigame-pojmat");

  await page2.goto(`${BASE}/diagnostic/play/counting-road`);
  await page2.waitForLoadState("networkidle");
  await shot(page2, "06-minigame-counting-road");
  await page2.context().close();

  const ctx3 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx3.addInitScript(() => {
    localStorage.setItem("entry-diagnostic-fast", "1");
    localStorage.removeItem("entry-diagnostic-session-v2");
  });
  const page3 = await ctx3.newPage();
  await page3.goto(`${BASE}/diagnostic/run`);
  await page3.getByTestId("diagnostic-start").click();

  for (const block of ENTRY_DIAGNOSTIC_BLOCKS) {
    for (let t = 0; t < 3; t++) {
      await completeTaskSteps(page3);
    }
    await advanceBlockToMiniGame(page3);
    await completeMiniGame(page3, block.miniGameId);
    if (block.blockIndex === 1) {
      await page3.waitForSelector('[data-testid="diagnostic-next-block"]');
      await shot(page3, "07-block-transition");
    }
    await page3.getByTestId("diagnostic-next-block").click();
  }
  await page3.waitForSelector('[data-testid="diagnostic-report"]');
  await shot(page3, "08-final-report");

  // Мобильный landing
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const mp = await mobile.newPage();
  await mp.goto(`${BASE}/diagnostic`);
  await mp.waitForLoadState("networkidle");
  await shot(mp, "09-mobile-landing");
  await mobile.close();

  await ctx3.close();
  await browser.close();
  console.log("Done. Screenshots in", OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
