import type { StreakMilestone, StreakShieldSetId } from "@/data/streak-shield-catalog";
import { STREAK_MILESTONES } from "@/data/streak-shield-catalog";
import { StreakShieldGraphic } from "@/components/profile/StreakShieldGraphic";

interface ShieldPalette {
  fill: string;
  stroke: string;
  gem?: string;
  accent?: string;
}

/** Палитры классического набора по индексу вехи */
const CLASSIC_PALETTES: ShieldPalette[] = [
  { fill: "#9CA3AF", stroke: "#6B7280" },
  { fill: "#B45309", stroke: "#92400E", gem: "#FDE68A" },
  { fill: "#94A3B8", stroke: "#64748B", gem: "#E2E8F0" },
  { fill: "#FBBF24", stroke: "#D97706", gem: "#FEF3C7" },
  { fill: "#8B5CF6", stroke: "#6D28D9", gem: "#C4B5FD" },
  { fill: "#F59E0B", stroke: "#B45309", gem: "#FDE68A", accent: "#7C3AED" },
  { fill: "#EF4444", stroke: "#B91C1C", gem: "#FCA5A5", accent: "#7C3AED" },
  { fill: "#3B82F6", stroke: "#1D4ED8", gem: "#93C5FD", accent: "#FBBF24" },
  { fill: "#10B981", stroke: "#047857", gem: "#6EE7B7", accent: "#FBBF24" },
  { fill: "#F8FAFC", stroke: "#E879F9", gem: "#FDE047", accent: "#A855F7" },
];

const SET_ACCENT: Partial<Record<StreakShieldSetId, string>> = {
  magical: "#34D399",
  bookish: "#F59E0B",
  stone: "#78716C",
  starry: "#6366F1",
};

function emptyShield(className: string) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
        fill="#E7E5E4"
        stroke="#A8A29E"
        strokeWidth="0.8"
        strokeDasharray="2 1.5"
        opacity="0.85"
      />
    </svg>
  );
}

interface StreakShieldIconProps {
  setId: StreakShieldSetId;
  milestoneIndex: number;
  className?: string;
}

export function StreakShieldIcon({
  setId,
  milestoneIndex,
  className = "h-7 w-7",
}: StreakShieldIconProps) {
  if (milestoneIndex < 0) return emptyShield(className);

  if (setId === "classic") {
    return (
      <StreakShieldGraphic
        setId="classic"
        streakDays={STREAK_MILESTONES[milestoneIndex] ?? 1}
        className={className}
      />
    );
  }

  const palette = CLASSIC_PALETTES[milestoneIndex] ?? CLASSIC_PALETTES[0]!;
  const setTint = SET_ACCENT[setId];
  const wings = milestoneIndex >= 5;
  const bigGem = milestoneIndex >= 3;

  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      {wings && (
        <>
          <path
            d="M4 10c-2 1-3 3-3 5 2-1 4-1 5 0-2-1-3-3-2-5z"
            fill={palette.accent ?? palette.gem ?? "#C4B5FD"}
            opacity="0.85"
          />
          <path
            d="M20 10c2 1 3 3 3 5-2-1-4-1-5 0 2-1 3-3 2-5z"
            fill={palette.accent ?? palette.gem ?? "#C4B5FD"}
            opacity="0.85"
          />
        </>
      )}
      <path
        d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
        fill={palette.fill}
        stroke={setTint ?? palette.stroke}
        strokeWidth="0.8"
      />
      {setId === "bookish" && (
        <path
          d="M9 11h6v5H9z M10 11V9h4v2"
          fill="#FEF3C7"
          stroke="#92400E"
          strokeWidth="0.4"
        />
      )}
      {setId === "magical" && milestoneIndex >= 1 && (
        <path d="M10 8c1 2 3 2 4 0" stroke="#34D399" strokeWidth="0.8" fill="none" />
      )}
      {setId === "starry" && (
        <circle cx="12" cy="11" r="1.2" fill="#FDE047" />
      )}
      {setId === "stone" && bigGem && (
        <circle cx="12" cy="11" r="2" fill={palette.gem ?? "#FDE68A"} opacity="0.9" />
      )}
      {milestoneIndex >= 9 && (
        <path
          d="M8 5l1 1 1-1 1 1 1-1 1 1-1 1 1"
          stroke="#FDE047"
          strokeWidth="0.5"
          fill="none"
          opacity="0.9"
        />
      )}
    </svg>
  );
}

export function streakBadgeStyle(milestoneIndex: number): string {
  if (milestoneIndex < 0) {
    return "from-stone-100 via-stone-50 to-slate-50 ring-stone-200/80 text-stone-600";
  }
  if (milestoneIndex <= 1) {
    return "from-stone-100 via-amber-50/80 to-stone-50 ring-stone-200/70 text-stone-800";
  }
  if (milestoneIndex <= 3) {
    return "from-slate-100 via-slate-50 to-amber-50/60 ring-slate-200/70 text-slate-800";
  }
  if (milestoneIndex <= 5) {
    return "from-amber-100/80 via-yellow-50 to-amber-50 ring-amber-200/70 text-amber-950";
  }
  if (milestoneIndex <= 7) {
    return "from-violet-100/70 via-purple-50 to-amber-50 ring-violet-200/60 text-violet-950";
  }
  return "from-violet-200/60 via-fuchsia-50 to-amber-100 ring-violet-300/60 text-violet-950";
}

export type { StreakMilestone };
