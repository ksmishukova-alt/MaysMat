"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { TopicCardIllustration } from "@/components/TopicCardIllustration";
import {
  getTopicCards,
  TOPIC_FILTERS,
  type TopicCardModel,
  type TopicFilterId,
} from "@/data/topic-map-display";
import type { UserProgress } from "@/lib/progress";

interface TopicMapSectionProps {
  progress: UserProgress;
  /** Скрыть табы фильтров (главная) */
  hideFilters?: boolean;
}

export function TopicMapSection({ progress, hideFilters }: TopicMapSectionProps) {
  const [filter, setFilter] = useState<TopicFilterId>("all");

  const cards = useMemo(
    () => getTopicCards(hideFilters ? "all" : filter, progress),
    [filter, progress, hideFilters]
  );

  const handleFilter = useCallback((id: TopicFilterId) => {
    setFilter(id);
  }, []);

  const activeFilter = TOPIC_FILTERS.find((f) => f.id === (hideFilters ? "all" : filter));

  return (
    <div className="rounded-card bg-white p-5 shadow-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold">Карта тем</h2>
      </div>

      {!hideFilters ? (
        <div
          className="mb-2 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Фильтр типов мышления"
        >
          {TOPIC_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => handleFilter(f.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filter === f.id
                  ? "bg-brand-purple text-white shadow-md shadow-brand-purple/25"
                  : "bg-lavender-100 text-gray-600 hover:bg-lavender-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      ) : null}

      <p className="mb-4 text-xs text-gray-400">
        {activeFilter?.label}: {cards.length}{" "}
        {cards.length === 1 ? "тема" : cards.length < 5 ? "темы" : "тем"}
      </p>

      <div
        key={hideFilters ? "all" : filter}
        role="tabpanel"
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
      >
        {cards.map((card) => (
          <TopicCard key={card.branch.id} card={card} />
        ))}
      </div>

      {cards.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">Темы скоро появятся</p>
      ) : null}
    </div>
  );
}

function StatusBadge({ card }: { card: TopicCardModel }) {
  if (card.locked) {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-sm shadow-sm">
        🔒
      </span>
    );
  }
  if (card.progress >= 100) {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs text-white shadow-sm">
        ✓
      </span>
    );
  }
  if (card.progress > 0) {
    return <span className="h-3 w-3 rounded-full bg-gray-300 shadow-inner" aria-hidden />;
  }
  return null;
}

function StarRating({ stars, locked }: { stars: number; locked: boolean }) {
  return (
    <span className="flex gap-0.5 text-sm leading-none">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={
            !locked && i < stars ? "text-amber-400 drop-shadow-sm" : "text-gray-300"
          }
        >
          ★
        </span>
      ))}
    </span>
  );
}

function TopicCard({ card }: { card: TopicCardModel }) {
  const inner = (
    <article
      className={`group relative flex aspect-[4/5] flex-col overflow-hidden rounded-2xl bg-gradient-to-b shadow-md transition duration-200 ${card.cardBg} ${
        card.locked
          ? "cursor-default opacity-70"
          : "cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-200/60"
      } ${card.isActive && !card.locked ? "ring-2 ring-brand-purple/40 ring-offset-2" : ""}`}
    >
      <div className="absolute right-2 top-2 z-10">
        <StatusBadge card={card} />
      </div>

      <div className="flex min-h-[118px] flex-1 items-end justify-center px-1 pb-0 pt-2 sm:min-h-[132px]">
        <TopicCardIllustration
          branchId={card.branch.id}
          imageSrc={card.imageSrc}
          title={card.branch.title}
          locked={card.locked}
        />
      </div>

      <h3 className="px-2 pb-2 text-center text-[13px] font-bold leading-tight text-gray-800 sm:text-sm">
        {card.branch.title}
      </h3>

      <div className="flex items-center justify-between px-3 pb-3 pt-1">
        {card.locked ? (
          <span className="text-[11px] font-medium text-gray-400">Скоро</span>
        ) : (
          <span className="text-xs font-semibold text-gray-600">{card.progress}%</span>
        )}
        <StarRating stars={card.stars} locked={card.locked} />
      </div>
    </article>
  );

  if (card.href && !card.locked) {
    return (
      <Link href={card.href} className="block outline-none">
        {inner}
      </Link>
    );
  }

  return inner;
}
