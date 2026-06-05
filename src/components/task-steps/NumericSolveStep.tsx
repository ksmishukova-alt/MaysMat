"use client";

import { useState } from "react";
import type { AcceptedAnswer } from "@/data/heads-legs/types";
import type { NumericSolveStep as NumericSolveStepDef } from "@/data/task-steps";

interface NumericSolveStepProps {
  step: NumericSolveStepDef;
  onComplete: () => void;
}

function checkAnswer(input: string, accepted: AcceptedAnswer): boolean {
  const trimmed = input.trim();
  if (accepted.kind === "text") {
    return trimmed.replace(/\s/g, "") === accepted.format.replace(/\s/g, "");
  }
  if (accepted.kind === "diagnostic") {
    return /нельзя|не\s*хватает|неполн/i.test(trimmed);
  }
  if (accepted.kind === "single_scalar") {
    return Number(trimmed) === accepted.value;
  }
  if (accepted.kind === "single") {
    const nums = trimmed.match(/\d+/g)?.map(Number) ?? [];
    const expected = Object.values(accepted.values);
    if (nums.length < expected.length) return false;
    return expected.every((v) => nums.includes(v));
  }
  if (accepted.kind === "multi_set") {
    const nums = trimmed.match(/\d+/g)?.map(Number) ?? [];
    return accepted.sets.some((set) => {
      const exp = Object.values(set);
      return exp.every((v) => nums.includes(v));
    });
  }
  return false;
}

export function NumericSolveStep({ step, onComplete }: NumericSolveStepProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const accepted = step.acceptedAnswers;

  const submit = () => {
    if (checkAnswer(value, accepted)) {
      setOk(true);
      setError(null);
    } else if (accepted.kind === "diagnostic") {
      setError("Напиши, что единственный ответ найти нельзя, и объясни почему.");
    } else {
      setError("Проверь вычисления. Если данных не хватает — опиши это словами.");
    }
  };

  if (ok) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-emerald-700">✓ Ответ принят. Теперь запиши решение словами.</p>
        <button
          type="button"
          onClick={onComplete}
          className="rounded-xl bg-brand-purple px-5 py-2 text-sm font-semibold text-white"
        >
          Далее →
        </button>
      </div>
    );
  }

  const placeholder =
    accepted.kind === "diagnostic"
      ? "Единственный ответ найти нельзя, потому что…"
      : accepted.kind === "text"
        ? "Формат ответа, напр. 4:6"
        : "Числовой ответ";

  return (
    <div className="space-y-3">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-lavender-200 px-3 py-2 text-sm"
        placeholder={placeholder}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="button"
        onClick={submit}
        className="rounded-xl bg-brand-purple px-5 py-2 text-sm font-semibold text-white"
      >
        Проверить ответ
      </button>
    </div>
  );
}
