import { blankMatches, validateWordSolution } from "@/lib/word-solution-validator";
import type { AcceptedAnswer } from "@/data/heads-legs/types";
import type { SolutionMode } from "@/data/heads-legs/solution-modes";
import type { SolutionLine } from "@/data/heads-legs/types";
import { validateModeABlanks } from "@/lib/word-solution-mode-a";

export function validateBlanks(
  blanks: Record<string, string>,
  solutionLines: SolutionLine[],
): { ok: boolean; message?: string } {
  for (let li = 0; li < solutionLines.length; li++) {
    const line = solutionLines[li];
    for (const blank of line.blanks) {
      const user = blanks[blank.id]?.trim() ?? "";
      if (!user) {
        return { ok: false, message: "Заполни все пропуски [ ] в тексте решения." };
      }
      if (!blankMatches(user, blank.accept)) {
        return { ok: false, message: "Есть неверный пропуск — проверь вычисления." };
      }
    }
  }
  return { ok: true };
}

export function validateWordSolutionFull(
  text: string,
  mode: SolutionMode,
  accepted: AcceptedAnswer,
  solutionLines: SolutionLine[] | undefined,
  blanks: Record<string, string>,
): { ok: boolean; message?: string } {
  if (mode === "A" && solutionLines?.length) {
    const blankResult = validateModeABlanks(blanks, solutionLines);
    if (blankResult.ok) return { ok: true };
    if (text.trim().length >= 40) {
      return validateWordSolution(text, mode, accepted, solutionLines);
    }
    return blankResult;
  }

  if ((mode === "B") && solutionLines?.length) {
    const blankResult = validateBlanks(blanks, solutionLines);
    if (blankResult.ok) return { ok: true };
    if (text.trim().length >= 40) {
      return validateWordSolution(text, mode, accepted, solutionLines);
    }
    return blankResult;
  }

  if (mode === "E" && solutionLines?.length) {
    const blankResult = validateBlanks(blanks, solutionLines);
    if (blankResult.ok) return { ok: true };
  }

  return validateWordSolution(text, mode, accepted, solutionLines);
}
