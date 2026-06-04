"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { THINKING_TYPES } from "@/data/thinking-map";
import type { Task } from "@/data/tasks";
import {
  copyTask,
  getAllResolvedTasks,
  hasOverride,
  isBuiltInTaskId,
  setTaskOverride,
  type TaskStoreData,
} from "@/lib/task-store";
import { migrateLegacyModeratorStore } from "@/lib/task-moderator";
import { buildPlayerSteps } from "@/lib/task-player-steps";
import { notifyTaskStoreUpdated, useTaskStore } from "@/lib/use-task-store";
import { useEffect, useMemo, useState } from "react";

const BRANCH_TITLES = Object.fromEntries(
  THINKING_TYPES.flatMap((type) => type.branches.map((branch) => [branch.id, branch.title]))
);

function TaskRow({
  task,
  store,
  onCopy,
}: {
  task: Task;
  store: TaskStoreData;
  onCopy: (id: string) => void;
}) {
  const isCopy = Boolean(store.customTasks[task.id]);
  const edited = hasOverride(task.id, store) || isCopy;
  const enabled = task.enableGivenStep ?? false;
  const stepCount = buildPlayerSteps(task, {
    enableGivenStep: enabled,
    givenStep: task.givenStep,
  }).length;

  const toggleGiven = () => {
    setTaskOverride(task.id, { enableGivenStep: !enabled });
    notifyTaskStoreUpdated();
  };

  return (
    <tr className="border-b border-lavender-100 last:border-0">
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900">
          {task.number}. {task.title}
          {isCopy ? (
            <span className="ml-2 rounded bg-lavender-100 px-1.5 py-0.5 text-xs text-brand-purple">
              копия
            </span>
          ) : null}
          {edited && !isCopy ? (
            <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">
              изменена
            </span>
          ) : null}
        </div>
        <div className="text-xs text-gray-500">{task.id}</div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{BRANCH_TITLES[task.branchId] ?? task.branchId}</td>
      <td className="px-4 py-3 text-center text-sm text-gray-600">{stepCount}</td>
      <td className="px-4 py-3 text-center">
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={enabled}
            onChange={toggleGiven}
            disabled={!task.givenStep}
            className="h-4 w-4 rounded border-gray-300 text-brand-purple"
          />
          <span className="text-sm text-gray-700">Дано</span>
        </label>
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-3 text-sm">
          <button
            type="button"
            onClick={() => onCopy(task.id)}
            className="text-gray-600 hover:text-brand-purple"
          >
            Копировать
          </button>
          <Link href={`/admin/tasks/${task.id}`} className="text-brand-purple hover:underline">
            Редактировать
          </Link>
          <Link href={`/tasks/${task.id}`} className="text-gray-500 hover:underline">
            Игра
          </Link>
        </div>
      </td>
    </tr>
  );
}

export default function AdminTasksPage() {
  const store = useTaskStore();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    migrateLegacyModeratorStore();
    setReady(true);
  }, []);

  const tasks = useMemo(
    () =>
      getAllResolvedTasks(store).sort(
        (a, b) => a.branchId.localeCompare(b.branchId) || a.number - b.number
      ),
    [store]
  );

  const handleCopy = (taskId: string) => {
    const copy = copyTask(taskId);
    if (!copy) return;
    notifyTaskStoreUpdated();
    router.push(`/admin/tasks/${copy.id}`);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <Link href="/tasks" className="mb-4 inline-block text-sm text-brand-purple hover:underline">
          ← К задачам
        </Link>

        <h1 className="mb-2 text-2xl font-bold">Модерация задач</h1>
        <p className="mb-6 max-w-3xl text-sm text-gray-600">
          Редактируйте олимпиадные задачи МышМат. Для daily (чтение, русский, математика) —{" "}
          <Link href="/admin/daily" className="text-brand-purple hover:underline">
            отдельный раздел Daily
          </Link>
          .
        </p>

        {!ready ? (
          <p className="text-sm text-gray-500">Загрузка…</p>
        ) : (
          <div className="overflow-x-auto rounded-card bg-white shadow-card">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-lavender-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Задача</th>
                  <th className="px-4 py-3 font-medium">Ветка</th>
                  <th className="px-4 py-3 text-center font-medium">Шагов</th>
                  <th className="px-4 py-3 text-center font-medium">Дано</th>
                  <th className="px-4 py-3 text-right font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <TaskRow key={task.id} task={task} store={store} onCopy={handleCopy} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-xs text-gray-400">
          Встроенных задач в коде: {tasks.filter((t) => isBuiltInTaskId(t.id)).length} · копий и
          новых: {Object.keys(store.customTasks).length}
        </p>
      </div>
    </AppShell>
  );
}
