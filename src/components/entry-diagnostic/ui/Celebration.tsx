"use client";

import Image from "next/image";
import type { DiagnosticLayoutPhase } from "./DiagnosticFocusLayout";
import { DiagnosticFocusLayout } from "./DiagnosticFocusLayout";
import { DIAGNOSTIC_MYSHMAT_POSE, ENTRY_DIAGNOSTIC_ASSETS } from "@/data/entry-diagnostic/visual-assets";

export type CelebrationProps = {
  layoutPhase?: DiagnosticLayoutPhase;
  title?: string;
  text?: string;
  buttonText?: string;
  badgeSrc?: string;
  mascotSrc?: string;
  hintIconSrc?: string;
  hintText?: string;
  onNext: () => void;
  testId?: string;
  continueTestId?: string;
};

export function Celebration({
  layoutPhase = "pre_minigame",
  title = "Тема завершена!",
  text = "Сейчас будет мини-игра МышМата.",
  buttonText = "Дальше",
  badgeSrc = ENTRY_DIAGNOSTIC_ASSETS.icons.badgeStar,
  mascotSrc = DIAGNOSTIC_MYSHMAT_POSE.topicDone,
  hintIconSrc,
  hintText,
  onNext,
  testId,
  continueTestId,
}: CelebrationProps) {
  return (
    <DiagnosticFocusLayout phase={layoutPhase} testId={testId}>
      <section className="diagnostic-screen diagnostic-celebration">
        <div className="diagnostic-card diagnostic-celebration__card">
          <div className="diagnostic-badge">
            <Image src={badgeSrc} alt="" width={84} height={84} aria-hidden />
          </div>
          <h1>{title}</h1>
          <div className="diagnostic-dashed-line" />
          <p>{text}</p>
        </div>

        {hintText ? (
          <div className="diagnostic-card diagnostic-celebration__hint">
            {hintIconSrc ? (
              <Image src={hintIconSrc} alt="" width={56} height={56} className="diagnostic-celebration__hint-icon" aria-hidden />
            ) : null}
            <p>{hintText}</p>
          </div>
        ) : null}

        <Image
          className="diagnostic-celebration__mascot diagnostic-icon-transparent"
          src={mascotSrc}
          alt=""
          width={220}
          height={220}
          aria-hidden
        />

        <button
          type="button"
          className="diagnostic-primary-button"
          data-testid={continueTestId ?? "diagnostic-celebration-continue"}
          onClick={onNext}
        >
          {buttonText} →
        </button>
      </section>
    </DiagnosticFocusLayout>
  );
}
