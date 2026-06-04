/** Видео тем и задач (заглушки пилота — заменить на реальные ролики) */

export interface BranchVideoMeta {
  introVideoUrl: string;
  /** Длительность для подписи в UI (секунды) */
  introVideoDurationSec: number;
  introCaption: string;
}

export interface TaskVideoMeta {
  helpVideoUrl: string;
  helpCaption: string;
}

export const DEFAULT_INTRO_VIDEO = "/videos/intro-placeholder.webm";
export const DEFAULT_HELP_VIDEO = "/videos/help-placeholder.webm";

export const BRANCH_VIDEOS: Record<string, BranchVideoMeta> = {
  "modeling-heads-legs": {
    introVideoUrl: DEFAULT_INTRO_VIDEO,
    introVideoDurationSec: 6,
    introCaption: "Узнаем метод «все лёгкие → считаем → заменяем»",
  },
  "fairy-caves": {
    introVideoUrl: DEFAULT_INTRO_VIDEO,
    introVideoDurationSec: 6,
    introCaption: "Правило пещеры: голов у сороконожек и драконов поровну",
  },
};

export const TASK_HELP_VIDEOS: Record<string, TaskVideoMeta> = {
  "heads-legs-01": {
    helpVideoUrl: DEFAULT_HELP_VIDEO,
    helpCaption: "Разбор задачи «Цыплята и змеи» по шагам",
  },
  "heads-legs-02": {
    helpVideoUrl: DEFAULT_HELP_VIDEO,
    helpCaption: "Как решать с кроликами и утками",
  },
  "heads-legs-03": {
    helpVideoUrl: DEFAULT_HELP_VIDEO,
    helpCaption: "Наклейки: тот же метод, другой контекст",
  },
  "fairy-caves-01": {
    helpVideoUrl: DEFAULT_HELP_VIDEO,
    helpCaption: "Правило «голов поровну» в первой пещере",
  },
};

export function getBranchVideo(branchId: string): BranchVideoMeta | undefined {
  return BRANCH_VIDEOS[branchId];
}

export function getTaskHelpVideo(taskId: string): TaskVideoMeta | undefined {
  return TASK_HELP_VIDEOS[taskId];
}
