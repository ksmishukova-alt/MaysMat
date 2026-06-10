"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ENTRY_DIAGNOSTIC_BLOCKS,
  getBlockByIndex,
  getMiniGameById,
} from "@/data/entry-diagnostic";
import {
  getMiniGameDiagnosticRules,
  getMiniGameRuleItems,
  getPojmatRulesScreen,
} from "@/data/entry-diagnostic/minigame-diagnostic-rules";
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
import { DiagnosticFocusLayout } from "@/components/entry-diagnostic/ui/DiagnosticFocusLayout";
import { Intro } from "@/components/entry-diagnostic/ui/Intro";
import { Celebration } from "@/components/entry-diagnostic/ui/Celebration";
import { Rules } from "@/components/entry-diagnostic/ui/Rules";
import { BlockIntro } from "@/components/entry-diagnostic/ui/BlockIntro";
import { ENTRY_DIAGNOSTIC_ASSETS } from "@/data/entry-diagnostic/visual-assets";

function normalizePhase(session: DiagnosticSession): DiagnosticSession {
  if (session.phase === "block_summary") {
    return { ...session, phase: "post_block" };
  }
  return session;
}

function bootstrapSession(): DiagnosticSession | null {
  if (typeof window === "undefined") return null;
  const existing = loadDiagnosticSession();
  if (existing?.phase === "complete") return createDiagnosticSession();
  return existing ? normalizePhase(existing) : createDiagnosticSession();
}

export function DiagnosticFlow() {
  const router = useRouter();
  const [session, setSession] = useState<DiagnosticSession | null>(null);

  useLayoutEffect(() => {
    setSession(bootstrapSession());
  }, []);

  useEffect(() => {
    const existing = loadDiagnosticSession();
    if (existing?.phase === "complete") {
      router.replace("/diagnostic/result");
    }
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
      { ...s, phase: "block_intro", currentBlockIndex: 1, currentTaskIndex: 0 },
      {},
    );
    appendEvent(next, { eventType: "diagnostic_start", payload: {} });
    persist(next);
  };

  const startBlock = () => {
    if (!session) return;
    persist({ ...session, phase: "task", currentTaskIndex: 0 });
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
      phase: "block_intro",
    });
  };

  if (!session) {
    return (
      <DiagnosticFocusLayout phase="intro">
        <div className="flex min-h-[40vh] items-center justify-center text-lg font-bold text-[#17256f]">
          Загрузка…
        </div>
      </DiagnosticFocusLayout>
    );
  }

  if (session.phase === "intro") {
    return <Intro onStart={startDiagnostic} />;
  }

  if (session.phase === "block_intro") {
    if (!block) {
      return (
        <DiagnosticFocusLayout phase="block_intro">
          <p className="text-red-600">Блок не найден</p>
        </DiagnosticFocusLayout>
      );
    }
    return (
      <BlockIntro
        currentTheme={block.blockIndex}
        onStart={startBlock}
      />
    );
  }

  if (!block) {
    return (
      <DiagnosticFocusLayout phase="task">
        <p className="text-red-600">Блок не найден</p>
      </DiagnosticFocusLayout>
    );
  }

  if (session.phase === "pre_minigame") {
    return (
      <Celebration
        testId="diagnostic-pre-minigame"
        continueTestId="diagnostic-pre-minigame-continue"
        onNext={() => persist({ ...session, phase: "minigame_rules" })}
      />
    );
  }

  if (session.phase === "minigame_rules") {
    const mgConfig = getMiniGameById(block.miniGameId);
    if (!mgConfig) return null;
    if (block.miniGameId === "pojmat") {
      return (
        <Rules
          {...getPojmatRulesScreen()}
          onStart={() => persist({ ...session, phase: "minigame" })}
        />
      );
    }
    const rulesMeta = getMiniGameDiagnosticRules(block.miniGameId, mgConfig.title);
    return (
      <Rules
        title={rulesMeta.title}
        rulesBefore={getMiniGameRuleItems(block.miniGameId, mgConfig.title).map((rule) => rule.text)}
        onStart={() => persist({ ...session, phase: "minigame" })}
      />
    );
  }

  if (session.phase === "post_block") {
    const isLast = session.currentBlockIndex >= ENTRY_DIAGNOSTIC_BLOCKS.length;
    return (
      <Celebration
        testId="diagnostic-post-block"
        layoutPhase="post_block"
        title="Готово!"
        showBadge
        text={
          isLast
            ? "Сейчас посмотрим итог диагностики."
            : "Переходим к следующей теме."
        }
        badgeSrc={ENTRY_DIAGNOSTIC_ASSETS.icons.badgeCheck}
        hintIconSrc={!isLast ? ENTRY_DIAGNOSTIC_ASSETS.icons.giftNextTopic : undefined}
        hintText={
          !isLast
            ? "В следующей теме снова будут задания и мини-игра с МышМатом."
            : undefined
        }
        buttonText={isLast ? "К отчёту" : "Следующая тема"}
        continueTestId="diagnostic-next-block"
        onNext={nextBlock}
      />
    );
  }

  if (session.phase === "minigame") {
    const mgConfig = getMiniGameById(block.miniGameId);
    const MiniGame = mgConfig ? getMiniGameComponent(block.miniGameId) : undefined;
    if (!mgConfig || !MiniGame) return null;
    return (
      <DiagnosticFocusLayout phase="game">
        <MiniGame
          config={mgConfig}
          mode="diagnostic"
          blockId={block.blockId}
          onComplete={finishMiniGame}
          onEvent={(eventType, payload) => {
            setSession((s) => (s ? appendEvent(s, { eventType, blockId: block.blockId, payload }) : s));
          }}
        />
      </DiagnosticFocusLayout>
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
      blockTitle={block.title}
      globalTaskIndex={globalTaskIndex}
      totalTasks={45}
      onComplete={submitTask}
    />
  );
}
