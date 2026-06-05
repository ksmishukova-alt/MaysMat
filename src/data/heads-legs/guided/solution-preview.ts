import type { SolutionLine } from "../types";

/** Эталонный текст решения с подставленными ответами */
export function buildSolutionPreviewLines(lines: SolutionLine[]): string[] {
  return lines.map((line) => {
    let bi = 0;
    return line.template.replace(/\[([^\]]*)\]/g, () => {
      const blank = line.blanks[bi++];
      if (!blank) return "___";
      const raw = Array.isArray(blank.accept) ? blank.accept[0] : blank.accept;
      return raw != null ? String(raw) : "___";
    });
  });
}
