"use client";

import { useEffect, useRef, useState } from "react";
import type { DailySubjectTheme } from "@/components/daily/daily-theme";
import type { DailyExercise, DailyOption } from "@/data/daily-content";
import { STEP_SUCCESS_MS } from "@/components/task-steps/step-advance";
import { prepareDailyUploadFile } from "@/lib/daily-file-upload";

export interface DailyStepCompleteResult {
  userAnswer: string;
  correct: boolean;
  upload?: { fileName: string; mimeType: string; dataUrl: string };
}

interface DailyExerciseStepProps {
  theme: DailySubjectTheme;
  exercise: DailyExercise;
  index: number;
  total: number;
  onComplete: (result: DailyStepCompleteResult) => void;
}

export function DailyExerciseStep({
  theme,
  exercise,
  index,
  total,
  onComplete,
}: DailyExerciseStepProps) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [numberValue, setNumberValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadMeta, setUploadMeta] = useState<{
    fileName: string;
    mimeType: string;
    dataUrl: string;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingResult = useRef<DailyStepCompleteResult | null>(null);
  const completedRef = useRef(false);

  const needsFile = Boolean(exercise.requiresFileAnswer);

  useEffect(() => {
    setSuccess(false);
    setError("");
    setSelected(null);
    setNumberValue("");
    setTextValue("");
    setUploadPreview(null);
    setUploadMeta(null);
    pendingResult.current = null;
    completedRef.current = false;
  }, [exercise.id]);

  useEffect(() => {
    if (!success || !pendingResult.current || completedRef.current) return;
    completedRef.current = true;
    const result = pendingResult.current;
    const timer = window.setTimeout(() => onComplete(result), STEP_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [success, onComplete]);

  const finish = (result: DailyStepCompleteResult) => {
    pendingResult.current = result;
    setSuccess(true);
  };

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const prepared = await prepareDailyUploadFile(file);
      setUploadMeta(prepared);
      setUploadPreview(prepared.mimeType.startsWith("image/") ? prepared.dataUrl : null);
    } catch (e) {
      setUploadMeta(null);
      setUploadPreview(null);
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setUploading(false);
    }
  };

  const submitFileOnly = () => {
    if (!uploadMeta) {
      setError("Загрузи фото или файл с ответом");
      return;
    }
    finish({
      userAnswer: uploadMeta.fileName,
      correct: true,
      upload: uploadMeta,
    });
  };

  const checkSingleChoice = () => {
    const correct = exercise.options?.find((o) => o.correct)?.id;
    if (!selected) {
      setError("Выбери один вариант");
      return;
    }
    if (needsFile && !uploadMeta) {
      setError("Загрузи фото или файл с ответом");
      return;
    }
    if (selected === correct) {
      finish(buildResult(exercise, selected, numberValue, textValue, true, uploadMeta));
    } else {
      setError("Попробуй ещё раз — перечитай вопрос");
    }
  };

  const checkNumber = () => {
    const num = Number(numberValue.trim());
    if (Number.isNaN(num)) {
      setError("Введи число");
      return;
    }
    if (needsFile && !uploadMeta) {
      setError("Загрузи фото или файл с ответом");
      return;
    }
    if (num === exercise.answer) {
      finish(buildResult(exercise, selected, numberValue, textValue, true, uploadMeta));
    } else {
      setError(exercise.hint ?? "Ответ не совпал — проверь вычисления");
    }
  };

  const checkText = () => {
    const expected = (exercise.textAnswer ?? "").trim().toLowerCase();
    const got = textValue.trim().toLowerCase();
    if (!got) {
      setError("Введи букву или слово");
      return;
    }
    if (needsFile && !uploadMeta) {
      setError("Загрузи фото или файл с ответом");
      return;
    }
    if (got === expected) {
      finish(buildResult(exercise, selected, numberValue, textValue, true, uploadMeta));
    } else {
      setError(exercise.hint ?? "Проверь написание");
    }
  };

  const handleSubmit = () => {
    if (needsFile && exercise.type === "reading_passage" && !exercise.options?.length) {
      submitFileOnly();
      return;
    }
    if (needsFile && exercise.type === "reading_passage" && exercise.options?.length === 1) {
      if (!uploadMeta) {
        setError("Загрузи фото или файл с ответом");
        return;
      }
      finish(buildResult(exercise, exercise.options[0].id, numberValue, textValue, true, uploadMeta));
      return;
    }
    if (needsFile && !exercise.options && exercise.type !== "number_input" && exercise.type !== "text_input") {
      submitFileOnly();
      return;
    }
    if (exercise.type === "number_input") checkNumber();
    else if (exercise.type === "text_input") checkText();
    else checkSingleChoice();
  };

  if (success) {
    return (
      <div
        className={`flex flex-col items-center rounded-2xl border ${theme.border} ${theme.softBg} px-6 py-10 text-center`}
        role="status"
      >
        <span className="mb-3 text-5xl">🎉</span>
        <p className={`text-lg font-bold ${theme.accent}`}>
          {exercise.successMessage ??
            (needsFile ? "Ответ отправлен!" : "Верно!")}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {index + 1} из {total}
          {index + 1 < total ? " — следующее упражнение…" : " — почти финиш!"}
        </p>
      </div>
    );
  }

  const showOptions =
    (exercise.type === "reading_passage" || exercise.type === "single_choice") &&
    exercise.options &&
    !(needsFile && exercise.type === "reading_passage" && exercise.options.length === 1);

  return (
    <div>
      {exercise.title ? (
        <h3 className={`mb-4 text-lg font-bold ${theme.accent}`}>{exercise.title}</h3>
      ) : null}

      {exercise.type === "reading_passage" && exercise.passage ? (
        <div
          className={`mb-6 rounded-2xl border p-5 text-base leading-relaxed text-gray-800 shadow-sm ${theme.passage}`}
        >
          <p className={`mb-3 text-xs font-semibold uppercase tracking-wide ${theme.accentMuted}`}>
            📄 Текст для чтения
          </p>
          {exercise.passage}
        </div>
      ) : null}

      <p className="mb-5 text-base font-medium leading-snug text-gray-800">{exercise.question}</p>

      {needsFile ? (
        <div className={`mb-6 rounded-2xl border-2 border-dashed p-5 ${theme.fileZone}`}>
          <p className={`mb-3 text-sm font-semibold ${theme.accent}`}>📎 Ответ фото или файлом</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => void handleFileChange(e.target.files?.[0] ?? null)}
          />
          {uploadPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={uploadPreview}
              alt="Предпросмотр"
              className={`mb-4 max-h-52 w-full rounded-xl border object-contain ${theme.border}`}
            />
          ) : (
            <div
              className={`mb-4 flex flex-col items-center rounded-xl border border-dashed py-8 ${theme.border} bg-white/60`}
            >
              <span className="text-3xl opacity-60">📁</span>
              <p className="mt-2 text-xs text-gray-500">Фото, PDF или документ · до 8 МБ</p>
            </div>
          )}
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className={`rounded-xl border bg-white px-4 py-2 text-sm font-medium ${theme.border} ${theme.accent} hover:opacity-90 disabled:opacity-50`}
          >
            {uploading ? "Обработка…" : uploadMeta ? "Выбрать другой файл" : "Выбрать файл"}
          </button>
          {uploadMeta && !uploadPreview ? (
            <p className="mt-2 text-sm text-gray-600">{uploadMeta.fileName}</p>
          ) : null}
        </div>
      ) : null}

      {showOptions ? (
        <OptionList
          options={exercise.options!}
          selected={selected}
          onSelect={(id) => {
            setSelected(id);
            setError("");
          }}
          theme={theme}
        />
      ) : null}

      {exercise.type === "number_input" ? (
        <input
          type="number"
          value={numberValue}
          onChange={(e) => {
            setNumberValue(e.target.value);
            setError("");
          }}
          className={`w-full max-w-xs rounded-xl border px-4 py-3.5 text-xl font-medium focus:outline-none focus:ring-2 ${theme.border} ${theme.ring}`}
          placeholder="Твой ответ"
        />
      ) : null}

      {exercise.type === "text_input" ? (
        <input
          type="text"
          value={textValue}
          onChange={(e) => {
            setTextValue(e.target.value);
            setError("");
          }}
          className={`w-full max-w-xs rounded-xl border px-4 py-3.5 text-xl font-medium focus:outline-none focus:ring-2 ${theme.border} ${theme.ring}`}
          placeholder="Твой ответ"
        />
      ) : null}

      {error ? (
        <p className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <span>💡</span> {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={uploading}
        className={`mt-6 w-full rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-md transition disabled:opacity-50 sm:w-auto ${theme.button} ${theme.buttonHover}`}
      >
        {needsFile ? "Готово →" : "Проверить →"}
      </button>
    </div>
  );
}

function buildResult(
  exercise: DailyExercise,
  selected: string | null,
  numberValue: string,
  textValue: string,
  correct: boolean,
  upload: { fileName: string; mimeType: string; dataUrl: string } | null
): DailyStepCompleteResult {
  let userAnswer = "";
  if (exercise.type === "number_input") userAnswer = numberValue.trim();
  else if (exercise.type === "text_input") userAnswer = textValue.trim();
  else if (upload && exercise.type === "reading_passage") userAnswer = upload.fileName;
  else {
    const opt = exercise.options?.find((o) => o.id === selected);
    userAnswer = upload ? `${opt?.text ?? selected ?? ""} · ${upload.fileName}` : opt?.text ?? selected ?? "";
  }
  return {
    userAnswer,
    correct,
    upload: upload ?? undefined,
  };
}

function OptionList({
  options,
  selected,
  onSelect,
  theme,
}: {
  options: DailyOption[];
  selected: string | null;
  onSelect: (id: string) => void;
  theme: DailySubjectTheme;
}) {
  return (
    <div className="space-y-2.5">
      {options.map((opt, i) => {
        const active = selected === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition ${
              active ? theme.optionActive : theme.optionIdle
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                active ? `${theme.button} text-white` : "bg-lavender-100 text-gray-500"
              }`}
            >
              {String.fromCharCode(65 + i)}
            </span>
            <span className="text-gray-800">{opt.text}</span>
          </button>
        );
      })}
    </div>
  );
}
