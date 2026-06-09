"use client";

import { Nunito } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { DIAGNOSTIC_PHASE_BACKGROUNDS } from "@/data/entry-diagnostic/visual-assets";
import { ENTRY_DIAGNOSTIC_ASSETS } from "@/data/entry-diagnostic/visual-assets";
import "./diagnostic-ui.css";

const nunito = Nunito({
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800", "900"],
  display: "swap",
});

export type DiagnosticLayoutPhase =
  | "intro"
  | "block_intro"
  | "task"
  | "pre_minigame"
  | "rules"
  | "game"
  | "post_block"
  | "result";

/** @deprecated используйте DIAGNOSTIC_PHASE_BACKGROUNDS */
export const DIAGNOSTIC_PHASE_BG: Record<
  Exclude<DiagnosticLayoutPhase, "game">,
  string
> = {
  intro: DIAGNOSTIC_PHASE_BACKGROUNDS.intro!.mobile,
  block_intro: DIAGNOSTIC_PHASE_BACKGROUNDS.block_intro!.mobile,
  task: DIAGNOSTIC_PHASE_BACKGROUNDS.task!.mobile,
  pre_minigame: DIAGNOSTIC_PHASE_BACKGROUNDS.pre_minigame!.mobile,
  rules: DIAGNOSTIC_PHASE_BACKGROUNDS.rules!.mobile,
  post_block: DIAGNOSTIC_PHASE_BACKGROUNDS.post_block!.mobile,
  result: DIAGNOSTIC_PHASE_BACKGROUNDS.result!.mobile,
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
  if (phase === "game") {
    return (
      <main
        className={`diagnostic-focus-layout diagnostic-focus-layout--game ${nunito.className}`}
        data-testid={testId}
        data-phase={phase}
      >
        {children}
      </main>
    );
  }

  const bg = DIAGNOSTIC_PHASE_BACKGROUNDS[phase];

  return (
    <main
      className={`diagnostic-focus-layout ${nunito.className}`}
      data-testid={testId}
      data-phase={phase}
      style={
        {
          "--diagnostic-bg-mobile": bg ? `url(${bg.mobile})` : "none",
          "--diagnostic-bg-desktop": bg ? `url(${bg.desktop})` : "none",
        } as CSSProperties
      }
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
