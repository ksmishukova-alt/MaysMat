import type { Task } from "@/data/tasks";
import { buildPlayerSteps, type PlayerStep } from "@/lib/task-player-steps";
import {
  headsLegsIntroTemplate,
  headsLegsProductionIntroTemplate,
  headsLegsValueIntroTemplate,
} from "@/data/method-rules";
import type {
  HeadsLegsAnswerTransform,
  HeadsLegsProductionRuleInstance,
  HeadsLegsValueRuleInstance,
} from "@/data/method-rules/types";
import {
  filterContentStepsByProfile,
  isCompactRuleScreen,
  shouldShowRuleScreen,
} from "../base-pattern/progression";
import { resolveHeadsLegsPilot } from "../pilot/resolve";
import { shouldInjectQuestionCheck } from "../value-pattern/progression";
import {
  filterMultipleAnswersSteps,
  shouldInjectProductionQuestionCheck,
} from "../production-pattern/progression";

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
      chooseMode: "base" | "value" | "production";
      sourceSteps: PlayerStep[];
      questionAsks?: string;
      answerTransform?: HeadsLegsAnswerTransform;
      screenPhaseId?: string;
      screenPhaseTitle?: string;
      screenPhaseIndex?: number;
      screenPhaseCount?: number;
    }
  | {
      id: string;
      type: "hl_question_check";
      title: string;
      questionAsks: string;
      answerTransform?: HeadsLegsAnswerTransform;
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
              : step.type === "hl_question_check"
                ? "Проверяем вопрос"
                : "Решаем"),
  }));
}

function injectQuestionCheckBeforeWords(
  steps: HeadsLegsExtendedPlayerStep[],
  taskId: string,
  questionAsks: string,
  answerTransform?: HeadsLegsAnswerTransform,
): HeadsLegsExtendedPlayerStep[] {
  const out: HeadsLegsExtendedPlayerStep[] = [];
  for (const step of steps) {
    if (step.type === "word_solution") {
      out.push({
        id: `${taskId}-hl-question`,
        type: "hl_question_check",
        title: "Проверь, что именно спрашивают",
        questionAsks,
        answerTransform,
        screenPhaseId: "question",
      });
    }
    out.push(step);
  }
  return out;
}

function filterStepsForPilot(
  steps: PlayerStep[],
  profile: 1 | 2 | 3 | 4,
  flowMode?: "standard" | "enumeration" | "multiple_answers",
): PlayerStep[] {
  if (flowMode === "multiple_answers" && profile === 4) {
    return filterMultipleAnswersSteps(steps);
  }
  return filterContentStepsByProfile(steps, profile);
}

/** Цепочка экранов для pilot-задач паттернов 1–3 */
export function buildHeadsLegsPlayerSteps(task: Task): HeadsLegsExtendedPlayerStep[] {
  const meta = task.headsLegsMeta;
  const pilot = meta ? resolveHeadsLegsPilot(meta.methodTaskId) : undefined;

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
  let contentSteps = filterStepsForPilot(base.slice(1), profile, pilot.flowMode);

  const prefix: HeadsLegsExtendedPlayerStep[] = [];
  const ruleTitle =
    pilot.patternKind === "production"
      ? "Представим, что все сделали одинаково"
      : "Представим, что все одного вида";

  if (profile === 1) {
    const introTemplate =
      pilot.patternKind === "production"
        ? headsLegsProductionIntroTemplate()
        : pilot.patternKind === "value"
          ? headsLegsValueIntroTemplate()
          : headsLegsIntroTemplate();
    prefix.push({
      id: `${task.id}-hl-intro`,
      type: "hl_intro",
      title: "Объяснение метода",
      template: introTemplate,
      screenPhaseId: "intro",
    });
  }

  if (shouldShowRuleScreen(profile) && pilot.ruleInstance.showRuleScreen !== false) {
    prefix.push({
      id: `${task.id}-hl-rule`,
      type: "hl_method_rule",
      title: ruleTitle,
      compact: isCompactRuleScreen(profile),
      screenPhaseId: "rule",
    });
  }

  const valueRi =
    pilot.ruleInstance.ruleId === "heads-legs-value-base" ? pilot.ruleInstance : undefined;
  const productionRi =
    pilot.ruleInstance.ruleId === "heads-legs-production-base"
      ? pilot.ruleInstance
      : undefined;

  if (valueRi && pilot.patternKind === "value" && shouldInjectQuestionCheck(profile, "value")) {
    contentSteps = injectQuestionCheckBeforeWords(
      contentSteps as HeadsLegsExtendedPlayerStep[],
      task.id,
      valueRi.questionAsks,
      valueRi.answerTransform,
    ) as PlayerStep[];
  }

  if (productionRi && shouldInjectProductionQuestionCheck(profile)) {
    contentSteps = injectQuestionCheckBeforeWords(
      contentSteps as HeadsLegsExtendedPlayerStep[],
      task.id,
      productionRi.questionAsks,
      productionRi.answerTransform,
    ) as PlayerStep[];
  }

  if (profile === 3) {
    const setup = contentSteps.filter(
      (s) => s.type !== "word_solution" && !(s.type === "auto_explanation" && s.id.includes("-preview")),
    );
    const preview = contentSteps.filter(
      (s) => s.type === "auto_explanation" && s.id.includes("-preview"),
    );

    const chooseMode =
      pilot.patternKind === "production"
        ? "production"
        : pilot.patternKind === "value"
          ? "value"
          : "base";

    const hubQuestionAsks = valueRi?.questionAsks ?? productionRi?.questionAsks;
    const hubTransform = valueRi?.answerTransform ?? productionRi?.answerTransform;

    return applyPhaseMeta([
      ...prefix,
      readStep,
      ...setup,
      {
        id: `${task.id}-hl-choose`,
        type: "hl_choose_method",
        title: "Какой шаг сейчас нужно сделать?",
        chooseMode,
        sourceSteps: base.slice(1),
        questionAsks: hubQuestionAsks,
        answerTransform: hubTransform,
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
  return Boolean(resolveHeadsLegsPilot(meta.methodTaskId));
}

export type { HeadsLegsProductionRuleInstance, HeadsLegsValueRuleInstance };
