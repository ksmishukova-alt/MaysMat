/** Intro-only screenshots. PLAYWRIGHT_BASE_URL=http://127.0.0.1:3012 npx tsx scripts/capture-intro-audit.ts */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "docs/product-review/entry-diagnostic/screen-audit/01-intro");
const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3012";

const VIEWS = [
  { name: "desktop-1280x900", width: 1280, height: 900 },
  { name: "desktop-1280x720", width: 1280, height: 720 },
  { name: "mobile-390x844", width: 390, height: 844 },
] as const;

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => {
    localStorage.setItem("entry-diagnostic-fast", "1");
    localStorage.removeItem("entry-diagnostic-session-v2");
  });
  const page = await ctx.newPage();

  for (const vp of VIEWS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(`${BASE}/diagnostic/run`);
    await page.getByTestId("diagnostic-start").waitFor({ state: "visible", timeout: 30_000 });

    const metrics = await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="diagnostic-start"]');
      const card = document.querySelector(".diagnostic-intro__card");
      const intro = document.querySelector(".diagnostic-intro");
      if (!btn || !intro) return null;
      const br = btn.getBoundingClientRect();
      const ir = intro.getBoundingClientRect();
      const vw = window.innerWidth;
      const introCenter = ir.left + ir.width / 2;
      return {
        btnBottom: br.bottom,
        viewportH: window.innerHeight,
        viewportW: vw,
        introCenter,
        viewportCenter: vw / 2,
        centerOffsetPx: Math.round(introCenter - vw / 2),
        btnVisible: br.bottom <= window.innerHeight && br.top >= 0,
      };
    });
    console.log(vp.name, metrics);

    await page.screenshot({ path: path.join(OUT, `${vp.name}.png`) });
    console.log("saved", vp.name);
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
