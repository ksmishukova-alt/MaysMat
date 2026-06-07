import { test, expect } from "@playwright/test";
import { openTaskFresh, expectFinishScreen } from "./helpers/page-setup";
import { advanceUntilVisible, playTaskToFinish } from "./helpers/step-autopilot";
import {
  SCORE_CHOOSE_METHOD_LABELS,
  SCORE_CHOOSE_METHOD_ACTIONS,
} from "../src/data/heads-legs/score-pattern/progression";

test.describe("Heads-Legs score pattern pilot", () => {
  test("4.01 — plus_minus full rule-flow (profile 1)", async ({ page }) => {
    test.setTimeout(120_000);
    await openTaskFresh(page, "heads-legs-4-01");

    await expect(page.getByTestId("task-runner-shell")).toBeVisible();
    await expect(page.getByText("Когда за одно дают больше, а за другое меньше")).toBeVisible();
    await page.getByRole("button", { name: "Понятно, дальше →" }).click();

    await expect(page.getByTestId("method-rule-screen")).toBeVisible();
    await expect(page.getByText("Баллы: прибавили или вычли")).toBeVisible();
    await expect(page.getByText(/10 × \(.*1\) = .*10/)).toBeVisible();
    await page.getByRole("button", { name: "Понятно, решаю" }).click();
    await page.waitForTimeout(1_100);

    await expect(page.getByTestId("score-replacement-step")).toBeVisible();
    await expect(page.getByTestId("score-replacement-formula")).toContainText(/2 − \(-1\) = 3/);
    await page.getByRole("button", { name: "Понятно, считаю дальше" }).click();
    await page.waitForTimeout(1_100);

    await page.getByRole("button", { name: "Прочитал, дальше" }).click();
    await page.waitForTimeout(1_100);

    await playTaskToFinish(page, "heads-legs-4-01", 150);
    await expectFinishScreen(page, "heads-legs-4-01");
  });

  test("4.02 — question-check: ответ 3 двойки, не 7 троек", async ({ page }) => {
    test.setTimeout(120_000);
    await openTaskFresh(page, "heads-legs-4-02");

    await expect(page.getByTestId("task-runner-shell")).toBeVisible();
    await page.getByRole("button", { name: "Понятно, решаю" }).click();
    await page.waitForTimeout(1_100);
    await page.getByRole("button", { name: "Прочитал, дальше" }).click();
    await page.waitForTimeout(1_100);

    await advanceUntilVisible(page, "heads-legs-4-02", "score-question-check-step", 50);
    await expect(page.getByTestId("score-question-asks")).toContainText(/получили 2/);
    await expect(page.getByTestId("score-question-hint")).toContainText(/получили 3/);
    await expect(page.getByTestId("score-question-hint")).toContainText(/получили 2/);

    await playTaskToFinish(page, "heads-legs-4-02", 120);
    await expectFinishScreen(page, "heads-legs-4-02");
  });

  test("4.03 — transfer: 4 экрана, нейтральная рамка", async ({ page }) => {
    test.setTimeout(120_000);
    await openTaskFresh(page, "heads-legs-4-03", "methodist");

    await expect(page.getByTestId("task-runner-shell")).toBeVisible();
    await expect(page.getByText("Та же замена: по 2 или по 3")).toBeVisible();
    await expect(page.getByText(/Баллы: прибавили или вычли/i)).not.toBeVisible();
    await expect(page.getByTestId("method-rule-screen")).not.toBeVisible();
    await expect(page.getByText(/знакомый тип задачи/i)).toBeVisible();

    await page.getByRole("button", { name: "Прочитал, дальше" }).click();
    await page.waitForTimeout(1_100);

    await advanceUntilVisible(page, "heads-legs-4-03", undefined, 10, "Выбери пробное предположение");
    await page
      .getByRole("button", { name: /Представить, что все девочки получили по 2 открытки/i })
      .click();
    await page.getByRole("button", { name: "Проверить" }).click();
    await page.waitForTimeout(1_100);

    await expect(page.getByRole("heading", { name: "Запиши решение с пропусками" })).toBeVisible();
    await expect(page.getByText("Шаг 3 из 4")).toBeVisible();

    await expect(page.getByTestId("task-step-nav")).toBeVisible();
    await page.getByRole("button", { name: "← Назад" }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText("Выбери пробное предположение")).toBeVisible();

    await playTaskToFinish(page, "heads-legs-4-03", 80);
    await expectFinishScreen(page, "heads-legs-4-03");
  });

  test("4.04 — match_total special mode", async ({ page }) => {
    test.setTimeout(120_000);
    await openTaskFresh(page, "heads-legs-4-04", "methodist");

    await expect(page.getByTestId("task-runner-shell")).toBeVisible();
    await page.getByRole("button", { name: "Понятно, решаю" }).click();
    await page.waitForTimeout(1_100);

    await expect(page.getByTestId("match-total-step")).toBeVisible();
    await expect(page.getByTestId("match-decisive-formula")).toContainText("4 + 1 = 5");
    await expect(page.getByTestId("match-draw-formula")).toContainText("2 + 2 = 4");
    await page.getByRole("button", { name: "Понятно, решаю" }).click();
    await page.waitForTimeout(1_100);

    await page.getByRole("button", { name: "Прочитал, дальше" }).click();
    await page.waitForTimeout(1_100);

    await advanceUntilVisible(page, "heads-legs-4-04", "score-question-check-step", 50);
    await expect(page.getByTestId("score-question-asks")).toContainText(/ничьих/);

    await playTaskToFinish(page, "heads-legs-4-04", 120);
    await expectFinishScreen(page, "heads-legs-4-04");
  });

  test("4.05 — plus_minus hub (profile 3)", async ({ page }) => {
    test.setTimeout(180_000);
    await openTaskFresh(page, "heads-legs-4-05", "methodist");

    await expect(page.getByTestId("task-runner-shell")).toBeVisible();
    await page.getByRole("button", { name: "Прочитал, дальше" }).click();
    await page.waitForTimeout(1_100);

    await advanceUntilVisible(page, "heads-legs-4-05", "score-replacement-step", 40);
    await expect(page.getByTestId("score-replacement-formula")).toContainText(/7 − \(-12\) = 19/);
    await page.getByRole("button", { name: "Понятно, считаю дальше" }).click();
    await page.waitForTimeout(1_100);

    await advanceUntilVisible(page, "heads-legs-4-05", "method-step-hub", 40);

    await page.getByRole("button", { name: SCORE_CHOOSE_METHOD_LABELS.plus_minus_step }).click();
    await expect(page.getByTestId("score-replacement-formula")).toContainText(/7 − \(-12\) = 19/);
    await page.getByRole("button", { name: "← Назад к выбору" }).click();

    for (const action of SCORE_CHOOSE_METHOD_ACTIONS) {
      await expect(
        page.getByRole("button", { name: SCORE_CHOOSE_METHOD_LABELS[action] }),
      ).toBeVisible();
    }

    await playTaskToFinish(page, "heads-legs-4-05", 200);
    await expectFinishScreen(page, "heads-legs-4-05");
  });

  test("1.10 — non-pilot regression", async ({ page }) => {
    await openTaskFresh(page, "heads-legs-1-10");

    await expect(page.getByTestId("digital-task-player")).toBeVisible();
    await expect(page.getByTestId("task-runner-shell")).not.toBeVisible();

    await playTaskToFinish(page, "heads-legs-1-10");
    await expectFinishScreen(page, "heads-legs-1-10");
  });
});
