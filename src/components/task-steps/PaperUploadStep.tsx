"use client";

import { useRef, useState } from "react";
import { prepareDailyUploadFile } from "@/lib/daily-file-upload";

interface PaperUploadStepProps {
  stepId: string;
  prompt?: string;
  onComplete: (payload: { fileName: string; mimeType: string; dataUrl: string }) => void;
}

export function PaperUploadStep({ stepId, prompt, onComplete }: PaperUploadStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ fileName: string; mimeType: string; dataUrl: string } | null>(
    null,
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const prepared = await prepareDailyUploadFile(file);
      setMeta(prepared);
      setPreview(prepared.mimeType.startsWith("image/") ? prepared.dataUrl : null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось загрузить файл");
      setMeta(null);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        {prompt ??
          "Сфотографируй или отсканируй решение на листочке — так родитель и тренер увидят твою работу."}
      </p>

      <input
        ref={inputRef}
        id={`paper-upload-${stepId}`}
        type="file"
        accept="image/*,.pdf"
        className="sr-only"
        onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
      />

      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Превью решения" className="max-h-48 rounded-xl border object-contain" />
      ) : null}

      {meta && !preview ? (
        <p className="rounded-lg bg-lavender-50 px-3 py-2 text-sm text-gray-700">{meta.fileName}</p>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="rounded-xl border border-lavender-200 bg-white px-4 py-2 text-sm font-medium hover:bg-lavender-50"
        >
          {uploading ? "Обработка…" : meta ? "Выбрать другой файл" : "📷 Загрузить фото"}
        </button>
        {meta ? (
          <button
            type="button"
            onClick={() => onComplete(meta)}
            className="rounded-xl bg-brand-purple px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Отправить решение →
          </button>
        ) : null}
      </div>
    </div>
  );
}
