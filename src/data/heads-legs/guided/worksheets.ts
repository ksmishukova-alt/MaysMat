import type { WorksheetRow } from "@/data/tasks";
import type { HeadsLegsEntity, HeadsLegsTaskMeta, SolutionBlank, SolutionLine } from "../types";
import type { FlowProfile } from "./task-flow";
import { buildContextualQuestion, buildWorksheetContext } from "./worksheet-questions";

function blankAnswer(blank: SolutionBlank): number | undefined {
  const accepts = Array.isArray(blank.accept) ? blank.accept : blank.accept != null ? [blank.accept] : [];
  for (const a of accepts) {
    if (typeof a === "number") return a;
    const s = String(a).trim();
    const afterEq = s.match(/=\s*(\d+(?:[.,]\d+)?)/);
    if (afterEq) return Number(afterEq[1].replace(",", "."));
    if (/^\d+$/.test(s)) return Number(s);
  }
  return undefined;
}

function shouldSkipLine(line: SolutionLine, profile: FlowProfile): boolean {
  const t = line.template;
  if (/^Представим,\s*что\s+все/i.test(t)) return true;
  if (profile === "diagnostic") {
    if (/не сказано|по смыслу участвовали|можно получить разные|единственный ответ/i.test(t)) {
      return true;
    }
    if (line.blanks.every((b) => b.type === "object" || b.type === "conclusion")) return true;
  }
  if (line.blanks.every((b) => b.type === "object" || b.type === "conclusion")) return true;
  return false;
}

function lineToRows(
  line: SolutionLine,
  lineIndex: number,
  profile: FlowProfile,
  ctx: ReturnType<typeof buildWorksheetContext>,
): WorksheetRow[] {
  if (shouldSkipLine(line, profile)) return [];

  const rows: WorksheetRow[] = [];
  const fillable = line.blanks.filter((b) => b.type === "number" || b.type === "expression");
  if (fillable.length === 0) return rows;

  for (let bi = 0; bi < line.blanks.length; bi++) {
    const blank = line.blanks[bi];
    if (blank.type === "object" || blank.type === "conclusion") continue;

    const ans = blankAnswer(blank);
    if (ans == null) continue;

    const raw = Array.isArray(blank.accept) ? blank.accept[0] : blank.accept;
    const rawStr = String(raw ?? "");
    const id = `L${lineIndex}-b${bi}`;
    const question = buildContextualQuestion(line.template, blank, ctx);

    if (blank.type === "expression" && /[=]/.test(rawStr)) {
      rows.push({
        id,
        question,
        inputType: "formula",
        prefix: `${rawStr.split("=")[0].trim()} =`,
        answer: ans,
      });
    } else {
      rows.push({ id, question, inputType: "number", answer: ans });
    }
  }

  return rows;
}

function chunkLines(lines: SolutionLine[], parts: 3): [SolutionLine[], SolutionLine[], SolutionLine[]] {
  const n = lines.length;
  if (n <= 3) return [lines.slice(0, 1), lines.slice(1, 2), lines.slice(2)];
  const a = Math.max(1, Math.ceil(n / 3));
  const b = Math.max(a + 1, Math.ceil((2 * n) / 3));
  return [lines.slice(0, a), lines.slice(a, b), lines.slice(b)];
}

function calcTrialHint(condition: string): string {
  if (/клумб/i.test(condition)) return "Сделай пробный расчёт — как будто все клумбы одного вида.";
  if (/короб/i.test(condition)) return "Сделай пробный расчёт — как будто все коробки одного вида.";
  return "Сделай пробный расчёт — как будто все объекты одного вида.";
}

export function buildCalcWorksheets(
  taskId: string,
  lines: SolutionLine[],
  profile: FlowProfile,
  meta: HeadsLegsTaskMeta,
  entities: HeadsLegsEntity[],
): Array<{
  id: string;
  type: "worksheet_table";
  title: string;
  hint: string;
  successMessage?: string;
  worksheetRows: WorksheetRow[];
}> {
  const ctx = buildWorksheetContext(meta, entities, lines);
  const [part1, part2, part3] = chunkLines(lines, 3);

  const mk = (part: SolutionLine[], idx: 1 | 2 | 3, hint: string, success?: string) => {
    const rows = part.flatMap((line, i) => lineToRows(line, i, profile, ctx));
    if (rows.length === 0) return null;
    return {
      id: `${taskId}-calc-${idx}`,
      type: "worksheet_table" as const,
      title: `${idx === 1 ? "Пробная картина" : idx === 2 ? "Сравнение и разница" : "Шаг замены и ответ"}`,
      hint,
      successMessage: success,
      worksheetRows: rows,
    };
  };

  const trialHint = calcTrialHint(meta.condition);

  const sheets = [
    mk(part1, 1, trialHint, "Верно! Сравним с условием."),
    mk(part2, 2, "Сравни с условием, найди разницу и шаг замены.", "Отлично! Осталось записать ответ."),
    mk(part3, 3, "Запиши итоговые количества.", "Числовой ответ готов!"),
  ].filter(Boolean) as ReturnType<typeof buildCalcWorksheets>;

  if (sheets.length === 1) sheets[0].title = "Решение по шагам";

  return sheets;
}
