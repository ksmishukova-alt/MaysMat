"use client";

import { useEffect, useState } from "react";
import type { UnluckyModel } from "@/data/dirichlet/unlucky/types";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";

interface UnluckyExplainStepProps {
  stepId?: string;
  model: UnluckyModel;
  maxWithoutSuccess: number;
  onComplete: () => void;
}

export function UnluckyExplainStep({
  stepId,
  model,
  maxWithoutSuccess,
  onComplete,
}: UnluckyExplainStepProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const itemGen = model.itemLabelGenitive ?? "предметов";

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

  const cards =
    model.variant === "deduction"
      ? model.explanation
      : [
          `Если взять только ${maxWithoutSuccess} ${itemGen}, может случиться самый неудачный расклад.`,
          "В нём нужного результата ещё нет.",
          `Поэтому ${maxWithoutSuccess} ${itemGen} недостаточно.`,
          `А вот ${model.answer} ${itemGen} уже гарантируют результат.`,
        ];

  const toggle = (index: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
    setError("");
  };

  const check = () => {
    if (selected.size !== cards.length) {
      setError("Выбери все части объяснения по порядку рассуждения.");
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return <StepSuccess message="Отлично! Ты объяснил, почему меньше не хватает." />;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-600">
        Собери объяснение: почему {maxWithoutSuccess} недостаточно, а {model.answer} — достаточно.
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
        onClick={check}
        className="rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-medium text-white"
      >
        Объяснение готово
      </button>
    </div>
  );
}
