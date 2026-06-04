"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { TaskPlayer } from "@/components/TaskPlayer";
import { getBranchById } from "@/data/thinking-map";
import type { Task } from "@/data/tasks";
import { useResolvedTask } from "@/lib/use-task-store";

interface TaskPageClientProps {
  taskId: string;
  fallbackTask?: Task;
}

export function TaskPageClient({ taskId, fallbackTask }: TaskPageClientProps) {
  const resolved = useResolvedTask(taskId);
  const task = resolved ?? fallbackTask;

  if (!task) {
    notFound();
  }

  const branch = getBranchById(task.branchId);
  const branchHref = branch ? `/branch/${branch.slug}` : "/tasks";

  return (
    <AppShell>
      <Link href={branchHref} className="mb-4 inline-block text-sm text-brand-purple hover:underline">
        ← {branch?.title ?? "К теме"}
      </Link>
      <TaskPlayer task={task} totalTasksInBranch={branch?.taskCount} />
    </AppShell>
  );
}
