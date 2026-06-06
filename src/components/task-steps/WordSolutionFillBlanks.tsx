"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import type { SolutionLine } from "@/data/heads-legs/types";
import {
  buildBlankChipPool,
  shuffleIds,
  type FillBlankCardMode,
} from "@/lib/word-solution-mode-a";

interface WordSolutionFillBlanksProps {
  stepId?: string;
  lines: SolutionLine[];
  blanks: Record<string, string>;
  onBlanksChange: (next: Record<string, string>) => void;
  /** singleUse — карточка исчезает после вставки; reusable — можно использовать повторно */
  cardMode?: FillBlankCardMode;
}

export function WordSolutionFillBlanks({
  stepId,
  lines,
  blanks,
  onBlanksChange,
  cardMode = "singleUse",
}: WordSolutionFillBlanksProps) {
  const allBlanks = useMemo(() => lines.flatMap((l) => l.blanks), [lines]);
  const [chips, setChips] = useState<string[]>(() => buildBlankChipPool(lines));
  const [activeBlankId, setActiveBlankId] = useState<string | null>(null);

  useEffect(() => {
    setChips(shuffleIds(buildBlankChipPool(lines)));
    setActiveBlankId(null);
  }, [stepId, lines]);

  const placeChip = (blankId: string, value: string) => {
    onBlanksChange({ ...blanks, [blankId]: value });
    setActiveBlankId(null);
  };

  const clearBlank = (blankId: string, e?: MouseEvent) => {
    e?.stopPropagation();
    const next = { ...blanks };
    delete next[blankId];
    onBlanksChange(next);
    setActiveBlankId(blankId);
  };

  /** Для singleUse: сколько раз значение уже занято в пропусках */
  const usageCount = (chip: string) =>
    Object.values(blanks).filter((v) => v.trim() === chip).length;

  const isChipAvailable = (chip: string) => {
    if (cardMode === "reusable") return true;
    return usageCount(chip) < 1;
  };

  const renderLine = (line: SolutionLine, li: number) => {
    let bi = 0;
    return (
      <div
        key={li}
        className="rounded-xl border border-lavender-100 bg-gray-50 px-4 py-3 text-base leading-relaxed"
      >
        <span className="mr-2 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-purple/10 text-xs font-bold text-brand-purple">
          {li + 1}
        </span>
        {line.template.split(/(\[[^\]]*\])/).map((part, pi) => {
          const m = part.match(/^\[(.*)\]$/);
          if (!m) return <span key={pi}>{part}</span>;
          const blank = line.blanks[bi++];
          if (!blank) return <span key={pi}>{part}</span>;
          const filled = blanks[blank.id]?.trim() ?? "";
          const isActive = activeBlankId === blank.id;
          const wide = blank.type === "expression" || blank.type === "conclusion";
          return (
            <span key={blank.id} className="mx-0.5 inline-flex align-middle">
              <button
                type="button"
                onClick={() => setActiveBlankId(isActive ? null : blank.id)}
                className={`inline-flex min-h-[2.25rem] items-center rounded-lg border-2 px-2 transition ${
                  isActive
                    ? "border-brand-purple bg-lavender-100 ring-2 ring-brand-purple/30"
                    : filled
                      ? "border-brand-purple/40 bg-lavender-50"
                      : "border-dashed border-lavender-300 bg-white hover:border-brand-purple/50"
                } ${wide ? "min-w-[10rem]" : "min-w-[4rem]"}`}
                aria-label={`Пропуск ${li + 1}`}
              >
                {filled ? (
                  <span className="flex items-center gap-1 font-medium text-gray-900">
                    {filled}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">{blank.placeholder ?? "…"}</span>
                )}
              </button>
              {filled ? (
                <button
                  type="button"
                  onClick={(e) => clearBlank(blank.id, e)}
                  className="ml-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
                  aria-label="Очистить пропуск"
                  title="Убрать"
                >
                  ×
                </button>
              ) : null}
            </span>
          );
        })}
      </div>
    );
  };

  const nextEmpty = allBlanks.find((b) => !blanks[b.id]?.trim());

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-600">
        Заполни пропуски: нажми на <strong>___</strong> в тексте, затем на карточку. Чтобы убрать
        значение — нажми <strong>×</strong>.
      </p>

      {chips.length > 0 ? (
        <div className="sticky top-2 z-10 rounded-xl border border-lavender-200 bg-white p-4 shadow-card">
          <p className="mb-3 text-sm font-medium text-brand-purple">
            Карточки для вставки
            {activeBlankId ? (
              <span className="ml-2 font-normal text-gray-500">— выбран пропуск, нажми карточку</span>
            ) : nextEmpty ? (
              <span className="ml-2 font-normal text-gray-500">— сначала нажми пропуск в тексте ниже</span>
            ) : null}
          </p>
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => {
              const available = isChipAvailable(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  disabled={!available && blanks[activeBlankId ?? ""]?.trim() !== chip}
                  onClick={() => {
                    const target = activeBlankId ?? nextEmpty?.id;
                    if (target) placeChip(target, chip);
                  }}
                  className={`rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition ${
                    !available && cardMode === "singleUse"
                      ? "border-gray-100 bg-gray-50 text-gray-300"
                      : activeBlankId || nextEmpty
                        ? "border-lavender-200 bg-lavender-50 hover:border-brand-purple hover:bg-lavender-100"
                        : "border-lavender-200 bg-white text-gray-600"
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="space-y-3">{lines.map((line, i) => renderLine(line, i))}</div>
    </div>
  );
}
