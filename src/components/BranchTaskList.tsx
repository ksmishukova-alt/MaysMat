"use client";

import Link from "next/link";
import { TaskCompletionStampById } from "@/components/TaskCompletionStamp";
import { useResolvedTasksForBranch, useTaskStore } from "@/lib/use-task-store";
import { getTaskCompletion } from "@/lib/progress";
import { useProgress } from "@/lib/use-progress";

interface BranchTaskListProps {
  branchId: string;
  branchTaskCount: number;
}

export function BranchTaskList({ branchId, branchTaskCount }: BranchTaskListProps) {
  const store = useTaskStore();
  const userProgress = useProgress();
  const tasks = useResolvedTasksForBranch(branchId);
  const customCount = Object.values(store.customTasks).filter((t) => t.branchId === branchId).length;

  return (
    <div className="rounded-card bg-white p-6 shadow-card">
      <h2 className="mb-4 font-semibold">Задачи</h2>
      <div className="space-y-3">
        {tasks.map((task) => {
          const isCopy = Boolean(store.customTasks[task.id]);
          const done = getTaskCompletion(task.id, userProgress);

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
                    Задача {task.number}. {task.title}
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
                  href={`/tasks/${task.id}`}
                  className="rounded-lg border border-lavender-200 bg-white px-3 py-2 text-xs text-gray-600 hover:border-brand-purple"
                >
                  Ещё раз
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={task.id}
              href={`/tasks/${task.id}`}
              className="flex items-center justify-between rounded-xl border border-lavender-100 p-4 hover:border-brand-purple hover:bg-lavender-50"
            >
              <div>
                <div className="font-medium">
                  Задача {task.number}. {task.title}
                  {isCopy ? (
                    <span className="ml-2 text-xs font-normal text-brand-purple">копия</span>
                  ) : null}
                </div>
                <div className="text-sm text-gray-500">
                  Этап {task.stage} · до {task.maxStars} ★
                </div>
              </div>
              <span className="rounded-lg bg-brand-purple px-4 py-2 text-sm text-white">Начать</span>
            </Link>
          );
        })}
        {Array.from({
          length: Math.max(0, Math.min(5, branchTaskCount + customCount - tasks.length)),
        }).map((_, i) => (
          <div
            key={`placeholder-${i}`}
            className="flex items-center justify-between rounded-xl border border-dashed border-gray-200 p-4 opacity-50"
          >
            <div className="font-medium text-gray-400">Задача {tasks.length + i + 1} — скоро</div>
            <span className="text-sm text-gray-300">🔒</span>
          </div>
        ))}
      </div>
    </div>
  );
}
