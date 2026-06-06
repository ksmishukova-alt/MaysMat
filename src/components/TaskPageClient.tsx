"use client";

import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { TaskPlayer } from "@/components/TaskPlayer";
import { TaskUnavailableScreen } from "@/components/TaskUnavailableScreen";
import { getBranchById } from "@/data/thinking-map";
import { TASKS, type Task } from "@/data/tasks";
import { canAccessTask, parseTaskAccessMode } from "@/lib/task-access-mode";
import { resolveProgressTotalForBranch } from "@/lib/branch-task-filter";
import { useResolvedTask } from "@/lib/use-task-store";

interface TaskPageClientProps {
  taskId: string;
  fallbackTask?: Task;
}

export function TaskPageClient({ taskId, fallbackTask }: TaskPageClientProps) {
  const searchParams = useSearchParams();
  const accessMode = parseTaskAccessMode(searchParams.get("mode"));
  const resolved = useResolvedTask(taskId);
  const task = resolved ?? fallbackTask;

  if (!task) {
    notFound();
  }

  const branch = getBranchById(task.branchId);
  const branchHref = branch ? `/branch/${branch.slug}` : "/tasks";
  const allTasks = Object.values(TASKS);
  const progressTotal = resolveProgressTotalForBranch(task.branchId, allTasks, accessMode);

  if (!canAccessTask(task, accessMode)) {
    return (
      <AppShell>
        <TaskUnavailableScreen
          taskTitle={task.title}
          branchId={task.branchId}
          publishing={task.publishing}
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Link href={branchHref} className="mb-4 inline-block text-sm text-brand-purple hover:underline">
        ← {branch?.title ?? "К теме"}
      </Link>
      <TaskPlayer task={task} totalTasksInBranch={progressTotal} />
    </AppShell>
  );
}
