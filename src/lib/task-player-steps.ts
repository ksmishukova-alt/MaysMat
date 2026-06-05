import type { ConditionParseData, Task } from "@/data/tasks";
import type { DiscriminatedTaskStep } from "@/data/task-steps";
import { applyDirichletReadPhase, resolveDirichletPhaseCount } from "@/data/dirichlet/build-steps";

export type PlayerStepType = DiscriminatedTaskStep["type"] | "read_condition";

/** Шаг плеера: union шагов задачи + read_condition */
export type PlayerStep =
  | (DiscriminatedTaskStep & { type: DiscriminatedTaskStep["type"] })
  | {
      id: string;
      type: "read_condition";
      title: string;
      hint?: string;
      highlight?: boolean;
      screenPhaseId?: string;
      screenPhaseTitle?: string;
      screenPhaseIndex?: number;
      screenPhaseCount?: number;
      screenSubStep?: string;
    };

export function buildPlayerSteps(
  task: Task,
  options: { enableGivenStep: boolean; givenStep?: ConditionParseData },
): PlayerStep[] {
  const contentSteps = task.steps.filter((step) => step.type !== "condition_parse");

  const phaseCount = task.dirichletMeta
    ? resolveDirichletPhaseCount(task.dirichletMeta.flowId)
    : task.headsLegsMeta?.methodTaskId === "3.1"
      ? 3
      : task.headsLegsMeta?.methodTaskId === "3.5"
        ? 5
        : task.headsLegsMeta?.methodTaskId === "6.4"
          ? 3
          : 4;

  const prefix: PlayerStep[] = [
    {
      id: `${task.id}-read`,
      type: "read_condition",
      title: "Прочитай условие",
      screenPhaseId: "condition",
      screenPhaseTitle: "Понимаем задачу",
      screenPhaseIndex: 1,
      screenPhaseCount: phaseCount,
    },
  ];

  if (task.dirichletMeta) {
    prefix[0] = applyDirichletReadPhase(prefix[0], task.dirichletMeta.flowId);
  }

  if (options.enableGivenStep && options.givenStep) {
    prefix.push({
      id: `${task.id}-given`,
      type: "condition_parse",
      title: "Выдели главное в условии",
      hint: "«Дано» — факты из текста. «Найти» — последний вопрос задачи.",
      parseData: options.givenStep,
    });
  }

  return [...prefix, ...contentSteps];
}
