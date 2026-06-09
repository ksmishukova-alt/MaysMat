"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ENTRY_DIAGNOSTIC_BLOCKS,
  getBlockByIndex,
  getMiniGameById,
} from "@/data/entry-diagnostic";
import { getMiniGameDiagnosticRules } from "@/data/entry-diagnostic/minigame-diagnostic-rules";
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
import { DiagnosticTransitionScreen } from "@/components/entry-diagnostic/DiagnosticTransitionScreen";
import { DiagnosticMiniGameRulesScreen } from "@/components/entry-diagnostic/DiagnosticMiniGameRulesScreen";

function normalizePhase(session: DiagnosticSession): DiagnosticSession {
  if (session.phase === "block_summary") {
    return { ...session, phase: "post_block" };
  }
  return session;
}

export function DiagnosticFlow() {
  const router = useRouter();
  const [session, setSession] = useState<DiagnosticSession | null>(null);

  useEffect(() => {
    const existing = loadDiagnosticSession();
    if (existing?.phase === "complete") {
      router.replace("/diagnostic/result");
      return;
    }
    setSession(existing ? normalizePhase(existing) : createDiagnosticSession());
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

    persist({ ...next, phase: "pre_minigame" });
  };

  const finishMiniGame = (result: {
    score: number;
    roundsCompleted: number;
    catchErrors: number;
    semanticErrors: number;
    motorErrors: number;
  }) => {
    if (!session || !block) return;
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
      phase: "post_block",
    };
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
      <div
        data-testid="diagnostic-intro"
        className="relative overflow-hidden rounded-3xl border-2 border-lavender-200 bg-gradient-to-b from-lavender-50 to-white p-6 shadow-card sm:p-8"
      >
        <div className="pointer-events-none absolute -right-2 top-0 opacity-95" aria-hidden>
          <Image
            src="/entry-diagnostic/pojmat/myshmat.png"
            alt=""
            width={112}
            height={112}
            className="drop-shadow-md"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Привет! Это диагностика МышМата.</h1>
        <div className="mt-4 max-w-lg space-y-3 text-sm leading-relaxed text-gray-700 sm:text-base">
          <p>
            Мы посмотрим, какие математические темы у тебя уже сильные, а какие стоит потренировать.
          </p>
          <p>Будет 15 тем. В каждой теме — несколько заданий и маленькая игра.</p>
          <p>Во время диагностики подсказок не будет, а результат появится в конце.</p>
          <p>В полные версии игр потом можно будет играть отдельно и соревноваться с друзьями.</p>
        </div>
        <button
          type="button"
          data-testid="diagnostic-start"
          onClick={startDiagnostic}
          className="mt-8 min-h-12 rounded-2xl bg-brand-purple px-8 py-3 text-sm font-semibold text-white shadow-sm"
        >
          Начать диагностику
        </button>
      </div>
    );
  }

  if (!block) {
    return <p className="text-red-500">Блок не найден</p>;
  }

  if (session.phase === "pre_minigame") {
    return (
      <DiagnosticTransitionScreen
        testId="diagnostic-pre-minigame"
        message="Тема завершена! Сейчас будет мини-игра МышМата."
        buttonLabel="Дальше"
        onContinue={() => persist({ ...session, phase: "minigame_rules" })}
      />
    );
  }

  if (session.phase === "minigame_rules") {
    const mgConfig = getMiniGameById(block.miniGameId);
    if (!mgConfig) return null;
    const rules = getMiniGameDiagnosticRules(block.miniGameId, mgConfig.title);
    return (
      <DiagnosticMiniGameRulesScreen
        rules={rules}
        onStart={() => persist({ ...session, phase: "minigame" })}
      />
    );
  }

  if (session.phase === "post_block") {
    const isLast = session.currentBlockIndex >= ENTRY_DIAGNOSTIC_BLOCKS.length;
    return (
      <DiagnosticTransitionScreen
        testId="diagnostic-post-block"
        message={
          isLast
            ? "Готово! Сейчас посмотрим итог диагностики."
            : "Готово! Переходим к следующей теме."
        }
        buttonLabel={isLast ? "К отчёту" : "Дальше"}
        continueTestId="diagnostic-next-block"
        onContinue={nextBlock}
      />
    );
  }

  if (session.phase === "minigame") {
    const mgConfig = getMiniGameById(block.miniGameId);
    const MiniGame = mgConfig ? getMiniGameComponent(block.miniGameId) : undefined;
    if (!mgConfig || !MiniGame) return null;
    return (
      <DiagnosticScreenShell
        taskLabel={`Тема ${block.blockIndex} из 15`}
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
