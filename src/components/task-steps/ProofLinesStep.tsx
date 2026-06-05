"use client";

import { useState } from "react";
import type { ProofLinesStep as ProofLinesStepDef } from "@/data/task-steps";
import { validateModeABlanks } from "@/lib/word-solution-mode-a";
import { WordSolutionFillBlanks } from "./WordSolutionFillBlanks";

interface ProofLinesStepProps {
  step: ProofLinesStepDef;
  onComplete: () => void;
}

export function ProofLinesStep({ step, onComplete }: ProofLinesStepProps) {
  const [blanks, setBlanks] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const result = validateModeABlanks(blanks, step.solutionLines);
    if (result.ok) {
      onComplete();
    } else {
      setError(result.message ?? "Проверь карточки.");
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Собери доказательство из карточек: нажми на пропуск, затем выбери подходящую фразу или число.
      </p>
      <WordSolutionFillBlanks
        stepId={step.id}
        lines={step.solutionLines}
        blanks={blanks}
        onBlanksChange={setBlanks}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="button"
        onClick={submit}
        className="w-full rounded-xl bg-brand-purple py-3 text-sm font-semibold text-white"
      >
        Проверить строки доказательства
      </button>
    </div>
  );
}
