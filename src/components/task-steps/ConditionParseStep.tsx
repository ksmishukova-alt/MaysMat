"use client";

import { useEffect, useMemo, useState } from "react";
import type { ConditionParseData } from "@/data/tasks";
import { STEP_SUCCESS_MS } from "./step-advance";
import { StepSuccess } from "./StepSuccess";

interface ConditionParseStepProps {
  stepId?: string;
  condition: string;
  parseData: ConditionParseData;
  onComplete: () => void;
}

function shuffleChips<T extends { id: string }>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function ConditionParseStep({
  stepId,
  condition,
  parseData,
  onComplete,
}: ConditionParseStepProps) {
  const givenPool = useMemo(
    () => shuffleChips([...parseData.given, ...parseData.distractors]),
    [stepId, parseData]
  );
  const findOptions = useMemo(
    () => shuffleChips([parseData.find, ...parseData.findDistractors]),
    [stepId, parseData]
  );

  const givenIds = useMemo(() => new Set(parseData.given.map((item) => item.id)), [parseData]);
  const [selectedGiven, setSelectedGiven] = useState<Set<string>>(new Set());
  const [selectedFind, setSelectedFind] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSelectedGiven(new Set());
    setSelectedFind(null);
    setSuccess(false);
    setError("");
  }, [stepId]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(onComplete, STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [success, onComplete]);

  const toggleGiven = (id: string) => {
    if (success) return;
    setError("");
    setSelectedGiven((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const check = () => {
    const givenOk =
      selectedGiven.size === givenIds.size &&
      [...givenIds].every((id) => selectedGiven.has(id));
    const findOk = selectedFind === parseData.find.id;

    if (givenOk && findOk) {
      setSuccess(true);
      return;
    }
    if (!givenOk && !findOk) {
      setError("Проверь блоки «Дано» и «Найти»");
    } else if (!givenOk) {
      setError("В «Дано» отметь только то, что прямо сказано в условии — все нужные факты");
    } else {
      setError("Перечитай последний вопрос в условии — что именно нужно найти?");
    }
  };

  if (success) {
    return (
      <div>
        <StepSuccess message="✅ Верно! Так и запишем кратко." />
        <div className="mt-4 rounded-xl bg-lavender-50 p-4 text-sm">
          <p className="mb-2 font-semibold text-brand-purple">Краткая запись</p>
          <p>
            <span className="font-medium">Дано:</span>{" "}
            {parseData.given.map((item) => item.text).join("; ")}
          </p>
          <p className="mt-1">
            <span className="font-medium">Найти:</span> {parseData.find.text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm text-gray-500">
        Прочитай условие и выдели главное — как в тетради: что дано и что найти.
      </p>
      <div className="mb-5 rounded-xl border border-lavender-200 bg-white p-4 text-sm leading-relaxed text-gray-700 whitespace-pre-line">
        {condition}
      </div>

      <div className="mb-5">
        <p className="mb-2 text-sm font-semibold">Дано — отметь все факты из условия:</p>
        <div className="flex flex-wrap gap-2">
          {givenPool.map((chip) => {
            const active = selectedGiven.has(chip.id);
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => toggleGiven(chip.id)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  active
                    ? "border-brand-purple bg-lavender-50 font-medium text-brand-purple"
                    : "border-lavender-200 bg-white text-gray-700 hover:border-lavender-300"
                }`}
              >
                {chip.text}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-2 text-sm font-semibold">Найти — выбери один вопрос задачи:</p>
        <div className="space-y-2">
          {findOptions.map((option) => {
            const active = selectedFind === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setSelectedFind(option.id);
                  setError("");
                }}
                className={`block w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                  active
                    ? "border-brand-purple bg-lavender-50 font-medium text-brand-purple"
                    : "border-lavender-200 bg-white hover:border-lavender-300"
                }`}
              >
                {option.text}
              </button>
            );
          })}
        </div>
      </div>

      {error ? <p className="mb-3 text-sm text-red-500">{error}</p> : null}
      <button
        type="button"
        onClick={check}
        disabled={selectedGiven.size === 0 || !selectedFind}
        className="rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-medium text-white disabled:opacity-40"
      >
        Проверить
      </button>
    </div>
  );
}
