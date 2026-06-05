import type { DiscriminatedTaskStep } from "@/data/task-steps";

import type { Task } from "@/data/tasks";

import { getAcceptedAnswer } from "./answers";

import { HEADS_LEGS_CATALOG } from "./catalog.generated";

import { HEADS_LEGS_HINTS } from "./hints.generated";

import { HEADS_LEGS_SOLUTION_LINES } from "./solution-lines.generated";

import { buildGuidedSteps } from "./guided/build-guided-steps";

import { TOTALS_OVERRIDES } from "./guided/totals-overrides";

import { inferTaskEntities } from "./guided/participants";

import { inferModelFromCondition } from "@/lib/heads-legs-model-infer";
import { resolveTaskPublishing } from "@/data/task-publishing/resolve";

import { normalizeSolutionMode } from "./solution-modes";

import type { HeadsLegsCatalogEntry, HeadsLegsTaskMeta, SolutionLine } from "./types";



const BRANCH_ID = "modeling-heads-legs";



function defaultModelLevel(difficulty: number): 1 | 2 | 3 | 4 | 5 | 6 {

  if (difficulty <= 1) return 1;

  if (difficulty <= 2) return 2;

  if (difficulty <= 4) return 3;

  return 4;

}



function defaultIndependence(difficulty: number): 1 | 2 | 3 | 4 | 5 {

  return Math.min(5, Math.max(1, difficulty)) as 1 | 2 | 3 | 4 | 5;

}



function getSolutionLines(entry: HeadsLegsCatalogEntry): SolutionLine[] {

  return (

    HEADS_LEGS_SOLUTION_LINES[entry.methodTaskId] ?? [

      { template: "Представим, что все объекты были первого вида.", blanks: [] },

      { template: "Ответ: [запиши числа из задачи].", blanks: [] },

    ]

  );

}



function getHintLevels(entry: HeadsLegsCatalogEntry): [string, string, string] | undefined {

  return HEADS_LEGS_HINTS[entry.methodTaskId];

}



function buildSteps(meta: HeadsLegsTaskMeta): DiscriminatedTaskStep[] {

  return buildGuidedSteps(meta);

}



function inferConstraints(

  condition: string,

  difficulty: number,

  accepted: ReturnType<typeof getAcceptedAnswer>,

): HeadsLegsTaskMeta["constraints"] {

  const bothTypes =

    /мальчик.*девоч|девоч.*мальчик|собак.*кошек|кошек.*собак|третьекласс.*пятикласс|пятикласс.*третьекласс/i.test(

      condition,

    );

  if (accepted.kind === "diagnostic") {

    return { bothTypesPresent: bothTypes, allowZero: false };

  }

  if (difficulty >= 4 || bothTypes) {

    return { bothTypesPresent: bothTypes || difficulty >= 4, allowZero: false };

  }

  return undefined;

}



export function catalogEntryToMeta(entry: HeadsLegsCatalogEntry): HeadsLegsTaskMeta {

  const acceptedAnswers = getAcceptedAnswer(entry.methodTaskId);

  const inferred = inferModelFromCondition(entry.condition);

  const entities = inferTaskEntities(entry.condition, entry.methodTaskId, getSolutionLines(entry));

  const totalsOverride = TOTALS_OVERRIDES[entry.methodTaskId];

  return {

    ...entry,

    solutionMode: normalizeSolutionMode(entry.solutionMode),

    modelIndependenceLevel: defaultModelLevel(entry.difficultyLevel),

    acceptedAnswers,

    constraints: inferConstraints(entry.condition, entry.difficultyLevel, acceptedAnswers),

    entities,

    totals: {

      totalObjects:
        totalsOverride?.totalObjects ??
        (inferred.totalObjectsKnown
          ? inferred.slots.find((s) => s.id === "totalObjects")?.accept[0] ?? null
          : null),

      totalFeature:
        totalsOverride?.totalFeature ??
        inferred.slots.find((s) => s.id === "totalFeature")?.accept[0] ??
        null,

    },

    solutionLines: getSolutionLines(entry),

    hintLevels: getHintLevels(entry),

  };

}



export function buildHeadsLegsTask(meta: HeadsLegsTaskMeta): Task {
  const task: Task = {
    id: meta.id,
    branchId: BRANCH_ID,
    number: meta.number,
    title: meta.title,
    condition: meta.condition,
    stage: meta.stage,
    maxStars: 3,
    independenceLevel: defaultIndependence(meta.difficultyLevel),
    requiresUpload: false,
    skillWeights: { modeling: 0.85, logic: 0.15 },
    enableGivenStep: false,
    steps: buildSteps(meta),
    headsLegsMeta: meta,
  };
  task.publishing = resolveTaskPublishing(task);
  return task;
}



export function buildAllHeadsLegsTasks(): Record<string, Task> {

  const out: Record<string, Task> = {};

  for (const entry of HEADS_LEGS_CATALOG) {

    const task = buildHeadsLegsTask(catalogEntryToMeta(entry));

    out[task.id] = task;

  }

  return out;

}



export const HEADS_LEGS_TASKS = buildAllHeadsLegsTasks();

export const HEADS_LEGS_TASK_LIST = HEADS_LEGS_CATALOG.map((e) => e.id);


