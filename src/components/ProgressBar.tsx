interface ProgressBarProps {
  value: number;
  label?: string;
  color?: string;
  /** Светлые подписи на тёмном/фиолетовом фоне */
  variant?: "default" | "on-dark";
}

export function ProgressBar({
  value,
  label,
  color = "bg-brand-purple",
  variant = "default",
}: ProgressBarProps) {
  const onDark = variant === "on-dark";
  const labelClass = onDark ? "text-white/95" : "text-gray-500";
  const trackClass = onDark ? "bg-white/25" : "bg-lavender-200";

  return (
    <div>
      {label ? (
        <div className={`mb-1 flex justify-between text-xs font-medium ${labelClass}`}>
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      ) : null}
      <div className={`h-2.5 overflow-hidden rounded-full ${trackClass}`}>
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}
