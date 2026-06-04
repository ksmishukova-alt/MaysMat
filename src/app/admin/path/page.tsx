"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { THINKING_TYPES } from "@/data/thinking-map";
import {
  getChildPath,
  saveChildPath,
  type ChildPathConfig,
  type PathItem,
  type PathItemKind,
} from "@/lib/child-path";
import { getAllResolvedTasks } from "@/lib/task-store";
import { loadProgress } from "@/lib/progress";
import { useTaskStore } from "@/lib/use-task-store";

const BRANCHES = THINKING_TYPES.flatMap((t) => t.branches);

export default function AdminPathPage() {
  const taskStore = useTaskStore();
  const [childName, setChildName] = useState("");
  const [title, setTitle] = useState("Неделя 1");
  const [note, setNote] = useState("");
  const [items, setItems] = useState<PathItem[]>([]);
  const [addKind, setAddKind] = useState<PathItemKind>("branch");
  const [addId, setAddId] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const p = loadProgress();
    setChildName(p.name);
    const existing = getChildPath(p.name);
    if (existing) {
      setTitle(existing.title);
      setNote(existing.note ?? "");
      setItems(existing.items);
    }
  }, []);

  const tasks = useMemo(
    () =>
      getAllResolvedTasks(taskStore).sort(
        (a, b) => a.branchId.localeCompare(b.branchId) || a.number - b.number
      ),
    [taskStore]
  );

  const handleAdd = () => {
    if (!addId) return;
    setItems((prev) => [...prev, { kind: addKind, id: addId }]);
    setAddId("");
    setSaved(false);
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= items.length) return;
    setItems((prev) => {
      const copy = [...prev];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
    setSaved(false);
  };

  const remove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  };

  const handleSave = useCallback(() => {
    const config: ChildPathConfig = { title, note: note || undefined, items };
    saveChildPath(childName.trim() || "София", config);
    setSaved(true);
  }, [childName, title, note, items]);

  const itemLabel = (item: PathItem) => {
    if (item.kind === "branch") {
      return BRANCHES.find((b) => b.id === item.id)?.title ?? item.id;
    }
    const t = tasks.find((x) => x.id === item.id);
    return t ? `${t.number}. ${t.title}` : item.id;
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <Link href="/parents" className="text-sm text-brand-purple hover:underline">
          ← Родителям
        </Link>
        <h1 className="mt-2 mb-2 text-2xl font-bold">Маршрут ребёнка</h1>
        <p className="mb-6 text-sm text-gray-600">
          Соберите порядок тем и задач на первые недели. Ребёнок увидит только этот список на
          странице «Задачи» — без карты островов.
        </p>

        <div className="space-y-4 rounded-card bg-white p-6 shadow-card">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-700">Имя ребёнка</span>
            <input
              type="text"
              value={childName}
              onChange={(e) => {
                setChildName(e.target.value);
                setSaved(false);
              }}
              className="w-full rounded-xl border border-lavender-200 px-3 py-2"
              placeholder="Как в профиле"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-700">Заголовок периода</span>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSaved(false);
              }}
              className="w-full rounded-xl border border-lavender-200 px-3 py-2"
              placeholder="Неделя 1"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-700">Заметка (необязательно)</span>
            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setSaved(false);
              }}
              rows={2}
              className="w-full rounded-xl border border-lavender-200 px-3 py-2"
              placeholder="Например: сначала daily, потом одна задача МышМат"
            />
          </label>
        </div>

        <div className="mt-6 rounded-card bg-white p-6 shadow-card">
          <h2 className="mb-4 font-bold">Добавить в маршрут</h2>
          <div className="flex flex-wrap gap-3">
            <select
              value={addKind}
              onChange={(e) => {
                setAddKind(e.target.value as PathItemKind);
                setAddId("");
              }}
              className="rounded-xl border border-lavender-200 px-3 py-2 text-sm"
            >
              <option value="branch">Тема</option>
              <option value="task">Задача</option>
            </select>
            <select
              value={addId}
              onChange={(e) => setAddId(e.target.value)}
              className="min-w-[200px] flex-1 rounded-xl border border-lavender-200 px-3 py-2 text-sm"
            >
              <option value="">Выберите…</option>
              {addKind === "branch"
                ? BRANCHES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title}
                      {b.taskCount === 0 ? " (скоро)" : ""}
                    </option>
                  ))
                : tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.number}. {t.title}
                    </option>
                  ))}
            </select>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!addId}
              className="rounded-xl bg-brand-purple px-4 py-2 text-sm text-white disabled:opacity-40"
            >
              Добавить
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-card bg-white p-6 shadow-card">
          <h2 className="mb-4 font-bold">Порядок ({items.length})</h2>
          {items.length === 0 ? (
            <p className="text-sm text-gray-400">Пока пусто — добавьте тему или задачу</p>
          ) : (
            <ol className="space-y-2">
              {items.map((item, index) => (
                <li
                  key={`${item.kind}-${item.id}-${index}`}
                  className="flex items-center gap-2 rounded-xl bg-lavender-50 px-3 py-2"
                >
                  <span className="w-6 text-center text-sm font-bold text-gray-400">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-sm">
                    {item.kind === "branch" ? "📚" : "✏️"} {itemLabel(item)}
                  </span>
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="px-2 text-gray-500 disabled:opacity-30"
                    aria-label="Выше"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    className="px-2 text-gray-500 disabled:opacity-30"
                    aria-label="Ниже"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="px-2 text-red-500"
                    aria-label="Удалить"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ol>
          )}

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-brand-purple px-6 py-2.5 font-semibold text-white"
            >
              Сохранить маршрут
            </button>
            {saved ? <span className="text-sm text-emerald-600">✓ Сохранено</span> : null}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
