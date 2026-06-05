import type { SolutionLine } from "@/data/heads-legs/types";
import { blankMatches } from "@/lib/word-solution-validator";

/** Проверка порядка строк: на позиции i должна быть исходная строка i */
export function validateLineOrder(order: number[], lineCount: number): boolean {
  if (order.length !== lineCount) return false;
  return order.every((originalIndex, position) => originalIndex === position);
}

export function validateModeABlanks(
  blanks: Record<string, string>,
  solutionLines: SolutionLine[],
): { ok: boolean; message?: string } {
  for (let li = 0; li < solutionLines.length; li++) {
    const line = solutionLines[li];
    for (const blank of line.blanks) {
      const user = blanks[blank.id]?.trim() ?? "";
      if (!user) {
        return { ok: false, message: "Заполни все пропуски — перетащи карточки или введи вручную." };
      }
      if (!blankMatches(user, blank.accept)) {
        return { ok: false, message: "Есть неверная вставка — проверь числа и слова." };
      }
    }
  }
  return { ok: true };
}

/** Уникальные значения для банка карточек вставок */
export function buildBlankChipPool(solutionLines: SolutionLine[]): string[] {
  const seen = new Set<string>();
  const pool: string[] = [];
  for (const line of solutionLines) {
    for (const blank of line.blanks) {
      const accepts = Array.isArray(blank.accept) ? blank.accept : blank.accept != null ? [blank.accept] : [];
      for (const raw of accepts) {
        const label = String(raw).trim();
        if (!label || seen.has(label)) continue;
        seen.add(label);
        pool.push(label);
      }
    }
  }
  return pool;
}

export function shuffleIds<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
