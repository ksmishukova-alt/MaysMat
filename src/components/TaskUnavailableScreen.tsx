import Link from "next/link";

import type { TaskPublishingMeta } from "@/data/task-publishing/types";
import { getBranchById } from "@/data/thinking-map";

interface TaskUnavailableScreenProps {
  taskTitle: string;
  branchId: string;
  publishing?: TaskPublishingMeta;
  reason?: "unsupported_runner";
}

function unavailableMessage(publishing?: TaskPublishingMeta): string {
  if (!publishing) {
    return "Эта задача пока недоступна в детском маршруте.";
  }
  if (publishing.qaStatus === "blocked") {
    return "Задача ещё на доработке — скоро появится в маршруте.";
  }
  if (publishing.publishTier === "archive") {
    return "Эта задача в олимпиадном архиве. Открой её из списка ветки с включённым «Олимпиадным архивом».";
  }
  if (publishing.publishTier === "methodistOnly" || publishing.publishTier === "hidden") {
    return "Задача доступна методистам — в детском маршруте её пока нет.";
  }
  if (publishing.qaStatus === "needsReview") {
    return "Задача проходит проверку качества и скоро появится в маршруте.";
  }
  return "Эта задача пока недоступна в детском маршруте.";
}

export function TaskUnavailableScreen({
  taskTitle,
  branchId,
  publishing,
  reason,
}: TaskUnavailableScreenProps) {
  const branch = getBranchById(branchId);
  const branchHref = branch ? `/branch/${branch.slug}` : "/tasks";

  const message =
    reason === "unsupported_runner"
      ? "Для этой задачи ещё не подключён специализированный runner."
      : unavailableMessage(publishing);

  return (
    <div className="mx-auto max-w-lg rounded-card bg-white p-8 text-center shadow-card">
      <div className="mb-4 text-4xl" aria-hidden>
        🔒
      </div>
      <h1 className="text-xl font-semibold text-gray-900">Задача недоступна</h1>
      <p className="mt-2 text-sm text-gray-600">{taskTitle}</p>
      <p className="mt-4 text-sm text-gray-500">{message}</p>
      <Link
        href={branchHref}
        className="mt-6 inline-block rounded-lg bg-brand-purple px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
      >
        ← К списку задач
      </Link>
    </div>
  );
}
