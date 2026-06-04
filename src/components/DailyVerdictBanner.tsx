"use client";

import Link from "next/link";
import { DAILY_SUBJECTS } from "@/data/daily-content";
import type { DailySubject } from "@/lib/daily";
import type { DailyDayLog } from "@/lib/daily-submission-log";
import {
  getSubjectVerdict,
  isDayFullyApproved,
  isSubjectApproved,
  isSubjectRedo,
} from "@/lib/daily-submission-log";
import { applySubjectRedo } from "@/lib/daily-verdict-client";

const SUBJECT_LABEL: Record<DailySubject, string> = {
  reading: "Чтение",
  russian: "Русский",
  math: "Математика",
};

interface DailyVerdictBannerProps {
  log: DailyDayLog | null;
  allSubjectsDone: boolean;
  onRedoStart?: () => void;
}

export function DailyVerdictBanner({ log, allSubjectsDone, onRedoStart }: DailyVerdictBannerProps) {
  if (!log) return null;

  const redoSubjects = DAILY_SUBJECTS.filter((s) => isSubjectRedo(log, s));
  const pendingSubjects = DAILY_SUBJECTS.filter(
    (s) => log.subjects[s] && getSubjectVerdict(log, s) === "pending",
  );
  const approvedCount = DAILY_SUBJECTS.filter((s) => isSubjectApproved(log, s)).length;

  if (redoSubjects.length > 0) {
    return (
      <BannerShell
        icon="🔄"
        title="Нужно переделать часть daily"
        gradient="from-amber-400 to-orange-500"
        bg="bg-amber-50/90"
        border="border-amber-200"
      >
        <div className="space-y-4">
          {redoSubjects.map((subject) => {
            const comment = log.subjects[subject]?.verdictComment;
            return (
              <div
                key={subject}
                className="rounded-xl border border-amber-200/80 bg-white px-4 py-3"
              >
                <p className="font-semibold text-amber-950">{SUBJECT_LABEL[subject]}</p>
                {comment ? (
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-amber-900">
                    {comment}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-amber-800/80">Пройди предмет ещё раз.</p>
                )}
                {allSubjectsDone || log.subjects[subject] ? (
                  <button
                    type="button"
                    onClick={() => {
                      applySubjectRedo(subject, log.date);
                      onRedoStart?.();
                    }}
                    className="mt-3 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                  >
                    Переделать {SUBJECT_LABEL[subject].toLowerCase()}
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
        <SubjectLinks className="mt-4" />
      </BannerShell>
    );
  }

  if (!allSubjectsDone) return null;

  if (isDayFullyApproved(log)) {
    return (
      <BannerShell
        icon="✅"
        title="Daily зачтён!"
        gradient="from-emerald-400 to-teal-500"
        bg="bg-emerald-50/90"
        border="border-emerald-200"
      >
        <p className="mt-1 text-sm text-emerald-900/80">
          Все три предмета проверены — можно идти дальше по маршруту.
        </p>
      </BannerShell>
    );
  }

  if (pendingSubjects.length > 0) {
    return (
      <BannerShell
        icon="⏳"
        title="Daily на проверке"
        gradient="from-sky-400 to-blue-500"
        bg="bg-sky-50/90"
        border="border-sky-200"
      >
        <p className="mt-1 text-sm text-sky-900/80">
          Ждём проверку по предметам:{" "}
          {pendingSubjects.map((s) => SUBJECT_LABEL[s]).join(", ")}.
          {approvedCount > 0 ? ` Зачтено: ${approvedCount} из 3.` : ""}
        </p>
      </BannerShell>
    );
  }

  return null;
}

function BannerShell({
  icon,
  title,
  gradient,
  bg,
  border,
  children,
}: {
  icon: string;
  title: string;
  gradient: string;
  bg: string;
  border: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`mb-6 overflow-hidden rounded-card border shadow-card ${border} ${bg}`}>
      <div className={`bg-gradient-to-r ${gradient} px-5 py-3`}>
        <p className="flex items-center gap-2 font-bold text-white">
          <span className="text-xl">{icon}</span>
          {title}
        </p>
      </div>
      {children ? <div className="px-5 py-4">{children}</div> : null}
    </div>
  );
}

function SubjectLinks({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs text-gray-600 ${className}`}>
      Предметы:{" "}
      <Link href="/tasks/daily/reading" className="font-medium text-sky-700 hover:underline">
        чтение
      </Link>
      {" · "}
      <Link href="/tasks/daily/russian" className="font-medium text-rose-700 hover:underline">
        русский
      </Link>
      {" · "}
      <Link href="/tasks/daily/math" className="font-medium text-emerald-700 hover:underline">
        математика
      </Link>
    </p>
  );
}
