"use client";

import Image from "next/image";
import type { MiniGameDiagnosticRules } from "@/data/entry-diagnostic/minigame-diagnostic-rules";

export function DiagnosticMiniGameRulesScreen({
  rules,
  onStart,
}: {
  rules: MiniGameDiagnosticRules;
  onStart: () => void;
}) {
  return (
    <div
      data-testid="diagnostic-minigame-rules"
      className="relative overflow-hidden rounded-2xl border-2 border-purple-200 bg-gradient-to-b from-purple-50/80 to-white p-6 shadow-card sm:p-8"
    >
      <div className="pointer-events-none absolute -right-2 top-2 opacity-95" aria-hidden>
        <Image
          src="/entry-diagnostic/pojmat/myshmat.png"
          alt=""
          width={96}
          height={96}
          className="drop-shadow-md"
        />
      </div>
      <h2 className="text-xl font-bold text-gray-900">{rules.title}</h2>
      <div className="mt-4 max-w-lg space-y-2 text-sm leading-relaxed text-gray-700 sm:text-base">
        {rules.paragraphs.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <button
        type="button"
        data-testid="diagnostic-minigame-rules-start"
        onClick={onStart}
        className="mt-8 min-h-12 rounded-2xl bg-brand-purple px-8 py-3 text-sm font-semibold text-white shadow-sm"
      >
        Понятно, играть!
      </button>
    </div>
  );
}
