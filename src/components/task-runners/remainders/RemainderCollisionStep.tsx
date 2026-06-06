"use client";

import { useEffect, useState } from "react";
import type { RemaindersModel } from "@/data/dirichlet/remainders/types";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";

interface RemainderCollisionStepProps {
  stepId?: string;
  model: RemaindersModel;
  onComplete: () => void;
}

export function RemainderCollisionStep({ stepId, model, onComplete }: RemainderCollisionStepProps) {
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
    return (
      <StepSuccess message="Верно! Два числа окажутся в одном домике — с одинаковым остатком." />
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-600">
        Сравни количество предметов и домиков. Что следует из принципа Дирихле?
      </p>

      <div className="mb-6 rounded-xl border-2 border-amber-200 bg-amber-50 p-4 text-center">
        <p className="text-2xl font-bold text-amber-900">
          {model.objectsCount} &gt; {model.housesCount}
        </p>
        <p className="mt-2 text-sm text-amber-800">
          {model.objectsCount} {model.objectsLabel} · {model.housesCount} {model.housesLabel}
        </p>
      </div>

      <p className="mb-4 text-sm font-medium">Какой вывод?</p>
      <button
        type="button"
        onClick={() => setConfirmed(true)}
        className="mb-3 block w-full rounded-xl border border-brand-purple bg-lavender-50 px-4 py-3 text-left text-sm hover:bg-lavender-100"
      >
        Чисел больше, чем домиков. Значит, два числа попадут в один и тот же домик.
      </button>
      <button
        type="button"
        onClick={() => setError("Если предметов больше, чем клеток — в одной клетке окажется минимум два.")}
        className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-left text-sm text-gray-600"
      >
        Каждое число попадёт в свой домик
      </button>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
