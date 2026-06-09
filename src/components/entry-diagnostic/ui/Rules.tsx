"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { ENTRY_DIAGNOSTIC_ASSETS } from "@/data/entry-diagnostic/visual-assets";
import { DiagnosticFocusLayout } from "./DiagnosticFocusLayout";

export type RuleItem = {
  iconSrc: string;
  text: ReactNode;
};

export type RulesProps = {
  title: string;
  rules: RuleItem[];
  headerImageSrc?: string;
  previewSrc?: string;
  onStart: () => void;
  testId?: string;
  startTestId?: string;
};

export function Rules({
  title,
  rules,
  headerImageSrc = ENTRY_DIAGNOSTIC_ASSETS.pojmat.titleChip,
  previewSrc,
  onStart,
  testId = "diagnostic-minigame-rules",
  startTestId = "diagnostic-minigame-rules-start",
}: RulesProps) {
  return (
    <DiagnosticFocusLayout phase="rules" testId={testId}>
      <section className="diagnostic-rules">
        {headerImageSrc ? (
          <div className="diagnostic-game-title">
            <Image src={headerImageSrc} alt="" width={430} height={64} className="diagnostic-game-title__img" aria-hidden />
          </div>
        ) : null}

        <div className="diagnostic-card diagnostic-rules__card">
          <h1>{title}</h1>
          <ul className="diagnostic-rules-list">
            {rules.map((rule, index) => (
              <li key={index}>
                <Image src={rule.iconSrc} alt="" width={48} height={48} aria-hidden />
                <span>{rule.text}</span>
              </li>
            ))}
          </ul>
          {previewSrc ? (
            <Image
              className="diagnostic-rules__preview"
              src={previewSrc}
              alt=""
              width={400}
              height={200}
              aria-hidden
            />
          ) : null}
        </div>

        <button type="button" className="diagnostic-primary-button" data-testid={startTestId} onClick={onStart}>
          Понятно, играть!
        </button>
      </section>
    </DiagnosticFocusLayout>
  );
}
