import type { ValidationRule } from "./types";

function norm(v: unknown): string {
  if (typeof v === "number") return String(v);
  return String(v ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function evalRule(rule: ValidationRule, response: Record<string, unknown>): boolean {
  switch (rule.type) {
    case "exact": {
      const raw = response[rule.field];
      if (typeof rule.value === "number") {
        return Number(raw) === rule.value;
      }
      return norm(raw) === norm(rule.value);
    }
    case "numericEquals": {
      const n = Number(response[rule.field]);
      if (Number.isNaN(n)) return false;
      const tol = rule.tolerance ?? 0;
      return Math.abs(n - rule.value) <= tol;
    }
    case "oneOf": {
      const raw = response[rule.field];
      return rule.values.some((v) =>
        typeof v === "number" ? Number(raw) === v : norm(raw) === norm(v),
      );
    }
    case "actionCountAtLeast": {
      const n = Number(response[rule.field]);
      return !Number.isNaN(n) && n >= rule.min;
    }
    case "actionPlanMatches": {
      const plan = response[rule.field];
      if (!Array.isArray(plan)) return false;
      const key = JSON.stringify(plan);
      return rule.acceptedPlans.some((p) => JSON.stringify(p) === key);
    }
    case "composite": {
      const results = rule.rules.map((r) => evalRule(r, response));
      return rule.mode === "all" ? results.every(Boolean) : results.some(Boolean);
    }
    default:
      return false;
  }
}

export interface ValidationOutcome {
  correct: boolean;
  matchedAlternative: boolean;
  errorTypes: string[];
}

export function validateTaskResponse(
  response: Record<string, unknown>,
  validationRules: ValidationRule[],
  canonicalAnswer: Record<string, unknown>,
  acceptedSolutions: Record<string, unknown>[] | undefined,
  configuredErrorTypes: string[],
): ValidationOutcome {
  const primaryOk = validationRules.every((r) => evalRule(r, response));
  if (primaryOk) {
    return { correct: true, matchedAlternative: false, errorTypes: [] };
  }

  const altOk =
    acceptedSolutions?.some((alt) =>
      validationRules.every((r) => evalRule(r, { ...response, ...alt })),
    ) ?? false;

  if (altOk) {
    return { correct: true, matchedAlternative: true, errorTypes: [] };
  }

  // Диагностические error types — эвристика по полю value
  const errors: string[] = [];
  if (configuredErrorTypes.length) {
    errors.push(configuredErrorTypes[0]);
  }
  void canonicalAnswer;
  return { correct: false, matchedAlternative: false, errorTypes: errors };
}

export function validateAllRules(rules: ValidationRule[], response: Record<string, unknown>): boolean {
  return rules.every((r) => evalRule(r, response));
}
