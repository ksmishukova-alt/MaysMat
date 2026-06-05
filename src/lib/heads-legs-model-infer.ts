import type { HeadsLegsEntity } from "@/data/heads-legs/types";

export interface ModelSlot {
  id: string;
  label: string;
  /** Допустимые числа из условия; пусто — любое число из пула */
  accept: number[];
  optional?: boolean;
}

export interface InferredModel {
  entities: HeadsLegsEntity[];
  numbers: number[];
  slots: ModelSlot[];
  featureLabel: string;
  totalObjectsKnown: boolean;
}

const FEATURE_PATTERNS: { re: RegExp; label: string; slotId: string }[] = [
  { re: /(\d+)\s+ног(?:и|а)?(?:\s|$|\.)/i, label: "ног", slotId: "totalFeature" },
  { re: /(\d+)\s+кол(?:ё|е)с(?:а|о)?(?:\s|$|\.)/i, label: "колёс", slotId: "totalFeature" },
  { re: /(\d+)\s+цвет(?:ов|ка|ков)(?:\s|$|\.)/i, label: "цветков", slotId: "totalFeature" },
  { re: /(\d+)\s+голов(?:ы|а|)?(?:\s|$|\.)/i, label: "голов", slotId: "totalObjects" },
  { re: /(\d+)\s+туловищ(?:а|)?(?:\s|$|\.)/i, label: "туловищ", slotId: "totalObjects" },
  { re: /(\d+)\s+яиц(?:а|)?(?:\s|$|\.)/i, label: "яиц", slotId: "totalObjects" },
  { re: /(\d+)\s+велосипедист(?:ов|а)?(?:\s|$|\.)/i, label: "велосипедистов", slotId: "totalObjects" },
  { re: /(\d+)\s+клумб(?:ах|ы|е|у|)?(?:\s|$|\.)/i, label: "клумб", slotId: "totalObjects" },
  { re: /(\d+)\s+руб(?:л(?:ей|я|ь)?)?(?:\s|$|\.)/i, label: "рублей", slotId: "totalFeature" },
  { re: /(\d+)\s+кг(?:\s|$|\.)/i, label: "кг", slotId: "totalFeature" },
  { re: /(\d+)\s+л(?:итр(?:ов|а)?)?(?:\s|$|\.)/i, label: "л", slotId: "totalFeature" },
  { re: /(\d+)\s+залп(?:ов|а)?(?:\s|$|\.)/i, label: "залпов", slotId: "totalFeature" },
];

function inferEntities(condition: string): HeadsLegsEntity[] {
  const pairs: [string, string][] = [];

  const andRe = /([а-яёa-z]{3,15})\s+и\s+([а-яёa-z]{3,15})/gi;
  let m: RegExpExecArray | null;
  while ((m = andRe.exec(condition)) !== null) {
    pairs.push([m[1], m[2]]);
  }

  const dashRe =
    /([а-яёa-z]{3,15}),\s*а\s+(?:из\s+остальных\s+)?(?:—\s*)?([а-яёa-z]{3,15})/i;
  const dash = condition.match(dashRe);
  if (dash) pairs.push([dash[1], dash[2]]);

  const someRe =
    /(?:некотор(?:ые|ых)\s+)?([а-яёa-z]{4,15}).{0,40}?остальн.{0,20}?([а-яёa-z]{4,15})/i;
  const some = condition.match(someRe);
  if (some) pairs.push([some[1], some[2]]);

  const skip = new Set(["всего", "было", "имеет", "имеется", "каждый", "каждая", "сколько"]);
  const best = pairs.find(([a, b]) => !skip.has(a.toLowerCase()) && !skip.has(b.toLowerCase()));

  if (best) {
    return [
      { id: "type1", label: best[0] },
      { id: "type2", label: best[1] },
    ];
  }

  return [
    { id: "type1", label: "Вид 1" },
    { id: "type2", label: "Вид 2" },
  ];
}

function extractNumbers(condition: string): number[] {
  const raw = condition.match(/\d+/g)?.map(Number) ?? [];
  const words: number[] = [];
  if (/одиннадцат(?:и|ь)/i.test(condition)) words.push(11);
  return [...new Set([...raw, ...words])];
}

function inferTotalObjectsFromWords(condition: string): number | null {
  if (/одиннадцат(?:и|ь)\s+клумб/i.test(condition)) return 11;
  return null;
}

function inferSlots(condition: string, numbers: number[]): ModelSlot[] {
  const slots: ModelSlot[] = [];
  const used = new Set<number>();
  let featureLabel = "признак";

  for (const pat of FEATURE_PATTERNS) {
    const hit = condition.match(pat.re);
    if (!hit) continue;
    const value = Number(hit[1]);
    if (Number.isNaN(value)) continue;

    const existing = slots.find((s) => s.id === pat.slotId);
    if (existing) {
      if (!existing.accept.includes(value)) existing.accept.push(value);
    } else {
      slots.push({
        id: pat.slotId,
        label:
          pat.slotId === "totalObjects"
            ? `Всего (${pat.label})`
            : `Общий признак (${pat.label})`,
        accept: [value],
      });
      if (pat.slotId === "totalFeature") featureLabel = pat.label;
    }
    used.add(value);
  }

  const wordObjects = inferTotalObjectsFromWords(condition);
  if (wordObjects != null) {
    const existing = slots.find((s) => s.id === "totalObjects");
    if (existing) {
      if (!existing.accept.includes(wordObjects)) existing.accept.push(wordObjects);
    } else {
      slots.push({
        id: "totalObjects",
        label: "Всего (клумб)",
        accept: [wordObjects],
      });
    }
    used.add(wordObjects);
  }

  if (!slots.some((s) => s.id === "totalObjects")) {
    slots.unshift({
      id: "totalObjects",
      label: "Всего объектов",
      accept: [],
      optional: true,
    });
  }

  if (!slots.some((s) => s.id === "totalFeature")) {
    const featureCandidates = numbers.filter((n) => !used.has(n));
    const accept =
      featureCandidates.length === 0
        ? []
        : [featureCandidates.length === 1 ? featureCandidates[0] : Math.max(...featureCandidates)];
    slots.push({
      id: "totalFeature",
      label: `Общий признак (${featureLabel})`,
      accept,
      optional: numbers.length === 0,
    });
  }

  return slots;
}

export function inferModelFromCondition(condition: string): InferredModel {
  const entities = inferEntities(condition);
  const numbers = extractNumbers(condition);
  const slots = inferSlots(condition, numbers);
  const totalObjectsKnown = slots.some(
    (s) => s.id === "totalObjects" && s.accept.length > 0,
  );
  const featureLabel =
    slots.find((s) => s.id === "totalFeature")?.label.replace(/^Общий признак \(/, "").replace(/\)$/, "") ??
    "признак";

  return { entities, numbers, slots, featureLabel, totalObjectsKnown };
}

export function validateModelPlacement(
  slots: ModelSlot[],
  placement: Record<string, number | null>,
  missingData: boolean,
): { ok: boolean; message?: string } {
  if (missingData) {
    const totalSlot = slots.find((s) => s.id === "totalObjects");
    if (totalSlot?.optional) return { ok: true };
  }

  for (const slot of slots) {
    const value = placement[slot.id];
    if (slot.optional && (value == null || missingData)) continue;
    if (value == null) {
      return { ok: false, message: `Перетащи число в слот «${slot.label}».` };
    }
    if (slot.accept.length > 0 && !slot.accept.includes(value)) {
      return { ok: false, message: `Число для «${slot.label}» не совпадает с условием.` };
    }
  }

  const placed = Object.values(placement).filter((v) => v != null).length;
  if (placed < 1 && !missingData) {
    return { ok: false, message: "Перетащи хотя бы одно число из условия в модель." };
  }

  return { ok: true };
}
