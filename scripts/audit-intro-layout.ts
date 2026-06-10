/** Intro-only audit: screenshots + layout metrics */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "docs", "product-review", "entry-diagnostic", "screen-audit", "01-intro");
const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3012";

const VIEWS = [
  { tag: "desktop-1280x900", width: 1280, height: 900 },
  { tag: "desktop-1280x720", width: 1280, height: 720 },
  { tag: "mobile-390x844", width: 390, height: 844 },
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
      const layout = document.querySelector(".diagnostic-focus-layout");
      const content = document.querySelector(".diagnostic-focus-layout__content");
      const intro = document.querySelector(".diagnostic-intro");
      const btn = document.querySelector("[data-testid='diagnostic-start']");
      const back = document.querySelector(".diagnostic-back-button");
      const bg = document.querySelector(".diagnostic-focus-layout__bg img");
      const btnRect = btn?.getBoundingClientRect();
      return {
        hasBack: !!back && back instanceof HTMLElement && back.offsetParent !== null,
        scrollContent: content?.scrollHeight ?? 0,
        clientContent: content?.clientHeight ?? 0,
        scrollWindow: document.documentElement.scrollHeight,
        innerHeight: window.innerHeight,
        contentOverflow: content ? content.scrollHeight > content.clientHeight + 1 : false,
        introHeight: intro?.getBoundingClientRect().height ?? 0,
        buttonBottom: btnRect?.bottom ?? 0,
        buttonVisible: btnRect ? btnRect.bottom <= window.innerHeight && btnRect.top >= 0 : false,
        bgCoversViewport:
          bg instanceof HTMLElement
            ? bg.getBoundingClientRect().width >= window.innerWidth - 1 &&
              bg.getBoundingClientRect().height >= window.innerHeight - 1
            : false,
        layoutPhase: layout?.getAttribute("data-phase") ?? null,
      };
    });

    await page.screenshot({ path: path.join(OUT, `${vp.tag}.png`) });
    console.log(vp.tag, JSON.stringify(metrics, null, 2));
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
