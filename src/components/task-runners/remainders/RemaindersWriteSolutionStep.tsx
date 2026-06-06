"use client";

import { useEffect, useState } from "react";
import type { RemaindersModel } from "@/data/dirichlet/remainders/types";
import { WordSolutionFillBlanks } from "@/components/task-steps/WordSolutionFillBlanks";
import { validateBlanks } from "@/lib/word-solution-blanks";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";

interface RemaindersWriteSolutionStepProps {
  stepId?: string;
  model: RemaindersModel;
  onComplete: () => void;
}

export function RemaindersWriteSolutionStep({
  stepId,
  model,
  onComplete,
}: RemaindersWriteSolutionStepProps) {
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

  if (lines.length === 0) {
    return (
      <FallbackWriteStep
        stepId={stepId}
        model={model}
        onComplete={() => setSuccess(true)}
        onSuccessAdvance={onComplete}
      />
    );
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
        cardMode="reusable"
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

function FallbackWriteStep({
  stepId,
  model,
  onComplete,
  onSuccessAdvance,
}: {
  stepId?: string;
  model: RemaindersModel;
  onComplete: () => void;
  onSuccessAdvance: () => void;
}) {
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setSuccess(false);
  }, [stepId]);

  useEffect(() => {
    if (!success) return;
    onComplete();
    const timer = window.setTimeout(onSuccessAdvance, STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [success, onComplete, onSuccessAdvance]);

  if (success) {
    return <StepSuccess message="Решение записано!" />;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-600">{model.conclusionTemplate}</p>
      <button
        type="button"
        onClick={() => setSuccess(true)}
        className="rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-medium text-white"
      >
        Записать решение
      </button>
    </div>
  );
}
