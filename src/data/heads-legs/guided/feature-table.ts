import type { TableRow } from "@/data/tasks";
import { resolveEntityEmoji } from "@/lib/entity-emoji";

import type { HeadsLegsEntity } from "../types";

import type { SolutionLine } from "../types";

import {

  FEATURE_TABLE_OVERRIDES,

  inferCountedFeature,

  type CountedFeatureMeta,

} from "./feature-overrides";



export function featureColumnLabel(condition: string, methodTaskId?: string): string {

  if (methodTaskId && FEATURE_TABLE_OVERRIDES[methodTaskId]) {

    return FEATURE_TABLE_OVERRIDES[methodTaskId].columnLabel;

  }

  return inferCountedFeature(condition).columnLabel;

}



export function featureStepMeta(condition: string, methodTaskId?: string): CountedFeatureMeta {

  if (methodTaskId && FEATURE_TABLE_OVERRIDES[methodTaskId]) {
    const override = FEATURE_TABLE_OVERRIDES[methodTaskId];
    const col = override.columnLabel;
    return {
      columnLabel: col,
      stepTitle:
        override.stepTitle ?? `③ Сколько ${col.toLowerCase()} у каждого?`,
      stepHint:
        override.stepHint ??
        `Укажи, сколько ${col.toLowerCase()} требуется для каждого вида по условию.`,
    };
  }

  return inferCountedFeature(condition);

}



function rowEmoji(label: string): string {
  return resolveEntityEmoji(label, { role: "object" });
}

function cap(s: string): string {

  return s.charAt(0).toUpperCase() + s.slice(1);

}



/** Норма признака на объект (ноги, колёса, цена…) */

export function inferFeatureTable(

  condition: string,

  entities: HeadsLegsEntity[],

  lines: SolutionLine[],

  methodTaskId?: string,

): TableRow[] | null {

  if (methodTaskId && FEATURE_TABLE_OVERRIDES[methodTaskId]) {

    return FEATURE_TABLE_OVERRIDES[methodTaskId].rows;

  }



  const e1 = entities[0]?.label ?? "Вид 1";

  const e2 = entities[1]?.label ?? "Вид 2";



  const eachMatches = [
    ...condition.matchAll(/кажд(?:ому|ый|ая|ой)\s+(?:\S+\s+){0,4}?(\d+)\s+(\S+)/gi),
  ];

  if (eachMatches.length >= 2) {

    const labelFromEntity = (idx: 0 | 1) => cap(entities[idx]?.label ?? (idx === 0 ? e1 : e2));

    return [

      { id: "f1", label: labelFromEntity(0), emoji: rowEmoji(labelFromEntity(0)), answer: Number(eachMatches[0][1]) },

      { id: "f2", label: labelFromEntity(1), emoji: rowEmoji(labelFromEntity(1)), answer: Number(eachMatches[1][1]) },

    ];

  }



  const looseMatches = [
    ...condition.matchAll(/(?:кажд(?:ому|ый|ая|ой)\s+)?(\S+)\s+(?:\S+\s+)?(\d+)\s+(\S+)/gi),
  ];
  const garbage =
    /^(—|из|в|на|мы|ему|васе|школу|мастер|получила|получили|содержат|футбол|полю|планете|комнате|всего|них|класса|вырезал|карандашами|штук|цветных|маленькие|карандашей)$/i;
  if (looseMatches.length >= 2) {
    const l1 = cap(looseMatches[0][1]);
    const l2 = cap(looseMatches[1][1]);
    if (!garbage.test(l1) && !garbage.test(l2) && l1.length >= 3 && l2.length >= 3) {
      return [
        { id: "f1", label: l1, emoji: rowEmoji(l1), answer: Number(looseMatches[0][2]) },
        { id: "f2", label: l2, emoji: rowEmoji(l2), answer: Number(looseMatches[1][2]) },
      ];
    }
  }



  if (/четвероног/i.test(condition) && /двуног/i.test(condition)) {

    return [

      { id: "f1", label: cap(e1), emoji: rowEmoji(cap(e1)), answer: 4 },

      { id: "f2", label: cap(e2), emoji: rowEmoji(cap(e2)), answer: 2 },

    ];

  }



  if (/гусят/i.test(condition) && /крокодил/i.test(condition)) {

    return [

      { id: "f1", label: "Гусята", emoji: "🪿", answer: 2 },

      { id: "f2", label: "Крокодильчики", emoji: "🐊", answer: 4 },

    ];

  }



  if (/двухкол/i.test(condition) && /тр[её]хкол/i.test(condition)) {

    return [

      { id: "f1", label: "Двухколёсный", emoji: "🚲", answer: 2 },

      { id: "f2", label: "Трёхколёсный", emoji: "🛺", answer: 3 },

    ];

  }



  // Из строки «X − Y = Z» — привязываем к существу из текста строки

  for (const line of lines) {

    if (!/добавляет|разниц|шаг|больше/i.test(line.template)) continue;

    for (const blank of line.blanks) {

      const raw = Array.isArray(blank.accept) ? blank.accept[0] : blank.accept;

      const s = String(raw ?? "");

      const diff = s.match(/(\d+)\s*[-−]\s*(\d+)\s*=\s*(\d+)/);

      if (!diff) continue;

      const high = Number(diff[1]);

      const low = Number(diff[2]);

      const tpl = line.template.toLowerCase();

      const highLabel = [...tpl.matchAll(/(\S+)/g)]

        .map((m) => m[1])

        .find((w) => entities.some((e) => e.label.toLowerCase().includes(w.slice(0, 5))));

      if (highLabel) {

        const hiEnt = entities.find((e) => e.label.toLowerCase().includes(highLabel.slice(0, 5)));

        const loEnt = entities.find((e) => e.id !== hiEnt?.id);

        if (hiEnt && loEnt) {

          return [

            { id: "f1", label: cap(hiEnt.label), emoji: rowEmoji(cap(hiEnt.label)), answer: high },

            { id: "f2", label: cap(loEnt.label), emoji: rowEmoji(cap(loEnt.label)), answer: low },

          ];

        }

      }

      return [

        { id: "f1", label: cap(e1), emoji: rowEmoji(cap(e1)), answer: high },

        { id: "f2", label: cap(e2), emoji: rowEmoji(cap(e2)), answer: low },

      ];

    }

  }



  const legNums = [...condition.matchAll(/(\d+)\s+ног/gi)].map((m) => Number(m[1]));

  if (legNums.length >= 2 && /жук|паук/i.test(condition)) {

    return [

      { id: "f1", label: cap(e1), emoji: "🪲", answer: legNums[0] },

      { id: "f2", label: cap(e2), emoji: "🕷️", answer: legNums[1] },

    ];

  }



  const confMatch = condition.match(

    /кажд(?:ый|ая)\s+\S+\s+\S*\s*(\d+)\s+(\S+).*?кажд(?:ый|ая)\s+\S+\s+\S*\s*(\d+)/i,

  );

  if (confMatch && /конфет|задач|котлет|сосис|мыш|яблок|снежин|балл|открытк/i.test(condition)) {

    return [

      { id: "f1", label: cap(e1), emoji: rowEmoji(cap(e1)), answer: Number(confMatch[1]) },

      { id: "f2", label: cap(e2), emoji: rowEmoji(cap(e2)), answer: Number(confMatch[3]) },

    ];

  }



  return null;

}


