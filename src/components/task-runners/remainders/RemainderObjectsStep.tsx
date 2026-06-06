"use client";

import { useEffect, useState } from "react";
import type { RemaindersModel } from "@/data/dirichlet/remainders/types";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";

interface RemainderObjectsStepProps {
  stepId?: string;
  model: RemaindersModel;
  onComplete: () => void;
}

export function RemainderObjectsStep({ stepId, model, onComplete }: RemainderObjectsStepProps) {
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
      <StepSuccess
        message={`Раскладываем ${model.objectsCount} ${model.objectsLabel} по ${model.housesCount} ${model.housesLabel}.`}
      />
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-600">Что раскладываем по домикам?</p>

      <div className="mb-6 space-y-3">
        <div className="rounded-xl border border-lavender-200 bg-lavender-50 px-4 py-3 text-sm">
          <span className="font-medium">Предметы:</span> {model.objectsCount} {model.objectsLabel}
        </div>
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm">
          <span className="font-medium">Домики:</span> {model.housesCount} {model.housesLabel} (0 …{" "}
          {model.housesCount - 1})
        </div>
      </div>

      <p className="mb-4 text-sm font-medium">Это правильная модель для задачи?</p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setConfirmed(true)}
          className="rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-medium text-white"
        >
          Да, раскладываем {model.objectsCount} {model.objectsLabel}
        </button>
        <button
          type="button"
          onClick={() =>
            setError("Вернись к условию: сколько чисел и на сколько остатков мы смотрим?")
          }
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600"
        >
          Перечитаю условие
        </button>
      </div>
      {error ? <p className="mt-3 text-sm text-amber-700">{error}</p> : null}
    </div>
  );
}
