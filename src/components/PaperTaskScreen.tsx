"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Task } from "@/data/tasks";
import { PaperUploadStep } from "@/components/task-steps/PaperUploadStep";
import {
  getPaperReviewStatus,
  PAPER_STATUS_LABEL,
} from "@/lib/paper-task-review";
import { clearPaperSubmission } from "@/lib/paper-task-review";
import { submitPaperWithTelegram } from "@/lib/paper-task-telegram";

const DEFAULT_INSTRUCTION = `Реши задачу **письменно** на листочке или в тетради.
Запиши **развёрнутое решение**: ход рассуждения, вычисления и ответ полными предложениями.
Числовой ответ без объяснения не засчитывается.`;

type Phase = "work" | "upload_after_done" | "submitted";

interface PaperTaskScreenProps {
  task: Task;
}

export function PaperTaskScreen({ task }: PaperTaskScreenProps) {
  const status = getPaperReviewStatus(task.id);
  const [phase, setPhase] = useState<Phase>(() =>
    status === "pending" ? "submitted" : "work",
  );
  const pendingUpload = useRef<{ fileName: string; mimeType: string; dataUrl: string } | null>(
    null,
  );

  const [telegramNote, setTelegramNote] = useState<string | null>(null);

  const instruction = task.paperPrompt
    ? `${DEFAULT_INSTRUCTION}\n\n${task.paperPrompt}`
    : DEFAULT_INSTRUCTION;

  const finalizeSubmit = async () => {
    const upload = pendingUpload.current
      ? {
          fileName: pendingUpload.current.fileName,
          mimeType: pendingUpload.current.mimeType,
          dataUrl: pendingUpload.current.dataUrl,
        }
      : undefined;
    const result = await submitPaperWithTelegram(task.id, upload);
    if (result.telegramError) {
      setTelegramNote(`Решение сохранено. Telegram: ${result.telegramError}`);
    }
    setPhase("submitted");
  };

  const handleDone = () => {
    if (pendingUpload.current) {
      void finalizeSubmit();
    } else {
      setPhase("upload_after_done");
    }
  };

  const handleSkipUpload = () => {
    void finalizeSubmit();
  };

  const handleUploadComplete = (payload: {
    fileName: string;
    mimeType: string;
    dataUrl: string;
  }) => {
    pendingUpload.current = payload;
    if (phase === "upload_after_done") {
      void finalizeSubmit();
    }
  };

  const handleRetry = () => {
    clearPaperSubmission(task.id);
    pendingUpload.current = null;
    setPhase("work");
  };

  if (status === "approved") {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-card bg-white p-6 shadow-card">
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
            ✓ {PAPER_STATUS_LABEL.approved}
          </span>
          <h2 className="mt-3 text-xl font-bold">{task.title}</h2>
          <p className="mt-4 whitespace-pre-line text-gray-700">{task.condition}</p>
        </div>
        <Link
          href={`/branch/heads-legs`}
          className="inline-block rounded-xl bg-brand-purple px-5 py-2 text-sm font-semibold text-white"
        >
          ← К списку задач
        </Link>
      </div>
    );
  }

  if (status === "redo" || phase === "work") {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        {status === "redo" ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {PAPER_STATUS_LABEL.redo}: перепиши решение на бумаге и отправь снова.
          </div>
        ) : null}

        <div className="rounded-card bg-white p-6 shadow-card">
          <div className="mb-2 flex flex-wrap gap-2 text-xs font-medium">
            <span className="text-brand-purple">
              Задача {task.number} · Этап {task.stage}
            </span>
            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-violet-800">📝 письменно</span>
          </div>
          <h2 className="text-xl font-bold">{task.title}</h2>
          <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-gray-700">
            {task.condition}
          </p>
        </div>

        <div className="rounded-card border border-lavender-200 bg-lavender-50/50 p-6 shadow-card">
          <h3 className="mb-3 font-semibold text-brand-purple">Как выполнять</h3>
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">{instruction}</p>
        </div>

        <div className="rounded-card bg-white p-6 shadow-card">
          <h3 className="mb-3 text-sm font-semibold text-gray-800">Фото решения (необязательно)</h3>
          <PaperUploadStep
            stepId={`${task.id}-paper-inline`}
            prompt="Можно загрузить фото сейчас или после нажатия «Готово»."
            onComplete={handleUploadComplete}
          />
          {pendingUpload.current ? (
            <p className="mt-2 text-xs text-emerald-700">Фото выбрано: {pendingUpload.current.fileName}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleDone}
          className="w-full rounded-xl bg-brand-purple py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Готово, решил на бумаге →
        </button>
      </div>
    );
  }

  if (phase === "upload_after_done") {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-card bg-white p-6 shadow-card">
          <h2 className="text-lg font-bold">{task.title}</h2>
          <p className="mt-2 text-sm text-gray-600">Хочешь приложить фото решения?</p>
        </div>
        <div className="rounded-card bg-white p-6 shadow-card">
          <PaperUploadStep
            stepId={`${task.id}-paper-after`}
            onComplete={handleUploadComplete}
          />
        </div>
        <button
          type="button"
          onClick={handleSkipUpload}
          className="w-full rounded-xl border border-lavender-200 py-3 text-sm font-medium text-gray-700 hover:bg-lavender-50"
        >
          Пропустить и отправить на проверку
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm text-sky-900">
        <p className="font-semibold">{PAPER_STATUS_LABEL.pending}</p>
        <p className="mt-1">
          Решение отправлено. Статус «Выполнено» появится после проверки методистом или родителем
          {telegramNote ? "" : " (в Telegram или админке)"}.
        </p>
        {telegramNote ? <p className="mt-2 text-xs text-amber-800">{telegramNote}</p> : null}
      </div>
      <Link
        href="/branch/heads-legs"
        className="inline-block rounded-xl bg-brand-purple px-5 py-2 text-sm font-semibold text-white"
      >
        ← К списку задач
      </Link>
      <button
        type="button"
        onClick={handleRetry}
        className="ml-3 text-sm text-brand-purple hover:underline"
      >
        Отменить отправку
      </button>
    </div>
  );
}
