"use client";

import { useState } from "react";
import type { RunnerBoardProps } from "./types";
import { parseExpression, parseGridSize, extractNumbers } from "./parse-task";

/** Порядок действий + выражение */
export function ExpressionOrderBoard({ task, response, onPatch, onRecordError }: RunnerBoardProps) {
  const expr = parseExpression(task.taskText) ?? task.taskText;
  const order = ["× :", "+ −", "скобки"] as const;

  return (
    <div className="space-y-4" data-board="expression">
      <p className="rounded-xl border border-gray-200 bg-white p-4 text-center font-mono text-xl shadow-inner">
        {expr}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {order.map((o, i) => (
          <button
            key={o}
            type="button"
            onClick={() => {
              onPatch("actionOrder", i + 1);
              if (i > 0) onRecordError("orderErrors", "order_error");
            }}
            className={`min-h-12 min-w-[5rem] rounded-xl border-2 px-4 text-sm font-medium ${
              response.actionOrder === i + 1
                ? "border-brand-purple bg-lavender-50 shadow-sm"
                : "border-gray-200 bg-white"
            }`}
          >
            {i + 1}. {o}
          </button>
        ))}
      </div>
    </div>
  );
}

import type { ErrorTelemetryBuckets } from "@/lib/entry-diagnostic/error-telemetry";

/** Встроенный вычислительный помощник */
export function EmbeddedCalculatorPanel({
  response,
  onPatch,
  onRecordError,
}: {
  response: Record<string, unknown>;
  onPatch: (key: string, value: unknown) => void;
  onRecordError: (bucket: keyof ErrorTelemetryBuckets, code: string) => void;
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
            onClick={() => {
              onPatch("usedCalculator", t.id);
              if (t.id === "multiply_divide") onRecordError("computationErrors", "computation_error");
            }}
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
export function TextProblemPlanBoard({ task, response, onPatch, onRecordError: _r }: RunnerBoardProps) {
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
export function MotionModelBoard({ task, response, onPatch, onRecordError: _r }: RunnerBoardProps) {
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

/** Геометрия на сетке — забор (периметр) vs плитка (площадь) */
export function GeometryGridBoard({ task, response, onPatch, onRecordError }: RunnerBoardProps) {
  const size = parseGridSize(task.taskText) ?? { w: 4, h: 3 };
  const isPerimeter = task.taskText.toLowerCase().includes("периметр");
  const mode = String(response.geometryMode ?? (isPerimeter ? "fence" : "tile"));

  return (
    <div data-board="geometry" className="space-y-3">
      <div className="flex gap-2">
        {[
          { id: "fence", label: "Забор (P)" },
          { id: "tile", label: "Плитка (S)" },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              onPatch("geometryMode", m.id);
              if (isPerimeter && m.id === "tile") onRecordError("unitErrors", "perimeter_area_confusion");
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
              mode === m.id ? "bg-brand-purple text-white" : "bg-gray-100"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div
        className="inline-grid gap-0.5 rounded border-2 border-gray-400 p-1"
        style={{ gridTemplateColumns: `repeat(${size.w}, 1.75rem)` }}
      >
        {Array.from({ length: size.w * size.h }).map((_, i) => {
          const row = Math.floor(i / size.w);
          const col = i % size.w;
          const isEdge = row === 0 || col === 0 || row === size.h - 1 || col === size.w - 1;
          const active = mode === "fence" ? isEdge : !isEdge || size.w * size.h <= 4;
          return (
            <button
              key={i}
              type="button"
              aria-label={`клетка ${i + 1}`}
              onClick={() => onPatch("gridCells", i + 1)}
              className={`h-7 w-7 rounded-sm border ${
                active ? "border-amber-500 bg-amber-200" : "border-gray-200 bg-white"
              }`}
            />
          );
        })}
      </div>
      <p className="text-xs text-gray-500">
        {size.w}×{size.h} м · режим: {mode === "fence" ? "периметр" : "площадь"}
      </p>
    </div>
  );
}

/** Дроби — модель «сырная доля» */
export function FractionModelBoard({ task, response, onPatch, onRecordError: _r }: RunnerBoardProps) {
  const frac = task.taskText.match(/(\d+)\/(\d+)/);
  const num = frac ? Number(frac[1]) : 1;
  const den = frac ? Number(frac[2]) : 2;
  const slice = (360 / den) * (Number(response.fractionSelected ?? num) || num);

  return (
    <div className="flex flex-col items-center gap-3" data-board="fraction">
      <div
        className="relative h-32 w-32 rounded-full border-4 border-amber-600 bg-amber-100"
        style={{
          background: `conic-gradient(#fbbf24 0deg ${slice}deg, #fef3c7 ${slice}deg 360deg)`,
        }}
      >
        <div className="absolute inset-4 rounded-full bg-white/90" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: den }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPatch("fractionSelected", i + 1)}
            className={`h-8 w-8 rounded-full text-xs font-bold ${
              (response.fractionSelected ?? num) === i + 1
                ? "bg-amber-400 ring-2 ring-amber-600"
                : "bg-amber-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600">
        Доля: {num}/{den} от целого
      </p>
    </div>
  );
}

/** Проценты — сетка 10×10 */
export function PercentModelBoard({ task, response, onPatch, onRecordError: _r }: RunnerBoardProps) {
  const pct = extractNumbers(task.taskText).find((n) => n <= 100) ?? 10;
  const marked = Number(response.percentMarked ?? pct);

  return (
    <div data-board="percent" className="space-y-2">
      <div className="flex items-end justify-between text-xs text-gray-500">
        <span>0%</span>
        <span className="font-semibold text-brand-purple">{marked}%</span>
        <span>100%</span>
      </div>
      <div className="grid grid-cols-10 gap-0.5 rounded-lg border border-gray-200 bg-white p-2">
        {Array.from({ length: 100 }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1} процентов`}
            onClick={() => onPatch("percentMarked", i + 1)}
            className={`h-3 w-3 rounded-sm transition ${
              i < marked ? "bg-brand-purple" : "bg-gray-100 hover:bg-lavender-100"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500">ПроцентоМАТ: 1 клетка = 1%</p>
    </div>
  );
}

/** Логика если-то */
export function LogicIfThenBoard({ task, response, onPatch, onRecordError: _r }: RunnerBoardProps) {
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
export function SystematicSearchBoard({ task, response, onPatch, onRecordError: _r }: RunnerBoardProps) {
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

/** Закономерности — гирлянда цикла */
export function PatternCycleBoard({ task, response, onPatch, onRecordError: _r }: RunnerBoardProps) {
  void task;
  const cycle = ["▲", "●", "■", "★"];
  const pos = Number(response.cyclePosition ?? 1);
  const lights = Array.from({ length: 12 }).map((_, i) => cycle[i % cycle.length]);

  return (
    <div className="space-y-4" data-board="pattern">
      <div className="flex flex-wrap justify-center gap-1 rounded-xl bg-gradient-to-r from-indigo-900 to-purple-900 p-4">
        {lights.map((sym, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPatch("cyclePosition", (i % cycle.length) + 1)}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-lg transition ${
              (i % cycle.length) + 1 === pos
                ? "bg-yellow-300 shadow-lg shadow-yellow-400/50 ring-2 ring-white"
                : "bg-white/20 text-white/80"
            }`}
          >
            {sym}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-gray-500">
        Период = {cycle.length} · выбрана позиция {pos}
      </p>
    </div>
  );
}
