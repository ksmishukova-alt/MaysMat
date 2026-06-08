import { ENTRY_DIAGNOSTIC_BLOCKS, ENTRY_DIAGNOSTIC_MAX_SCORE } from "./blocks/index";
import type {
  BlockScore,
  DiagnosticReport,
  MiniGameAttemptRecord,
  TaskAttemptRecord,
} from "./types";

export function scoreTaskAttempt(weight: 1 | 2 | 3, correct: boolean): number {
  return correct ? weight : 0;
}

export function scoreBlock(taskAttempts: TaskAttemptRecord[], blockId: string): number {
  return taskAttempts.filter((a) => a.blockId === blockId).reduce((s, a) => s + a.score, 0);
}

export function routeRecommendationForBlockScore(score: number): string {
  if (score <= 1) return "полный обучающий маршрут";
  if (score <= 3) return "базовый короткий блок";
  if (score <= 5) return "тренировка на перенос";
  return "пропустить обучение, challenge позже";
}

export function buildDiagnosticReport(
  attemptId: string,
  taskAttempts: TaskAttemptRecord[],
  miniGameAttempts: MiniGameAttemptRecord[],
): DiagnosticReport {
  const scoreByBlock: BlockScore[] = ENTRY_DIAGNOSTIC_BLOCKS.map((block) => {
    const score = scoreBlock(taskAttempts, block.blockId);
    return {
      blockId: block.blockId,
      title: block.title,
      score,
      maxScore: 6,
      skill: block.skill,
    };
  });

  const totalScore = scoreByBlock.reduce((s, b) => s + b.score, 0);

  const accuracyBySkill: Record<string, number> = {};
  for (const block of ENTRY_DIAGNOSTIC_BLOCKS) {
    const attempts = taskAttempts.filter((a) => a.blockId === block.blockId);
    const earned = attempts.reduce((s, a) => s + a.score, 0);
    accuracyBySkill[block.skill] = Math.round((earned / block.maxScore) * 100);
  }

  const errorClusters: Record<string, number> = {};
  for (const a of taskAttempts) {
    for (const e of a.errorTypes) {
      errorClusters[e] = (errorClusters[e] ?? 0) + 1;
    }
    for (const e of a.computationErrors) {
      errorClusters[e] = (errorClusters[e] ?? 0) + 1;
    }
    for (const e of a.orderErrors) {
      errorClusters[e] = (errorClusters[e] ?? 0) + 1;
    }
    for (const e of a.readingErrors) {
      errorClusters[e] = (errorClusters[e] ?? 0) + 1;
    }
    for (const e of a.dataErrors) {
      errorClusters[e] = (errorClusters[e] ?? 0) + 1;
    }
    for (const e of a.unitErrors) {
      errorClusters[e] = (errorClusters[e] ?? 0) + 1;
    }
  }
  for (const m of miniGameAttempts) {
    if (m.motorErrors) errorClusters["mini_motor"] = (errorClusters["mini_motor"] ?? 0) + m.motorErrors;
    if (m.semanticErrors) errorClusters["mini_semantic"] = (errorClusters["mini_semantic"] ?? 0) + m.semanticErrors;
  }

  const strengths = scoreByBlock
    .filter((b) => b.score >= 5)
    .map((b) => `${b.title} (${b.score}/6)`);

  const risks = scoreByBlock
    .filter((b) => b.score <= 2)
    .map((b) => `${b.title} (${b.score}/6) — ${routeRecommendationForBlockScore(b.score)}`);

  const routeRecommendations = scoreByBlock.map(
    (b) => `${b.title}: ${routeRecommendationForBlockScore(b.score)}`,
  );

  return {
    attemptId,
    totalScore,
    maxTotalScore: ENTRY_DIAGNOSTIC_MAX_SCORE,
    scoreByBlock,
    accuracyBySkill,
    errorClusters,
    strengths,
    risks,
    routeRecommendations,
    miniGameMetrics: miniGameAttempts,
  };
}

export function assertMaxScoreInvariant(): void {
  const max = ENTRY_DIAGNOSTIC_BLOCKS.reduce((s, b) => s + b.maxScore, 0);
  if (max !== ENTRY_DIAGNOSTIC_MAX_SCORE) {
    throw new Error(`Expected max score ${ENTRY_DIAGNOSTIC_MAX_SCORE}, got ${max}`);
  }
}
