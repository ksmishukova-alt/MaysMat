/** Ускоренный режим для e2e/QA: короткий таймер мини-игр */
export function isDiagnosticFastMode(): boolean {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_DIAGNOSTIC_FAST === "1";
  }
  if (process.env.NEXT_PUBLIC_DIAGNOSTIC_FAST === "1") return true;
  try {
    return localStorage.getItem("entry-diagnostic-fast") === "1";
  } catch {
    return false;
  }
}

export function diagnosticMiniGameDurationSec(defaultSec: number): number {
  return isDiagnosticFastMode() ? 3 : defaultSec;
}
