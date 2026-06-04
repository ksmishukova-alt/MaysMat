"use client";

import { useEffect, useState } from "react";
import type { TableRow } from "@/data/tasks";
import { STEP_SUCCESS_MS } from "./step-advance";
import { StepSuccess } from "./StepSuccess";

interface TableInputStepProps {
  stepId?: string;
  rows: TableRow[];
  columnLabel?: string;
  onComplete: () => void;
}

export function TableInputStep({
  stepId,
  rows,
  columnLabel = "Ног",
  onComplete,
}: TableInputStepProps) {
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
    const ok = rows.every((row) => Number(values[row.id]) === row.answer);
    if (ok) {
      setSuccess(true);
    } else {
      setError("Проверь количество ног у каждого участника");
    }
  };

  if (success) {
    return <StepSuccess />;
  }

  return (
    <div>
      <table className="mb-6 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-card">
        <thead>
          <tr className="bg-lavender-50 text-left text-sm text-gray-500">
            <th className="px-4 py-3">Участник</th>
            <th className="px-4 py-3">{columnLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-lavender-100">
              <td className="px-4 py-3">
                {row.emoji} {row.label}
              </td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  value={values[row.id] ?? ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [row.id]: e.target.value }))
                  }
                  className="w-20 rounded-lg border border-lavender-200 px-3 py-1.5 text-center focus:border-brand-purple focus:outline-none"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error ? <p className="mb-3 text-sm text-red-500">{error}</p> : null}
      <button
        type="button"
        onClick={check}
        className="rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-medium text-white"
      >
        Проверить
      </button>
    </div>
  );
}
