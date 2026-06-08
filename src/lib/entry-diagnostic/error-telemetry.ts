/** Сбор и классификация диагностических ошибок для telemetry */

export interface ErrorTelemetryBuckets {
  orderErrors: string[];
  computationErrors: string[];
  readingErrors: string[];
  dataErrors: string[];
  unitErrors: string[];
}

export function emptyErrorTelemetry(): ErrorTelemetryBuckets {
  return {
    orderErrors: [],
    computationErrors: [],
    readingErrors: [],
    dataErrors: [],
    unitErrors: [],
  };
}

export function pushUnique(bucket: string[], code: string): string[] {
  if (bucket.includes(code)) return bucket;
  return [...bucket, code];
}

export function mergeErrorTelemetry(
  base: ErrorTelemetryBuckets,
  patch: Partial<ErrorTelemetryBuckets>,
): ErrorTelemetryBuckets {
  return {
    orderErrors: patch.orderErrors ?? base.orderErrors,
    computationErrors: patch.computationErrors ?? base.computationErrors,
    readingErrors: patch.readingErrors ?? base.readingErrors,
    dataErrors: patch.dataErrors ?? base.dataErrors,
    unitErrors: patch.unitErrors ?? base.unitErrors,
  };
}

/** Эвристика: теги validation → buckets */
export function classifyValidationErrors(errorTypes: string[]): Partial<ErrorTelemetryBuckets> {
  const out = emptyErrorTelemetry();
  for (const e of errorTypes) {
    if (e.includes("order")) out.orderErrors = pushUnique(out.orderErrors, e);
    else if (e.includes("calculation") || e.includes("computation") || e.includes("carry") || e.includes("borrow"))
      out.computationErrors = pushUnique(out.computationErrors, e);
    else if (e.includes("reading") || e.includes("question_focus"))
      out.readingErrors = pushUnique(out.readingErrors, e);
    else if (e.includes("data") || e.includes("extra_data"))
      out.dataErrors = pushUnique(out.dataErrors, e);
    else if (e.includes("unit") || e.includes("alignment"))
      out.unitErrors = pushUnique(out.unitErrors, e);
  }
  return out;
}

export type MiniGameErrorKind = "motor" | "semantic";

export function miniGameErrorEventKind(
  label: string,
  correctTarget: string,
  semanticTrap?: string,
): MiniGameErrorKind {
  if (label === correctTarget) return "semantic";
  if (semanticTrap && label === semanticTrap) return "semantic";
  return "motor";
}
