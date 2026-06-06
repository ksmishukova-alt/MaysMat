import type { Task } from "@/data/tasks";
import { buildPlayerSteps, type PlayerStep } from "@/lib/task-player-steps";
import { headsLegsIntroTemplate } from "@/data/method-rules";
import {
  filterContentStepsByProfile,
  isCompactRuleScreen,
  shouldShowRuleScreen,
} from "./progression";
import { resolveBasePatternPilot } from "./models";

export type HeadsLegsExtendedPlayerStep =
  | PlayerStep
  | {
      id: string;
      type: "hl_intro";
      title: string;
      template: string[];
      screenPhaseId?: string;
      screenPhaseTitle?: string;
      screenPhaseIndex?: number;
      screenPhaseCount?: number;
    }
  | {
      id: string;
      type: "hl_method_rule";
      title: string;
      compact: boolean;
      screenPhaseId?: string;
      screenPhaseTitle?: string;
      screenPhaseIndex?: number;
      screenPhaseCount?: number;
    }
  | {
      id: string;
      type: "hl_choose_method";
      title: string;
      sourceSteps: PlayerStep[];
      screenPhaseId?: string;
      screenPhaseTitle?: string;
      screenPhaseIndex?: number;
      screenPhaseCount?: number;
    };

function applyPhaseMeta(steps: HeadsLegsExtendedPlayerStep[]): HeadsLegsExtendedPlayerStep[] {
  const count = steps.length;
  return steps.map((step, index) => ({
    ...step,
    screenPhaseIndex: index + 1,
    screenPhaseCount: count,
    screenPhaseTitle:
      step.screenPhaseTitle ??
      (step.type === "hl_intro"
        ? "Объяснение метода"
        : step.type === "hl_method_rule"
          ? "Правило"
          : step.type === "read_condition"
            ? "Понимаем задачу"
            : step.type === "hl_choose_method"
              ? "Выбираем шаг"
              : "Решаем"),
  }));
}

/** Цепочка экранов для pilot-задач первого паттерна */
export function buildHeadsLegsPlayerSteps(task: Task): HeadsLegsExtendedPlayerStep[] {
  const meta = task.headsLegsMeta;
  const pilot = meta ? resolveBasePatternPilot(meta.methodTaskId) : undefined;

  if (!pilot || !meta) {
    return buildPlayerSteps(task, {
      enableGivenStep: task.enableGivenStep ?? false,
      givenStep: task.givenStep,
    });
  }

  const profile = pilot.progressionProfile;
  const base = buildPlayerSteps(task, {
    enableGivenStep: task.enableGivenStep ?? false,
    givenStep: task.givenStep,
  });

  const readStep = base[0];
  const contentSteps = filterContentStepsByProfile(base.slice(1), profile);

  const prefix: HeadsLegsExtendedPlayerStep[] = [];

  if (profile === 1) {
    prefix.push({
      id: `${task.id}-hl-intro`,
      type: "hl_intro",
      title: "Объяснение метода",
      template: headsLegsIntroTemplate(),
      screenPhaseId: "intro",
    });
  }

  if (shouldShowRuleScreen(profile) && pilot.ruleInstance.showRuleScreen !== false) {
    prefix.push({
      id: `${task.id}-hl-rule`,
      type: "hl_method_rule",
      title: "Представим, что все одного вида",
      compact: isCompactRuleScreen(profile),
      screenPhaseId: "rule",
    });
  }

  if (profile === 3) {
    const setup = contentSteps.filter(
      (s) => s.type !== "word_solution" && !(s.type === "auto_explanation" && s.id.includes("-preview")),
    );
    const preview = contentSteps.filter(
      (s) => s.type === "auto_explanation" && s.id.includes("-preview"),
    );

    return applyPhaseMeta([
      ...prefix,
      readStep,
      ...setup,
      {
        id: `${task.id}-hl-choose`,
        type: "hl_choose_method",
        title: "Какой шаг сейчас нужно сделать?",
        sourceSteps: base.slice(1),
        screenPhaseId: "choose",
      },
      ...preview,
    ]);
  }

  return applyPhaseMeta([...prefix, readStep, ...contentSteps]);
}

export function isHeadsLegsProgressionTask(task: Task): boolean {
  const meta = task.headsLegsMeta;
  if (!meta) return false;
  return Boolean(resolveBasePatternPilot(meta.methodTaskId));
}
