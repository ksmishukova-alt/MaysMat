"use client";

import type { CSSProperties, ReactNode } from "react";
import { ANSWER_COLORS, type AnswerColor } from "./answer-colors";

export type { AnswerColor } from "./answer-colors";

export type AnswerButtonProps = {
  children: ReactNode;
  color?: AnswerColor;
  selected?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  testId?: string;
  "aria-label"?: string;
};

export function AnswerButton({
  children,
  color = "purple",
  selected = false,
  icon,
  onClick,
  disabled = false,
  testId,
  "aria-label": ariaLabel,
}: AnswerButtonProps) {
  const c = ANSWER_COLORS[color];

  return (
    <button
      type="button"
      className="answer-button"
      data-selected={selected}
      data-testid={testId}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={selected}
      style={
        {
          "--answer-border": c.border,
          "--answer-bg": c.bg,
          "--answer-bg-hover": c.bgHover,
          "--answer-bg-selected": c.bgSelected,
          "--answer-text": c.text,
          "--answer-shadow": c.shadow,
        } as CSSProperties
      }
    >
      {icon ? <span className="answer-button__icon">{icon}</span> : null}
      <span className="answer-button__text">{children}</span>
    </button>
  );
}
