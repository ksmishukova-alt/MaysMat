import type { PublishTier, QaIssue, QaStatus, TaskPublishingMeta, VisualStatus } from "./types";

/** Первая волна детского маршрута: «Головы и ноги» (28 задач, этапы 1–4) */
export const HEADS_LEGS_CHILD_ROUTE_MAX_NUMBER = 28;

/** Базовый Дирихле — OK / исправленные задачи первой волны (methodTaskId → routeOrder) */
export const DIRICHLET_CHILD_ROUTE: Record<string, number> = {
  "M0.1": 1,
  "M0.2": 2,
  "M1.3": 3,
  "M2.1": 4,
  "M2.4": 5,
  "M1.5": 6,
  "M2.6": 7,
  "M2.2": 8,
  "M3.2": 9,
};

/** P0 — блокеры: visual без ассета */
export const DIRICHLET_P0_METHOD_IDS = new Set([
  "M5.27",
  "M5.46",
  "M5.47",
  "M5.48",
]);

/** Тема T9 — олимпиадный архив */
export const DIRICHLET_ARCHIVE_THEME = "T9_CONSTRUCTIONS";

/** Ручные правки условий (аудит P0) */
export const CONDITION_PATCHES: Record<string, string> = {
  "M5.15":
    "В прямоугольнике 3×4 расположено 6 точек. Докажите, что среди них найдутся две точки, расстояние между которыми не превосходит √2.",
};

/** Ручные эталоны вместо мусора / «см. задачу» */
export const ANSWER_REFERENCE_PATCHES: Record<string, string> = {
  "M5.32":
    "Ответ: нельзя. Ключ: у скобки «П» три единичных отрезка — на каждом из 12 рёбер каркаса куба 2×2×2 нужны оба конца, но у одной детали только два конца; проволочный каркас из таких скобок невозможен.",
  "M5.15":
    "Ключ: разрежем прямоугольник на 5 частей (как на схеме). В одной части — минимум 2 точки; в каждой части любые две точки не дальше √2.",
};

export type ManualPublishingOverride = Partial<TaskPublishingMeta> & {
  publishTier?: PublishTier;
  qaStatus?: QaStatus;
  forceIssues?: QaIssue[];
  clearIssues?: QaIssue[];
  requiresVisual?: boolean;
  visualStatus?: VisualStatus;
};

/** Явные override после ручной доработки P0 */
export const MANUAL_PUBLISHING: Record<string, ManualPublishingOverride> = {
  "heads-legs-1-01": { publishTier: "childRoute", qaStatus: "ready", routeOrder: 1 },
  "dirichlet-t1-01": { publishTier: "childRoute", qaStatus: "ready", routeOrder: 101 },
  "dirichlet-t1-02": { publishTier: "childRoute", qaStatus: "ready", routeOrder: 102 },
  "dirichlet-t1-06": { publishTier: "childRoute", qaStatus: "ready", routeOrder: 103 },
  "dirichlet-t1-09": { publishTier: "childRoute", qaStatus: "ready", routeOrder: 104 },
  "dirichlet-t1-12": { publishTier: "childRoute", qaStatus: "ready", routeOrder: 105 },
  "dirichlet-t1-13": { publishTier: "childRoute", qaStatus: "ready", routeOrder: 106 },
  "dirichlet-t1-15": { publishTier: "childRoute", qaStatus: "ready", routeOrder: 107 },
  "dirichlet-t2-02": { publishTier: "childRoute", qaStatus: "ready", routeOrder: 108 },
  "dirichlet-t1-10": { publishTier: "childRoute", qaStatus: "ready", routeOrder: 109, clearIssues: ["contains_N_equals_N"] },
  "dirichlet-t4-14": { publishTier: "methodistOnly", qaStatus: "ready", clearIssues: ["incomplete_condition"] },
  "dirichlet-t4-31": { publishTier: "methodistOnly", qaStatus: "ready", clearIssues: ["contains_external_reference", "missing_answer_key"] },
  "dirichlet-t4-26": { publishTier: "hidden", qaStatus: "blocked", requiresVisual: true, visualStatus: "missing", forceIssues: ["missing_visual_asset"] },
  "dirichlet-t4-45": { publishTier: "hidden", qaStatus: "blocked", requiresVisual: true, visualStatus: "missing", forceIssues: ["missing_visual_asset"] },
  "dirichlet-t4-46": { publishTier: "hidden", qaStatus: "blocked", requiresVisual: true, visualStatus: "missing", forceIssues: ["missing_visual_asset"] },
  "dirichlet-t4-47": { publishTier: "hidden", qaStatus: "blocked", requiresVisual: true, visualStatus: "missing", forceIssues: ["missing_visual_asset"] },
};
