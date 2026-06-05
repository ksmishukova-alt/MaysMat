import type { TableRow } from "@/data/tasks";
import type { HeadsLegsEntity, HeadsLegsTaskMeta, SolutionBlank, SolutionLine } from "../types";
import { inferFeatureTable, featureStepMeta } from "./feature-table";
import { inferFeatureSumLabel } from "./feature-overrides";

export interface WorksheetContext {
  entities: HeadsLegsEntity[];
  featureByEntityId: Record<string, number>;
  /** Норма на один объект (ног на зверя, цветков на клумбе…) */
  featureUnit: string;
  /** Суммарный признак из условия (всего ног, всего цветков…) */
  featureSumUnit: string;
  featureLabel: string;
  totalObjects: number | null;
  totalFeature: number | null;
  assumedEntity: HeadsLegsEntity | null;
  otherEntity: HeadsLegsEntity | null;
  objectUnit: string;
}

function blankNum(blank: SolutionBlank): number | undefined {
  const accepts = Array.isArray(blank.accept) ? blank.accept : blank.accept != null ? [blank.accept] : [];
  for (const a of accepts) {
    if (typeof a === "number") return a;
    const s = String(a).trim();
    const m = s.match(/=\s*(\d+(?:[.,]\d+)?)/);
    if (m) return Number(m[1].replace(",", "."));
    if (/^\d+$/.test(s)) return Number(s);
  }
  return undefined;
}

function normalizeObjectLabel(raw: string): string {
  return raw
    .replace(/(?:ами|ями|ов|ев|ей)$/i, "")
    .replace(/^./, (c) => c.toUpperCase());
}

function matchEntity(label: string, entities: HeadsLegsEntity[]): HeadsLegsEntity | null {
  const key = label.toLowerCase().replace(/[^а-яёa-z]/g, "");
  for (const e of entities) {
    const ek = e.label.toLowerCase().replace(/[^а-яёa-z]/g, "");
    if (key.includes(ek.slice(0, 4)) || ek.includes(key.slice(0, 4))) return e;
  }
  return null;
}

function inferAssumedEntity(lines: SolutionLine[], entities: HeadsLegsEntity[]): HeadsLegsEntity | null {
  for (const line of lines) {
    if (!/^Представим/i.test(line.template)) continue;
    for (const b of line.blanks) {
      if (b.type !== "object") continue;
      const raw = Array.isArray(b.accept) ? String(b.accept[0] ?? "") : String(b.accept ?? "");
      return matchEntity(normalizeObjectLabel(raw), entities) ?? entities[1] ?? entities[0] ?? null;
    }
  }
  return entities[1] ?? entities[0] ?? null;
}

function parseTotalFeature(condition: string): number | null {
  const m =
    condition.match(/(\d+)\s+ног/i) ??
    condition.match(/(\d+)\s+мыш/i) ??
    condition.match(/(\d+)\s+конфет/i) ??
    condition.match(/(\d+)\s+цвет(?:ов|ка|ков)/i) ??
    condition.match(/(\d+)\s+кол(?:ё|е)с/i) ??
    condition.match(/(\d+)\s+ящик/i) ??
    condition.match(/(\d+)\s+задач/i);
  return m ? Number(m[1]) : null;
}

function parseTotalObjectsFromCondition(condition: string): number | null {
  if (/одиннадцат(?:и|ь)\s+клумб/i.test(condition)) return 11;
  const m =
    condition.match(/(\d+)\s+голов/i) ??
    condition.match(/(\d+)\s+животн/i) ??
    condition.match(/(\d+)\s+яиц/i) ??
    condition.match(/(\d+)\s+детёныш/i) ??
    condition.match(/(\d+)\s+человек/i) ??
    condition.match(/(\d+)\s+студ/i) ??
    condition.match(/(\d+)\s+стол/i) ??
    condition.match(/(\d+)\s+клумб/i);
  return m ? Number(m[1]) : null;
}

function parseTotalObjects(condition: string, meta: HeadsLegsTaskMeta): number | null {
  if (meta.totals?.totalObjects != null) return meta.totals.totalObjects;
  return parseTotalObjectsFromCondition(condition);
}

export function buildWorksheetContext(
  meta: HeadsLegsTaskMeta,
  entities: HeadsLegsEntity[],
  lines: SolutionLine[],
): WorksheetContext {
  const featureRows = inferFeatureTable(meta.condition, entities, lines, meta.methodTaskId) ?? [];
  const featMeta = featureStepMeta(meta.condition, meta.methodTaskId);

  const featureByEntityId: Record<string, number> = {};
  featureRows.forEach((row: TableRow, i: number) => {
    const id = entities[i]?.id ?? `type${i + 1}`;
    featureByEntityId[id] = row.answer;
  });

  const assumed = inferAssumedEntity(lines, entities);
  const other =
    entities.find((e) => e.id !== assumed?.id) ?? (entities.length > 1 ? entities[0] : null);

  let totalObjects = parseTotalObjects(meta.condition, meta);
  if (totalObjects == null) {
    for (const line of lines) {
      if (!/^Представим/i.test(line.template)) continue;
      const nb = line.blanks.find((b) => b.type === "number");
      if (nb) {
        const n = blankNum(nb);
        if (n != null) totalObjects = n;
      }
      break;
    }
  }

  const objectUnit = /\d+\s+голов/i.test(meta.condition)
    ? "животных"
    : /яиц|детёныш/i.test(meta.condition)
      ? "детёнышей"
      : /клумб/i.test(meta.condition)
        ? "клумб"
        : /ученик|человек|класс/i.test(meta.condition)
          ? "учеников"
          : /охотник|совён|котён/i.test(meta.condition)
            ? "охотников"
            : "объектов";

  return {
    entities,
    featureByEntityId,
    featureUnit: featMeta.columnLabel.toLowerCase(),
    featureSumUnit: inferFeatureSumLabel(featMeta.columnLabel).toLowerCase(),
    featureLabel: featMeta.columnLabel,
    totalObjects,
    totalFeature: meta.totals?.totalFeature ?? parseTotalFeature(meta.condition),
    assumedEntity: assumed,
    otherEntity: other,
    objectUnit,
  };
}

type ParsedExpr = { left: number; right: number; op: "mul" | "sub" | "div" | "add" };

function exprBeforeEquals(raw: string): string {
  const eq = raw.indexOf("=");
  return (eq >= 0 ? raw.slice(0, eq) : raw).trim();
}

function parseExpression(raw: string): ParsedExpr | null {
  const s = exprBeforeEquals(raw).replace(/,/g, ".").replace(/\s+/g, " ");
  const hasMul = /[x×*]/i.test(s);
  const hasSub = /[-−]/.test(s);
  const hasAdd = /\+/.test(s);
  if ((hasSub && hasMul) || (hasAdd && (hasMul || hasSub)) || (hasSub && (s.match(/[-−]/g)?.length ?? 0) > 1)) {
    return null;
  }
  if (hasAdd && !hasMul && !hasSub) {
    const m = s.match(/(\d+(?:\.\d+)?)\s*\+\s*(\d+(?:\.\d+)?)/);
    if (m) return { left: Number(m[1]), right: Number(m[2]), op: "add" };
  }
  let m = s.match(/(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)/i);
  if (m) return { left: Number(m[1]), right: Number(m[2]), op: "mul" };
  m = s.match(/(\d+(?:\.\d+)?)\s*[-−]\s*(\d+(?:\.\d+)?)/);
  if (m) return { left: Number(m[1]), right: Number(m[2]), op: "sub" };
  m = s.match(/(\d+(?:\.\d+)?)\s*[÷/:]\s*(\d+(?:\.\d+)?)/);
  if (m) return { left: Number(m[1]), right: Number(m[2]), op: "div" };
  return null;
}

function templateStem(template: string): string {
  return template.replace(/\[[^\]]*\]/g, "___").replace(/\s+/g, " ").trim();
}

function moneyUnit(template: string): string {
  if (/рубл|₽/i.test(template)) return "рублей";
  if (/кредит/i.test(template)) return "кредитов";
  return "";
}

function entityAt(template: string, ctx: WorksheetContext): HeadsLegsEntity | null {
  const t = template.toLowerCase();
  if (/гимназ/i.test(t)) {
    const e = ctx.entities.find((ent) => /гимназ/i.test(ent.label));
    if (e) return e;
  }
  if (/лице/i.test(t)) {
    const e = ctx.entities.find((ent) => /лице/i.test(ent.label));
    if (e) return e;
  }
  for (const e of ctx.entities) {
    const k = e.label.toLowerCase().slice(0, 4);
    if (k.length >= 3 && t.includes(k)) return e;
  }
  if (/звер/i.test(t)) return ctx.entities.find((e) => /звер/i.test(e.label)) ?? ctx.otherEntity;
  if (/птиц/i.test(t)) return ctx.entities.find((e) => /птиц/i.test(e.label)) ?? ctx.assumedEntity;
  if (/крокодил/i.test(t)) return ctx.entities.find((e) => /крокодил/i.test(e.label)) ?? ctx.otherEntity;
  if (/гус/i.test(t)) return ctx.entities.find((e) => /гус/i.test(e.label)) ?? ctx.assumedEntity;
  if (/сов/i.test(t)) return ctx.entities.find((e) => /сов/i.test(e.label)) ?? ctx.otherEntity;
  if (/кот/i.test(t)) return ctx.entities.find((e) => /кот/i.test(e.label)) ?? ctx.assumedEntity;
  if (/мальчик/i.test(t)) return ctx.entities.find((e) => /мальчик/i.test(e.label)) ?? ctx.entities[0];
  if (/девоч/i.test(t)) return ctx.entities.find((e) => /девоч/i.test(e.label)) ?? ctx.entities[1];
  if (/утят|утён/i.test(t)) return ctx.entities.find((e) => /ут/i.test(e.label)) ?? ctx.entities[0];
  if (/утконос/i.test(t)) return ctx.entities.find((e) => /утконос/i.test(e.label)) ?? ctx.entities[1];
  if (/дрон/i.test(t)) return ctx.entities.find((e) => /дрон/i.test(e.label)) ?? ctx.otherEntity;
  if (/короб/i.test(t)) return ctx.entities.find((e) => /короб/i.test(e.label)) ?? ctx.otherEntity;
  if (/баз/i.test(t)) return ctx.entities.find((e) => /баз|генерал|адмирал|дипломат/i.test(e.label)) ?? ctx.otherEntity;
  if (/велосип/i.test(t)) return ctx.entities.find((e) => /велосип|кол/i.test(e.label)) ?? ctx.otherEntity;
  if (/пирож/i.test(t)) return ctx.entities.find((e) => /пирож/i.test(e.label)) ?? ctx.otherEntity;
  if (/сороконож/i.test(t)) return ctx.entities.find((e) => /сороконож/i.test(e.label)) ?? ctx.entities[0];
  if (/дракон/i.test(t)) return ctx.entities.find((e) => /дракон/i.test(e.label)) ?? ctx.entities[1];
  return ctx.otherEntity;
}

function featOf(entity: HeadsLegsEntity | null, ctx: WorksheetContext): number | null {
  if (!entity) return null;
  return ctx.featureByEntityId[entity.id] ?? null;
}

function numLabel(n: number, ctx: WorksheetContext): string {
  if (ctx.totalFeature != null && n === ctx.totalFeature) {
    return `${n} ${ctx.featureSumUnit} по условию`;
  }
  if (ctx.totalObjects != null && n === ctx.totalObjects) return `${n} ${ctx.objectUnit}`;
  return String(n);
}

function perObjectPhrase(ctx: WorksheetContext, perOne: number): string {
  if (/клумб/i.test(ctx.objectUnit)) {
    return `на каждой по ${perOne} ${ctx.featureUnit}`;
  }
  return `у каждого ${perOne} ${ctx.featureUnit}`;
}

export function buildContextualQuestion(
  template: string,
  blank: SolutionBlank,
  ctx: WorksheetContext,
): string {
  const t = template.toLowerCase();
  const stem = templateStem(template);
  const raw = Array.isArray(blank.accept) ? String(blank.accept[0] ?? "") : String(blank.accept ?? "");
  const expr = blank.type === "expression" ? parseExpression(raw) : null;
  const rawExpr = exprBeforeEquals(raw);

  if (blank.type === "number") {
    if (/по условию/i.test(template)) {
      return `Сколько ${ctx.featureSumUnit} всего по условию задачи?`;
    }
    const before = template.replace(/\[[^\]]*\]/g, "").trim();
    if (before.length > 6 && before.length <= 100) return `${before} — введи число.`;
  }

  if (expr?.op === "add") {
    if (/частей|в группе|велосипед|матч|очк/i.test(t)) {
      return `${stem} — посчитай сумму (${expr.left} + ${expr.right}).`;
    }
  }

  if (expr?.op === "mul" && /тогда|было бы|поймал|съел|получил|стоил|то есть|у них|захвачено|набрали|карандаш|кредит|рубл|ящик|цветк|клумб/i.test(t)) {
    const assumed = ctx.assumedEntity;
    const perOne = featOf(assumed, ctx) ?? expr.right;
    const label = assumed?.label.toLowerCase() ?? "объектов";
    if (/то есть|пар/i.test(t) && ctx.totalObjects != null && expr.left === ctx.totalObjects) {
      return `Сколько ${ctx.featureSumUnit} на ${expr.left} ${ctx.objectUnit}? (${expr.left} × ${expr.right})`;
    }
    return `Сколько ${ctx.featureSumUnit} было бы на ${expr.left} ${ctx.objectUnit}, если все — ${label} (${perObjectPhrase(ctx, perOne)})?`;
  }

  if (expr?.op === "mul") {
    const ent = entityAt(template, ctx);
    if (ent) {
      const per = featOf(ent, ctx) ?? expr.right;
      const name = ent.label.toLowerCase();
      if (/было|будет|получ|захвач|утят|птиц|звер|баз|генерал|короб|дрон|стол|ног|лап|колес|колёс|ящик|пленник|голов|цветк|клумб/i.test(t)) {
        return `Сколько ${ctx.featureUnit} ${name}? (${expr.left} × ${per})`;
      }
    }
    if (/раз\s+больше|утят|утконос/i.test(t)) {
      return `Сколько утят, если их в ${expr.right} раза больше, чем утконосиков (${expr.right} × ${expr.left})?`;
    }
    if (ctx.totalObjects != null && expr.left === ctx.totalObjects && ctx.assumedEntity) {
      const per = featOf(ctx.assumedEntity, ctx) ?? expr.right;
      return `Сколько ${ctx.featureSumUnit} на ${expr.left} ${ctx.objectUnit}, если все — ${ctx.assumedEntity.label.toLowerCase()} (${perObjectPhrase(ctx, per)})?`;
    }
  }

  if (expr?.op === "sub" && /не хватает/i.test(t)) {
    return `На сколько ${ctx.featureUnit} не хватает до ${numLabel(expr.left, ctx)}? (${expr.left} − ${expr.right})`;
  }

  if (expr?.op === "sub" && /лишн/i.test(t)) {
    const unit = moneyUnit(template) || ctx.featureSumUnit;
    return `Сколько лишних ${unit}? (${numLabel(expr.left, ctx)} − ${expr.right})`;
  }

  if (expr?.op === "sub" && /дороже|дешевле/i.test(t)) {
    const unit = moneyUnit(template) || ctx.featureUnit;
    const who = entityAt(template, ctx)?.label.toLowerCase() ?? "одного вида";
    return `На сколько ${unit} дороже ${who}? (${expr.left} − ${expr.right})`;
  }

  if (expr?.op === "sub" && /добавляет|больше|ловит на|съедает на|вместо|даёт|дает|добавля/i.test(t)) {
    const high = ctx.entities.find((e) => featOf(e, ctx) === expr.left) ?? ctx.otherEntity;
    const low = ctx.entities.find((e) => featOf(e, ctx) === expr.right) ?? ctx.assumedEntity;
    const a = high?.label.toLowerCase() ?? "одного";
    const b = low?.label.toLowerCase() ?? "другого";
    return `На сколько ${ctx.featureUnit} больше у ${a}, чем у ${b}? (${expr.left} − ${expr.right})`;
  }

  if (expr?.op === "div") {
    const ent = entityAt(template, ctx);
    const name = ent?.label.toLowerCase() ?? "объектов этого вида";
    if (/часть|одна часть|равна/i.test(t)) {
      return `Чему равна одна часть? (${numLabel(expr.left, ctx)} ÷ ${expr.right})`;
    }
    if (/групп|таких/i.test(t)) {
      return `Сколько таких групп? (${numLabel(expr.left, ctx)} ÷ ${expr.right})`;
    }
    return `Сколько ${name}? (${numLabel(expr.left, ctx)} ÷ ${expr.right})`;
  }

  if (expr?.op === "sub" && /было|осталось|остались|имеют|остальн|остал|без|минус|остаётся|остается/i.test(t)) {
    const ent = entityAt(template, ctx);
    const name = ent?.label.toLowerCase() ?? stem.replace(/___.*$/, "").trim().toLowerCase();
    if (/ящик|стол|баз|пленник|карандаш|дрон|пирож/i.test(t)) {
      return `${stem} — посчитай (${numLabel(expr.left, ctx)} − ${expr.right}).`;
    }
    const left =
      ctx.totalObjects != null && expr.left === ctx.totalObjects
        ? `${expr.left} ${ctx.objectUnit}`
        : numLabel(expr.left, ctx);
    return `Сколько ${name}? (${left} − ${expr.right})`;
  }

  if (expr?.op === "mul" && /поймал|съел|получил|вырезал/i.test(t)) {
    const ent = entityAt(template, ctx);
    const per = featOf(ent, ctx) ?? expr.right;
    const name = ent?.label.toLowerCase() ?? "объектов";
    return `Сколько ${ctx.featureUnit} ${/поймал/i.test(t) ? "поймали" : "получилось"} у ${name}? (${expr.left} × ${per})`;
  }

  if (blank.type === "expression" && !expr) {
    if (/проверк/i.test(t)) return `${stem} — проверь вычисление и введи результат.`;
    return `${stem} — посчитай и введи результат.`;
  }

  if (blank.type === "expression" && (/[+×x*]/.test(rawExpr) && rawExpr.includes("+"))) {
    if (/проверк/i.test(t)) {
      return `${stem} — проверь сумму и введи результат.`;
    }
    return `${stem} — посчитай и введи результат.`;
  }

  if (expr) {
    if (stem.length > 10 && stem.length <= 160 && !stem.startsWith("___")) {
      return `${stem} — посчитай и введи результат.`;
    }
    const left = numLabel(expr.left, ctx);
    const sym: Record<ParsedExpr["op"], string> = { mul: "×", div: "÷", add: "+", sub: "−" };
    return `Вычисли: ${left} ${sym[expr.op]} ${expr.right}`;
  }

  return stem.endsWith("___") ? `${stem.replace(/___+$/, "").trim()} — введи ответ.` : stem;
}
