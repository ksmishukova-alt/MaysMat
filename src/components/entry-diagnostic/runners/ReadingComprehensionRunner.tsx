"use client";

import { useState } from "react";
import { TaskCard, answerColorAt } from "@/components/entry-diagnostic/ui";
import {
  emptyErrorTelemetry,
  pushUnique,
  type ErrorTelemetryBuckets,
} from "@/lib/entry-diagnostic/error-telemetry";
import { isDiagnosticFastMode } from "@/lib/entry-diagnostic/fast-mode";
import { withoutReadingOnlySteps } from "@/lib/entry-diagnostic/screen-sequence";
import type { DiagnosticRunnerProps } from "./RunnerCore";

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

  const steps = withoutReadingOnlySteps(task.screenSequence);
  const step = steps[stepIndex];

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

  const canContinue = (() => {
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
      condition={task.taskText}
      instruction={step?.kind === "single_select" ? step.prompt : undefined}
      options={options}
      selectedId={step?.kind === "single_select" ? (response[fieldKey] as string | undefined) : undefined}
      onSelect={(id) => pickChoice(id, correctChoiceId)}
      onNext={advance}
      nextDisabled={!canContinue}
      runnerKind={runnerKind}
      testAnswer={isDiagnosticFastMode() ? JSON.stringify(task.answer) : undefined}
    />
  );
}
