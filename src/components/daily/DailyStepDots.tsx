import type { DailySubjectTheme } from "@/components/daily/daily-theme";

interface DailyStepDotsProps {
  total: number;
  current: number;
  theme: DailySubjectTheme;
}

export function DailyStepDots({ total, current, theme }: DailyStepDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <span
            key={i}
            className={`h-2.5 rounded-full transition-all ${
              active
                ? `w-8 ${theme.dotActive}`
                : done
                  ? `w-2.5 ${theme.dotDone}`
                  : `w-2.5 ${theme.dot}`
            }`}
            aria-hidden
          />
        );
      })}
    </div>
  );
}
