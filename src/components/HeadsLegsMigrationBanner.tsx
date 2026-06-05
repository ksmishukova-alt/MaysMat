"use client";

import { useEffect, useState } from "react";
import { migrateHeadsLegsBranch } from "@/lib/heads-legs-migration";

export function HeadsLegsMigrationBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("album-myshleniya-heads-legs-banner") !== "1") return;
    if (sessionStorage.getItem("heads-legs-banner-dismissed")) return;
    setShow(true);
    migrateHeadsLegsBranch();
  }, []);

  if (!show) return null;

  return (
    <div className="mb-4 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
      <p className="font-medium">Задачи «Головы и ноги» обновлены</p>
      <p className="mt-1">Теперь 51 задача по новой методичке. Прежний прогресс по старым задачам сброшен.</p>
      <button
        type="button"
        className="mt-2 text-brand-purple hover:underline"
        onClick={() => {
          sessionStorage.setItem("heads-legs-banner-dismissed", "1");
          setShow(false);
        }}
      >
        Понятно
      </button>
    </div>
  );
}
