/**
 * Smoke: dual-path word solution lines для 5.2 и 5.6 (+ 5.3 regression).
 * npm run smoke:dual-path
 * SMOKE_BASE_URL=https://album-myshleniya.vercel.app npm run smoke:dual-path  — production
 */
import { chromium } from "@playwright/test";

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3002";

async function completeDerivePrelude52(page: import("@playwright/test").Page) {
  await page.goto(`${BASE}/tasks/heads-legs-5-02?mode=methodist&_=${Date.now()}`);
  await page.waitForSelector('[data-testid="task-runner-shell"]');
  await page.getByRole("button", { name: "Прочитал, дальше" }).click();
  await page.waitForTimeout(1_100);
  await page.getByRole("button", { name: /перевести пары ног/i }).click();
  await page.getByRole("button", { name: "Проверить" }).click();
  await page.waitForTimeout(400);
  await page.getByTestId("derive-count-input").fill("108");
  await page.getByRole("button", { name: "Проверить" }).click();
  await page.waitForTimeout(400);
  await page.getByTestId("derive-feature-f1").fill("4");
  await page.getByTestId("derive-feature-f2").fill("2");
  await page.getByRole("button", { name: "Проверить" }).click();
  await page.waitForTimeout(400);
  await page.getByTestId("derive-totals-objects").fill("44");
  await page.getByRole("button", { name: "Проверить" }).click();
  await page.waitForTimeout(1_100);
  await page.getByRole("button", { name: /Понятно, дальше/i }).click();
  await page.waitForTimeout(1_100);
}

async function completeDerivePrelude56(page: import("@playwright/test").Page) {
  await page.goto(`${BASE}/tasks/heads-legs-5-06?mode=methodist&_=${Date.now()}`);
  await page.waitForSelector('[data-testid="task-runner-shell"]');
  await page.getByRole("button", { name: "Прочитал, дальше" }).click();
  await page.waitForTimeout(1_100);
  await page.getByRole("button", { name: /сколько всего мечей/i }).click();
  await page.getByRole("button", { name: "Проверить" }).click();
  await page.waitForTimeout(400);
  await page.getByTestId("derive-count-input").fill("17");
  await page.getByRole("button", { name: "Проверить" }).click();
  await page.waitForTimeout(400);
  await page.getByTestId("derive-feature-f1").fill("1");
  await page.getByTestId("derive-feature-f2").fill("2");
  await page.getByRole("button", { name: "Проверить" }).click();
  await page.waitForTimeout(400);
  await page.getByTestId("derive-totals-feature").fill("32");
  await page.getByRole("button", { name: "Проверить" }).click();
  await page.waitForTimeout(1_100);
  await page.getByRole("button", { name: /Понятно, дальше/i }).click();
  await page.waitForTimeout(1_100);
}

async function main() {
  const browser = await chromium.launch();
  let ok = 0;
  let fail = 0;

  const check = (name: string, pass: boolean) => {
    if (pass) {
      console.log(`✓ ${name}`);
      ok++;
    } else {
      console.error(`✗ ${name}`);
      fail++;
    }
  };

  const freshPage = async () => {
    const ctx = await browser.newContext();
    return ctx.newPage();
  };

  {
    const page = await freshPage();
    await completeDerivePrelude52(page);
    await page.getByTestId("assume-path-1").click();
    await page.getByRole("button", { name: "Проверить" }).click();
    await page.waitForTimeout(1_100);
    await page.getByRole("button", { name: "Понятно, записываю ответ" }).click();
    await page.waitForTimeout(1_100);
    const jawaText = await page.getByTestId("word-solution-step").innerText();
    check("5.2 путь Джав: «Не хватает ног»", /Не хватает ног/i.test(jawaText));
    check("5.2 путь Джав: «Джавам»", /Джавам/i.test(jawaText));
    check("5.2 путь Джав: нет «176 - 108»", !/176 - 108/i.test(jawaText));
    await page.context().close();
  }

  {
    const page = await freshPage();
    await completeDerivePrelude52(page);
    await page.getByTestId("assume-path-0").click();
    await page.getByRole("button", { name: "Проверить" }).click();
    await page.waitForTimeout(1_100);
    await page.getByRole("button", { name: "Понятно, записываю ответ" }).click();
    await page.waitForTimeout(1_100);
    const bantuText = await page.getByTestId("word-solution-step").innerText();
    check("5.2 путь Бант: «Лишних ног»", /Лишних ног/i.test(bantuText));
    check("5.2 путь Бант: «Бантам»", /Бантам/i.test(bantuText));
    check("5.2 путь Бант: нет «108 - 88»", !/108 - 88/i.test(bantuText));
    await page.context().close();
  }

  {
    const page = await freshPage();
    await completeDerivePrelude56(page);
    await page.getByTestId("assume-path-0").click();
    await page.getByRole("button", { name: "Проверить" }).click();
    await page.waitForTimeout(1_100);
    await page.getByRole("button", { name: "Понятно, записываю ответ" }).click();
    await page.waitForTimeout(1_100);
    const jediText = await page.getByTestId("word-solution-step").innerText();
    check("5.6 путь Джедаи: «Не хватает кристаллов»", /Не хватает кристаллов/i.test(jediText));
    await page.context().close();
  }

  {
    const page = await freshPage();
    await completeDerivePrelude56(page);
    await page.getByTestId("assume-path-1").click();
    await page.getByRole("button", { name: "Проверить" }).click();
    await page.waitForTimeout(1_100);
    await page.getByRole("button", { name: "Понятно, записываю ответ" }).click();
    await page.waitForTimeout(1_100);
    const sithText = await page.getByTestId("word-solution-step").innerText();
    check("5.6 путь Ситхи: «Лишних кристаллов»", /Лишних кристаллов/i.test(sithText));
    await page.context().close();
  }

  {
    const page = await freshPage();
    await page.goto(`${BASE}/tasks/heads-legs-5-03`);
    check("5.3 доступна без methodist", !(await page.getByText("Задача недоступна").isVisible()));
    check("5.3 runner", await page.getByTestId("task-runner-shell").isVisible());
    check("5.3 transfer (4 шага)", /Шаг 1 из 4/i.test(await page.innerText("body")));
    check("5.3 без derive", !(await page.getByTestId("derive-prelude-step").isVisible().catch(() => false)));
    await page.context().close();
  }

  {
    const page = await freshPage();
    await page.goto(`${BASE}/tasks/heads-legs-5-02`);
    check("5.2 blocked без methodist", await page.getByText("Задача недоступна").isVisible());
    await page.context().close();
  }

  {
    const page = await freshPage();
    await page.goto(`${BASE}/tasks/heads-legs-5-06`);
    check("5.6 blocked без methodist", await page.getByText("Задача недоступна").isVisible());
    await page.context().close();
  }

  await browser.close();
  console.log(`\n=== Smoke: ${ok} ok, ${fail} fail ===`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
