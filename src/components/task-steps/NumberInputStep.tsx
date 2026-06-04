"use client";

import { useEffect, useState } from "react";
import { STEP_SUCCESS_ANIMATION_MS, STEP_SUCCESS_MS } from "./step-advance";
import { StepSuccess } from "./StepSuccess";

interface NumberInputStepProps {
  stepId?: string;
  context?: string;
  question?: string;
  answer: number;
  successMessage?: string;
  animation?: { items: { emoji: string; count: number }[] };
  onComplete: () => void;
}

export function NumberInputStep({
  stepId,
  context,
  question,
  answer,
  successMessage,
  animation,
  onComplete,
}: NumberInputStepProps) {
  const [value, setValue] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setValue("");
    setSuccess(false);
    setError("");
  }, [stepId, answer, question]);

  useEffect(() => {
    if (!success) return;
    const ms = animation ? STEP_SUCCESS_ANIMATION_MS : STEP_SUCCESS_MS;
    const timer = window.setTimeout(onComplete, ms);
    return () => window.clearTimeout(timer);
  }, [success, animation, onComplete]);

  const check = () => {
    if (Number(value) === answer) {
      setSuccess(true);
      setError("");
    } else {
      setError("Попробуй ещё раз — подумай внимательнее");
    }
  };

  if (success) {
    return (
      <div>
        <StepSuccess message={successMessage} />
        {animation ? (
          <div className="mt-4 animate-pulse rounded-xl bg-lavender-50 p-6 text-center">
            {animation.items.map((item, i) => (
              <div key={item.emoji}>
                {i > 0 ? <div className="my-2 text-gray-400">+</div> : null}
                <div className="text-3xl">
                  {item.emoji} × {item.count}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      {context ? (
        <p className="mb-4 rounded-xl bg-lavender-50 p-4 text-sm text-gray-600">
          {context}
        </p>
      ) : null}
      {question ? <p className="mb-4 font-medium">{question}</p> : null}
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && value && check()}
        className="mb-4 w-full max-w-xs rounded-xl border border-lavender-200 px-4 py-3 text-lg focus:border-brand-purple focus:outline-none"
        placeholder="Твой ответ"
      />
      {error ? <p className="mb-3 text-sm text-red-500">{error}</p> : null}
      <button
        type="button"
        onClick={check}
        disabled={!value}
        className="rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-medium text-white disabled:opacity-40"
      >
        Проверить
      </button>
    </div>
  );
}
