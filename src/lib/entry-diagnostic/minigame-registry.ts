"use client";

import type { ComponentType } from "react";
import type { MiniGameConfig } from "@/data/entry-diagnostic/types";
import { ENTRY_DIAGNOSTIC_MINI_GAMES } from "@/data/entry-diagnostic/mini-games/index";
import {
  assertMiniGameSpecsComplete,
  getMiniGameSpec,
} from "@/data/entry-diagnostic/mini-games/specs";
import {
  ALL_MINI_GAME_COMPONENTS,
} from "@/components/entry-diagnostic/mini-games/index";
import type { DiagnosticMiniGameProps } from "@/components/entry-diagnostic/mini-games/types";

export type MiniGameComponent = ComponentType<DiagnosticMiniGameProps>;

export const MINI_GAME_REGISTRY: Record<string, MiniGameComponent> = {
  ...ALL_MINI_GAME_COMPONENTS,
};

export function getMiniGameComponent(id: string): MiniGameComponent | undefined {
  return MINI_GAME_REGISTRY[id];
}

export function assertMiniGameRegistryComplete(): void {
  assertMiniGameSpecsComplete(ENTRY_DIAGNOSTIC_MINI_GAMES);
  for (const c of ENTRY_DIAGNOSTIC_MINI_GAMES) {
    if (!MINI_GAME_REGISTRY[c.miniGameId]) {
      throw new Error(`Mini-game registry missing: ${c.miniGameId}`);
    }
    if (!getMiniGameSpec(c.miniGameId)) {
      throw new Error(`Mini-game spec missing: ${c.miniGameId}`);
    }
    const comp = MINI_GAME_REGISTRY[c.miniGameId];
    if (!comp.displayName?.startsWith("MiniGame_")) {
      throw new Error(`Mini-game ${c.miniGameId} must be a registered component`);
    }
  }
  const uniqueNames = new Set(Object.values(MINI_GAME_REGISTRY).map((c) => c.displayName));
  if (uniqueNames.size !== ENTRY_DIAGNOSTIC_MINI_GAMES.length) {
    throw new Error("Mini-game registry components must be unique");
  }
}

export function getMiniGameConfig(id: string): MiniGameConfig | undefined {
  return ENTRY_DIAGNOSTIC_MINI_GAMES.find((g) => g.miniGameId === id);
}
