"use client";

import { AutoExplanationStep } from "@/components/task-steps/AutoExplanationStep";
import { buildDivisibilityExampleTemplate } from "@/data/dirichlet/remainders/divisibility-example";

interface RemainderDivisibilityExampleStepProps {
  modulus: number;
  onComplete: () => void;
}

/** Мини-пример: одинаковый остаток ⇒ разность делится на модуль */
export function RemainderDivisibilityExampleStep({
  modulus,
  onComplete,
}: RemainderDivisibilityExampleStepProps) {
  return (
    <AutoExplanationStep
      template={buildDivisibilityExampleTemplate(modulus)}
      role="intro"
      onComplete={onComplete}
    />
  );
}
