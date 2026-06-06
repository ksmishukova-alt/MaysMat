"use client";

import { useEffect, useRef, useState } from "react";
import type { RemaindersModel } from "@/data/dirichlet/remainders/types";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { StepSuccess } from "@/components/task-steps/StepSuccess";

interface RemainderDivisibilityExplainStepProps {
  stepId?: string;
  model: RemaindersModel;
  onComplete: () => void;
}

const CARD_IDS = ["collision", "same-remainder", "divides"] as const;
type CardId = (typeof CARD_IDS)[number];

function shuffleIds(ids: CardId[]): CardId[] {
  const result = [...ids];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  if (result.length > 1 && result.every((id, index) => id === ids[index])) {
    [result[0], result[1]] = [result[1], result[0]];
  }
  return result;
}

function reorderList(list: CardId[], from: number, to: number): CardId[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) {
    return list;
  }
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function RemainderDivisibilityExplainStep({
  stepId,
  model,
  onComplete,
}: RemainderDivisibilityExplainStepProps) {
  const m = model.modulus;
  const labels: Record<CardId, string> = {
    collision: "Два числа попали в один домик.",
    "same-remainder": "Значит, у них одинаковый остаток.",
    divides: `Значит, их разность делится на ${m}.`,
  };

  const [order, setOrder] = useState<CardId[]>([...CARD_IDS]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const dragIndexRef = useRef<number | null>(null);

  useEffect(() => {
    setOrder(shuffleIds([...CARD_IDS]));
    setSuccess(false);
    setError("");
    setDragIndex(null);
    setOverIndex(null);
  }, [stepId]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(onComplete, STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [success, onComplete]);

  const applyReorder = (from: number, to: number) => {
    setError("");
    setOrder((prev) => reorderList(prev, from, to));
  };

  const indexFromPointer = (clientY: number): number | null => {
    const list = listRef.current;
    if (!list) return null;
    const rows = Array.from(list.querySelectorAll<HTMLElement>("[data-order-row]"));
    for (let i = 0; i < rows.length; i++) {
      const rect = rows[i].getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      if (clientY < mid) return i;
    }
    return rows.length - 1;
  };

  const startPointerDrag = (index: number, event: React.PointerEvent<HTMLButtonElement>) => {
    if (success) return;
    dragIndexRef.current = index;
    setDragIndex(index);
    setOverIndex(index);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const movePointerDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const from = dragIndexRef.current;
    if (from === null) return;
    const to = indexFromPointer(event.clientY);
    if (to === null || to === from) {
      setOverIndex(to);
      return;
    }
    applyReorder(from, to);
    dragIndexRef.current = to;
    setDragIndex(to);
    setOverIndex(to);
  };

  const endPointerDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (dragIndexRef.current === null) return;
    dragIndexRef.current = null;
    setDragIndex(null);
    setOverIndex(null);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const moveUp = (index: number) => {
    if (index <= 0 || success) return;
    applyReorder(index, index - 1);
  };

  const moveDown = (index: number) => {
    if (index >= order.length - 1 || success) return;
    applyReorder(index, index + 1);
  };

  if (success) {
    return (
      <StepSuccess message="Отлично! Ты выстроил рассуждение: домик → остаток → делимость разности." />
    );
  }

  return (
    <div>
      <p className="mb-2 text-sm text-gray-600">
        Расставь части рассуждения по порядку: от столкновения в домике до вывода о разности.
      </p>
      <p className="mb-4 text-xs text-gray-400">Используй кнопки ↑ ↓ или перетащи за ручку ≡.</p>

      <ul ref={listRef} className="mb-6 space-y-2">
        {order.map((id, index) => {
          const isDragging = dragIndex === index;
          const isOver = overIndex === index && dragIndex !== null;

          return (
            <li
              key={id}
              data-order-row
              className={`flex items-center gap-2 rounded-xl border px-3 py-3 transition ${
                isDragging
                  ? "scale-[1.02] border-brand-purple bg-lavender-50 shadow-md"
                  : isOver
                    ? "border-brand-purple/60 bg-lavender-50/80"
                    : "border-gray-200 bg-white"
              }`}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-purple text-sm font-bold text-white"
                aria-label={`Место ${index + 1}`}
              >
                {index + 1}
              </div>

              <span className="min-w-0 flex-1 text-sm leading-snug">{labels[id]}</span>

              <div className="flex shrink-0 flex-col gap-0.5">
                <button
                  type="button"
                  aria-label="Поднять выше"
                  disabled={index === 0}
                  onClick={() => moveUp(index)}
                  className="rounded border border-lavender-200 bg-white px-2 py-0.5 text-xs disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label="Опустить ниже"
                  disabled={index === order.length - 1}
                  onClick={() => moveDown(index)}
                  className="rounded border border-lavender-200 bg-white px-2 py-0.5 text-xs disabled:opacity-30"
                >
                  ↓
                </button>
              </div>

              <button
                type="button"
                aria-label={`Перетащить: ${labels[id]}`}
                className="shrink-0 cursor-grab touch-none rounded-lg border border-lavender-200 bg-white px-2 py-3 text-gray-400 active:cursor-grabbing"
                onPointerDown={(event) => startPointerDrag(index, event)}
                onPointerMove={movePointerDrag}
                onPointerUp={endPointerDrag}
                onPointerCancel={endPointerDrag}
              >
                <span className="block text-base leading-none">≡</span>
              </button>
            </li>
          );
        })}
      </ul>

      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      <button
        type="button"
        onClick={() => {
          const ok = order.every((id, index) => id === CARD_IDS[index]);
          if (ok) {
            setSuccess(true);
          } else {
            setError("Подумай: сначала столкновение в домике, потом одинаковый остаток, потом делимость разности.");
          }
        }}
        className="rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-medium text-white"
      >
        Проверить порядок
      </button>
    </div>
  );
}
