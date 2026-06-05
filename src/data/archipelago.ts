/** Маршрут архипелага МышМат — острова открываются по уровню навыка */

export type SkillLevel = 0 | 1 | 2 | 3;

export const SKILL_LEVEL_LABELS: readonly string[] = [
  "Не знаком",
  "Узнаёт",
  "Использует",
  "Переносит",
] as const;

/** Порог навыка на предыдущем острове, чтобы открыть следующий */
export const UNLOCK_SKILL_USES: SkillLevel = 2;
export const UNLOCK_SKILL_TRANSFERS: SkillLevel = 3;

export interface IslandStation {
  day: number;
  title: string;
  short: string;
}

/** 7 дневных станций — одинаковая структура на каждом острове */
export const ISLAND_STATIONS: readonly IslandStation[] = [
  { day: 1, title: "Открываем идею", short: "Очень интерактивно" },
  { day: 2, title: "Учимся узнавать метод", short: "Узнаём инструмент" },
  { day: 3, title: "Решаем с подсказками", short: "С опорой" },
  { day: 4, title: "Решаем почти сами", short: "Мало подсказок" },
  { day: 5, title: "Задачи уровня олимпиады", short: "Олимпиадный уровень" },
  { day: 6, title: "Ручка и листик", short: "Письменное объяснение" },
  { day: 7, title: "Проверка переноса", short: "Новая задача — тот же навык" },
] as const;

export type ArchipelagoKind = "pier" | "island" | "finale";

export interface ArchipelagoIsland {
  id: string;
  order: number;
  title: string;
  emoji: string;
  kind: ArchipelagoKind;
  /** Главная суперсила острова */
  superpower: string;
  /** Темы внутри (для ребёнка) */
  topics: readonly string[];
  /** Связь с ветками tasks.ts / thinking-map */
  branchIds?: readonly string[];
  /** Проходной навык — текст для родителя и ребёнка */
  gateSkill: string;
  /** Ключевой остров: для открытия следующего нужен «Переносит» */
  isKeyIsland: boolean;
  /** Чередование на карте-маршруте */
  mapSide: "left" | "right";
  /** Акцентный цвет градиента */
  accent: string;
}

export const ARCHIPELAGO: readonly ArchipelagoIsland[] = [
  {
    id: "gear-check",
    order: 0,
    title: "Проверка снаряжения",
    emoji: "⚓",
    kind: "pier",
    superpower: "Понять, с чего начать путь",
    topics: ["Арифметика", "Чтение условия", "Простые схемы", "Короткое объяснение"],
    gateSkill: "База готова — можно идти на Остров Моделей",
    isKeyIsland: false,
    mapSide: "left",
    accent: "from-stone-100 to-slate-200",
  },
  {
    id: "models",
    order: 1,
    title: "Остров Моделей",
    emoji: "🔧",
    kind: "island",
    superpower: "Переводить текст в схему",
    topics: ["Рисунок", "Схема", "Таблица", "Головы и ноги", "Части и целое", "Движение"],
    branchIds: [
      "modeling-drawing",
      "modeling-schemes",
      "modeling-heads-legs",
      "modeling-speed",
      "fairy-caves",
    ],
    gateSkill: "Сам выбирает модель: рисунок / таблица / схема",
    isKeyIsland: true,
    mapSide: "right",
    accent: "from-violet-100 to-purple-200",
  },
  {
    id: "logic",
    order: 2,
    title: "Остров Логики",
    emoji: "🧩",
    kind: "island",
    superpower: "Понимать, что следует из условий",
    topics: ["Все / некоторые", "Множества", "Круги Эйлера", "Соответствия", "Рыцари и лжецы"],
    branchIds: ["logic-sets", "logic-euler", "logic-matching", "logic-knights"],
    gateSkill: "Сам объясняет, почему вариант невозможен",
    isKeyIsland: true,
    mapSide: "left",
    accent: "from-indigo-100 to-blue-200",
  },
  {
    id: "variants-forest",
    order: 3,
    title: "Лес Вариантов",
    emoji: "🌲",
    kind: "island",
    superpower: "Ничего не пропускать",
    topics: ["Перебор", "Таблица вариантов", "Дерево вариантов", "Простая комбинаторика"],
    branchIds: ["comb-enumeration", "comb-tree"],
    gateSkill: "Умеет организовать перебор",
    isKeyIsland: true,
    mapSide: "right",
    accent: "from-emerald-100 to-green-200",
  },
  {
    id: "patterns-city",
    order: 4,
    title: "Город Закономерностей",
    emoji: "🏙️",
    kind: "island",
    superpower: "Замечать, что повторяется",
    topics: ["Последовательности", "Узоры", "Рост фигур", "Таблицы роста", "Циклы"],
    branchIds: ["algo-repetition", "algo-cycles", "algo-rules"],
    gateSkill: "Находит правило и применяет его дальше",
    isKeyIsland: true,
    mapSide: "left",
    accent: "from-amber-100 to-orange-200",
  },
  {
    id: "proof-academy",
    order: 5,
    title: "Академия Доказательств",
    emoji: "📜",
    kind: "island",
    superpower: "Объяснять, почему ответ точно верный",
    topics: [
      "Подсчёт двумя способами",
      "Дирихле",
      "Метод неудачника",
      "Табличные клетки",
      "Конструкции",
      "Узкие места",
      "Оценка + пример",
    ],
    branchIds: [
      "comb-two-ways",
      "proof-dirichlet",
      "proof-unlucky",
      "proof-table-cells",
      "proof-extreme",
      "proof-constructions",
      "proof-bottleneck",
      "proof-estimate",
    ],
    gateSkill: "Пишет связное объяснение, а не только ответ",
    isKeyIsland: true,
    mapSide: "right",
    accent: "from-yellow-100 to-amber-200",
  },
  {
    id: "impossibility",
    order: 6,
    title: "Остров Невозможностей",
    emoji: "🚫",
    kind: "island",
    superpower: "Доказывать, что так быть не может",
    topics: ["Чётность", "Раскраски", "Операции", "Инварианты", "Невозможность"],
    branchIds: ["inv-parity", "inv-coloring", "inv-operations", "inv-impossible"],
    gateSkill: "Находит, что сохраняется или нарушается",
    isKeyIsland: true,
    mapSide: "left",
    accent: "from-rose-100 to-red-200",
  },
  {
    id: "strategy-bay",
    order: 7,
    title: "Стратегическая бухта",
    emoji: "⚔️",
    kind: "island",
    superpower: "Думать на несколько ходов вперёд",
    topics: ["Игры", "Выигрышные позиции", "Ответный ход", "Симметрия"],
    branchIds: ["games-winning", "games-response", "games-symmetry"],
    gateSkill: "Объясняет стратегию, а не только делает ход",
    isKeyIsland: true,
    mapSide: "right",
    accent: "from-teal-100 to-cyan-200",
  },
  {
    id: "graph-city",
    order: 8,
    title: "Город Графов",
    emoji: "🕸️",
    kind: "island",
    superpower: "Видеть связи",
    topics: ["Вершины", "Рёбра", "Пути", "Связность", "Маршруты"],
    branchIds: ["graphs-vertices", "graphs-edges", "graphs-paths", "graphs-connectivity"],
    gateSkill: "Переводит задачу в сеть связей",
    isKeyIsland: true,
    mapSide: "left",
    accent: "from-sky-100 to-blue-200",
  },
  {
    id: "number-caves",
    order: 9,
    title: "Числовые пещеры",
    emoji: "🔢",
    kind: "island",
    superpower: "Понимать устройство чисел",
    topics: ["Делимость", "Остатки", "НОД/НОК", "Разложение", "Числовые ребусы"],
    branchIds: ["arith-divisibility", "arith-remainders", "arith-gcd", "arith-rebus"],
    gateSkill: "Использует свойства чисел, а не только считает",
    isKeyIsland: true,
    mapSide: "right",
    accent: "from-red-100 to-orange-200",
  },
  {
    id: "figures-city",
    order: 10,
    title: "Город Фигур",
    emoji: "📐",
    kind: "island",
    superpower: "Видеть форму и пространство",
    topics: ["Клетки", "Разрезания", "Площади", "Симметрия"],
    branchIds: ["geo-cells", "geo-cutting", "geo-area", "geo-symmetry"],
    gateSkill: "Рассуждает по рисунку и объясняет геометрический ход",
    isKeyIsland: true,
    mapSide: "left",
    accent: "from-fuchsia-100 to-purple-200",
  },
  {
    id: "olympiad",
    order: 11,
    title: "Олимпиадный архипелаг",
    emoji: "🏆",
    kind: "finale",
    superpower: "Сам выбирает инструмент",
    topics: ["Бельчонок", "2×2", "57.4", "Систематика", "Смешанные задачи"],
    gateSkill: "Определяет, какой метод нужен, без подсказки темы",
    isKeyIsland: true,
    mapSide: "right",
    accent: "from-amber-200 via-yellow-100 to-orange-200",
  },
] as const;

export function getArchipelagoIsland(id: string): ArchipelagoIsland | undefined {
  return ARCHIPELAGO.find((i) => i.id === id);
}

export function getUnlockThreshold(island: ArchipelagoIsland): SkillLevel {
  return island.isKeyIsland ? UNLOCK_SKILL_TRANSFERS : UNLOCK_SKILL_USES;
}
