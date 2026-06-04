import {
  ARCHIPELAGO,
  getUnlockThreshold,
  type ArchipelagoIsland,
  type SkillLevel,
} from "@/data/archipelago";
import { getBranchById } from "@/data/thinking-map";
import {
  effectiveSkillLevel,
  getIslandRecord,
  type ArchipelagoProgressData,
} from "@/lib/archipelago-progress";
import type { UserProgress } from "@/lib/progress";

export type RouteIslandStatus = "locked" | "surfacing" | "current" | "completed" | "available";

export interface RouteIslandItem {
  island: ArchipelagoIsland;
  status: RouteIslandStatus;
  skillLevel: SkillLevel;
  stationsCompleted: number;
  unlockHint?: string;
  primaryHref?: string;
  hasPlayableContent: boolean;
}

function requiredSkillOnPrevious(prev: ArchipelagoIsland): SkillLevel {
  return getUnlockThreshold(prev);
}

function isUnlocked(
  index: number,
  userProgress: UserProgress,
  archipelago: ArchipelagoProgressData
): boolean {
  if (index === 0) return true;
  const prev = ARCHIPELAGO[index - 1];
  const prevSkill = effectiveSkillLevel(
    prev.id,
    prev.branchIds,
    userProgress,
    archipelago
  );
  return prevSkill >= requiredSkillOnPrevious(prev);
}

function primaryBranchHref(island: ArchipelagoIsland): string | undefined {
  return `/map/${island.id}`;
}

function hasPlayableContent(island: ArchipelagoIsland): boolean {
  if (island.kind === "pier" || island.kind === "finale") return true;
  return (
    island.branchIds?.some((id) => (getBranchById(id)?.taskCount ?? 0) > 0) ?? false
  );
}

export function buildArchipelagoRoute(
  userProgress: UserProgress,
  archipelago: ArchipelagoProgressData
): RouteIslandItem[] {
  let currentAssigned = false;

  return ARCHIPELAGO.map((island, index) => {
    const unlocked = isUnlocked(index, userProgress, archipelago);
    const record = getIslandRecord(island.id, archipelago);
    const skillLevel = effectiveSkillLevel(
      island.id,
      island.branchIds,
      userProgress,
      archipelago
    );
    const playable = hasPlayableContent(island);

    let status: RouteIslandStatus = "locked";
    let unlockHint: string | undefined;

    if (!unlocked) {
      const prev = ARCHIPELAGO[index - 1];
      const need = requiredSkillOnPrevious(prev);
      unlockHint = `Нужен навык «${prev.title}»: ${need === 3 ? "Переносит" : "Использует"}`;
    } else if (!record.surfaceSeen) {
      status = "surfacing";
    } else if (skillLevel >= 3 && island.kind !== "pier") {
      status = "completed";
    } else if (!currentAssigned) {
      status = "current";
      currentAssigned = true;
    } else {
      status = "available";
    }

    return {
      island,
      status,
      skillLevel,
      stationsCompleted: record.stationsCompleted,
      unlockHint,
      primaryHref: unlocked ? primaryBranchHref(island) : undefined,
      hasPlayableContent: playable,
    };
  });
}

export function countUnlockedIslands(items: RouteIslandItem[]): number {
  return items.filter((i) => i.status !== "locked").length;
}
