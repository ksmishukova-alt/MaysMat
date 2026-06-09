/** Быстрые скриншоты блока 1 для UX-review */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "docs", "product-review", "entry-diagnostic", "block1-ux");
const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3012";

async function shot(page: import("@playwright/test").Page, name: string) {
  fs.mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
  console.log("saved", name);
}

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript(() => {
    localStorage.setItem("entry-diagnostic-fast", "1");
    localStorage.removeItem("entry-diagnostic-session-v2");
  });
  const page = await ctx.newPage();

  await page.goto(`${BASE}/diagnostic/run`);
  await page.getByTestId("diagnostic-start").click();
  await shot(page, "01-read-condition");

  await page.getByTestId("diagnostic-task-continue").click();
  await shot(page, "02-choose-question");

  await page.getByTestId("diagnostic-choice-together").click();
  await shot(page, "03-choice-selected");
  await page.getByTestId("diagnostic-task-continue").click();

  await page.waitForSelector('[data-testid="diagnostic-minigame"]');
  await shot(page, "04-pojmat");

  await page.goto(`${BASE}/diagnostic/play/pojmat`);
  await page.waitForLoadState("networkidle");
  await shot(page, "05-pojmat-play");

  await browser.close();
}

main().catch(console.error);
