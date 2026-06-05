"use client";

import { useEffect, useState } from "react";
import type { DragOption } from "@/data/tasks";
import { STEP_SUCCESS_MS } from "./step-advance";
import { StepSuccess } from "./StepSuccess";

import type { RunnerContext } from "@/lib/runner-context";

interface SingleSelectStepProps {
  stepId?: string;
  context?: string;
  options: DragOption[];
  prompt?: string;
  successMessage?: string;
  runnerContext?: RunnerContext;
  onComplete: () => void;
}

export function SingleSelectStep({
  stepId,
  context,
  options,
  prompt = "Выбери один вариант",
  successMessage,
  runnerContext = "heads-legs",
  onComplete,
}: SingleSelectStepProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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

  const check = () => {
    if (!selected) return;
    const option = options.find((o) => o.id === selected);
    if (option?.correct) {
      setSuccess(true);
      setError("");
    } else {
      setError(
        runnerContext === "dirichlet"
          ? "Подумай: какой вариант следует из сравнения N и M?"
          : "Подумай: у кого в задаче есть ноги?",
      );
    }
  };

  if (success) {
    return <StepSuccess message={successMessage} />;
  }

  return (
    <div>
      {context ? (
        <p className="mb-4 rounded-xl bg-lavender-50 p-4 text-sm text-gray-600">{context}</p>
      ) : null}
      <p className="mb-4 text-sm font-medium">{prompt}</p>
      <div className="mb-6 flex flex-wrap justify-center gap-4">
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setSelected(opt.id);
                setError("");
              }}
              className={`flex min-w-[8rem] flex-col items-center gap-2 rounded-card border-2 px-6 py-5 transition ${
                isSelected
                  ? "border-brand-purple bg-lavender-50 shadow-card"
                  : "border-transparent bg-white shadow-card hover:border-lavender-300"
              }`}
            >
              <span className="text-5xl">{opt.emoji}</span>
              <span className="text-sm font-medium">{opt.label}</span>
            </button>
          );
        })}
      </div>
      {error ? <p className="mb-3 text-sm text-red-500">{error}</p> : null}
      <button
        type="button"
        onClick={check}
        disabled={!selected}
        className="rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-medium text-white disabled:opacity-40"
      >
        Проверить
      </button>
    </div>
  );
}
