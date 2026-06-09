"use client";

import { useState, type ReactNode } from "react";

/** Упрощённая оболочка диагностики — без методического скелета в UI */
export function DiagnosticScreenShell({
  taskLabel,
  blockTitle,
  conditionText,
  children,
}: {
  taskLabel: string;
  blockTitle: string;
  /** Условие задачи — показывается по кнопке на шагах после чтения */
  conditionText?: string;
  children: ReactNode;
}) {
  const [showCondition, setShowCondition] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-1">
        <p className="text-sm font-medium text-gray-700">{taskLabel}</p>
        <p className="text-xs text-gray-400">{blockTitle}</p>
      </div>

      <div className="rounded-2xl border border-lavender-100 bg-lavender-50/40 p-1.5 shadow-sm">
        <div className="rounded-xl bg-white p-6 shadow-card">
          {conditionText ? (
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setShowCondition((v) => !v)}
                className="text-sm font-medium text-brand-purple underline-offset-2 hover:underline"
              >
                {showCondition ? "Скрыть условие" : "Показать условие"}
              </button>
              {showCondition ? (
                <p className="mt-3 rounded-xl border border-lavender-200 bg-lavender-50/80 p-4 text-base leading-relaxed text-gray-800">
                  {conditionText}
                </p>
              ) : null}
            </div>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}
