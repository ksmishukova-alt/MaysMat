import type { DiscriminatedTaskStep } from "@/data/task-steps";
import type { HeadsLegsTaskMeta } from "../types";
import { buildGuidedSteps } from "./build-guided-steps";

/** @deprecated используйте buildGuidedSteps — сценарий 1.01 унифицирован */
export function buildGuidedSteps101(meta: HeadsLegsTaskMeta): DiscriminatedTaskStep[] {
  return buildGuidedSteps(meta);
}
