"use client";

import Link from "next/link";
import { ProgressBar } from "@/components/ProgressBar";
import type { AdventureMapItem } from "@/lib/adventure-map";

/** Лёгкое «плавание» островов на карте */
const ISLAND_OFFSETS = [
  "translate-y-0",
  "-translate-y-2",
  "translate-y-1",
  "-translate-y-1",
  "translate-y-2",
  "-translate-y-3",
  "translate-y-0",
];

interface AdventureIslandMapProps {
  items: AdventureMapItem[];
}

export function AdventureIslandMap({ items }: AdventureIslandMapProps) {
  return (
    <div className="relative overflow-hidden rounded-card bg-gradient-to-b from-sky-200 via-sky-100 to-teal-200 p-6 shadow-card md:p-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.5) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 0%, transparent 45%)",
        }}
      />
      <div className="relative grid gap-6 lg:grid-cols-2">
        {items.map((item, index) => (
          <IslandCard key={item.adventure.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

function IslandCard({ item, index }: { item: AdventureMapItem; index: number }) {
  const { adventure, branches, progress, locked, primaryHref } = item;
  const floatClass = ISLAND_OFFSETS[index % ISLAND_OFFSETS.length];

  return (
    <article
      className={`relative transition duration-300 hover:z-10 ${floatClass} ${
        locked ? "opacity-75" : "hover:-translate-y-1"
      }`}
    >
      <div
        className={`rounded-3xl border-2 bg-gradient-to-b p-5 shadow-lg ${
          locked
            ? "border-white/40 from-slate-100 to-slate-200"
            : "border-white/80 from-amber-50 via-white to-emerald-50 shadow-teal-900/10"
        }`}
      >
        <div className="mb-4 flex items-start gap-4">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-4xl shadow-inner ${
              locked ? "bg-gray-200/80" : "bg-white/90"
            }`}
          >
            {locked ? "🔒" : adventure.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-800">{adventure.title}</h2>
            {adventure.tagline ? (
              <p className="mt-1 text-sm text-gray-600">{adventure.tagline}</p>
            ) : null}
            {locked ? (
              <p className="mt-2 text-xs font-medium text-gray-500">Скоро откроется</p>
            ) : (
              <div className="mt-3 max-w-xs">
                <ProgressBar value={progress} label="Прогресс острова" />
              </div>
            )}
          </div>
          {!locked && primaryHref ? (
            <Link
              href={primaryHref}
              className="shrink-0 rounded-xl bg-brand-purple px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
            >
              Войти →
            </Link>
          ) : null}
        </div>

        {!locked && branches.length > 0 ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {branches.map(({ branch, progress: bp, href, locked: branchLocked }) => (
              <li key={branch.id}>
                {href && !branchLocked ? (
                  <Link
                    href={href}
                    className="flex items-center justify-between rounded-xl border border-white/60 bg-white/70 px-3 py-2.5 text-sm transition hover:border-brand-purple/30 hover:bg-white"
                  >
                    <span className="font-medium text-gray-800">{branch.title}</span>
                    <span className="text-xs text-gray-500">{bp}%</span>
                  </Link>
                ) : (
                  <div className="flex items-center justify-between rounded-xl border border-dashed border-gray-300/80 bg-white/40 px-3 py-2.5 text-sm text-gray-400">
                    <span>{branch.title}</span>
                    <span className="text-xs">скоро</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
