"use client";

import { useCallback, useEffect, useState } from "react";
import {
  loadProgress,
  type UserProgress,
  PROGRESS_UPDATED_EVENT,
  DEFAULT_PROGRESS,
} from "@/lib/progress";

export function useProgress(): UserProgress {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);

  const refresh = useCallback(() => setProgress(loadProgress()), []);

  useEffect(() => {
    refresh();
    window.addEventListener(PROGRESS_UPDATED_EVENT, refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(PROGRESS_UPDATED_EVENT, refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  return progress;
}
