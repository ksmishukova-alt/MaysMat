import { Suspense } from "react";

import { TaskPageClient } from "@/components/TaskPageClient";
import { getTask } from "@/data/tasks";

interface Props {
  params: Promise<{ taskId: string }>;
}

function TaskPageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
      Загрузка задачи…
    </div>
  );
}

export default async function TaskPage({ params }: Props) {
  const { taskId } = await params;
  const fallbackTask = getTask(taskId);
  return (
    <Suspense fallback={<TaskPageFallback />}>
      <TaskPageClient taskId={taskId} fallbackTask={fallbackTask} />
    </Suspense>
  );
}
