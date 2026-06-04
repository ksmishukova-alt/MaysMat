"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { HelpSupportPanel } from "@/components/home/HelpSupportPanel";
import { Logo } from "@/components/Logo";
import {
  isNavActive,
  MOBILE_MORE_NAV,
  MOBILE_PRIMARY_NAV,
  NAV_ITEMS,
} from "@/components/nav-config";
import { countIncompleteDailySubjects, getDailyState } from "@/lib/daily";
import { useProgress } from "@/lib/use-progress";

function useDailyBadge() {
  const progress = useProgress();
  const dailyState = useMemo(() => getDailyState(progress.daily), [progress.daily]);
  return useMemo(() => {
    if (!dailyState.isSchoolDay) return 0;
    return countIncompleteDailySubjects(progress.daily);
  }, [dailyState.isSchoolDay, progress.daily]);
}

function NavBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
      {count}
    </span>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  icon: string;
  active: boolean;
  badge?: number;
  compact?: boolean;
  onClick?: () => void;
}

function NavLink({ href, label, icon, active, badge, compact, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={label}
      className={`relative flex items-center gap-3 rounded-xl transition ${
        compact ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
      } text-sm ${
        active
          ? "bg-brand-purple font-medium text-white"
          : "text-gray-600 hover:bg-lavender-100"
      }`}
    >
      <span className="text-lg leading-none">{icon}</span>
      {!compact ? <span className="flex-1">{label}</span> : null}
      {badge ? <NavBadge count={badge} /> : null}
      {compact && badge ? (
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
      ) : null}
    </Link>
  );
}

/** Desktop: полный sidebar | Tablet: иконки */
export function Sidebar({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const dailyBadge = useDailyBadge();

  return (
    <aside
      className={`hidden shrink-0 flex-col rounded-card bg-white p-3 shadow-card md:flex ${
        compact ? "w-[4.5rem]" : "w-64"
      }`}
    >
      <div className={`mb-4 ${compact ? "flex justify-center" : "-mx-1"}`}>
        {compact ? (
          <Link href="/" title="МышМат" className="text-2xl">
            🐭
          </Link>
        ) : (
          <Logo />
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const badge = item.badgeKey === "daily" ? dailyBadge : undefined;
          return (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isNavActive(pathname, item.href)}
              badge={badge}
              compact={compact}
            />
          );
        })}
      </nav>

      {!compact ? <HelpSupportPanel /> : null}
    </aside>
  );
}

/** Mobile: нижняя панель + «Ещё» */
export function MobileBottomNav() {
  const pathname = usePathname();
  const dailyBadge = useDailyBadge();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {moreOpen ? (
        <button
          type="button"
          aria-label="Закрыть меню"
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setMoreOpen(false)}
        />
      ) : null}

      {moreOpen ? (
        <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-4 right-4 z-50 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5 md:hidden">
          {MOBILE_MORE_NAV.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isNavActive(pathname, item.href)}
              onClick={() => setMoreOpen(false)}
            />
          ))}
          <div className="mt-2 border-t border-gray-100 pt-2">
            <HelpSupportPanel />
          </div>
        </div>
      ) : null}

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch justify-around border-t border-lavender-200 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur-md md:hidden">
        {MOBILE_PRIMARY_NAV.map((item) => {
          const badge = item.badgeKey === "daily" ? dailyBadge : undefined;
          const active = isNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-medium ${
                active ? "text-brand-purple" : "text-gray-500"
              }`}
            >
              <span className="relative text-xl leading-none">
                {item.icon}
                {badge ? <NavBadge count={badge} /> : null}
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-medium ${
            moreOpen ? "text-brand-purple" : "text-gray-500"
          }`}
        >
          <span className="text-xl leading-none">☰</span>
          <span>Ещё</span>
        </button>
      </nav>
    </>
  );
}
