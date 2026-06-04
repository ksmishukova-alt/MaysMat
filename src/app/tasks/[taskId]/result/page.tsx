"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { TaskCompletionStampById } from "@/components/TaskCompletionStamp";
import { getBranchById } from "@/data/thinking-map";
import { pickStampForTask } from "@/data/task-stamps";
import { getTaskCompletion, loadProgress } from "@/lib/progress";
import { resolveTask } from "@/lib/task-store";

function ResultContent() {
  const params = useParams<{ taskId: string }>();
  const searchParams = useSearchParams();
  const taskId = params.taskId;
  const starsFromUrl = Number(searchParams.get("stars") ?? 0);

  const { task, completion, stars, stampId, branchHref } = useMemo(() => {
    const progress = loadProgress();
    const completion = getTaskCompletion(taskId, progress);
    const task = resolveTask(taskId);
    const stars = completion?.stars ?? (starsFromUrl || 3);
    const stampId =
      completion?.stampId ?? pickStampForTask(taskId, stars).id;
    const branch = task ? getBranchById(task.branchId) : undefined;
    const branchHref = branch ? `/branch/${branch.slug}` : "/tasks";
    return { task, completion, stars, stampId, branchHref };
  }, [taskId, starsFromUrl]);

  return (
    <div className="mx-auto max-w-lg text-center">
      <p className="mb-4 text-sm text-gray-500">Задача закрыта · в альбоме отмечена ✓</p>

      <TaskCompletionStampById stampId={stampId} stars={stars} animate />

      <h1 className="mb-2 mt-8 text-2xl font-bold">
        {task ? `Задача ${task.number}. ${task.title}` : "Задача решена!"}
      </h1>
      <p className="mb-8 text-gray-600">
        {stars >= 3
          ? "Блестяще! Заряд карточки темы вырос."
          : stars >= 2
            ? "Хорошо! Можно вернуться и добить до трёх звёзд."
            : "Главное — разобрался. Повтори без подсказок — будет больше звёзд."}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href={branchHref}
          className="rounded-xl bg-brand-purple px-6 py-3 font-medium text-white"
        >
          К теме
        </Link>
        <Link
          href="/tasks"
          className="rounded-xl border border-brand-purple px-6 py-3 font-medium text-brand-purple"
        >
          Мой маршрут
        </Link>
      </div>
    </div>
  );
}

export default function TaskResultPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="text-center text-gray-500">Загрузка…</div>}>
        <ResultContent />
      </Suspense>
    </AppShell>
  );
}
