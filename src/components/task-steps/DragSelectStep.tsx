"use client";

import { useEffect, useState } from "react";
import type { DragOption } from "@/data/tasks";
import { STEP_SUCCESS_MS } from "./step-advance";
import { StepSuccess } from "./StepSuccess";

interface DragSelectStepProps {
  stepId?: string;
  options: DragOption[];
  onComplete: () => void;
}

export function DragSelectStep({ stepId, options, onComplete }: DragSelectStepProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSelected([]);
    setSuccess(false);
    setError("");
  }, [stepId]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(onComplete, STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [success, onComplete]);

  const toggle = (id: string) => {
    if (success) return;
    setError("");
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const check = () => {
    const correctIds = options.filter((o) => o.correct).map((o) => o.id);
    const ok =
      correctIds.length === selected.length &&
      correctIds.every((id) => selected.includes(id));
    if (ok) {
      setSuccess(true);
    } else {
      setError("Выбери только участников, которые есть в задаче");
    }
  };

  if (success) {
    return <StepSuccess />;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">
        Нажми на карточки участников задачи
      </p>
      <div className="mb-6 flex flex-wrap gap-3">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              className={`flex flex-col items-center gap-2 rounded-card border-2 px-5 py-4 transition ${
                isSelected
                  ? "border-brand-purple bg-lavender-50"
                  : "border-transparent bg-white shadow-card hover:border-lavender-300"
              }`}
            >
              <span className="text-4xl">{opt.emoji}</span>
              <span className="text-sm font-medium">{opt.label}</span>
            </button>
          );
        })}
      </div>
      {selected.length > 0 ? (
        <div className="mb-4 rounded-xl bg-lavender-50 p-4">
          <div className="mb-2 text-xs font-medium text-gray-500">Выбрано:</div>
          <div className="flex flex-wrap gap-2">
            {selected.map((id) => {
              const opt = options.find((o) => o.id === id)!;
              return (
                <span
                  key={id}
                  className="rounded-lg bg-white px-3 py-1 text-sm shadow-sm"
                >
                  {opt.emoji} {opt.label}
                </span>
              );
            })}
          </div>
        </div>
      ) : null}
      {error ? <p className="mb-3 text-sm text-red-500">{error}</p> : null}
      <button
        type="button"
        onClick={check}
        disabled={selected.length === 0}
        className="rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-medium text-white disabled:opacity-40"
      >
        Проверить
      </button>
    </div>
  );
}
