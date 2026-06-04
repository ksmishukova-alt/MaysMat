"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ARCHIPELAGO_UPDATED_EVENT,
  defaultArchipelagoProgress,
  readArchipelagoProgress,
  type ArchipelagoProgressData,
} from "@/lib/archipelago-progress";
import { PROGRESS_UPDATED_EVENT } from "@/lib/progress";

export function useArchipelagoProgress(): ArchipelagoProgressData {
  const [data, setData] = useState<ArchipelagoProgressData>(defaultArchipelagoProgress());

  const refresh = useCallback(() => setData(readArchipelagoProgress()), []);

  useEffect(() => {
    refresh();
    window.addEventListener(ARCHIPELAGO_UPDATED_EVENT, refresh);
    window.addEventListener(PROGRESS_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener(ARCHIPELAGO_UPDATED_EVENT, refresh);
      window.removeEventListener(PROGRESS_UPDATED_EVENT, refresh);
    };
  }, [refresh]);

  return data;
}
