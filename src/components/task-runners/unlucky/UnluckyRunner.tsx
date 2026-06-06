"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Task } from "@/data/tasks";
import { buildUnluckySteps, unluckyIntroTemplate } from "@/data/dirichlet/unlucky/build-unlucky-steps";
import type { UnluckyModel, UnluckyStep } from "@/data/dirichlet/unlucky/types";
import { AutoExplanationStep } from "@/components/task-steps/AutoExplanationStep";
import { ReadConditionStep } from "@/components/task-steps/ReadConditionStep";
import { TaskScreenShell } from "@/components/task-steps/TaskScreenShell";
import { ProgressBar } from "@/components/ProgressBar";
import { GuaranteeGoalStep } from "./GuaranteeGoalStep";
import { WorstCaseBuildStep } from "./WorstCaseBuildStep";
import { GuaranteeThresholdStep } from "./GuaranteeThresholdStep";
import { UnluckyExplainStep } from "./UnluckyExplainStep";
import { UnluckyWriteSolutionStep } from "./UnluckyWriteSolutionStep";
import { completeTask, getTaskCompletion } from "@/lib/progress";
import { useProgress } from "@/lib/use-progress";
import {
  clearTaskSession,
  createTaskSession,
  loadTaskSession,
  saveTaskSession,
} from "@/lib/task-session";
import { highlightConditionText } from "@/lib/highlight-condition";

interface UnluckyRunnerProps {
  task: Task;
  totalTasksInBranch?: number;
}

export function UnluckyRunner({ task, totalTasksInBranch = 1 }: UnluckyRunnerProps) {
  const router = useRouter();
  const meta = task.dirichletMeta;
  const model = meta?.unluckyModel;

  const steps = useMemo(() => {
    if (!meta) return [];
    return buildUnluckySteps(meta);
  }, [meta]);

  const priorSession = useMemo(() => {
    if (typeof window === "undefined") return null;
    const s = loadTaskSession(task.id);
    if (!s || s.status === "completed") return null;
    return s;
  }, [task.id]);

  const startedAt = useRef(
    priorSession ? new Date(priorSession.startedAt).getTime() : Date.now(),
  );
  const [stepIndex, setStepIndex] = useState(() =>
    Math.min(priorSession?.stepIndex ?? 0, Math.max(0, steps.length - 1)),
  );
  const [maxWithoutSuccess, setMaxWithoutSuccess] = useState(model?.maxWithoutSuccess ?? 0);

  const userProgress = useProgress();
  const priorCompletion = getTaskCompletion(task.id, userProgress);
  const step = steps[stepIndex];
  const progressPct = steps.length ? ((stepIndex + 1) / steps.length) * 100 : 0;

  const persistSession = useCallback(
    (index: number) => {
      const base = loadTaskSession(task.id) ?? createTaskSession(task.id);
      saveTaskSession({
        ...base,
        taskId: task.id,
        stepIndex: index,
        startedAt: base.startedAt,
        status: "in_progress",
      });
    },
    [task.id],
  );

  useEffect(() => {
    if (priorCompletion || !step) return;
    persistSession(stepIndex);
  }, [stepIndex, priorCompletion, persistSession, step]);

  const finish = useCallback(() => {
    const minutesSpent = Math.max(3, Math.round((Date.now() - startedAt.current) / 60000));
    clearTaskSession(task.id);
    completeTask(task.id, task.branchId, 3, task.number, totalTasksInBranch, {
      minutesSpent,
      taskTitle: task.title,
    });
    router.push(`/tasks/${task.id}/result?stars=3`);
  }, [router, task, totalTasksInBranch]);

  const advance = useCallback(() => {
    if (stepIndex >= steps.length - 1) {
      finish();
      return;
    }
    setStepIndex((i) => i + 1);
  }, [stepIndex, steps.length, finish]);

  if (!model || !meta) {
    return (
      <p className="text-sm text-red-600">Нет данных unluckyModel для задачи {task.id}</p>
    );
  }

  if (!step) return null;

  return (
    <div className="mx-auto max-w-2xl">
      {priorCompletion ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-sm">
          <span className="font-medium text-emerald-800">✓ Эта задача уже решена</span>
          <Link
            href={`/tasks/${task.id}/result?stars=${priorCompletion.stars}`}
            className="text-brand-purple hover:underline"
          >
            Смотреть печать
          </Link>
        </div>
      ) : null}

      <div className="mb-6 rounded-card bg-white p-6 shadow-card">
        <div className="mb-2 text-xs font-medium text-brand-purple">
          Метод неудачника · Задача {task.number}
        </div>
        <h2 className="text-xl font-bold">{task.title}</h2>
        <p className="mt-1 text-sm text-gray-500">Учимся искать самый неудачный расклад</p>
        {step.kind !== "read_condition" ? (
          <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-gray-700">
            {highlightConditionText(task.condition, "dirichlet")}
          </p>
        ) : null}
      </div>

      <div className="mb-4">
        <ProgressBar
          value={Math.round(progressPct)}
          label={`Шаг ${stepIndex + 1} из ${steps.length}`}
        />
      </div>

      <div className="rounded-card bg-white p-6 shadow-card">
        <TaskScreenShell
          phaseTitle={step.title}
          phaseIndex={step.screenPhaseIndex}
          phaseCount={step.screenPhaseCount}
          showPhaseHeader
          stepTitle={step.kind !== "read_condition" ? step.title : undefined}
          showStepTitle={step.kind !== "read_condition"}
        >
          <UnluckyStepBody
            step={step}
            task={task}
            model={model}
            maxWithoutSuccess={maxWithoutSuccess}
            onMaxWithoutSuccess={setMaxWithoutSuccess}
            onAdvance={advance}
            onFinish={finish}
          />
        </TaskScreenShell>
      </div>
    </div>
  );
}

function UnluckyStepBody({
  step,
  task,
  model,
  maxWithoutSuccess,
  onMaxWithoutSuccess,
  onAdvance,
  onFinish,
}: {
  step: UnluckyStep;
  task: Task;
  model: UnluckyModel;
  maxWithoutSuccess: number;
  onMaxWithoutSuccess: (n: number) => void;
  onAdvance: () => void;
  onFinish: () => void;
}) {
  switch (step.kind) {
    case "intro_video":
      return (
        <AutoExplanationStep
          template={unluckyIntroTemplate()}
          role="intro"
          onComplete={onAdvance}
        />
      );
    case "read_condition":
      return (
        <ReadConditionStep
          stepId={step.id}
          title={task.title}
          condition={task.condition}
          enableTts
          highlightVariant="dirichlet"
          onComplete={onAdvance}
        />
      );
    case "guarantee_goal":
      return <GuaranteeGoalStep stepId={step.id} model={model} onComplete={onAdvance} />;
    case "worst_case":
      return (
        <WorstCaseBuildStep
          stepId={step.id}
          model={model}
          onComplete={(max) => {
            onMaxWithoutSuccess(max);
            onAdvance();
          }}
        />
      );
    case "guarantee_plus_one":
      return (
        <GuaranteeThresholdStep
          stepId={step.id}
          model={model}
          maxWithoutSuccess={maxWithoutSuccess}
          onComplete={onAdvance}
        />
      );
    case "explain_why_less_fails":
      return (
        <UnluckyExplainStep
          stepId={step.id}
          model={model}
          maxWithoutSuccess={maxWithoutSuccess}
          onComplete={onAdvance}
        />
      );
    case "write_solution":
      return (
        <UnluckyWriteSolutionStep stepId={step.id} model={model} onComplete={onAdvance} />
      );
    case "finish":
      return (
        <AutoExplanationStep
          template={["Проверь решение:", ...model.explanation]}
          role="preview"
          onComplete={onFinish}
        />
      );
    default:
      return null;
  }
}
