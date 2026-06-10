"use client";

import { getBlockIntroCopy } from "@/data/entry-diagnostic/block-intro-copy";
import { DiagnosticFocusLayout } from "./DiagnosticFocusLayout";
import { ProgressDots } from "./ProgressDots";

export type BlockIntroProps = {
  currentTheme: number;
  totalThemes?: number;
  onStart: () => void;
  testId?: string;
  startTestId?: string;
};

export function BlockIntro({
  currentTheme,
  totalThemes = 15,
  onStart,
  testId = "diagnostic-block-intro",
  startTestId = "diagnostic-block-intro-start",
}: BlockIntroProps) {
  const { title: themeTitle, paragraphs } = getBlockIntroCopy(currentTheme);

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
          <p className="diagnostic-block-intro__lead">Сейчас будет 3 задания.</p>
          <div className="diagnostic-block-intro__body">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
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
