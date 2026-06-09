"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ENTRY_DIAGNOSTIC_BLOCKS,
  getBlockByIndex,
  getMiniGameById,
} from "@/data/entry-diagnostic";
import { scoreTaskAttempt } from "@/data/entry-diagnostic/scoring";
import { validateTaskResponse } from "@/data/entry-diagnostic/validation";
import type { DiagnosticSession, TaskAttemptRecord } from "@/data/entry-diagnostic/types";
import {
  appendEvent,
  createDiagnosticSession,
  loadDiagnosticSession,
  patchSession,
  saveDiagnosticSession,
} from "@/lib/entry-diagnostic/session";
import { DiagnosticRunner, type RunnerSubmitMeta } from "./DiagnosticRunner";
import { getMiniGameComponent } from "@/lib/entry-diagnostic/minigame-registry";
import { DiagnosticScreenShell } from "@/components/entry-diagnostic/DiagnosticScreenShell";

export function DiagnosticFlow() {
  const router = useRouter();
  const [session, setSession] = useState<DiagnosticSession | null>(null);

  useEffect(() => {
    const existing = loadDiagnosticSession();
    if (existing?.phase === "complete") {
      router.replace("/diagnostic/result");
      return;
    }
    setSession(existing ?? createDiagnosticSession());
  }, [router]);

  const block = useMemo(
    () => (session ? getBlockByIndex(session.currentBlockIndex) : undefined),
    [session],
  );

  const persist = useCallback((next: DiagnosticSession) => {
    saveDiagnosticSession(next);
    setSession(next);
  }, []);

  const startDiagnostic = () => {
    const s = createDiagnosticSession();
    const next = patchSession(
      { ...s, phase: "task", currentBlockIndex: 1, currentTaskIndex: 0 },
      {},
    );
    appendEvent(next, { eventType: "diagnostic_start", payload: {} });
    persist(next);
  };

  const submitTask = (response: Record<string, unknown>, meta: RunnerSubmitMeta) => {
    if (!session || !block) return;
    const task = block.tasks[session.currentTaskIndex];
    const outcome = validateTaskResponse(
      response,
      task.validationRules,
      task.answer,
      task.acceptedSolutions,
      task.errorTypes,
    );
    const score = scoreTaskAttempt(task.scoreWeight, outcome.correct);
    const record: TaskAttemptRecord = {
      taskId: task.taskId,
      blockId: block.blockId,
      difficulty: task.difficulty,
      scoreWeight: task.scoreWeight,
      startedAt: Date.now(),
      finishedAt: Date.now(),
      response,
      score,
      correct: outcome.correct,
      errorTypes: outcome.correct ? [] : outcome.errorTypes,
      initialActionCount: meta.initialActionCount,
      finalActionCount: meta.finalActionCount,
      actionCountRevised: meta.actionCountRevised,
      selfCorrection: meta.selfCorrection,
      computationErrors: meta.computationErrors,
      orderErrors: meta.orderErrors,
      readingErrors: meta.readingErrors,
      dataErrors: meta.dataErrors,
      unitErrors: meta.unitErrors,
    };

    let next = appendEvent(session, {
      eventType: "task_submit",
      blockId: block.blockId,
      taskId: task.taskId,
      payload: { score, correct: outcome.correct, response },
    });
    next = {
      ...next,
      taskAttempts: [...next.taskAttempts, record],
    };

    if (session.currentTaskIndex < 2) {
      persist({ ...next, currentTaskIndex: session.currentTaskIndex + 1, phase: "task" });
      return;
    }

    persist({ ...next, phase: "minigame" });
  };

  const finishMiniGame = (result: {
    score: number;
    roundsCompleted: number;
    catchErrors: number;
    semanticErrors: number;
    motorErrors: number;
  }) => {
    if (!session || !block) return;
    const mg = getMiniGameById(block.miniGameId);
    let next = appendEvent(session, {
      eventType: "minigame_complete",
      blockId: block.blockId,
      miniGameId: block.miniGameId,
      payload: result,
    });
    next = {
      ...next,
      miniGameAttempts: [
        ...next.miniGameAttempts,
        {
          miniGameId: block.miniGameId,
          blockId: block.blockId,
          mode: "diagnostic",
          startedAt: Date.now(),
          finishedAt: Date.now(),
          ...result,
          motorErrors: result.motorErrors ?? result.catchErrors,
        },
      ],
      phase: "block_summary",
    };
    void mg;
    persist(next);
  };

  const nextBlock = () => {
    if (!session) return;
    if (session.currentBlockIndex >= ENTRY_DIAGNOSTIC_BLOCKS.length) {
      let done = patchSession(
        { ...session, phase: "complete", finishedAt: Date.now() },
        {},
      );
      done = appendEvent(done, { eventType: "diagnostic_complete", payload: {} });
      persist(done);
      router.push("/diagnostic/result");
      return;
    }
    persist({
      ...session,
      currentBlockIndex: session.currentBlockIndex + 1,
      currentTaskIndex: 0,
      phase: "task",
    });
  };

  if (!session) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
        Загрузка…
      </div>
    );
  }

  if (session.phase === "intro") {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-card">
        <h1 className="text-2xl font-bold">Входная диагностика</h1>
        <p className="mt-3 text-sm text-gray-600">
          15 тем · по 3 задания · мини-игра с МышМатом после каждой темы.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Во время диагностики подсказок не будет — результат появится в конце.
        </p>
        <button
          type="button"
          data-testid="diagnostic-start"
          onClick={startDiagnostic}
          className="mt-6 min-h-11 rounded-xl bg-brand-purple px-8 py-3 text-sm font-medium text-white"
        >
          Начать диагностику
        </button>
      </div>
    );
  }

  if (!block) {
    return <p className="text-red-500">Блок не найден</p>;
  }

  const blockScore = session.taskAttempts
    .filter((a) => a.blockId === block.blockId)
    .reduce((s, a) => s + a.score, 0);

  if (session.phase === "block_summary") {
    return (
      <DiagnosticScreenShell
        taskLabel={`Блок ${block.blockIndex} из 15`}
        blockTitle={block.title}
      >
        <p className="text-lg font-semibold text-gray-900">
          Готово! Баллы: {blockScore} / {block.maxScore}
        </p>
        <p className="mt-2 text-sm text-gray-500">Подробный отчёт будет в самом конце.</p>
        <button
          type="button"
          data-testid="diagnostic-next-block"
          onClick={nextBlock}
          className="mt-6 min-h-11 rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-medium text-white"
        >
          {session.currentBlockIndex >= ENTRY_DIAGNOSTIC_BLOCKS.length
            ? "К отчёту"
            : "Следующий блок"}
        </button>
      </DiagnosticScreenShell>
    );
  }

  if (session.phase === "minigame") {
    const mgConfig = getMiniGameById(block.miniGameId);
    const MiniGame = mgConfig ? getMiniGameComponent(block.miniGameId) : undefined;
    if (!mgConfig || !MiniGame) return null;
    return (
      <DiagnosticScreenShell
        taskLabel={`Блок ${block.blockIndex} из 15`}
        blockTitle="Мини-игра с МышМатом"
      >
        <MiniGame
          config={mgConfig}
          mode="diagnostic"
          blockId={block.blockId}
          onComplete={finishMiniGame}
          onEvent={(eventType, payload) => {
            setSession((s) => (s ? appendEvent(s, { eventType, blockId: block.blockId, payload }) : s));
          }}
        />
      </DiagnosticScreenShell>
    );
  }

  const task = block.tasks[session.currentTaskIndex];
  const globalTaskIndex = (block.blockIndex - 1) * 3 + session.currentTaskIndex + 1;
  return (
    <DiagnosticRunner
      key={task.taskId}
      task={task}
      runnerKind={block.runnerKind}
      blockIndex={block.blockIndex}
      globalTaskIndex={globalTaskIndex}
      totalTasks={45}
      onComplete={submitTask}
    />
  );
}
