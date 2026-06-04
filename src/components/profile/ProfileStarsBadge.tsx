/** Декоративная звезда для счётчика */

interface StarIconProps {
  className?: string;
}

export function StarIcon({ className = "h-6 w-6" }: StarIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <defs>
        <linearGradient id="profile-star-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="45%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <path
        fill="url(#profile-star-fill)"
        stroke="#D97706"
        strokeWidth="0.6"
        d="M12 2.2l2.86 5.8 6.4.93-4.63 4.52 1.09 6.37L12 17.4l-5.72 3.01 1.09-6.37-4.63-4.52 6.4-.93L12 2.2z"
      />
    </svg>
  );
}

interface ProfileStarsBadgeProps {
  count: number;
}

/** Общая высота бейджей «звёзды» и «серия» в шапке профиля */
export const PROFILE_STAT_BADGE =
  "flex h-11 items-center gap-2.5 rounded-xl px-3.5 shadow-sm ring-1";
export const PROFILE_STAT_ICON = "h-7 w-7 shrink-0 drop-shadow-sm";

export function ProfileStarsBadge({ count }: ProfileStarsBadgeProps) {
  return (
    <div
      className={`${PROFILE_STAT_BADGE} bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100/90 ring-amber-200/70`}
    >
      <StarIcon className={PROFILE_STAT_ICON} />
      <span className="text-lg font-bold leading-none tabular-nums text-amber-950">
        {count}
      </span>
    </div>
  );
}
