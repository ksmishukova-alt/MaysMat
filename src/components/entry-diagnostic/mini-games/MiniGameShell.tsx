"use client";

import type { ReactNode } from "react";
import type { MiniGameConfig, MiniGameMode } from "@/data/entry-diagnostic/types";

export function MiniGameShell({
  config,
  mode,
  timeLeft,
  round,
  totalRounds,
  children,
  footer,
}: {
  config: MiniGameConfig;
  mode: MiniGameMode;
  timeLeft: number;
  round: number;
  totalRounds: number;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div data-testid="diagnostic-minigame" data-mode={mode} data-game={config.miniGameId}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">{config.title}</h3>
        <span className="text-sm text-gray-500">
          {mode === "diagnostic" ? `⏱ ${timeLeft} с` : `Раунд ${round + 1}/${totalRounds}`}
        </span>
      </div>
      {mode === "diagnostic" ? (
        <p className="text-xs text-amber-700">Режим диагностики: без подсказок по ходу игры.</p>
      ) : null}
      <div className="mt-4">{children}</div>
      {footer}
    </div>
  );
}
