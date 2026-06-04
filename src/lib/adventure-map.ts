import { ADVENTURES, type Adventure } from "@/data/branch-meta";
import { getAllBranches, type Branch } from "@/data/thinking-map";
import type { UserProgress } from "@/lib/progress";

export interface AdventureBranchItem {
  branch: Branch;
  progress: number;
  href?: string;
  locked: boolean;
}

export interface AdventureMapItem {
  adventure: Adventure;
  branches: AdventureBranchItem[];
  progress: number;
  hasContent: boolean;
  locked: boolean;
  /** Первая доступная тема — для быстрого входа */
  primaryHref?: string;
}

function branchProgress(branch: Branch, progress: UserProgress): number {
  return progress.branchProgress[branch.id] ?? branch.progress;
}

function branchHref(branch: Branch): string | undefined {
  if (branch.taskCount === 0) return undefined;
  if (branch.status === "locked" && branch.taskCount === 0) return undefined;
  return `/branch/${branch.slug}`;
}

export function buildAdventureMapItems(progress: UserProgress): AdventureMapItem[] {
  const allBranches = getAllBranches();
  const byId = new Map(allBranches.map((b) => [b.id, b]));

  return ADVENTURES.map((adventure) => {
    const branches: AdventureBranchItem[] = adventure.branchIds
      .map((id) => byId.get(id))
      .filter((b): b is Branch => Boolean(b))
      .map((branch) => {
        const locked = branch.taskCount === 0;
        return {
          branch,
          progress: branchProgress(branch, progress),
          href: locked ? undefined : branchHref(branch),
          locked,
        };
      });

    const withContent = branches.filter((b) => !b.locked);
    const hasContent = withContent.length > 0;
    const progressValues = withContent.map((b) => b.progress);
    const avgProgress =
      progressValues.length > 0
        ? Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length)
        : 0;

    const primaryHref = withContent.find((b) => b.href)?.href;

    return {
      adventure,
      branches,
      progress: avgProgress,
      hasContent,
      locked: !hasContent,
      primaryHref,
    };
  });
}
