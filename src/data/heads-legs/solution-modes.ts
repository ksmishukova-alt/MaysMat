export type SolutionMode = "A" | "B" | "C" | "D" | "E";

export function normalizeSolutionMode(raw: string): SolutionMode {
  const letter = raw.charAt(0).toUpperCase();
  if (letter === "A" || letter === "B" || letter === "C" || letter === "D" || letter === "E") {
    return letter;
  }
  return "B";
}
