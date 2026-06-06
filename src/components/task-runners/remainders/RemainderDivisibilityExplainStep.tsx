"use client";

import { useEffect, useState } from "react";
import type { RemaindersModel } from "@/data/dirichlet/remainders/types";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";

interface RemainderDivisibilityExplainStepProps {
  stepId?: string;
  model: RemaindersModel;
  onComplete: () => void;
}

export function RemainderDivisibilityExplainStep({
  stepId,
  model,
  onComplete,
}: RemainderDivisibilityExplainStepProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const m = model.modulus;
  const cards = [
    `Если два числа попали в один домик, значит, у них одинаковый остаток при делении на ${m}.`,
    `Если у двух чисел одинаковый остаток при делении на ${m}, то их разность делится на ${m}.`,
    `Значит, среди данных чисел можно выбрать два, ${model.targetRelation}.`,
  ];

  useEffect(() => {
    setSelected(new Set());
    setSuccess(false);
    setError("");
  }, [stepId]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(onComplete, STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [success, onComplete]);

  const toggle = (index: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
    setError("");
  };

  if (success) {
    return <StepSuccess message="Отлично! Ты связал столкновение в домиках с делимостью разности." />;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-600">
        Собери объяснение: почему столкновение в домиках решает задачу.
      </p>
      <div className="mb-4 space-y-2">
        {cards.map((text, index) => {
          const on = selected.has(index);
          return (
            <button
              key={text}
              type="button"
              onClick={() => toggle(index)}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                on
                  ? "border-brand-purple bg-lavender-50 text-gray-900"
                  : "border-gray-200 bg-white text-gray-700 hover:border-lavender-200"
              }`}
            >
              {on ? "✓ " : ""}
              {text}
            </button>
          );
        })}
      </div>
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      <button
        type="button"
        onClick={() => {
          if (selected.size !== cards.length) {
            setError("Выбери все три части объяснения.");
            return;
          }
          setSuccess(true);
        }}
        className="rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-medium text-white"
      >
        Объяснение готово
      </button>
    </div>
  );
}
