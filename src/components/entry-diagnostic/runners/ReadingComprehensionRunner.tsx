"use client";

import { useMemo, useState } from "react";
import type { ScreenStep } from "@/data/entry-diagnostic/types";
import { DiagnosticScreenShell } from "@/components/entry-diagnostic/DiagnosticScreenShell";
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

  const continueLabel = step?.kind === "condition_read" ? "Прочитал" : isLastStep ? "Готово" : "Дальше";

  const canContinue = (() => {
    if (step?.kind === "condition_read") return true;
    if (step?.kind === "single_select") {
      return response[step.fieldKey ?? "focus"] != null;
    }
    return true;
  })();

  const correctChoiceId = String(task.answer.focus ?? "");

  return (
    <DiagnosticScreenShell
      taskLabel={`Задание ${globalTaskIndex} из ${totalTasks}`}
      blockTitle="Чтение условия"
    >
      <div
        data-testid="diagnostic-runner"
        data-runner-kind="reading_comprehension_visual"
        data-test-answer={isDiagnosticFastMode() ? JSON.stringify(task.answer) : undefined}
      >
        {step?.kind === "condition_read" ? (
          <p className="text-lg leading-relaxed text-gray-900">{step.prompt}</p>
        ) : null}

        {step?.kind === "single_select" ? (
          <div>
            <p
              className="mb-3 rounded-xl border border-lavender-200 bg-lavender-50/90 px-4 py-3 text-sm leading-relaxed text-gray-800"
              data-testid="diagnostic-condition-banner"
            >
              {conditionText}
            </p>
            <p className="mb-4 text-lg font-medium text-gray-900">{step.prompt}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {(step.options ?? []).map((opt) => {
                const selected = response[step.fieldKey ?? "focus"] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    data-testid={`diagnostic-choice-${opt.id}`}
                    aria-label={opt.label}
                    onClick={() => pickChoice(opt.id, correctChoiceId)}
                    className={`min-h-14 rounded-2xl border-2 px-4 py-3 text-left text-sm leading-snug transition ${
                      selected
                        ? "border-brand-purple bg-lavender-50 font-medium text-brand-purple"
                        : "border-gray-200 bg-white hover:border-lavender-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            data-testid="diagnostic-task-continue"
            disabled={!canContinue}
            onClick={advance}
            className="min-h-11 rounded-xl bg-brand-purple px-8 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            {continueLabel}
          </button>
        </div>
      </div>
    </DiagnosticScreenShell>
  );
}
