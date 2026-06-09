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
      <section className="diagnostic-screen diagnostic-rules">
        <div className="diagnostic-rules__side">
          {headerImageSrc ? (
            <div className="diagnostic-game-title">
              <Image
                src={headerImageSrc}
                alt=""
                width={430}
                height={64}
                className="diagnostic-game-title__img diagnostic-icon-transparent"
                aria-hidden
              />
            </div>
          ) : (
            <h2 className="diagnostic-rules__title-fallback">{title}</h2>
          )}
          {previewSrc ? (
            <Image
              className="diagnostic-rules__preview diagnostic-icon-transparent"
              src={previewSrc}
              alt=""
              width={320}
              height={200}
              aria-hidden
            />
          ) : null}
        </div>

        <div className="diagnostic-card diagnostic-rules__card">
          <h1>{title}</h1>
          <ul className="diagnostic-rules-list">
            {rules.map((rule, index) => (
              <li key={index}>
                <Image
                  src={rule.iconSrc}
                  alt=""
                  width={48}
                  height={48}
                  className="diagnostic-icon-transparent"
                  aria-hidden
                />
                <span>{rule.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <button type="button" className="diagnostic-primary-button diagnostic-rules__start" data-testid={startTestId} onClick={onStart}>
          Понятно, играть!
        </button>
      </section>
    </DiagnosticFocusLayout>
  );
}
