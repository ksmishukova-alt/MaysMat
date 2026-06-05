"use client";

import { useEffect, useState } from "react";
import type { WorksheetRow } from "@/data/tasks";
import type { RunnerContext } from "@/lib/runner-context";
import { STEP_SUCCESS_MS } from "./step-advance";
import { StepSuccess } from "./StepSuccess";

interface WorksheetTableStepProps {
  stepId?: string;
  rows: WorksheetRow[];
  successMessage?: string;
  runnerContext?: RunnerContext;
  onComplete: () => void;
}

export function WorksheetTableStep({
  stepId,
  rows,
  successMessage,
  runnerContext = "heads-legs",
  onComplete,
}: WorksheetTableStepProps) {
  const inputRows = rows.filter(
    (row): row is WorksheetRow & { answer: number } =>
      row.inputType !== "static" && row.answer !== undefined
  );
  const [values, setValues] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setValues({});
    setSuccess(false);
    setError("");
  }, [stepId]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(onComplete, STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [success, onComplete]);

  const check = () => {
    if (inputRows.length === 0) return;
    const ok = inputRows.every((row) => Number(values[row.id]) === row.answer);
    if (ok) {
      setSuccess(true);
    } else {
      setError("Проверь ответы — пройди по каждому вопросу из плана");
    }
  };

  if (success) {
    return <StepSuccess message={successMessage ?? "✅ Верно! План выполнен."} />;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">
        {runnerContext === "dirichlet"
          ? "Заполни таблицу — выпиши числа и формулировки из условия."
          : "Заполни таблицу — ответь на каждый вопрос из плана."}
      </p>
      <table className="mb-6 w-full overflow-hidden rounded-xl bg-white shadow-card">
        <thead>
          <tr className="bg-lavender-50 text-left text-sm text-gray-500">
            <th className="px-4 py-3">Вопрос</th>
            <th className="px-4 py-3">Ответ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) =>
            row.inputType === "static" ? (
              <tr key={row.id} className="border-t border-lavender-100 bg-lavender-50/60">
                <td colSpan={2} className="px-4 py-3 text-sm leading-relaxed text-gray-700">
                  {row.question}
                </td>
              </tr>
            ) : (
              <tr key={row.id} className="border-t border-lavender-100">
                <td className="px-4 py-3 text-sm">{row.question}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {row.prefix ? (
                      <span className="font-mono text-sm text-gray-600">{row.prefix}</span>
                    ) : null}
                    <input
                      type="number"
                      value={values[row.id] ?? ""}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, [row.id]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === "Enter" && check()}
                      className="w-20 rounded-lg border border-lavender-200 px-3 py-1.5 text-center font-mono focus:border-brand-purple focus:outline-none"
                    />
                    {row.suffix ? (
                      <span className="font-mono text-sm text-gray-600">{row.suffix}</span>
                    ) : null}
                  </div>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
      {error ? <p className="mb-3 text-sm text-red-500">{error}</p> : null}
      {inputRows.length > 0 ? (
        <button
          type="button"
          onClick={check}
          className="rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-medium text-white"
        >
          Проверить таблицу
        </button>
      ) : (
        <p className="text-sm text-amber-700">Нет полей для ввода на этом шаге.</p>
      )}
    </div>
  );
}
