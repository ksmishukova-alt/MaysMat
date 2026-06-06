"use client";

import { useEffect, useState } from "react";
import type { ScoreMode } from "@/data/method-rules/types";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";

interface ScoreQuestionCheckStepProps {
  stepId?: string;
  questionAsks: string;
  questionCheckNote?: string;
  scoreMode?: ScoreMode;
  onComplete: () => void;
}

/** Шаг «Проверь, что именно спрашивают» для паттерна 4 */
export function ScoreQuestionCheckStep({
  stepId,
  questionAsks,
  questionCheckNote,
  scoreMode,
  onComplete,
}: ScoreQuestionCheckStepProps) {
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
    return <StepSuccess message="Верно! Теперь запиши ответ так, как спрашивают в задаче." />;
  }

  return (
    <div data-testid="score-question-check-step">
      <p className="mb-4 text-sm font-medium text-gray-800">Проверь, что именно спрашивают в задаче</p>
      <div className="mb-6 rounded-xl border-2 border-sky-200 bg-sky-50 px-4 py-4 text-sm leading-relaxed text-sky-950">
        <p className="font-medium">Нужно найти:</p>
        <p className="mt-2" data-testid="score-question-asks">
          {questionAsks}.
        </p>
        {questionCheckNote ? (
          <p className="mt-3 font-medium text-amber-900" data-testid="score-question-hint">
            {questionCheckNote}
          </p>
        ) : null}
        {scoreMode === "plus_minus" ? (
          <p className="mt-3 text-sky-900">
            После замены найди количество правильных ответов — именно это и спрашивают.
          </p>
        ) : null}
        {scoreMode === "match_total" ? (
          <p className="mt-3 text-sky-900">
            После подсчёта разницы найди число ничьих — именно это и спрашивают.
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => setConfirmed(true)}
        className="rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-medium text-white"
      >
        Понятно, записываю ответ
      </button>
    </div>
  );
}
