"use client";

import { useEffect, useMemo, useState } from "react";
import type { SolutionLine } from "@/data/heads-legs/types";
import { buildBlankChipPool, shuffleIds } from "@/lib/word-solution-mode-a";

interface WordSolutionFillBlanksProps {
  stepId?: string;
  lines: SolutionLine[];
  blanks: Record<string, string>;
  onBlanksChange: (next: Record<string, string>) => void;
}

export function WordSolutionFillBlanks({
  stepId,
  lines,
  blanks,
  onBlanksChange,
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

  const usedValues = new Set(Object.values(blanks).map((v) => v.trim()).filter(Boolean));

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
            <button
              key={blank.id}
              type="button"
              onClick={() => setActiveBlankId(blank.id)}
              className={`mx-0.5 inline-flex min-h-[2.25rem] items-center rounded-lg border-2 px-2 align-middle transition ${
                isActive
                  ? "border-brand-purple bg-lavender-100 ring-2 ring-brand-purple/30"
                  : filled
                    ? "border-brand-purple/40 bg-lavender-50"
                    : "border-dashed border-lavender-300 bg-white hover:border-brand-purple/50"
              } ${wide ? "min-w-[10rem]" : "min-w-[4rem]"}`}
              aria-label={`Пропуск ${li + 1}`}
            >
              {filled || (
                <span className="text-sm text-gray-400">{blank.placeholder ?? "…"}</span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const nextEmpty = allBlanks.find((b) => !blanks[b.id]?.trim());

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-600">
        Заполни пропуски: нажми на <strong>___</strong> в тексте, затем на карточку с числом или словом.
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
              const used = usedValues.has(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  disabled={used && blanks[activeBlankId ?? ""]?.trim() !== chip}
                  onClick={() => {
                    const target = activeBlankId ?? nextEmpty?.id;
                    if (target) placeChip(target, chip);
                  }}
                  className={`rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition ${
                    used
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
