"use client";

import { useEffect, useState } from "react";
import type { HeadsLegsValueAnswerTransform } from "@/data/method-rules/types";
import type { PlayerStep } from "@/lib/task-player-steps";
import {
  CHOOSE_METHOD_ACTIONS,
  CHOOSE_METHOD_LABELS,
  findSubStepsForAction,
  type ChooseMethodAction,
} from "@/data/heads-legs/base-pattern/progression";
import {
  VALUE_CHOOSE_METHOD_ACTIONS,
  VALUE_CHOOSE_METHOD_LABELS,
  findValueSubStepsForAction,
  type ValueChooseMethodAction,
} from "@/data/heads-legs/value-pattern/progression";
import { HeadsLegsQuestionCheckStep } from "./HeadsLegsQuestionCheckStep";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";
import { DragSelectStep } from "@/components/task-steps/DragSelectStep";
import { SingleSelectStep } from "@/components/task-steps/SingleSelectStep";
import { WorksheetTableStep } from "@/components/task-steps/WorksheetTableStep";
import { WordSolutionStep } from "@/components/task-steps/WordSolutionStep";

type HubAction = ChooseMethodAction | ValueChooseMethodAction;

interface HeadsLegsMethodChooseStepProps {
  stepId?: string;
  chooseMode?: "base" | "value";
  sourceSteps: PlayerStep[];
  questionAsks?: string;
  answerTransform?: HeadsLegsValueAnswerTransform;
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
  chooseMode = "base",
  sourceSteps,
  questionAsks,
  answerTransform,
  onComplete,
}: HeadsLegsMethodChooseStepProps) {
  const actions = chooseMode === "value" ? VALUE_CHOOSE_METHOD_ACTIONS : CHOOSE_METHOD_ACTIONS;
  const labels =
    chooseMode === "value" ? VALUE_CHOOSE_METHOD_LABELS : CHOOSE_METHOD_LABELS;

  const [completed, setCompleted] = useState<Set<HubAction>>(new Set());
  const [active, setActive] = useState<HubAction | null>(null);
  const [subIndex, setSubIndex] = useState(0);
  const [questionGatePassed, setQuestionGatePassed] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setCompleted(new Set());
    setActive(null);
    setSubIndex(0);
    setQuestionGatePassed(false);
    setSuccess(false);
  }, [stepId]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(onComplete, STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [success, onComplete]);

  const markDone = (action: HubAction) => {
    setCompleted((prev) => new Set(prev).add(action));
    setActive(null);
    setSubIndex(0);
    setQuestionGatePassed(false);
  };

  const allDone = actions.every((k) => completed.has(k));

  const findSubSteps = (action: HubAction): PlayerStep[] => {
    if (chooseMode === "value") {
      return findValueSubStepsForAction(sourceSteps, action as ValueChooseMethodAction);
    }
    return findSubStepsForAction(sourceSteps, action as ChooseMethodAction);
  };

  if (success) {
    return <StepSuccess message="Отлично! Ты прошёл все шаги метода." />;
  }

  if (active) {
    const backToHub = () => {
      setActive(null);
      setSubIndex(0);
      setQuestionGatePassed(false);
    };

    if (
      chooseMode === "value" &&
      active === "check_question" &&
      questionAsks &&
      !questionGatePassed
    ) {
      return (
        <div>
          <button type="button" onClick={backToHub} className="mb-4 text-sm text-brand-purple hover:underline">
            ← Назад к выбору
          </button>
          <HeadsLegsQuestionCheckStep
            stepId={`${stepId}-qcheck`}
            questionAsks={questionAsks}
            answerTransform={answerTransform}
            onComplete={() => setQuestionGatePassed(true)}
          />
        </div>
      );
    }

    const subSteps = findSubSteps(active);
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
        <button type="button" onClick={backToHub} className="mb-4 text-sm text-brand-purple hover:underline">
          ← Назад к выбору
        </button>
        {renderSubStep(sub, onSubComplete)}
      </div>
    );
  }

  return (
    <div data-testid="method-step-hub">
      <p className="mb-4 text-sm font-medium text-gray-800">Какой шаг сейчас нужно сделать?</p>
      <div className="mb-6 space-y-2">
        {actions.map((action) => {
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
              {labels[action as keyof typeof labels]}
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
          Осталось шагов: {actions.length - completed.size}
        </p>
      )}
    </div>
  );
}
