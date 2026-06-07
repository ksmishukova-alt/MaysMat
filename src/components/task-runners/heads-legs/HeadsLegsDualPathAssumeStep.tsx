"use client";

import { useEffect, useState } from "react";
import type { DualAssumePathConfig } from "@/data/heads-legs/derive-pattern/dual-assume-paths";
import { resolveEntityEmoji } from "@/lib/entity-emoji";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";

interface HeadsLegsDualPathAssumeStepProps {
  stepId?: string;
  config: DualAssumePathConfig;
  onComplete: (pathIndex: 0 | 1) => void;
}

/** Выбор assume с двумя математически корректными путями (derive-base). */
export function HeadsLegsDualPathAssumeStep({
  stepId,
  config,
  onComplete,
}: HeadsLegsDualPathAssumeStepProps) {
  const [selected, setSelected] = useState<0 | 1 | null>(null);
  const [success, setSuccess] = useState(false);
  const [pathIndex, setPathIndex] = useState<0 | 1>(0);

  useEffect(() => {
    setSelected(null);
    setSuccess(false);
  }, [stepId]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => onComplete(pathIndex), STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [success, pathIndex, onComplete]);

  const check = () => {
    if (selected == null) return;
    setPathIndex(selected);
    setSuccess(true);
  };

  if (success) {
    return <StepSuccess message={config.successMessages[pathIndex]} />;
  }

  const options: Array<{ index: 0 | 1; label: string }> = [
    { index: 0, label: config.entityLabels[0] },
    { index: 1, label: config.entityLabels[1] },
  ];

  return (
    <div data-testid="dual-path-assume-step">
      <p className="mb-4 rounded-xl bg-lavender-50 p-4 text-sm text-gray-600">{config.context}</p>
      <p className="mb-4 text-sm font-medium">{config.selectPrompt}</p>
      <div className="mb-6 flex flex-wrap justify-center gap-4">
        {options.map((opt) => {
          const isSelected = selected === opt.index;
          return (
            <button
              key={opt.index}
              type="button"
              data-testid={`assume-path-${opt.index}`}
              onClick={() => setSelected(opt.index)}
              className={`flex min-w-[8rem] flex-col items-center gap-2 rounded-card border-2 px-6 py-5 transition ${
                isSelected
                  ? "border-brand-purple bg-lavender-50 shadow-card"
                  : "border-transparent bg-white shadow-card hover:border-lavender-300"
              }`}
            >
              <span className="text-5xl">
                {resolveEntityEmoji(opt.label, { id: `path-${opt.index}`, role: "object" })}
              </span>
              <span className="text-sm font-medium">{opt.label}</span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={check}
        disabled={selected == null}
        className="rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-medium text-white disabled:opacity-40"
      >
        Проверить
      </button>
    </div>
  );
}
