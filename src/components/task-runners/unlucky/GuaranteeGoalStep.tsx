"use client";

import { useEffect, useState } from "react";
import type { UnluckyModel } from "@/data/dirichlet/unlucky/types";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";

interface GuaranteeGoalStepProps {
  stepId?: string;
  model: UnluckyModel;
  onComplete: () => void;
}

export function GuaranteeGoalStep({ stepId, model, onComplete }: GuaranteeGoalStepProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setConfirmed(false);
    setError("");
  }, [stepId]);

  useEffect(() => {
    if (!confirmed) return;
    const timer = window.setTimeout(onComplete, STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [confirmed, onComplete]);

  if (confirmed) {
    return <StepSuccess message="Верно! Это то, что нужно гарантировать." />;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-600">
        Прочитай условие ещё раз и подтверди, что мы ищем именно это.
      </p>
      <div className="mb-6 rounded-xl border-2 border-lavender-200 bg-lavender-50 p-4 text-base leading-relaxed">
        {model.goalPhrase}
      </div>
      <p className="mb-4 text-sm font-medium">Это правильная цель?</p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setConfirmed(true)}
          className="rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Да, гарантировать: {model.goal}
        </button>
        <button
          type="button"
          onClick={() => setError("Вернись к условию: что именно должно обязательно случиться?")}
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Нет, перечитаю
        </button>
      </div>
      {error ? <p className="mt-3 text-sm text-amber-700">{error}</p> : null}
    </div>
  );
}
