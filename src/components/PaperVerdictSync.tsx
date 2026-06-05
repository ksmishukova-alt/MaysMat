"use client";

import { useEffect } from "react";
import { HEADS_LEGS_TASK_LIST } from "@/data/heads-legs";
import { PAPER_REVIEW_UPDATED_EVENT } from "@/lib/paper-task-review";
import { syncPaperVerdicts } from "@/lib/paper-task-telegram";

const POLL_MS = 30_000;

/** Подтягивает вердикты бумажных задач с сервера (Telegram / админка). */
export function PaperVerdictSync() {
  useEffect(() => {
    const run = () => {
      void syncPaperVerdicts(HEADS_LEGS_TASK_LIST);
    };
    run();
    const timer = window.setInterval(run, POLL_MS);
    window.addEventListener(PAPER_REVIEW_UPDATED_EVENT, run);
    window.addEventListener("focus", run);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener(PAPER_REVIEW_UPDATED_EVENT, run);
      window.removeEventListener("focus", run);
    };
  }, []);

  return null;
}
