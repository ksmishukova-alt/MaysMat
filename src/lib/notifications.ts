"use client";

import type { UserProgress } from "@/lib/progress";

export interface AppNotification {
  id: string;
  icon: string;
  title: string;
  text: string;
  href?: string;
  read: boolean;
  time: string;
}

const STORAGE_KEY = "mysmat-notifications-read";

function readIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function markNotificationRead(id: string): void {
  const ids = readIds();
  ids.add(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function markAllNotificationsRead(ids: string[]): void {
  const set = readIds();
  ids.forEach((id) => set.add(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

/** Уведомления для колокольчика (MVP — из прогресса и заглушек) */
export function getNotifications(progress: UserProgress): AppNotification[] {
  const read = readIds();
  const list: AppNotification[] = [
    {
      id: "duel-masha",
      icon: "⚔️",
      title: "Вызов на дуэль",
      text: "Маша зовёт на дуэль по теме «Дерево вариантов» — 10 задач, 15 мин.",
      href: "/duels",
      read: read.has("duel-masha"),
      time: "сегодня",
    },
    {
      id: "daily-reminder",
      icon: "📅",
      title: "Daily на сегодня",
      text: "Не забудь чтение, русский и математику — звёзды копятся каждый день!",
      href: "/tasks",
      read: read.has("daily-reminder"),
      time: "сегодня",
    },
    {
      id: "card-charge",
      icon: "✨",
      title: "Карточка почти готова",
      text: `Заряд карточки ${progress.cardCharge}% — реши ещё задачу по теме!`,
      href: "/branch/heads-legs",
      read: read.has("card-charge"),
      time: "недавно",
    },
  ];
  return list;
}

export function unreadCount(notifications: AppNotification[]): number {
  return notifications.filter((n) => !n.read).length;
}
