"use client";

import Image from "next/image";

/** Нейтральный переход между этапами — без баллов и оценок */
export function DiagnosticTransitionScreen({
  testId,
  message,
  buttonLabel,
  onContinue,
  continueTestId,
}: {
  testId: string;
  message: string;
  buttonLabel: string;
  onContinue: () => void;
  continueTestId?: string;
}) {
  return (
    <div
      data-testid={testId}
      className="relative overflow-hidden rounded-2xl border-2 border-lavender-200 bg-gradient-to-b from-lavender-50 to-white p-6 shadow-card sm:p-8"
    >
      <div className="pointer-events-none absolute -right-4 -top-2 opacity-90" aria-hidden>
        <Image
          src="/entry-diagnostic/pojmat/myshmat.png"
          alt=""
          width={88}
          height={88}
          className="drop-shadow-md"
        />
      </div>
      <p className="max-w-md text-lg font-semibold leading-snug text-gray-900 sm:text-xl">{message}</p>
      <button
        type="button"
        data-testid={continueTestId ?? `${testId}-continue`}
        onClick={onContinue}
        className="mt-8 min-h-12 rounded-2xl bg-brand-purple px-8 py-3 text-sm font-semibold text-white shadow-sm"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
