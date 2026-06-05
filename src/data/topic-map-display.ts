import { THINKING_TYPES, type Branch } from "@/data/thinking-map";
import type { UserProgress } from "@/lib/progress";

export type TopicFilterId =
  | "all"
  | "logic"
  | "combinatorics"
  | "invariants"
  | "graphs";

export const TOPIC_FILTERS: { id: TopicFilterId; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "logic", label: "Логическое мышление" },
  { id: "combinatorics", label: "Систематический поиск" },
  { id: "invariants", label: "Инварианты" },
  { id: "graphs", label: "Структурное" },
];

/** Визуал карточки — как в макете №1 */
export interface TopicCardVisual {
  emoji: string;
  cardBg: string;
  /** Включить PNG из public/topics/{id}.png (положите файл и поставьте true) */
  customArt?: boolean;
  demoProgress?: number;
  demoStars?: number;
  featured?: boolean;
}

export const BRANCH_VISUALS: Record<string, TopicCardVisual> = {
  "logic-knights": {
    emoji: "⚔️",
    cardBg: "from-emerald-50 via-green-50 to-teal-100",
    customArt: true,
    demoProgress: 100,
    demoStars: 3,
    featured: true,
  },
  "logic-euler": {
    emoji: "⭕",
    cardBg: "from-orange-50 via-amber-50 to-orange-100",
    customArt: true,
    demoProgress: 88,
    demoStars: 2,
    featured: true,
  },
  "comb-tree": {
    emoji: "🌳",
    cardBg: "from-violet-50 via-purple-50 to-fuchsia-100",
    customArt: true,
    demoProgress: 76,
    demoStars: 2,
    featured: true,
  },
  "modeling-heads-legs": {
    emoji: "🐾",
    cardBg: "from-pink-50 via-rose-50 to-pink-100",
    customArt: true,
    demoProgress: 63,
    demoStars: 2,
    featured: true,
  },
  "fairy-caves": {
    emoji: "🕳️",
    cardBg: "from-violet-50 via-purple-50 to-indigo-100",
    featured: true,
  },
  "proof-dirichlet": {
    emoji: "🕊️",
    cardBg: "from-sky-50 via-blue-50 to-indigo-100",
    customArt: true,
    featured: true,
  },
  "proof-unlucky": {
    emoji: "🎲",
    cardBg: "from-amber-50 via-orange-50 to-yellow-100",
    featured: true,
  },
  "proof-table-cells": {
    emoji: "📋",
    cardBg: "from-violet-50 via-purple-50 to-fuchsia-100",
    featured: true,
  },
  "proof-extreme": {
    emoji: "📍",
    cardBg: "from-rose-50 via-red-50 to-orange-100",
    featured: true,
  },
  "proof-constructions": {
    emoji: "🧱",
    cardBg: "from-stone-50 via-slate-50 to-zinc-100",
    featured: true,
  },
  "arith-remainders": {
    emoji: "➗",
    cardBg: "from-red-50 via-orange-50 to-amber-100",
    featured: true,
  },
  "geo-cutting": {
    emoji: "✂️",
    cardBg: "from-fuchsia-50 via-pink-50 to-purple-100",
    featured: true,
  },
  "inv-parity": {
    emoji: "♟️",
    cardBg: "from-yellow-50 via-amber-50 to-yellow-100",
    customArt: true,
    demoProgress: 100,
    demoStars: 3,
    featured: true,
  },
  "graphs-paths": {
    emoji: "🔗",
    cardBg: "from-indigo-50 via-violet-50 to-purple-100",
    customArt: true,
    featured: true,
  },
  "games-winning": {
    emoji: "🔢",
    cardBg: "from-cyan-50 via-teal-50 to-cyan-100",
    demoProgress: 42,
    demoStars: 1,
    featured: true,
  },
  "logic-sets": {
    emoji: "📊",
    cardBg: "from-indigo-50 to-blue-100",
    customArt: true,
  },
  "logic-matching": {
    emoji: "🔀",
    cardBg: "from-blue-50 to-cyan-100",
    customArt: true,
    featured: true,
  },
  "comb-enumeration": {
    emoji: "🔢",
    cardBg: "from-fuchsia-50 to-pink-100",
    customArt: true,
  },
  "comb-two-ways": {
    emoji: "✌️",
    cardBg: "from-purple-50 to-violet-100",
    customArt: true,
  },
  "inv-coloring": {
    emoji: "🎨",
    cardBg: "from-lime-50 to-green-100",
    customArt: true,
    featured: true,
  },
  "inv-impossible": {
    emoji: "🚫",
    cardBg: "from-red-50 to-rose-100",
    customArt: true,
  },
  "inv-operations": {
    emoji: "⚙️",
    cardBg: "from-cyan-50 to-teal-100",
    customArt: true,
  },
  "graphs-vertices": {
    emoji: "🔵",
    cardBg: "from-blue-50 to-indigo-100",
    customArt: true,
  },
  "graphs-edges": {
    emoji: "〰️",
    cardBg: "from-violet-50 to-purple-100",
    customArt: true,
  },
  "graphs-connectivity": {
    emoji: "🕸️",
    cardBg: "from-slate-50 to-indigo-100",
    customArt: true,
  },
  "modeling-drawing": { emoji: "✏️", cardBg: "from-purple-50 to-violet-100" },
  "modeling-speed": { emoji: "🏃", cardBg: "from-orange-50 to-amber-100" },
  "modeling-schemes": { emoji: "📐", cardBg: "from-violet-50 to-purple-100" },
};

const FEATURED_IDS = [
  "logic-knights",
  "logic-euler",
  "logic-matching",
  "comb-tree",
  "modeling-heads-legs",
  "fairy-caves",
  "proof-dirichlet",
  "proof-unlucky",
  "proof-constructions",
  "arith-remainders",
  "geo-cutting",
  "inv-coloring",
  "inv-parity",
  "graphs-paths",
  "games-winning",
];

export interface TopicCardModel {
  branch: Branch;
  emoji: string;
  cardBg: string;
  imageSrc?: string;
  progress: number;
  stars: number;
  locked: boolean;
  href?: string;
  isActive: boolean;
}

function defaultVisual(_branch: Branch): TopicCardVisual {
  return {
    emoji: "📘",
    cardBg: "from-lavender-50 to-purple-100",
  };
}

function branchHref(branch: Branch): string | undefined {
  if (branch.taskCount > 0 && branch.firstTaskId) {
    return `/branch/${branch.slug}`;
  }
  if (branch.id === "modeling-heads-legs") return "/branch/heads-legs";
  return undefined;
}

function isLocked(branch: Branch): boolean {
  return branch.taskCount === 0 || branch.status === "locked";
}

export function buildTopicCard(branch: Branch, progress: UserProgress): TopicCardModel {
  const visual = BRANCH_VISUALS[branch.id] ?? defaultVisual(branch);
  const realProgress = progress.branchProgress[branch.id];
  const hasContent = branch.taskCount > 0;
  const preview = Boolean(visual.featured && visual.demoProgress !== undefined && !hasContent);

  const locked = isLocked(branch) && !preview;

  let cardProgress = realProgress ?? 0;
  if (hasContent) {
    cardProgress = realProgress ?? 0;
  } else if (preview && visual.demoProgress !== undefined) {
    cardProgress = visual.demoProgress;
  }

  let stars = 0;
  if (!locked) {
    if (hasContent) {
      stars = cardProgress >= 100 ? 3 : cardProgress >= 50 ? 2 : cardProgress > 0 ? 1 : 0;
    } else if (preview) {
      stars = visual.demoStars ?? 0;
    }
  }

  return {
    branch,
    emoji: visual.emoji,
    cardBg: visual.cardBg,
    imageSrc: visual.customArt ? `/topics/${branch.id}.png` : undefined,
    progress: locked ? 0 : cardProgress,
    stars,
    locked,
    href: hasContent ? branchHref(branch) : preview ? "/tasks" : undefined,
    isActive:
      branch.id === "comb-tree" ||
      (branch.id === "modeling-heads-legs" && cardProgress > 0 && cardProgress < 100),
  };
}

export function getTopicCards(
  filter: TopicFilterId,
  progress: UserProgress
): TopicCardModel[] {
  const allBranches = THINKING_TYPES.flatMap((t) => t.branches);

  let branchIds: string[];
  if (filter === "all") {
    branchIds = FEATURED_IDS;
  } else {
    branchIds = allBranches.filter((b) => b.thinkingType === filter).map((b) => b.id);
  }

  return branchIds
    .map((id) => allBranches.find((b) => b.id === id))
    .filter((b): b is Branch => Boolean(b))
    .map((b) => buildTopicCard(b, progress));
}

export function getAllBranchesFlat(): Branch[] {
  return THINKING_TYPES.flatMap((t) => t.branches);
}
