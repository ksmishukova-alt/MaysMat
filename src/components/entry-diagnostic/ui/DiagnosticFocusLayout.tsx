"use client";

import { Nunito } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { ENTRY_DIAGNOSTIC_ASSETS } from "@/data/entry-diagnostic/visual-assets";
import "./diagnostic-ui.css";

const nunito = Nunito({
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800", "900"],
  display: "swap",
});

export type DiagnosticLayoutPhase =
  | "intro"
  | "task"
  | "celebration"
  | "rules"
  | "game"
  | "next";

export const DIAGNOSTIC_PHASE_BG: Record<DiagnosticLayoutPhase, string> = {
  intro: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.intro,
  task: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.task,
  celebration: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.topicDone,
  rules: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.introAlt,
  game: ENTRY_DIAGNOSTIC_ASSETS.pojmat.arena.mobile,
  next: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.nextTopic,
};

export type DiagnosticFocusLayoutProps = {
  phase: DiagnosticLayoutPhase;
  children: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  testId?: string;
};

export function DiagnosticFocusLayout({
  phase,
  children,
  onBack,
  backLabel = "Назад",
  testId,
}: DiagnosticFocusLayoutProps) {
  return (
    <main
      className={`diagnostic-focus-layout ${nunito.className}`}
      data-testid={testId}
      style={{ "--diagnostic-bg": `url(${DIAGNOSTIC_PHASE_BG[phase]})` } as CSSProperties}
    >
      <div className="diagnostic-focus-layout__overlay" aria-hidden />

      {onBack ? (
        <button type="button" className="diagnostic-back-button" onClick={onBack}>
          <Image
            src={ENTRY_DIAGNOSTIC_ASSETS.icons.btnNavArrow}
            alt=""
            width={28}
            height={28}
            className="diagnostic-back-button__arrow"
            aria-hidden
          />
          {backLabel}
        </button>
      ) : null}

      <div className="diagnostic-focus-layout__content">{children}</div>
    </main>
  );
}
