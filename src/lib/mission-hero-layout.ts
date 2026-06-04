/** Пропорции видимой области баннера (как на макете) */
export const MISSION_HERO_WIDTH = 1024;
export const MISSION_HERO_HEIGHT = 331;

export const MISSION_HERO_ASPECT = `${MISSION_HERO_WIDTH} / ${MISSION_HERO_HEIGHT}`;

/** Слои баннера */
export const MISSION_HERO_BG = "/avatars/mission-bg.png";
export const MISSION_HERO_WIZARD = "/avatars/mission-wizard-cutout.png";

/** Исходник персонажа (ширина × высота) */
export const MISSION_WIZARD_SRC_WIDTH = 1024;
export const MISSION_WIZARD_SRC_HEIGHT = 682;

/**
 * Позиция мальчика на баннере 1024×331.
 * Персонаж поверх белой полоски (z-index выше).
 */
export const MISSION_WIZARD_LAYOUT = {
  right: "4%",
  bottom: "13%",
  height: "94%",
  maxWidth: "60%",
} as const;
