"use client";

import type { ReactNode } from "react";

interface TaskScreenShellProps {
  phaseTitle?: string;
  phaseIndex?: number;
  phaseCount?: number;
  showPhaseHeader: boolean;
  stepTitle?: string;
  subStepLabel?: string;
  hint?: string;
  showStepTitle: boolean;
  children: ReactNode;
}

/** Вложенные карточки: фаза → шаг (по архитектуре «Головы и ноги») */
export function TaskScreenShell({
  phaseTitle,
  phaseIndex,
  phaseCount,
  showPhaseHeader,
  stepTitle,
  subStepLabel,
  hint,
  showStepTitle,
  children,
}: TaskScreenShellProps) {
  return (
    <div className="space-y-3">
      {showPhaseHeader && phaseTitle ? (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-lavender-200 bg-lavender-50/80 px-4 py-2.5">
          <span className="text-sm font-semibold text-brand-purple">{phaseTitle}</span>
          {phaseIndex != null && phaseCount != null ? (
            <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-gray-500 shadow-sm">
              Этап {phaseIndex} из {phaseCount}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="rounded-2xl border border-lavender-100 bg-lavender-50/40 p-1.5 shadow-sm">
        <div className="rounded-xl bg-white p-6 shadow-card">
          {subStepLabel ? (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-purple/80">
              {subStepLabel}
            </p>
          ) : null}
          {showStepTitle && stepTitle ? (
            <h3 className="mb-4 text-lg font-semibold text-gray-900">{stepTitle}</h3>
          ) : null}
          {hint ? <p className="mb-4 text-sm text-gray-500">{hint}</p> : null}
          {children}
        </div>
      </div>
    </div>
  );
}
