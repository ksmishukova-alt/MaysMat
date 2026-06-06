"use client";

import { useEffect, useState } from "react";
import type { HeadsLegsScoreRuleInstance } from "@/data/method-rules/types";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";

function formatSigned(n: number): string {
  if (n > 0) return `+${n}`;
  return String(n);
}

interface ScoreReplacementStepProps {
  stepId?: string;
  instance: HeadsLegsScoreRuleInstance;
  onComplete: () => void;
}

/** Шаг «шаг замены» для plus-minus (4.1, 4.5) */
export function ScoreReplacementStep({ stepId, instance, onComplete }: ScoreReplacementStepProps) {
  const [confirmed, setConfirmed] = useState(false);

  const wrongScore =
    instance.assumeKind === instance.firstKind ? instance.firstScore : instance.secondScore;
  const correctScore =
    instance.assumeKind === instance.firstKind ? instance.secondScore : instance.firstScore;
  const replacementExpr = `${correctScore} − (${wrongScore}) = ${instance.replacementStep}`;

  useEffect(() => {
    setConfirmed(false);
  }, [stepId]);

  useEffect(() => {
    if (!confirmed) return;
    const timer = window.setTimeout(onComplete, STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [confirmed, onComplete]);

  if (confirmed) {
    return <StepSuccess message="Верно! Запомни этот шаг замены." />;
  }

  return (
    <div data-testid="score-replacement-step">
      <p className="mb-4 text-sm font-medium text-gray-800">Шаг замены с отрицательными баллами</p>
      <div className="mb-6 space-y-3 rounded-xl border-2 border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-relaxed text-amber-950">
        <p>
          Один вариант даёт{" "}
          <span data-testid="score-wrong-value">{formatSigned(wrongScore)}</span>{" "}
          {instance.scoreName}.
        </p>
        <p>
          Другой вариант даёт{" "}
          <span data-testid="score-correct-value">{formatSigned(correctScore)}</span>{" "}
          {instance.scoreName}.
        </p>
        <p className="font-medium">Одна замена меняет результат на:</p>
        <p className="font-mono text-base" data-testid="score-replacement-formula">
          {replacementExpr}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setConfirmed(true)}
        className="rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-medium text-white"
      >
        Понятно, считаю дальше
      </button>
    </div>
  );
}
