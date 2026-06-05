"use client";

import { useEffect, useMemo, useState } from "react";
import type { ModelBuildStep as ModelBuildStepDef } from "@/data/task-steps";
import {
  inferModelFromCondition,
  validateModelPlacement,
  type ModelSlot,
} from "@/lib/heads-legs-model-infer";
import { StepSuccess } from "./StepSuccess";

interface ModelBuildStepProps {
  step: ModelBuildStepDef;
  condition: string;
  onComplete: () => void;
}

export function ModelBuildStep({ step, condition, onComplete }: ModelBuildStepProps) {
  const inferred = useMemo(() => inferModelFromCondition(condition), [condition]);
  const { entities, numbers, slots, totalObjectsKnown } = inferred;
  const modelLevel = step.modelLevel ?? 1;
  const skipEntitySelection = step.skipEntitySelection ?? false;

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [placement, setPlacement] = useState<Record<string, number | null>>({});
  const [usedNumbers, setUsedNumbers] = useState<Set<number>>(new Set());
  const [missingData, setMissingData] = useState(false);
  const [dragNumber, setDragNumber] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setSelectedTypes([]);
    setPlacement({});
    setUsedNumbers(new Set());
    setMissingData(false);
    setError(null);
    setSuccess(false);
  }, [step.id, condition]);

  const toggleType = (id: string) => {
    setError(null);
    setSelectedTypes((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const placeNumber = (slotId: string, num: number) => {
    setError(null);
    setMissingData(false);
    setPlacement((prev) => {
      const old = prev[slotId];
      const next = { ...prev, [slotId]: num };
      setUsedNumbers((used) => {
        const u = new Set(used);
        if (old != null) u.delete(old);
        u.add(num);
        return u;
      });
      return next;
    });
  };

  const clearSlot = (slotId: string) => {
    setPlacement((prev) => {
      const old = prev[slotId];
      if (old != null) {
        setUsedNumbers((used) => {
          const u = new Set(used);
          u.delete(old);
          return u;
        });
      }
      return { ...prev, [slotId]: null };
    });
  };

  const availableNumbers = numbers.filter((n) => !usedNumbers.has(n));

  const check = () => {
    if (!skipEntitySelection && modelLevel <= 2 && selectedTypes.length < 2) {
      setError("Выбери оба вида объектов из условия.");
      return;
    }
    const result = validateModelPlacement(slots, placement, missingData);
    if (result.ok) {
      setSuccess(true);
      setError(null);
    } else {
      setError(result.message ?? "Проверь модель.");
    }
  };

  const renderSlot = (slot: ModelSlot) => {
    const value = placement[slot.id];
    return (
      <div
        key={slot.id}
        onDragOver={(e) => {
          e.preventDefault();
          if (dragNumber != null) e.dataTransfer.dropEffect = "move";
        }}
        onDrop={(e) => {
          e.preventDefault();
          const raw = e.dataTransfer.getData("text/number");
          const num = raw ? Number(raw) : dragNumber;
          if (num != null && !Number.isNaN(num)) placeNumber(slot.id, num);
          setDragNumber(null);
        }}
        className={`min-h-[3rem] rounded-xl border-2 border-dashed px-3 py-2 ${
          value != null
            ? "border-brand-purple/50 bg-lavender-50"
            : dragNumber != null
              ? "border-brand-purple bg-lavender-50/80"
              : "border-lavender-200 bg-white"
        }`}
      >
        <div className="text-xs font-medium text-gray-500">{slot.label}</div>
        {value != null ? (
          <div className="mt-1 flex items-center gap-2">
            <span className="text-lg font-bold text-brand-purple">{value}</span>
            <button
              type="button"
              onClick={() => clearSlot(slot.id)}
              className="text-xs text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        ) : (
          <p className="mt-1 text-xs text-gray-400">
            {slot.optional ? "Может отсутствовать в условии" : "Перетащи число сюда"}
          </p>
        )}
      </div>
    );
  };

  if (success) {
    return (
      <div className="space-y-3">
        <StepSuccess message="Модель готова — переходим к методу замены." />
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

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        {skipEntitySelection
          ? "Перетащи числа из условия в поля модели."
          : modelLevel <= 1
            ? "Выбери виды объектов и перетащи числа из условия в слоты модели."
            : "Заполни модель числами из условия."}
      </p>

      {!skipEntitySelection && modelLevel <= 2 ? (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">Виды объектов</p>
          <div className="flex flex-wrap gap-2">
            {entities.map((ent) => {
              const on = selectedTypes.includes(ent.id);
              return (
                <button
                  key={ent.id}
                  type="button"
                  onClick={() => toggleType(ent.id)}
                  className={`rounded-xl border-2 px-4 py-2 text-sm font-medium transition ${
                    on
                      ? "border-brand-purple bg-lavender-50 text-brand-purple"
                      : "border-transparent bg-white shadow-card hover:border-lavender-300"
                  }`}
                >
                  {ent.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {numbers.length > 0 ? (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">Числа из условия</p>
          <div className="flex flex-wrap gap-2">
            {numbers.map((n, i) => {
              const inPool = availableNumbers.includes(n);
              return (
                <span
                  key={`${n}-${i}`}
                  draggable={inPool}
                  onDragStart={(e) => {
                    setDragNumber(n);
                    e.dataTransfer.setData("text/number", String(n));
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragEnd={() => setDragNumber(null)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${
                    inPool
                      ? "cursor-grab border-lavender-200 bg-lavender-50 active:cursor-grabbing"
                      : "border-gray-100 bg-gray-50 text-gray-300"
                  }`}
                >
                  {n}
                </span>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">{slots.map(renderSlot)}</div>

      {!totalObjectsKnown || step.totals?.totalObjects === null ? (
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={missingData}
            onChange={(e) => {
              setMissingData(e.target.checked);
              if (e.target.checked) {
                setPlacement((prev) => ({ ...prev, totalObjects: null }));
              }
              setError(null);
            }}
          />
          В условии нет общего числа объектов — данных может не хватать
        </label>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="button"
        onClick={check}
        className="rounded-xl bg-brand-purple px-5 py-2 text-sm font-semibold text-white"
      >
        Проверить модель
      </button>
    </div>
  );
}
