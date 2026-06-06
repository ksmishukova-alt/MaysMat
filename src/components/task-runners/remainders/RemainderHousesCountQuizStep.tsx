"use client";

import { useEffect, useMemo, useState } from "react";
import type { RemaindersModel } from "@/data/dirichlet/remainders/types";
import { formatRemainderRange } from "@/data/method-rules";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";

interface RemainderHousesCountQuizStepProps {
  stepId?: string;
  model: RemaindersModel;
  onComplete: () => void;
}

export function RemainderHousesCountQuizStep({
  stepId,
  model,
  onComplete,
}: RemainderHousesCountQuizStepProps) {
  const m = model.modulus;
  const [selected, setSelected] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const options = useMemo(
    () => [
      {
        id: "a",
        text: `Потому что при делении на ${m} бывают остатки от ${model.ruleInstance?.firstRemainder ?? 0} до ${model.ruleInstance?.lastRemainder ?? m - 1}.`,
        correct: true,
      },
      {
        id: "b",
        text: `Потому что ${model.objectsLabel} дано ${model.objectsCount}.`,
        correct: false,
      },
      {
        id: "c",
        text: `Потому что ответ равен ${m}.`,
        correct: false,
      },
    ],
    [m, model],
  );

  useEffect(() => {
    setSelected(null);
    setSuccess(false);
    setError("");
  }, [stepId]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(onComplete, STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [success, onComplete]);

  if (success) {
    return (
      <StepSuccess
        message={`Верно! ${model.housesCount} домиков — по одному на каждый остаток от ${formatRemainderRange(0, m - 1, m >= 20)}.`}
      />
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm font-medium text-gray-800">
        Почему домиков именно {model.housesCount}?
      </p>
      <div className="mb-4 space-y-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => {
              setSelected(opt.id);
              setError("");
            }}
            className={`block w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
              selected === opt.id
                ? "border-brand-purple bg-lavender-50"
                : "border-gray-200 bg-white hover:border-lavender-200"
            }`}
          >
            <span className="mr-2 font-medium text-brand-purple">{opt.id.toUpperCase()}.</span>
            {opt.text}
          </button>
        ))}
      </div>
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      <button
        type="button"
        onClick={() => {
          const opt = options.find((o) => o.id === selected);
          if (!opt) {
            setError("Выбери один вариант.");
            return;
          }
          if (!opt.correct) {
            setError("Подумай: сколько разных остатков бывает при делении на это число?");
            return;
          }
          setSuccess(true);
        }}
        className="rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-medium text-white"
      >
        Проверить
      </button>
    </div>
  );
}
