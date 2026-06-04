"use client";

import type { DailyExercise, DailyExerciseType, DailyOption } from "@/data/daily-content";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-500">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-lavender-200 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none";

const TYPE_LABELS: Record<DailyExerciseType, string> = {
  reading_passage: "Чтение + вопрос",
  single_choice: "Один вариант",
  number_input: "Числовой ответ",
  text_input: "Ввод буквы/слова",
};

function OptionsEditor({
  options,
  onChange,
}: {
  options: DailyOption[];
  onChange: (options: DailyOption[]) => void;
}) {
  const update = (index: number, patch: Partial<DailyOption>) => {
    const next = [...options];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {options.map((opt, index) => (
        <div key={opt.id} className="flex flex-wrap items-center gap-2">
          <input
            value={opt.text}
            onChange={(e) => update(index, { text: e.target.value })}
            className={`${inputClass} flex-1`}
            placeholder="Текст варианта"
          />
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name={`correct-${opt.id}`}
              checked={opt.correct}
              onChange={() =>
                onChange(options.map((o, i) => ({ ...o, correct: i === index })))
              }
            />
            Верный
          </label>
          <button
            type="button"
            onClick={() => onChange(options.filter((_, i) => i !== index))}
            className="text-xs text-red-500"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([
            ...options,
            { id: `opt-${Date.now().toString(36)}`, text: "Новый вариант", correct: false },
          ])
        }
        className="text-xs text-brand-purple hover:underline"
      >
        + Вариант
      </button>
    </div>
  );
}

export function DailyExerciseEditor({
  exercise,
  index,
  onChange,
  onRemove,
}: {
  exercise: DailyExercise;
  index: number;
  onChange: (ex: DailyExercise) => void;
  onRemove: () => void;
}) {
  const patch = (p: Partial<DailyExercise>) => onChange({ ...exercise, ...p });

  return (
    <details className="rounded-xl border border-lavender-200 bg-white" open={index < 2}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3">
        <div>
          <span className="text-xs text-gray-400">#{index + 1}</span>
          <div className="font-medium">
            {TYPE_LABELS[exercise.type]}
            {exercise.requiresFileAnswer ? (
              <span className="ml-2 rounded bg-sky-100 px-1.5 py-0.5 text-xs font-normal text-sky-800">
                📎 файл
              </span>
            ) : null}
            <span className="ml-2 text-xs font-normal text-gray-500 truncate">
              {exercise.question.slice(0, 48)}
              {exercise.question.length > 48 ? "…" : ""}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
          className="text-xs text-red-500"
        >
          Удалить
        </button>
      </summary>

      <div className="space-y-3 border-t border-lavender-100 px-4 py-4">
        <Field label="Тип">
          <select
            value={exercise.type}
            onChange={(e) => patch({ type: e.target.value as DailyExerciseType })}
            className={inputClass}
          >
            {(Object.keys(TYPE_LABELS) as DailyExerciseType[]).map((t) => (
              <option key={t} value={t}>
                {TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </Field>

        {exercise.type === "reading_passage" ? (
          <Field label="Текст для чтения">
            <textarea
              value={exercise.passage ?? ""}
              onChange={(e) => patch({ passage: e.target.value })}
              rows={4}
              className={inputClass}
            />
          </Field>
        ) : null}

        <Field label="Вопрос">
          <textarea
            value={exercise.question}
            onChange={(e) => patch({ question: e.target.value })}
            rows={2}
            className={inputClass}
          />
        </Field>

        {(exercise.type === "reading_passage" || exercise.type === "single_choice") && (
          <Field label="Варианты ответа">
            <OptionsEditor
              options={exercise.options ?? []}
              onChange={(options) => patch({ options })}
            />
          </Field>
        )}

        {exercise.type === "number_input" ? (
          <Field label="Правильный ответ (число)">
            <input
              type="number"
              value={exercise.answer ?? ""}
              onChange={(e) =>
                patch({ answer: e.target.value === "" ? undefined : Number(e.target.value) })
              }
              className={inputClass}
            />
          </Field>
        ) : null}

        {exercise.type === "text_input" ? (
          <Field label="Правильный ответ (текст)">
            <input
              value={exercise.textAnswer ?? ""}
              onChange={(e) => patch({ textAnswer: e.target.value })}
              className={inputClass}
            />
          </Field>
        ) : null}

        <Field label="Подсказка при ошибке">
          <input
            value={exercise.hint ?? ""}
            onChange={(e) => patch({ hint: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Сообщение при успехе">
          <input
            value={exercise.successMessage ?? ""}
            onChange={(e) => patch({ successMessage: e.target.value })}
            className={inputClass}
          />
        </Field>

        <label className="flex items-start gap-2 rounded-lg border border-sky-100 bg-sky-50/50 px-3 py-3">
          <input
            type="checkbox"
            checked={Boolean(exercise.requiresFileAnswer)}
            onChange={(e) => patch({ requiresFileAnswer: e.target.checked })}
            className="mt-0.5"
          />
          <span className="text-sm text-gray-700">
            <span className="font-medium">Ответ фото/файлом</span>
            <span className="mt-0.5 block text-xs text-gray-500">
              Ребёнок загружает фото или документ; файл придёт в Telegram вместе с отчётом за день.
            </span>
          </span>
        </label>
      </div>
    </details>
  );
}

export function createDailyExercise(type: DailyExerciseType, suffix: string): DailyExercise {
  const id = `daily-ex-${suffix}-${Date.now().toString(36)}`;
  switch (type) {
    case "reading_passage":
      return {
        id,
        type,
        passage: "Вставьте текст для чтения.",
        question: "Вопрос по тексту?",
        options: [
          { id: "a", text: "Вариант A", correct: true },
          { id: "b", text: "Вариант B", correct: false },
        ],
      };
    case "single_choice":
      return {
        id,
        type,
        question: "Новый вопрос?",
        options: [
          { id: "a", text: "Вариант A", correct: true },
          { id: "b", text: "Вариант B", correct: false },
        ],
      };
    case "number_input":
      return { id, type, question: "2 + 2 = ?", answer: 4 };
    case "text_input":
      return { id, type, question: "Вставь букву: к…т", textAnswer: "о" };
  }
}

export { WEEKDAY_LABELS, PROGRAM_WEEK_LABELS } from "@/data/daily-content";
