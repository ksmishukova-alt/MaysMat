"use client";

import { useEffect, useMemo, useState } from "react";
import type { UnluckyModel } from "@/data/dirichlet/unlucky/types";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";

interface WorstCaseBuildStepProps {
  stepId?: string;
  model: UnluckyModel;
  onComplete: (maxWithoutSuccess: number) => void;
}

export function WorstCaseBuildStep({ stepId, model, onComplete }: WorstCaseBuildStepProps) {
  const initialCounts = useMemo(
    () => Object.fromEntries(model.categories.map((c) => [c.id, c.maxInWorstCase])),
    [model.categories],
  );
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCounts(initialCounts);
    setSuccess(false);
    setError("");
  }, [stepId, initialCounts]);

  const total = model.categories.reduce((sum, c) => sum + (counts[c.id] ?? 0), 0);
  const itemGen = model.itemLabelGenitive ?? "предметов";

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => onComplete(model.maxWithoutSuccess), STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [success, onComplete, model.maxWithoutSuccess]);

  const check = () => {
    if (total !== model.maxWithoutSuccess) {
      setError(
        `Сумма должна быть ${model.maxWithoutSuccess} ${itemGen} — столько можно «набрать», а нужного результата ещё нет.`,
      );
      return;
    }
    for (const cat of model.categories) {
      if ((counts[cat.id] ?? 0) !== cat.maxInWorstCase) {
        setError("Проверь количество по каждому типу — это самый неудачный расклад из условия.");
        return;
      }
    }
    setError("");
    setSuccess(true);
  };

  if (success) {
    return (
      <StepSuccess
        message={`Самый неудачный расклад: ${expectedSummary(model)}. Нужного результата ещё нет.`}
      />
    );
  }

  return (
    <div>
      <p className="mb-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
        Представь, что нам <strong>очень не везёт</strong>. Разложи предметы так, чтобы{" "}
        <strong>{model.goal}</strong> ещё не случилось.
      </p>
      {model.worstCaseHint ? (
        <p className="mb-4 text-sm text-gray-500">Подсказка: {model.worstCaseHint}</p>
      ) : null}
      <div className="mb-4 space-y-3">
        {model.categories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-lavender-100 bg-white p-3"
          >
            <span className="text-sm font-medium">
              {cat.emoji ? `${cat.emoji} ` : ""}
              {cat.label}
            </span>
            <input
              type="number"
              min={0}
              max={99}
              value={counts[cat.id] ?? 0}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                setCounts((prev) => ({ ...prev, [cat.id]: Number.isFinite(v) ? v : 0 }));
                setError("");
              }}
              className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-center text-sm"
            />
          </div>
        ))}
      </div>
      <p className="mb-4 text-sm text-gray-600">
        Всего без гарантии: <strong>{total}</strong> {itemGen}
      </p>
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      <button
        type="button"
        onClick={check}
        className="rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
      >
        Это самый неудачный расклад
      </button>
    </div>
  );
}

function expectedSummary(model: UnluckyModel): string {
  const parts = model.categories
    .filter((c) => c.maxInWorstCase > 0)
    .map((c) => `${c.maxInWorstCase} «${c.label}»`);
  return parts.join(", ");
}
