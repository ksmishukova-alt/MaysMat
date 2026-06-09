"use client";

import type { RunnerBoardProps } from "./types";
import { extractNumbers, parseBinaryOp, parseDivision } from "./parse-task";

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`diagnostic-board-chip${active ? " diagnostic-board-chip--active" : ""}`}
    >
      {label}
    </button>
  );
}

/** Блок 1: разметка условия по 4 параметрам */
export function ReadingComprehensionBoard({ task, response, onPatch, onRecordError }: RunnerBoardProps) {
  const zones = ["Дано", "Искать", "Лишнее", "Ответ"] as const;
  const nums = extractNumbers(task.taskText);
  const chips = nums.map((n) => String(n));
  const activeZone = String(response.readingZone ?? "");

  const pickZone = (z: (typeof zones)[number]) => {
    onPatch("readingZone", z);
    if (z === "Лишнее") onRecordError("readingErrors", "question_focus_error");
    if (z === "Ответ" && !task.taskText.includes("?")) onRecordError("dataErrors", "data_error");
  };

  return (
    <div className="space-y-4" data-board="reading">
      <p className="rounded-lg border border-lavender-200 bg-lavender-50 p-3 text-sm leading-relaxed">
        {task.taskText}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {zones.map((z) => (
          <button
            key={z}
            type="button"
            onClick={() => pickZone(z)}
            className={`min-h-14 rounded-xl border-2 p-3 text-center text-xs font-semibold transition ${
              activeZone === z
                ? "border-brand-purple bg-lavender-50 text-brand-purple"
                : "border-dashed border-gray-200 bg-white hover:border-lavender-300"
            }`}
          >
            {z}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <Chip
            key={c}
            label={c}
            active={response.readingChip === c}
            onClick={() => {
              onPatch("readingChip", c);
              onPatch("readingZone", "Дано");
            }}
          />
        ))}
        <Chip
          label="вопрос"
          active={response.readingChip === "вопрос"}
          onClick={() => {
            onPatch("readingChip", "вопрос");
            onPatch("readingZone", "Искать");
          }}
        />
      </div>
    </div>
  );
}

/** Блок 2: сюжетная модель */
export function StoryAddSubBoard({ task, onPatch, onRecordError: _r }: RunnerBoardProps) {
  const nums = extractNumbers(task.taskText);
  const [a, b] = nums.length >= 2 ? [nums[0], nums[1]] : [nums[0] ?? 0, nums[1] ?? 0];
  const op = task.taskText.includes("−") || task.taskText.includes("-") ? "−" : "+";

  return (
    <div className="space-y-3" data-board="story">
      <div className="flex items-center justify-center gap-4 text-lg font-semibold">
        <span className="rounded-xl bg-white px-4 py-2 shadow-sm">{a}</span>
        <span>{op}</span>
        <span className="rounded-xl bg-white px-4 py-2 shadow-sm">{b}</span>
        <span>=</span>
        <button
          type="button"
          className="min-h-11 min-w-16 rounded-xl border-2 border-brand-purple bg-lavender-50 px-3"
          onClick={() => onPatch("storyModelBuilt", true)}
        >
          ?
        </button>
      </div>
      <div className="h-3 rounded-full bg-gradient-to-r from-brand-purple/30 to-brand-purple/70" />
      <p className="text-center text-xs text-gray-500">Отметь модель — затем запиши ответ</p>
    </div>
  );
}

/** Столбик: сложение / вычитание */
export function ColumnAddSubBoard({ task, response, onPatch, onRecordError }: RunnerBoardProps) {
  const parsed = parseBinaryOp(task.taskText);
  if (!parsed) return <p className="text-sm text-gray-500">{task.taskText}</p>;
  const { a, b, op } = parsed;
  const aStr = String(a);
  const bStr = String(b);
  const width = Math.max(aStr.length, bStr.length);
  const carries = (response.columnCarries as number[]) ?? [];

  return (
    <div className="inline-block rounded-xl bg-white p-4 font-mono text-2xl shadow-sm" data-board="column-add-sub">
      <div className="relative text-right tracking-[0.35em]">
        {carries.map((c, i) => (
          <span key={i} className="absolute -top-5 text-xs text-brand-purple" style={{ right: `${(width - 1 - i) * 1.35}em` }}>
            {c || ""}
          </span>
        ))}
        <div>{aStr.padStart(width, "\u00a0")}</div>
        <div>
          {op} {bStr.padStart(width - 1, "\u00a0")}
        </div>
        <div className="my-2 border-t-2 border-gray-900" />
        <div className="flex justify-end gap-1 text-lg">
          {Array.from({ length: width }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`разряд ${i + 1}`}
              onClick={() => {
                onPatch("columnDigitMarked", i);
                const next = [...carries];
                next[i] = 1;
                onPatch("columnCarries", next);
                if (op === "+") onRecordError("computationErrors", "carry_marked");
              }}
              className={`h-11 w-9 rounded border-b-2 ${
                response.columnDigitMarked === i
                  ? "border-brand-purple bg-lavender-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              □
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Столбик: умножение */
export function ColumnMultiplicationBoard({ task, response, onPatch, onRecordError }: RunnerBoardProps) {
  const parsed = parseBinaryOp(task.taskText);
  if (!parsed) return <p className="text-sm">{task.taskText}</p>;
  const { a, b } = parsed;
  const bDigits = String(b).length;

  return (
    <div className="inline-block rounded-xl bg-white p-4 font-mono text-2xl shadow-sm" data-board="column-mult">
      <div className="text-right tracking-widest">{a}</div>
      <div className="text-right">× {b}</div>
      <div className="my-2 border-t-2 border-gray-900" />
      {Array.from({ length: Math.min(bDigits, 2) }).map((_, row) => (
        <button
          key={row}
          type="button"
          onClick={() => {
            onPatch("partialProductRow", row);
            onRecordError("computationErrors", row === 1 ? "shift_error" : "partial_product_error");
          }}
          className={`mb-1 block w-full rounded px-2 py-1 text-right text-base ${
            response.partialProductRow === row
              ? "bg-lavender-50 text-brand-purple"
              : "text-gray-400 hover:bg-gray-50"
          }`}
          style={{ paddingRight: `${row * 0.75}rem` }}
        >
          {row === 0 ? "× ед." : "× дес."} → ______
        </button>
      ))}
      <div className="mt-2 border-t border-dashed border-gray-400 pt-1 text-right text-gray-500">+ сумма</div>
    </div>
  );
}

/** Деление — школьная запись РФ (уголок) */
export function LongDivisionBoard({ task, onPatch, onRecordError: _r }: RunnerBoardProps) {
  const div = parseDivision(task.taskText);
  const parsed = parseBinaryOp(task.taskText.replace(":", "÷"));
  const dividend = div?.dividend ?? parsed?.a ?? 0;
  const divisor = div?.divisor ?? parsed?.b ?? 1;

  return (
    <div className="inline-block rounded-xl bg-white p-5 font-mono shadow-sm" data-board="long-division">
      <div className="flex items-start gap-0">
        <div className="flex min-w-[2.5rem] flex-col items-end pr-2 pt-6 text-2xl font-bold text-gray-700">
          {divisor}
        </div>
        <div className="border-l-2 border-t-2 border-gray-900 pl-3 pt-1">
          <div className="min-w-[4rem] text-right text-2xl tracking-widest">{dividend}</div>
          <div className="mt-3 flex gap-2 border-t border-dashed border-gray-300 pt-2">
            {Array.from({ length: String(Math.floor(dividend / divisor)).length || 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onPatch("quotientDigit", i)}
                className="h-10 w-8 border-b-2 border-brand-purple/40 text-center text-lg text-brand-purple"
              >
                □
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-500">Запись деления «уголком» — частное сверху</p>
    </div>
  );
}

/** Остаток и смысл */
export function RemainderBoard({ task, response, onPatch, onRecordError: _r }: RunnerBoardProps) {
  const div = parseDivision(task.taskText);
  const nums = extractNumbers(task.taskText);
  const n = div?.dividend ?? nums[0] ?? 0;
  const d = div?.divisor ?? nums[1] ?? 1;
  const q = Math.floor(n / d);
  const r = n % d;

  return (
    <div className="space-y-3" data-board="remainder">
      <p className="text-sm">
        {n} : {d} = {q} (ост. {r})
      </p>
      <div className="flex gap-2">
        {["остаток", "полные группы", "округлить вверх"].map((label) => (
          <Chip
            key={label}
            label={label}
            active={response.remainderFocus === label}
            onClick={() => onPatch("remainderFocus", label)}
          />
        ))}
      </div>
    </div>
  );
}
