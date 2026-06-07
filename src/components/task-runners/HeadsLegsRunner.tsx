"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Task } from "@/data/tasks";
import { getMethodRule } from "@/data/method-rules";
import {
  buildHeadsLegsPlayerSteps,
  isHeadsLegsProgressionTask,
  type HeadsLegsExtendedPlayerStep,
} from "@/data/heads-legs/base-pattern/build-player-steps";
import {
  HeadsLegsMethodRuleModal,
  HeadsLegsMethodRuleScreen,
} from "@/components/method/HeadsLegsMethodRuleScreen";
import { HeadsLegsMethodChooseStep } from "@/components/task-runners/heads-legs/HeadsLegsMethodChooseStep";
import { HeadsLegsQuestionCheckStep } from "@/components/task-runners/heads-legs/HeadsLegsQuestionCheckStep";
import { HeadsLegsDerivePreludeStep } from "@/components/task-runners/heads-legs/HeadsLegsDerivePreludeStep";
import { HeadsLegsDualPathAssumeStep } from "@/components/task-runners/heads-legs/HeadsLegsDualPathAssumeStep";
import { MatchTotalStep } from "@/components/task-runners/heads-legs/MatchTotalStep";
import { ScoreQuestionCheckStep } from "@/components/task-runners/heads-legs/ScoreQuestionCheckStep";
import { ScoreReplacementStep } from "@/components/task-runners/heads-legs/ScoreReplacementStep";
import { DigitalTaskPlayer } from "@/components/TaskPlayer";
import { AutoExplanationStep } from "@/components/task-steps/AutoExplanationStep";
import { ReadConditionStep } from "@/components/task-steps/ReadConditionStep";
import { TaskScreenShell } from "@/components/task-steps/TaskScreenShell";
import { ProgressBar } from "@/components/ProgressBar";
import { DragSelectStep } from "@/components/task-steps/DragSelectStep";
import { ConditionParseStep } from "@/components/task-steps/ConditionParseStep";
import { OrderQuestionsStep } from "@/components/task-steps/OrderQuestionsStep";
import { SingleSelectStep } from "@/components/task-steps/SingleSelectStep";
import { WorksheetTableStep } from "@/components/task-steps/WorksheetTableStep";
import { TableInputStep } from "@/components/task-steps/TableInputStep";
import { NumberInputStep } from "@/components/task-steps/NumberInputStep";
import { WordSolutionStep } from "@/components/task-steps/WordSolutionStep";
import { resolveExplanationRole } from "@/data/task-steps";
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
import { isCompactRuleScreen } from "@/data/heads-legs/base-pattern/progression";
import { resolveHeadsLegsPilot } from "@/data/heads-legs/pilot/resolve";
import {
  hasDualAssumePath,
  resolveDualAssumeSolutionLines,
} from "@/data/heads-legs/derive-pattern/dual-assume-paths";
import { buildSolutionPreviewLines } from "@/data/heads-legs/guided/solution-preview";

interface HeadsLegsRunnerProps {
  task: Task;
  totalTasksInBranch?: number;
}

export function HeadsLegsRunner({ task, totalTasksInBranch = 51 }: HeadsLegsRunnerProps) {
  if (!isHeadsLegsProgressionTask(task)) {
    return <DigitalTaskPlayer task={task} totalTasksInBranch={totalTasksInBranch} />;
  }

  return (
    <HeadsLegsProgressionPlayer task={task} totalTasksInBranch={totalTasksInBranch} />
  );
}

function HeadsLegsProgressionPlayer({
  task,
  totalTasksInBranch = 51,
}: HeadsLegsRunnerProps) {
  const router = useRouter();
  const meta = task.headsLegsMeta!;
  const ruleInstance = meta.ruleInstance!;
  const pilot = resolveHeadsLegsPilot(meta.methodTaskId);
  const methodRule = getMethodRule(ruleInstance.ruleId);

  const playerSteps = useMemo(() => buildHeadsLegsPlayerSteps(task), [task]);

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
  const [assumePathIndex, setAssumePathIndex] = useState<0 | 1 | null>(null);
  const [ruleModalOpen, setRuleModalOpen] = useState(false);

  const branchTasks = useResolvedTasksForBranch(task.branchId);
  const displayNumber = resolveChildRouteDisplayNumber(task, branchTasks);
  const userProgress = useProgress();
  const priorCompletion = getTaskCompletion(task.id, userProgress);
  const step = playerSteps[stepIndex];
  const prevStep = stepIndex > 0 ? playerSteps[stepIndex - 1] : null;
  const progressPct = playerSteps.length ? ((stepIndex + 1) / playerSteps.length) * 100 : 0;

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
    if (stepIndex >= playerSteps.length - 1) {
      finish();
      return;
    }
    setStepIndex((i) => i + 1);
  }, [stepIndex, playerSteps.length, finish]);

  const goBack = useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const conditionStepIndex = useMemo(
    () => playerSteps.findIndex((s) => s.type === "read_condition"),
    [playerSteps],
  );

  const goToCondition = useCallback(() => {
    if (conditionStepIndex >= 0) setStepIndex(conditionStepIndex);
  }, [conditionStepIndex]);

  const restartTask = useCallback(() => {
    clearTaskSession(task.id);
    startedAt.current = Date.now();
    setAssumePathIndex(null);
    setStepIndex(0);
  }, [task.id]);

  if (!methodRule) {
    return (
      <p className="text-sm text-red-600">Нет данных правила для задачи {task.id}</p>
    );
  }

  if (!step) return null;

  const hideHeaderCondition =
    step.type === "read_condition" ||
    step.type === "hl_method_rule" ||
    step.type === "hl_intro" ||
    step.type === "hl_score_replacement" ||
    step.type === "hl_match_total";
  const showPhaseHeader =
    step.screenPhaseTitle != null && step.screenPhaseTitle !== prevStep?.screenPhaseTitle;
  const isReadStep = step.type === "read_condition";
  const branchSubtitle =
    pilot?.flowMode === "transfer"
      ? "Та же замена: по 2 или по 3"
      : pilot?.patternKind === "score"
        ? "Представим, что все одного типа"
        : pilot?.patternKind === "production"
          ? "Представим, что все сделали одинаково"
          : "Представим, что все одного вида";
  const stepHintText =
    step.type !== "hl_intro" &&
    step.type !== "hl_method_rule" &&
    step.type !== "hl_choose_method" &&
    step.type !== "hl_question_check" &&
    step.type !== "hl_score_question_check" &&
    step.type !== "hl_score_replacement" &&
    step.type !== "hl_match_total" &&
    step.type !== "read_condition" &&
    "hint" in step
      ? step.hint
      : undefined;

  return (
    <div className="mx-auto max-w-2xl" data-testid="task-runner-shell">
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
          Головы и ноги · Задача {displayNumber}
        </div>
        <h2 className="text-xl font-bold">{task.title}</h2>
        {pilot?.flowMode !== "transfer" ? (
          <p className="mt-1 text-sm text-gray-500">{branchSubtitle}</p>
        ) : null}
        {!hideHeaderCondition ? (
          <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-gray-700">
            {highlightConditionText(task.condition, "heads-legs")}
          </p>
        ) : null}
      </div>

      <div className="mb-4">
        <button
          type="button"
          data-testid="remember-rule-button"
          onClick={() => setRuleModalOpen(true)}
          className="rounded-xl border border-lavender-200 bg-lavender-50 px-4 py-2 text-sm font-medium text-brand-purple hover:bg-lavender-100"
        >
          {methodRule.helpButtonLabel}
        </button>
      </div>

      <div className="mb-4">
        <ProgressBar
          value={Math.round(progressPct)}
          label={`Шаг ${stepIndex + 1} из ${playerSteps.length}`}
        />
      </div>

      {!priorCompletion && stepIndex > 0 ? (
        <div className="mb-4 flex flex-wrap gap-2" data-testid="task-step-nav">
          <button
            type="button"
            onClick={goBack}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-lavender-200"
          >
            ← Назад
          </button>
          {conditionStepIndex >= 0 && stepIndex !== conditionStepIndex ? (
            <button
              type="button"
              onClick={goToCondition}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-lavender-200"
            >
              К условию
            </button>
          ) : null}
          <button
            type="button"
            onClick={restartTask}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-lavender-200"
          >
            Начать заново
          </button>
        </div>
      ) : null}

      <div className="rounded-card bg-white p-6 shadow-card">
        <TaskScreenShell
          phaseTitle={step.screenPhaseTitle}
          phaseIndex={step.screenPhaseIndex}
          phaseCount={step.screenPhaseCount}
          showPhaseHeader={showPhaseHeader}
          stepTitle={!isReadStep && step.type !== "hl_intro" && step.type !== "hl_method_rule" && step.type !== "hl_question_check" && step.type !== "hl_score_question_check" && step.type !== "hl_score_replacement" && step.type !== "hl_match_total" && step.type !== "hl_derive_prelude" ? step.title : undefined}
          hint={stepHintText && !isReadStep ? stepHintText : undefined}
          showStepTitle={!isReadStep && step.type !== "hl_intro" && step.type !== "hl_method_rule" && step.type !== "hl_question_check" && step.type !== "hl_score_question_check" && step.type !== "hl_score_replacement" && step.type !== "hl_match_total" && step.type !== "hl_derive_prelude" && step.type !== "hl_dual_path_assume"}
        >
          <HeadsLegsStepBody
            step={step}
            task={task}
            methodRule={methodRule}
            ruleInstance={ruleInstance}
            profile={meta.progressionProfile ?? 1}
            isLastStep={stepIndex >= playerSteps.length - 1}
            assumePathIndex={assumePathIndex}
            onAssumePathSelect={setAssumePathIndex}
            onAdvance={advance}
          />
        </TaskScreenShell>
      </div>

      <HeadsLegsMethodRuleModal
        open={ruleModalOpen}
        rule={methodRule}
        instance={ruleInstance}
        onClose={() => setRuleModalOpen(false)}
      />
    </div>
  );
}

function HeadsLegsStepBody({
  step,
  task,
  methodRule,
  ruleInstance,
  profile,
  isLastStep,
  assumePathIndex,
  onAssumePathSelect,
  onAdvance,
}: {
  step: HeadsLegsExtendedPlayerStep;
  task: Task;
  methodRule: NonNullable<ReturnType<typeof getMethodRule>>;
  ruleInstance: NonNullable<Task["headsLegsMeta"]>["ruleInstance"];
  profile: number;
  isLastStep: boolean;
  assumePathIndex: 0 | 1 | null;
  onAssumePathSelect: (index: 0 | 1) => void;
  onAdvance: () => void;
}) {
  if (!ruleInstance) return null;

  const meta = task.headsLegsMeta!;
  const pathLines =
    hasDualAssumePath(meta.methodTaskId) && assumePathIndex != null
      ? resolveDualAssumeSolutionLines(meta.methodTaskId, assumePathIndex)
      : undefined;

  switch (step.type) {
    case "hl_intro":
      return (
        <AutoExplanationStep template={step.template} role="intro" onComplete={onAdvance} />
      );
    case "hl_method_rule":
      return (
        <HeadsLegsMethodRuleScreen
          rule={methodRule}
          instance={ruleInstance}
          variant="step"
          compact={step.compact ?? isCompactRuleScreen(profile as 1 | 2 | 3 | 4)}
          onComplete={onAdvance}
        />
      );
    case "hl_choose_method":
      return (
        <HeadsLegsMethodChooseStep
          stepId={step.id}
          chooseMode={step.chooseMode}
          sourceSteps={step.sourceSteps}
          questionAsks={step.questionAsks}
          answerTransform={step.answerTransform}
          scoreMode={step.scoreMode}
          scoreRuleInstance={step.scoreRuleInstance}
          onComplete={onAdvance}
        />
      );
    case "hl_score_question_check":
      return (
        <ScoreQuestionCheckStep
          stepId={step.id}
          questionAsks={step.questionAsks}
          questionCheckNote={step.questionCheckNote}
          scoreMode={step.scoreMode}
          onComplete={onAdvance}
        />
      );
    case "hl_score_replacement":
      return (
        <ScoreReplacementStep
          stepId={step.id}
          instance={step.scoreRuleInstance}
          onComplete={onAdvance}
        />
      );
    case "hl_match_total":
      return (
        <MatchTotalStep
          stepId={step.id}
          instance={step.scoreRuleInstance}
          onComplete={onAdvance}
        />
      );
    case "hl_derive_prelude":
      return (
        <HeadsLegsDerivePreludeStep
          stepId={step.id}
          instance={step.deriveRuleInstance}
          onComplete={onAdvance}
        />
      );
    case "hl_dual_path_assume":
      return (
        <HeadsLegsDualPathAssumeStep
          stepId={step.id}
          config={step.dualAssumeConfig}
          onComplete={(pathIndex) => {
            onAssumePathSelect(pathIndex);
            onAdvance();
          }}
        />
      );
    case "hl_question_check":
      return (
        <HeadsLegsQuestionCheckStep
          stepId={step.id}
          questionAsks={step.questionAsks}
          answerTransform={step.answerTransform}
          onComplete={onAdvance}
        />
      );
    case "read_condition":
      return (
        <ReadConditionStep
          stepId={step.id}
          title={task.title}
          condition={task.condition}
          highlightVariant="heads-legs"
          hintText={
            "hint" in step && step.hint
              ? step.hint
              : profile >= 3
                ? "Прочитай условие. Дальше выбери шаг метода или заполни решение."
                : undefined
          }
          onComplete={onAdvance}
        />
      );
    case "condition_parse":
      return (
        <ConditionParseStep
          stepId={step.id}
          condition={task.condition}
          parseData={step.parseData!}
          onComplete={onAdvance}
        />
      );
    case "drag_select":
      return (
        <DragSelectStep
          stepId={step.id}
          options={step.options!}
          runnerContext="heads-legs"
          onComplete={onAdvance}
        />
      );
    case "single_select":
      return (
        <SingleSelectStep
          stepId={step.id}
          context={step.context}
          options={step.options!}
          prompt={step.selectPrompt}
          successMessage={step.successMessage}
          alternativeWrongFeedback={
            "alternativeWrongFeedback" in step ? step.alternativeWrongFeedback : undefined
          }
          runnerContext="heads-legs"
          onComplete={onAdvance}
        />
      );
    case "order_questions":
      return (
        <OrderQuestionsStep
          stepId={step.id}
          items={step.orderItems!}
          runnerContext="heads-legs"
          onComplete={onAdvance}
        />
      );
    case "worksheet_table":
      return (
        <WorksheetTableStep
          stepId={step.id}
          rows={step.worksheetRows!}
          successMessage={step.successMessage}
          runnerContext="heads-legs"
          onComplete={onAdvance}
        />
      );
    case "table_input":
      return (
        <TableInputStep
          stepId={step.id}
          rows={step.rows!}
          columnLabel={step.tableColumnLabel}
          onComplete={onAdvance}
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
          onComplete={onAdvance}
        />
      );
    case "auto_explanation":
      return (
        <AutoExplanationStep
          template={
            pathLines && step.id.includes("-preview")
              ? buildSolutionPreviewLines(pathLines)
              : step.template!
          }
          role={resolveExplanationRole(step, isLastStep)}
          onComplete={onAdvance}
        />
      );
    case "word_solution":
      return (
        <WordSolutionStep
          step={pathLines ? { ...step, solutionLines: pathLines } : step}
          runnerContext="heads-legs"
          onComplete={onAdvance}
        />
      );
    default:
      return null;
  }
}
