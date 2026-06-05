import type { DiscriminatedTaskStep } from "@/data/task-steps";
import { buildSteps31 } from "./steps-3-1";
import { buildSteps32 } from "./steps-3-2";
import { buildSteps35Secondary } from "./steps-3-5";
import { buildSteps37 } from "./steps-3-7";
import { buildSteps61 } from "./steps-6-1";
import { buildSteps62 } from "./steps-6-2";
import { buildSteps63 } from "./steps-6-3";
import { buildSteps64 } from "./steps-6-4";
import { buildSteps65 } from "./steps-6-5";
import { buildSteps74 } from "./steps-7-4";
import { buildSteps76 } from "./steps-7-6";

type CustomPlacement = "replace-worksheets" | "after-worksheets";

const REPLACE: Record<string, (taskId: string) => DiscriminatedTaskStep[]> = {
  "3.1": buildSteps31,
  "3.2": buildSteps32,
  "3.7": buildSteps37,
  "6.1": buildSteps61,
  "6.2": buildSteps62,
  "6.3": buildSteps63,
  "6.4": buildSteps64,
  "6.5": buildSteps65,
  "7.4": buildSteps74,
  "7.6": buildSteps76,
};

const AFTER: Record<string, (taskId: string) => DiscriminatedTaskStep[]> = {
  "3.5": buildSteps35Secondary,
};

export function hasCustomMiddleSteps(methodTaskId: string): boolean {
  return methodTaskId in REPLACE;
}

export function hasCustomTailSteps(methodTaskId: string): boolean {
  return methodTaskId in AFTER;
}

export function buildCustomMiddleSteps(
  methodTaskId: string,
  taskId: string,
): DiscriminatedTaskStep[] | null {
  const fn = REPLACE[methodTaskId];
  return fn ? fn(taskId) : null;
}

export function buildCustomTailSteps(
  methodTaskId: string,
  taskId: string,
): DiscriminatedTaskStep[] | null {
  const fn = AFTER[methodTaskId];
  return fn ? fn(taskId) : null;
}

export function customPlacement(methodTaskId: string): CustomPlacement | null {
  if (methodTaskId in REPLACE) return "replace-worksheets";
  return null;
}

/** Задачи со своим выбором объектов — без generic drag_select */
export function skipsDefaultParticipant(methodTaskId: string): boolean {
  return (
    methodTaskId === "6.1" ||
    methodTaskId === "6.2" ||
    methodTaskId === "6.3" ||
    methodTaskId === "6.4" ||
    methodTaskId === "6.5" ||
    methodTaskId === "7.4" ||
    methodTaskId === "7.6"
  );
}
