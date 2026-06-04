"use client";

import { useEffect, useRef, useState } from "react";
import type { OrderQuestionItem } from "@/data/tasks";
import { STEP_SUCCESS_MS } from "./step-advance";
import { StepSuccess } from "./StepSuccess";

interface OrderQuestionsStepProps {
  stepId?: string;
  items: OrderQuestionItem[];
  onComplete: () => void;
}

function shuffleIds(ids: string[]): string[] {
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

function reorderList(list: string[], from: number, to: number): string[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) {
    return list;
  }
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function OrderQuestionsStep({ stepId, items, onComplete }: OrderQuestionsStepProps) {
  const correctOrder = items.map((item) => item.id);
  const [order, setOrder] = useState<string[]>(correctOrder);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const dragIndexRef = useRef<number | null>(null);

  useEffect(() => {
    setOrder(shuffleIds(items.map((item) => item.id)));
    setSuccess(false);
    setError("");
    setDragIndex(null);
    setOverIndex(null);
  }, [stepId, items]);

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

  const onDragStart = (index: number, event: React.DragEvent<HTMLLIElement>) => {
    if (success) return;
    setDragIndex(index);
    setOverIndex(index);
    dragIndexRef.current = index;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
  };

  const onDragOver = (index: number, event: React.DragEvent<HTMLLIElement>) => {
    event.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === index) {
      setOverIndex(index);
      return;
    }
    applyReorder(from, index);
    dragIndexRef.current = index;
    setDragIndex(index);
    setOverIndex(index);
  };

  const onDragEnd = () => {
    dragIndexRef.current = null;
    setDragIndex(null);
    setOverIndex(null);
  };

  const check = () => {
    const ok = order.every((id, index) => id === correctOrder[index]);
    if (ok) {
      setSuccess(true);
    } else {
      setError("Подумай: с чего начинают задачу «головы и ноги»? Сначала участники, потом таблица…");
    }
  };

  if (success) {
    return <StepSuccess message="✅ Верно! Теперь ответим на каждый вопрос по порядку." />;
  }

  return (
    <div>
      <p className="mb-2 text-sm text-gray-500">
        Вопросы перемешаны. Перетащи карточки так, чтобы под номерами 1, 2, 3… шли шаги
        решения по порядку.
      </p>
      <p className="mb-4 text-xs text-gray-400">
        Схватись за ручку ≡ слева или перетащи всю строку мышью.
      </p>

      <ul ref={listRef} className="mb-6 space-y-2">
        {order.map((id, index) => {
          const item = items.find((entry) => entry.id === id)!;
          const isDragging = dragIndex === index;
          const isOver = overIndex === index && dragIndex !== null;

          return (
            <li
              key={id}
              data-order-row
              draggable
              onDragStart={(event) => onDragStart(index, event)}
              onDragOver={(event) => onDragOver(index, event)}
              onDragEnd={onDragEnd}
              className={`flex items-center gap-3 rounded-xl border px-3 py-3 transition ${
                isDragging
                  ? "scale-[1.02] border-brand-purple bg-lavender-50 shadow-md"
                  : isOver
                    ? "border-brand-purple/60 bg-lavender-50/80"
                    : "border-lavender-100 bg-lavender-50/50"
              }`}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-purple text-sm font-bold text-white"
                aria-label={`Место ${index + 1}`}
              >
                {index + 1}
              </div>

              <span className="min-w-0 flex-1 text-sm leading-snug">{item.text}</span>

              <button
                type="button"
                aria-label={`Перетащить: ${item.text}`}
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

      {error ? <p className="mb-3 text-sm text-red-500">{error}</p> : null}
      <button
        type="button"
        onClick={check}
        className="rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-medium text-white"
      >
        Проверить порядок
      </button>
    </div>
  );
}
