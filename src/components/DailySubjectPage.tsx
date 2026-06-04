"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DailyExerciseStep } from "@/components/daily/DailyExerciseStep";
import { DailyStepDots } from "@/components/daily/DailyStepDots";
import { dailyTheme } from "@/components/daily/daily-theme";
import { ProgressBar } from "@/components/ProgressBar";
import { PROGRAM_WEEK_LABELS, WEEKDAY_LABELS } from "@/data/daily-content";
import type { DailyExerciseResult } from "@/lib/daily-submission-log";
import {
  isSubjectTelegramSent,
  savePendingUpload,
  saveSubjectLog,
  sendDailySubjectToTelegram,
} from "@/lib/daily-submission-log";
import { getDailyDayIndex, workbookDayNumber } from "@/lib/daily-store";
import type { DailySubject } from "@/lib/daily";
import { getProgramWeek, isSubjectDoneToday } from "@/lib/daily";
import { readDailyDayLog } from "@/lib/daily-submission-log";
import {
  getDailySubjectUiStatus,
  subjectRequiresReview,
} from "@/lib/daily-subject-status";
import { applySubjectRedo } from "@/lib/daily-verdict-client";
import { completeDailySubject } from "@/lib/progress";
import { useProgress } from "@/lib/use-progress";
import { useDailyExercises, useDailySubjectPack } from "@/lib/use-daily-store";

interface DailySubjectPageProps {
  subject: DailySubject;
}

export function DailySubjectPage({ subject }: DailySubjectPageProps) {
  const router = useRouter();
  const progress = useProgress();
  const pack = useDailySubjectPack(subject);
  const theme = dailyTheme(subject);
  const dayIndex = getDailyDayIndex();
  const programWeek = getProgramWeek(progress.daily) as 0 | 1 | 2 | 3 | 4 | 5;
  const exercises = useDailyExercises(subject, programWeek, dayIndex);
  const [stepIndex, setStepIndex] = useState(0);
  const [exerciseResults, setExerciseResults] = useState<DailyExerciseResult[]>([]);
  const [sending, setSending] = useState(false);
  const finishStarted = useRef(false);
  const redoPrepared = useRef(false);

  const log = readDailyDayLog();
  const alreadyDone = isSubjectDoneToday(progress.daily, subject);
  const requiresReview = subjectRequiresReview(subject, exercises);
  const uiStatus = getDailySubjectUiStatus(alreadyDone, log, subject, requiresReview);
  const needsRestart = alreadyDone && !log?.subjects[subject];

  useEffect(() => {
    if (uiStatus === "redo" && !redoPrepared.current) {
      redoPrepared.current = true;
      applySubjectRedo(subject, log?.date);
      return;
    }
    if (needsRestart && !redoPrepared.current) {
      redoPrepared.current = true;
      applySubjectRedo(subject, log?.date);
    }
  }, [uiStatus, needsRestart, subject, log?.date]);

  useEffect(() => {
    if (alreadyDone && uiStatus !== "redo" && !needsRestart) {
      router.replace("/tasks");
    }
  }, [alreadyDone, uiStatus, needsRestart, router]);

  const progressPct = useMemo(() => {
    if (exercises.length === 0) return 0;
    return Math.round(((stepIndex + 1) / exercises.length) * 100);
  }, [stepIndex, exercises.length]);

  const workbookDay = workbookDayNumber(programWeek, dayIndex);

  if (alreadyDone && uiStatus !== "redo" && !needsRestart) {
    const message =
      uiStatus === "on_review"
        ? "Задание на проверке — ждём ответ родителя"
        : "Эта миссия уже выполнена сегодня";

    return (
      <AppShell>
        <div className="mx-auto max-w-lg rounded-card bg-white p-8 text-center shadow-card text-sm text-gray-500">
          {message}
        </div>
      </AppShell>
    );
  }

  const finish = async (results: DailyExerciseResult[]) => {
    if (finishStarted.current) return;
    finishStarted.current = true;

    const log = saveSubjectLog(subject, results);
    completeDailySubject(subject);

    if (!isSubjectTelegramSent(log, subject)) {
      setSending(true);
      await sendDailySubjectToTelegram(log, subject);
      setSending(false);
    }

    router.push("/tasks");
  };

  const current = exercises[stepIndex];

  const handleStepComplete = (result: {
    userAnswer: string;
    correct: boolean;
    upload?: { fileName: string; mimeType: string; dataUrl: string };
  }) => {
    if (!current) return;

    if (result.upload) {
      savePendingUpload({
        subject,
        exerciseId: current.id,
        fileName: result.upload.fileName,
        mimeType: result.upload.mimeType,
        dataUrl: result.upload.dataUrl,
      });
    }

    const entry: DailyExerciseResult = {
      exerciseId: current.id,
      type: current.type,
      question: current.question,
      userAnswer: result.userAnswer,
      correct: result.correct,
      passagePreview: current.passage,
      upload: result.upload
        ? { fileName: result.upload.fileName, mimeType: result.upload.mimeType }
        : undefined,
    };

    const nextResults = [...exerciseResults, entry];
    setExerciseResults(nextResults);

    if (stepIndex >= exercises.length - 1) {
      void finish(nextResults);
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  return (
    <AppShell>
      <Link
        href="/tasks"
        className={`mb-5 inline-flex items-center gap-1.5 rounded-full ${theme.softBg} px-4 py-2 text-sm font-medium ${theme.accent} transition hover:opacity-80`}
      >
        ← Задачи на сегодня
      </Link>

      <div className="mx-auto max-w-lg overflow-hidden rounded-card bg-white shadow-card">
        {/* Шапка предмета */}
        <div className={`bg-gradient-to-br ${theme.gradient} px-6 pb-8 pt-6 text-white`}>
          <div className="mb-3 flex items-start justify-between gap-3">
            <span className="text-5xl drop-shadow-sm">{pack.emoji}</span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              № {workbookDay} / 30
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{pack.title}</h1>
          <p className="mt-1 text-sm text-white/85">{pack.description}</p>
          <p className="mt-3 text-xs font-medium text-white/70">
            {PROGRAM_WEEK_LABELS[programWeek]} · {WEEKDAY_LABELS[dayIndex]}
          </p>

          {exercises.length > 0 ? (
            <div className="mt-6">
              <ProgressBar
                value={progressPct}
                label={`${stepIndex + 1} из ${exercises.length}`}
                color="bg-white"
                variant="on-dark"
              />
              <div className="mt-4">
                <DailyStepDots total={exercises.length} current={stepIndex} theme={theme} />
              </div>
            </div>
          ) : null}
        </div>

        {/* Контент */}
        <div className="px-6 py-7">
          {sending ? (
            <div className="mb-6 flex items-center justify-center gap-3 rounded-xl bg-lavender-50 py-4 text-sm text-gray-600">
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-brand-purple border-t-transparent" />
              Отправляем в Telegram…
            </div>
          ) : null}

          {exercises.length === 0 ? (
            <div className="text-center">
              <p className="mb-5 text-sm text-gray-500">На этот день упражнений пока нет.</p>
              <button
                type="button"
                onClick={() => void finish(exerciseResults)}
                className={`rounded-xl px-6 py-2.5 text-sm font-medium text-white ${theme.button} ${theme.buttonHover}`}
              >
                Отметить выполненным
              </button>
            </div>
          ) : (
            <>
              {current?.hint && subject === "reading" && stepIndex === 0 ? (
                <div className="mb-5 flex gap-2 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <span className="shrink-0">✍️</span>
                  <p>{current.hint}</p>
                </div>
              ) : null}
              {current ? (
                <DailyExerciseStep
                  key={current.id}
                  theme={theme}
                  exercise={current}
                  index={stepIndex}
                  total={exercises.length}
                  onComplete={handleStepComplete}
                />
              ) : null}
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
