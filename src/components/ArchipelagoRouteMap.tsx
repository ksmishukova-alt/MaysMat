"use client";

import Link from "next/link";
import { useEffect } from "react";
import { SkillFires } from "@/components/SkillFires";
import { markIslandSurfaceSeen } from "@/lib/archipelago-progress";
import type { RouteIslandItem } from "@/lib/archipelago-map";

interface ArchipelagoRouteMapProps {
  items: RouteIslandItem[];
}

export function ArchipelagoRouteMap({ items }: ArchipelagoRouteMapProps) {
  return (
    <div className="relative overflow-hidden rounded-card bg-gradient-to-b from-sky-300 via-sky-200 to-teal-300 p-4 shadow-card md:p-8">
      {/* Волны фона */}
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
        <div className="absolute -left-1/4 top-1/4 h-64 w-[150%] rounded-[100%] bg-white/40 blur-2xl" />
        <div className="absolute -right-1/4 bottom-0 h-48 w-[120%] rounded-[100%] bg-teal-400/30 blur-xl" />
      </div>

      <p className="relative mb-6 text-center text-sm text-sky-900/80">
        Иди по маршруту ↓ — следующий остров всплывёт, когда освоишь ключевой навык
      </p>

      <ol className="relative mx-auto max-w-lg space-y-0">
        {items.map((item, index) => (
          <RouteStop key={item.island.id} item={item} index={index} isLast={index === items.length - 1} />
        ))}
      </ol>
    </div>
  );
}

function RouteStop({
  item,
  index,
  isLast,
}: {
  item: RouteIslandItem;
  index: number;
  isLast: boolean;
}) {
  const { island, status, skillLevel, unlockHint, primaryHref } = item;
  const locked = status === "locked";
  const surfacing = status === "surfacing";
  const isLeft = island.mapSide === "left";

  useEffect(() => {
    if (!surfacing) return;
    const t = window.setTimeout(() => markIslandSurfaceSeen(island.id), 1000);
    return () => window.clearTimeout(t);
  }, [surfacing, island.id]);

  return (
    <li className={`relative flex pb-20 last:pb-4 ${isLeft ? "justify-start" : "justify-end"}`}>
      <div className={`relative w-full max-w-[280px] ${isLeft ? "mr-auto pl-2" : "ml-auto pr-2"}`}>
        {/* Тропа между островами */}
        {!isLast ? (
          <div
            className={`absolute top-full z-0 h-16 w-px ${isLeft ? "left-1/2" : "right-1/2"} ${
              locked ? "bg-white/20" : "bg-white/50"
            }`}
            aria-hidden
          >
            <div
              className={`absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed ${
                locked ? "border-white/20" : "border-white/40"
              }`}
            />
          </div>
        ) : null}

        {locked ? (
          <SubmergedSilhouette island={island} order={index} hint={unlockHint} />
        ) : (
          <Link
            href={primaryHref ?? `/map/${island.id}`}
            className={`island-surface block rounded-3xl border-2 border-white/90 bg-gradient-to-br p-4 shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl ${island.accent} ${
              status === "current" ? "ring-4 ring-brand-purple/50 ring-offset-2" : ""
            } ${surfacing ? "island-emerge" : ""}`}
          >
            <RouteIslandCard item={item} order={index} />
          </Link>
        )}
      </div>
    </li>
  );
}

function SubmergedSilhouette({
  island,
  order,
  hint,
}: {
  island: RouteIslandItem["island"];
  order: number;
  hint?: string;
}) {
  return (
    <div
      className="island-submerged relative overflow-hidden rounded-3xl border border-white/30 bg-slate-400/40 p-4 text-center shadow-inner backdrop-blur-sm"
      title={hint}
    >
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-sky-300/60 to-transparent" aria-hidden />
      <span className="text-3xl grayscale opacity-50">{island.emoji}</span>
      <div className="mt-1 text-xs font-medium text-white/80">
        {order}. ???
      </div>
      <p className="mt-2 text-[11px] leading-snug text-white/70">{hint ?? "Остров под водой"}</p>
      <div className="mt-2 text-lg opacity-60" aria-hidden>
        🌊
      </div>
    </div>
  );
}

function RouteIslandCard({ item, order }: { item: RouteIslandItem; order: number }) {
  const { island, status, skillLevel, stationsCompleted } = item;

  return (
    <>
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-bold text-gray-600">
          {order}
        </span>
        {status === "completed" ? (
          <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
            ✓ освоен
          </span>
        ) : status === "current" ? (
          <span className="rounded-full bg-brand-purple px-2 py-0.5 text-[10px] font-semibold text-white">
            сейчас
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-4xl drop-shadow-sm">{island.emoji}</span>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold leading-tight text-gray-800">{island.title}</h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-gray-600">{island.superpower}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <SkillFires level={skillLevel} size="sm" />
        {stationsCompleted > 0 ? (
          <span className="text-[10px] text-gray-500">станция {stationsCompleted}/7</span>
        ) : null}
      </div>
    </>
  );
}
