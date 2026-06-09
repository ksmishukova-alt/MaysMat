import type { MiniGameConfig } from "../types";

export interface MiniGameSpec {
  miniGameId: string;
  instruction: string;
  /** Семантически верная карточка (не моторика) */
  correctTarget: string;
  targets: string[];
  /** Доп. метрика для diagnostic */
  semanticTrap?: string;
}

export const MINI_GAME_SPECS: Record<string, MiniGameSpec> = {
  pojmat: {
    miniGameId: "pojmat",
    instruction: "Поймай карточку с правильным смыслом вопроса",
    correctTarget: "together",
    targets: ["together", "non_choco", "blue_green"],
    semanticTrap: "left",
  },
  parkomat: {
    miniGameId: "parkomat",
    instruction: "Куда ставим машину: приехала или уехала?",
    correctTarget: "приехала",
    targets: ["приехала", "уехала", "осталась", "итог"],
  },
  razryad: {
    miniGameId: "razryad",
    instruction: "Где нужен перенос разряда?",
    correctTarget: "перенос",
    targets: ["единицы", "перенос", "десятки", "сотни"],
  },
  warehouse: {
    miniGameId: "warehouse",
    instruction: "Сколько одинаковых групп на складе?",
    correctTarget: "группы",
    targets: ["группы", "остаток", "сумма", "разница"],
  },
  bubbles: {
    miniGameId: "bubbles",
    instruction: "Выбери кратное число",
    correctTarget: "кратное",
    targets: ["кратное", "делитель", "остаток", "сумма"],
  },
  station: {
    miniGameId: "station",
    instruction: "Полный вагон или остаток?",
    correctTarget: "остаток",
    targets: ["полный", "остаток", "скорость", "время"],
  },
  parade: {
    miniGameId: "parade",
    instruction: "Кто первый в очереди действий?",
    correctTarget: "× :",
    targets: ["× :", "+ −", "скобки", "ответ"],
  },
  "mouse-route": {
    miniGameId: "mouse-route",
    instruction: "Следующий шаг маршрута задачи",
    correctTarget: "шаг",
    targets: ["шаг", "лишнее", "ответ", "проверка"],
  },
  "time-path": {
    miniGameId: "time-path",
    instruction: "Что ищем: путь, скорость или время?",
    correctTarget: "скорость",
    targets: ["путь", "скорость", "время", "сумма"],
  },
  "fence-tile": {
    miniGameId: "fence-tile",
    instruction: "Забор (периметр) или плитка (площадь)?",
    correctTarget: "плитка",
    targets: ["забор", "плитка", "угол", "сторона"],
  },
  "cheese-share": {
    miniGameId: "cheese-share",
    instruction: "Какая доля сыра на тарелке?",
    correctTarget: "1/2",
    targets: ["1/4", "1/2", "3/4", "целое"],
  },
  percentomat: {
    miniGameId: "percentomat",
    instruction: "Скидка 10% — что считаем первым?",
    correctTarget: "1%",
    targets: ["100%", "1%", "10%", "итог"],
  },
  advocate: {
    miniGameId: "advocate",
    instruction: "Верное следствие из условия",
    correctTarget: "следствие",
    targets: ["условие", "следствие", "контрпример", "шум"],
  },
  "code-chest": {
    miniGameId: "code-chest",
    instruction: "Следующий вариант перебора",
    correctTarget: "вариант",
    targets: ["вариант", "дубликат", "пропуск", "ответ"],
  },
  "catch-repeat": {
    miniGameId: "catch-repeat",
    instruction: "Позиция в цикле",
    correctTarget: "остаток",
    targets: ["период", "остаток", "символ", "длина"],
  },
  "counting-road": {
    miniGameId: "counting-road",
    instruction: "Продолжи счётную дорогу",
    correctTarget: "+2",
    targets: ["+1", "+2", "+5", "×2"],
  },
};

export function getMiniGameSpec(id: string): MiniGameSpec | undefined {
  return MINI_GAME_SPECS[id];
}

export function assertMiniGameSpecsComplete(configs: MiniGameConfig[]): void {
  for (const c of configs) {
    if (!MINI_GAME_SPECS[c.miniGameId]) {
      throw new Error(`Missing mini-game spec: ${c.miniGameId}`);
    }
  }
}
