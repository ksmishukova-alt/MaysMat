import type { Task } from "@/data/tasks";
import { buildPlayerSteps, type PlayerStep } from "@/lib/task-player-steps";
import {
  headsLegsIntroTemplate,
  headsLegsValueIntroTemplate,
} from "@/data/method-rules";
import type { HeadsLegsValueRuleInstance } from "@/data/method-rules/types";
import {
  filterContentStepsByProfile,
  isCompactRuleScreen,
  shouldShowRuleScreen,
} from "../base-pattern/progression";
import { resolveHeadsLegsPilot } from "../pilot/resolve";
import { shouldInjectQuestionCheck } from "../value-pattern/progression";

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
      chooseMode: "base" | "value";
      sourceSteps: PlayerStep[];
      questionAsks?: string;
      answerTransform?: HeadsLegsValueRuleInstance["answerTransform"];
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
      answerTransform?: HeadsLegsValueRuleInstance["answerTransform"];
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
  ri: HeadsLegsValueRuleInstance,
): HeadsLegsExtendedPlayerStep[] {
  const out: HeadsLegsExtendedPlayerStep[] = [];
  for (const step of steps) {
    if (step.type === "word_solution") {
      out.push({
        id: `${taskId}-hl-question`,
        type: "hl_question_check",
        title: "Проверь, что именно спрашивают",
        questionAsks: ri.questionAsks,
        answerTransform: ri.answerTransform,
        screenPhaseId: "question",
      });
    }
    out.push(step);
  }
  return out;
}

/** Цепочка экранов для pilot-задач паттернов 1 и 2 */
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
  let contentSteps = filterContentStepsByProfile(base.slice(1), profile);

  const prefix: HeadsLegsExtendedPlayerStep[] = [];
  const ruleTitle =
    pilot.patternKind === "value"
      ? "Представим, что все одного вида"
      : "Представим, что все одного вида";

  if (profile === 1) {
    prefix.push({
      id: `${task.id}-hl-intro`,
      type: "hl_intro",
      title: "Объяснение метода",
      template:
        pilot.patternKind === "value" ? headsLegsValueIntroTemplate() : headsLegsIntroTemplate(),
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

  if (valueRi && shouldInjectQuestionCheck(profile, pilot.patternKind)) {
    contentSteps = injectQuestionCheckBeforeWords(
      contentSteps as HeadsLegsExtendedPlayerStep[],
      task.id,
      valueRi,
    ) as PlayerStep[];
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
        chooseMode: pilot.patternKind === "value" ? "value" : "base",
        sourceSteps: base.slice(1),
        questionAsks: valueRi?.questionAsks,
        answerTransform: valueRi?.answerTransform,
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
