"use client";

import Image from "next/image";
import type { DiagnosticLayoutPhase } from "./DiagnosticFocusLayout";
import { DiagnosticFocusLayout } from "./DiagnosticFocusLayout";
import { DiagnosticAssetImage } from "./DiagnosticAssetImage";
import {
  DIAGNOSTIC_MYSHMAT_POSE,
  ENTRY_DIAGNOSTIC_ASSETS,
} from "@/data/entry-diagnostic/visual-assets";

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
  /** Маскот над карточкой; по умолчанию — на экране «Тема завершена» */
  mascotSrc?: string;
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
  mascotSrc,
  onNext,
  testId,
  continueTestId,
}: CelebrationProps) {
  const mascot =
    mascotSrc ??
    (layoutPhase === "pre_minigame" && !showBadge ? DIAGNOSTIC_MYSHMAT_POSE.topicDone : undefined);

  return (
    <DiagnosticFocusLayout phase={layoutPhase} testId={testId}>
      <section className="diagnostic-screen diagnostic-celebration">
        {mascot ? (
          <div className="diagnostic-celebration__mascot-wrap">
            <DiagnosticAssetImage
              src={mascot}
              alt=""
              width={200}
              height={200}
              className="diagnostic-celebration__mascot"
              aria-hidden
            />
          </div>
        ) : null}
        <div
          className={`diagnostic-card diagnostic-celebration__card${
            showBadge ? "" : " diagnostic-celebration__card--plain"
          }${mascot ? " diagnostic-celebration__card--with-mascot" : ""}`}
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
