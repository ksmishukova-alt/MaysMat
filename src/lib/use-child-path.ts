"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CHILD_PATH_UPDATED_EVENT,
  readChildPathStore,
  type ChildPathStore,
} from "@/lib/child-path";

export function useChildPathStore(): ChildPathStore {
  const [store, setStore] = useState<ChildPathStore>({ byChild: {} });

  const refresh = useCallback(() => setStore(readChildPathStore()), []);

  useEffect(() => {
    refresh();
    window.addEventListener(CHILD_PATH_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(CHILD_PATH_UPDATED_EVENT, refresh);
  }, [refresh]);

  return store;
}
