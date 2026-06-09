import { ALL_RUNNER_KINDS } from "@/data/entry-diagnostic/blocks/index";
import type { RunnerKind } from "@/data/entry-diagnostic/types";

const REGISTERED_BOARD_KINDS: RunnerKind[] = [...ALL_RUNNER_KINDS];

export function assertRunnerBoardRegistryComplete(): void {
  for (const kind of ALL_RUNNER_KINDS) {
    if (!REGISTERED_BOARD_KINDS.includes(kind)) {
      throw new Error(`Runner board missing: ${kind}`);
    }
  }
  if (REGISTERED_BOARD_KINDS.length !== ALL_RUNNER_KINDS.length) {
    throw new Error("Runner board registry has extra entries");
  }
}
