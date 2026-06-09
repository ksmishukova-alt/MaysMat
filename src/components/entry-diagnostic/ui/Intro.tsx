"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import {
  DIAGNOSTIC_INTRO_ROWS,
  ENTRY_DIAGNOSTIC_ASSETS,
  DIAGNOSTIC_MYSHMAT_POSE,
} from "@/data/entry-diagnostic/visual-assets";
import { DiagnosticFocusLayout } from "./DiagnosticFocusLayout";

const INTRO_COPY: Record<(typeof DIAGNOSTIC_INTRO_ROWS)[number]["textKey"], ReactNode> = {
  topics: (
    <>
      Впереди <b>15 тем</b>. В каждой теме — несколько заданий и мини-игра.
    </>
  ),
  noHints: <>Подсказок во время диагностики не будет — старайся сам.</>,
  resultEnd: <>Результат появится только в самом конце.</>,
  friendsPlay: <>Потом ты сможешь играть в полные версии игр и соревноваться с друзьями.</>,
};

export type IntroProps = {
  onStart: () => void;
  onBack?: () => void;
};

export function Intro({ onStart, onBack }: IntroProps) {
  return (
    <DiagnosticFocusLayout phase="intro" testId="diagnostic-intro" onBack={onBack}>
      <section className="diagnostic-screen diagnostic-intro">
        <Image
          className="diagnostic-intro__logo"
          src={ENTRY_DIAGNOSTIC_ASSETS.brand.logo}
          alt="Диагностика МышМат"
          width={340}
          height={120}
          priority
        />

        <div className="diagnostic-intro__layout">
          <Image
            className="diagnostic-intro__mascot"
            src={DIAGNOSTIC_MYSHMAT_POSE.intro}
            alt=""
            width={200}
            height={200}
            aria-hidden
            priority
          />

          <div className="diagnostic-intro__main">
            <div className="diagnostic-card diagnostic-intro__card">
              <h1>Привет!</h1>
              <p>
                Сейчас ты пройдёшь диагностику, чтобы мы лучше поняли, что ты уже знаешь и умеешь.
              </p>
              <ul className="diagnostic-intro-list">
                {DIAGNOSTIC_INTRO_ROWS.map((row) => (
                  <li key={row.textKey}>
                    <Image src={row.icon} alt="" width={54} height={54} className="diagnostic-icon-transparent" aria-hidden />
                    <span>{INTRO_COPY[row.textKey]}</span>
                  </li>
                ))}
              </ul>
            </div>

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
