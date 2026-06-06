"use client";

import { useEffect, useState } from "react";
import type { RemaindersModel } from "@/data/dirichlet/remainders/types";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";

interface RemainderModulusStepProps {
  stepId?: string;
  model: RemaindersModel;
  onComplete: () => void;
}

export function RemainderModulusStep({ stepId, model, onComplete }: RemainderModulusStepProps) {
  const [input, setInput] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setInput("");
    setSuccess(false);
    setError("");
  }, [stepId]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(onComplete, STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [success, onComplete]);

  if (success) {
    return <StepSuccess message={`Верно! Разность должна делиться на ${model.modulus}.`} />;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-600">На какое число должна делиться разность?</p>
      <input
        type="text"
        inputMode="numeric"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setError("");
        }}
        className="mb-4 w-full max-w-xs rounded-lg border border-gray-200 px-3 py-2 text-sm"
        placeholder="Введи число"
      />
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      <button
        type="button"
        onClick={() => {
          const n = parseInt(input.trim(), 10);
          if (n !== model.modulus) {
            setError(`Проверь условие: нужно число ${model.modulus}.`);
            return;
          }
          setSuccess(true);
        }}
        className="rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-medium text-white"
      >
        Продолжить
      </button>
    </div>
  );
}
