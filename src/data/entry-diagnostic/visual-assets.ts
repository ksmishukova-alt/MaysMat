/**
 * Библиотека визуальных ассетов Entry Diagnostic.
 * Файлы: public/entry-diagnostic/
 */
export const ENTRY_DIAGNOSTIC_ASSETS = {
  brand: {
    logo: "/entry-diagnostic/brand/logo-diagnostic.png",
  },
  characters: {
    /** @deprecated старый 2D-спрайт */
    myshmatLegacy: "/entry-diagnostic/pojmat/myshmat.png",
    // Часть 1
    myshmatBasket: "/entry-diagnostic/characters/myshmat-basket.png",
    myshmatRead: "/entry-diagnostic/characters/myshmat-read.png",
    myshmatRun: "/entry-diagnostic/characters/myshmat-run.png",
    myshmatWave: "/entry-diagnostic/characters/myshmat-wave.png",
    myshmatWelcome: "/entry-diagnostic/characters/myshmat-welcome.png",
    myshmatPoint: "/entry-diagnostic/characters/myshmat-point.png",
    myshmatThumbsUp: "/entry-diagnostic/characters/myshmat-thumbs-up.png",
    myshmatCelebrate: "/entry-diagnostic/characters/myshmat-celebrate.png",
    myshmatRadost: "/entry-diagnostic/characters/myshmat_radost.png",
    myshmatSurprised: "/entry-diagnostic/characters/myshmat-surprised.png",
    // Часть 2
    myshmatPortrait: "/entry-diagnostic/characters/myshmat-portrait.png",
    myshmatWaveFull: "/entry-diagnostic/characters/myshmat-wave-full.png",
    myshmatBasketSmall: "/entry-diagnostic/characters/myshmat-basket-small.png",
    myshmatBasketLarge: "/entry-diagnostic/characters/myshmat-basket-large.png",
    myshmatJump: "/entry-diagnostic/characters/myshmat-jump.png",
    myshmatThink: "/entry-diagnostic/characters/myshmat-think.png",
    myshmatIdle: "/entry-diagnostic/characters/myshmat-idle.png",
  },
  icons: {
    /** Одна стрелка → поворот: left 180°, up -90°, down 90° */
    btnNavArrow: "/entry-diagnostic/icons/btn-nav-arrow.png",
    /** @deprecated используйте btnNavArrow + CSS rotate */
    btnArrowLeft: "/entry-diagnostic/icons/btn-nav-arrow.png",
    btnArrowRight: "/entry-diagnostic/icons/btn-nav-arrow.png",
    chipTimer: "/entry-diagnostic/icons/chip-timer.png",
    chipStarScore: "/entry-diagnostic/icons/chip-star-score.png",
    pojmatTitleChip: "/entry-diagnostic/icons/pojmat-title-chip.png",
    /** Intro — 4 строки карточки */
    intro15Topics: "/entry-diagnostic/icons/intro-15-topics.png",
    introNoHints: "/entry-diagnostic/icons/intro-no-hints.png",
    introResultEnd: "/entry-diagnostic/icons/intro-result-end.png",
    introFriendsPlay: "/entry-diagnostic/icons/intro-friends-play.png",
    /** Transitions B / E */
    badgeStar: "/entry-diagnostic/icons/badge-star.png",
    badgeCheck: "/entry-diagnostic/icons/badge-check.png",
    giftNextTopic: "/entry-diagnostic/icons/gift-next-topic.png",
    /** Правила ПойМАТ */
    ruleCardsFall: "/entry-diagnostic/icons/rule-cards-fall.png",
    ruleMoveLeftRight: "/entry-diagnostic/icons/rule-move.png",
    ruleCatchBasket: "/entry-diagnostic/icons/rule-catch-basket.png",
  },
  pojmat: {
    arena: {
      mobile: "/entry-diagnostic/pojmat/arena-bg-mobile.png",
      desktop: "/entry-diagnostic/pojmat/arena-bg-desktop.png",
    },
    conditionIconApples: "/entry-diagnostic/pojmat/condition-icon-apples.png",
    titleChip: "/entry-diagnostic/icons/pojmat-title-chip.png",
  },
  /** Full-screen фоны — public/entry-diagnostic/backgrounds/ */
  backgrounds: {
    /** Intro, правила — синее небо + тропинка */
    intro: "/entry-diagnostic/backgrounds/bg-01-intro-path.png",
    introAlt: "/entry-diagnostic/backgrounds/bg-02-intro-path-light.png",
    /** Задания D1–D3 — открытый луг, чистый центр */
    task: "/entry-diagnostic/backgrounds/bg-07-task-blue-simple.png",
    taskAlt: "/entry-diagnostic/backgrounds/bg-08-task-blue-math.png",
    /** «Тема завершена» — жёлтый + confetti */
    topicDone: "/entry-diagnostic/backgrounds/bg-03-topic-done-confetti.png",
    topicDoneAlt: "/entry-diagnostic/backgrounds/bg-04-topic-done-confetti-path.png",
    /** «Готово, дальше» — лайм / success */
    nextTopic: "/entry-diagnostic/backgrounds/bg-06-next-topic-lime.png",
    nextTopicAlt: "/entry-diagnostic/backgrounds/bg-05-lime-path.png",
    /** Итоговый отчёт — нейтральное синее небо */
    report: "/entry-diagnostic/backgrounds/bg-08-task-blue-math.png",
  },
} as const;

/** Строки intro-экрана: иконка + ключ текста */
export const DIAGNOSTIC_INTRO_ROWS = [
  { icon: ENTRY_DIAGNOSTIC_ASSETS.icons.intro15Topics, textKey: "topics" as const },
  { icon: ENTRY_DIAGNOSTIC_ASSETS.icons.introNoHints, textKey: "noHints" as const },
  { icon: ENTRY_DIAGNOSTIC_ASSETS.icons.introFriendsPlay, textKey: "friendsPlay" as const },
] as const;

/** Пункты правил ПойМАТ */
export const POJMAT_RULE_ICONS = [
  ENTRY_DIAGNOSTIC_ASSETS.icons.ruleCardsFall,
  ENTRY_DIAGNOSTIC_ASSETS.icons.ruleMoveLeftRight,
  ENTRY_DIAGNOSTIC_ASSETS.icons.ruleCatchBasket,
] as const;

/** Роль фона → URL для DiagnosticFocusLayout */
export const DIAGNOSTIC_BACKGROUND_BY_PHASE = {
  intro: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.intro,
  task: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.task,
  pre_minigame: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.topicDone,
  minigame_rules: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.introAlt,
  minigame: null as string | null,
  post_block: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.nextTopic,
  block_intro: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.nextTopic,
  complete: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.report,
} as const;

/** Mobile / desktop фоны по UI-фазе (390×844 и 1280×900) */
export const DIAGNOSTIC_PHASE_BACKGROUNDS: Record<
  string,
  { mobile: string; desktop: string } | null
> = {
  intro: {
    mobile: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.intro,
    desktop: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.introAlt,
  },
  block_intro: {
    mobile: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.nextTopic,
    desktop: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.nextTopicAlt,
  },
  task: {
    mobile: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.task,
    desktop: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.taskAlt,
  },
  pre_minigame: {
    mobile: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.topicDone,
    desktop: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.topicDoneAlt,
  },
  rules: {
    mobile: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.introAlt,
    desktop: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.task,
  },
  game: null,
  post_block: {
    mobile: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.nextTopic,
    desktop: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.nextTopicAlt,
  },
  result: {
    mobile: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.report,
    desktop: ENTRY_DIAGNOSTIC_ASSETS.backgrounds.report,
  },
};

/** Рекомендуемый маскот по экрану диагностики */
export const DIAGNOSTIC_MYSHMAT_POSE: Record<string, string> = {
  intro: ENTRY_DIAGNOSTIC_ASSETS.characters.myshmatWave,
  header: ENTRY_DIAGNOSTIC_ASSETS.characters.myshmatPortrait,
  taskRead: ENTRY_DIAGNOSTIC_ASSETS.characters.myshmatRead,
  taskChoice: ENTRY_DIAGNOSTIC_ASSETS.characters.myshmatPoint,
  topicDone: ENTRY_DIAGNOSTIC_ASSETS.characters.myshmatRadost,
  rules: ENTRY_DIAGNOSTIC_ASSETS.characters.myshmatPoint,
  pojmat: ENTRY_DIAGNOSTIC_ASSETS.characters.myshmatBasketLarge,
  postBlock: ENTRY_DIAGNOSTIC_ASSETS.characters.myshmatThumbsUp,
  nextTopic: ENTRY_DIAGNOSTIC_ASSETS.characters.myshmatWaveFull,
  idle: ENTRY_DIAGNOSTIC_ASSETS.characters.myshmatIdle,
  think: ENTRY_DIAGNOSTIC_ASSETS.characters.myshmatThink,
  playRun: ENTRY_DIAGNOSTIC_ASSETS.characters.myshmatRun,
  playJump: ENTRY_DIAGNOSTIC_ASSETS.characters.myshmatJump,
  playSurprised: ENTRY_DIAGNOSTIC_ASSETS.characters.myshmatSurprised,
};

/** Design tokens v1 */
export const DIAGNOSTIC_DESIGN_TOKENS = {
  focusBg: "#EAF4FF",
  cardBg: "#FFFFFF",
  primary: "#7B42F6",
  answerColors: {
    purple: "#7B42F6",
    blue: "#2EA7FF",
    orange: "#FF9F2E",
    green: "#22C55E",
  },
  progressDotInactive: "#D8E2EC",
  cardRadiusPx: 24,
  cardShadow: "0 8px 24px rgba(16, 24, 40, 0.08)",
  cardPaddingPx: 24,
  buttonRadiusPx: 16,
  buttonMinHeightPx: 48,
  progressDotSizePx: 12,
  progressDotGapPx: 8,
} as const;
