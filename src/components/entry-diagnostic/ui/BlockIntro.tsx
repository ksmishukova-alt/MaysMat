"use client";

import { DiagnosticFocusLayout } from "./DiagnosticFocusLayout";
import { ProgressDots } from "./ProgressDots";

export type BlockIntroProps = {
  currentTheme: number;
  totalThemes?: number;
  themeTitle: string;
  onStart: () => void;
  testId?: string;
  startTestId?: string;
};

export function BlockIntro({
  currentTheme,
  totalThemes = 15,
  themeTitle,
  onStart,
  testId = "diagnostic-block-intro",
  startTestId = "diagnostic-block-intro-start",
}: BlockIntroProps) {
  return (
    <DiagnosticFocusLayout phase="block_intro" testId={testId}>
      <section className="diagnostic-screen diagnostic-block-intro">
        <ProgressDots total={totalThemes} current={currentTheme} showLabel={false} />

        <div className="diagnostic-pill diagnostic-block-intro__pill">
          Тема {currentTheme} из {totalThemes}
        </div>

        <div className="diagnostic-card diagnostic-block-intro__card">
          <h1>{themeTitle}</h1>
          <div className="diagnostic-dashed-line" />
          <p>Сейчас будет 3 задания.</p>
        </div>

        <button
          type="button"
          className="diagnostic-primary-button"
          data-testid={startTestId}
          onClick={onStart}
        >
          Начать тему
        </button>
      </section>
    </DiagnosticFocusLayout>
  );
}
