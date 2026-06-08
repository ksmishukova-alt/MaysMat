/** Извлечение чисел и операций из текста задачи для визуальных досок */
export function parseExpression(text: string): string | null {
  const m = text.match(/([\d\s:×x*+\-−]+=?)/);
  return m?.[1]?.replace(/\?$/, "").trim() ?? null;
}

export function parseBinaryOp(text: string): { a: number; b: number; op: string } | null {
  const m = text.match(/(\d+)\s*([+\-−×x*:])\s*(\d+)/);
  if (!m) return null;
  return { a: Number(m[1]), op: m[2], b: Number(m[3]) };
}

export function parseDivision(text: string): { dividend: number; divisor: number } | null {
  const m = text.match(/(\d+)\s*:\s*(\d+)/);
  if (!m) return null;
  return { dividend: Number(m[1]), divisor: Number(m[2]) };
}

export function parseGridSize(text: string): { w: number; h: number } | null {
  const m = text.match(/(\d+)\s*[×x*]\s*(\d+)/);
  if (!m) return null;
  return { w: Number(m[1]), h: Number(m[2]) };
}

export function extractNumbers(text: string): number[] {
  return [...text.matchAll(/\d+/g)].map((x) => Number(x[0]));
}
