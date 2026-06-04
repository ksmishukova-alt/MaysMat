/** Смешные печати за решённую задачу */

export interface TaskStamp {
  id: string;
  emoji: string;
  title: string;
  punchline: string;
}

const STAMPS: TaskStamp[] = [
  {
    id: "slyshmysh",
    emoji: "🐭",
    title: "СлышМышь!",
    punchline: "Уши на макушке — задача схвачена",
  },
  {
    id: "cheese",
    emoji: "🧀",
    title: "Сыр-prise!",
    punchline: "Голова работает на полную мощность",
  },
  {
    id: "whisker",
    emoji: "✨",
    title: "Усы в стороны!",
    punchline: "Так держать, мышиный мозг",
  },
  {
    id: "tail-plus",
    emoji: "🎯",
    title: "Хвост в плюс!",
    punchline: "Попал в цель без промаха",
  },
  {
    id: "normouse",
    emoji: "👍",
    title: "Нормасс!",
    punchline: "Нормальная мышь — нормальное решение",
  },
  {
    id: "on-purpose",
    emoji: "🎪",
    title: "Умышленно!",
    punchline: "Так и задумывалось — ты молодец",
  },
  {
    id: "mouse-genius",
    emoji: "🧠",
    title: "Мышинген!",
    punchline: "Включился режим «я всё понял»",
  },
  {
    id: "task-hit",
    emoji: "💥",
    title: "Задачействие!",
    punchline: "Прямое попадание в ответ",
  },
  {
    id: "pi-fur",
    emoji: "🔢",
    title: "Пи-фур!",
    punchline: "Числа сдались без боя",
  },
  {
    id: "catch",
    emoji: "🪤",
    title: "Отличнохват!",
    punchline: "Схватил суть с первого раза",
  },
  {
    id: "nibble",
    emoji: "🌰",
    title: "Грызётся!",
    punchline: "Задача была крепкая — ты справился",
  },
  {
    id: "wheel",
    emoji: "⚙️",
    title: "Колесо формулы!",
    punchline: "Механизм мышления отработал",
  },
];

const STAMPS_THREE_STARS = STAMPS.filter((_, i) => i % 3 === 0).concat(STAMPS.slice(0, 4));
const STAMPS_TWO_STARS = STAMPS.filter((_, i) => i % 3 === 1);
const STAMPS_ONE_STAR = STAMPS.filter((_, i) => i % 3 === 2);

function hashTaskId(taskId: string): number {
  let h = 0;
  for (let i = 0; i < taskId.length; i++) {
    h = (h * 31 + taskId.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Стабильная печать для задачи (одна и та же при повторном заходе) */
export function pickStampForTask(taskId: string, stars: number): TaskStamp {
  const pool = stars >= 3 ? STAMPS_THREE_STARS : stars >= 2 ? STAMPS_TWO_STARS : STAMPS_ONE_STAR;
  return pool[hashTaskId(taskId) % pool.length] ?? STAMPS[0];
}

export function getStampById(stampId: string): TaskStamp | undefined {
  return STAMPS.find((s) => s.id === stampId);
}

export function getAllStamps(): readonly TaskStamp[] {
  return STAMPS;
}
