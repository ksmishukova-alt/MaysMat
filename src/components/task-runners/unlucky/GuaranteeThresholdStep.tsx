"use client";

import { useEffect, useState } from "react";
import type { UnluckyModel } from "@/data/dirichlet/unlucky/types";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";

interface GuaranteeThresholdStepProps {
  stepId?: string;
  model: UnluckyModel;
  maxWithoutSuccess: number;
  onComplete: () => void;
}

export function GuaranteeThresholdStep({
  stepId,
  model,
  maxWithoutSuccess,
  onComplete,
}: GuaranteeThresholdStepProps) {
  const [added, setAdded] = useState(false);
  const [answer, setAnswer] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const itemGen = model.itemLabelGenitive ?? "предметов";

  useEffect(() => {
    setAdded(false);
    setAnswer("");
    setSuccess(false);
    setError("");
  }, [stepId]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(onComplete, STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [success, onComplete]);

  const check = () => {
    const n = parseInt(answer, 10);
    if (!Number.isFinite(n) || n !== model.answer) {
      setError(`Попробуй: ${maxWithoutSuccess} + 1 = ?`);
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <StepSuccess
        message={`Верно! Нужно ${model.answer} ${itemGen} — на 1 больше, чем ${maxWithoutSuccess}.`}
      />
    );
  }

  if (model.variant === "deduction") {
    return (
      <div>
        <p className="mb-4 text-sm text-gray-600">
          Из условий следует состав монет. Сколько всего монет вытащил Петя?
        </p>
        <input
          type="number"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setError("");
          }}
          className="mb-4 w-32 rounded-lg border border-gray-200 px-3 py-2 text-center"
          placeholder="?"
        />
        {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
        <button
          type="button"
          onClick={() => {
            const n = parseInt(answer, 10);
            if (n === model.answer) setSuccess(true);
            else setError("Петя вытащил 5 монет — проверь условие.");
          }}
          className="rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-medium text-white"
        >
          Проверить
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-600">
        Если без гарантии можно взять <strong>{maxWithoutSuccess}</strong> {itemGen}, то для
        гарантии нужно взять на <strong>1 больше</strong>.
      </p>
      <div className="mb-6 rounded-xl bg-lavender-50 p-4 text-center font-mono text-lg">
        {maxWithoutSuccess} + 1 = {added ? model.answer : "?"}
      </div>
      {!added ? (
        <button
          type="button"
          onClick={() => setAdded(true)}
          className="mb-4 rounded-xl border-2 border-dashed border-brand-purple px-5 py-2.5 text-sm font-medium text-brand-purple hover:bg-lavender-50"
        >
          ➕ Добавить ещё 1
        </button>
      ) : (
        <>
          <p className="mb-2 text-sm font-medium">Запиши ответ:</p>
          <input
            type="number"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setError("");
            }}
            className="mb-4 w-32 rounded-lg border border-gray-200 px-3 py-2 text-center"
          />
        </>
      )}
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      {added ? (
        <button
          type="button"
          onClick={check}
          className="rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-medium text-white"
        >
          Проверить порог гарантии
        </button>
      ) : null}
    </div>
  );
}
