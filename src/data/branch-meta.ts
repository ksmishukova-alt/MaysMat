/** Метаданные v2: приключения, микро-навыки, подписи типов мышления */

export interface Adventure {
  id: string;
  title: string;
  emoji: string;
  tagline?: string;
  branchIds: string[];
}

export interface BranchMeta {
  adventureId?: string;
  microSkill: string;
  section?: string;
}

/** Приключения (уровень 1 — видит ребёнок) */
export const ADVENTURES: Adventure[] = [
  {
    id: "workshop-models",
    title: "Мастерская моделей",
    emoji: "🔧",
    tagline: "Учимся превращать задачи в удобные схемы",
    branchIds: [
      "modeling-drawing",
      "modeling-heads-legs",
      "modeling-speed",
      "modeling-schemes",
    ],
  },
  {
    id: "math-lovers-mystery",
    title: "Тайна любителей математики",
    emoji: "🧩",
    branchIds: ["logic-sets", "logic-euler", "logic-matching"],
  },
  {
    id: "kingdom-of-truth",
    title: "Королевство правды",
    emoji: "👑",
    branchIds: ["logic-knights"],
  },
  {
    id: "forest-of-choices",
    title: "Лес вариантов",
    emoji: "🌲",
    branchIds: ["comb-enumeration", "comb-tree"],
  },
  {
    id: "proof-academy",
    title: "Академия доказательств",
    emoji: "📜",
    branchIds: [
      "comb-two-ways",
      "proof-dirichlet",
      "proof-unlucky",
      "proof-table-cells",
      "proof-extreme",
      "proof-constructions",
      "proof-bottleneck",
      "proof-estimate",
      "inv-impossible",
    ],
  },
  {
    id: "number-caves",
    title: "Числовые пещеры",
    emoji: "🔢",
    tagline: "Остатки, делимость и свойства чисел",
    branchIds: ["arith-divisibility", "arith-remainders", "arith-gcd", "arith-rebus"],
  },
  {
    id: "figures-city",
    title: "Город Фигур",
    emoji: "📐",
    tagline: "Разрезания, площади и симметрия",
    branchIds: ["geo-cells", "geo-cutting", "geo-area", "geo-symmetry"],
  },
  {
    id: "invariant-island",
    title: "Остров инвариантов",
    emoji: "🏝️",
    branchIds: ["inv-parity", "inv-coloring", "inv-operations"],
  },
  {
    id: "fairy-caves",
    title: "Сказочные пещеры",
    emoji: "🕳️",
    tagline: "Сороконожки и драконы — головы поровну",
    branchIds: ["fairy-caves"],
  },
];

/** Подписи типов мышления v2 (id в коде не меняем) */
export const THINKING_TYPE_LABELS: Record<string, string> = {
  modeling: "Моделирование",
  logic: "Логическое мышление",
  combinatorics: "Систематический поиск",
  proof: "Доказательное мышление",
  invariants: "Инвариантное мышление",
  games: "Стратегическое мышление",
  graphs: "Структурное мышление",
  arithmetic: "Числовое мышление",
  geometry: "Геометрическое мышление",
  algorithms: "Алгоритмическое мышление",
};

/** Навыки для отчёта родителя (укрупнённо) */
export const PARENT_SKILL_LABELS: Record<string, string> = {
  modeling: "Построение модели",
  logic: "Логические выводы",
  combinatorics: "Поиск вариантов",
  proof: "Доказательства",
  invariants: "Инварианты и сохранение",
  games: "Стратегии",
  graphs: "Структура и связи",
  arithmetic: "Числовое мышление",
  geometry: "Геометрическое мышление",
  algorithms: "Алгоритмы и процессы",
};

export const BRANCH_META: Record<string, BranchMeta> = {
  "modeling-heads-legs": {
    adventureId: "workshop-models",
    microSkill: "Перевести задачу в таблицу двух типов объектов",
    section: "Табличное моделирование",
  },
  "modeling-drawing": {
    adventureId: "workshop-models",
    microSkill: "Нарисовать удобную модель задачи",
    section: "Визуальное моделирование",
  },
  "modeling-speed": {
    adventureId: "workshop-models",
    microSkill: "Составить схему движения",
    section: "Движение и процессы",
  },
  "modeling-schemes": {
    adventureId: "workshop-models",
    microSkill: "Построить схему связей",
    section: "Визуальное моделирование",
  },
  "fairy-caves": {
    adventureId: "fairy-caves",
    microSkill: "Связать число существ через равные суммы голов",
    section: "Сказочные пещеры",
  },
  "logic-euler": {
    adventureId: "math-lovers-mystery",
    microSkill: "Находить пересечения множеств",
  },
  "logic-sets": {
    adventureId: "math-lovers-mystery",
    microSkill: "Работать с множествами",
  },
  "logic-matching": {
    adventureId: "math-lovers-mystery",
    microSkill: "Находить связи и соответствия между объектами",
    section: "Соответствия",
  },
  "logic-knights": {
    adventureId: "kingdom-of-truth",
    microSkill: "Делать логические выводы из утверждений",
  },
  "comb-tree": {
    adventureId: "forest-of-choices",
    microSkill: "Систематически перебирать варианты",
  },
  "comb-enumeration": {
    adventureId: "forest-of-choices",
    microSkill: "Ничего не пропустить при переборе",
  },
  "comb-two-ways": {
    adventureId: "proof-academy",
    microSkill: "Считать одно и то же двумя способами",
    section: "Подсчёт",
  },
  "proof-dirichlet": {
    adventureId: "proof-academy",
    microSkill: "Увидеть неизбежность переполнения",
    section: "Принцип Дирихле",
  },
  "proof-unlucky": {
    adventureId: "proof-academy",
    microSkill: "Построить худший случай и добавить один предмет",
    section: "Метод неудачника",
  },
  "proof-table-cells": {
    adventureId: "proof-academy",
    microSkill: "Использовать таблицу значений как клетки",
    section: "Табличные клетки",
  },
  "proof-extreme": {
    adventureId: "proof-academy",
    microSkill: "Рассуждать от крайнего случая",
    section: "Принцип крайнего",
  },
  "proof-constructions": {
    adventureId: "proof-academy",
    microSkill: "Строить примеры и контрпримеры",
    section: "Конструкции",
  },
  "arith-remainders": {
    adventureId: "number-caves",
    microSkill: "Связать остатки при делении с клетками",
    section: "Остатки",
  },
  "geo-cutting": {
    adventureId: "figures-city",
    microSkill: "Разбить фигуру и применить переполнение",
    section: "Разрезания",
  },
  "inv-coloring": {
    adventureId: "invariant-island",
    microSkill: "Находить однотонные пары через раскраску",
    section: "Раскраски",
  },
  "inv-impossible": {
    adventureId: "proof-academy",
    microSkill: "Доказать, что решение невозможно",
    section: "Невозможность",
  },
};

export function getAdventure(id: string): Adventure | undefined {
  return ADVENTURES.find((a) => a.id === id);
}

export function getAdventureForBranch(branchId: string): Adventure | undefined {
  const meta = BRANCH_META[branchId];
  if (!meta?.adventureId) return ADVENTURES[0];
  return getAdventure(meta.adventureId);
}

export function getBranchMeta(branchId: string): BranchMeta | undefined {
  return BRANCH_META[branchId];
}

export function getThinkingTypeLabel(typeId: string): string {
  return THINKING_TYPE_LABELS[typeId] ?? typeId;
}
