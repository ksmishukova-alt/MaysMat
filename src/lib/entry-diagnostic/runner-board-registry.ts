import { ALL_RUNNER_KINDS } from "@/data/entry-diagnostic/blocks/index";
import { RUNNER_BOARD_REGISTRY } from "@/components/entry-diagnostic/runners/boards";

export function assertRunnerBoardRegistryComplete(): void {
  for (const kind of ALL_RUNNER_KINDS) {
    if (!RUNNER_BOARD_REGISTRY[kind]) {
      throw new Error(`Runner board missing: ${kind}`);
    }
  }
}
