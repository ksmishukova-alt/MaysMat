/** Короткие правила mini-game в diagnostic mode (без очков и соревнований) */

export interface MiniGameDiagnosticRules {
  title: string;
  paragraphs: string[];
}

const POJMAT_RULES: MiniGameDiagnosticRules = {
  title: "МышМат: ПойМАТ!",
  paragraphs: [
    "Карточки будут падать по дорожкам.",
    "Передвигай МышМата влево и вправо.",
    "Поставь корзинку под карточку с правильным смыслом вопроса.",
    "Когда карточка попадёт в корзинку, ответ засчитается.",
  ],
};

const GENERIC_RULES: Record<string, MiniGameDiagnosticRules> = {
  parkomat: {
    title: "МышМат: ПаркоМАТ",
    paragraphs: ["Смотри на экран и выбирай правильный ответ.", "МышМат подскажет, куда нажать."],
  },
  razryad: {
    title: "МышМат: Чиню разряд!",
    paragraphs: ["Помоги МышМату починить число.", "Выбирай цифру или действие на экране."],
  },
};

export function getMiniGameDiagnosticRules(miniGameId: string, fallbackTitle: string): MiniGameDiagnosticRules {
  if (miniGameId === "pojmat") return POJMAT_RULES;
  const custom = GENERIC_RULES[miniGameId];
  if (custom) return custom;
  return {
    title: fallbackTitle,
    paragraphs: ["Смотри на экран и делай то, что просит МышМат.", "Подсказок во время игры не будет."],
  };
}
