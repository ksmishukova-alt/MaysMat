import { getStampById, pickStampForTask, type TaskStamp } from "@/data/task-stamps";

interface TaskCompletionStampProps {
  stamp: TaskStamp;
  stars?: number;
  size?: "sm" | "lg";
  animate?: boolean;
}

export function TaskCompletionStamp({
  stamp,
  stars,
  size = "lg",
  animate = false,
}: TaskCompletionStampProps) {
  const large = size === "lg";

  return (
    <div
      className={`inline-flex flex-col items-center ${animate ? "stamp-slam" : ""}`}
      role="img"
      aria-label={`Печать: ${stamp.title}`}
    >
      <div
        className={`relative border-4 border-dashed text-center ${
          large ? "rounded-2xl px-8 py-6" : "rounded-xl px-4 py-3"
        } ${
          stars && stars >= 3
            ? "border-amber-400 bg-amber-50/90 text-amber-950"
            : stars && stars >= 2
              ? "border-brand-purple/50 bg-lavender-50 text-brand-purple-dark"
              : "border-emerald-400/70 bg-emerald-50/80 text-emerald-900"
        }`}
        style={{ transform: large ? "rotate(-3deg)" : "rotate(-2deg)" }}
      >
        <div className={large ? "text-5xl" : "text-2xl"}>{stamp.emoji}</div>
        <div
          className={`mt-1 font-black uppercase tracking-wide ${
            large ? "text-xl" : "text-sm"
          }`}
        >
          {stamp.title}
        </div>
        <div className={`mt-1 ${large ? "text-sm" : "text-xs"} opacity-80`}>
          {stamp.punchline}
        </div>
        {stars !== undefined ? (
          <div className={`mt-2 ${large ? "text-lg" : "text-sm"} text-amber-500`}>
            {"★".repeat(stars)}
            {"☆".repeat(Math.max(0, 3 - stars))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function TaskCompletionStampById({
  stampId,
  stars,
  size,
  animate,
}: {
  stampId: string;
  stars?: number;
  size?: "sm" | "lg";
  animate?: boolean;
}) {
  const stamp = getStampById(stampId) ?? pickStampForTask(stampId, stars ?? 3);
  return <TaskCompletionStamp stamp={stamp} stars={stars} size={size} animate={animate} />;
}
