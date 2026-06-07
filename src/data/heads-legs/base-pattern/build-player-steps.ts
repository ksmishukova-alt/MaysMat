import type { Task } from "@/data/tasks";
import { buildPlayerSteps, type PlayerStep } from "@/lib/task-player-steps";
import {
  headsLegsIntroTemplate,
  headsLegsProductionIntroTemplate,
  headsLegsScoreIntroTemplate,
  headsLegsValueIntroTemplate,
} from "@/data/method-rules";
import type {
  HeadsLegsAnswerTransform,
  HeadsLegsDeriveRuleInstance,
  HeadsLegsProductionRuleInstance,
  HeadsLegsScoreRuleInstance,
  HeadsLegsValueRuleInstance,
  ScoreMode,
} from "@/data/method-rules/types";
import {
  filterContentStepsByProfile,
  isCompactRuleScreen,
  shouldShowRuleScreen,
} from "../base-pattern/progression";
import { resolveHeadsLegsPilot } from "../pilot/resolve";
import {
  DERIVE_53_READ_HINT,
  DERIVE_TRANSITION_TEMPLATE,
} from "../derive-pattern/models";
import { TRANSFER_43_READ_HINT } from "../transfer-pattern/models";
import { shouldInjectQuestionCheck } from "../value-pattern/progression";
import {
  filterMultipleAnswersSteps,
  shouldInjectProductionQuestionCheck,
} from "../production-pattern/progression";
import { shouldInjectScoreQuestionCheck } from "../score-pattern/progression";

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
      chooseMode: "base" | "value" | "production" | "score";
      sourceSteps: PlayerStep[];
      questionAsks?: string;
      answerTransform?: HeadsLegsAnswerTransform;
      scoreMode?: ScoreMode;
      scoreRuleInstance?: HeadsLegsScoreRuleInstance;
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
    }
  | {
      id: string;
      type: "hl_score_question_check";
      title: string;
      questionAsks: string;
      questionCheckNote?: string;
      scoreMode?: ScoreMode;
      screenPhaseId?: string;
      screenPhaseTitle?: string;
      screenPhaseIndex?: number;
      screenPhaseCount?: number;
    }
  | {
      id: string;
      type: "hl_score_replacement";
      title: string;
      scoreRuleInstance: HeadsLegsScoreRuleInstance;
      screenPhaseId?: string;
      screenPhaseTitle?: string;
      screenPhaseIndex?: number;
      screenPhaseCount?: number;
    }
  | {
      id: string;
      type: "hl_derive_prelude";
      title: string;
      deriveRuleInstance: HeadsLegsDeriveRuleInstance;
      screenPhaseId?: string;
      screenPhaseTitle?: string;
      screenPhaseIndex?: number;
      screenPhaseCount?: number;
    }
  | {
      id: string;
      type: "hl_match_total";
      title: string;
      scoreRuleInstance: HeadsLegsScoreRuleInstance;
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
          : step.type === "hl_score_replacement"
            ? "Шаг замены"
            : step.type === "hl_match_total"
              ? "Очки за матч"
              : step.type === "hl_derive_prelude"
                ? "Подготовка"
                : step.type === "read_condition"
                ? "Понимаем задачу"
                : step.type === "hl_choose_method"
                  ? "Выбираем шаг"
                  : step.type === "hl_question_check" || step.type === "hl_score_question_check"
                    ? "Проверяем вопрос"
                    : "Решаем"),
  }));
}

function injectScoreQuestionCheckBeforeWords(
  steps: HeadsLegsExtendedPlayerStep[],
  taskId: string,
  scoreRi: HeadsLegsScoreRuleInstance,
): HeadsLegsExtendedPlayerStep[] {
  const out: HeadsLegsExtendedPlayerStep[] = [];
  for (const step of steps) {
    if (step.type === "word_solution") {
      out.push({
        id: `${taskId}-hl-score-question`,
        type: "hl_score_question_check",
        title: "Проверь, что именно спрашивают",
        questionAsks: scoreRi.questionAsks,
        questionCheckNote: scoreRi.questionCheckNote,
        scoreMode: scoreRi.scoreMode,
        screenPhaseId: "question",
      });
    }
    out.push(step);
  }
  return out;
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
  flowMode?: "standard" | "enumeration" | "multiple_answers" | "transfer" | "derive",
): PlayerStep[] {
  if (flowMode === "multiple_answers" && profile === 4) {
    return filterMultipleAnswersSteps(steps);
  }
  return filterContentStepsByProfile(steps, profile);
}

function scoreSpecialPrefix(
  taskId: string,
  scoreRi: HeadsLegsScoreRuleInstance,
  profile: 1 | 2 | 3 | 4,
): HeadsLegsExtendedPlayerStep[] {
  const extra: HeadsLegsExtendedPlayerStep[] = [];
  if (scoreRi.scoreMode === "match_total" && profile <= 2) {
    extra.push({
      id: `${taskId}-hl-match-total`,
      type: "hl_match_total",
      title: "Сколько очков за матч вместе?",
      scoreRuleInstance: scoreRi,
      screenPhaseId: "match-total",
    });
  }
  if (scoreRi.scoreMode === "plus_minus" && profile === 1) {
    extra.push({
      id: `${taskId}-hl-score-repl`,
      type: "hl_score_replacement",
      title: "Шаг замены с отрицательными баллами",
      scoreRuleInstance: scoreRi,
      screenPhaseId: "score-replacement",
    });
  }
  return extra;
}

/** Цепочка экранов для pilot-задач паттернов 1–4 */
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
  const rawContent = base.slice(1);

  if (pilot.flowMode === "transfer") {
    const readWithHint =
      meta.methodTaskId === "4.3"
        ? { ...readStep, hint: TRANSFER_43_READ_HINT }
        : readStep;
    const assume = rawContent.find(
      (s) => s.type === "single_select" && s.id.includes("-assume"),
    );
    const word = rawContent.find((s) => s.type === "word_solution");
    const preview = rawContent.find(
      (s) => s.type === "auto_explanation" && s.id.includes("-preview"),
    );
    return applyPhaseMeta(
      [readWithHint, assume, word, preview].filter(Boolean) as HeadsLegsExtendedPlayerStep[],
    );
  }

  if (pilot.flowMode === "derive") {
    const deriveRi =
      pilot.ruleInstance.ruleId === "heads-legs-derive-base"
        ? pilot.ruleInstance
        : undefined;
    if (!deriveRi) {
      return applyPhaseMeta([readStep, ...filterStepsForPilot(rawContent, profile, pilot.flowMode)]);
    }

    const readWithHint =
      meta.methodTaskId === "5.3"
        ? { ...readStep, hint: DERIVE_53_READ_HINT }
        : readStep;
    const assume = rawContent.find(
      (s) => s.type === "single_select" && s.id.includes("-assume"),
    );
    const word = rawContent.find((s) => s.type === "word_solution");
    const preview = rawContent.find(
      (s) => s.type === "auto_explanation" && s.id.includes("-preview"),
    );

    return applyPhaseMeta(
      [
        readWithHint,
        {
          id: `${task.id}-hl-derive-prelude`,
          type: "hl_derive_prelude",
          title: "Что сначала нужно получить?",
          deriveRuleInstance: deriveRi,
          screenPhaseId: "derive-prelude",
        },
        {
          id: `${task.id}-hl-derive-transition`,
          type: "hl_intro",
          title: "Знакомый метод",
          template: DERIVE_TRANSITION_TEMPLATE,
          screenPhaseId: "derive-transition",
        },
        assume,
        {
          id: `${task.id}-hl-question`,
          type: "hl_question_check",
          title: "Проверь вопрос задачи",
          questionAsks: deriveRi.questionAsks,
          screenPhaseId: "question-check",
        },
        word,
        preview,
      ].filter(Boolean) as HeadsLegsExtendedPlayerStep[],
    );
  }

  let contentSteps = filterStepsForPilot(rawContent, profile, pilot.flowMode);

  const prefix: HeadsLegsExtendedPlayerStep[] = [];
  const ruleTitle =
    pilot.patternKind === "score"
      ? "Представим, что все одного типа"
      : pilot.patternKind === "production"
        ? "Представим, что все сделали одинаково"
        : "Представим, что все одного вида";

  if (profile === 1) {
    const introTemplate =
      pilot.patternKind === "score"
        ? headsLegsScoreIntroTemplate()
        : pilot.patternKind === "production"
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
  const scoreRi =
    pilot.ruleInstance.ruleId === "heads-legs-score-base" ? pilot.ruleInstance : undefined;

  if (scoreRi) {
    prefix.push(...scoreSpecialPrefix(task.id, scoreRi, profile));
  }

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

  if (scoreRi && shouldInjectScoreQuestionCheck(profile, pilot.patternKind)) {
    contentSteps = injectScoreQuestionCheckBeforeWords(
      contentSteps as HeadsLegsExtendedPlayerStep[],
      task.id,
      scoreRi,
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
      pilot.patternKind === "score"
        ? "score"
        : pilot.patternKind === "production"
          ? "production"
          : pilot.patternKind === "value"
            ? "value"
            : "base";

    const hubQuestionAsks = valueRi?.questionAsks ?? productionRi?.questionAsks ?? scoreRi?.questionAsks;
    const hubTransform = valueRi?.answerTransform ?? productionRi?.answerTransform;

    const scoreReplacementStep: HeadsLegsExtendedPlayerStep | null =
      scoreRi?.scoreMode === "plus_minus"
        ? {
            id: `${task.id}-hl-score-repl`,
            type: "hl_score_replacement",
            title: "Шаг замены с отрицательными баллами",
            scoreRuleInstance: scoreRi,
            screenPhaseId: "score-replacement",
          }
        : null;

    return applyPhaseMeta([
      ...prefix,
      readStep,
      ...setup,
      ...(scoreReplacementStep ? [scoreReplacementStep] : []),
      {
        id: `${task.id}-hl-choose`,
        type: "hl_choose_method",
        title: "Какой шаг сейчас нужно сделать?",
        chooseMode,
        sourceSteps: base.slice(1),
        questionAsks: hubQuestionAsks,
        answerTransform: hubTransform,
        scoreMode: scoreRi?.scoreMode,
        scoreRuleInstance: scoreRi,
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

export type { HeadsLegsProductionRuleInstance, HeadsLegsScoreRuleInstance, HeadsLegsValueRuleInstance };
