"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  unreadCount,
  type AppNotification,
} from "@/lib/notifications";
import { useProgress } from "@/lib/use-progress";

export function NotificationsBell() {
  const progress = useProgress();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(() => {
    setItems(getNotifications(progress));
  }, [progress]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const unread = unreadCount(items);

  const openItem = (n: AppNotification) => {
    markNotificationRead(n.id);
    refresh();
    setOpen(false);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card transition hover:ring-2 hover:ring-brand-purple/20"
        aria-label={`Уведомления${unread ? `, ${unread} новых` : ""}`}
        aria-expanded={open}
      >
        🔔
        {unread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-card border border-lavender-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-lavender-100 px-4 py-3">
            <span className="font-semibold">Уведомления</span>
            {unread > 0 ? (
              <button
                type="button"
                onClick={() => {
                  markAllNotificationsRead(items.map((i) => i.id));
                  refresh();
                }}
                className="text-xs text-brand-purple hover:underline"
              >
                Прочитать все
              </button>
            ) : null}
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-gray-400">Пока пусто</li>
            ) : (
              items.map((n) => (
                <li key={n.id}>
                  {n.href ? (
                    <Link
                      href={n.href}
                      onClick={() => openItem(n)}
                      className={`block px-4 py-3 transition hover:bg-lavender-50 ${
                        !n.read ? "bg-lavender-50/80" : ""
                      }`}
                    >
                      <NotificationRow n={n} />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openItem(n)}
                      className={`block w-full px-4 py-3 text-left transition hover:bg-lavender-50 ${
                        !n.read ? "bg-lavender-50/80" : ""
                      }`}
                    >
                      <NotificationRow n={n} />
                    </button>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function NotificationRow({ n }: { n: AppNotification }) {
  return (
    <div className="flex gap-3">
      <span className="text-xl">{n.icon}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium">{n.title}</span>
          {!n.read ? <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-purple" /> : null}
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{n.text}</p>
        <p className="mt-1 text-[10px] text-gray-400">{n.time}</p>
      </div>
    </div>
  );
}
