export interface NavItem {
  href: string;
  label: string;
  icon: string;
  badgeKey?: "daily";
  /** Показывать в нижней панели на mobile */
  mobilePrimary?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Главная", icon: "🏠", mobilePrimary: true },
  { href: "/tasks", label: "Задачи", icon: "📝", badgeKey: "daily", mobilePrimary: true },
  { href: "/album", label: "Альбом", icon: "📚", mobilePrimary: true },
  { href: "/achievements", label: "Достижения", icon: "🏆", mobilePrimary: true },
  { href: "/profile", label: "Профиль", icon: "👤" },
  { href: "/duels", label: "Дуэли", icon: "⚔️" },
  { href: "/shop", label: "Магазин", icon: "🛍️" },
];

export const MOBILE_PRIMARY_NAV = NAV_ITEMS.filter((item) => item.mobilePrimary);
export const MOBILE_MORE_NAV = NAV_ITEMS.filter((item) => !item.mobilePrimary);

export function isNavActive(pathname: string, href: string): boolean {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}
