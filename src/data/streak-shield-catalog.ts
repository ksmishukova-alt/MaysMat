/** Наборы щитов серии и вехи прогресса */

export const STREAK_MILESTONES = [1, 3, 7, 15, 30, 60, 100, 150, 200, 365] as const;

export type StreakMilestone = (typeof STREAK_MILESTONES)[number];

export type StreakShieldSetId =
  | "classic"
  | "magical"
  | "bookish"
  | "stone"
  | "starry";

export interface StreakShieldSetDef {
  id: StreakShieldSetId;
  label: string;
  description: string;
  /** Бесплатный набор по умолчанию */
  free: boolean;
  /** Цена в звёздах (0 для classic) */
  starPrice: number;
  /** Превью для магазина */
  previewEmoji: string;
}

export const STREAK_SHIELD_SETS: StreakShieldSetDef[] = [
  {
    id: "classic",
    label: "Классический",
    description: "Камень, бронза, серебро, золото — и до легендарного щита",
    free: true,
    starPrice: 0,
    previewEmoji: "🛡️",
  },
  {
    id: "magical",
    label: "Магический",
    description: "Лозы, луна, кристаллы и космическое сияние",
    free: false,
    starPrice: 450,
    previewEmoji: "✨",
  },
  {
    id: "bookish",
    label: "Книжный",
    description: "Щит-сказка с книгой — для любителей историй",
    free: false,
    starPrice: 450,
    previewEmoji: "📖",
  },
  {
    id: "stone",
    label: "Каменный",
    description: "Древний камень с светящимися кристаллами",
    free: false,
    starPrice: 550,
    previewEmoji: "💎",
  },
  {
    id: "starry",
    label: "Звёздный",
    description: "Ночное небо и созвездия на щите",
    free: false,
    starPrice: 550,
    previewEmoji: "🌟",
  },
];

export const DEFAULT_STREAK_SHIELD_SET: StreakShieldSetId = "classic";

export function getStreakShieldSet(id: string): StreakShieldSetDef | undefined {
  return STREAK_SHIELD_SETS.find((s) => s.id === id);
}

/** Индекс вехи 0…9 по числу дней серии; -1 если серия = 0 */
export function getStreakMilestoneIndex(days: number): number {
  if (days <= 0) return -1;
  let idx = -1;
  for (let i = 0; i < STREAK_MILESTONES.length; i++) {
    if (days >= STREAK_MILESTONES[i]!) idx = i;
  }
  return idx;
}

export function getStreakMilestone(days: number): StreakMilestone | null {
  const idx = getStreakMilestoneIndex(days);
  if (idx < 0) return null;
  return STREAK_MILESTONES[idx]!;
}

/** Путь к PNG щита (когда ассеты будут в public/shields/) */
export function streakShieldAssetPath(
  setId: StreakShieldSetId,
  milestone: StreakMilestone | "empty",
): string {
  return `/shields/${setId}/${setId}-${milestone}.png?v=2`;
}

export function streakShieldTitle(days: number): string {
  if (days <= 0) return "Щит ждёт";
  const m = getStreakMilestone(days);
  if (!m) return "Первый день серии";
  if (m >= 365) return "Легендарный щит";
  if (m >= 60) return "Королевский щит";
  if (m >= 30) return "Золотой щит";
  if (m >= 15) return "Серебряный щит";
  if (m >= 7) return "Бронзовый щит";
  if (m >= 3) return "Каменный щит";
  return "Первый щит";
}

export function streakShieldHint(days: number): string {
  if (days <= 0) {
    return "Реши задание дня — получишь первый щит серии";
  }
  const next = STREAK_MILESTONES.find((m) => m > days);
  if (!next) return "Максимальная веха — ты легенда!";
  return `До следующего щита: ${next - days} дн.`;
}
