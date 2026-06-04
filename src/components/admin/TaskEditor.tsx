"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Task, TaskStep } from "@/data/tasks";
import { GivenStepEditor, StepEditor, createEmptyStep } from "@/components/admin/StepEditor";
import {
  copyTask,
  deleteCustomTask,
  getTaskEditSource,
  isBuiltInTaskId,
  resetTaskOverride,
  saveResolvedTask,
  type StoredCustomTask,
} from "@/lib/task-store";
import { migrateLegacyModeratorStore } from "@/lib/task-moderator";
import { notifyTaskStoreUpdated } from "@/lib/use-task-store";
import { buildPlayerSteps } from "@/lib/task-player-steps";

interface TaskEditorProps {
  taskId: string;
}

export function TaskEditor({ taskId }: TaskEditorProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<Task | null>(null);
  const [mode, setMode] = useState<"builtin" | "custom">("builtin");
  const [hasOverride, setHasOverride] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    migrateLegacyModeratorStore();
    const source = getTaskEditSource(taskId);
    if (!source) {
      setDraft(null);
      return;
    }
    setDraft(structuredClone(source.task));
    setMode(source.mode === "custom" ? "custom" : "builtin");
    setHasOverride(source.hasOverride);
  }, [taskId]);

  useEffect(() => {
    load();
  }, [load]);

  const update = (patch: Partial<Task>) => {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
    setSaved(false);
  };

  const updateStep = (index: number, step: TaskStep) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const steps = [...prev.steps];
      steps[index] = step;
      return { ...prev, steps };
    });
    setSaved(false);
  };

  const removeStep = (index: number) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return { ...prev, steps: prev.steps.filter((_, i) => i !== index) };
    });
    setSaved(false);
  };

  const addStep = (type: TaskStep["type"]) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const step = createEmptyStep(type, prev.id, prev.steps.length + 1);
      return { ...prev, steps: [...prev.steps, step] };
    });
    setSaved(false);
  };

  const handleSave = () => {
    if (!draft) return;
    setError(null);
    try {
      saveResolvedTask(draft);
      notifyTaskStoreUpdated();
      setSaved(true);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка сохранения");
    }
  };

  const handleReset = () => {
    if (!confirm("Сбросить все правки и вернуть версию из кода?")) return;
    resetTaskOverride(taskId);
    notifyTaskStoreUpdated();
    load();
    setSaved(false);
  };

  const handleDeleteCopy = () => {
    if (!confirm("Удалить копию задачи? Это действие нельзя отменить.")) return;
    deleteCustomTask(taskId);
    notifyTaskStoreUpdated();
    router.push("/admin/tasks");
  };

  const handleCopy = () => {
    const copy = copyTask(taskId);
    if (!copy) return;
    notifyTaskStoreUpdated();
    router.push(`/admin/tasks/${copy.id}`);
  };

  if (!draft) {
    return (
      <div className="rounded-card bg-white p-8 text-center shadow-card">
        <p className="text-gray-600">Задача не найдена.</p>
        <Link href="/admin/tasks" className="mt-4 inline-block text-brand-purple hover:underline">
          ← К списку
        </Link>
      </div>
    );
  }

  const stepCount = buildPlayerSteps(draft, {
    enableGivenStep: draft.enableGivenStep ?? false,
    givenStep: draft.givenStep,
  }).length;

  const isCopy = (draft as StoredCustomTask).isCopy || draft.id.includes("-copy-");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/tasks" className="text-sm text-brand-purple hover:underline">
            ← Модерация задач
          </Link>
          <h1 className="mt-2 text-2xl font-bold">Редактор задачи</h1>
          <p className="mt-1 text-sm text-gray-500">
            ID: <code className="rounded bg-gray-100 px-1">{draft.id}</code>
            {isCopy ? " · копия" : mode === "builtin" && hasOverride ? " · есть правки" : ""}
            {" · "}
            {stepCount} шагов в плеере (с «Прочитай» и «Дано»)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/tasks/${draft.id}`}
            className="rounded-xl border border-lavender-200 px-4 py-2 text-sm hover:bg-lavender-50"
          >
            Предпросмотр
          </Link>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-xl border border-lavender-200 px-4 py-2 text-sm hover:bg-lavender-50"
          >
            📋 Копировать
          </button>
          {mode === "builtin" && hasOverride ? (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-amber-200 px-4 py-2 text-sm text-amber-800 hover:bg-amber-50"
            >
              Сбросить правки
            </button>
          ) : null}
          {mode === "custom" || isCopy ? (
            <button
              type="button"
              onClick={handleDeleteCopy}
              className="rounded-xl border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Удалить копию
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-brand-purple px-4 py-2 text-sm font-medium text-white"
          >
            Сохранить
          </button>
        </div>
      </div>

      {saved ? (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
          Сохранено в localStorage этого браузера.
        </div>
      ) : null}
      {error ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      ) : null}

      <section className="rounded-card bg-white p-6 shadow-card">
        <h2 className="mb-4 text-lg font-semibold">Карточка задачи</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-medium text-gray-500">Название</span>
            <input
              value={draft.title}
              onChange={(e) => update({ title: e.target.value })}
              className="w-full rounded-lg border border-lavender-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-medium text-gray-500">Условие</span>
            <textarea
              value={draft.condition}
              onChange={(e) => update({ condition: e.target.value })}
              rows={5}
              className="w-full rounded-lg border border-lavender-200 px-3 py-2 text-sm leading-relaxed"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-500">Номер в ветке</span>
            <input
              type="number"
              value={draft.number}
              onChange={(e) => update({ number: Number(e.target.value) })}
              className="w-full rounded-lg border border-lavender-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-500">Этап</span>
            <input
              type="number"
              value={draft.stage}
              onChange={(e) => update({ stage: Number(e.target.value) })}
              className="w-full rounded-lg border border-lavender-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-500">Макс. звёзд</span>
            <input
              type="number"
              value={draft.maxStars}
              onChange={(e) => update({ maxStars: Number(e.target.value) })}
              className="w-full rounded-lg border border-lavender-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex items-center gap-2 self-end pb-2">
            <input
              type="checkbox"
              checked={draft.enableGivenStep ?? false}
              onChange={(e) => update({ enableGivenStep: e.target.checked })}
              disabled={!draft.givenStep}
            />
            <span className="text-sm">Шаг «Дано / Найти» после чтения</span>
          </label>
        </div>
      </section>

      {draft.givenStep ? (
        <section className="rounded-card bg-white p-6 shadow-card">
          <h2 className="mb-4 text-lg font-semibold">Шаг «Дано / Найти»</h2>
          <GivenStepEditor
            data={draft.givenStep}
            onChange={(givenStep) => update({ givenStep })}
          />
        </section>
      ) : (
        <section className="rounded-card border border-dashed border-gray-200 p-6 text-sm text-gray-500">
          У этой задачи нет данных для шага «Дано». Можно добавить в коде или скопировать задачу с
          другой, где блок уже настроен.
        </section>
      )}

      <section className="rounded-card bg-white p-6 shadow-card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Шаги решения ({draft.steps.length})</h2>
          <div className="flex flex-wrap gap-2">
            {(
              [
                "drag_select",
                "single_select",
                "order_questions",
                "number_input",
                "table_input",
                "worksheet_table",
                "auto_explanation",
              ] as const
            ).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => addStep(type)}
                className="rounded-lg border border-lavender-200 px-2 py-1 text-xs hover:bg-lavender-50"
              >
                + {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {draft.steps.map((step, index) => (
            <StepEditor
              key={step.id}
              step={step}
              index={index}
              onChange={(next) => updateStep(index, next)}
              onRemove={() => removeStep(index)}
            />
          ))}
        </div>
      </section>

      {mode === "builtin" && isBuiltInTaskId(draft.id) ? (
        <p className="text-xs text-gray-400">
          Правки встроенной задачи хранятся как override и не меняют исходный файл tasks.ts. Копия
          создаёт отдельную задачу со своим ID.
        </p>
      ) : null}
    </div>
  );
}
