"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { DiagnosticFocusLayout } from "./DiagnosticFocusLayout";
import { ProgressDots } from "./ProgressDots";

export type DiagnosticTaskShellProps = {
  currentTask: number;
  totalTasks: number;
  currentTheme: number;
  totalThemes?: number;
  themeTitle: string;
  condition: string;
  instruction?: string;
  children?: ReactNode;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  mascotSrc?: string;
  onBack?: () => void;
  /** data-runner-kind и data-test-answer для QA */
  runnerKind?: string;
  testAnswer?: string;
};

export function DiagnosticTaskShell({
  currentTask,
  totalTasks,
  currentTheme,
  totalThemes = 15,
  themeTitle,
  condition,
  instruction,
  children,
  onNext,
  nextDisabled = false,
  nextLabel = "Далее →",
  mascotSrc,
  onBack,
  runnerKind,
  testAnswer,
}: DiagnosticTaskShellProps) {
  return (
    <DiagnosticFocusLayout phase="task" onBack={onBack}>
      <section
        className="diagnostic-task"
        data-testid="diagnostic-runner"
        data-runner-kind={runnerKind}
        data-test-answer={testAnswer}
      >
        <header className="diagnostic-task__top">
          <div className="diagnostic-pill" data-testid="diagnostic-task-pill">
            Задание {currentTask} из {totalTasks}
          </div>
          <ProgressDots total={totalThemes} current={currentTheme} showLabel={false} />
          <div className="diagnostic-theme-pill">{themeTitle}</div>
        </header>

        <div className="diagnostic-card diagnostic-task__condition">
          <p data-testid="diagnostic-condition-banner">{condition}</p>
          {instruction ? (
            <>
              <div className="diagnostic-dashed-line" />
              <strong>{instruction}</strong>
            </>
          ) : null}
        </div>

        {children ? <div className="diagnostic-task__body">{children}</div> : null}

        <button
          type="button"
          className="diagnostic-primary-button diagnostic-task__next"
          data-testid="diagnostic-task-continue"
          onClick={onNext}
          disabled={nextDisabled}
        >
          {nextLabel}
        </button>

        {mascotSrc ? (
          <Image
            className="diagnostic-task__mascot"
            src={mascotSrc}
            alt=""
            width={104}
            height={104}
            aria-hidden
          />
        ) : null}
      </section>
    </DiagnosticFocusLayout>
  );
}
