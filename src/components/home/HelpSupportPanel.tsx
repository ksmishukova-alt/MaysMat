"use client";

import { useState } from "react";
import { useProgress } from "@/lib/use-progress";

export function HelpSupportPanel() {
  const progress = useProgress();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorText, setErrorText] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim().length < 3) return;

    setStatus("sending");
    setErrorText("");

    try {
      const res = await fetch("/api/telegram/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childName: progress.name, message: message.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorText(data.error ?? "Не удалось отправить");
        return;
      }
      setStatus("ok");
      setMessage("");
      setTimeout(() => {
        setOpen(false);
        setStatus("idle");
      }, 2000);
    } catch {
      setStatus("error");
      setErrorText("Проверь интернет и попробуй ещё раз");
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group mt-4 flex w-full items-center gap-2.5 rounded-full border border-violet-200/80 bg-gradient-to-r from-violet-50 via-white to-fuchsia-50 px-4 py-2.5 text-left shadow-[0_2px_12px_rgba(124,58,237,0.12)] transition hover:border-brand-purple/40 hover:from-violet-100 hover:to-fuchsia-100 hover:shadow-[0_4px_16px_rgba(124,58,237,0.18)]"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-violet-500 text-base shadow-sm shadow-brand-purple/30 transition group-hover:scale-105">
          💬
        </span>
        <span className="text-sm font-semibold text-violet-900/90">Помощь и поддержка</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 overflow-hidden rounded-2xl border border-violet-200/80 bg-gradient-to-b from-violet-50/90 to-white p-3 shadow-[0_4px_20px_rgba(124,58,237,0.12)]"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-purple text-sm text-white">
          💬
        </span>
        <p className="text-sm font-semibold text-violet-900">Напиши, что непонятно</p>
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        maxLength={2000}
        placeholder="Мышь, помоги с задачей…"
        className="w-full resize-none rounded-xl border border-violet-100 bg-white px-3 py-2 text-sm focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
      />
      {status === "ok" ? (
        <p className="mt-2 text-xs font-medium text-emerald-600">Отправлено! Скоро ответят 💌</p>
      ) : null}
      {status === "error" ? (
        <p className="mt-2 text-xs text-red-600">{errorText}</p>
      ) : null}
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setStatus("idle");
          }}
          className="flex-1 rounded-full border border-violet-200 bg-white py-2 text-xs font-medium text-gray-600 hover:bg-violet-50"
        >
          Закрыть
        </button>
        <button
          type="submit"
          disabled={status === "sending" || message.trim().length < 3}
          className="flex-1 rounded-full bg-brand-purple py-2 text-xs font-semibold text-white shadow-sm shadow-brand-purple/25 disabled:opacity-50"
        >
          {status === "sending" ? "…" : "Отправить"}
        </button>
      </div>
    </form>
  );
}
