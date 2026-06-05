"use client";

import { useEffect, useState } from "react";
import { resolveTask } from "@/lib/task-store";
import {
  listPendingPaperTasks,
  PAPER_REVIEW_UPDATED_EVENT,
} from "@/lib/paper-task-review";
import { submitPaperVerdictAdmin } from "@/lib/paper-task-telegram";

export function AdminPaperReviewPanel() {
  const [, tick] = useState(0);

  useEffect(() => {
    const refresh = () => tick((n) => n + 1);
    window.addEventListener(PAPER_REVIEW_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(PAPER_REVIEW_UPDATED_EVENT, refresh);
  }, []);

  const pending = listPendingPaperTasks();
  if (pending.length === 0) return null;

  return (
    <section className="rounded-card border border-sky-200 bg-sky-50/50 p-6 shadow-card">
      <h2 className="mb-3 text-lg font-semibold text-sky-900">📝 Бумажные решения на проверке</h2>
      <p className="mb-4 text-xs text-sky-800">
        Дублирует кнопки в Telegram: зачёт и переделка синхронизируются с сервером.
      </p>
      <ul className="space-y-3">
        {pending.map((sub) => {
          const task = resolveTask(sub.taskId);
          if (!task) return null;
          return (
            <li
              key={sub.taskId}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4"
            >
              <div>
                <p className="font-medium">
                  {task.number}. {task.title}
                </p>
                <p className="text-xs text-gray-500">
                  Отправлено: {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString("ru") : "—"}
                  {sub.paperUpload ? ` · 📷 ${sub.paperUpload.fileName}` : ""}
                  {sub.telegramSentAt ? " · Telegram ✓" : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm text-white"
                  onClick={() => {
                    void submitPaperVerdictAdmin({
                      submissionId: sub.submissionId ?? `paper-${sub.taskId}-local`,
                      taskId: sub.taskId,
                      verdict: "approved",
                      stars: 3,
                    });
                  }}
                >
                  ✓ Подтвердить
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-amber-300 px-3 py-1.5 text-sm text-amber-900"
                  onClick={() => {
                    void submitPaperVerdictAdmin({
                      submissionId: sub.submissionId ?? `paper-${sub.taskId}-local`,
                      taskId: sub.taskId,
                      verdict: "redo",
                    });
                  }}
                >
                  Переделать
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
