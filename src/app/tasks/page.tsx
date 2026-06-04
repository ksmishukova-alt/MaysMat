"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Header } from "@/components/Header";
import { dailyTheme } from "@/components/daily/daily-theme";
import {
  DAILY_CATCHPHRASE_LINE1,
  DAILY_CATCHPHRASE_LINE2,
  DAILY_CHILD_TAGLINE,
  DAILY_CONTENT,
  DAILY_SUBJECTS,
  PROGRAM_WEEK_LABELS,
} from "@/data/daily-content";
import { getDailyState, getProgramWeek, type DailySubject } from "@/lib/daily";
import { loadProgress, type UserProgress } from "@/lib/progress";
import {
  DAILY_SUBJECT_STATUS_LABEL,
  getDailySubjectUiStatus,
  isSubjectUiComplete,
} from "@/lib/daily-subject-status";
import { TasksMyshMatBlock } from "@/components/tasks/TasksMyshMatBlock";
import { DailyVerdictBanner } from "@/components/DailyVerdictBanner";
import {
  DAILY_VERDICT_UPDATED_EVENT,
  fetchDailyVerdict,
  isDayFullyApproved,
  readDailyDayLog,
  type DailyDayLog,
} from "@/lib/daily-submission-log";
import { CHILD_PATH_UPDATED_EVENT } from "@/lib/child-path";
import { PROGRESS_UPDATED_EVENT } from "@/lib/progress";
import { applySubjectRedo } from "@/lib/daily-verdict-client";

function DailySubjectCard({
  subject,
  done,
  index,
  log,
}: {
  subject: DailySubject;
  done: boolean;
  index: number;
  log: DailyDayLog | null;
}) {
  const pack = DAILY_CONTENT[subject];
  const theme = dailyTheme(subject);
  const uiStatus = getDailySubjectUiStatus(done, log, subject);
  const needsRedo = uiStatus === "redo";
  const onReview = uiStatus === "on_review";
  const showAsDone = isSubjectUiComplete(uiStatus);
  const canRestart = uiStatus === "not_started" && done;

  const statusLabel =
    uiStatus === "not_started"
      ? canRestart
        ? DAILY_SUBJECT_STATUS_LABEL.redo
        : `${index + 1} / 3`
      : DAILY_SUBJECT_STATUS_LABEL[uiStatus];

  const statusClass = needsRedo
    ? "bg-amber-100 text-amber-900"
    : onReview
      ? "bg-sky-100 text-sky-800"
      : showAsDone
        ? "bg-emerald-100 text-emerald-800"
        : `${theme.softBg} ${theme.accent}`;
  const inner = (
    <>
      <div className={`h-1.5 bg-gradient-to-r ${theme.gradient}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <span className={`text-4xl ${showAsDone ? "" : "transition group-hover:scale-110"}`}>
            {pack.emoji}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass}`}
          >
            {statusLabel}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-bold text-gray-900">{pack.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{pack.description}</p>
        {needsRedo && log?.subjects[subject]?.verdictComment ? (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
            {log.subjects[subject]?.verdictComment}
          </p>
        ) : null}
        {showAsDone ? (
          <p className="mt-4 text-sm font-medium text-emerald-700">Миссия выполнена 🏆</p>
        ) : onReview ? (
          <p className="mt-4 text-sm font-medium text-sky-700">Ждём проверку 🕐</p>
        ) : (
          <p
            className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${theme.accentMuted} group-hover:gap-2 transition-all`}
          >
            {needsRedo || canRestart ? "Исправить" : "Начать"}
            <span aria-hidden>→</span>
          </p>
        )}
      </div>
    </>
  );

  if (showAsDone) {
    return (
      <div
        className={`relative overflow-hidden rounded-card bg-white shadow-card ring-1 ring-emerald-200/80 ${theme.cardDone}`}
        aria-label={`${pack.title} — выполнено`}
      >
        {inner}
      </div>
    );
  }

  if (onReview) {
    return (
      <div
        className="relative overflow-hidden rounded-card bg-white shadow-card ring-1 ring-sky-200/80"
        aria-label={`${pack.title} — на проверке`}
      >
        {inner}
      </div>
    );
  }

  if (needsRedo || canRestart) {
    return (
      <Link
        href={`/tasks/daily/${subject}`}
        onClick={() => applySubjectRedo(subject, log?.date)}
        className={`group relative overflow-hidden rounded-card bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg ${theme.cardHover} ring-1 ${needsRedo ? "ring-amber-200/80" : "ring-black/5"}`}
      >
        {inner}
      </Link>
    );
  }

  return (
    <Link
      href={`/tasks/daily/${subject}`}
      className={`group relative overflow-hidden rounded-card bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg ${theme.cardHover} ring-1 ring-black/5`}
    >
      {inner}
    </Link>
  );
}

function DailyProgressPill({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 shadow-sm ring-1 ring-black/5 backdrop-blur-sm">
      <div className="relative h-10 w-10">
        <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke="#E4D4FF" strokeWidth="3" />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="#7C3AED"
            strokeWidth="3"
            strokeDasharray={`${pct * 0.94} 100`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-brand-purple">
          {done}/{total}
        </span>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800">Прогресс daily</p>
        <p className="text-xs text-gray-500">
          {done === total ? "Все предметы сданы!" : `Осталось ${total - done}`}
        </p>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [dailyState, setDailyState] = useState<ReturnType<typeof getDailyState> | null>(null);
  const [dailyLog, setDailyLog] = useState<DailyDayLog | null>(null);

  const refresh = useCallback(async () => {
    const p = loadProgress();
    setProgress(p);
    setDailyState(getDailyState(p.daily));
    await fetchDailyVerdict();
    setDailyLog(readDailyDayLog());
  }, []);

  useEffect(() => {
    refresh();
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener(CHILD_PATH_UPDATED_EVENT, refresh);
    window.addEventListener(PROGRESS_UPDATED_EVENT, refresh);
    window.addEventListener(DAILY_VERDICT_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener(CHILD_PATH_UPDATED_EVENT, refresh);
      window.removeEventListener(PROGRESS_UPDATED_EVENT, refresh);
      window.removeEventListener(DAILY_VERDICT_UPDATED_EVENT, refresh);
    };
  }, [refresh]);

  useEffect(() => {
    const waiting =
      dailyState?.isTodayDailyComplete &&
      dailyLog != null &&
      !isDayFullyApproved(dailyLog);
    if (!waiting) return;
    const id = window.setInterval(() => void refresh(), 15000);
    return () => window.clearInterval(id);
  }, [dailyState, dailyLog, refresh]);

  if (!progress || !dailyState) {
    return (
      <AppShell>
        <div className="rounded-card bg-white p-8 text-center shadow-card">Загрузка…</div>
      </AppShell>
    );
  }

  const { daily, showDailyBlock, showCelebration, isTodayDailyComplete } = dailyState;
  const programWeek = getProgramWeek(daily);
  const dailyDoneCount = DAILY_SUBJECTS.filter((s) => daily.today[s]).length;
  const allApproved = isDayFullyApproved(dailyLog);
  const waitingReview = isTodayDailyComplete && !allApproved;

  return (
    <AppShell>
      <Header />

      <DailyVerdictBanner
        log={dailyLog}
        allSubjectsDone={isTodayDailyComplete}
        onRedoStart={() => void refresh()}
      />

      {showCelebration && !waitingReview ? (
        <div className="mb-8 overflow-hidden rounded-card bg-gradient-to-br from-amber-50 to-lavender-100 p-6 shadow-card">
          <div className="flex flex-wrap items-start gap-4">
            <span className="text-5xl">🎉</span>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">{dailyState.celebrationMessage}</h2>
              <p className="mt-2 text-gray-600">{dailyState.celebrationSubtext}</p>
              {dailyState.isTodayDailyComplete && dailyState.todayStarsEarned > 0 ? (
                <p className="mt-3 text-sm font-medium text-amber-600">
                  +{dailyState.todayStarsEarned} ★ за сегодняшний daily
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {showDailyBlock || waitingReview ? (
        <section className="mb-8">
          <div className="mb-5 overflow-hidden rounded-card bg-gradient-to-br from-brand-purple via-violet-600 to-indigo-700 px-5 py-4 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0 text-white">
                <p className="text-sm font-medium text-white/75">📅 Задания на сегодня</p>
                <h2 className="mt-0.5 text-2xl font-bold">Daily · {PROGRAM_WEEK_LABELS[programWeek]}</h2>
                <p className="mt-1.5 text-base font-bold leading-snug sm:text-lg">
                  {DAILY_CATCHPHRASE_LINE1}{" "}
                  <span className="font-bold italic text-amber-200">{DAILY_CATCHPHRASE_LINE2}</span>
                </p>
                <p className="mt-1 text-xs text-white/80 sm:text-sm">{DAILY_CHILD_TAGLINE}</p>
              </div>
              <DailyProgressPill done={dailyDoneCount} total={DAILY_SUBJECTS.length} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {DAILY_SUBJECTS.map((subject, i) => (
              <DailySubjectCard
                key={subject}
                subject={subject}
                done={daily.today[subject]}
                index={i}
                log={dailyLog}
              />
            ))}
          </div>
        </section>
      ) : null}

      <TasksMyshMatBlock progress={progress} dailyState={dailyState} />
    </AppShell>
  );
}
