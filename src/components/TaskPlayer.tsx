"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Task } from "@/data/tasks";
import { getTaskHelpVideo } from "@/data/videos";
import { unlockPaperSolutionAchievement } from "@/lib/achievements";
import { completeTask, getTaskCompletion, logVideoEvent } from "@/lib/progress";
import { useProgress } from "@/lib/use-progress";
import { useTaskStore } from "@/lib/use-task-store";
import { buildPlayerSteps, type PlayerStep } from "@/lib/task-player-steps";
import {
  clearTaskSession,
  createTaskSession,
  loadTaskSession,
  recordStepAnswer,
  savePaperUploadData,
  saveTaskSession,
  type TaskSession,
  type TaskStepAnswer,
} from "@/lib/task-session";
import { VideoModal } from "@/components/VideoModal";
import { DragSelectStep } from "./task-steps/DragSelectStep";
import { ConditionParseStep } from "./task-steps/ConditionParseStep";
import { ReadConditionStep } from "./task-steps/ReadConditionStep";
import { OrderQuestionsStep } from "./task-steps/OrderQuestionsStep";
import { SingleSelectStep } from "./task-steps/SingleSelectStep";
import { WorksheetTableStep } from "./task-steps/WorksheetTableStep";
import { TableInputStep } from "./task-steps/TableInputStep";
import { NumberInputStep } from "./task-steps/NumberInputStep";
import { AutoExplanationStep } from "./task-steps/AutoExplanationStep";
import { PaperUploadStep } from "./task-steps/PaperUploadStep";
import { ProgressBar } from "./ProgressBar";

interface TaskPlayerProps {
  task: Task;
  totalTasksInBranch?: number;
}

export function TaskPlayer({ task, totalTasksInBranch = 50 }: TaskPlayerProps) {
  const router = useRouter();
  const playerSteps = useMemo(
    () =>
      buildPlayerSteps(task, {
        enableGivenStep: task.enableGivenStep ?? false,
        givenStep: task.givenStep,
      }),
    [task],
  );

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
    Math.min(priorSession?.stepIndex ?? 0, Math.max(0, playerSteps.length - 1)),
  );
  const [hintsUsed, setHintsUsed] = useState(priorSession?.hintsUsed ?? 0);
  const [helpVideoUsed, setHelpVideoUsed] = useState(priorSession?.helpVideoUsed ?? false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [resumed, setResumed] = useState(Boolean(priorSession && priorSession.stepIndex > 0));

  useTaskStore();
  const userProgress = useProgress();
  const priorCompletion = getTaskCompletion(task.id, userProgress);

  const persistSession = useCallback(
    (patch: Partial<TaskSession>) => {
      const base = loadTaskSession(task.id) ?? createTaskSession(task.id);
      saveTaskSession({
        ...base,
        ...patch,
        taskId: task.id,
        startedAt: base.startedAt,
        status: "in_progress",
      });
    },
    [task.id],
  );

  const step = playerSteps[stepIndex];
  const progressPct = ((stepIndex + 1) / playerSteps.length) * 100;
  const helpMeta = getTaskHelpVideo(task.id);
  const hideHeaderCondition =
    step?.type === "read_condition" || step?.type === "condition_parse";
  const isReadStep = step?.type === "read_condition";
  const maxHints = task.independenceLevel != null ? Math.max(0, 6 - task.independenceLevel) : 99;

  useEffect(() => {
    if (priorCompletion || !step) return;
    persistSession({ stepIndex, hintsUsed, helpVideoUsed });
  }, [stepIndex, hintsUsed, helpVideoUsed, priorCompletion, persistSession, step]);

  const finish = useCallback(() => {
    let stars = hintsUsed === 0 ? 3 : hintsUsed === 1 ? 2 : 1;
    if (helpVideoUsed) stars = Math.min(stars, 3);
    const minutesSpent = Math.max(3, Math.round((Date.now() - startedAt.current) / 60000));
    const session = loadTaskSession(task.id);
    if (session?.paperUpload) unlockPaperSolutionAchievement();
    clearTaskSession(task.id);
    completeTask(task.id, task.branchId, stars, task.number, totalTasksInBranch, {
      minutesSpent,
      taskTitle: task.title,
    });
    router.push(`/tasks/${task.id}/result?stars=${stars}`);
  }, [
    helpVideoUsed,
    hintsUsed,
    router,
    task.branchId,
    task.id,
    task.number,
    task.title,
    totalTasksInBranch,
  ]);

  const advanceStep = useCallback(
    (answer?: Pick<TaskStepAnswer, "value"> & Partial<TaskStepAnswer>) => {
      if (!step) return;
      setHintMessage(null);

      if (!priorCompletion) {
        const base = loadTaskSession(task.id) ?? createTaskSession(task.id);
        const withAnswer = recordStepAnswer(base, {
          stepId: step.id,
          stepType: step.type,
          value: answer?.value ?? "completed",
        });
        const nextIndex = Math.min(stepIndex + 1, playerSteps.length - 1);
        saveTaskSession({
          ...withAnswer,
          stepIndex: nextIndex,
          hintsUsed,
          helpVideoUsed,
          status: "in_progress",
        });
      }

      if (stepIndex >= playerSteps.length - 1) {
        finish();
      } else {
        setStepIndex((i) => i + 1);
      }
    },
    [
      step,
      priorCompletion,
      task.id,
      stepIndex,
      playerSteps.length,
      hintsUsed,
      helpVideoUsed,
      finish,
    ],
  );

  const showTextHint = () => {
    if (hintsUsed >= maxHints) {
      setHintMessage("На этом уровне самостоятельности подсказок больше нет — попробуй сам!");
      return;
    }
    setHintsUsed((h) => h + 1);
    setHintMessage(step?.hint ?? "Подумай: что дано в условии и что нужно найть?");
  };

  const openHelpVideo = () => {
    if (!helpMeta) return;
    setHelpVideoUsed(true);
    setHelpOpen(true);
    logVideoEvent("help_video_opened", {
      branchId: task.branchId,
      taskId: task.id,
      label: task.title,
    });
  };

  const restartTask = () => {
    clearTaskSession(task.id);
    setStepIndex(0);
    setHintsUsed(0);
    setHelpVideoUsed(false);
    setHintMessage(null);
    setResumed(false);
    startedAt.current = Date.now();
  };

  const handlePaperUpload = (payload: { fileName: string; mimeType: string; dataUrl: string }) => {
    savePaperUploadData(task.id, payload.dataUrl);
    const base = loadTaskSession(task.id) ?? createTaskSession(task.id);
    saveTaskSession({
      ...recordStepAnswer(base, {
        stepId: step.id,
        stepType: "paper_upload",
        value: { fileName: payload.fileName, mimeType: payload.mimeType },
      }),
      paperUpload: { fileName: payload.fileName, mimeType: payload.mimeType, stepId: step.id },
      stepIndex: stepIndex + 1,
      hintsUsed,
      helpVideoUsed,
    });
    unlockPaperSolutionAchievement();
    finish();
  };

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

      {resumed && !priorCompletion ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-200 bg-sky-50/80 px-4 py-3 text-sm">
          <span className="text-sky-900">
            Продолжаем с шага {stepIndex + 1} из {playerSteps.length}
            {priorSession?.answers.length
              ? ` · сохранено ответов: ${priorSession.answers.length}`
              : ""}
          </span>
          <button
            type="button"
            onClick={restartTask}
            className="font-medium text-brand-purple hover:underline"
          >
            Начать заново
          </button>
        </div>
      ) : null}

      <div className="mb-6 rounded-card bg-white p-6 shadow-card">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-brand-purple">
          <span>
            Задача {task.number} · Этап {task.stage}
          </span>
          {task.independenceLevel ? (
            <span className="rounded-full bg-lavender-100 px-2 py-0.5 text-brand-purple/90">
              Самостоятельность {task.independenceLevel}/5
            </span>
          ) : null}
          {task.requiresUpload ? (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">📸 с листочком</span>
          ) : null}
        </div>
        <h2 className="text-xl font-bold">{task.title}</h2>
        {!hideHeaderCondition ? (
          <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-gray-700">
            {task.condition}
          </p>
        ) : null}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {!isReadStep && step.type !== "paper_upload" ? (
          <button
            type="button"
            onClick={showTextHint}
            className="rounded-xl border border-lavender-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-lavender-50"
          >
            💡 Подсказка{maxHints < 99 ? ` (${hintsUsed}/${maxHints})` : ""}
          </button>
        ) : null}
        {helpMeta ? (
          <button
            type="button"
            onClick={openHelpVideo}
            className="rounded-xl border border-lavender-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-lavender-50"
          >
            🎬 Объяснение
          </button>
        ) : null}
      </div>

      {hintMessage ? (
        <div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{hintMessage}</div>
      ) : null}

      <div className="mb-4">
        <ProgressBar
          value={Math.round(progressPct)}
          label={`Шаг ${stepIndex + 1} из ${playerSteps.length}`}
        />
      </div>

      <div
        className={`rounded-card bg-white p-6 shadow-card ${
          step.highlight ? "ring-2 ring-amber-300 ring-offset-2" : ""
        }`}
      >
        {!isReadStep ? <h3 className="mb-4 text-lg font-semibold">{step.title}</h3> : null}
        {step.hint && !hintMessage && !isReadStep && step.type !== "paper_upload" ? (
          <p className="mb-4 text-sm text-gray-500">{step.hint}</p>
        ) : null}
        <StepRenderer
          key={step.id}
          step={step}
          taskTitle={task.title}
          condition={task.condition}
          onComplete={() => advanceStep()}
          onPaperUpload={handlePaperUpload}
        />
      </div>

      {helpMeta ? (
        <VideoModal
          open={helpOpen}
          onClose={() => setHelpOpen(false)}
          title="Объяснение"
          caption={helpMeta.helpCaption}
          videoUrl={helpMeta.helpVideoUrl}
          primaryLabel="Закрыть"
        />
      ) : null}
    </div>
  );
}

function StepRenderer({
  step,
  taskTitle,
  condition,
  onComplete,
  onPaperUpload,
}: {
  step: PlayerStep;
  taskTitle: string;
  condition: string;
  onComplete: () => void;
  onPaperUpload: (payload: { fileName: string; mimeType: string; dataUrl: string }) => void;
}) {
  switch (step.type) {
    case "read_condition":
      return (
        <ReadConditionStep
          stepId={step.id}
          title={taskTitle}
          condition={condition}
          onComplete={onComplete}
        />
      );
    case "condition_parse":
      return (
        <ConditionParseStep
          stepId={step.id}
          condition={condition}
          parseData={step.parseData!}
          onComplete={onComplete}
        />
      );
    case "drag_select":
      return (
        <DragSelectStep stepId={step.id} options={step.options!} onComplete={onComplete} />
      );
    case "single_select":
      return (
        <SingleSelectStep
          stepId={step.id}
          context={step.context}
          options={step.options!}
          prompt={step.selectPrompt}
          successMessage={step.successMessage}
          onComplete={onComplete}
        />
      );
    case "order_questions":
      return (
        <OrderQuestionsStep stepId={step.id} items={step.orderItems!} onComplete={onComplete} />
      );
    case "worksheet_table":
      return (
        <WorksheetTableStep
          stepId={step.id}
          rows={step.worksheetRows!}
          successMessage={step.successMessage}
          onComplete={onComplete}
        />
      );
    case "table_input":
      return (
        <TableInputStep
          stepId={step.id}
          rows={step.rows!}
          columnLabel={step.tableColumnLabel}
          onComplete={onComplete}
        />
      );
    case "number_input":
      return (
        <NumberInputStep
          stepId={step.id}
          context={step.context}
          question={step.question}
          answer={step.answer!}
          successMessage={step.successMessage}
          animation={step.animation}
          onComplete={onComplete}
        />
      );
    case "auto_explanation":
      return <AutoExplanationStep template={step.template!} onComplete={onComplete} />;
    case "paper_upload":
      return (
        <PaperUploadStep
          stepId={step.id}
          prompt={step.uploadPrompt ?? step.hint}
          onComplete={onPaperUpload}
        />
      );
    default:
      return null;
  }
}
