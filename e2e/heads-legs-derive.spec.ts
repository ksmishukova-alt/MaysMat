import { test, expect } from "@playwright/test";
import { openTaskFresh, expectFinishScreen } from "./helpers/page-setup";
import { playTaskToFinish } from "./helpers/step-autopilot";

test.describe("Heads-Legs transfer 5.3 (Wave A fix)", () => {
  test("5.03 — transfer flow в child route (без methodist)", async ({ page }) => {
    test.setTimeout(120_000);
    await openTaskFresh(page, "heads-legs-5-03");

    await expect(page.getByText("Задача недоступна")).not.toBeVisible();
    await expect(page.getByTestId("task-runner-shell")).toBeVisible();
    await expect(page.getByText(/знакомый тип: два вида существ/i)).toBeVisible();
    await expect(page.getByText(/сначала нужно собрать/i)).not.toBeVisible();
    await expect(page.getByTestId("derive-prelude-step")).not.toBeVisible();

    await page.getByRole("button", { name: "Прочитал, дальше" }).click();
    await page.waitForTimeout(1_100);

    await expect(page.getByRole("heading", { name: "Выбери метод" })).toBeVisible();
    await page
      .getByRole("button", { name: /А\. Представить, что все существа одного вида/ })
      .click();
    await page.getByRole("button", { name: "Проверить" }).click();
    await page.waitForTimeout(1_100);

    await expect(page.getByTestId("word-solution-step")).toBeVisible();
    await expect(page.getByText("Шаг 3 из 4")).toBeVisible();

    await playTaskToFinish(page, "heads-legs-5-03", 150);
    await expectFinishScreen(page, "heads-legs-5-03");
  });

  test("5.03 — transfer flow в methodist mode", async ({ page }) => {
    test.setTimeout(120_000);
    await openTaskFresh(page, "heads-legs-5-03", "methodist");

    await expect(page.getByTestId("task-runner-shell")).toBeVisible();
    await expect(page.getByText(/знакомый тип: два вида существ/i)).toBeVisible();
    await expect(page.getByText(/сначала нужно собрать/i)).not.toBeVisible();
    await expect(page.getByTestId("method-rule-screen")).not.toBeVisible();
    await expect(page.getByTestId("derive-prelude-step")).not.toBeVisible();

    await page.getByRole("button", { name: "Прочитал, дальше" }).click();
    await page.waitForTimeout(1_100);

    await expect(page.getByRole("heading", { name: "Выбери метод" })).toBeVisible();
    await expect(page.getByText("Какой метод здесь подходит?").first()).toBeVisible();
    await page
      .getByRole("button", { name: /А\. Представить, что все существа одного вида/ })
      .click();
    await page.getByRole("button", { name: "Проверить" }).click();
    await page.waitForTimeout(1_100);

    await expect(page.getByTestId("word-solution-step")).toBeVisible();
    await expect(page.getByText("Шаг 3 из 4")).toBeVisible();

    await playTaskToFinish(page, "heads-legs-5-03", 150);
    await expectFinishScreen(page, "heads-legs-5-03");
  });

  test("5.03 — methodist mode (regression)", async ({ page }) => {
    await openTaskFresh(page, "heads-legs-5-03", "methodist");
    await expect(page.getByTestId("task-runner-shell")).toBeVisible();
  });

  test("1.10 — non-pilot regression", async ({ page }) => {
    await openTaskFresh(page, "heads-legs-1-10");

    await expect(page.getByTestId("digital-task-player")).toBeVisible();
    await expect(page.getByTestId("task-runner-shell")).not.toBeVisible();

    await playTaskToFinish(page, "heads-legs-1-10");
    await expectFinishScreen(page, "heads-legs-1-10");
  });
});

test.describe("Heads-Legs derive 5.6 (methodist smoke)", () => {
  test("5.06 — derive prelude без «кто участвует»", async ({ page }) => {
    test.setTimeout(120_000);
    await openTaskFresh(page, "heads-legs-5-06", "methodist");

    await expect(page.getByTestId("task-runner-shell")).toBeVisible();
    await expect(page.getByText("Задача недоступна")).not.toBeVisible();
    await expect(page.getByText("Кто участвует в задаче?")).not.toBeVisible();

    await page.getByRole("button", { name: "Прочитал, дальше" }).click();
    await page.waitForTimeout(1_100);

    await expect(page.getByTestId("derive-prelude-step")).toBeVisible();
    await expect(
      page.getByText(/сколько всего мечей \(из 17 рукоятей\)/i),
    ).toBeVisible();

    await page
      .getByRole("button", { name: /сколько всего мечей \(из 17 рукоятей\)/i })
      .click();
    await page.getByRole("button", { name: "Проверить" }).click();
    await page.waitForTimeout(400);

    await expect(page.getByTestId("derive-count-input")).toBeVisible();
    await page.getByTestId("derive-count-input").fill("17");
    await page.getByRole("button", { name: "Проверить" }).click();
    await page.waitForTimeout(400);

    await expect(page.getByText(/сколько кристаллов требуется/i)).toBeVisible();
    await page.getByTestId("derive-feature-f1").fill("1");
    await page.getByTestId("derive-feature-f2").fill("2");
    await page.getByRole("button", { name: "Проверить" }).click();
    await page.waitForTimeout(400);

    await page.getByTestId("derive-totals-feature").fill("32");
    await page.getByRole("button", { name: "Проверить" }).click();
    await page.waitForTimeout(1_100);

    await expect(page.getByText(/знакомым методом замены/i)).toBeVisible();
  });
});

test.describe("Heads-Legs derive 5.2 (methodist smoke)", () => {
  test("5.02 — unit conversion prelude без «кто участвует»", async ({ page }) => {
    test.setTimeout(120_000);
    await openTaskFresh(page, "heads-legs-5-02", "methodist");

    await expect(page.getByTestId("task-runner-shell")).toBeVisible();
    await expect(page.getByText("Кто участвует в задаче?")).not.toBeVisible();

    await page.getByRole("button", { name: "Прочитал, дальше" }).click();
    await page.waitForTimeout(1_100);

    await expect(page.getByTestId("derive-prelude-step")).toBeVisible();
    await page
      .getByRole("button", { name: /перевести пары ног в общее число ног/i })
      .click();
    await page.getByRole("button", { name: "Проверить" }).click();
    await page.waitForTimeout(400);

    await page.getByTestId("derive-count-input").fill("108");
    await page.getByRole("button", { name: "Проверить" }).click();
    await page.waitForTimeout(400);

    await expect(page.getByText(/сколько ног у каждого вида/i)).toBeVisible();
    await page.getByTestId("derive-feature-f1").fill("4");
    await page.getByTestId("derive-feature-f2").fill("2");
    await page.getByRole("button", { name: "Проверить" }).click();
    await page.waitForTimeout(400);

    await page.getByTestId("derive-totals-objects").fill("44");
    await page.getByRole("button", { name: "Проверить" }).click();
    await page.waitForTimeout(1_100);

    await expect(page.getByText(/знакомым методом замены/i)).toBeVisible();
  });

  test("5.02 — dual-path assume: оба пути и итог 34 Джавы", async ({ page }) => {
    test.setTimeout(180_000);
    await openTaskFresh(page, "heads-legs-5-02", "methodist");

    await page.getByRole("button", { name: "Прочитал, дальше" }).click();
    await page.waitForTimeout(1_100);

    await page
      .getByRole("button", { name: /перевести пары ног в общее число ног/i })
      .click();
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

    await expect(page.getByTestId("dual-path-assume-step")).toBeVisible();
    await expect(page.getByText(/оба пути верны/i)).toBeVisible();
    await expect(page.getByText(/удобнее/i)).not.toBeVisible();

    await page.getByTestId("assume-path-1").click();
    await page.getByRole("button", { name: "Проверить" }).click();
    await page.waitForTimeout(1_100);

    await page.getByRole("button", { name: "Понятно, записываю ответ" }).click();
    await page.waitForTimeout(1_100);

    await expect(page.getByTestId("word-solution-step")).toBeVisible();
    await playTaskToFinish(page, "heads-legs-5-02", 200);
    await expectFinishScreen(page, "heads-legs-5-02");
  });

  test("5.02 — без methodist недоступна в child route", async ({ page }) => {
    await openTaskFresh(page, "heads-legs-5-02");
    await expect(page.getByText("Задача недоступна")).toBeVisible();
    await expect(page.getByTestId("task-runner-shell")).not.toBeVisible();
  });
});
