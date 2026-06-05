import type { SkillWeights } from "@/data/tasks";
import type { TopicMethodology } from "@/data/methodologies/types";

import raw from "./theme-branches.json";

export interface ThemeBranchConfig {
  branchId: string;
  thinkingType: string;
  title: string;
  slug: string;
  mentalModel: string;
  algorithm: string[];
  skillWeights: SkillWeights;
}

export const THEME_BRANCH_MAP = raw as Record<string, ThemeBranchConfig>;

export const METHODOLOGY_BANK_THEME_ORDER = [
  "T1_DIRICHLET_CORE",
  "T2_UNLUCKY",
  "T3_REMAINDERS",
  "T4_GEOMETRY",
  "T5_TABLES_VALUES",
  "T6_RELATIONS",
  "T7_COLOR_RAMSEY",
  "T8_EXTREME",
  "T9_CONSTRUCTIONS",
] as const;

export function getThemeBranchConfig(themeId: string): ThemeBranchConfig | undefined {
  return THEME_BRANCH_MAP[themeId];
}

export function getMethodologyForTheme(themeId: string): TopicMethodology | undefined {
  const cfg = getThemeBranchConfig(themeId);
  if (!cfg) return undefined;
  return {
    branchId: cfg.branchId,
    title: cfg.title,
    mentalModel: cfg.mentalModel,
    algorithm: cfg.algorithm,
    ladder: [
      { level: 1, role: "Ведём за руку", hints: "Карточки и готовые клетки" },
      { level: 2, role: "Конструктор", hints: "Шаблон с пропусками" },
      { level: 3, role: "Шаблон", hints: "План + числовые пропуски" },
      { level: 4, role: "Почти сам", hints: "Мало подсказок" },
      { level: 5, role: "Самостоятельно", hints: "Полное доказательство" },
    ],
  };
}

/** Все ветки, куда попадают задачи из methodology-bank */
export function getMethodologyBankBranchIds(): string[] {
  return [...new Set(Object.values(THEME_BRANCH_MAP).map((c) => c.branchId))];
}

export function isMethodologyBankBranch(branchId: string): boolean {
  return getMethodologyBankBranchIds().includes(branchId);
}
