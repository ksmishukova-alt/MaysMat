"use client";



import Link from "next/link";

import { useCallback, useEffect, useState } from "react";

import { dailyTheme } from "@/components/daily/daily-theme";

import {

  DAILY_CATCHPHRASE_LINE1,

  DAILY_CATCHPHRASE_LINE2,

  DAILY_CHILD_TAGLINE,

  DAILY_CONTENT,

  DAILY_SUBJECTS,

  PROGRAM_WEEK_LABELS,

} from "@/data/daily-content";

import type { DailyState } from "@/lib/daily";

import type { DailySubject } from "@/lib/daily";

import {

  DAILY_VERDICT_UPDATED_EVENT,

  fetchDailyVerdict,

  readDailyDayLog,

  type DailyDayLog,

} from "@/lib/daily-submission-log";

import { getDailySubjectUiStatus } from "@/lib/daily-subject-status";
import { applySubjectRedo } from "@/lib/daily-verdict-client";



function SubjectChip({

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
  const onReview = uiStatus === "on_review";
  const approved = uiStatus === "approved";
  const needsRedo = uiStatus === "redo";
  const canRestart = uiStatus === "not_started" && done;

  const subtitle = !done
    ? `${index + 1} из 3 · обязательно`
    : onReview
      ? "На проверке"
      : needsRedo || canRestart
        ? "Переделать"
        : "✓ готово";



  const inner = (

    <div

      className={`flex items-center gap-3 rounded-xl p-3 transition ${

        approved

          ? "bg-emerald-50 ring-1 ring-emerald-200"

          : onReview

            ? "bg-sky-50 ring-1 ring-sky-200"

            : needsRedo

              ? "bg-amber-50 ring-1 ring-amber-200"

              : `bg-white ring-1 ring-black/5 hover:-translate-y-0.5 hover:shadow-md ${theme.cardHover}`

      }`}

    >

      <span className="text-2xl">{pack.emoji}</span>

      <div className="min-w-0 flex-1">

        <p className="truncate text-sm font-bold text-gray-900">{pack.title}</p>

        <p className="text-xs text-gray-500">{subtitle}</p>

      </div>

      {!done || needsRedo ? (

        <span className={`text-sm font-semibold ${theme.accentMuted}`}>→</span>

      ) : onReview ? (

        <span className="text-sm text-sky-600">🕐</span>

      ) : (

        <span className="text-sm text-emerald-600">✓</span>

      )}

    </div>

  );



  if (approved || onReview) return inner;

  return (
    <Link
      href={`/tasks/daily/${subject}`}
      className="block"
      onClick={needsRedo ? () => applySubjectRedo(subject, log?.date) : undefined}
    >
      {inner}
    </Link>
  );
}



interface HomeDailyPriorityBlockProps {

  state: DailyState;

}



export function HomeDailyPriorityBlock({ state }: HomeDailyPriorityBlockProps) {

  const { daily } = state;

  const programWeek = Math.min(5, Math.max(0, daily.programWeek));

  const doneCount = DAILY_SUBJECTS.filter((s) => daily.today[s]).length;

  const total = DAILY_SUBJECTS.length;

  const pct = Math.round((doneCount / total) * 100);

  const [dailyLog, setDailyLog] = useState<DailyDayLog | null>(null);



  const refreshLog = useCallback(async () => {

    await fetchDailyVerdict();

    setDailyLog(readDailyDayLog());

  }, []);



  useEffect(() => {

    void refreshLog();

    window.addEventListener(DAILY_VERDICT_UPDATED_EVENT, refreshLog);

    window.addEventListener("focus", refreshLog);

    return () => {

      window.removeEventListener(DAILY_VERDICT_UPDATED_EVENT, refreshLog);

      window.removeEventListener("focus", refreshLog);

    };

  }, [refreshLog]);



  return (

    <section className="mb-6">

      <div className="mb-4 overflow-hidden rounded-card border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-5 shadow-card">

        <div className="flex flex-wrap items-start justify-between gap-4">

          <div className="min-w-0 flex-1">

            <p className="text-xs font-bold uppercase tracking-wide text-amber-700">

              🎯 Главная цель на сегодня

            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">

              Daily · {PROGRAM_WEEK_LABELS[programWeek]}

            </h2>

            <p className="mt-2 text-sm font-semibold text-gray-800">

              {DAILY_CATCHPHRASE_LINE1}{" "}

              <span className="italic text-brand-purple">{DAILY_CATCHPHRASE_LINE2}</span>

            </p>

            <p className="mt-1 text-xs text-gray-600">{DAILY_CHILD_TAGLINE}</p>

            <p className="mt-3 rounded-lg bg-white/80 px-3 py-2 text-sm font-medium text-amber-900 ring-1 ring-amber-200">

              ⚠️ Сначала закрой daily — чтение, русский и мат. Это обязательно в учебные дни!

            </p>

          </div>

          <div className="flex flex-col items-center gap-1">

            <div className="relative h-14 w-14">

              <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">

                <circle cx="18" cy="18" r="15" fill="none" stroke="#FDE68A" strokeWidth="3" />

                <circle

                  cx="18"

                  cy="18"

                  r="15"

                  fill="none"

                  stroke="#D97706"

                  strokeWidth="3"

                  strokeDasharray={`${pct * 0.94} 100`}

                  strokeLinecap="round"

                />

              </svg>

              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-amber-800">

                {doneCount}/{total}

              </span>

            </div>

            <span className="text-xs text-gray-500">предметов</span>

          </div>

        </div>

      </div>

      <div className="grid gap-2 sm:grid-cols-3">

        {DAILY_SUBJECTS.map((subject, i) => (

          <SubjectChip

            key={subject}

            subject={subject}

            done={daily.today[subject]}

            index={i}

            log={dailyLog}

          />

        ))}

      </div>

    </section>

  );

}


