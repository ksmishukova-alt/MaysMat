import { getAdventureForBranch } from "@/data/branch-meta";
import { getBranchById } from "@/data/thinking-map";
import { findIslandForBranch } from "@/lib/archipelago-display";
import { isTaskCompleted, type UserProgress } from "@/lib/progress";
import { getTasksForBranch, readTaskStore } from "@/lib/task-store";

/** Заголовки блока суперспособности — как на макете */
const HERO_TITLE_BY_ADVENTURE: Record<string, string> = {
  "workshop-models": "Строим модели",
  "math-lovers-mystery": "Тайна чисел",
  "kingdom-of-truth": "Королевство правды",
  "forest-of-choices": "Лес вариантов",
  "proof-academy": "Академия доказательств",
  "invariant-island": "Остров инвариантов",
  "fairy-caves": "Сказочные пещеры",
};

/** Подписи под заголовком */
const HERO_DESC_BY_ADVENTURE: Record<string, string> = {
  "workshop-models":
    "Учимся переводить условия задачи в рисунок, схему или таблицу.",
};

export interface MissionHeroCopy {
  title: string;
  description: string;
}

export function getMissionHeroCopy(branchId: string): MissionHeroCopy {
  const adventure = getAdventureForBranch(branchId);
  const island = findIslandForBranch(branchId);
  const advId = adventure?.id ?? "";

  const title =
    HERO_TITLE_BY_ADVENTURE[advId] ??
    adventure?.title ??
    island?.title ??
    "МышМат";

  const description =
    HERO_DESC_BY_ADVENTURE[advId] ??
    adventure?.tagline ??
    island?.gateSkill ??
    island?.superpower ??
    "Учимся думать шаг за шагом.";

  return { title, description };
}

export interface BranchMissionStats {
  current: number;
  total: number;
  percent: number;
}

export function getBranchMissionStats(
  branchId: string,
  progress: UserProgress,
  currentTaskNumber: number
): BranchMissionStats {
  const branch = getBranchById(branchId);
  const store = readTaskStore();
  const tasks = getTasksForBranch(branchId, store);
  const total = tasks.length > 0 ? tasks.length : (branch?.taskCount ?? 1);
  const completed = tasks.filter((t) => isTaskCompleted(t.id, progress)).length;
  const current = Math.min(total, Math.max(1, currentTaskNumber || completed + 1));
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return { current, total, percent };
}
