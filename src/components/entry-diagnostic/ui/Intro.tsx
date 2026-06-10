"use client";

import type { ReactNode } from "react";
import {
  DIAGNOSTIC_INTRO_ROWS,
  ENTRY_DIAGNOSTIC_ASSETS,
} from "@/data/entry-diagnostic/visual-assets";
import { DiagnosticAssetImage } from "./DiagnosticAssetImage";
import { DiagnosticFocusLayout } from "./DiagnosticFocusLayout";

const INTRO_FEATURE_LABEL: Record<(typeof DIAGNOSTIC_INTRO_ROWS)[number]["textKey"], string> = {
  topics: "15 тем и мини-игры",
  noHints: "Без подсказок",
  friendsPlay: "Первая коллекционная карточка в конце.",
};

const INTRO_FEATURE_HINT: Record<(typeof DIAGNOSTIC_INTRO_ROWS)[number]["textKey"], ReactNode> = {
  topics: <>В каждой теме — задания и мини-игра.</>,
  noHints: <>Старайся ответить сам.</>,
  friendsPlay: <>Попробуй собрать их все!</>,
};

export type IntroProps = {
  onStart: () => void;
  onBack?: () => void;
};

export function Intro({ onStart, onBack }: IntroProps) {
  return (
    <DiagnosticFocusLayout phase="intro" testId="diagnostic-intro" onBack={onBack}>
      <section className="diagnostic-screen diagnostic-intro">
        <div className="diagnostic-intro__hero">
          <DiagnosticAssetImage
            src={ENTRY_DIAGNOSTIC_ASSETS.brand.logo}
            alt="Диагностика МышМат"
            width={420}
            height={120}
            className="diagnostic-intro__logo-chip"
          />

          <div className="diagnostic-card diagnostic-intro__card diagnostic-intro__card--with-chip">
            <h1>Привет!</h1>
            <p>
              Сейчас ты пройдёшь диагностику, чтобы мы лучше поняли, что ты уже знаешь и умеешь.
            </p>
            <ul className="diagnostic-intro-list">
              {DIAGNOSTIC_INTRO_ROWS.map((row, index) => (
                <li key={row.textKey} className="diagnostic-intro-feature">
                  <span className="diagnostic-intro-feature__num" aria-hidden>
                    {index + 1}.
                  </span>
                  <span className="diagnostic-intro-feature__icon-wrap">
                    <DiagnosticAssetImage
                      src={row.icon}
                      alt=""
                      width={40}
                      height={40}
                      className="diagnostic-intro-feature__icon diagnostic-icon-transparent"
                      aria-hidden
                    />
                  </span>
                  <div className="diagnostic-intro-feature__text">
                    <strong>{INTRO_FEATURE_LABEL[row.textKey]}</strong>
                    <span>{INTRO_FEATURE_HINT[row.textKey]}</span>
                  </div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="diagnostic-primary-button diagnostic-intro__start"
              data-testid="diagnostic-start"
              onClick={onStart}
            >
              Начать диагностику
            </button>
          </div>
        </div>
      </section>
    </DiagnosticFocusLayout>
  );
}
