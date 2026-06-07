"use client";

import { useEffect, useState } from "react";
import type { HeadsLegsDeriveRuleInstance } from "@/data/method-rules/types";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";

interface HeadsLegsDerivePreludeStepProps {
  stepId?: string;
  instance: HeadsLegsDeriveRuleInstance;
  onComplete: () => void;
}

/** Prelude паттерна 5: что получить из условия перед заменой */
export function HeadsLegsDerivePreludeStep({
  stepId,
  instance,
  onComplete,
}: HeadsLegsDerivePreludeStepProps) {
  const [phase, setPhase] = useState<"choose" | "totals" | "done">("choose");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [chooseError, setChooseError] = useState<string | null>(null);
  const [objectsInput, setObjectsInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [totalsError, setTotalsError] = useState<string | null>(null);

  useEffect(() => {
    setPhase("choose");
    setSelectedId(null);
    setChooseError(null);
    setObjectsInput("");
    setFeatureInput("");
    setTotalsError(null);
  }, [stepId]);

  useEffect(() => {
    if (phase !== "done") return;
    const timer = window.setTimeout(onComplete, STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [phase, onComplete]);

  if (phase === "done") {
    return <StepSuccess message="Данные собраны — можно решать заменой." />;
  }

  const objectsLabel = instance.objectsLabel ?? "объектов";
  const featureLabel = instance.featureName;

  if (phase === "totals") {
    const checkTotals = () => {
      const objects = Number(objectsInput.trim());
      const feature = Number(featureInput.trim());
      if (objects !== instance.totalObjects || feature !== instance.totalFeature) {
        setTotalsError("Проверь числа в условии задачи.");
        return;
      }
      setTotalsError(null);
      setPhase("done");
    };

    return (
      <div data-testid="derive-prelude-step">
        <p className="mb-4 text-sm font-medium text-gray-800">Запиши главные числа из условия</p>
        <div className="space-y-4">
          <label className="block text-sm text-gray-700">
            Сколько всего {objectsLabel}?
            <input
              type="number"
              value={objectsInput}
              onChange={(e) => setObjectsInput(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              data-testid="derive-totals-objects"
            />
          </label>
          <label className="block text-sm text-gray-700">
            Сколько всего {featureLabel}?
            <input
              type="number"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              data-testid="derive-totals-feature"
            />
          </label>
        </div>
        {totalsError ? <p className="mt-3 text-sm text-red-600">{totalsError}</p> : null}
        <button
          type="button"
          onClick={checkTotals}
          className="mt-6 rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-medium text-white"
        >
          Проверить
        </button>
      </div>
    );
  }

  const verifyChoice = () => {
    const choice = instance.preludeChoices.find((c) => c.id === selectedId);
    if (!choice) {
      setChooseError("Выбери один вариант.");
      return;
    }
    if (!choice.correct) {
      setChooseError("Подумай ещё: что нужно знать перед заменой?");
      return;
    }
    setChooseError(null);
    setPhase("totals");
  };

  return (
    <div data-testid="derive-prelude-step">
      <p className="mb-4 text-sm font-medium text-gray-800">{instance.preludeQuestion}</p>
      <div className="space-y-2">
        {instance.preludeChoices.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => {
              setSelectedId(opt.id);
              setChooseError(null);
            }}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
              selectedId === opt.id
                ? "border-brand-purple bg-lavender-50 font-medium text-gray-900"
                : "border-gray-200 bg-white text-gray-800 hover:border-lavender-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {chooseError ? <p className="mt-3 text-sm text-red-600">{chooseError}</p> : null}
      <button
        type="button"
        onClick={verifyChoice}
        className="mt-6 rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-medium text-white"
      >
        Проверить
      </button>
    </div>
  );
}
