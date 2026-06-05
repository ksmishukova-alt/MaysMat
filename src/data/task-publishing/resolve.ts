import type { DiscriminatedTaskStep } from "@/data/task-steps";
import type { AcceptedAnswer } from "@/data/heads-legs/types";
import type { Task } from "@/data/tasks";

import {
  ANSWER_REFERENCE_PATCHES,
  CONDITION_PATCHES,
  DIRICHLET_ARCHIVE_THEME,
  DIRICHLET_CHILD_ROUTE,
  DIRICHLET_P0_METHOD_IDS,
  HEADS_LEGS_CHILD_ROUTE_MAX_NUMBER,
  MANUAL_PUBLISHING,
  type ManualPublishingOverride,
} from "./config";
import type { QaIssue, TaskPublishingMeta, VisualStatus } from "./types";

const EXTERNAL_REF_RE = /см\.\s*задач|см\.\s*решение|задача\s*#\d|задача\s*1#/i;
const INCOMPLETE_COND_RE = /не превосходит\s*\.|не превосходит\s*$/i;
const SYMBOLIC_NM_RE = /N\s*=\s*N|M\s*=\s*M|\(N\s*=\s*N\)|\(M\s*=\s*M\)/;

function headsLegsAnswerText(ans: AcceptedAnswer | undefined): string {
  if (!ans) return "";
  switch (ans.kind) {
    case "proof":
      return ans.solutionReference ?? ans.answerPhrase ?? "";
    case "text":
      return ans.format;
    default:
      return "";
  }
}

function hasHeadsLegsAnswerKey(ans: AcceptedAnswer | undefined): boolean {
  if (!ans) return false;
  switch (ans.kind) {
    case "proof":
      return Boolean(
        ans.answerTokens?.length ||
          ans.signatureNumbers?.length ||
          ans.answerPhrase ||
          ans.solutionReference?.trim(),
      );
    case "single":
      return Object.keys(ans.values).length > 0;
    case "single_scalar":
      return true;
    case "multi_set":
      return ans.sets.length > 0;
    case "diagnostic":
      return true;
    case "text":
      return ans.format.trim().length > 0;
    default:
      return false;
  }
}

function collectStepText(steps: DiscriminatedTaskStep[]): string {
  const parts: string[] = [];
  for (const s of steps) {
    for (const k of ["title", "hint", "selectPrompt", "context", "question", "successMessage"] as const) {
      const v = s[k as keyof typeof s];
      if (typeof v === "string") parts.push(v);
    }
    if (s.type === "drag_select" || s.type === "single_select") {
      for (const o of s.options ?? []) parts.push(o.label);
    }
    if (s.type === "worksheet_table") {
      for (const r of s.worksheetRows ?? []) parts.push(r.question);
    }
  }
  return parts.join("\n");
}

function scanIssues(task: Task): QaIssue[] {
  const issues: QaIssue[] = [];
  const stepText = collectStepText(task.steps);
  const condition = task.condition ?? "";
  const hlAns = task.headsLegsMeta?.acceptedAnswers;
  const answerRef = task.dirichletMeta?.acceptedAnswers?.solutionReference ?? headsLegsAnswerText(hlAns);

  if (SYMBOLIC_NM_RE.test(stepText)) issues.push("contains_N_equals_N");
  if (EXTERNAL_REF_RE.test(answerRef)) issues.push("contains_external_reference");
  if (INCOMPLETE_COND_RE.test(condition)) issues.push("incomplete_condition");
  const hasHlAnswer = Boolean(task.headsLegsMeta && hasHeadsLegsAnswerKey(hlAns));
  if (
    !hasHlAnswer &&
    (!answerRef.trim() || answerRef.trim() === "См. методичку.")
  ) {
    issues.push("missing_answer_key");
  }
  if (/рис\.|рисунок|схем/i.test(condition) && !/svg|visual/i.test(stepText)) {
    issues.push("missing_visual_asset");
  }

  const methodId = task.dirichletMeta?.methodTaskId;
  if (methodId && DIRICHLET_P0_METHOD_IDS.has(methodId)) {
    issues.push("requires_manual_review");
  }

  if (task.dirichletMeta?.themeId === DIRICHLET_ARCHIVE_THEME) {
    issues.push("too_hard_for_child_route");
  }

  return [...new Set(issues)];
}

function defaultVisual(task: Task, issues: QaIssue[]): { requiresVisual: boolean; visualStatus: VisualStatus } {
  const needs = issues.includes("missing_visual_asset");
  return {
    requiresVisual: needs,
    visualStatus: needs ? "missing" : "notNeeded",
  };
}

function defaultTier(task: Task, issues: QaIssue[]): TaskPublishingMeta["publishTier"] {
  if (issues.includes("incomplete_condition") || issues.includes("missing_answer_key")) return "hidden";
  if (issues.includes("requires_manual_review")) return "hidden";
  if (task.dirichletMeta?.themeId === DIRICHLET_ARCHIVE_THEME) return "archive";
  if (issues.length > 0) return "methodistOnly";

  if (task.headsLegsMeta && task.number <= HEADS_LEGS_CHILD_ROUTE_MAX_NUMBER) return "childRoute";
  const mid = task.dirichletMeta?.methodTaskId;
  if (mid && mid in DIRICHLET_CHILD_ROUTE) return "childRoute";

  return "methodistOnly";
}

function defaultQaStatus(issues: QaIssue[], tier: TaskPublishingMeta["publishTier"]): TaskPublishingMeta["qaStatus"] {
  if (tier === "hidden" || issues.includes("incomplete_condition")) return "blocked";
  if (tier === "childRoute" && issues.length === 0) return "ready";
  if (issues.length === 0) return "ready";
  return "needsReview";
}

function applyManual(
  base: TaskPublishingMeta,
  manual?: ManualPublishingOverride,
): TaskPublishingMeta {
  if (!manual) return base;
  let issues = [...base.issues];
  if (manual.forceIssues) issues.push(...manual.forceIssues);
  if (manual.clearIssues) issues = issues.filter((i) => !manual.clearIssues!.includes(i));
  issues = [...new Set(issues)];

  return {
    ...base,
    ...manual,
    issues,
    publishTier: manual.publishTier ?? base.publishTier,
    qaStatus: manual.qaStatus ?? base.qaStatus,
    routeOrder: manual.routeOrder ?? base.routeOrder,
    requiresVisual: manual.requiresVisual ?? base.requiresVisual,
    visualStatus: manual.visualStatus ?? base.visualStatus,
  };
}

export function resolveTaskPublishing(task: Task): TaskPublishingMeta {
  let condition = task.condition;
  const methodId = task.dirichletMeta?.methodTaskId;
  if (methodId && CONDITION_PATCHES[methodId]) {
    condition = CONDITION_PATCHES[methodId];
  }

  const patchedTask = { ...task, condition };
  const issues = scanIssues(patchedTask);
  const visual = defaultVisual(patchedTask, issues);
  let publishTier = defaultTier(patchedTask, issues);
  let qaStatus = defaultQaStatus(issues, publishTier);

  let routeOrder: number | undefined;
  if (task.headsLegsMeta && publishTier === "childRoute") {
    routeOrder = task.number;
  }
  if (methodId && methodId in DIRICHLET_CHILD_ROUTE && publishTier === "childRoute") {
    routeOrder = 100 + DIRICHLET_CHILD_ROUTE[methodId];
  }

  if (qaStatus !== "ready" && publishTier === "childRoute") {
    publishTier = "methodistOnly";
  }

  const base: TaskPublishingMeta = {
    publishTier,
    qaStatus,
    issues,
    routeOrder,
    requiresVisual: visual.requiresVisual,
    visualStatus: visual.visualStatus,
    requiresExpansion: issues.includes("contains_external_reference"),
  };

  return applyManual(base, MANUAL_PUBLISHING[task.id]);
}

export function patchAnswerReference(methodTaskId: string, raw: string): string {
  return ANSWER_REFERENCE_PATCHES[methodTaskId] ?? raw;
}

export function isChildVisible(meta: TaskPublishingMeta): boolean {
  return (
    meta.qaStatus === "ready" &&
    (meta.publishTier === "childRoute" || meta.publishTier === "training")
  );
}

export function isArchiveVisible(meta: TaskPublishingMeta): boolean {
  return meta.publishTier === "archive" || meta.publishTier === "training";
}
