import type { ConditionParseData, Task, TaskStep } from "@/data/tasks";

export type PlayerStepType = TaskStep["type"] | "read_condition";

export interface PlayerStep extends Omit<TaskStep, "type"> {
  type: PlayerStepType;
}

export function buildPlayerSteps(
  task: Task,
  options: { enableGivenStep: boolean; givenStep?: ConditionParseData }
): PlayerStep[] {
  const contentSteps = task.steps.filter((step) => step.type !== "condition_parse");

  const prefix: PlayerStep[] = [
    {
      id: `${task.id}-read`,
      type: "read_condition",
      title: "Прочитай задачу",
    },
  ];

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
