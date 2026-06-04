"use client";

import { useState } from "react";
import { updateChildProfile } from "@/lib/progress";
import { useProgress } from "@/lib/use-progress";

export function ChildProfileSetup() {
  const progress = useProgress();
  const child = progress.child;
  const [name, setName] = useState(child?.name ?? progress.name ?? "");
  const [grade, setGrade] = useState(child?.grade?.toString() ?? "");
  const [cohortId, setCohortId] = useState(child?.cohortId ?? "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateChildProfile({
      name: name.trim(),
      grade: grade ? Number(grade) : undefined,
      cohortId: cohortId.trim() || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section className="mb-6">
      <h2 className="mb-3 text-lg font-bold">👤 Профиль ученика</h2>
      <div className="rounded-card bg-white p-5 shadow-card">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-medium text-gray-500">Имя</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Как тебя зовут?"
              className="w-full rounded-xl border border-lavender-200 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-500">Класс</span>
            <input
              type="number"
              min={1}
              max={11}
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="4"
              className="w-full rounded-xl border border-lavender-200 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-500">Группа / поток</span>
            <input
              type="text"
              value={cohortId}
              onChange={(e) => setCohortId(e.target.value)}
              placeholder="4А · весна 2026"
              className="w-full rounded-xl border border-lavender-200 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
            />
          </label>
        </div>
        {child?.childId ? (
          <p className="mt-3 text-xs text-gray-400">
            ID ученика: <code className="rounded bg-lavender-50 px-1">{child.childId}</code>
          </p>
        ) : null}
        <button
          type="button"
          onClick={handleSave}
          className="mt-4 rounded-xl bg-brand-purple px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          {saved ? "Сохранено ✓" : "Сохранить"}
        </button>
      </div>
    </section>
  );
}
