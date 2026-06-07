import type { SolutionMode } from "../solution-modes";
import type { HeadsLegsTaskMeta, SolutionLine } from "../types";

export type FlowProfile = "classic" | "diagnostic" | "enumeration" | "structural";

export interface TaskFlowOptions {
  profile: FlowProfile;
  /** Таблица «норма у каждого» */
  featureTable: boolean;
  /** «Представим, что все были…» */
  assumptionStep: boolean;
  /** Числовые листы расчёта */
  calcWorksheets: boolean;
  /** Экран с готовым текстом решения */
  solutionPreview: boolean;
}

const DEFAULT_CLASSIC: TaskFlowOptions = {
  profile: "classic",
  featureTable: true,
  assumptionStep: true,
  calcWorksheets: true,
  solutionPreview: true,
};

/** Явные исключения из методички — не насильно один шаблон */
const FLOW_BY_TASK: Partial<Record<string, Partial<TaskFlowOptions>>> = {
  "1.2": { featureTable: false },
  "3.1": {
    profile: "diagnostic",
    featureTable: false,
    assumptionStep: false,
    calcWorksheets: false,
  },
  "3.2": {
    profile: "enumeration",
    featureTable: false,
    assumptionStep: false,
    calcWorksheets: false,
  },
  "3.7": {
    profile: "diagnostic",
    featureTable: false,
    assumptionStep: false,
    calcWorksheets: false,
  },
  "4.3": {
    featureTable: false,
    assumptionStep: false,
    calcWorksheets: false,
    solutionPreview: true,
  },
  "5.3": {
    featureTable: false,
    assumptionStep: false,
    calcWorksheets: false,
    solutionPreview: true,
  },
  "6.1": {
    profile: "structural",
    featureTable: false,
    assumptionStep: false,
    calcWorksheets: false,
  },
  "6.3": {
    profile: "enumeration",
    featureTable: false,
    assumptionStep: false,
    calcWorksheets: false,
  },
  "6.2": {
    profile: "structural",
    featureTable: false,
    assumptionStep: false,
    calcWorksheets: false,
  },
  "6.4": {
    profile: "structural",
    featureTable: false,
    assumptionStep: false,
    calcWorksheets: false,
  },
  "6.5": {
    profile: "diagnostic",
    featureTable: false,
    assumptionStep: false,
    calcWorksheets: false,
  },
  "7.4": {
    profile: "structural",
    featureTable: false,
    assumptionStep: false,
    calcWorksheets: false,
  },
  "7.6": {
    profile: "diagnostic",
    featureTable: false,
    assumptionStep: false,
    calcWorksheets: false,
  },
};

function isDiagnosticByLines(lines: SolutionLine[] | undefined): boolean {
  if (!lines?.length) return false;
  return lines.some((l) =>
    /не сказано|данных не хватает|не хватает данн|неоднознач|можно получить разные|единственный ответ найти нельзя/i.test(
      l.template,
    ),
  );
}

function isEnumerationByLines(lines: SolutionLine[] | undefined): boolean {
  if (!lines?.length) return false;
  return lines.some((l) => /перебор|вариант|если\s+.+\s+то/i.test(l.template));
}

export function resolveTaskFlow(meta: HeadsLegsTaskMeta): TaskFlowOptions {
  const taskOverride = FLOW_BY_TASK[meta.methodTaskId];
  if (taskOverride) {
    return { ...DEFAULT_CLASSIC, ...taskOverride };
  }

  const mode: SolutionMode = meta.solutionMode;
  const lines = meta.solutionLines;

  if (mode === "D" || isDiagnosticByLines(lines)) {
    return {
      profile: "diagnostic",
      featureTable: false,
      assumptionStep: false,
      calcWorksheets: false,
      solutionPreview: true,
    };
  }

  if (mode === "E" || isEnumerationByLines(lines)) {
    return {
      profile: "enumeration",
      featureTable: false,
      assumptionStep: false,
      calcWorksheets: true,
      solutionPreview: true,
    };
  }

  if (/одним,\s+двумя\s+и\s+тремя|тр[её]х\s+вид|механик.*медик|медик.*механик/i.test(meta.condition)) {
    return {
      profile: "structural",
      featureTable: false,
      assumptionStep: false,
      calcWorksheets: true,
      solutionPreview: true,
    };
  }

  return DEFAULT_CLASSIC;
}
