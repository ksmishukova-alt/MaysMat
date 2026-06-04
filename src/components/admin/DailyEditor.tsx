"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { DailySubject } from "@/lib/daily";
import type {
  DailyExerciseType,
  DailyProgramWeekIndex,
  DailySubjectPack,
  DailyWeekdayIndex,
} from "@/data/daily-content";
import { PROGRAM_WEEK_LABELS, WEEKDAY_LABELS } from "@/data/daily-content";
import {
  DailyExerciseEditor,
  createDailyExercise,
} from "@/components/admin/DailyExerciseEditor";
import {
  hasDailyOverride,
  resetDailySubjectOverride,
  resolveDailySubjectPack,
  saveDailySubjectPack,
} from "@/lib/daily-store";
import { notifyDailyStoreUpdated } from "@/lib/use-daily-store";

interface DailyEditorProps {
  subject: DailySubject;
}

export function DailyEditor({ subject }: DailyEditorProps) {
  const [draft, setDraft] = useState<DailySubjectPack | null>(null);
  const [weekTab, setWeekTab] = useState<DailyProgramWeekIndex>(0);
  const [dayTab, setDayTab] = useState<DailyWeekdayIndex>(0);
  const [saved, setSaved] = useState(false);
  const [overridden, setOverridden] = useState(false);

  const load = useCallback(() => {
    const pack = resolveDailySubjectPack(subject);
    setDraft(structuredClone(pack));
    setOverridden(hasDailyOverride(subject));
  }, [subject]);

  useEffect(() => {
    load();
  }, [load]);

  if (!draft) return null;

  const exercises = draft.byWeek[weekTab][dayTab];

  const patchWeekDay = (
    updater: (list: import("@/data/daily-content").DailyExercise[]) => import("@/data/daily-content").DailyExercise[]
  ) => {
    const byWeek = draft.byWeek.map((week, wi) =>
      wi === weekTab
        ? (week.map((day, di) => (di === dayTab ? updater([...day]) : [...day])) as typeof week)
        : week.map((d) => [...d])
    ) as DailySubjectPack["byWeek"];
    setDraft({ ...draft, byWeek });
    setSaved(false);
  };

  const updateExercise = (index: number, ex: import("@/data/daily-content").DailyExercise) => {
    patchWeekDay((list) => list.map((item, i) => (i === index ? ex : item)));
  };

  const removeExercise = (index: number) => {
    patchWeekDay((list) => list.filter((_, i) => i !== index));
  };

  const addExercise = (type: DailyExerciseType) => {
    const ex = createDailyExercise(type, `${subject}-w${weekTab}-d${dayTab}`);
    patchWeekDay((list) => [...list, ex]);
  };

  const handleSave = () => {
    saveDailySubjectPack(draft);
    notifyDailyStoreUpdated();
    setSaved(true);
    load();
  };

  const handleReset = () => {
    if (!confirm("Сбросить все правки daily для этого предмета?")) return;
    resetDailySubjectOverride(subject);
    notifyDailyStoreUpdated();
    load();
    setSaved(false);
  };

  const handleCopyDay = (fromWeek: DailyProgramWeekIndex, fromDay: DailyWeekdayIndex) => {
    const copied = structuredClone(draft.byWeek[fromWeek][fromDay]).map((ex, j) => ({
      ...ex,
      id: `${ex.id}-copy-w${weekTab}d${dayTab}-${j}`,
    }));
    patchWeekDay(() => copied);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/daily" className="text-sm text-brand-purple hover:underline">
            ← Daily
          </Link>
          <h1 className="mt-2 text-2xl font-bold">
            {draft.emoji} {draft.title}
          </h1>
          <p className="text-sm text-gray-500">
            {draft.programTitle} · 6 недель × Пн–Пт
            {overridden ? " · есть правки" : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/tasks/daily/${subject}`}
            className="rounded-xl border border-lavender-200 px-4 py-2 text-sm hover:bg-lavender-50"
          >
            Предпросмотр
          </Link>
          {overridden ? (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-amber-200 px-4 py-2 text-sm text-amber-800"
            >
              Сбросить
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
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">Сохранено.</div>
      ) : null}

      <section className="rounded-card bg-white p-6 shadow-card">
        <h2 className="mb-4 font-semibold">Карточка предмета</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-xs text-gray-500">Название</span>
            <input
              value={draft.title}
              onChange={(e) => {
                setDraft({ ...draft, title: e.target.value });
                setSaved(false);
              }}
              className="w-full rounded-lg border border-lavender-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-gray-500">Emoji</span>
            <input
              value={draft.emoji}
              onChange={(e) => {
                setDraft({ ...draft, emoji: e.target.value });
                setSaved(false);
              }}
              className="w-full rounded-lg border border-lavender-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-gray-500">Подпись</span>
            <input
              value={draft.description}
              onChange={(e) => {
                setDraft({ ...draft, description: e.target.value });
                setSaved(false);
              }}
              className="w-full rounded-lg border border-lavender-200 px-3 py-2 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="rounded-card bg-white p-6 shadow-card">
        <div className="mb-3 flex flex-wrap gap-2">
          {PROGRAM_WEEK_LABELS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setWeekTab(i as DailyProgramWeekIndex)}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                weekTab === i
                  ? "bg-brand-purple text-white"
                  : "bg-lavender-50 text-gray-700 hover:bg-lavender-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {WEEKDAY_LABELS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setDayTab(i as DailyWeekdayIndex)}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                dayTab === i
                  ? "border-2 border-brand-purple bg-white text-brand-purple"
                  : "border border-lavender-200 text-gray-700 hover:bg-lavender-50"
              }`}
            >
              {label} ({draft.byWeek[weekTab][i].length})
            </button>
          ))}
        </div>

        <p className="mb-4 text-xs text-gray-500">
          Задание тетради № {weekTab * 5 + dayTab + 1} · скопировать с другого дня через редактор
          (вручную) или добавить упражнения ниже
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {(
            ["reading_passage", "single_choice", "number_input", "text_input"] as DailyExerciseType[]
          ).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => addExercise(type)}
              className="rounded-lg border border-lavender-200 px-2 py-1 text-xs hover:bg-lavender-50"
            >
              + {type}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {exercises.length === 0 ? (
            <p className="text-sm text-gray-500">Нет упражнений.</p>
          ) : (
            exercises.map((ex, index) => (
              <DailyExerciseEditor
                key={ex.id}
                exercise={ex}
                index={index}
                onChange={(next) => updateExercise(index, next)}
                onRemove={() => removeExercise(index)}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
