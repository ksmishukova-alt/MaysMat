import { test, expect } from "@playwright/test";
import { openTaskFresh } from "./helpers/page-setup";

const PUBLISHED_WAVE = [
  { routeNum: 29, taskId: "heads-legs-4-03", title: "Открытки девочкам" },
  { routeNum: 30, taskId: "heads-legs-4-04", title: "Матчи двух команд" },
  { routeNum: 31, taskId: "heads-legs-4-05", title: "Экзамен Васи" },
  { routeNum: 32, taskId: "heads-legs-5-03", title: "Банты и Ранкоры" },
] as const;

test.describe("Heads-Legs child route wave 4.03–4.05 + 5.03", () => {
  test("/branch/heads-legs — задачи 29–32 доступны, не «скоро»", async ({ page }) => {
    await page.goto("/branch/heads-legs");
    await page.waitForLoadState("networkidle");

    for (const { routeNum, title } of PUBLISHED_WAVE) {
      await expect(page.getByRole("link", { name: new RegExp(`Задача ${routeNum}\\..*${title}`) })).toBeVisible();
      await expect(page.getByText(`Задача ${routeNum} — скоро`)).not.toBeVisible();
    }
  });

  for (const { taskId, title } of PUBLISHED_WAVE) {
    test(`${taskId} — открывается без ?mode=methodist`, async ({ page }) => {
      await openTaskFresh(page, taskId);

      await expect(page.getByText("Задача доступна методистам")).not.toBeVisible();
      await expect(page.getByText("скоро появится в маршруте")).not.toBeVisible();
      await expect(page.getByTestId("task-runner-shell")).toBeVisible();
      await expect(page.getByRole("heading", { level: 2, name: title })).toBeVisible();
    });
  }
});
