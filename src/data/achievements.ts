/** Каталог достижений МышМата */
export type AchievementId =
  | "first_task"
  | "first_daily"
  | "stars_25"
  | "stars_100"
  | "level_5"
  | "streak_3"
  | "streak_7"
  | "heads_legs_5"
  | "paper_solution"
  | "help_free_task";

export interface AchievementDef {
  id: AchievementId;
  title: string;
  description: string;
  emoji: string;
  /** Скрытая до разблокировки */
  secret?: boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first_task",
    title: "Первый шаг",
    description: "Решил первую задачу в МышМате",
    emoji: "🎯",
  },
  {
    id: "first_daily",
    title: "Школьный день",
    description: "Закрыл все три предмета daily за один день",
    emoji: "📚",
  },
  {
    id: "stars_25",
    title: "Звёздный след",
    description: "Накопил 25 звёзд",
    emoji: "⭐",
  },
  {
    id: "stars_100",
    title: "Созвездие",
    description: "Накопил 100 звёзд",
    emoji: "🌟",
  },
  {
    id: "level_5",
    title: "Уровень 5",
    description: "Достиг 5-го уровня",
    emoji: "🎖️",
  },
  {
    id: "streak_3",
    title: "Три дня подряд",
    description: "Серия daily — 3 учебных дня",
    emoji: "🔥",
  },
  {
    id: "streak_7",
    title: "Неделя силы",
    description: "Серия daily — 7 учебных дней",
    emoji: "💪",
  },
  {
    id: "heads_legs_5",
    title: "Головы и ноги",
    description: "Решил 5 задач в теме «Головы и ноги»",
    emoji: "🐔",
  },
  {
    id: "paper_solution",
    title: "На листочке",
    description: "Загрузил фото решения на бумаге",
    emoji: "📸",
  },
  {
    id: "help_free_task",
    title: "Сам!",
    description: "Решил задачу на 3★ без подсказок",
    emoji: "🧠",
  },
];

export const ACHIEVEMENT_BY_ID = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a]),
) as Record<AchievementId, AchievementDef>;
