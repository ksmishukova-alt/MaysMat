"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Task } from "@/data/tasks";
import {
  buildRemaindersSteps,
  remaindersIntroTemplate,
} from "@/data/dirichlet/remainders/build-remainders-steps";
import type { RemaindersModel, RemaindersStep } from "@/data/dirichlet/remainders/types";
import { getMethodRule } from "@/data/method-rules";
import { MethodRuleModal, MethodRuleScreen } from "@/components/method/MethodRuleScreen";
import { AutoExplanationStep } from "@/components/task-steps/AutoExplanationStep";
import { ReadConditionStep } from "@/components/task-steps/ReadConditionStep";
import { TaskScreenShell } from "@/components/task-steps/TaskScreenShell";
import { ProgressBar } from "@/components/ProgressBar";
import { RemainderModulusStep } from "./RemainderModulusStep";
import { RemaindersHousesStep } from "./RemaindersHousesStep";
import { RemainderObjectsStep } from "./RemainderObjectsStep";
import { RemainderCollisionStep } from "./RemainderCollisionStep";
import { RemainderDivisibilityExplainStep } from "./RemainderDivisibilityExplainStep";
import { RemaindersWriteSolutionStep } from "./RemaindersWriteSolutionStep";
import { RemainderHousesCountQuizStep } from "./RemainderHousesCountQuizStep";
import { completeTask, getTaskCompletion } from "@/lib/progress";
import { useProgress } from "@/lib/use-progress";
import {
  clearTaskSession,
  createTaskSession,
  loadTaskSession,
  saveTaskSession,
} from "@/lib/task-session";
import { highlightConditionText } from "@/lib/highlight-condition";
import { resolveChildRouteDisplayNumber } from "@/lib/branch-task-filter";
import { useResolvedTasksForBranch } from "@/lib/use-task-store";
import { RemainderDivisibilityExampleStep } from "./RemainderDivisibilityExampleStep";
import { RemainderMethodChooseStep } from "./RemainderMethodChooseStep";
import { isCompactRuleScreen } from "@/data/dirichlet/remainders/progression";

interface RemaindersRunnerProps {
  task: Task;
  totalTasksInBranch?: number;
}

export function RemaindersRunner({ task, totalTasksInBranch = 1 }: RemaindersRunnerProps) {
  const router = useRouter();
  const meta = task.dirichletMeta;
  const model = meta?.remaindersModel;
  const ruleInstance = model?.ruleInstance;
  const methodRule = ruleInstance ? getMethodRule(ruleInstance.ruleId) : undefined;

  const steps = useMemo(() => {
    if (!meta?.remaindersModel) return [];
    return buildRemaindersSteps(meta);
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
  const [ruleModalOpen, setRuleModalOpen] = useState(false);

  const branchTasks = useResolvedTasksForBranch(task.branchId);
  const displayNumber = resolveChildRouteDisplayNumber(task, branchTasks);
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
      <p className="text-sm text-red-600">Нет данных remaindersModel для задачи {task.id}</p>
    );
  }

  if (!step) return null;

  const profile = model.progressionProfile ?? 1;
  const showHelpRule = methodRule && ruleInstance && profile <= 2;
  const hideHeaderCondition = step.kind === "read_condition" || step.kind === "method_rule";

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
          Остатки · Задача {displayNumber}
        </div>
        <h2 className="text-xl font-bold">{task.title}</h2>
        <p className="mt-1 text-sm text-gray-500">Числа живут в домиках для остатков</p>
        {!hideHeaderCondition ? (
          <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-gray-700">
            {highlightConditionText(task.condition, "dirichlet")}
          </p>
        ) : null}
      </div>

      {showHelpRule ? (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setRuleModalOpen(true)}
            className="rounded-xl border border-lavender-200 bg-lavender-50 px-4 py-2 text-sm font-medium text-brand-purple hover:bg-lavender-100"
          >
            {methodRule.helpButtonLabel}
          </button>
        </div>
      ) : null}

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
          stepTitle={
            step.kind !== "read_condition" && step.kind !== "method_rule" ? step.title : undefined
          }
          showStepTitle={step.kind !== "read_condition" && step.kind !== "method_rule"}
        >
          <RemaindersStepBody
            step={step}
            task={task}
            model={model}
            methodRule={methodRule}
            ruleInstance={ruleInstance}
            onAdvance={advance}
            onFinish={finish}
          />
        </TaskScreenShell>
      </div>

      {showHelpRule && ruleInstance ? (
        <MethodRuleModal
          open={ruleModalOpen}
          rule={methodRule}
          instance={ruleInstance}
          onClose={() => setRuleModalOpen(false)}
        />
      ) : null}
    </div>
  );
}

function RemaindersStepBody({
  step,
  task,
  model,
  methodRule,
  ruleInstance,
  onAdvance,
  onFinish,
}: {
  step: RemaindersStep;
  task: Task;
  model: RemaindersModel;
  methodRule?: ReturnType<typeof getMethodRule>;
  ruleInstance?: RemaindersModel["ruleInstance"];
  onAdvance: () => void;
  onFinish: () => void;
}) {
  switch (step.kind) {
    case "intro_video":
      return (
        <AutoExplanationStep
          template={remaindersIntroTemplate(model.modulus)}
          role="intro"
          onComplete={onAdvance}
        />
      );
    case "method_rule":
      if (!methodRule || !ruleInstance) {
        return <p className="text-sm text-red-600">Нет данных правила для задачи.</p>;
      }
      return (
        <MethodRuleScreen
          rule={methodRule}
          instance={ruleInstance}
          variant="step"
          compact={isCompactRuleScreen(model.progressionProfile ?? 1)}
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
    case "find_modulus":
      return <RemainderModulusStep stepId={step.id} model={model} onComplete={onAdvance} />;
    case "build_houses":
      return <RemaindersHousesStep stepId={step.id} model={model} onComplete={onAdvance} />;
    case "houses_count_quiz":
      return (
        <RemainderHousesCountQuizStep stepId={step.id} model={model} onComplete={onAdvance} />
      );
    case "identify_objects":
      return <RemainderObjectsStep stepId={step.id} model={model} onComplete={onAdvance} />;
    case "find_collision":
      return <RemainderCollisionStep stepId={step.id} model={model} onComplete={onAdvance} />;
    case "divisibility_example":
      return (
        <RemainderDivisibilityExampleStep modulus={model.modulus} onComplete={onAdvance} />
      );
    case "explain_divisibility":
      return (
        <RemainderDivisibilityExplainStep stepId={step.id} model={model} onComplete={onAdvance} />
      );
    case "choose_method":
      return (
        <RemainderMethodChooseStep
          stepId={step.id}
          task={task}
          model={model}
          onComplete={onAdvance}
        />
      );
    case "write_solution":
      return (
        <RemaindersWriteSolutionStep stepId={step.id} model={model} onComplete={onAdvance} />
      );
    case "finish":
      return (
        <AutoExplanationStep
          template={["Проверь решение:", model.conclusionTemplate]}
          role="preview"
          onComplete={onFinish}
        />
      );
    default:
      return null;
  }
}
