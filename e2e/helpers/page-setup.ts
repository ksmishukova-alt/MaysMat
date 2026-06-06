import type { Page } from "@playwright/test";

/** Чистая сессия задачи без сохранённого прогресса */
export async function openTaskFresh(
  page: Page,
  taskId: string,
  mode?: "child" | "methodist" | "archivePreview",
) {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  const qs = mode ? `?mode=${mode}` : "";
  await page.goto(`/tasks/${taskId}${qs}`);
  await page.waitForLoadState("networkidle");
}

export async function expectFinishScreen(page: Page, taskId: string) {
  await page.waitForURL(new RegExp(`/tasks/${taskId}/result`), { timeout: 60_000 });
  await page.getByTestId("finish-screen").waitFor({ state: "visible" });
}
