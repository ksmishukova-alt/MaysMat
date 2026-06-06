"use client";

import { useEffect, useState } from "react";
import type { Task } from "@/data/tasks";
import type { RemaindersModel } from "@/data/dirichlet/remainders/types";
import { CHOOSE_METHOD_SUBSTEPS, type ChooseMethodSubstep } from "@/data/dirichlet/remainders/progression";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";
import { RemainderModulusStep } from "./RemainderModulusStep";
import { RemaindersHousesStep } from "./RemaindersHousesStep";
import { RemainderObjectsStep } from "./RemainderObjectsStep";
import { RemainderCollisionStep } from "./RemainderCollisionStep";
import { RemainderDivisibilityExplainStep } from "./RemainderDivisibilityExplainStep";

const STEP_LABELS: Record<ChooseMethodSubstep, string> = {
  find_modulus: "Найти модуль деления",
  build_houses: "Построить домики для остатков",
  identify_objects: "Понять, что раскладываем по домикам",
  find_collision: "Найти столкновение в домиках",
  explain_divisibility: "Объяснить, почему это решает задачу",
};

interface RemainderMethodChooseStepProps {
  stepId?: string;
  task: Task;
  model: RemaindersModel;
  onComplete: () => void;
}

/** Профиль 4: ребёнок сам выбирает порядок шагов метода */
export function RemainderMethodChooseStep({
  stepId,
  task,
  model,
  onComplete,
}: RemainderMethodChooseStepProps) {
  const [completed, setCompleted] = useState<Set<ChooseMethodSubstep>>(new Set());
  const [active, setActive] = useState<ChooseMethodSubstep | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setCompleted(new Set());
    setActive(null);
    setSuccess(false);
  }, [stepId]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(onComplete, STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [success, onComplete]);

  const markDone = (kind: ChooseMethodSubstep) => {
    setCompleted((prev) => new Set(prev).add(kind));
    setActive(null);
  };

  const allDone = CHOOSE_METHOD_SUBSTEPS.every((k) => completed.has(k));

  if (success) {
    return <StepSuccess message="Отлично! Ты сам прошёл все шаги метода." />;
  }

  if (active) {
    const subId = `${stepId ?? task.id}-${active}`;
    const onSubComplete = () => markDone(active);

    switch (active) {
      case "find_modulus":
        return <RemainderModulusStep stepId={subId} model={model} onComplete={onSubComplete} />;
      case "build_houses":
        return <RemaindersHousesStep stepId={subId} model={model} onComplete={onSubComplete} />;
      case "identify_objects":
        return <RemainderObjectsStep stepId={subId} model={model} onComplete={onSubComplete} />;
      case "find_collision":
        return <RemainderCollisionStep stepId={subId} model={model} onComplete={onSubComplete} />;
      case "explain_divisibility":
        return (
          <RemainderDivisibilityExplainStep stepId={subId} model={model} onComplete={onSubComplete} />
        );
      default:
        return null;
    }
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-600">
        Ты уже знаешь метод «домики для остатков». Выбери, с какого шага начать — пройди все пять.
      </p>
      <div className="mb-6 space-y-2">
        {CHOOSE_METHOD_SUBSTEPS.map((kind) => {
          const done = completed.has(kind);
          return (
            <button
              key={kind}
              type="button"
              onClick={() => setActive(kind)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                done
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-gray-200 bg-white text-gray-800 hover:border-lavender-200"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done ? "bg-emerald-500 text-white" : "bg-lavender-100 text-brand-purple"
                }`}
              >
                {done ? "✓" : "?"}
              </span>
              {STEP_LABELS[kind]}
            </button>
          );
        })}
      </div>
      {allDone ? (
        <button
          type="button"
          onClick={() => setSuccess(true)}
          className="rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-medium text-white"
        >
          Все шаги пройдены — дальше
        </button>
      ) : (
        <p className="text-xs text-gray-500">
          Осталось шагов: {CHOOSE_METHOD_SUBSTEPS.length - completed.size}
        </p>
      )}
    </div>
  );
}
