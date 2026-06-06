import { test, expect } from "@playwright/test";
import { openTaskFresh, expectFinishScreen } from "./helpers/page-setup";
import { advanceUntilVisible, playTaskToFinish } from "./helpers/step-autopilot";
import {
  PRODUCTION_CHOOSE_METHOD_LABELS,
  PRODUCTION_CHOOSE_METHOD_ACTIONS,
} from "../src/data/heads-legs/production-pattern/progression";

test.describe("Heads-Legs production pattern pilot", () => {
  test("3.01 — diagnostic: данных не хватает", async ({ page }) => {
    await openTaskFresh(page, "heads-legs-3-01", "methodist");

    await expect(page.getByTestId("digital-task-player")).toBeVisible();
    await expect(page.getByTestId("task-runner-shell")).not.toBeVisible();
    await expect(page.getByTestId("remember-rule-button")).not.toBeVisible();

    await page.getByRole("button", { name: "Прочитал, дальше" }).click();
    await advanceUntilVisible(page, "heads-legs-3-01", undefined, 25, "Выдели данные");
    await expect(page.getByRole("heading", { name: "Выдели данные из условия" })).toBeVisible();
  });

  test("3.02 — enumeration + remember rule", async ({ page }) => {
    await openTaskFresh(page, "heads-legs-3-02");

    await expect(page.getByTestId("task-runner-shell")).toBeVisible();
    await expect(page.getByTestId("remember-rule-button")).toBeVisible();
    await expect(page.getByTestId("method-rule-screen")).toBeVisible();
    await page.getByRole("button", { name: "Понятно, решаю" }).click();
    await page.waitForTimeout(1_100);

    await page.getByRole("button", { name: "Прочитал, дальше" }).click();
    await page.waitForTimeout(1_100);
    await advanceUntilVisible(page, "heads-legs-3-02", undefined, 30, "Оба вида участвуют");
    await expect(page.getByText(/0 мальчиков|0 девочек/)).toBeVisible();

    await playTaskToFinish(page, "heads-legs-3-02", 120);
    await expectFinishScreen(page, "heads-legs-3-02");
  });

  test("3.03 — полный production rule-flow (profile 1)", async ({ page }) => {
    test.setTimeout(120_000);
    await openTaskFresh(page, "heads-legs-3-03");

    await expect(page.getByTestId("task-runner-shell")).toBeVisible();
    await expect(page.getByText("Тот же метод — другой сюжет")).toBeVisible();
    await page.getByRole("button", { name: "Понятно, дальше →" }).click();

    await expect(page.getByTestId("method-rule-screen")).toBeVisible();
    await expect(page.getByText("Кто сколько сделал?")).toBeVisible();
    await expect(page.getByText("30 × 2 = 60")).toBeVisible();

    await page.getByTestId("remember-rule-button").click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Понятно", exact: true }).click();

    await page.getByRole("button", { name: "Понятно, решаю" }).click();
    await page.waitForTimeout(1_100);

    await advanceUntilVisible(page, "heads-legs-3-03", "question-check-step", 50);
    await expect(
      page.getByTestId("question-check-step").getByText(/сколько девочек/),
    ).toBeVisible();

    await playTaskToFinish(page, "heads-legs-3-03", 120);
    await expectFinishScreen(page, "heads-legs-3-03");
  });

  test("3.05 — compare_results в hub", async ({ page }) => {
    test.setTimeout(120_000);
    await openTaskFresh(page, "heads-legs-3-05");

    await page.getByRole("button", { name: "Прочитал, дальше" }).click();
    await page.waitForTimeout(1_100);
    await advanceUntilVisible(page, "heads-legs-3-05", "method-step-hub", 40);

    await page
      .getByRole("button", { name: PRODUCTION_CHOOSE_METHOD_LABELS.check_question })
      .click();

    await expect(page.getByTestId("answer-transform-step")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId("answer-transform-first-kind")).toContainText("совята");
    await expect(page.getByTestId("answer-transform-second-kind")).toContainText("котята");
    await expect(page.getByTestId("answer-transform-result-label")).toContainText("мышей");

    await page.getByRole("button", { name: "← Назад к выбору" }).click();
    for (const action of PRODUCTION_CHOOSE_METHOD_ACTIONS) {
      await expect(
        page.getByRole("button", { name: PRODUCTION_CHOOSE_METHOD_LABELS[action] }),
      ).toBeVisible();
    }

    await playTaskToFinish(page, "heads-legs-3-05", 120);
    await expectFinishScreen(page, "heads-legs-3-05");
  });

  test("3.06 — word_solution production (profile 4)", async ({ page }) => {
    await openTaskFresh(page, "heads-legs-3-06");

    await expect(page.getByTestId("task-runner-shell")).toBeVisible();
    await expect(page.getByTestId("remember-rule-button")).toBeVisible();
    await page.getByRole("button", { name: "Прочитал, дальше" }).click();
    await expect(page.getByTestId("word-solution-step")).toBeVisible({ timeout: 30_000 });

    await playTaskToFinish(page, "heads-legs-3-06", 120);
    await expectFinishScreen(page, "heads-legs-3-06");
  });

  test("3.07 — multiple_answers", async ({ page }) => {
    test.setTimeout(120_000);
    await openTaskFresh(page, "heads-legs-3-07");

    await expect(page.getByTestId("task-runner-shell")).toBeVisible();
    await page.getByRole("button", { name: "Прочитал, дальше" }).click();
    await advanceUntilVisible(page, "heads-legs-3-07", undefined, 40, "0 девочек");
    await advanceUntilVisible(page, "heads-legs-3-07", undefined, 25, "5 или 2");
    await advanceUntilVisible(page, "heads-legs-3-07", "word-solution-step", 15);

    await expect(page.getByTestId("word-solution-step")).toBeVisible();
    await expect(page.getByText(/5.*2|девочек могло быть/)).toBeVisible();
  });

  test("1.10 — non-pilot regression", async ({ page }) => {
    await openTaskFresh(page, "heads-legs-1-10");

    await expect(page.getByTestId("digital-task-player")).toBeVisible();
    await expect(page.getByTestId("task-runner-shell")).not.toBeVisible();

    await playTaskToFinish(page, "heads-legs-1-10");
    await expectFinishScreen(page, "heads-legs-1-10");
  });
});
