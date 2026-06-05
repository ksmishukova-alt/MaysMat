/** Текст строки решения для карточки порядка (без содержимого пропусков) */
export function solutionLinePreview(template: string): string {
  return template.replace(/\[[^\]]*\]/g, "___");
}
