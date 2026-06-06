"use client";

import { useEffect, useState } from "react";
import type { HeadsLegsValueAnswerTransform } from "@/data/method-rules/types";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";

interface HeadsLegsQuestionCheckStepProps {
  stepId?: string;
  questionAsks: string;
  answerTransform?: HeadsLegsValueAnswerTransform;
  onComplete: () => void;
}

/** Шаг «Проверь, что именно спрашивают в задаче» (паттерн 2) */
export function HeadsLegsQuestionCheckStep({
  stepId,
  questionAsks,
  answerTransform,
  onComplete,
}: HeadsLegsQuestionCheckStepProps) {
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
    <div>
      <p className="mb-4 text-sm font-medium text-gray-800">Проверь, что именно спрашивают в задаче</p>
      <div className="mb-6 rounded-xl border-2 border-sky-200 bg-sky-50 px-4 py-4 text-sm leading-relaxed text-sky-950">
        <p className="font-medium">Нужно найти:</p>
        <p className="mt-2">{questionAsks}.</p>
        {answerTransform?.type === "multiply_found_objects" ? (
          <p className="mt-3 text-sky-900">
            После подсчёта {answerTransform.foundObjectLabel ?? "объектов"} умножь на{" "}
            {answerTransform.multiplier}, чтобы получить {answerTransform.resultLabel}.
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
