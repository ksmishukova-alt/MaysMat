"use client";

import Link from "next/link";
import type { DiagnosticReport } from "@/data/entry-diagnostic/types";
import { humanizeErrorClusterKey } from "@/lib/entry-diagnostic/error-labels";

export function DiagnosticReportView({ report }: { report: DiagnosticReport }) {
  return (
    <div className="space-y-6" data-testid="diagnostic-report">
      <div className="rounded-2xl bg-white p-6 shadow-card">
        <h2 className="text-xl font-bold text-gray-900">Итог диагностики</h2>
        <p className="mt-2 text-3xl font-black text-brand-purple">
          {report.totalScore} / {report.maxTotalScore}
        </p>
      </div>

      <section>
        <h3 className="mb-3 font-semibold">Баллы по блокам</h3>
        <ul className="space-y-2">
          {report.scoreByBlock.map((b) => (
            <li
              key={b.blockId}
              className="flex justify-between rounded-xl bg-lavender-50 px-4 py-2 text-sm"
            >
              <span>{b.title}</span>
              <span className="font-medium">
                {b.score}/{b.maxScore}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {report.strengths.length ? (
        <section>
          <h3 className="mb-2 font-semibold text-green-700">Сильные зоны</h3>
          <ul className="list-inside list-disc text-sm text-gray-700">
            {report.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {report.risks.length ? (
        <section>
          <h3 className="mb-2 font-semibold text-amber-700">Зоны риска</h3>
          <ul className="list-inside list-disc text-sm text-gray-700">
            {report.risks.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h3 className="mb-2 font-semibold">Рекомендации маршрута</h3>
        <ul className="space-y-1 text-sm text-gray-600">
          {report.routeRecommendations.map((r) => (
            <li key={r}>• {r}</li>
          ))}
        </ul>
      </section>

      {Object.keys(report.errorClusters).length ? (
        <section>
          <h3 className="mb-2 font-semibold">Профили ошибок</h3>
          <ul className="flex flex-wrap gap-2">
            {Object.entries(report.errorClusters).map(([k, v]) => (
              <li key={k} className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                {humanizeErrorClusterKey(k)}: {v}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Link
        href="/diagnostic/play/counting-road"
        className="inline-block min-h-11 rounded-xl border border-brand-purple px-4 py-2 text-sm text-brand-purple"
      >
        Мини-игра «Счётная дорога»
      </Link>
    </div>
  );
}
