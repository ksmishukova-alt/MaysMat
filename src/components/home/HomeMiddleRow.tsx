"use client";

import Link from "next/link";
import { getSummitPathSteps } from "@/lib/archipelago-display";

export function HomeMiddleRow() {
  const steps = getSummitPathSteps();

  return (
    <div className="mb-6 grid gap-4 lg:grid-cols-2">
      {/* Пустой блок — контент позже (был «Мои суперспособности» на макете) */}
      <div className="flex min-h-[9rem] items-center justify-center rounded-card border-2 border-dashed border-lavender-200 bg-white/60 p-4 shadow-card">
        <p className="text-center text-sm text-gray-400">Скоро здесь появится блок</p>
      </div>

      <section className="rounded-card bg-white p-4 shadow-card">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-gray-800">🏔️ Покори Олимп и Ад</h2>
          <Link
            href="/achievements"
            className="shrink-0 text-[11px] font-semibold text-brand-purple hover:underline"
          >
            Суперспособности →
          </Link>
        </div>
        <p className="mb-2 text-xs text-gray-500">Вершина МышМата — острова архипелага</p>

        <div className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className="flex min-w-[4.5rem] shrink-0 flex-col items-center rounded-lg bg-lavender-50 px-2 py-1.5 text-center"
              title={step.title}
            >
              <span className="text-base leading-none">{step.emoji}</span>
              <span className="mt-0.5 line-clamp-2 text-[9px] font-medium leading-tight text-gray-600">
                {step.title}
              </span>
              <span className="text-[8px] text-gray-400">{i + 1}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
