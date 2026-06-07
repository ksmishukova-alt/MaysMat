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
