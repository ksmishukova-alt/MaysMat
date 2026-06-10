import type { CarPathStep, CarPose } from "./parkomat-paths";

export function poseFromStep(step: CarPathStep): CarPose {
  return { x: step.x, y: step.y, rotate: step.rotate };
}

export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = window.setTimeout(resolve, ms);
    const onAbort = () => {
      window.clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

/** Пошаговая анимация по waypoints */
export async function runCarPathSteps(
  steps: CarPathStep[],
  startIndex: number,
  onStep: (step: CarPathStep, index: number) => void,
  signal?: AbortSignal,
): Promise<number> {
  let index = startIndex;
  for (; index < steps.length; index++) {
    if (signal?.aborted) break;
    const step = steps[index]!;
    onStep(step, index);
    if (step.durationMs <= 0) continue;
    try {
      await sleep(step.durationMs, signal);
    } catch {
      break;
    }
  }
  return index;
}
