"use client";

import { useEffect, useState } from "react";
import type { HeadsLegsScoreRuleInstance } from "@/data/method-rules/types";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";

interface MatchTotalStepProps {
  stepId?: string;
  instance: HeadsLegsScoreRuleInstance;
  onComplete: () => void;
}

/** Шаг «сумма очков за матч» для 4.4 (match_total) */
export function MatchTotalStep({ stepId, instance, onComplete }: MatchTotalStepProps) {
  const [confirmed, setConfirmed] = useState(false);

  const decisive = instance.decisiveMatchTotal ?? 5;
  const draw = instance.drawMatchTotal ?? 4;

  useEffect(() => {
    setConfirmed(false);
  }, [stepId]);

  useEffect(() => {
    if (!confirmed) return;
    const timer = window.setTimeout(onComplete, STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [confirmed, onComplete]);

  if (confirmed) {
    return <StepSuccess message="Верно! Считаем ничьи через общую сумму очков." />;
  }

  return (
    <div data-testid="match-total-step">
      <p className="mb-4 text-sm font-medium text-gray-800">Сколько очков за матч вместе?</p>
      <div className="mb-6 space-y-3 rounded-xl border-2 border-sky-200 bg-sky-50 px-4 py-4 text-sm leading-relaxed text-sky-950">
        <p>
          Победа / поражение:{" "}
          <span data-testid="match-decisive-formula">4 + 1 = {decisive}</span> очков на матч.
        </p>
        <p>
          Ничья: <span data-testid="match-draw-formula">2 + 2 = {draw}</span> очка на матч.
        </p>
        <p className="text-sky-900">
          Мы сравниваем не очки одной команды, а{" "}
          <strong>общую сумму очков обеих команд за матч</strong>.
        </p>
        <p>
          Каждая ничья уменьшает общую сумму на{" "}
          <span data-testid="match-replacement-step">{decisive - draw}</span> очко.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setConfirmed(true)}
        className="rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-medium text-white"
      >
        Понятно, решаю
      </button>
    </div>
  );
}
