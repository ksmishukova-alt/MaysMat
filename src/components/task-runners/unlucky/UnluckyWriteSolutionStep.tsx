"use client";

import { useEffect, useState } from "react";
import type { UnluckyModel } from "@/data/dirichlet/unlucky/types";
import { WordSolutionFillBlanks } from "@/components/task-steps/WordSolutionFillBlanks";
import { validateBlanks } from "@/lib/word-solution-blanks";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";

interface UnluckyWriteSolutionStepProps {
  stepId?: string;
  model: UnluckyModel;
  onComplete: () => void;
}

export function UnluckyWriteSolutionStep({ stepId, model, onComplete }: UnluckyWriteSolutionStepProps) {
  const [blanks, setBlanks] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const lines = model.writeSolutionLines ?? [];

  useEffect(() => {
    setBlanks({});
    setSuccess(false);
    setError("");
  }, [stepId]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(onComplete, STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [success, onComplete]);

  if (success) {
    return <StepSuccess message="Решение записано!" />;
  }

  if (model.variant === "deduction" || lines.length === 0) {
    return <DeductionWriteStep stepId={stepId} onComplete={onComplete} />;
  }

  const check = () => {
    const result = validateBlanks(blanks, lines);
    if (!result.ok) {
      setError(result.message ?? "Проверь пропуски в тексте решения.");
      return;
    }
    setError("");
    setSuccess(true);
  };

  return (
    <div>
      <p className="mb-4 text-sm text-gray-600">
        Заполни пропуски и собери полный текст решения словами.
      </p>
      <WordSolutionFillBlanks
        stepId={stepId}
        lines={lines}
        blanks={blanks}
        onBlanksChange={setBlanks}
      />
      {error ? <p className="mb-3 mt-4 text-sm text-red-600">{error}</p> : null}
      <button
        type="button"
        onClick={check}
        className="mt-4 rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-medium text-white"
      >
        Записать решение
      </button>
    </div>
  );
}

function DeductionWriteStep({
  stepId,
  onComplete,
}: {
  stepId?: string;
  onComplete: () => void;
}) {
  const [text, setText] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setText("");
    setSuccess(false);
    setError("");
  }, [stepId]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(onComplete, STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [success, onComplete]);

  if (success) {
    return <StepSuccess message="Решение записано!" />;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-600">Запиши ответ: какие монеты вытащил Петя?</p>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError("");
        }}
        rows={4}
        className="mb-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        placeholder="3 монеты по 1 рублю и 2 монеты по 2 рубля"
      />
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      <button
        type="button"
        onClick={() => {
          if (text.trim().length < 12) {
            setError("Напиши состав монет полными словами.");
            return;
          }
          setSuccess(true);
        }}
        className="rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-medium text-white"
      >
        Записать решение
      </button>
    </div>
  );
}
