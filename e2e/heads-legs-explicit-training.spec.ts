import { test, expect } from "@playwright/test";
import { openTaskFresh } from "./helpers/page-setup";
import { advanceUntilVisible } from "./helpers/step-autopilot";
import { HEADS_LEGS_TASKS } from "../src/data/heads-legs/build-task";

const WAVE_P1_REPRESENTATIVE = [
  { taskId: "heads-legs-1-01", methodTaskId: "1.1" },
  { taskId: "heads-legs-2-01", methodTaskId: "2.1" },
  { taskId: "heads-legs-3-03", methodTaskId: "3.3" },
] as const;

function assumeStep(taskId: string) {
  const task = HEADS_LEGS_TASKS[taskId];
  const step = task.steps.find(
    (s) => s.type === "single_select" && s.id.includes("-assume"),
  );
  if (!step || step.type !== "single_select") {
    throw new Error(`${taskId}: assume step not found`);
  }
  return step;
}

test.describe("Wave P1 explicit training path", () => {
  for (const { taskId } of WAVE_P1_REPRESENTATIVE) {
    test(`${taskId} — honest training copy и мягкий feedback`, async ({ page }) => {
      await openTaskFresh(page, taskId);
      await advanceUntilVisible(page, taskId, "explicit-training-assume-step", 60);

      const root = page.getByTestId("explicit-training-assume-step");
      await expect(root).toBeVisible();
      await expect(root.getByText(/потренируем один путь решения/i)).toBeVisible();
      await expect(root.getByText(/потренируем путь через/i)).toBeVisible();
      await expect(page.getByText(/удобнее/i)).not.toBeVisible();

      const step = assumeStep(taskId);
      const wrong = step.options.find((o) => !o.correct);
      const correct = step.options.find((o) => o.correct);
      if (!wrong || !correct) throw new Error(`${taskId}: assume options incomplete`);

      await page.getByRole("button", { name: wrong.label }).click();
      await page.getByRole("button", { name: "Проверить" }).click();

      const feedback = page.getByTestId("explicit-training-wrong-feedback");
      await expect(feedback).toBeVisible();
      await expect(feedback).toHaveText(/Так тоже можно решить/i);
      await expect(feedback).not.toHaveText(/неверно/i);

      await page.getByRole("button", { name: correct.label }).click();
      await page.getByRole("button", { name: "Проверить" }).click();
      await expect(page.getByText("Хорошо! Считаем дальше.")).toBeVisible({ timeout: 5_000 });
    });
  }
});
