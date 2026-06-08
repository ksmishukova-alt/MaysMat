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
      className={`min-h-10 rounded-lg border px-3 py-2 text-sm ${
        active ? "border-brand-purple bg-lavender-50" : "border-gray-200 bg-white"
      }`}
    >
      {label}
    </button>
  );
}

/** Блок 1: разметка условия по 4 параметрам */
export function ReadingComprehensionBoard({ task, response, onPatch }: RunnerBoardProps) {
  const zones = ["Дано", "Искать", "Лишнее", "Ответ"] as const;
  const nums = extractNumbers(task.taskText);
  const chips = nums.map((n) => String(n));
  const active = String(response.readingZone ?? "");

  return (
    <div className="space-y-4" data-board="reading">
      <p className="rounded-lg bg-lavender-50 p-3 text-sm">{task.taskText}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {zones.map((z) => (
          <div
            key={z}
            className={`rounded-xl border-2 p-3 text-center text-xs font-medium ${
              active === z ? "border-brand-purple bg-lavender-50" : "border-dashed border-gray-200"
            }`}
          >
            {z}
          </div>
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
        <Chip label="вопрос" active={response.readingChip === "вопрос"} onClick={() => onPatch("readingChip", "вопрос")} />
      </div>
    </div>
  );
}

/** Блок 2: сюжетная модель */
export function StoryAddSubBoard({ task, onPatch }: RunnerBoardProps) {
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
export function ColumnAddSubBoard({ task, response, onPatch }: RunnerBoardProps) {
  const parsed = parseBinaryOp(task.taskText);
  if (!parsed) return <p className="text-sm text-gray-500">{task.taskText}</p>;
  const { a, b, op } = parsed;
  const aStr = String(a);
  const bStr = String(b);
  const width = Math.max(aStr.length, bStr.length);

  return (
    <div className="inline-block font-mono text-xl" data-board="column-add-sub">
      <div className="text-right tracking-widest">{aStr.padStart(width, " ")}</div>
      <div className="text-right tracking-widest">
        {op} {bStr.padStart(width - 1, " ")}
      </div>
      <div className="my-1 border-t-2 border-gray-800" />
      <div className="flex justify-end gap-1">
        {Array.from({ length: width }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`разряд ${i}`}
            onClick={() => onPatch("columnDigitMarked", i)}
            className={`h-10 w-8 rounded border ${
              response.columnDigitMarked === i ? "border-brand-purple bg-lavender-50" : "border-gray-200"
            }`}
          >
            _
          </button>
        ))}
      </div>
    </div>
  );
}

/** Столбик: умножение */
export function ColumnMultiplicationBoard({ task, response, onPatch }: RunnerBoardProps) {
  const parsed = parseBinaryOp(task.taskText);
  if (!parsed) return <p className="text-sm">{task.taskText}</p>;
  const { a, b } = parsed;

  return (
    <div className="inline-block font-mono text-xl" data-board="column-mult">
      <div className="text-right">{a}</div>
      <div className="text-right">× {b}</div>
      <div className="my-1 border-t-2 border-gray-800" />
      {[0, 1].map((row) => (
        <button
          key={row}
          type="button"
          onClick={() => onPatch("partialProductRow", row)}
          className={`block w-full text-right text-base ${
            response.partialProductRow === row ? "text-brand-purple" : "text-gray-400"
          }`}
        >
          частичное {row + 1}: ______
        </button>
      ))}
    </div>
  );
}

/** Деление — школьная запись РФ */
export function LongDivisionBoard({ task, onPatch }: RunnerBoardProps) {
  const div = parseDivision(task.taskText) ?? parseBinaryOp(task.taskText.replace(":", "÷"));
  const dividend = div && "dividend" in div ? div.dividend : parseBinaryOp(task.taskText)?.a ?? 0;
  const divisor = div && "divisor" in div ? div.divisor : parseBinaryOp(task.taskText)?.b ?? 1;

  return (
    <div className="flex items-start gap-2 font-mono text-xl" data-board="long-division">
      <div className="border-l-2 border-t-2 border-gray-800 pl-2 pt-1">
        <div>{divisor}</div>
      </div>
      <div>
        <div className="border-b-2 border-gray-800 pb-1">{dividend}</div>
        <button
          type="button"
          onClick={() => onPatch("quotientStarted", true)}
          className="mt-2 min-h-10 rounded border border-brand-purple px-3 text-sm text-brand-purple"
        >
          Записать частное: ___
        </button>
      </div>
    </div>
  );
}

/** Остаток и смысл */
export function RemainderBoard({ task, response, onPatch }: RunnerBoardProps) {
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
