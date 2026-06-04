import { THINKING_TYPES, type ThinkingType } from "@/data/thinking-map";
import type { UserProgress } from "@/lib/progress";

/** Запасной набор, если прогресса ещё нет */
const FALLBACK_TYPE_IDS = ["modeling", "logic", "combinatorics", "proof"] as const;

export interface ThinkingSkillRow {
  id: string;
  title: string;
  color: string;
  progress: number;
}

function progressForType(
  type: ThinkingType,
  branchProgress: Record<string, number>,
): number {
  const active = type.branches.filter((b) => b.taskCount > 0);
  if (!active.length) return 0;
  const sum = active.reduce((acc, b) => acc + (branchProgress[b.id] ?? 0), 0);
  return Math.round(sum / active.length);
}

/** До 4 навыков: топ по прогрессу, недостающие — из запасного набора */
export function getProfileThinkingSkills(
  progress: UserProgress,
  limit = 4,
): ThinkingSkillRow[] {
  const ranked = THINKING_TYPES.map((type) => ({
    type,
    progress: progressForType(type, progress.branchProgress),
  }))
    .filter((row) => row.progress > 0)
    .sort((a, b) => b.progress - a.progress);

  const picked: ThinkingType[] = ranked.map((r) => r.type);
  const pickedIds = new Set(picked.map((t) => t.id));

  if (picked.length < limit) {
    for (const id of FALLBACK_TYPE_IDS) {
      if (picked.length >= limit) break;
      if (pickedIds.has(id)) continue;
      const type = THINKING_TYPES.find((t) => t.id === id);
      if (type) {
        picked.push(type);
        pickedIds.add(id);
      }
    }
  }

  if (!ranked.length && picked.length === 0) {
    for (const id of FALLBACK_TYPE_IDS) {
      const type = THINKING_TYPES.find((t) => t.id === id);
      if (type) picked.push(type);
    }
  }

  return picked.slice(0, limit).map((type) => ({
    id: type.id,
    title: type.title,
    color: type.color,
    progress: progressForType(type, progress.branchProgress),
  }));
}

/** Средний прогресс по веткам с контентом — для цели сезона */
export function getOverallRouteProgress(progress: UserProgress): number {
  const branches = THINKING_TYPES.flatMap((t) => t.branches).filter((b) => b.taskCount > 0);
  if (!branches.length) return 0;
  const sum = branches.reduce((acc, b) => acc + (progress.branchProgress[b.id] ?? 0), 0);
  return Math.round(sum / branches.length);
}
