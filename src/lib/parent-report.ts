import type { UserProgress, ActivityEntry } from "@/lib/progress";
import { getBranchById } from "@/data/thinking-map";
import { TASKS } from "@/data/tasks";
import {
  getAdventureForBranch,
  getBranchMeta,
  PARENT_SKILL_LABELS,
} from "@/data/branch-meta";

export type ReportPeriodDays = 7 | 30;

export interface ParentReportTopic {
  branchId: string;
  branchTitle: string;
  adventureTitle: string;
  microSkill?: string;
  taskCount: number;
  minutes: number;
}

export interface ParentReportTask {
  taskId: string;
  title: string;
  branchTitle: string;
  stars: number;
  completedAt: string;
}

export interface ParentReport {
  periodDays: ReportPeriodDays;
  totalMinutes: number;
  topics: ParentReportTopic[];
  successes: ParentReportTask[];
  struggles: ParentReportTask[];
  skillMinutes: { skillId: string; label: string; minutes: number }[];
}

function dateKey(iso: string): string {
  return iso.slice(0, 10);
}

function cutoffDate(days: ReportPeriodDays): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - days + 1);
  return d;
}

function inPeriod(iso: string, days: ReportPeriodDays): boolean {
  const cut = cutoffDate(days);
  return new Date(iso) >= cut;
}

/** Собираем записи активности: журнал + задачи без журнала */
function collectEntries(progress: UserProgress, days: ReportPeriodDays): ActivityEntry[] {
  const fromLog = (progress.activityLog ?? []).filter((e) =>
    inPeriod(`${e.date}T12:00:00.000Z`, days)
  );

  const loggedTaskIds = new Set(
    fromLog.filter((e) => e.kind === "task" && e.taskId).map((e) => e.taskId!)
  );

  const backfill: ActivityEntry[] = [];
  for (const [taskId, meta] of Object.entries(progress.completedTasks)) {
    if (taskId.startsWith("daily-") || loggedTaskIds.has(taskId)) continue;
    if (!inPeriod(meta.completedAt, days)) continue;

    const task = TASKS[taskId];
    if (!task) continue;

    backfill.push({
      date: dateKey(meta.completedAt),
      minutes: 12,
      kind: "task",
      branchId: task.branchId,
      taskId,
      label: task.title,
      stars: meta.stars,
    });
  }

  return [...fromLog, ...backfill];
}

export function buildParentReport(
  progress: UserProgress,
  periodDays: ReportPeriodDays
): ParentReport {
  const entries = collectEntries(progress, periodDays);
  const totalMinutes = entries.reduce((s, e) => s + e.minutes, 0);

  const topicMap = new Map<string, ParentReportTopic>();
  const skillMinutes = new Map<string, number>();

  for (const e of entries) {
    if (e.kind !== "task" || !e.branchId) continue;
    const branch = getBranchById(e.branchId);
    if (!branch) continue;

    const adventure = getAdventureForBranch(e.branchId);
    const meta = getBranchMeta(e.branchId);
    const existing = topicMap.get(e.branchId);
    if (existing) {
      existing.taskCount += 1;
      existing.minutes += e.minutes;
    } else {
      topicMap.set(e.branchId, {
        branchId: e.branchId,
        branchTitle: branch.title,
        adventureTitle: adventure?.title ?? "МышМат",
        microSkill: meta?.microSkill,
        taskCount: 1,
        minutes: e.minutes,
      });
    }

    const skillId = branch.thinkingType;
    skillMinutes.set(skillId, (skillMinutes.get(skillId) ?? 0) + e.minutes);
  }

  const successes: ParentReportTask[] = [];
  const struggles: ParentReportTask[] = [];

  for (const [taskId, meta] of Object.entries(progress.completedTasks)) {
    if (taskId.startsWith("daily-")) continue;
    if (!inPeriod(meta.completedAt, periodDays)) continue;
    const task = TASKS[taskId];
    if (!task) continue;
    const branch = getBranchById(task.branchId);
    const item: ParentReportTask = {
      taskId,
      title: task.title,
      branchTitle: branch?.title ?? task.branchId,
      stars: meta.stars,
      completedAt: meta.completedAt,
    };
    if (meta.stars >= 3) successes.push(item);
    else if (meta.stars >= 1) struggles.push(item);
  }

  successes.sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  struggles.sort((a, b) => a.stars - b.stars || b.completedAt.localeCompare(a.completedAt));

  return {
    periodDays,
    totalMinutes,
    topics: [...topicMap.values()].sort((a, b) => b.minutes - a.minutes),
    successes,
    struggles,
    skillMinutes: [...skillMinutes.entries()]
      .map(([skillId, minutes]) => ({
        skillId,
        label: PARENT_SKILL_LABELS[skillId] ?? skillId,
        minutes,
      }))
      .sort((a, b) => b.minutes - a.minutes),
  };
}

export function formatMinutes(total: number): string {
  if (total < 60) return `${total} мин`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m > 0 ? `${h} ч ${m} мин` : `${h} ч`;
}
