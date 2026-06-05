/** Роль сущности в задачах Дирихле (зайцы / клетки) или общий объект */
export type EntityEmojiRole = "rabbit" | "cell" | "object";

/** Явные id из infer-model / overrides */
const ID_EMOJI: Record<string, string> = {
  tourists: "🎒",
  students: "🎓",
  pupils: "🎓",
  coins: "🪙",
  trees: "🌲",
  players: "⚽",
  cars: "🚗",
  candies: "🍬",
  mushrooms: "🍄",
  boxes: "📦",
  balls: "🔴",
  people: "👥",
  residents: "🏘️",
  points: "📍",
  matches: "🧯",
  boots: "👢",
  apples: "🍎",
  workers: "👷",
  objects: "🧩",
  numbers: "🔢",
  drawn: "✋",
  ages: "🎂",
  weekdays: "📅",
  months: "🗓️",
  days: "📆",
  "year-days": "📆",
  "coin-types": "💰",
  types: "💰",
  "needle-counts": "🌿",
  remainders: "➗",
  colors: "🎨",
  parts: "✂️",
  "table-rows": "📊",
  links: "🔗",
  construction: "🧱",
  categories: "🏷️",
  birthdays: "🎈",
  "from-key": "🔢",
  pieces: "♟️",
  marked: "⬛",
  rects: "▭",
};

/**
 * Правила по тексту подписи — от более специфичных к общим.
 * Коробки/ящики — только если это явно в тексте.
 */
const LABEL_RULES: Array<{ test: RegExp; emoji: string }> = [
  { test: /стол/i, emoji: "🗄️" },
  { test: /коробк|ящик/i, emoji: "📦" },
  { test: /турист/i, emoji: "🎒" },
  { test: /третьеклассник|пятиклассник|школьник|ученик|учениц|учащ|класс/i, emoji: "🎓" },
  { test: /мальчик/i, emoji: "👦" },
  { test: /девочк/i, emoji: "👧" },
  { test: /совят|совёнок|совуш/i, emoji: "🦉" },
  { test: /котят|кошк|котён/i, emoji: "🐱" },
  { test: /льв/i, emoji: "🦁" },
  { test: /тигр/i, emoji: "🐯" },
  { test: /собак/i, emoji: "🐕" },
  { test: /гусят|гус/i, emoji: "🪿" },
  { test: /крокодил/i, emoji: "🐊" },
  { test: /сороконож/i, emoji: "🐛" },
  { test: /дракон/i, emoji: "🐉" },
  { test: /жук/i, emoji: "🪲" },
  { test: /паук/i, emoji: "🕷️" },
  { test: /зме/i, emoji: "🐍" },
  { test: /слон/i, emoji: "🐘" },
  { test: /мух/i, emoji: "🪰" },
  { test: /грибник|гриб/i, emoji: "🍄" },
  { test: /монет/i, emoji: "🪙" },
  { test: /спичк/i, emoji: "🧯" },
  { test: /сапог/i, emoji: "👢" },
  { test: /шарик/i, emoji: "🔴" },
  { test: /ёлк|елк/i, emoji: "🎄" },
  { test: /автомобил|машин/i, emoji: "🚗" },
  { test: /жител/i, emoji: "🏘️" },
  { test: /люд|челов/i, emoji: "👥" },
  { test: /дроид|робот|at-st|at-at/i, emoji: "🤖" },
  { test: /гном/i, emoji: "🧙" },
  { test: /пони|лошад/i, emoji: "🐴" },
  { test: /верблюд/i, emoji: "🐫" },
  { test: /двухкол/i, emoji: "🚲" },
  { test: /тр[её]хкол/i, emoji: "🛺" },
  { test: /велосипед/i, emoji: "🚲" },
  { test: /табурет/i, emoji: "🪑" },
  { test: /стул/i, emoji: "💺" },
  { test: /клумб/i, emoji: "🌸" },
  { test: /дрон/i, emoji: "🛸" },
  { test: /пирожн/i, emoji: "🧁" },
  { test: /водолаз/i, emoji: "🤿" },
  { test: /осьминог/i, emoji: "🐙" },
  { test: /истребител|x-wing|xwing/i, emoji: "🚀" },
  { test: /крейсер/i, emoji: "🛸" },
  { test: /флагман/i, emoji: "⭐" },
  { test: /баз.*генерал|генерал.*баз/i, emoji: "⭐" },
  { test: /баз.*адмирал|адмирал.*баз/i, emoji: "🎖️" },
  { test: /баз.*дипломат|дипломат.*баз/i, emoji: "🤝" },
  { test: /механик/i, emoji: "🔧" },
  { test: /медик/i, emoji: "💉" },
  { test: /солдат|штурмовик/i, emoji: "🪖" },
  { test: /джеда/i, emoji: "⚔️" },
  { test: /ситх/i, emoji: "🗡️" },
  { test: /меч/i, emoji: "⚔️" },
  { test: /йод/i, emoji: "🟢" },
  { test: /оби-ван|квай-гон/i, emoji: "⚔️" },
  { test: /бант|ранкор|джав/i, emoji: "🚀" },
  { test: /антилоп/i, emoji: "🦌" },
  { test: /единорог/i, emoji: "🦄" },
  { test: /утконос|ут/i, emoji: "🦆" },
  { test: /открытк/i, emoji: "💌" },
  { test: /верн.*ответ/i, emoji: "✅" },
  { test: /невер.*ответ/i, emoji: "❌" },
  { test: /оценк|балл/i, emoji: "⭐" },
  { test: /возраст/i, emoji: "🎂" },
  { test: /день недел/i, emoji: "📅" },
  { test: /месяц/i, emoji: "🗓️" },
  { test: /день год|дни года/i, emoji: "📆" },
  { test: /тип.*монет|монет.*тип/i, emoji: "💰" },
  { test: /остатк.*дел/i, emoji: "➗" },
  { test: /цвет/i, emoji: "🎨" },
  { test: /част.*разбиен|разбиен/i, emoji: "✂️" },
  { test: /категор|клетк/i, emoji: "🏷️" },
  { test: /иголк/i, emoji: "🌿" },
  { test: /сорт/i, emoji: "🏷️" },
  { test: /рожден/i, emoji: "🎈" },
  { test: /птиц/i, emoji: "🐦" },
  { test: /звер/i, emoji: "🦁" },
  { test: /рыб/i, emoji: "🐟" },
  { test: /конфет/i, emoji: "🍬" },
  { test: /яблок/i, emoji: "🍎" },
  { test: /мыш/i, emoji: "🐭" },
  { test: /предмет/i, emoji: "🧩" },
  { test: /футболист|игрок/i, emoji: "⚽" },
  { test: /работник|рабоч|пастух/i, emoji: "👷" },
];

const ROLE_FALLBACK: Record<EntityEmojiRole, string> = {
  rabbit: "🔢",
  cell: "🏷️",
  object: "🧩",
};

/** Подбирает эмодзи по id и/или тексту подписи карточки */
export function resolveEntityEmoji(
  label: string,
  opts?: { id?: string; role?: EntityEmojiRole },
): string {
  const id = opts?.id?.trim();
  if (id && ID_EMOJI[id]) return ID_EMOJI[id];

  const text = label.trim();
  if (text) {
    for (const { test, emoji } of LABEL_RULES) {
      if (test.test(text)) return emoji;
    }
  }

  return ROLE_FALLBACK[opts?.role ?? "object"];
}

/** Короткий alias для карточек drag/select по подписи */
export function emojiForEntityLabel(label: string, id?: string): string {
  return resolveEntityEmoji(label, { id, role: "object" });
}
