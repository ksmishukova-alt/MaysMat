import type { WorksheetRow } from "@/data/tasks";
import type { DirichletInferredModel, DirichletTaskMeta } from "../types";

export interface AgeRange {
  lo: number;
  hi: number;
}

/** Диапазон возрастов из условия (младший … старший) */
export function detectAgeRange(condition: string): AgeRange | null {
  const patterns = [
    /старш[\s\S]*?(\d+)\s*лет[\s\S]*?младш[\s\S]*?(\d+)\s*лет/i,
    /младш[\s\S]*?(\d+)\s*лет[\s\S]*?старш[\s\S]*?(\d+)\s*лет/i,
    /от\s+(\d+)\s+.*?\s+(\d+)\s+лет/i,
  ];

  for (const re of patterns) {
    const m = condition.match(re);
    if (!m) continue;
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (!Number.isNaN(a) && !Number.isNaN(b)) {
      return { lo: Math.min(a, b), hi: Math.max(a, b) };
    }
  }
  return null;
}

function rabbitCountLabel(meta: DirichletTaskMeta, model: DirichletInferredModel): string {
  const label = model.rabbits[0]?.label?.toLowerCase() ?? "предметов";
  if (/турист/i.test(meta.condition)) return "туристов";
  if (/монет/i.test(meta.condition)) return "монет";
  if (/ученик|школьник/i.test(meta.condition)) return "учеников";
  if (/человек/i.test(meta.condition)) return "человек";
  if (/шестерен/i.test(meta.condition)) return "положений шестерёнки";
  if (/спич/i.test(meta.condition)) return "спичек / вершин";
  if (/гриб/i.test(meta.condition)) return "грибников";
  if (/футболист|игрок/i.test(meta.condition)) return "футболистов";
  return label;
}

function cellCountLabel(model: DirichletInferredModel): string {
  const cell = model.cells[0];
  const id = cell?.id ?? "";
  const label = cell?.label?.toLowerCase();
  if (id === "ages") return "различных возрастов (клеток)";
  if (id === "weekdays") return "дней недели (клеток)";
  if (id === "months") return "месяцев (клеток)";
  if (id === "year-days") return "дней года (клеток)";
  if (id === "coin-types" || id === "types") return "типов монет (клеток)";
  if (id === "colors" && label) return label;
  if (id === "categories" && label) return label;
  if (id === "numbers" && label) return label;
  if (label && label.length <= 40) return label;
  return "клеток (категорий)";
}

/** Подпись «зайцев» для шагов сравнения N и M */
export function describeRabbitCount(meta: DirichletTaskMeta, model: DirichletInferredModel): string {
  return rabbitCountLabel(meta, model);
}

/** Подпись «клеток» для шагов сравнения N и M */
export function describeCellCount(model: DirichletInferredModel): string {
  return cellCountLabel(model);
}

/** Строки worksheet «Подсчёт N и M» с учётом типа клеток */
export function buildCountWorksheetRows(
  meta: DirichletTaskMeta,
  model: DirichletInferredModel,
): WorksheetRow[] {
  const { n, m } = model.counts;
  const rows: WorksheetRow[] = [];
  const objectLabel = rabbitCountLabel(meta, model);
  const cellLabel = cellCountLabel(model);

  const ageRange = detectAgeRange(meta.condition);
  if (ageRange && n != null && m != null) {
    const { lo, hi } = ageRange;
    rows.push({
      id: "count-n",
      question: `Сколько «зайцев» — ${objectLabel} N?`,
      inputType: "number",
      answer: n,
    });
    rows.push({
      id: "count-m-range",
      question: `Младшему ${lo} лет, старшему ${hi}. Сколько ${cellLabel} M = ${hi} − ${lo} + 1?`,
      inputType: "number",
      answer: m,
      prefix: `${hi} − ${lo} + 1 =`,
    });
    return rows;
  }

  if (model.cells[0]?.id === "coin-types" || model.cells[0]?.id === "types") {
    if (n != null) {
      rows.push({
        id: "count-n",
        question: `Сколько «зайцев» — ${objectLabel} N?`,
        inputType: "number",
        answer: n,
      });
    }
    if (m != null) {
      rows.push({
        id: "count-m",
        question: "Сколько типов монет по достоинству (клеток) M?",
        inputType: "number",
        answer: m,
      });
    }
    return rows;
  }

  if (model.cells[0]?.id === "weekdays" && m === 7) {
    if (n != null) {
      rows.push({
        id: "count-n",
        question: `Сколько «зайцев» — ${objectLabel} N?`,
        inputType: "number",
        answer: n,
      });
    }
    rows.push({
      id: "count-m",
      question: "Сколько дней недели (клеток) M?",
      inputType: "number",
      answer: 7,
    });
    return rows;
  }

  if (model.cells[0]?.id === "months" && m === 12) {
    if (n != null) {
      rows.push({
        id: "count-n",
        question: `Сколько «зайцев» N?`,
        inputType: "number",
        answer: n,
      });
    }
    rows.push({
      id: "count-m",
      question: "Сколько месяцев в году (клеток) M?",
      inputType: "number",
      answer: 12,
    });
    return rows;
  }

  if (n != null) {
    rows.push({
      id: "count-n",
      question: `Сколько «зайцев» — ${objectLabel} N?`,
      inputType: "number",
      answer: n,
    });
  }
  if (m != null) {
    rows.push({
      id: "count-m",
      question: `Сколько «клеток» — ${cellLabel} M?`,
      inputType: "number",
      answer: m,
    });
  }

  if (rows.length === 0) {
    rows.push({
      id: "count-hint",
      question: "Выпиши N и M из условия на следующих шагах",
      inputType: "static",
      staticValue: "Сравни числа из условия",
    });
  }

  return rows;
}

export function inferMinInCell(model: DirichletInferredModel): number {
  if (model.counts.minInCell != null) return model.counts.minInCell;
  const { n, m } = model.counts;
  if (n != null && m != null && m > 0) return Math.ceil(n / m);
  return 2;
}

export function extractBooleanQuestion(condition: string): string | null {
  const m = condition.match(/(Верно\s+ли[^?]+\?|Обязательно\s+ли[^?]+\?)/i);
  return m?.[1]?.trim() ?? null;
}

export function isBooleanQuestion(condition: string): boolean {
  return /верно\s+ли|обязательно\s+ли|всегда\s+ли/i.test(condition);
}

export function expectsYesAnswer(meta: DirichletTaskMeta, model: DirichletInferredModel): boolean {
  const phrase = meta.acceptedAnswers.answerPhrase ?? model.conclusionText;
  if (/^(нет|не\s+всегда|не\s+верно|неверно|а-б\)\s*не)/i.test(phrase.trim())) return false;
  if (/^(да|верно|обязательно)/i.test(phrase.trim())) return true;
  return /найд|есть|двое|трое|четвер|можно/i.test(phrase);
}
