"use client";

import React, { useState } from "react";
import type { DiagnosticTask, RunnerKind, ScreenStep } from "@/data/entry-diagnostic/types";
import { TaskScreenShell } from "@/components/task-steps/TaskScreenShell";
import { InteractiveRunnerBoard } from "@/components/entry-diagnostic/runners/boards";
import { EmbeddedCalculatorPanel } from "@/components/entry-diagnostic/runners/boards/boards-advanced";
import {
  emptyErrorTelemetry,
  pushUnique,
  type ErrorTelemetryBuckets,
} from "@/lib/entry-diagnostic/error-telemetry";
import { isDiagnosticFastMode } from "@/lib/entry-diagnostic/fast-mode";

const DIFFICULTY_LABEL: Record<DiagnosticTask["difficulty"], string> = {
  D1: "Уровень 1",
  D2: "Уровень 2",
  D3: "Уровень 3",
};

export const RUNNER_LABELS: Record<RunnerKind, string> = {
  reading_comprehension_visual: "Чтение условия",
  story_add_sub_visual: "Сложение и вычитание в сюжете",
  column_add_sub_visual: "Столбик: сложение и вычитание",
  column_multiplication_visual: "Столбик: умножение",
  long_division_visual: "Деление (школьная запись)",
  remainder_interpretation_visual: "Остаток и смысл",
  expression_order_visual_with_embedded_calculation: "Порядок действий + помощники",
  text_problem_plan_visual: "План текстовой задачи",
  motion_model_visual: "Путь · скорость · время",
  geometry_grid_visual: "Геометрия на сетке",
  fraction_model_visual: "Дроби",
  percent_model_visual: "Проценты",
  logic_if_then_visual: "Логика если-то",
  systematic_search_visual: "Системный перебор",
  pattern_cycle_visual: "Закономерности и циклы",
};

export interface DiagnosticRunnerProps {
  task: DiagnosticTask;
  runnerKind: RunnerKind;
  blockIndex: number;
  onComplete: (response: Record<string, unknown>, meta: RunnerSubmitMeta) => void;
}

export interface RunnerSubmitMeta {
  initialActionCount?: number;
  finalActionCount?: number;
  actionCountRevised: boolean;
  selfCorrection: boolean;
  computationErrors: string[];
  orderErrors: string[];
  readingErrors: string[];
  dataErrors: string[];
  unitErrors: string[];
}

export function DiagnosticRunnerCore({
  task,
  runnerKind,
  blockIndex,
  onComplete,
}: DiagnosticRunnerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [response, setResponse] = useState<Record<string, unknown>>({});
  const [initialActionCount, setInitialActionCount] = useState<number | undefined>();
  const [planSteps, setPlanSteps] = useState<string[]>([]);
  const [planEdited, setPlanEdited] = useState(false);
  const [errors, setErrors] = useState<ErrorTelemetryBuckets>(emptyErrorTelemetry);

  const steps = task.screenSequence;
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

  const advance = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
      return;
    }
    const finalActionCount =
      typeof response.actionCount === "number" ? response.actionCount : undefined;
    onComplete(
      { ...response, plan: planSteps.length ? planSteps : response.plan },
      {
        initialActionCount,
        finalActionCount,
        actionCountRevised:
          initialActionCount != null &&
          finalActionCount != null &&
          initialActionCount !== finalActionCount,
        selfCorrection: planEdited,
        ...errors,
      },
    );
  };

  return (
    <TaskScreenShell
      showPhaseHeader
      phaseTitle={`Блок ${blockIndex} · ${RUNNER_LABELS[runnerKind]}`}
      phaseIndex={blockIndex}
      phaseCount={15}
      showStepTitle
      stepTitle={task.taskText}
      subStepLabel={`${DIFFICULTY_LABEL[task.difficulty]} · шаг ${stepIndex + 1} из ${steps.length}`}
    >
      <div
        data-testid="diagnostic-runner"
        data-runner-kind={runnerKind}
        data-test-answer={isDiagnosticFastMode() ? JSON.stringify(task.answer) : undefined}
      >
        <RunnerStepBody
          step={step}
          task={task}
          response={response}
          planSteps={planSteps}
          runnerKind={runnerKind}
          onPatch={patchField}
          onRecordError={recordError}
          onHypothesis={(n) => {
            if (initialActionCount != null && initialActionCount !== n) {
              recordError("orderErrors", "action_count_revised");
            }
            setInitialActionCount((prev) => (prev == null ? n : prev));
            patchField("actionCount", n);
          }}
          onAddPlanStep={() => {
            setPlanSteps((p) => [...p, `действие ${p.length + 1}`]);
            setPlanEdited(true);
          }}
          onRemovePlanStep={() => {
            setPlanSteps((p) => p.slice(0, -1));
            setPlanEdited(true);
          }}
        />
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            data-testid="diagnostic-task-continue"
            onClick={advance}
            className="min-h-11 min-w-11 rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-medium text-white"
          >
            {step?.kind === "confirm_submit" ? "Отправить и дальше" : "Дальше"}
          </button>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          Диагностика: правильность не показываем до конца.
        </p>
      </div>
    </TaskScreenShell>
  );
}

function RunnerStepBody({
  step,
  task,
  response,
  planSteps,
  runnerKind,
  onPatch,
  onRecordError,
  onHypothesis,
  onAddPlanStep,
  onRemovePlanStep,
}: {
  step: ScreenStep;
  task: DiagnosticTask;
  response: Record<string, unknown>;
  planSteps: string[];
  runnerKind: RunnerKind;
  onPatch: (key: string, value: unknown) => void;
  onRecordError: (bucket: keyof ErrorTelemetryBuckets, code: string) => void;
  onHypothesis: (n: number) => void;
  onAddPlanStep: () => void;
  onRemovePlanStep: () => void;
}) {
  switch (step.kind) {
    case "read_prompt":
      return <p className="text-sm leading-relaxed text-gray-700">{step.prompt}</p>;
    case "visual_board":
      return (
        <div>
          <p className="mb-3 text-sm text-gray-600">{step.prompt}</p>
          <InteractiveRunnerBoard
            task={task}
            runnerKind={runnerKind}
            response={response}
            onPatch={onPatch}
            onRecordError={onRecordError}
          />
        </div>
      );
    case "number_input":
    case "text_input":
      return (
        <label className="block">
          <span className="mb-2 block text-sm font-medium">{step.prompt}</span>
          <input
            type={step.kind === "number_input" ? "number" : "text"}
            aria-label={step.prompt}
            placeholder={step.placeholder}
            value={String(response[step.fieldKey ?? "value"] ?? "")}
            onChange={(e) =>
              onPatch(
                step.fieldKey ?? "value",
                step.kind === "number_input" ? Number(e.target.value) : e.target.value,
              )
            }
            className="min-h-11 w-full max-w-xs rounded-xl border border-lavender-200 px-4 py-2"
          />
        </label>
      );
    case "single_select":
      return (
        <div>
          <p className="mb-3 text-sm">{step.prompt}</p>
          <div className="flex flex-wrap gap-2">
            {(step.options ?? []).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onPatch(step.fieldKey ?? "value", opt.id)}
                className={`min-h-11 rounded-xl border-2 px-4 py-2 text-sm ${
                  response[step.fieldKey ?? "value"] === opt.id
                    ? "border-brand-purple bg-lavender-50"
                    : "border-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      );
    case "action_count_hypothesis":
      return (
        <div>
          <p className="mb-3 text-sm">{step.prompt}</p>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} действий`}
                onClick={() => onHypothesis(n)}
                className={`min-h-11 min-w-11 rounded-xl border-2 px-4 py-2 text-sm font-medium ${
                  response.actionCount === n
                    ? "border-brand-purple bg-lavender-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      );
    case "action_plan_builder":
      return (
        <div>
          <p className="mb-3 text-sm">{step.prompt}</p>
          <ul className="mb-3 space-y-2">
            {planSteps.map((s, i) => (
              <li key={i} className="rounded-lg bg-lavender-50 px-3 py-2 text-sm">
                {i + 1}. {s}
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onAddPlanStep}
              className="min-h-11 rounded-xl border border-brand-purple px-4 text-sm text-brand-purple"
            >
              + Добавить действие
            </button>
            <button
              type="button"
              onClick={onRemovePlanStep}
              disabled={!planSteps.length}
              className="min-h-11 rounded-xl border border-gray-200 px-4 text-sm disabled:opacity-40"
            >
              − Убрать
            </button>
          </div>
        </div>
      );
    case "embedded_calculator":
      return (
        <div>
          <p className="mb-2 text-sm">{step.prompt}</p>
          <EmbeddedCalculatorPanel
            response={response}
            onPatch={onPatch}
            onRecordError={onRecordError}
          />
        </div>
      );
    case "confirm_submit":
      return <p className="text-sm text-gray-600">{step.prompt}</p>;
    default:
      return <p className="text-sm">{step.prompt}</p>;
  }
}
