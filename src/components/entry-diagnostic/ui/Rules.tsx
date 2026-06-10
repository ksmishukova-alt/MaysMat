"use client";

import type { ReactNode } from "react";
import { DiagnosticFocusLayout } from "./DiagnosticFocusLayout";

export type RuleItem = {
  iconSrc: string;
  text: ReactNode;
};

export type RulesControlHint = {
  kind: "keyboard" | "tap";
  text: string;
};

export type RulesControlSection = {
  title: string;
  hints: RulesControlHint[];
};

export type RulesProps = {
  title: string;
  /** Пункты до блока «Как управлять» */
  rulesBefore: ReactNode[];
  /** Пункты после блока управления */
  rulesAfter?: ReactNode[];
  controlSection?: RulesControlSection;
  onStart: () => void;
  testId?: string;
  startTestId?: string;
};

function RulesNumberedList({ items, startAt = 1 }: { items: ReactNode[]; startAt?: number }) {
  if (items.length === 0) return null;
  return (
    <ol className="diagnostic-rules-list diagnostic-rules-list--numbered">
      {items.map((text, index) => (
        <li key={startAt + index}>
          <span className="diagnostic-rules-list__num" aria-hidden>
            {startAt + index}.
          </span>
          <span>{text}</span>
        </li>
      ))}
    </ol>
  );
}

function ControlHintPrefix({ kind }: { kind: RulesControlHint["kind"] }) {
  if (kind === "keyboard") {
    return (
      <span className="diagnostic-rules-controls__keys" aria-hidden>
        <span className="diagnostic-rules-controls__key">←</span>
        <span className="diagnostic-rules-controls__key">→</span>
      </span>
    );
  }
  return (
    <span className="diagnostic-rules-controls__tap" aria-hidden>
      👆
    </span>
  );
}

export function Rules({
  title,
  rulesBefore,
  rulesAfter = [],
  controlSection,
  onStart,
  testId = "diagnostic-minigame-rules",
  startTestId = "diagnostic-minigame-rules-start",
}: RulesProps) {
  const afterStart = rulesBefore.length + 1;

  return (
    <DiagnosticFocusLayout phase="rules" testId={testId}>
      <section className="diagnostic-screen diagnostic-rules">
        <div className="diagnostic-card diagnostic-rules__card">
          <h1>{title}</h1>

          <RulesNumberedList items={rulesBefore} startAt={1} />

          {controlSection ? (
            <div className="diagnostic-rules-controls">
              <p className="diagnostic-rules-controls__title">{controlSection.title}</p>
              <ul className="diagnostic-rules-controls__list">
                {controlSection.hints.map((hint) => (
                  <li key={hint.kind}>
                    <ControlHintPrefix kind={hint.kind} />
                    <span>{hint.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <RulesNumberedList items={rulesAfter} startAt={afterStart} />

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
