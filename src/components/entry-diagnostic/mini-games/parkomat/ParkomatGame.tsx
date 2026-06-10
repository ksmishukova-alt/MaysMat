"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { ParkomatRound } from "@/data/entry-diagnostic/mini-games/parkomat-rounds";
import type { ParkomatGate } from "@/data/entry-diagnostic/mini-games/parkomat-rounds";
import { isDiagnosticFastMode } from "@/lib/entry-diagnostic/fast-mode";
import { DiagnosticAssetImage } from "@/components/entry-diagnostic/ui/DiagnosticAssetImage";
import {
  PARKOMAT_ASSETS,
  resolveParkomatLayout,
  resolveParkomatSceneBg,
  resolveParkomatSceneVariant,
  type ParkomatLayout,
} from "./parkomat-assets";
import { poseFromStep, runCarPathSteps, sleep } from "./parkomat-car-path";
import {
  getApproachPath,
  getBranchPath,
  type CarPose,
} from "./parkomat-paths";
import type {
  GateState,
  ParkomatMode,
  ParkomatPhase,
  ParkomatTelemetryEvent,
} from "./types";
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

type RoundAnswer = { gate: ParkomatGate; isCorrect: boolean };

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
  const [hasAnswered, setHasAnswered] = useState(false);
  const [carPose, setCarPose] = useState<CarPose>({ x: 50, y: 86, rotate: 0 });
  const [carTransitionMs, setCarTransitionMs] = useState(0);
  const [showHit, setShowHit] = useState(false);
  const [minusGateState, setMinusGateState] = useState<GateState>("closed");
  const [plusGateState, setPlusGateState] = useState<GateState>("closed");
  const [timeLeft, setTimeLeft] = useState(durationSec);
  const [finished, setFinished] = useState(false);
  const [playScore, setPlayScore] = useState(0);
  const [layout, setLayout] = useState<ParkomatLayout>("desktop");

  const eventsRef = useRef<ParkomatTelemetryEvent[]>([]);
  const correctCountRef = useRef(0);
  const completedRef = useRef(false);
  const roundStartedAtRef = useRef(Date.now());
  const sequenceRef = useRef(0);
  const answerRef = useRef<RoundAnswer | null>(null);
  const driveAbortRef = useRef<AbortController | null>(null);

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
    const sync = () => setLayout(resolveParkomatLayout(window.innerWidth));
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const resetRoundVisuals = useCallback(() => {
    driveAbortRef.current?.abort();
    driveAbortRef.current = null;
    setPhase("reading");
    setSelectedGate(null);
    setHasAnswered(false);
    answerRef.current = null;
    setShowHit(false);
    setMinusGateState("closed");
    setPlusGateState("closed");
    setCarTransitionMs(0);
    roundStartedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    resetRoundVisuals();
  }, [roundIndex, resetRoundVisuals]);

  useEffect(() => {
    const start = getApproachPath(layout)[0]!;
    setCarPose(poseFromStep(start));
    setCarTransitionMs(0);
  }, [roundIndex, layout]);

  useEffect(() => {
    if (phase !== "reading" || finished || completedRef.current) return;
    const readingMs = mode === "diagnostic" ? 900 : 450;
    const timer = window.setTimeout(() => {
      setPhase((p) => (p === "reading" ? "drivingStraight" : p));
    }, readingMs);
    return () => window.clearTimeout(timer);
  }, [phase, roundIndex, mode, finished]);

  useEffect(() => {
    if (completedRef.current) return;
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) finishGame();
  }, [timeLeft, finishGame]);

  const scheduleNextRound = useCallback(() => {
    const answered = eventsRef.current.length;
    if (mode === "diagnostic" && fastMode && answered >= 2) {
      finishGame();
      return;
    }
    window.setTimeout(() => setRoundIndex((prev) => prev + 1), mode === "diagnostic" ? 420 : 320);
  }, [mode, fastMode, finishGame]);

  const openSelectedGate = useCallback((gate: ParkomatGate, seq: number) => {
    window.setTimeout(() => {
      if (sequenceRef.current !== seq) return;
      setPhase("gateOpening");
      if (gate === "minus") setMinusGateState("opening");
      else setPlusGateState("opening");
    }, 40);

    window.setTimeout(() => {
      if (sequenceRef.current !== seq) return;
      if (gate === "minus") setMinusGateState("open");
      else setPlusGateState("open");
    }, 320);
  }, []);

  const answer = useCallback(
    (gate: ParkomatGate) => {
      if (!currentRound || completedRef.current || finished || hasAnswered) return;
      if (phase !== "reading" && phase !== "drivingStraight") return;

      const seq = ++sequenceRef.current;
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
        if (mode === "play") setPlayScore(correctCountRef.current);
      }
      onTelemetry?.(event);

      setSelectedGate(gate);
      setHasAnswered(true);
      answerRef.current = { gate, isCorrect };
      openSelectedGate(gate, seq);
    },
    [currentRound, mode, onTelemetry, phase, finished, hasAnswered, openSelectedGate],
  );

  useEffect(() => {
    if (phase !== "drivingStraight" || finished || completedRef.current || !currentRound) return;

    const abort = new AbortController();
    driveAbortRef.current = abort;
    const { signal } = abort;

    const applyStep = (durationMs: number, pose: CarPose) => {
      if (signal.aborted) return;
      setCarTransitionMs(durationMs > 0 ? durationMs : 0);
      setCarPose(pose);
    };

    void (async () => {
      try {
        const approach = getApproachPath(layout);
        await runCarPathSteps(
          approach,
          0,
          (step) => applyStep(step.durationMs, poseFromStep(step)),
          signal,
        );
        if (signal.aborted) return;

        while (!answerRef.current && !signal.aborted) {
          await sleep(50, signal);
        }
        if (signal.aborted) return;

        await sleep(300, signal);
        if (signal.aborted) return;

        setPhase("turning");

        const branch = getBranchPath(layout, currentRound.correctGate);
        const { isCorrect } = answerRef.current!;

        for (let i = 0; i < branch.length; i++) {
          if (signal.aborted) return;
          const step = branch[i]!;
          applyStep(step.durationMs, poseFromStep(step));
          if (step.durationMs > 0) {
            await sleep(step.durationMs, signal);
          }

          if (step.gateTrigger) {
            if (!isCorrect) {
              setPhase("failHit");
              setShowHit(true);
              await sleep(mode === "diagnostic" ? 840 : 540, signal);
              if (signal.aborted) return;
              scheduleNextRound();
              return;
            }
            setPhase("successPass");
          }
        }

        if (signal.aborted) return;
        await sleep(400, signal);
        scheduleNextRound();
      } catch {
        // прервано сменой раунда
      }
    })();

    return () => {
      abort.abort();
      driveAbortRef.current = null;
    };
  }, [phase, roundIndex, layout, finished, currentRound, mode, scheduleNextRound]);

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

  const sceneBg = useMemo(
    () => resolveParkomatSceneBg(minusGateState, plusGateState, layout),
    [minusGateState, plusGateState, layout],
  );

  const sceneVariant = useMemo(
    () => resolveParkomatSceneVariant(minusGateState, plusGateState),
    [minusGateState, plusGateState],
  );

  const carStyle = {
    "--car-x": `${carPose.x}%`,
    "--car-y": `${carPose.y}%`,
    "--car-rotate": `${carPose.rotate}deg`,
    "--car-transition-ms": `${carTransitionMs}ms`,
  } as CSSProperties;

  const controlsDisabled =
    hasAnswered || (phase !== "reading" && phase !== "drivingStraight") || finished;

  const minusGateClass = [
    "parkomat-gate",
    "parkomat-gate--minus",
    minusGateState !== "closed" ? "parkomat-gate--open" : "",
    minusGateState === "opening" ? "parkomat-gate--opening" : "",
    selectedGate === "minus" ? "parkomat-gate--selected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const plusGateClass = [
    "parkomat-gate",
    "parkomat-gate--plus",
    plusGateState !== "closed" ? "parkomat-gate--open" : "",
    plusGateState === "opening" ? "parkomat-gate--opening" : "",
    selectedGate === "plus" ? "parkomat-gate--selected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const carClassName = [
    "parkomat-car",
    showHit ? "parkomat-car--hit" : "",
    phase === "successPass" ? "parkomat-car--success" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (finished) {
    return (
      <div
        className="parkomat parkomat--finished"
        data-testid="diagnostic-minigame"
        data-mode={mode}
        data-game="parkomat"
      >
        {mode === "play" ? (
          <p>Игра завершена! Очки: {correctCountRef.current}</p>
        ) : (
          <p>Игра завершена</p>
        )}
      </div>
    );
  }

  return (
    <section
      className={`parkomat ${gameSpeedClass} parkomat--layered-art parkomat--${layout}`}
      data-testid="diagnostic-minigame"
      data-mode={mode}
      data-game="parkomat"
      data-layout={layout}
    >
      <img className="parkomat__bg" src={sceneBg} alt="" aria-hidden />

      <div
        className="parkomat__content"
        data-testid="parkomat-game"
        data-correct-gate={currentRound?.correctGate}
        data-phase={phase}
        data-scene={sceneVariant}
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
            className={minusGateClass}
            data-testid="parkomat-gate-minus"
            disabled={controlsDisabled}
            onClick={() => answer("minus")}
            aria-label="Открыть левый шлагбаум: минус"
          >
            <span className="parkomat-gate__arm" aria-hidden />
            <span className="parkomat-gate__symbol" aria-hidden>
              −
            </span>
          </button>

          <button
            type="button"
            className={plusGateClass}
            data-testid="parkomat-gate-plus"
            disabled={controlsDisabled}
            onClick={() => answer("plus")}
            aria-label="Открыть правый шлагбаум: плюс"
          >
            <span className="parkomat-gate__arm" aria-hidden />
            <span className="parkomat-gate__symbol" aria-hidden>
              +
            </span>
          </button>

          <DiagnosticAssetImage
            className={carClassName}
            style={carStyle}
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
