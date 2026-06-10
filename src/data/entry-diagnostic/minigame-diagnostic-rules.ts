import type { RuleItem } from "@/components/entry-diagnostic/ui/Rules";
import { PARKOMAT_ASSETS } from "@/components/entry-diagnostic/mini-games/parkomat/parkomat-assets";
import { ENTRY_DIAGNOSTIC_ASSETS, POJMAT_RULE_ICONS } from "@/data/entry-diagnostic/visual-assets";

export interface MiniGameDiagnosticRules {
  title: string;
  paragraphs: string[];
}

const POJMAT_RULES: MiniGameDiagnosticRules = {
  title: "МышМат: ПойМАТ!",
  paragraphs: [
    "Прочитай условие сверху.",
    "Карточки будут падать по четырём дорожкам.",
    "Поставь корзинку под правильную карточку.",
    "Когда карточка попадёт в корзинку — ответ засчитается.",
  ],
};

export function getPojmatRulesScreen() {
  return {
    title: POJMAT_RULES.title,
    rulesBefore: [
      "Прочитай условие сверху.",
      "Карточки будут падать по четырём дорожкам.",
    ],
    controlSection: {
      title: "Как управлять:",
      hints: [
        { kind: "keyboard" as const, text: "клавиши на клавиатуре" },
        { kind: "tap" as const, text: "или тап по нужной дорожке" },
      ],
    },
    rulesAfter: [
      "Поставь корзинку под правильную карточку.",
      "Когда карточка попадёт в корзинку — ответ засчитается.",
    ],
  };
}

const PARKOMAT_RULES: MiniGameDiagnosticRules = {
  title: "МышМат: ПаркоМат",
  paragraphs: [
    "Прочитай короткую ситуацию сверху.",
    "Если стало меньше — открывай левый шлагбаум с минусом.",
    "Если стало больше — открывай правый шлагбаум с плюсом.",
    "Управляй стрелками на клавиатуре или кнопками на экране.",
  ],
};

const GENERIC_RULES: Record<string, MiniGameDiagnosticRules> = {
  razryad: {
    title: "МышМат: Чиню разряд!",
    paragraphs: ["Помоги МышМату починить число.", "Выбирай цифру или действие на экране."],
  },
};

export function getMiniGameDiagnosticRules(miniGameId: string, fallbackTitle: string): MiniGameDiagnosticRules {
  if (miniGameId === "pojmat") return POJMAT_RULES;
  if (miniGameId === "parkomat") return PARKOMAT_RULES;
  const custom = GENERIC_RULES[miniGameId];
  if (custom) return custom;
  return {
    title: fallbackTitle,
    paragraphs: ["Смотри на экран и делай то, что просит МышМат.", "Подсказок во время игры не будет."],
  };
}

const POJMAT_RULE_ITEMS: RuleItem[] = [
  {
    iconSrc: POJMAT_RULE_ICONS[0],
    text: "Карточки будут падать вниз по четырём дорожкам.",
  },
  {
    iconSrc: POJMAT_RULE_ICONS[1],
    text: "Передвигай МышМата влево и вправо.",
  },
  {
    iconSrc: POJMAT_RULE_ICONS[2],
    text: "Поставь корзинку под карточку с правильным смыслом вопроса.",
  },
  {
    iconSrc: POJMAT_RULE_ICONS[2],
    text: "Когда карточка попадёт в корзинку, ответ засчитается.",
  },
];

const PARKOMAT_RULE_ITEMS: RuleItem[] = [
  {
    iconSrc: ENTRY_DIAGNOSTIC_ASSETS.characters.myshmatRead,
    text: "Прочитай короткую ситуацию сверху.",
  },
  {
    iconSrc: PARKOMAT_ASSETS.iconMinus,
    text: "Если стало меньше — открывай левый шлагбаум с минусом.",
  },
  {
    iconSrc: PARKOMAT_ASSETS.iconPlus,
    text: "Если стало больше — открывай правый шлагбаум с плюсом.",
  },
  {
    iconSrc: ENTRY_DIAGNOSTIC_ASSETS.icons.ruleMoveLeftRight,
    text: "Управляй стрелками на клавиатуре или кнопками на экране.",
  },
];

/** Пункты правил с иконками для экрана Rules */
export function getMiniGameRuleItems(miniGameId: string, fallbackTitle: string): RuleItem[] {
  if (miniGameId === "pojmat") return POJMAT_RULE_ITEMS;
  if (miniGameId === "parkomat") return PARKOMAT_RULE_ITEMS;
  const rules = getMiniGameDiagnosticRules(miniGameId, fallbackTitle);
  const icons = [
    ENTRY_DIAGNOSTIC_ASSETS.icons.ruleCardsFall,
    ENTRY_DIAGNOSTIC_ASSETS.icons.ruleMoveLeftRight,
    ENTRY_DIAGNOSTIC_ASSETS.icons.ruleCatchBasket,
  ];
  return rules.paragraphs.map((text, index) => ({
    iconSrc: icons[index % icons.length]!,
    text,
  }));
}

export function getMiniGameRulesPreview(miniGameId: string): string | undefined {
  if (miniGameId === "pojmat") {
    return ENTRY_DIAGNOSTIC_ASSETS.characters.myshmatBasketSmall;
  }
  if (miniGameId === "parkomat") {
    return PARKOMAT_ASSETS.carMascot;
  }
  return undefined;
}

export function getMiniGameRulesHeader(miniGameId: string): string | undefined {
  if (miniGameId === "pojmat") {
    return ENTRY_DIAGNOSTIC_ASSETS.pojmat.titleChip;
  }
  if (miniGameId === "parkomat") {
    return PARKOMAT_ASSETS.header;
  }
  return undefined;
}
