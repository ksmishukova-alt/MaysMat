"use client";

import { useEffect, useState } from "react";
import { STEP_SUCCESS_MS } from "./step-advance";
import { StepSuccess } from "./StepSuccess";

interface ReadConditionStepProps {
  stepId?: string;
  title: string;
  condition: string;
  onComplete: () => void;
}

export function ReadConditionStep({
  stepId,
  title,
  condition,
  onComplete,
}: ReadConditionStepProps) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    setConfirmed(false);
  }, [stepId]);

  useEffect(() => {
    if (!confirmed) return;
    const timer = window.setTimeout(onComplete, STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [confirmed, onComplete]);

  if (confirmed) {
    return <StepSuccess message="✅ Прочитал! Переходим к решению." />;
  }

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Прочитай задачу</h3>
      <p className="mb-4 text-sm text-gray-500">
        Прочитай условие целиком. На следующих шагах текст останется сверху — можно вернуться к
        нему в любой момент.
      </p>
      <div className="mb-6 rounded-xl border border-lavender-200 bg-white p-6 shadow-sm">
        <h4 className="mb-3 text-lg font-semibold text-gray-900">{title}</h4>
        <p className="whitespace-pre-line text-base leading-relaxed text-gray-700">{condition}</p>
      </div>
      <button
        type="button"
        onClick={() => setConfirmed(true)}
        className="rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-medium text-white"
      >
        Прочитал, дальше
      </button>
    </div>
  );
}
