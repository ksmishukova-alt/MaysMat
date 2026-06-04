export function formatStreakDays(days: number): string {
  const n = Math.abs(days) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return "дн. серии";
  if (n1 === 1) return "день серии";
  if (n1 >= 2 && n1 <= 4) return "дня серии";
  return "дн. серии";
}
