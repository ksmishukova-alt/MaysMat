"use client";

import { useState } from "react";
import type { RunnerBoardProps } from "./types";
import { parseExpression, parseGridSize, extractNumbers } from "./parse-task";

/** Порядок действий + выражение */
export function ExpressionOrderBoard({ task, response, onPatch }: RunnerBoardProps) {
  const expr = parseExpression(task.taskText) ?? task.taskText;
  const order = ["× :", "+ −", "скобки"] as const;

  return (
    <div className="space-y-4" data-board="expression">
      <p className="rounded-lg bg-white p-4 text-center font-mono text-lg">{expr}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {order.map((o, i) => (
          <button
            key={o}
            type="button"
            onClick={() => onPatch("actionOrder", i + 1)}
            className={`min-h-11 rounded-xl border-2 px-4 text-sm ${
              response.actionOrder === i + 1 ? "border-brand-purple bg-lavender-50" : "border-gray-200"
            }`}
          >
            {i + 1}. {o}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Встроенный вычислительный помощник */
export function EmbeddedCalculatorPanel({
  response,
  onPatch,
}: {
  response: Record<string, unknown>;
  onPatch: (key: string, value: unknown) => void;
}) {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const tool = String(response.usedCalculator ?? "");

  return (
    <div className="rounded-xl border border-lavender-200 bg-lavender-50 p-4" data-board="calculator">
      <div className="mb-3 flex gap-2">
        {[
          { id: "column", label: "Столбик" },
          { id: "multiply_divide", label: "× / :" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onPatch("usedCalculator", t.id)}
            className={`min-h-10 rounded-lg px-3 text-sm ${
              tool === t.id ? "bg-brand-purple text-white" : "bg-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tool ? (
        <div className="flex items-center gap-2 font-mono">
          <input
            type="number"
            aria-label="число a"
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="w-20 rounded border px-2 py-1"
          />
          <span>{tool === "column" ? "+" : "×"}</span>
          <input
            type="number"
            aria-label="число b"
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="w-20 rounded border px-2 py-1"
          />
          <span>= {tool === "column" ? a + b : a * b}</span>
        </div>
      ) : (
        <p className="text-xs text-gray-500">Выбери помощник для больших вычислений</p>
      )}
    </div>
  );
}

/** План задачи — маршрут */
export function TextProblemPlanBoard({ task, response, onPatch }: RunnerBoardProps) {
  const steps = Number(response.actionCount ?? 2);
  void task;
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2" data-board="plan">
      {Array.from({ length: Math.max(steps, 2) }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPatch("planStepFocus", i)}
            className={`min-h-12 min-w-12 rounded-full border-2 text-xs ${
              response.planStepFocus === i ? "border-brand-purple bg-lavender-50" : "border-gray-200"
            }`}
          >
            {i + 1}
          </button>
          {i < steps - 1 ? <span className="text-gray-300">→</span> : null}
        </div>
      ))}
    </div>
  );
}

/** S · v · t */
export function MotionModelBoard({ task, response, onPatch }: RunnerBoardProps) {
  const labels = [
    { key: "S", label: "Путь S" },
    { key: "v", label: "Скорость v" },
    { key: "t", label: "Время t" },
  ];
  const unknown = task.taskText.includes("Скорость")
    ? "v"
    : task.taskText.includes("Время")
      ? "t"
      : "S";

  return (
    <div className="space-y-3" data-board="motion">
      <div className="flex justify-center gap-4">
        {labels.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onPatch("motionUnknown", key)}
            className={`rounded-xl border-2 px-4 py-3 text-sm ${
              unknown === key || response.motionUnknown === key
                ? "border-brand-purple bg-lavender-50 font-semibold"
                : "border-gray-200"
            }`}
          >
            {label}
            {unknown === key ? " ?" : ""}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-gray-500">S = v × t</p>
    </div>
  );
}

/** Геометрия на сетке */
export function GeometryGridBoard({ task, response, onPatch }: RunnerBoardProps) {
  const size = parseGridSize(task.taskText) ?? { w: 4, h: 3 };
  const cells = size.w * size.h;
  const selected = Number(response.gridCells ?? 0);

  return (
    <div data-board="geometry">
      <div
        className="inline-grid gap-1"
        style={{ gridTemplateColumns: `repeat(${size.w}, 2rem)` }}
      >
        {Array.from({ length: cells }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`клетка ${i + 1}`}
            onClick={() => onPatch("gridCells", i + 1)}
            className={`h-8 w-8 rounded border ${
              i < selected ? "border-brand-purple bg-lavender-200" : "border-gray-200 bg-white"
            }`}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500">
        {size.w}×{size.h} — отметь клетки для площади/периметра
      </p>
    </div>
  );
}

/** Дроби */
export function FractionModelBoard({ task, response, onPatch }: RunnerBoardProps) {
  const frac = task.taskText.match(/(\d+)\/(\d+)/);
  const num = frac ? Number(frac[1]) : 1;
  const den = frac ? Number(frac[2]) : 2;
  const parts = Array.from({ length: den });

  return (
    <div className="space-y-2" data-board="fraction">
      <div className="flex h-10 overflow-hidden rounded-lg border border-gray-300">
        {parts.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPatch("fractionSelected", i + 1)}
            className={`flex-1 border-r last:border-r-0 ${
              i < num || response.fractionSelected === i + 1 ? "bg-amber-300" : "bg-amber-50"
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-gray-600">
        Доля: {num}/{den}
      </p>
    </div>
  );
}

/** Проценты */
export function PercentModelBoard({ task, response, onPatch }: RunnerBoardProps) {
  const pct = extractNumbers(task.taskText).find((n) => n <= 100) ?? 10;

  return (
    <div data-board="percent">
      <div className="grid grid-cols-10 gap-0.5">
        {Array.from({ length: 100 }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`клетка ${i + 1}%`}
            onClick={() => onPatch("percentMarked", i + 1)}
            className={`h-3 w-3 rounded-sm ${
              i < pct ? "bg-brand-purple" : "bg-gray-100"
            } ${response.percentMarked === i + 1 ? "ring-2 ring-amber-400" : ""}`}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500">1% = одна клетка · сетка 10×10</p>
    </div>
  );
}

/** Логика если-то */
export function LogicIfThenBoard({ task, response, onPatch }: RunnerBoardProps) {
  const options = ["следствие верно", "контрпример", "условие другое"];
  return (
    <div className="space-y-3" data-board="logic">
      <div className="rounded-lg bg-lavender-50 p-3 text-sm">{task.taskText.slice(0, 120)}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onPatch("logicChoice", o)}
            className={`min-h-10 rounded-xl border px-3 text-sm ${
              response.logicChoice === o ? "border-brand-purple bg-lavender-50" : "border-gray-200"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Системный перебор */
export function SystematicSearchBoard({ task, response, onPatch }: RunnerBoardProps) {
  void task;
  const variants = ["12", "21", "13", "31"];
  const checked = (response.searchChecked as string[]) ?? [];

  return (
    <div className="space-y-2" data-board="search">
      <div className="grid grid-cols-2 gap-2">
        {variants.map((v) => {
          const on = checked.includes(v);
          return (
            <button
              key={v}
              type="button"
              onClick={() => {
                const next = on ? checked.filter((x) => x !== v) : [...checked, v];
                onPatch("searchChecked", next);
              }}
              className={`min-h-11 rounded-xl border text-sm ${
                on ? "border-brand-purple bg-lavender-50" : "border-gray-200"
              }`}
            >
              {v}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500">Отмечай варианты по порядку, не пропуская</p>
    </div>
  );
}

/** Закономерности и циклы */
export function PatternCycleBoard({ task, response, onPatch }: RunnerBoardProps) {
  void task;
  const cycle = ["▲", "●", "■"];
  const pos = Number(response.cyclePosition ?? 1);

  return (
    <div className="space-y-3" data-board="pattern">
      <div className="flex justify-center gap-3 text-2xl">
        {cycle.map((sym, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPatch("cyclePosition", i + 1)}
            className={`rounded-lg px-3 py-2 ${
              pos === i + 1 ? "bg-lavender-100 ring-2 ring-brand-purple" : "bg-white"
            }`}
          >
            {sym}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-gray-500">Период = {cycle.length}</p>
    </div>
  );
}
