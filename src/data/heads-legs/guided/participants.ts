import type { DragOption } from "@/data/tasks";
import type { HeadsLegsEntity, SolutionLine } from "../types";
import { resolveEntityEmoji } from "@/lib/entity-emoji";
import { entitiesFromOverride } from "./entity-overrides";

const DISTRACTORS: DragOption[] = [
  { id: "fish", label: "Рыбы", emoji: "🐟", correct: false },
  { id: "insects", label: "Насекомые", emoji: "🐛", correct: false },
  { id: "people", label: "Люди", emoji: "🧑", correct: false },
  { id: "cars", label: "Машины", emoji: "🚗", correct: false },
  { id: "plants", label: "Растения", emoji: "🌿", correct: false },
];

function cap(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function cleanToken(raw: string): string {
  return raw.replace(/[.,;:!?«»"()—–-]/g, "").trim();
}

function normalizeObjectLabel(raw: string): string | null {
  let s = raw.trim();
  if (!s || s.length > 48) return null;
  if (/^\d/.test(s)) return null;

  const map: Record<string, string> = {
    двухколёсными: "Двухколёсные",
    двухколесными: "Двухколёсные",
    трехколесными: "Трёхколёсные",
    трёхколёсными: "Трёхколёсные",
    дроидами: "Дроиды",
    гимназии: "Клумбы у Гимназии",
    лицея: "Клумбы у Лицея",
    третьеклассниками: "Третьеклассники",
    пятиклассниками: "Пятиклассники",
  };

  const lower = s.toLowerCase();
  if (map[lower]) return map[lower];

  s = s.replace(/(?:ами|ями|ами|ов|ев|ей)$/i, (m) => {
    if (/ами$|ями$/i.test(m)) return "и";
    if (/ов$|ев$|ей$/i.test(m)) return "ы";
    return m;
  });

  return cap(s);
}

const SKIP = new Set([
  "всего",
  "было",
  "имеет",
  "имеется",
  "сколько",
  "каждый",
  "каждая",
  "каждому",
  "живут",
  "сидят",
  "лежало",
  "лежали",
  "видов",
  "двух",
  "трех",
  "трёх",
  "четырех",
  "четырёх",
  "некоторых",
  "остальных",
  "других",
  "разных",
  "один",
  "два",
  "три",
]);

function pairFromMatch(a: string, b: string): HeadsLegsEntity[] | null {
  const x = cleanToken(a);
  const y = cleanToken(b);
  if (SKIP.has(x.toLowerCase()) || SKIP.has(y.toLowerCase())) return null;
  if (x.length < 3 || y.length < 3) return null;
  return [
    { id: "type1", label: cap(x) },
    { id: "type2", label: cap(y) },
  ];
}

function inferFromCondition(condition: string): HeadsLegsEntity[] | null {
  const patterns: RegExp[] = [
    /четвероног(?:ие|их|ий)?\s+(\S+).*?двуног(?:ие|их|ий)?\s+(\S+)/i,
    /(\S+)\s+и\s+(\S+)\s+играют/i,
    /([а-яё-]+)\s+и\s+([а-яё-]+),\s*всего/i,
    /([а-яё-]+)\s+и\s+([а-яё-]+)\s+собирали/i,
    /([а-яё-]+)\s+и\s+([а-яё-]+)\s+сидят/i,
    /([а-яё-]+)\s+и\s+([а-яё-]+)\s+бегают/i,
    /([а-яё-]+)\s+и\s+([а-яё-]+)\s+живут/i,
    /([а-яё-]+)\s+и\s+([а-яё-]+)\s+водятся/i,
    /([а-яё-]+)\s+и\s+([а-яё-]+)\s+сражаются/i,
    /([а-яё-]+)\s+и\s+([а-яё-]+)\s+получили/i,
    /([а-яё-]+)\s+и\s+([а-яё-]+)\s+охотились/i,
    /([а-яё-]+)\s+и\s+([а-яё-]+)\s+съели/i,
    /([а-яё-]+)\s+и\s+([а-яё-]+)\s+скормили/i,
    /([а-яё-]+)\s+и\s+([а-яё-]+)\s+играют/i,
    /([а-яё-]+)\s+и\s+([а-яё-]+)\s+находятся/i,
    /([а-яё-]+)\s+и\s+([а-яё-]+)\s+—/i,
    /([а-яё-]+)\s+и\s+([а-яё-]+)\s+-\s+/i,
    /([а-яё-]+),\s*а\s+(?:из\s+остальных\s+)?(?:—\s*)?([а-яё-]+)/i,
    /некотор(?:ые|ых)\s+(\S+).{0,80}?остальн.{0,40}?(\S+?)(?:\.|,|\s+в|\s+при)/i,
    /(?:кажд(?:ый|ая|ому|ой))\s+(\S+).{0,60}?(?:кажд(?:ый|ая|ому|ой))\s+(\S+)/i,
    /(двух\w+)\s+и\s+(тр[её]х\w+)/i,
    /(тр[её]х\w+)\s+(\S+)\s+и\s+(четыр[её]х\w+)/i,
    /(одноголов\w+\s+\S+)\s+и\s+(\w+голов\w+\s+\S+)/i,
    /(двухголов\w+\s+\S+)\s+и\s+(\w+голов\w+\s+\S+)/i,
    /около\s+(\S+).*?(?:а\s+)?(?:на\s+)?(?:каждой\s+)?(?:клумбе\s+)?около\s+(\S+)/i,
    /(больш\w+)\s+\S+.*?(\w+\w+)\s+—\s+по/i,
    /(\S+-рабоч\w+).*?(\S+-пастух\w+)/i,
    /(\d+\s+или\s+\d+).*?(третьеклассник|пятиклассник)/i,
    /(третьеклассник\w*).*?(пятиклассник\w*)/i,
    /(мальчик\w*).*?(девочк\w*)/i,
    /(собак\w*).*?(кошек|кошк\w*)/i,
    /(льв\w+).*?(тигр\w+)/i,
    /(сов\w+).*?(кот\w+)/i,
    /(жираф\w*).*?(страус\w*)/i,
    /(антилоп\w*).*?(единорог\w*)/i,
    /(бант\w*).*?(ранкор\w*)/i,
    /(бант\w*).*?(джав\w*)/i,
    /(импер\w+\s+\S+).*?(x-wing|республик)/i,
    /(ут\w+).*?(утконос\w*)/i,
    /(генерал\w*).*?(адмирал\w*)/i,
    /(\S+)\s+и\s+(\S+?)(?:,|\.|\s+всего|\s+име)/i,
  ];

  for (const re of patterns) {
    const m = condition.match(re);
    if (!m) continue;
    const pair = pairFromMatch(m[1], m[2]);
    if (pair) return pair;
  }

  if (/двухкол/i.test(condition) && /тр[её]хкол/i.test(condition)) {
    return [
      { id: "type1", label: "Двухколёсные" },
      { id: "type2", label: "Трёхколёсные" },
    ];
  }

  if (/дроид/i.test(condition) && /гривус/i.test(condition)) {
    return [
      { id: "type1", label: "Дроиды" },
      { id: "type2", label: "Генерал Гривус" },
    ];
  }

  if (/гном/i.test(condition) && /пони/i.test(condition)) {
    return [
      { id: "type1", label: "Гномы" },
      { id: "type2", label: "Пони" },
    ];
  }

  return null;
}

function inferFromSolutionLines(lines: SolutionLine[]): HeadsLegsEntity[] | null {
  const labels: string[] = [];

  for (const line of lines) {
    for (const blank of line.blanks) {
      if (blank.type !== "object") continue;
      const accepts = Array.isArray(blank.accept) ? blank.accept : blank.accept != null ? [blank.accept] : [];
      for (const a of accepts) {
        const label = normalizeObjectLabel(String(a));
        if (!label) continue;
        if (!labels.some((l) => l.toLowerCase() === label.toLowerCase())) {
          labels.push(label);
        }
      }
    }
  }

  if (labels.length >= 2) {
    return [
      { id: "type1", label: labels[0] },
      { id: "type2", label: labels[1] },
    ];
  }
  return null;
}

export function inferTaskEntities(
  condition: string,
  methodTaskId?: string,
  solutionLines?: SolutionLine[],
): HeadsLegsEntity[] {
  if (methodTaskId) {
    const override = entitiesFromOverride(methodTaskId);
    if (override) return override;
  }

  const fromCondition = inferFromCondition(condition);
  if (fromCondition) return fromCondition;

  if (solutionLines?.length) {
    const fromLines = inferFromSolutionLines(solutionLines);
    if (fromLines) return fromLines;
  }

  return [
    { id: "type1", label: "Вид 1" },
    { id: "type2", label: "Вид 2" },
  ];
}

export function buildParticipantStep(taskId: string, condition: string, entities: HeadsLegsEntity[]): {
  id: string;
  type: "drag_select";
  title: string;
  hint: string;
  options: DragOption[];
} {
  const thingy = /клумб|короб|стол|баз|ящик/i.test(condition);
  const title = thingy ? "Что участвует в задаче?" : "Кто участвует в задаче?";
  const hint = thingy
    ? "Выбери только то, о чём идёт речь в условии."
    : "Выбери только тех, о ком идёт речь в условии.";
  const correct = entities.map((e) => ({
    id: e.id,
    label: e.label.charAt(0).toUpperCase() + e.label.slice(1),
    emoji: resolveEntityEmoji(e.label, { id: e.id, role: "object" }),
    correct: true as const,
  }));

  const distractors = DISTRACTORS.filter(
    (d) => !correct.some((c) => c.label.toLowerCase().includes(d.label.toLowerCase())),
  ).slice(0, 3);

  return {
    id: `${taskId}-objects`,
    type: "drag_select",
    title,
    hint,
    options: [...correct, ...distractors],
  };
}
