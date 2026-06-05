import type { SolutionMode } from "@/data/heads-legs/solution-modes";

import type { DirichletTaskMeta } from "../types";

/** Уровень опоры из config: L1…L4 (+ L5 как полная самостоятельность) */
export type DirichletSupportLevel = 1 | 2 | 3 | 4 | 5;

export function parseSupportLevel(supportMode: string): DirichletSupportLevel {
  const m = supportMode.match(/^L(\d)/i);
  if (!m) return 3;
  const n = Number(m[1]);
  if (n >= 5) return 5;
  if (n >= 4) return 4;
  if (n >= 3) return 3;
  if (n >= 2) return 2;
  return 1;
}

/** Самостоятельность задачи (1–5) — из support_mode, не только из difficulty */
export function resolveIndependenceLevel(meta: DirichletTaskMeta): 1 | 2 | 3 | 4 | 5 {
  const L = parseSupportLevel(meta.supportMode);
  if (L >= 5) return 5;
  return L;
}

export interface WrittenPhasePlan {
  /** Расставить план доказательства (order_questions) */
  includeProofOrder: boolean;
  /** Сборка строк из карточек (proof_lines, режим A) */
  includeProofLines: boolean;
  /** Экран «Запиши решение словами» */
  includeWordSolution: boolean;
  wordSolutionMode: SolutionMode | null;
  /** Передавать solutionLines в word_solution */
  wordSolutionUseLines: boolean;
}

/**
 * Фаза записи по методичке:
 * L1 — только карточки (A), без отдельного порядка и без свободного текста
 * L2 — пропуски в готовом каркасе (B)
 * L3 — план + пропуски
 * L4 — самостоятельная запись по чек-листу (C)
 * L5 — полная самостоятельная запись (C)
 */
export function resolveWrittenPhase(meta: DirichletTaskMeta): WrittenPhasePlan {
  const L = parseSupportLevel(meta.supportMode);
  const mode = meta.solutionMode;
  const hasLines = meta.solutionLines.length > 0;

  if (L === 1) {
    return {
      includeProofOrder: false,
      includeProofLines: mode === "A" && hasLines,
      includeWordSolution: false,
      wordSolutionMode: null,
      wordSolutionUseLines: false,
    };
  }

  if (L === 2) {
    return {
      includeProofOrder: false,
      includeProofLines: false,
      includeWordSolution: true,
      wordSolutionMode: mode === "C" ? "C" : "B",
      wordSolutionUseLines: hasLines && mode !== "C",
    };
  }

  if (L === 3) {
    return {
      includeProofOrder: hasLines,
      includeProofLines: false,
      includeWordSolution: true,
      wordSolutionMode: mode === "A" ? "B" : mode,
      wordSolutionUseLines: hasLines && mode !== "C",
    };
  }

  if (L === 4) {
    return {
      includeProofOrder: hasLines,
      includeProofLines: false,
      includeWordSolution: true,
      wordSolutionMode: "C",
      wordSolutionUseLines: false,
    };
  }

  return {
    includeProofOrder: false,
    includeProofLines: false,
    includeWordSolution: true,
    wordSolutionMode: "C",
    wordSolutionUseLines: false,
  };
}

export function writtenPhaseTitle(plan: WrittenPhasePlan): string {
  if (plan.includeProofLines) return "Собери доказательство из карточек";
  if (plan.wordSolutionMode === "B") return "Дополни пропуски в решении";
  if (plan.wordSolutionMode === "C") return "Запиши решение словами";
  return "Запись решения";
}

export function writtenPhaseHint(plan: WrittenPhasePlan): string {
  if (plan.includeProofLines) {
    return "Заполни пропуски карточками — готовый текст доказательства сложится сам.";
  }
  if (plan.wordSolutionMode === "B") {
    return "Вставь числа и слова в пропуски — порядок строк уже задан.";
  }
  if (plan.wordSolutionMode === "C") {
    return "Запиши доказательство своими словами. Проверим ключевые шаги, не дословное совпадение.";
  }
  return "";
}

/** Теоретический intro — только с L3, на L1–L2 сразу к действиям */
export function includeIntroStep(meta: DirichletTaskMeta): boolean {
  return parseSupportLevel(meta.supportMode) >= 3;
}
