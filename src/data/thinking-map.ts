export type BranchStatus = "locked" | "available" | "in_progress" | "completed";

export interface Branch {
  id: string;
  thinkingType: string;
  title: string;
  slug: string;
  status: BranchStatus;
  progress: number;
  stars: number;
  maxStars: number;
  taskCount: number;
  firstTaskId?: string;
}

export interface ThinkingType {
  id: string;
  title: string;
  color: string;
  branches: Branch[];
}

export const THINKING_TYPES: ThinkingType[] = [
  {
    id: "modeling",
    title: "Моделирование",
    color: "#8B5CF6",
    branches: [
      { id: "modeling-drawing", thinkingType: "modeling", title: "Рисунок", slug: "drawing", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "modeling-heads-legs", thinkingType: "modeling", title: "Головы и ноги", slug: "heads-legs", status: "available", progress: 0, stars: 0, maxStars: 150, taskCount: 16, firstTaskId: "heads-legs-01" },
      { id: "modeling-speed", thinkingType: "modeling", title: "Путь и скорость", slug: "speed", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "modeling-schemes", thinkingType: "modeling", title: "Схемы", slug: "schemes", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "fairy-caves", thinkingType: "modeling", title: "Сказочные пещеры", slug: "fairy-caves", status: "available", progress: 0, stars: 0, maxStars: 150, taskCount: 3, firstTaskId: "fairy-caves-01" },
    ],
  },
  {
    id: "logic",
    title: "Логическое мышление",
    color: "#6366F1",
    branches: [
      { id: "logic-sets", thinkingType: "logic", title: "Множества", slug: "sets", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "logic-euler", thinkingType: "logic", title: "Круги Эйлера", slug: "euler", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "logic-matching", thinkingType: "logic", title: "Соответствия", slug: "matching", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "logic-knights", thinkingType: "logic", title: "Рыцари и лжецы", slug: "knights", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
    ],
  },
  {
    id: "combinatorics",
    title: "Систематический поиск",
    color: "#EC4899",
    branches: [
      { id: "comb-enumeration", thinkingType: "combinatorics", title: "Перебор", slug: "enumeration", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "comb-tree", thinkingType: "combinatorics", title: "Дерево вариантов", slug: "tree", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
    ],
  },
  {
    id: "proof",
    title: "Доказательное мышление",
    color: "#F59E0B",
    branches: [
      { id: "comb-two-ways", thinkingType: "proof", title: "Подсчёт двумя способами", slug: "two-ways", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "proof-dirichlet", thinkingType: "proof", title: "Дирихле", slug: "dirichlet", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "proof-bottleneck", thinkingType: "proof", title: "Узкие места", slug: "bottleneck", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "proof-estimate", thinkingType: "proof", title: "Оценка + пример", slug: "estimate", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "inv-impossible", thinkingType: "proof", title: "Невозможность", slug: "impossible", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
    ],
  },
  {
    id: "invariants",
    title: "Инвариантное мышление",
    color: "#10B981",
    branches: [
      { id: "inv-parity", thinkingType: "invariants", title: "Чётность", slug: "parity", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "inv-coloring", thinkingType: "invariants", title: "Раскраски", slug: "coloring", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "inv-operations", thinkingType: "invariants", title: "Операции", slug: "operations", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
    ],
  },
  {
    id: "games",
    title: "Стратегическое мышление",
    color: "#14B8A6",
    branches: [
      { id: "games-winning", thinkingType: "games", title: "Выигрышные позиции", slug: "winning", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "games-symmetry", thinkingType: "games", title: "Симметрия", slug: "symmetry", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "games-response", thinkingType: "games", title: "Ответный ход", slug: "response", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
    ],
  },
  {
    id: "graphs",
    title: "Структурное мышление",
    color: "#3B82F6",
    branches: [
      { id: "graphs-vertices", thinkingType: "graphs", title: "Вершины", slug: "vertices", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "graphs-edges", thinkingType: "graphs", title: "Рёбра", slug: "edges", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "graphs-paths", thinkingType: "graphs", title: "Пути", slug: "paths", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "graphs-connectivity", thinkingType: "graphs", title: "Связность", slug: "connectivity", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
    ],
  },
  {
    id: "arithmetic",
    title: "Числовое мышление",
    color: "#EF4444",
    branches: [
      { id: "arith-divisibility", thinkingType: "arithmetic", title: "Делимость", slug: "divisibility", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "arith-remainders", thinkingType: "arithmetic", title: "Остатки", slug: "remainders", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "arith-gcd", thinkingType: "arithmetic", title: "НОД/НОК", slug: "gcd", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "arith-rebus", thinkingType: "arithmetic", title: "Числовые ребусы", slug: "rebus", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
    ],
  },
  {
    id: "geometry",
    title: "Геометрическое мышление",
    color: "#A855F7",
    branches: [
      { id: "geo-cells", thinkingType: "geometry", title: "Клетки", slug: "cells", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "geo-cutting", thinkingType: "geometry", title: "Разрезания", slug: "cutting", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "geo-area", thinkingType: "geometry", title: "Площади", slug: "area", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "geo-symmetry", thinkingType: "geometry", title: "Симметрия", slug: "symmetry-geo", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
    ],
  },
  {
    id: "algorithms",
    title: "Алгоритмы и процессы",
    color: "#64748B",
    branches: [
      { id: "algo-cycles", thinkingType: "algorithms", title: "Циклы", slug: "cycles", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "algo-repetition", thinkingType: "algorithms", title: "Повторения", slug: "repetition", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
      { id: "algo-rules", thinkingType: "algorithms", title: "Действия по правилу", slug: "rules", status: "locked", progress: 0, stars: 0, maxStars: 150, taskCount: 0 },
    ],
  },
];

export function getAllBranches(): Branch[] {
  return THINKING_TYPES.flatMap((t) => t.branches);
}

export function getBranchById(id: string): Branch | undefined {
  return getAllBranches().find((b) => b.id === id);
}

export function getBranchBySlug(slug: string): Branch | undefined {
  return getAllBranches().find((b) => b.slug === slug);
}
