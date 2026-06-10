"use client";

import type { ReactNode } from "react";
import {
  DIAGNOSTIC_INTRO_ROWS,
  DIAGNOSTIC_MYSHMAT_POSE,
} from "@/data/entry-diagnostic/visual-assets";
import { DiagnosticAssetImage } from "./DiagnosticAssetImage";
import { DiagnosticFocusLayout } from "./DiagnosticFocusLayout";

const INTRO_FEATURE_LABEL: Record<(typeof DIAGNOSTIC_INTRO_ROWS)[number]["textKey"], string> = {
  topics: "15 тем и мини-игры",
  noHints: "Без подсказок",
  resultEnd: "Результат в конце",
  friendsPlay: "Потом можно играть",
};

const INTRO_FEATURE_HINT: Record<(typeof DIAGNOSTIC_INTRO_ROWS)[number]["textKey"], ReactNode> = {
  topics: <>В каждой теме — задания и мини-игра.</>,
  noHints: <>Старайся ответить сам.</>,
  resultEnd: <>Баллы покажем только в конце.</>,
  friendsPlay: <>Полные игры и соревнования с друзьями.</>,
};

export type IntroProps = {
  onStart: () => void;
  onBack?: () => void;
};

export function Intro({ onStart, onBack }: IntroProps) {
  return (
    <DiagnosticFocusLayout phase="intro" testId="diagnostic-intro" onBack={onBack}>
      <section className="diagnostic-screen diagnostic-intro">
        <div className="diagnostic-intro__logo-text" aria-label="Диагностика МышМат">
          <span className="diagnostic-intro__logo-line">Диагностика</span>
          <span className="diagnostic-intro__logo-line diagnostic-intro__logo-line--brand">
            Мыш<span>Мат</span>
          </span>
        </div>

        <div className="diagnostic-intro__hero">
          <div className="diagnostic-intro__mascot-wrap">
            <DiagnosticAssetImage
              className="diagnostic-intro__mascot"
              src={DIAGNOSTIC_MYSHMAT_POSE.intro}
              alt=""
              width={200}
              height={200}
              aria-hidden
            />
          </div>

          <div className="diagnostic-card diagnostic-intro__card">
            <h1>Привет!</h1>
            <p>
              Сейчас ты пройдёшь диагностику, чтобы мы лучше поняли, что ты уже знаешь и умеешь.
            </p>
            <ul className="diagnostic-intro-list">
              {DIAGNOSTIC_INTRO_ROWS.map((row) => (
                <li key={row.textKey} className="diagnostic-intro-feature">
                  <DiagnosticAssetImage
                    src={row.icon}
                    alt=""
                    width={48}
                    height={48}
                    className="diagnostic-intro-feature__icon diagnostic-icon-transparent"
                    aria-hidden
                  />
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
