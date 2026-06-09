import { ENTRY_DIAGNOSTIC_MINI_GAMES, ALL_MINI_GAME_IDS } from "@/data/entry-diagnostic/mini-games/index";
import {
  assertMiniGameSpecsComplete,
  getMiniGameSpec,
} from "@/data/entry-diagnostic/mini-games/specs";

/** QA без импорта React mini-game компонентов */
export function assertMiniGameRegistryComplete(): void {
  assertMiniGameSpecsComplete(ENTRY_DIAGNOSTIC_MINI_GAMES);
  for (const c of ENTRY_DIAGNOSTIC_MINI_GAMES) {
    if (!getMiniGameSpec(c.miniGameId)) {
      throw new Error(`Mini-game spec missing: ${c.miniGameId}`);
    }
  }
  if (ENTRY_DIAGNOSTIC_MINI_GAMES.length !== ALL_MINI_GAME_IDS.length) {
    throw new Error("Mini-game config count mismatch");
  }
}
