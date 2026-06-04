import { ARCHIPELAGO, type ArchipelagoIsland } from "@/data/archipelago";

export function findIslandForBranch(branchId: string): ArchipelagoIsland | undefined {
  return ARCHIPELAGO.find(
    (island) => island.branchIds?.includes(branchId) ?? false
  );
}

/** Этапы пути «вершина МышМата» — без дат и олимпиад */
export function getSummitPathSteps(): { id: string; title: string; emoji: string }[] {
  return ARCHIPELAGO.filter((i) => i.kind !== "pier").map((i) => ({
    id: i.id,
    title: i.title,
    emoji: i.emoji,
  }));
}
