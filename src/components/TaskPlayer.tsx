"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Task } from "@/data/tasks";
import { getTaskHelpVideo } from "@/data/videos";
import { completeTask, getTaskCompletion, logVideoEvent } from "@/lib/progress";
import { useProgress } from "@/lib/use-progress";
import { useTaskStore } from "@/lib/use-task-store";
import { buildPlayerSteps, type PlayerStep } from "@/lib/task-player-steps";
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
import { ProgressBar } from "./ProgressBar";

interface TaskPlayerProps {
  task: Task;
  totalTasksInBranch?: number;
}

export function TaskPlayer({ task, totalTasksInBranch = 50 }: TaskPlayerProps) {
  const router = useRouter();
  const startedAt = useRef(Date.now());
  const [stepIndex, setStepIndex] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [helpVideoUsed, setHelpVideoUsed] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  useTaskStore();
  const userProgress = useProgress();
  const priorCompletion = getTaskCompletion(task.id, userProgress);
  const playerSteps = useMemo(
    () =>
      buildPlayerSteps(task, {
        enableGivenStep: task.enableGivenStep ?? false,
        givenStep: task.givenStep,
      }),
    [task]
  );

  const step = playerSteps[stepIndex];
  const progress = ((stepIndex + 1) / playerSteps.length) * 100;
  const helpMeta = getTaskHelpVideo(task.id);
  const hideHeaderCondition =
    step.type === "read_condition" || step.type === "condition_parse";
  const isReadStep = step.type === "read_condition";

  const next = useCallback(() => {
    setHintMessage(null);
    setStepIndex((i) => (i < playerSteps.length - 1 ? i + 1 : i));
  }, [playerSteps.length]);

  const finish = useCallback(() => {
    let stars = hintsUsed === 0 ? 3 : hintsUsed === 1 ? 2 : 1;
    if (helpVideoUsed) stars = Math.min(stars, 3);
    const minutesSpent = Math.max(3, Math.round((Date.now() - startedAt.current) / 60000));
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

  const stepComplete = stepIndex === playerSteps.length - 1 ? finish : next;

  const showTextHint = () => {
    setHintsUsed((h) => h + 1);
    setHintMessage(step.hint ?? "Подумай: что дано в условии и что нужно найть?");
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
          Задача {task.number} · Этап {task.stage}
        </div>
        <h2 className="text-xl font-bold">{task.title}</h2>
        {!hideHeaderCondition ? (
          <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-gray-700">
            {task.condition}
          </p>
        ) : null}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {!isReadStep ? (
          <button
            type="button"
            onClick={showTextHint}
            className="rounded-xl border border-lavender-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-lavender-50"
          >
            💡 Подсказка
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
        {helpVideoUsed ? (
          <span className="self-center text-xs text-amber-600">После видео — максимум 3★</span>
        ) : null}
      </div>

      {hintMessage ? (
        <div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{hintMessage}</div>
      ) : null}

      <div className="mb-4">
        <ProgressBar
          value={Math.round(progress)}
          label={`Шаг ${stepIndex + 1} из ${playerSteps.length}`}
        />
      </div>

      <div
        className={`rounded-card bg-white p-6 shadow-card ${
          step.highlight ? "ring-2 ring-amber-300 ring-offset-2" : ""
        }`}
      >
        {!isReadStep ? <h3 className="mb-4 text-lg font-semibold">{step.title}</h3> : null}
        {step.hint && !hintMessage && !isReadStep ? (
          <p className="mb-4 text-sm text-gray-500">{step.hint}</p>
        ) : null}
        <StepRenderer
          key={step.id}
          step={step}
          taskTitle={task.title}
          condition={task.condition}
          onComplete={stepComplete}
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
}: {
  step: PlayerStep;
  taskTitle: string;
  condition: string;
  onComplete: () => void;
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
    default:
      return null;
  }
}
