"use client";

import Image from "next/image";
import type { DiagnosticLayoutPhase } from "./DiagnosticFocusLayout";
import { DiagnosticFocusLayout } from "./DiagnosticFocusLayout";
import { ENTRY_DIAGNOSTIC_ASSETS } from "@/data/entry-diagnostic/visual-assets";

export type CelebrationProps = {
  layoutPhase?: DiagnosticLayoutPhase;
  title?: string;
  text?: string;
  buttonText?: string;
  badgeSrc?: string;
  /** Показывать звёздочку над плашкой (pre_minigame — без декора) */
  showBadge?: boolean;
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
  showBadge = false,
  hintIconSrc,
  hintText,
  onNext,
  testId,
  continueTestId,
}: CelebrationProps) {
  return (
    <DiagnosticFocusLayout phase={layoutPhase} testId={testId}>
      <section className="diagnostic-screen diagnostic-celebration">
        <div
          className={`diagnostic-card diagnostic-celebration__card${showBadge ? "" : " diagnostic-celebration__card--plain"}`}
        >
          {showBadge ? (
            <div className="diagnostic-badge">
              <Image src={badgeSrc} alt="" width={72} height={72} aria-hidden />
            </div>
          ) : null}
          <h1>{title}</h1>
          <div className="diagnostic-dashed-line" />
          <p>{text}</p>
        </div>

        {hintText ? (
          <div className="diagnostic-card diagnostic-celebration__hint">
            {hintIconSrc ? (
              <Image
                src={hintIconSrc}
                alt=""
                width={56}
                height={56}
                className="diagnostic-celebration__hint-icon"
                aria-hidden
              />
            ) : null}
            <p>{hintText}</p>
          </div>
        ) : null}

        <button
          type="button"
          className="diagnostic-primary-button diagnostic-celebration__continue"
          data-testid={continueTestId ?? "diagnostic-celebration-continue"}
          onClick={onNext}
        >
          {buttonText} →
        </button>
      </section>
    </DiagnosticFocusLayout>
  );
}
