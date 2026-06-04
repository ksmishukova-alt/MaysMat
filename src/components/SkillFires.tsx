import { SKILL_LEVEL_LABELS, type SkillLevel } from "@/data/archipelago";

interface SkillFiresProps {
  level: SkillLevel;
  size?: "sm" | "md";
  showLabels?: boolean;
}

export function SkillFires({ level, size = "md", showLabels = false }: SkillFiresProps) {
  const dot = size === "sm" ? "h-2.5 w-2.5" : "h-3.5 w-3.5";

  return (
    <div>
      <div className="flex items-center gap-1.5" title={SKILL_LEVEL_LABELS[level]}>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`${dot} rounded-full transition-all ${
              i <= level
                ? i === 0
                  ? "bg-gray-400"
                  : i === 1
                    ? "bg-amber-300 shadow-sm shadow-amber-200"
                    : i === 2
                      ? "bg-orange-400 shadow-sm shadow-orange-200"
                      : "bg-brand-purple shadow-md shadow-brand-purple/40 animate-pulse"
                : "bg-white/60 ring-1 ring-gray-200"
            }`}
            aria-hidden
          />
        ))}
        {!showLabels ? (
          <span className="ml-1 text-xs text-gray-500">{SKILL_LEVEL_LABELS[level]}</span>
        ) : null}
      </div>
      {showLabels ? (
        <div className="mt-2 grid grid-cols-4 gap-1 text-[10px] text-gray-400">
          {SKILL_LEVEL_LABELS.map((label) => (
            <span key={label} className="text-center leading-tight">
              {label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
