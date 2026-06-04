"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HelpSupportPanel } from "@/components/home/HelpSupportPanel";
import { Logo } from "@/components/Logo";
import { countIncompleteDailySubjects, getDailyState } from "@/lib/daily";
import { useProgress } from "@/lib/use-progress";

const NAV = [
  { href: "/", label: "Главная", icon: "🏠" },
  { href: "/duels", label: "Дуэли", icon: "⚔️" },
  { href: "/tasks", label: "Задачи", icon: "📝", badgeKey: "daily" as const },
  { href: "/album", label: "Альбом", icon: "📚" },
  { href: "/achievements", label: "Достижения", icon: "🏆" },
  { href: "/shop", label: "Магазин", icon: "🛍️" },
  { href: "/parents", label: "Родителям", icon: "👪" },
  { href: "/profile", label: "Профиль", icon: "👤" },
];

export function Sidebar() {
  const pathname = usePathname();
  const progress = useProgress();

  const dailyState = useMemo(() => getDailyState(progress.daily), [progress.daily]);
  const dailyBadge = useMemo(() => {
    if (!dailyState.isSchoolDay) return 0;
    return countIncompleteDailySubjects(progress.daily);
  }, [dailyState.isSchoolDay, progress.daily]);

  return (
    <aside className="flex w-64 shrink-0 flex-col rounded-card bg-white p-3 shadow-card">
      <div className="mb-4 -mx-1">
        <Logo />
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const badge =
            item.badgeKey === "daily" && dailyBadge > 0 ? dailyBadge : undefined;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-brand-purple font-medium text-white"
                  : "text-gray-600 hover:bg-lavender-100"
              }`}
            >
              <span>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {badge ? (
                <span className="rounded-full bg-red-500 px-1.5 text-xs text-white">
                  {badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <HelpSupportPanel />
    </aside>
  );
}
