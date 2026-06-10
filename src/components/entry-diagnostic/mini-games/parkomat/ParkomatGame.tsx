"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ParkomatRound } from "@/data/entry-diagnostic/mini-games/parkomat-rounds";
import type { ParkomatGate } from "@/data/entry-diagnostic/mini-games/parkomat-rounds";
import { isDiagnosticFastMode } from "@/lib/entry-diagnostic/fast-mode";
import { DiagnosticAssetImage } from "@/components/entry-diagnostic/ui/DiagnosticAssetImage";
import { PARKOMAT_ASSETS } from "./parkomat-assets";
import type { ParkomatMode, ParkomatPhase, ParkomatTelemetryEvent } from "./types";
import "./parkomat-game.css";

export type ParkomatGameProps = {
  mode: ParkomatMode;
  rounds: ParkomatRound[];
  durationSec?: number;
  onComplete: (result: {
    answered: number;
    correct: number;
    events: ParkomatTelemetryEvent[];
  }) => void;
  onTelemetry?: (event: ParkomatTelemetryEvent) => void;
};

export function ParkomatGame({
  mode,
  rounds,
  durationSec = 100,
  onComplete,
  onTelemetry,
}: ParkomatGameProps) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [phase, setPhase] = useState<ParkomatPhase>("reading");
  const [selectedGate, setSelectedGate] = useState<ParkomatGate | null>(null);
  const [showBump, setShowBump] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationSec);
  const [finished, setFinished] = useState(false);
  const [playScore, setPlayScore] = useState(0);

  const eventsRef = useRef<ParkomatTelemetryEvent[]>([]);
  const correctCountRef = useRef(0);
  const completedRef = useRef(false);
  const roundStartedAtRef = useRef(Date.now());

  const currentRound = rounds[roundIndex % rounds.length];
  const gameSpeedClass = mode === "play" ? "parkomat--play" : "parkomat--diagnostic";
  const fastMode = durationSec <= 3 || isDiagnosticFastMode();

  const finishGame = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setFinished(true);
    onComplete({
      answered: eventsRef.current.length,
      correct: correctCountRef.current,
      events: eventsRef.current,
    });
  }, [onComplete]);

  useEffect(() => {
    roundStartedAtRef.current = Date.now();
    setPhase("reading");
    setSelectedGate(null);
    setShowBump(false);

    const readingMs = mode === "diagnostic" ? 900 : 450;
    const readingTimer = window.setTimeout(() => {
      setPhase((p) => (p === "reading" ? "driving" : p));
    }, readingMs);

    return () => window.clearTimeout(readingTimer);
  }, [roundIndex, mode]);

  useEffect(() => {
    if (completedRef.current) return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      finishGame();
    }
  }, [timeLeft, finishGame]);

  const answer = useCallback(
    (gate: ParkomatGate) => {
      if (!currentRound || completedRef.current || finished) return;
      if (phase === "turning" || phase === "result") return;

      const reactionTimeMs = Date.now() - roundStartedAtRef.current;
      const isCorrect = gate === currentRound.correctGate;

      const event: ParkomatTelemetryEvent = {
        type: "parkomat_round_answered",
        roundId: currentRound.id,
        mode,
        selectedGate: gate,
        correctGate: currentRound.correctGate,
        isCorrect,
        reactionTimeMs,
        lexicalMarker: currentRound.lexicalMarker,
        roundType: currentRound.roundType,
        semanticError: !isCorrect,
        operationDirectionError: !isCorrect,
        timestamp: Date.now(),
      };

      eventsRef.current = [...eventsRef.current, event];
      if (isCorrect) {
        correctCountRef.current += 1;
        if (mode === "play") {
          setPlayScore(correctCountRef.current);
        }
      }
      onTelemetry?.(event);

      setSelectedGate(gate);
      setPhase("turning");
      if (!isCorrect) {
        setShowBump(true);
      }

      const turnMs = mode === "diagnostic" ? 650 : 450;
      const nextRoundMs = mode === "diagnostic" ? 1050 : 750;

      window.setTimeout(() => setPhase("result"), turnMs);

      window.setTimeout(() => {
        const answered = eventsRef.current.length;
        if (mode === "diagnostic" && fastMode && answered >= 2) {
          finishGame();
          return;
        }

        setSelectedGate(null);
        setShowBump(false);
        setRoundIndex((prev) => prev + 1);
      }, nextRoundMs);
    },
    [currentRound, mode, onTelemetry, phase, finished, fastMode, finishGame],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        answer("minus");
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        answer("plus");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [answer]);

  const carClassName = useMemo(() => {
    const parts = ["parkomat-car"];
    if (selectedGate === "minus") parts.push("parkomat-car--left");
    if (selectedGate === "plus") parts.push("parkomat-car--right");
    if (showBump) parts.push("parkomat-car--bump");
    return parts.join(" ");
  }, [selectedGate, showBump]);

  const controlsDisabled = phase === "turning" || phase === "result" || finished;

  if (finished) {
    return (
      <div
        className="parkomat parkomat--finished"
        data-testid="diagnostic-minigame"
        data-mode={mode}
        data-game="parkomat"
      >
        {mode === "play" ? (
          <p>
            Игра завершена! Очки: {correctCountRef.current}
          </p>
        ) : (
          <p>Игра завершена</p>
        )}
      </div>
    );
  }

  return (
    <section
      className={`parkomat ${gameSpeedClass}`}
      data-testid="diagnostic-minigame"
      data-mode={mode}
      data-game="parkomat"
    >
      <picture>
        <source media="(min-width: 768px)" srcSet={PARKOMAT_ASSETS.bgDesktop} />
        <img className="parkomat__bg" src={PARKOMAT_ASSETS.bgMobile} alt="" aria-hidden />
      </picture>

      <div
        className="parkomat__content"
        data-testid="parkomat-game"
        data-correct-gate={currentRound?.correctGate}
        data-phase={phase}
      >
        <header className="parkomat__header">
          <div className="parkomat__header-badge" aria-label="МышМат: ПаркоМат">
            МышМат: ПаркоМат
          </div>
          {mode === "diagnostic" ? (
            <div className="parkomat__timer" aria-label={`Осталось ${timeLeft} секунд`}>
              ⏱ {timeLeft}
            </div>
          ) : (
            <div className="parkomat__score">⭐ {playScore}</div>
          )}
        </header>

        <div className="parkomat__condition-card">
          <p>{currentRound?.text}</p>
          <div className="parkomat__dash" />
          <strong>Какой шлагбаум открыть?</strong>
        </div>

        <div className="parkomat__scene">
          <button
            type="button"
            className={`parkomat-gate parkomat-gate--minus${
              selectedGate === "minus" ? " parkomat-gate--open" : ""
            }`}
            data-testid="parkomat-gate-minus"
            disabled={controlsDisabled}
            onClick={() => answer("minus")}
            aria-label="Открыть левый шлагбаум: минус"
          >
            <span className="parkomat-gate__symbol" aria-hidden>
              −
            </span>
          </button>

          <button
            type="button"
            className={`parkomat-gate parkomat-gate--plus${
              selectedGate === "plus" ? " parkomat-gate--open" : ""
            }`}
            data-testid="parkomat-gate-plus"
            disabled={controlsDisabled}
            onClick={() => answer("plus")}
            aria-label="Открыть правый шлагбаум: плюс"
          >
            <span className="parkomat-gate__symbol" aria-hidden>
              +
            </span>
          </button>

          <DiagnosticAssetImage
            className={carClassName}
            src={PARKOMAT_ASSETS.carMascot}
            alt=""
            width={180}
            height={135}
            aria-hidden
          />
        </div>

        <nav className="parkomat-controls" aria-label="Управление машинкой">
          <button
            type="button"
            className="parkomat-control parkomat-control--left"
            data-testid="parkomat-control-left"
            disabled={controlsDisabled}
            onClick={() => answer("minus")}
            aria-label="Выбрать минус"
          >
            <span className="parkomat-control__arrow" aria-hidden>
              ←
            </span>
          </button>

          <button
            type="button"
            className="parkomat-control parkomat-control--right"
            data-testid="parkomat-control-right"
            disabled={controlsDisabled}
            onClick={() => answer("plus")}
            aria-label="Выбрать плюс"
          >
            <span className="parkomat-control__arrow" aria-hidden>
              →
            </span>
          </button>
        </nav>
      </div>
    </section>
  );
}
