"use client";

import type { AnswerColor } from "./answer-colors";
import { AnswerButton } from "./AnswerButton";
import { DiagnosticTaskShell } from "./DiagnosticTaskShell";

export type AnswerOption = {
  id: string;
  text: string;
  color: AnswerColor;
};

export type TaskCardProps = {
  currentTask: number;
  totalTasks: number;
  currentTheme: number;
  totalThemes?: number;
  themeTitle: string;
  condition: string;
  instruction?: string;
  options?: AnswerOption[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  mascotSrc?: string;
  onBack?: () => void;
  runnerKind?: string;
  testAnswer?: string;
};

export function TaskCard({
  currentTask,
  totalTasks,
  currentTheme,
  totalThemes = 15,
  themeTitle,
  condition,
  instruction,
  options = [],
  selectedId,
  onSelect,
  onNext,
  nextDisabled = false,
  nextLabel = "Далее →",
  mascotSrc,
  onBack,
  runnerKind,
  testAnswer,
}: TaskCardProps) {
  const showAnswers = options.length > 0;

  return (
    <DiagnosticTaskShell
      currentTask={currentTask}
      totalTasks={totalTasks}
      currentTheme={currentTheme}
      totalThemes={totalThemes}
      themeTitle={themeTitle}
      condition={condition}
      instruction={instruction}
      onNext={onNext}
      nextDisabled={nextDisabled}
      nextLabel={nextLabel}
      mascotSrc={mascotSrc}
      onBack={onBack}
      runnerKind={runnerKind}
      testAnswer={testAnswer}
    >
      {showAnswers ? (
        <div className="diagnostic-answer-grid">
          {options.map((option) => (
            <AnswerButton
              key={option.id}
              color={option.color}
              selected={selectedId === option.id}
              testId={`diagnostic-choice-${option.id}`}
              aria-label={option.text}
              onClick={() => onSelect?.(option.id)}
            >
              {option.text}
            </AnswerButton>
          ))}
        </div>
      ) : null}
    </DiagnosticTaskShell>
  );
}
