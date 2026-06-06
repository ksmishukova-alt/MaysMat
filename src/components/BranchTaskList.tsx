"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TaskCompletionStampById } from "@/components/TaskCompletionStamp";
import { useResolvedTasksForBranch, useTaskStore } from "@/lib/use-task-store";
import { getTaskCompletion } from "@/lib/progress";
import { useProgress } from "@/lib/use-progress";
import {
  getPaperReviewStatus,
  PAPER_STATUS_LABEL,
  type PaperReviewStatus,
} from "@/lib/paper-task-review";
import {
  countArchiveTasks,
  countChildVisibleTasks,
  filterBranchTasksForList,
  formatChildRouteTaskCount,
} from "@/lib/branch-task-filter";
import { taskPlayHref } from "@/lib/task-access-mode";

interface BranchTaskListProps {
  branchId: string;
  branchTaskCount: number;
  /** Ветки methodology-bank: скрывать архив по умолчанию */
  methodologyBank?: boolean;
}

export function BranchTaskList({
  branchId,
  branchTaskCount,
  methodologyBank = false,
}: BranchTaskListProps) {
  const store = useTaskStore();
  const userProgress = useProgress();
  const allTasks = useResolvedTasksForBranch(branchId);
  const [showArchive, setShowArchive] = useState(false);

  const tasks = useMemo(
    () => filterBranchTasksForList(allTasks, { methodologyBank, showArchive }),
    [allTasks, methodologyBank, showArchive],
  );

  const childCount = countChildVisibleTasks(allTasks);
  const archiveCount = countArchiveTasks(allTasks);

  const customCount = Object.values(store.customTasks).filter((t) => t.branchId === branchId).length;

  return (
    <div className="rounded-card bg-white p-6 shadow-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold">Задачи</h2>
        {methodologyBank && archiveCount > 0 ? (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showArchive}
              onChange={(e) => setShowArchive(e.target.checked)}
              className="rounded border-gray-300"
            />
            Олимпиадный архив (+{archiveCount})
          </label>
        ) : null}
      </div>
      {methodologyBank ? (
        <p className="mb-4 text-xs text-gray-500">
          Детский маршрут: {formatChildRouteTaskCount(childCount)}. Остальные — в банке методиста или архиве.
        </p>
      ) : null}
      <div className="space-y-3">
        {tasks.map((task, index) => {
          const displayNum = task.publishing?.routeOrder ?? task.number;
          const labelNum = methodologyBank ? index + 1 : displayNum;
          const isCopy = Boolean(store.customTasks[task.id]);
          const done = getTaskCompletion(task.id, userProgress);
          const paperStatus: PaperReviewStatus = task.requiresUpload
            ? getPaperReviewStatus(task.id)
            : "not_started";
          const tier = task.publishing?.publishTier;
          const tierBadge =
            tier === "archive" ? (
              <span className="ml-2 text-xs font-normal text-violet-600">архив</span>
            ) : null;
          const playHref = taskPlayHref(
            task.id,
            tier === "archive" && showArchive ? "archivePreview" : undefined,
          );

          if (done) {
            return (
              <div
                key={task.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/40 p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 font-medium text-gray-800">
                    <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs text-white">
                      ✓ решено
                    </span>
                    Задача {labelNum}. {task.shortTitle ?? task.title}
                    {tierBadge}
                    {isCopy ? (
                      <span className="text-xs font-normal text-brand-purple">копия</span>
                    ) : null}
                  </div>
                  <div className="mt-1 text-sm text-amber-600">
                    {"★".repeat(done.stars)}
                    {"☆".repeat(Math.max(0, 3 - done.stars))}
                  </div>
                </div>
                <TaskCompletionStampById stampId={done.stampId} stars={done.stars} size="sm" />
                <Link
                  href={playHref}
                  className="rounded-lg border border-lavender-200 bg-white px-3 py-2 text-xs text-gray-600 hover:border-brand-purple"
                >
                  Ещё раз
                </Link>
              </div>
            );
          }

          if (paperStatus === "pending") {
            return (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-xl border border-sky-200 bg-sky-50/60 p-4"
              >
                <div>
                  <div className="font-medium">
                    Задача {labelNum}. {task.shortTitle ?? task.title}
                    {tierBadge}
                  </div>
                  <div className="mt-1 text-sm text-sky-800">{PAPER_STATUS_LABEL.pending}</div>
                </div>
                <Link
                  href={playHref}
                  className="rounded-lg border border-sky-300 bg-white px-3 py-2 text-xs text-sky-900"
                >
                  Открыть
                </Link>
              </div>
            );
          }

          if (paperStatus === "redo") {
            return (
              <Link
                key={task.id}
                href={playHref}
                className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-4 hover:border-amber-400"
              >
                <div>
                  <div className="font-medium">
                    Задача {labelNum}. {task.shortTitle ?? task.title}
                    {tierBadge}
                  </div>
                  <div className="mt-1 text-sm text-amber-800">{PAPER_STATUS_LABEL.redo}</div>
                </div>
                <span className="rounded-lg bg-brand-purple px-4 py-2 text-sm text-white">
                  Исправить
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={task.id}
              href={playHref}
              className="flex items-center justify-between rounded-xl border border-lavender-100 p-4 hover:border-brand-purple hover:bg-lavender-50"
            >
              <div>
                <div className="font-medium">
                  Задача {labelNum}. {task.shortTitle ?? task.title}
                  {tierBadge}
                  {isCopy ? (
                    <span className="ml-2 text-xs font-normal text-brand-purple">копия</span>
                  ) : null}
                </div>
                <div className="text-sm text-gray-500">
                  Этап {task.stage} · до {task.maxStars} ★
                  {task.requiresUpload ? " · 📝 письменно" : ""}
                </div>
              </div>
              <span className="rounded-lg bg-brand-purple px-4 py-2 text-sm text-white">Начать</span>
            </Link>
          );
        })}
        {!methodologyBank
          ? Array.from({
              length: Math.max(0, Math.min(5, branchTaskCount + customCount - tasks.length)),
            }).map((_, i) => (
              <div
                key={`placeholder-${i}`}
                className="flex items-center justify-between rounded-xl border border-dashed border-gray-200 p-4 opacity-50"
              >
                <div className="font-medium text-gray-400">Задача {tasks.length + i + 1} — скоро</div>
                <span className="text-sm text-gray-300">🔒</span>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
