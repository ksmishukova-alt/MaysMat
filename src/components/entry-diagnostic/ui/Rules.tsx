"use client";

import type { ReactNode } from "react";
import { DiagnosticFocusLayout } from "./DiagnosticFocusLayout";

export type RuleItem = {
  iconSrc: string;
  text: ReactNode;
};

export type RulesProps = {
  title: string;
  rules: RuleItem[];
  onStart: () => void;
  testId?: string;
  startTestId?: string;
};

export function Rules({
  title,
  rules,
  onStart,
  testId = "diagnostic-minigame-rules",
  startTestId = "diagnostic-minigame-rules-start",
}: RulesProps) {
  return (
    <DiagnosticFocusLayout phase="rules" testId={testId}>
      <section className="diagnostic-screen diagnostic-rules">
        <div className="diagnostic-card diagnostic-rules__card">
          <h1>{title}</h1>
          <ol className="diagnostic-rules-list diagnostic-rules-list--numbered">
            {rules.map((rule, index) => (
              <li key={index}>
                <span className="diagnostic-rules-list__num" aria-hidden>
                  {index + 1}.
                </span>
                <span>{rule.text}</span>
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="diagnostic-primary-button diagnostic-rules__start"
            data-testid={startTestId}
            onClick={onStart}
          >
            Понятно, играть!
          </button>
        </div>
      </section>
    </DiagnosticFocusLayout>
  );
}
