import { AppShell } from "@/components/AppShell";
import { TaskEditor } from "@/components/admin/TaskEditor";

interface Props {
  params: Promise<{ taskId: string }>;
}

export default async function AdminTaskEditPage({ params }: Props) {
  const { taskId } = await params;

  return (
    <AppShell>
      <TaskEditor taskId={taskId} />
    </AppShell>
  );
}
