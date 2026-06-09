"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Header } from "@/components/Header";

export default function DiagnosticLandingPage() {
  return (
    <AppShell>
      <Header subtitle="Входная диагностика · МышМат" />
      <div className="rounded-2xl bg-white p-8 shadow-card">
        <h1 className="text-2xl font-bold text-gray-900">Диагностика МышМата</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-600">
          Проверим 15 навыков: от чтения условия до закономерностей. После каждого блока — мини-игра
          с МышМатом. Максимум 90 баллов.
        </p>
        <ul className="mt-4 list-inside list-disc text-sm text-gray-500">
          <li>Во время диагностики подсказок не будет — результат появится в конце</li>
          <li>~45–60 минут</li>
        </ul>
        <Link
          href="/diagnostic/run"
          data-testid="diagnostic-enter"
          className="mt-8 inline-flex min-h-11 items-center rounded-xl bg-brand-purple px-8 py-3 text-sm font-medium text-white"
        >
          Перейти к диагностике
        </Link>
      </div>
    </AppShell>
  );
}
