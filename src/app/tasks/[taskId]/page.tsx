import { TaskPageClient } from "@/components/TaskPageClient";
import { getTask } from "@/data/tasks";

interface Props {
  params: Promise<{ taskId: string }>;
}

export default async function TaskPage({ params }: Props) {
  const { taskId } = await params;
  const fallbackTask = getTask(taskId);
  return <TaskPageClient taskId={taskId} fallbackTask={fallbackTask} />;
}
