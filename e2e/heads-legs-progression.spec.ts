import { test, expect } from "@playwright/test";
import { openTaskFresh, expectFinishScreen } from "./helpers/page-setup";
import { advanceOneStep, advanceUntilVisible, playTaskToFinish } from "./helpers/step-autopilot";
import {
  CHOOSE_METHOD_LABELS,
  CHOOSE_METHOD_ACTIONS,
} from "../src/data/heads-legs/base-pattern/progression";
import {
  VALUE_CHOOSE_METHOD_LABELS,
  VALUE_CHOOSE_METHOD_ACTIONS,
} from "../src/data/heads-legs/value-pattern/progression";

test.describe("Heads-Legs progression pilot", () => {
  test("1.01 — полный rule-flow до финала", async ({ page }) => {
    await openTaskFresh(page, "heads-legs-1-01");

    await expect(page.getByTestId("task-runner-shell")).toBeVisible();
    await expect(page.getByText("Метод «Представим, что все одного вида»")).toBeVisible();
    await page.getByRole("button", { name: "Понятно, дальше →" }).click();

    await expect(page.getByTestId("method-rule-screen")).toBeVisible();
    await expect(page.getByText("30 × 2 = 60")).toBeVisible();
    await expect(page.getByText(/ног 100|ноги 100/)).toBeVisible();

    await page.getByTestId("remember-rule-button").click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Понятно", exact: true }).click();

    await page.getByRole("button", { name: "Понятно, решаю" }).click();
    await page.waitForTimeout(1_100);

    await playTaskToFinish(page, "heads-legs-1-01");
    await expectFinishScreen(page, "heads-legs-1-01");
  });

  test("1.04 — hub base: выбор шага и реальные подшаги", async ({ page }) => {
    await openTaskFresh(page, "heads-legs-1-04");

    await page.getByRole("button", { name: "Прочитал, дальше" }).click();
    await page.waitForTimeout(1_100);
    await advanceUntilVisible(page, "heads-legs-1-04", "method-step-hub");
    await expect(page.getByTestId("method-step-hub")).toBeVisible();
    await expect(
      page.getByTestId("method-step-hub").getByText("Какой шаг сейчас нужно сделать?"),
    ).toBeVisible();

    for (const action of CHOOSE_METHOD_ACTIONS) {
      await expect(page.getByRole("button", { name: CHOOSE_METHOD_LABELS[action] })).toBeVisible();
    }

    await expect(
      page.getByRole("button", { name: "Все шаги пройдены — дальше" }),
    ).not.toBeVisible();

    await page.getByRole("button", { name: CHOOSE_METHOD_LABELS.assume_all }).click();
    await expect(page.getByRole("button", { name: "Проверить" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Все шаги пройдены — дальше" }),
    ).not.toBeVisible();

    await page.getByRole("button", { name: "← Назад к выбору" }).click();
    await playTaskToFinish(page, "heads-legs-1-04");
    await expectFinishScreen(page, "heads-legs-1-04");
  });

  test("1.06 — word_solution base до финала", async ({ page }) => {
    await openTaskFresh(page, "heads-legs-1-06");

    await expect(page.getByTestId("task-runner-shell")).toBeVisible();
    await page.getByRole("button", { name: "Прочитал, дальше" }).click();
    await expect(page.getByTestId("word-solution-step")).toBeVisible({ timeout: 30_000 });

    await playTaskToFinish(page, "heads-legs-1-06");
    await expectFinishScreen(page, "heads-legs-1-06");
  });

  test("2.01 — value-flow с проверкой вопроса", async ({ page }) => {
    await openTaskFresh(page, "heads-legs-2-01");

    await expect(page.getByText("Тот же метод — другие величины")).toBeVisible();
    await page.getByRole("button", { name: "Понятно, дальше →" }).click();
    await expect(page.getByTestId("method-rule-screen")).toBeVisible();
    await expect(page.getByText("19 цветков").first()).toBeVisible();
    await page.getByRole("button", { name: "Понятно, решаю" }).click();
    await page.waitForTimeout(1_100);

    let sawQuestionCheck = false;
    for (let i = 0; i < 80 && !page.url().includes("/result"); i++) {
      if (await page.getByTestId("question-check-step").isVisible().catch(() => false)) {
        sawQuestionCheck = true;
        await expect(
          page.getByTestId("question-check-step").getByText(/сколько клумб около Лицея/),
        ).toBeVisible();
        break;
      }
      await advanceOneStep(page, "heads-legs-2-01");
    }
    expect(sawQuestionCheck).toBe(true);

    await playTaskToFinish(page, "heads-legs-2-01");
    await expectFinishScreen(page, "heads-legs-2-01");
  });

  test("2.04 — hub value с пунктом «Проверить, что спрашивают»", async ({ page }) => {
    await openTaskFresh(page, "heads-legs-2-04");

    await page.getByRole("button", { name: "Прочитал, дальше" }).click();
    await page.waitForTimeout(1_100);
    await advanceUntilVisible(page, "heads-legs-2-04", "method-step-hub");
    await expect(page.getByTestId("method-step-hub")).toBeVisible();

    for (const action of VALUE_CHOOSE_METHOD_ACTIONS) {
      await expect(
        page.getByRole("button", { name: VALUE_CHOOSE_METHOD_LABELS[action] }),
      ).toBeVisible();
    }

    await page
      .getByRole("button", { name: VALUE_CHOOSE_METHOD_LABELS.check_question })
      .click();
    await expect(page.getByTestId("question-check-step")).toBeVisible();
    await expect(
      page.getByTestId("question-check-step").getByText(/пирожных по 125 рублей/),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Все шаги пройдены — дальше" }),
    ).not.toBeVisible();

    await page.getByRole("button", { name: "← Назад к выбору" }).click();
    await playTaskToFinish(page, "heads-legs-2-04");
    await expectFinishScreen(page, "heads-legs-2-04");
  });

  test("2.05 — answerTransform: 17 × 20 = 340", async ({ page }) => {
    test.setTimeout(120_000);
    await openTaskFresh(page, "heads-legs-2-05");

    await page.getByRole("button", { name: "Прочитал, дальше" }).click();
    await page.waitForTimeout(1_100);
    await advanceUntilVisible(page, "heads-legs-2-05", "method-step-hub", 40);

    await page
      .getByRole("button", { name: VALUE_CHOOSE_METHOD_LABELS.check_question })
      .click();

    const transform = page.getByTestId("answer-transform-step");
    await expect(transform).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId("answer-transform-multiplier")).toHaveText("20");
    await expect(page.getByTestId("answer-transform-result-label")).toContainText("простых карандашей");

    await page.getByRole("button", { name: "Понятно, записываю ответ" }).click();
    await page.waitForTimeout(1_100);

    await expect(page.getByTestId("word-solution-step")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId("answer-transform-expression")).toContainText("17");
    await expect(page.getByTestId("answer-transform-result")).toContainText("340");
    await expect(page.getByText(/17.*20.*340/)).toBeVisible();

    await page.getByRole("button", { name: "← Назад к выбору" }).click();
    await playTaskToFinish(page, "heads-legs-2-05", 120);
    await expectFinishScreen(page, "heads-legs-2-05");
  });

  test("2.06 — word_solution value в сокращённом режиме", async ({ page }) => {
    await openTaskFresh(page, "heads-legs-2-06");

    await expect(page.getByTestId("task-runner-shell")).toBeVisible();
    await expect(page.getByTestId("remember-rule-button")).toBeVisible();
    await page.getByRole("button", { name: "Прочитал, дальше" }).click();
    await expect(page.getByTestId("word-solution-step")).toBeVisible({ timeout: 30_000 });

    await playTaskToFinish(page, "heads-legs-2-06");
    await expectFinishScreen(page, "heads-legs-2-06");
  });

  test("1.10 — non-pilot regression: старый DigitalTaskPlayer", async ({ page }) => {
    await openTaskFresh(page, "heads-legs-1-10");

    await expect(page.getByTestId("digital-task-player")).toBeVisible();
    await expect(page.getByTestId("task-runner-shell")).not.toBeVisible();
    await expect(page.getByTestId("remember-rule-button")).not.toBeVisible();
    await expect(page.getByText("Представим, что все одного вида")).not.toBeVisible();

    await playTaskToFinish(page, "heads-legs-1-10");
    await expectFinishScreen(page, "heads-legs-1-10");
  });
});
