"use client";

import { useMemo, useState } from "react";
import type { ScreenStep } from "@/data/entry-diagnostic/types";
import { TaskCard, answerColorAt } from "@/components/entry-diagnostic/ui";
import { DIAGNOSTIC_MYSHMAT_POSE } from "@/data/entry-diagnostic/visual-assets";
import {
  emptyErrorTelemetry,
  pushUnique,
  type ErrorTelemetryBuckets,
} from "@/lib/entry-diagnostic/error-telemetry";
import { isDiagnosticFastMode } from "@/lib/entry-diagnostic/fast-mode";
import type { DiagnosticRunnerProps } from "./RunnerCore";

function conditionTextFromSteps(steps: ScreenStep[]): string {
  const read = steps.find((s) => s.kind === "condition_read");
  return read?.prompt ?? "";
}

export function ReadingComprehensionRunner({
  task,
  runnerKind,
  blockIndex,
  blockTitle,
  globalTaskIndex = 1,
  totalTasks = 45,
  onComplete,
}: DiagnosticRunnerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [response, setResponse] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<ErrorTelemetryBuckets>(emptyErrorTelemetry);

  const steps = task.screenSequence;
  const step = steps[stepIndex];
  const conditionText = useMemo(() => conditionTextFromSteps(steps), [steps]);
  const isLastStep = stepIndex === steps.length - 1;

  const recordError = (bucket: keyof ErrorTelemetryBuckets, code: string) => {
    setErrors((prev) => ({
      ...prev,
      [bucket]: pushUnique(prev[bucket], code),
    }));
  };

  const patchField = (key: string, value: unknown) => {
    setResponse((prev) => ({ ...prev, [key]: value }));
  };

  const finish = () => {
    onComplete(response, {
      initialActionCount: undefined,
      finalActionCount: undefined,
      actionCountRevised: false,
      selfCorrection: false,
      ...errors,
    });
  };

  const advance = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
      return;
    }
    finish();
  };

  const pickChoice = (optionId: string, correctId: string) => {
    patchField(step?.fieldKey ?? "focus", optionId);
    if (optionId !== correctId) {
      recordError("readingErrors", "question_focus_error");
    }
  };

  const continueLabel =
    step?.kind === "condition_read" ? "Прочитал" : isLastStep ? "Готово" : "Далее →";

  const canContinue = (() => {
    if (step?.kind === "condition_read") return true;
    if (step?.kind === "single_select") {
      return response[step.fieldKey ?? "focus"] != null;
    }
    return true;
  })();

  const correctChoiceId = String(task.answer.focus ?? "");
  const fieldKey = step?.fieldKey ?? "focus";

  const options =
    step?.kind === "single_select"
      ? (step.options ?? []).map((opt, index) => ({
          id: opt.id,
          text: opt.label,
          color: answerColorAt(index),
        }))
      : [];

  return (
    <TaskCard
      currentTask={globalTaskIndex}
      totalTasks={totalTasks}
      currentTheme={blockIndex}
      themeTitle={blockTitle}
      condition={step?.kind === "condition_read" ? (step.prompt ?? "") : conditionText}
      instruction={step?.kind === "single_select" ? step.prompt : undefined}
      options={options}
      selectedId={step?.kind === "single_select" ? (response[fieldKey] as string | undefined) : undefined}
      onSelect={(id) => pickChoice(id, correctChoiceId)}
      onNext={advance}
      nextDisabled={!canContinue}
      nextLabel={continueLabel}
      mascotSrc={
        step?.kind === "condition_read"
          ? DIAGNOSTIC_MYSHMAT_POSE.taskRead
          : DIAGNOSTIC_MYSHMAT_POSE.taskChoice
      }
      runnerKind={runnerKind}
      testAnswer={isDiagnosticFastMode() ? JSON.stringify(task.answer) : undefined}
    />
  );
}
