"use client";

import { useEffect, useState } from "react";
import type { PlayerStep } from "@/lib/task-player-steps";
import {
  CHOOSE_METHOD_ACTIONS,
  CHOOSE_METHOD_LABELS,
  findSubStepsForAction,
  type ChooseMethodAction,
} from "@/data/heads-legs/base-pattern/progression";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";
import { DragSelectStep } from "@/components/task-steps/DragSelectStep";
import { SingleSelectStep } from "@/components/task-steps/SingleSelectStep";
import { WorksheetTableStep } from "@/components/task-steps/WorksheetTableStep";
import { WordSolutionStep } from "@/components/task-steps/WordSolutionStep";

interface HeadsLegsMethodChooseStepProps {
  stepId?: string;
  sourceSteps: PlayerStep[];
  onComplete: () => void;
}

function renderSubStep(step: PlayerStep, onSubComplete: () => void) {
  switch (step.type) {
    case "single_select":
      return (
        <SingleSelectStep
          stepId={step.id}
          context={step.context}
          options={step.options!}
          prompt={step.selectPrompt}
          successMessage={step.successMessage}
          runnerContext="heads-legs"
          onComplete={onSubComplete}
        />
      );
    case "worksheet_table":
      return (
        <WorksheetTableStep
          stepId={step.id}
          rows={step.worksheetRows!}
          successMessage={step.successMessage}
          runnerContext="heads-legs"
          onComplete={onSubComplete}
        />
      );
    case "word_solution":
      return (
        <WordSolutionStep step={step} runnerContext="heads-legs" onComplete={onSubComplete} />
      );
    case "drag_select":
      return (
        <DragSelectStep
          stepId={step.id}
          options={step.options!}
          runnerContext="heads-legs"
          onComplete={onSubComplete}
        />
      );
    default:
      return (
        <p className="text-sm text-gray-600">
          Этот шаг уже пройден. Нажми «Назад к выбору».
        </p>
      );
  }
}

/** Профиль 3: ребёнок выбирает следующий шаг метода */
export function HeadsLegsMethodChooseStep({
  stepId,
  sourceSteps,
  onComplete,
}: HeadsLegsMethodChooseStepProps) {
  const [completed, setCompleted] = useState<Set<ChooseMethodAction>>(new Set());
  const [active, setActive] = useState<ChooseMethodAction | null>(null);
  const [subIndex, setSubIndex] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setCompleted(new Set());
    setActive(null);
    setSubIndex(0);
    setSuccess(false);
  }, [stepId]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(onComplete, STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [success, onComplete]);

  const markDone = (action: ChooseMethodAction) => {
    setCompleted((prev) => new Set(prev).add(action));
    setActive(null);
    setSubIndex(0);
  };

  const allDone = CHOOSE_METHOD_ACTIONS.every((k) => completed.has(k));

  if (success) {
    return <StepSuccess message="Отлично! Ты прошёл все шаги метода." />;
  }

  if (active) {
    const subSteps = findSubStepsForAction(sourceSteps, active);
    const sub = subSteps[subIndex];
    if (!sub) {
      markDone(active);
      return null;
    }

    const onSubComplete = () => {
      if (subIndex >= subSteps.length - 1) {
        markDone(active);
      } else {
        setSubIndex((i) => i + 1);
      }
    };

    return (
      <div>
        <button
          type="button"
          onClick={() => {
            setActive(null);
            setSubIndex(0);
          }}
          className="mb-4 text-sm text-brand-purple hover:underline"
        >
          ← Назад к выбору
        </button>
        {renderSubStep(sub, onSubComplete)}
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm font-medium text-gray-800">Какой шаг сейчас нужно сделать?</p>
      <div className="mb-6 space-y-2">
        {CHOOSE_METHOD_ACTIONS.map((action) => {
          const done = completed.has(action);
          return (
            <button
              key={action}
              type="button"
              onClick={() => setActive(action)}
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
              {CHOOSE_METHOD_LABELS[action]}
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
          Осталось шагов: {CHOOSE_METHOD_ACTIONS.length - completed.size}
        </p>
      )}
    </div>
  );
}
