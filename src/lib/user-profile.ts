"use client";

/** Профиль ребёнка — отдельно от игрового прогресса (звёзды, задачи) */
export interface ChildProfile {
  childId: string;
  /** id родителя / семьи (позже — из auth) */
  parentId?: string;
  name: string;
  /** Класс, напр. 4 */
  grade?: number;
  avatarId?: string;
  createdAt: string;
  /** Группа / поток, напр. «4А · весна 2026» */
  cohortId?: string;
  /** Текущий назначенный маршрут (id из child-path или archipelago) */
  routeId?: string;
}

export function createChildId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `child-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `child-${Date.now().toString(36)}`;
}

export function createFreshChildProfile(overrides: Partial<ChildProfile> = {}): ChildProfile {
  const now = new Date().toISOString();
  return {
    childId: createChildId(),
    name: "",
    createdAt: now,
    ...overrides,
  };
}

/** Демо-профиль Софии — только для ?demo=1 или явного включения */
export const DEMO_CHILD_PROFILE: ChildProfile = {
  childId: "demo-sofia",
  parentId: "demo-parent",
  name: "София",
  grade: 4,
  avatarId: "girl-1",
  createdAt: "2026-01-01T00:00:00.000Z",
  cohortId: "demo-4a",
  routeId: "modeling-heads-legs",
};

export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("demo") === "1") return true;
    return localStorage.getItem("album-myshleniya-demo") === "1";
  } catch {
    return false;
  }
}

export function enableDemoMode(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("album-myshleniya-demo", "1");
}

export function disableDemoMode(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("album-myshleniya-demo");
}
