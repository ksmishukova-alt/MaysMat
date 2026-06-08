"use client";

import type { ReactNode } from "react";

/** Брендовые декоративные обёртки для mini-game (PR3 polish) */
export function BrandFrame({
  brandTitle,
  accentClass,
  children,
}: {
  brandTitle: string;
  accentClass: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-2xl border-2 p-4 ${accentClass}`}>
      <p className="mb-3 text-center text-sm font-bold tracking-wide">{brandTitle}</p>
      {children}
    </div>
  );
}

export const MINI_GAME_BRAND: Record<
  string,
  { title: string; accent: string; decor: string }
> = {
  pojmat: { title: "МышМат: ПойМАТ!", accent: "border-purple-300 bg-purple-50/80", decor: "🎯" },
  parkomat: { title: "МышМат: ПаркоМАТ", accent: "border-blue-300 bg-blue-50/80", decor: "🅿️" },
  razryad: { title: "МышМат: Чиню разряд!", accent: "border-orange-300 bg-orange-50/80", decor: "🔧" },
  warehouse: { title: "МышМат и Продуктовый склад", accent: "border-green-300 bg-green-50/80", decor: "📦" },
  bubbles: { title: "МышМат и Пузырьковый Сад", accent: "border-cyan-300 bg-cyan-50/80", decor: "🫧" },
  station: { title: "МышМат: Вокзальный контролёр", accent: "border-indigo-300 bg-indigo-50/80", decor: "🚉" },
  parade: { title: "МышМат: Кто первый на парад?", accent: "border-yellow-300 bg-yellow-50/80", decor: "🎺" },
  "mouse-route": { title: "МышМат: Действуй по МышРуту", accent: "border-violet-300 bg-violet-50/80", decor: "🐭" },
  "time-path": { title: "МышМат: Путь сквозь время", accent: "border-sky-300 bg-sky-50/80", decor: "⏱️" },
  "fence-tile": { title: "МышМат: Забор или плитка?", accent: "border-stone-400 bg-stone-50/80", decor: "🧱" },
  "cheese-share": { title: "МышМат и Сырная Доля", accent: "border-amber-400 bg-amber-50/80", decor: "🧀" },
  percentomat: { title: "МышМат: ПроцентоМАТ", accent: "border-pink-300 bg-pink-50/80", decor: "💯" },
  advocate: { title: "МышМат-адвокат", accent: "border-violet-400 bg-violet-50/80", decor: "⚖️" },
  "code-chest": { title: "МышМат и Кодовый сундук", accent: "border-amber-600/40 bg-amber-50/80", decor: "🔐" },
  "catch-repeat": { title: "МышМат: Лови повтор!", accent: "border-teal-300 bg-teal-50/80", decor: "🔁" },
  "counting-road": { title: "МышМат: Счётная дорога", accent: "border-emerald-300 bg-emerald-50/80", decor: "🛤️" },
};
