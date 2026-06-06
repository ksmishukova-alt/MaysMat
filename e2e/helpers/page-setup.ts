import type { Page } from "@playwright/test";

/** Чистая сессия задачи без сохранённого прогресса */
export async function openTaskFresh(page: Page, taskId: string) {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto(`/tasks/${taskId}`);
  await page.waitForLoadState("networkidle");
}

export async function expectFinishScreen(page: Page, taskId: string) {
  await page.waitForURL(new RegExp(`/tasks/${taskId}/result`), { timeout: 60_000 });
  await page.getByTestId("finish-screen").waitFor({ state: "visible" });
}
