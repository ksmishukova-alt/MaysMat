import { test, expect } from "@playwright/test";
import { openTaskFresh, expectFinishScreen } from "./helpers/page-setup";
import { advanceUntilVisible, playTaskToFinish } from "./helpers/step-autopilot";

test.describe("Heads-Legs derive pattern pilot (Wave A)", () => {
  test("5.03 — derive-base flow в methodist mode", async ({ page }) => {
    test.setTimeout(120_000);
    await openTaskFresh(page, "heads-legs-5-03", "methodist");

    await expect(page.getByTestId("task-runner-shell")).toBeVisible();
    await expect(page.getByText(/сначала нужно собрать все данные/i)).toBeVisible();
    await expect(page.getByTestId("method-rule-screen")).not.toBeVisible();

    await page.getByRole("button", { name: "Прочитал, дальше" }).click();
    await page.waitForTimeout(1_100);

    await expect(page.getByTestId("derive-prelude-step")).toBeVisible();
    await expect(page.getByText("Что сначала нужно получить?")).toBeVisible();
    await page
      .locator("button")
      .filter({ hasText: "Сколько всего существ и сколько зубов" })
      .click();
    await page.getByRole("button", { name: "Проверить" }).click();
    await page.waitForTimeout(1_100);

    await page.getByTestId("derive-totals-objects").fill("29");
    await page.getByTestId("derive-totals-feature").fill("352");
    await page.getByRole("button", { name: "Проверить" }).click();
    await page.waitForTimeout(1_100);

    await expect(page.getByText(/знакомым методом замены/i)).toBeVisible();
    await page.getByRole("button", { name: "Понятно, дальше →" }).click();
    await page.waitForTimeout(1_100);

    await advanceUntilVisible(page, "heads-legs-5-03", undefined, 10, "Представим, что");
    await page.getByRole("button", { name: "Ранкоры" }).click();
    await page.getByRole("button", { name: "Проверить" }).click();
    await page.waitForTimeout(1_100);

    await expect(page.getByTestId("question-check-step")).toBeVisible();
    await page.getByRole("button", { name: "Понятно, записываю ответ" }).click();
    await page.waitForTimeout(1_100);

    await expect(page.getByTestId("word-solution-step")).toBeVisible();
    await expect(page.getByText("Шаг 6 из 7")).toBeVisible();

    await playTaskToFinish(page, "heads-legs-5-03", 150);
    await expectFinishScreen(page, "heads-legs-5-03");
  });

  test("5.03 — недоступна в child mode без methodist", async ({ page }) => {
    await openTaskFresh(page, "heads-legs-5-03");

    await expect(page.getByText("Задача недоступна")).toBeVisible();
    await expect(page.getByTestId("task-runner-shell")).not.toBeVisible();
    await expect(page.getByText(/методистам/i)).toBeVisible();
  });

  test("1.10 — non-pilot regression", async ({ page }) => {
    await openTaskFresh(page, "heads-legs-1-10");

    await expect(page.getByTestId("digital-task-player")).toBeVisible();
    await expect(page.getByTestId("task-runner-shell")).not.toBeVisible();

    await playTaskToFinish(page, "heads-legs-1-10");
    await expectFinishScreen(page, "heads-legs-1-10");
  });
});
