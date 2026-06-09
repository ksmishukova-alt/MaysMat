"use client";

import { useState } from "react";
import type { DiagnosticTask, RunnerKind, ScreenStep } from "@/data/entry-diagnostic/types";
import { InteractiveRunnerBoard } from "@/components/entry-diagnostic/runners/boards";
import { EmbeddedCalculatorPanel } from "@/components/entry-diagnostic/runners/boards/boards-advanced";
import {
  emptyErrorTelemetry,
  pushUnique,
  type ErrorTelemetryBuckets,
} from "@/lib/entry-diagnostic/error-telemetry";
import { AnswerButton, DiagnosticTaskShell, answerColorAt } from "@/components/entry-diagnostic/ui";
import { isDiagnosticFastMode } from "@/lib/entry-diagnostic/fast-mode";
import { DIAGNOSTIC_MYSHMAT_POSE } from "@/data/entry-diagnostic/visual-assets";

export interface DiagnosticRunnerProps {
  task: DiagnosticTask;
  runnerKind: RunnerKind;
  blockIndex: number;
  blockTitle: string;
  globalTaskIndex?: number;
  totalTasks?: number;
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

/** Названия тем — для данных и отчёта, не показываем «уровень» в UI */
export const RUNNER_LABELS: Record<RunnerKind, string> = {
  reading_comprehension_visual: "Чтение условия",
  story_add_sub_visual: "Сложение и вычитание в сюжете",
  column_add_sub_visual: "Сложение и вычитание столбиком",
  column_multiplication_visual: "Умножение столбиком",
  long_division_visual: "Деление",
  remainder_interpretation_visual: "Остаток и округление",
  expression_order_visual_with_embedded_calculation: "Порядок действий",
  text_problem_plan_visual: "План текстовой задачи",
  motion_model_visual: "Путь, скорость, время",
  geometry_grid_visual: "Геометрия на сетке",
  fraction_model_visual: "Дроби",
  percent_model_visual: "Проценты",
  logic_if_then_visual: "Логика «если — то»",
  systematic_search_visual: "Системный перебор",
  pattern_cycle_visual: "Закономерности и циклы",
};

function stepInstruction(step: ScreenStep | undefined, taskText: string): string | undefined {
  if (!step) return undefined;
  if (step.kind === "read_prompt" || step.kind === "condition_read") return undefined;
  if (step.prompt === taskText) return undefined;
  if (step.kind === "confirm_submit") return step.prompt;
  return step.prompt;
}

function canAdvanceStep(
  step: ScreenStep | undefined,
  response: Record<string, unknown>,
  planSteps: string[],
): boolean {
  if (!step) return false;
  switch (step.kind) {
    case "read_prompt":
    case "condition_read":
      return true;
    case "number_input":
    case "text_input": {
      const key = step.fieldKey ?? "value";
      const val = response[key];
      return val != null && String(val).trim() !== "";
    }
    case "single_select":
      return response[step.fieldKey ?? "value"] != null;
    case "action_count_hypothesis":
      return typeof response.actionCount === "number";
    case "action_plan_builder": {
      const count = Number(response.actionCount ?? 1);
      return planSteps.length >= Math.max(1, count);
    }
    default:
      return true;
  }
}

function continueLabel(step: ScreenStep | undefined): string {
  if (step?.kind === "confirm_submit") return "Готово";
  return "Далее →";
}

export function DiagnosticRunnerCore({
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

  const mascotSrc =
    step?.kind === "read_prompt" || step?.kind === "condition_read"
      ? DIAGNOSTIC_MYSHMAT_POSE.taskRead
      : DIAGNOSTIC_MYSHMAT_POSE.taskChoice;

  return (
    <DiagnosticTaskShell
      currentTask={globalTaskIndex}
      totalTasks={totalTasks}
      currentTheme={blockIndex}
      themeTitle={blockTitle}
      condition={task.taskText}
      instruction={stepInstruction(step, task.taskText)}
      onNext={advance}
      nextDisabled={!canAdvanceStep(step, response, planSteps)}
      nextLabel={continueLabel(step)}
      mascotSrc={mascotSrc}
      runnerKind={runnerKind}
      testAnswer={isDiagnosticFastMode() ? JSON.stringify(task.answer) : undefined}
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
    </DiagnosticTaskShell>
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
  step: ScreenStep | undefined;
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
  if (!step) return null;

  switch (step.kind) {
    case "read_prompt":
    case "condition_read":
      return null;
    case "visual_board":
      return (
        <div className="diagnostic-card diagnostic-task__workspace">
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
        <div className="diagnostic-card diagnostic-task__workspace">
          <label className="diagnostic-task-input">
            <span className="diagnostic-task-input__label">{step.prompt}</span>
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
              className="diagnostic-task-input__field"
            />
          </label>
        </div>
      );
    case "single_select":
      return (
        <div className="diagnostic-answer-grid">
          {(step.options ?? []).map((opt, index) => {
            const selected = response[step.fieldKey ?? "value"] === opt.id;
            return (
              <AnswerButton
                key={opt.id}
                testId={`diagnostic-choice-${opt.id}`}
                aria-label={opt.label}
                color={answerColorAt(index)}
                selected={selected}
                onClick={() => onPatch(step.fieldKey ?? "value", opt.id)}
              >
                {opt.label}
              </AnswerButton>
            );
          })}
        </div>
      );
    case "action_count_hypothesis":
      return (
        <div className="diagnostic-card diagnostic-task__workspace">
          <div className="diagnostic-hypothesis-grid">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} действий`}
                onClick={() => onHypothesis(n)}
                className={`diagnostic-hypothesis-btn${
                  response.actionCount === n ? " diagnostic-hypothesis-btn--active" : ""
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
        <div className="diagnostic-card diagnostic-task__workspace">
          <ul className="diagnostic-plan-list">
            {planSteps.map((s, i) => (
              <li key={i} className="diagnostic-plan-list__item">
                {i + 1}. {s}
              </li>
            ))}
          </ul>
          <div className="diagnostic-plan-actions">
            <button type="button" onClick={onAddPlanStep} className="diagnostic-secondary-button">
              + Добавить действие
            </button>
            <button
              type="button"
              onClick={onRemovePlanStep}
              disabled={!planSteps.length}
              className="diagnostic-secondary-button diagnostic-secondary-button--muted"
            >
              − Убрать
            </button>
          </div>
        </div>
      );
    case "embedded_calculator":
      return (
        <div className="diagnostic-card diagnostic-task__workspace">
          <EmbeddedCalculatorPanel
            response={response}
            onPatch={onPatch}
            onRecordError={onRecordError}
          />
        </div>
      );
    case "confirm_submit":
      return null;
    default:
      return step.prompt ? (
        <div className="diagnostic-card diagnostic-task__workspace">
          <p className="diagnostic-task__hint">{step.prompt}</p>
        </div>
      ) : null;
  }
}
