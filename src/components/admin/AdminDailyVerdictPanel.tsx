"use client";

import { useCallback, useEffect, useState } from "react";
import { DAILY_SUBJECTS } from "@/data/daily-content";
import type { DailySubject } from "@/lib/daily";
import {
  DAILY_VERDICT_UPDATED_EVENT,
  fetchDailyVerdict,
  getSubjectVerdict,
  readDailyDayLog,
} from "@/lib/daily-submission-log";
import { submitSubjectVerdict } from "@/lib/daily-verdict-client";
import { getTodayDailySummary } from "@/lib/reset-today-daily";

const SUBJECT_LABEL: Record<DailySubject, string> = {
  reading: "Чтение",
  russian: "Русский",
  math: "Математика",
};

export function AdminDailyVerdictPanel() {
  const [comments, setComments] = useState<Record<DailySubject, string>>({
    reading: "",
    russian: "",
    math: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [logDate, setLogDate] = useState<string>("");

  const refresh = useCallback(async () => {
    const summary = getTodayDailySummary();
    setLogDate(summary.date);
    await fetchDailyVerdict(summary.date);
    const log = readDailyDayLog(summary.date);
    if (log) {
      setComments({
        reading: log.subjects.reading?.verdictComment ?? "",
        russian: log.subjects.russian?.verdictComment ?? "",
        math: log.subjects.math?.verdictComment ?? "",
      });
    }
  }, []);

  useEffect(() => {
    void refresh();
    window.addEventListener(DAILY_VERDICT_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(DAILY_VERDICT_UPDATED_EVENT, refresh);
  }, [refresh]);

  const submit = async (subject: DailySubject, verdict: "approved" | "redo") => {
    const log = readDailyDayLog(logDate);
    if (!log?.submissionId || !log.subjects[subject]) {
      setStatus(`Предмет «${SUBJECT_LABEL[subject]}» ещё не сдан.`);
      return;
    }

    const result = await submitSubjectVerdict({
      date: log.date,
      submissionId: log.submissionId,
      subject,
      verdict,
      comment: verdict === "redo" ? comments[subject] : undefined,
    });

    if (!result.ok) {
      setStatus(result.error ?? "Ошибка");
      return;
    }

    setStatus(
      verdict === "approved"
        ? `✅ Зачёт: ${SUBJECT_LABEL[subject]}`
        : `🔄 Переделать: ${SUBJECT_LABEL[subject]}`,
    );
    await refresh();
  };

  const summary = getTodayDailySummary();
  const log = readDailyDayLog(summary.date);

  return (
    <section className="mb-6 rounded-card border border-lavender-200 bg-white p-5 shadow-card">
      <h2 className="font-semibold">Проверка daily по предметам</h2>
      <p className="mt-1 text-sm text-gray-500">
        Зачёт и переделка отдельно для каждого предмета (дублирует Telegram).
      </p>

      <div className="mt-4 space-y-4">
        {DAILY_SUBJECTS.map((subject) => {
          const submitted = Boolean(log?.subjects[subject]);
          const verdict = getSubjectVerdict(log, subject);
          return (
            <div
              key={subject}
              className="rounded-xl border border-lavender-100 bg-lavender-50/40 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{SUBJECT_LABEL[subject]}</p>
                <span className="text-xs text-gray-500">
                  {!submitted
                    ? "не сдан"
                    : verdict === "approved"
                      ? "✅ зачтён"
                      : verdict === "redo"
                        ? "🔄 переделать"
                        : "⏳ на проверке"}
                </span>
              </div>

              <textarea
                value={comments[subject]}
                onChange={(e) =>
                  setComments((c) => ({ ...c, [subject]: e.target.value }))
                }
                rows={2}
                disabled={!submitted}
                placeholder="Комментарий при переделке…"
                className="mt-2 w-full rounded-lg border border-lavender-200 px-3 py-2 text-sm disabled:opacity-50"
              />

              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={!submitted}
                  onClick={() => void submit(subject, "approved")}
                  className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40"
                >
                  ✅ Зачёт
                </button>
                <button
                  type="button"
                  disabled={!submitted}
                  onClick={() => void submit(subject, "redo")}
                  className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40"
                >
                  🔄 Переделать
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {status ? <p className="mt-3 text-sm text-green-800">{status}</p> : null}
    </section>
  );
}
