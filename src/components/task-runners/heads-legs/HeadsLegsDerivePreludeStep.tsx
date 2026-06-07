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

type PreludePhase = "choose" | "derive" | "featureNorms" | "totals" | "done";

/** Prelude паттерна 5: что получить из условия перед заменой */
export function HeadsLegsDerivePreludeStep({
  stepId,
  instance,
  onComplete,
}: HeadsLegsDerivePreludeStepProps) {
  const [phase, setPhase] = useState<PreludePhase>("choose");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [chooseError, setChooseError] = useState<string | null>(null);
  const [deriveInput, setDeriveInput] = useState("");
  const [deriveError, setDeriveError] = useState<string | null>(null);
  const [deriveConfirmed, setDeriveConfirmed] = useState(false);
  const [featureValues, setFeatureValues] = useState<Record<string, string>>({});
  const [featureError, setFeatureError] = useState<string | null>(null);
  const [objectsInput, setObjectsInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [totalsError, setTotalsError] = useState<string | null>(null);

  useEffect(() => {
    setPhase("choose");
    setSelectedId(null);
    setChooseError(null);
    setDeriveInput("");
    setDeriveError(null);
    setDeriveConfirmed(false);
    setFeatureValues({});
    setFeatureError(null);
    setObjectsInput("");
    setFeatureInput("");
    setTotalsError(null);
  }, [stepId]);

  useEffect(() => {
    if (phase !== "done") return;
    const timer = window.setTimeout(onComplete, STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [phase, onComplete]);

  const advanceAfterChoice = () => {
    if (instance.preludeDerivePrompt) {
      setPhase("derive");
      return;
    }
    if (instance.preludeFeatureNorms) {
      setPhase("featureNorms");
      return;
    }
    setPhase("totals");
  };

  const advanceAfterDerive = () => {
    if (instance.preludeFeatureNorms) {
      setPhase("featureNorms");
      return;
    }
    setPhase("totals");
  };

  if (phase === "done") {
    return <StepSuccess message="Данные собраны — можно решать заменой." />;
  }

  const objectsLabel = instance.objectsLabel ?? "объектов";
  const featureLabel = instance.featureName;

  if (phase === "totals") {
    const skipObjects = deriveConfirmed || instance.preludeDeriveAnswer != null;

    const checkTotals = () => {
      const feature = Number(featureInput.trim());
      if (Number.isNaN(feature) || feature !== instance.totalFeature) {
        setTotalsError(`Проверь, сколько всего ${featureLabel} по условию.`);
        return;
      }

      if (!skipObjects) {
        const objects = Number(objectsInput.trim());
        if (objects !== instance.totalObjects) {
          setTotalsError("Проверь числа в условии задачи.");
          return;
        }
      }

      setTotalsError(null);
      setPhase("done");
    };

    return (
      <div data-testid="derive-prelude-step">
        <p className="mb-4 text-sm font-medium text-gray-800">Запиши главные числа из условия</p>
        <div className="space-y-4">
          {!skipObjects ? (
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
          ) : (
            <p className="text-sm text-gray-600">
              Всего {objectsLabel}: <strong>{instance.preludeDeriveAnswer ?? instance.totalObjects}</strong>
            </p>
          )}
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

  if (phase === "featureNorms" && instance.preludeFeatureNorms) {
    const norms = instance.preludeFeatureNorms;
    const checkNorms = () => {
      const ok = norms.rows.every((row) => Number(featureValues[row.id]) === row.answer);
      if (!ok) {
        setFeatureError(norms.stepHint);
        return;
      }
      setFeatureError(null);
      setPhase("totals");
    };

    return (
      <div data-testid="derive-prelude-step">
        <p className="mb-2 text-sm font-medium text-gray-800">{norms.stepHint}</p>
        <table className="mb-6 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-card">
          <thead>
            <tr className="bg-lavender-50 text-left text-sm text-gray-500">
              <th className="px-4 py-3">Вид меча</th>
              <th className="px-4 py-3">{norms.columnLabel}</th>
            </tr>
          </thead>
          <tbody>
            {norms.rows.map((row) => (
              <tr key={row.id} className="border-t border-lavender-100">
                <td className="px-4 py-3">
                  {row.emoji} {row.label}
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={featureValues[row.id] ?? ""}
                    onChange={(e) =>
                      setFeatureValues((v) => ({ ...v, [row.id]: e.target.value }))
                    }
                    className="w-20 rounded-lg border border-lavender-200 px-3 py-1.5 text-center focus:border-brand-purple focus:outline-none"
                    data-testid={`derive-feature-${row.id}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {featureError ? <p className="mb-3 text-sm text-red-500">{featureError}</p> : null}
        <button
          type="button"
          onClick={checkNorms}
          className="rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-medium text-white"
        >
          Проверить
        </button>
      </div>
    );
  }

  if (phase === "derive" && instance.preludeDerivePrompt) {
    const checkDerive = () => {
      const n = Number(deriveInput.trim());
      if (n !== instance.preludeDeriveAnswer) {
        setDeriveError("Посчитай: одна рукоять — один меч.");
        return;
      }
      setDeriveError(null);
      setDeriveConfirmed(true);
      advanceAfterDerive();
    };

    return (
      <div data-testid="derive-prelude-step">
        <p className="mb-4 text-sm font-medium text-gray-800">{instance.preludeDerivePrompt}</p>
        <input
          type="number"
          value={deriveInput}
          onChange={(e) => setDeriveInput(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-gray-200 px-3 py-2 text-sm"
          data-testid="derive-count-input"
        />
        {deriveError ? <p className="mt-3 text-sm text-red-600">{deriveError}</p> : null}
        <button
          type="button"
          onClick={checkDerive}
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
    advanceAfterChoice();
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
