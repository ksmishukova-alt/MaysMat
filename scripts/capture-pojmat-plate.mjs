import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const outDir = "docs/product-review/entry-diagnostic";
const outFile = `${outDir}/pojmat-condition-plate-current.png`;
const ports = [3025, 3004, 3010, 3000, 3002, 3003];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
let saved = false;

for (const port of ports) {
  const base = `http://127.0.0.1:${port}`;
  const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
  try {
    await page.goto(`${base}/diagnostic/play/pojmat`, { waitUntil: "networkidle", timeout: 25_000 });
    await page.getByTestId("pojmat-catch-arena").waitFor({ timeout: 10_000 });
    await page.waitForTimeout(800);
    await page.getByTestId("pojmat-catch-arena").screenshot({ path: outFile });
    console.log(`Saved: ${outFile} (from ${base})`);
    saved = true;
    await page.close();
    break;
  } catch {
    await page.close();
  }
}

await browser.close();

if (!saved) {
  console.error("Could not capture screenshot — no local dev server responded.");
  process.exit(1);
}
