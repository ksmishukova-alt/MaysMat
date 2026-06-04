import type { DailySubject } from "@/lib/daily";

export interface DailySubjectTheme {
  gradient: string;
  softBg: string;
  accent: string;
  accentMuted: string;
  border: string;
  ring: string;
  button: string;
  buttonHover: string;
  optionIdle: string;
  optionActive: string;
  passage: string;
  fileZone: string;
  dot: string;
  dotActive: string;
  dotDone: string;
  cardHover: string;
  cardDone: string;
}

export const DAILY_THEMES: Record<DailySubject, DailySubjectTheme> = {
  reading: {
    gradient: "from-sky-500 via-blue-500 to-indigo-600",
    softBg: "bg-sky-50/80",
    accent: "text-sky-800",
    accentMuted: "text-sky-600",
    border: "border-sky-200",
    ring: "ring-sky-400/60",
    button: "bg-sky-600",
    buttonHover: "hover:bg-sky-700",
    optionIdle: "border-sky-100 bg-white hover:border-sky-300 hover:bg-sky-50/50",
    optionActive: "border-sky-500 bg-sky-50 ring-2 ring-sky-400/50",
    passage: "border-sky-100 bg-gradient-to-br from-sky-50 via-white to-indigo-50/30",
    fileZone: "border-sky-200 bg-sky-50/70",
    dot: "bg-sky-200",
    dotActive: "bg-sky-600 ring-4 ring-sky-200",
    dotDone: "bg-sky-400",
    cardHover: "hover:ring-sky-400/50",
    cardDone: "ring-2 ring-sky-400/80",
  },
  russian: {
    gradient: "from-rose-400 via-pink-500 to-fuchsia-600",
    softBg: "bg-rose-50/80",
    accent: "text-rose-800",
    accentMuted: "text-rose-600",
    border: "border-rose-200",
    ring: "ring-rose-400/60",
    button: "bg-rose-600",
    buttonHover: "hover:bg-rose-700",
    optionIdle: "border-rose-100 bg-white hover:border-rose-300 hover:bg-rose-50/50",
    optionActive: "border-rose-500 bg-rose-50 ring-2 ring-rose-400/50",
    passage: "border-rose-100 bg-gradient-to-br from-rose-50 via-white to-pink-50/30",
    fileZone: "border-rose-200 bg-rose-50/70",
    dot: "bg-rose-200",
    dotActive: "bg-rose-600 ring-4 ring-rose-200",
    dotDone: "bg-rose-400",
    cardHover: "hover:ring-rose-400/50",
    cardDone: "ring-2 ring-rose-400/80",
  },
  math: {
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
    softBg: "bg-emerald-50/80",
    accent: "text-emerald-800",
    accentMuted: "text-emerald-600",
    border: "border-emerald-200",
    ring: "ring-emerald-400/60",
    button: "bg-emerald-600",
    buttonHover: "hover:bg-emerald-700",
    optionIdle: "border-emerald-100 bg-white hover:border-emerald-300 hover:bg-emerald-50/50",
    optionActive: "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-400/50",
    passage: "border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50/30",
    fileZone: "border-emerald-200 bg-emerald-50/70",
    dot: "bg-emerald-200",
    dotActive: "bg-emerald-600 ring-4 ring-emerald-200",
    dotDone: "bg-emerald-400",
    cardHover: "hover:ring-emerald-400/50",
    cardDone: "ring-2 ring-emerald-400/80",
  },
};

export function dailyTheme(subject: DailySubject): DailySubjectTheme {
  return DAILY_THEMES[subject];
}
