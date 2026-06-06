"use client";

import { useEffect, useState } from "react";
import type { RemaindersModel } from "@/data/dirichlet/remainders/types";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";

interface RemaindersHousesStepProps {
  stepId?: string;
  model: RemaindersModel;
  onComplete: () => void;
}

export function RemaindersHousesStep({ stepId, model, onComplete }: RemaindersHousesStepProps) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    setConfirmed(false);
  }, [stepId]);

  useEffect(() => {
    if (!confirmed) return;
    const timer = window.setTimeout(onComplete, STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [confirmed, onComplete]);

  const m = model.housesCount;
  const compact = model.compactHouses ?? m >= 20;

  if (confirmed) {
    return <StepSuccess message={`Домиков для остатков: ${m} — от 0 до ${m - 1}.`} />;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-600">
        При делении на {model.modulus} остаток может быть только одним из {m} значений.
      </p>

      {compact ? (
        <div className="mb-6 rounded-xl border-2 border-sky-200 bg-sky-50 p-4">
          <p className="text-sm font-medium text-sky-900">Домики остатков:</p>
          <p className="mt-2 font-mono text-lg text-sky-800">
            0, 1, 2, …, {m - 1}
          </p>
          <p className="mt-3 text-sm text-sky-700">Всего домиков: {m}</p>
        </div>
      ) : (
        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-gray-700">Домики остатков (0 … {m - 1}):</p>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: m }, (_, i) => (
              <div
                key={i}
                className="flex h-12 w-12 flex-col items-center justify-center rounded-lg border-2 border-sky-300 bg-sky-50 text-sm font-medium text-sky-900"
                title={`Остаток ${i}`}
              >
                <span className="text-[10px] text-sky-600">🏠</span>
                {i}
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-gray-500">Всего домиков: {m}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setConfirmed(true)}
        className="rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-medium text-white"
      >
        Понятно, домики готовы
      </button>
    </div>
  );
}
