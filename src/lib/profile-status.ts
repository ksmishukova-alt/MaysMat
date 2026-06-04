import type { AvatarGender } from "@/data/avatar-catalog";

interface GenderedStatus {
  male: string;
  female: string;
}

function both(text: string): GenderedStatus {
  return { male: text, female: text };
}

function pair(male: string, female: string): GenderedStatus {
  return { male, female };
}

/** Статусы профиля — один случайный на пользователя в день, с учётом пола аватара */
export const DAILY_PROFILE_STATUSES: readonly GenderedStatus[] = [
  both("Уже рисует схему"),
  both("Подозревает закономерность"),
  pair("Победитель утят и утконосов", "Победительница утят и утконосов"),
  pair("Главный по вариантам", "Главная по вариантам"),
  both("Не верит условию"),
  both("Думает своей головой"),
  pair("Охотник за идеями", "Охотница за идеями"),
  pair("Следопыт решений", "Следопытка решений"),
  pair("Покоритель моделей", "Покорительница моделей"),
  both("Академик «Ага!»"),
  pair("Повелитель таблиц", "Повелительница таблиц"),
  pair("Директор по догадкам", "Директорша по догадкам"),
  pair("Начальник доказательств", "Начальница доказательств"),
  both("Министр логики"),
];

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Статус на сегодня — стабилен в течение дня для одного имени и пола */
export function getDailyProfileStatus(
  userName: string,
  gender: AvatarGender,
  date: Date = new Date(),
): string {
  const dateKey = date.toISOString().slice(0, 10);
  const idx =
    hashSeed(`${dateKey}:${userName.trim()}`) % DAILY_PROFILE_STATUSES.length;
  const entry = DAILY_PROFILE_STATUSES[idx]!;
  return gender === "boy" ? entry.male : entry.female;
}
