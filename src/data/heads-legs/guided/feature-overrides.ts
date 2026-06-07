import type { TableRow } from "@/data/tasks";

/** Норма признака и подпись столбца — когда авто-разбор ошибается */
export const FEATURE_TABLE_OVERRIDES: Record<
  string,
  { columnLabel: string; rows: TableRow[]; stepTitle?: string; stepHint?: string }
> = {
  "1.1": {
    columnLabel: "Ног",
    rows: [
      { id: "f1", label: "Звери", emoji: "🦁", answer: 4 },
      { id: "f2", label: "Птицы", emoji: "🐦", answer: 2 },
    ],
  },
  "3.5": {
    columnLabel: "Мышей",
    rows: [
      { id: "f1", label: "Совята", emoji: "🦉", answer: 7 },
      { id: "f2", label: "Котята", emoji: "🐱", answer: 4 },
    ],
  },
  "1.3": {
    columnLabel: "Ног",
    rows: [
      { id: "f1", label: "Гусята", emoji: "🪿", answer: 2 },
      { id: "f2", label: "Крокодильчики", emoji: "🐊", answer: 4 },
    ],
  },
  "1.6": {
    columnLabel: "Колёс",
    rows: [
      { id: "f1", label: "Двухколёсные", emoji: "🚲", answer: 2 },
      { id: "f2", label: "Трёхколёсные", emoji: "🛺", answer: 3 },
    ],
  },
  "1.8": {
    columnLabel: "Ног",
    rows: [
      { id: "f1", label: "Муха", emoji: "🪰", answer: 6 },
      { id: "f2", label: "Слон", emoji: "🐘", answer: 4 },
    ],
  },
  "1.13": {
    columnLabel: "Ног",
    rows: [
      { id: "f1", label: "AT-ST", emoji: "🤖", answer: 3 },
      { id: "f2", label: "AT-AT", emoji: "🦿", answer: 4 },
    ],
  },
  "1.14": {
    columnLabel: "Ног",
    rows: [
      { id: "f1", label: "Табуретка", emoji: "🪑", answer: 3 },
      { id: "f2", label: "Стул", emoji: "💺", answer: 4 },
    ],
  },
  "2.1": {
    columnLabel: "Цветков на клумбе",
    rows: [
      { id: "f1", label: "Клумбы у Лицея", emoji: "🌸", answer: 23 },
      { id: "f2", label: "Клумбы у Гимназии", emoji: "🌸", answer: 19 },
    ],
  },
  "2.2": {
    columnLabel: "Карандашей",
    rows: [
      { id: "f1", label: "Большая коробка", emoji: "📦", answer: 12 },
      { id: "f2", label: "Маленькая коробка", emoji: "📦", answer: 6 },
    ],
  },
  "2.5": {
    columnLabel: "Карандашей",
    rows: [
      { id: "f1", label: "Коробка простых", emoji: "✏️", answer: 20 },
      { id: "f2", label: "Коробка цветных", emoji: "🖍️", answer: 16 },
    ],
  },
  "2.3": {
    columnLabel: "Кредитов",
    rows: [
      { id: "f1", label: "Дрон-рабочий", emoji: "🤖", answer: 5 },
      { id: "f2", label: "Дрон-пастух", emoji: "🐑", answer: 3 },
    ],
  },
  "2.4": {
    columnLabel: "Цена",
    rows: [
      { id: "f1", label: "Пирожное по 100 ₽", emoji: "🧁", answer: 100 },
      { id: "f2", label: "Пирожное по 125 ₽", emoji: "🧁", answer: 125 },
    ],
  },
  "2.6": {
    columnLabel: "Котлет",
    rows: [
      { id: "f1", label: "Львёнок", emoji: "🦁", answer: 10 },
      { id: "f2", label: "Тигрёнок", emoji: "🐯", answer: 6 },
    ],
  },
  "2.7": {
    columnLabel: "Сосисок",
    rows: [
      { id: "f1", label: "Собака", emoji: "🐕", answer: 6 },
      { id: "f2", label: "Кошка", emoji: "🐱", answer: 5 },
    ],
  },
  "3.3": {
    columnLabel: "Конфет",
    rows: [
      { id: "f1", label: "Мальчик", emoji: "👦", answer: 2 },
      { id: "f2", label: "Девочка", emoji: "👧", answer: 3 },
    ],
  },
  "3.4": {
    columnLabel: "Снежинок",
    rows: [
      { id: "f1", label: "Мальчик", emoji: "👦", answer: 15 },
      { id: "f2", label: "Девочка", emoji: "👧", answer: 19 },
    ],
  },
  "3.6": {
    columnLabel: "Конфет",
    rows: [
      { id: "f1", label: "Мальчик", emoji: "👦", answer: 3 },
      { id: "f2", label: "Девочка", emoji: "👧", answer: 5 },
    ],
  },
  "4.1": {
    columnLabel: "Баллов",
    rows: [
      { id: "f1", label: "Верный ответ", emoji: "✅", answer: 2 },
      { id: "f2", label: "Неверный ответ", emoji: "❌", answer: -1 },
    ],
  },
  "4.3": {
    columnLabel: "Открыток",
    rows: [
      { id: "f1", label: "По 2 открытки", emoji: "💌", answer: 2 },
      { id: "f2", label: "По 3 открытки", emoji: "💐", answer: 3 },
    ],
  },
  "4.5": {
    columnLabel: "Баллов",
    rows: [
      { id: "f1", label: "Верный ответ", emoji: "✅", answer: 7 },
      { id: "f2", label: "Неверный ответ", emoji: "❌", answer: -12 },
    ],
  },
  "5.5": {
    columnLabel: "Конечностей",
    rows: [
      { id: "f1", label: "Водолаз", emoji: "🤿", answer: 4 },
      { id: "f2", label: "Осьминог", emoji: "🐙", answer: 8 },
    ],
  },
  "5.6": {
    columnLabel: "Кристаллов",
    stepTitle: "Сколько кристаллов нужно на меч?",
    stepHint: "Укажи, сколько кристаллов требуется для каждого вида меча по условию.",
    rows: [
      { id: "f1", label: "Меч Джедая", emoji: "⚔️", answer: 1 },
      { id: "f2", label: "Меч Ситха", emoji: "🗡️", answer: 2 },
    ],
  },
  "5.7": {
    columnLabel: "Мечей",
    rows: [
      { id: "f1", label: "Джедай", emoji: "⚔️", answer: 2 },
      { id: "f2", label: "Ситх", emoji: "🗡️", answer: 4 },
    ],
  },
  "7.5": {
    columnLabel: "Голов",
    rows: [
      { id: "f1", label: "Сороконожка", emoji: "🐛", answer: 1 },
      { id: "f2", label: "Дракон", emoji: "🐉", answer: 4 },
    ],
  },
  "7.4": {
    columnLabel: "Голов",
    rows: [
      { id: "f1", label: "Сороконожка", emoji: "🐛", answer: 2 },
      { id: "f2", label: "Дракон", emoji: "🐉", answer: 3 },
    ],
  },
};

export interface CountedFeatureMeta {
  columnLabel: string;
  stepTitle: string;
  stepHint: string;
}

/** Какой признак суммируется в условии (ноги, колёса, конфеты…) */
export function inferCountedFeature(condition: string): CountedFeatureMeta {
  if (/\d+\s+ног|\bног\b|\bноги\b|\bногам\b/i.test(condition)) {
    return {
      columnLabel: "Ног",
      stepTitle: "③ Сколько ног у каждого?",
      stepHint: "У каждого вида своё число ног — перенеси из условия или вспомни.",
    };
  }
  if (/колёс|колес/i.test(condition)) {
    return {
      columnLabel: "Колёс",
      stepTitle: "③ Сколько колёс у каждого?",
      stepHint: "Сколько колёс у двухколёсного и у трёхколёсного?",
    };
  }
  if (/цвет(?:ов|ка|ков)/i.test(condition) && /клумб/i.test(condition)) {
    return {
      columnLabel: "Цветков на клумбе",
      stepTitle: "③ Сколько цветков на каждой клумбе?",
      stepHint: "Сколько цветков растёт на клумбе у Лицея и у Гимназии?",
    };
  }
  if (/конфет/i.test(condition)) {
    return {
      columnLabel: "Конфет",
      stepTitle: "③ Сколько конфет съел каждый?",
      stepHint: "Сколько конфет приходится на мальчика и на девочку?",
    };
  }
  if (/задач/i.test(condition)) {
    return {
      columnLabel: "Задач",
      stepTitle: "③ Сколько задач решил каждый?",
      stepHint: "Сколько задач на третьеклассника и на пятиклассника?",
    };
  }
  if (/руб|₽|цен/i.test(condition)) {
    return {
      columnLabel: "Цена",
      stepTitle: "③ Какова цена каждого вида?",
      stepHint: "Сколько стоит каждый вид?",
    };
  }
  if (/крыл/i.test(condition)) {
    return {
      columnLabel: "Крыльев",
      stepTitle: "③ Сколько крыльев у каждого?",
      stepHint: "Вклад каждого вида кораблей.",
    };
  }
  if (/зуб/i.test(condition)) {
    return {
      columnLabel: "Зубов",
      stepTitle: "③ Сколько зубов у каждого?",
      stepHint: "Сколько зубов у каждого вида существ?",
    };
  }
  if (/голов/i.test(condition) && !/\d+\s+ног/i.test(condition)) {
    return {
      columnLabel: "Голов",
      stepTitle: "③ Сколько голов у каждого?",
      stepHint: "Вклад каждого вида в общее число голов.",
    };
  }
  if (/рук/i.test(condition)) {
    return {
      columnLabel: "Рук",
      stepTitle: "③ Сколько рук у каждого?",
      stepHint: "Сколько рук у каждого вида?",
    };
  }
  if (/залп/i.test(condition)) {
    return {
      columnLabel: "Залпов",
      stepTitle: "③ Сколько залпов нужно?",
      stepHint: "Сколько залпов на каждый тип корабля?",
    };
  }
  if (/ящик/i.test(condition)) {
    return {
      columnLabel: "Ящиков",
      stepTitle: "③ Сколько ящиков у стола?",
      stepHint: "Сколько ящиков у каждого типа столов?",
    };
  }
  if (/карандаш/i.test(condition)) {
    return {
      columnLabel: "Карандашей",
      stepTitle: "③ Сколько карандашей в коробке?",
      stepHint: "Сколько карандашей в каждой коробке?",
    };
  }
  if (/котлет|сосис|мыш/i.test(condition)) {
    const unit = /котлет/i.test(condition) ? "котлет" : /сосис/i.test(condition) ? "сосисок" : "мышей";
    return {
      columnLabel: unit.charAt(0).toUpperCase() + unit.slice(1),
      stepTitle: `③ Сколько ${unit} на каждого?`,
      stepHint: "Сколько получил каждый вид?",
    };
  }
  return {
    columnLabel: "Норма",
    stepTitle: "③ Норма у каждого вида",
    stepHint: "Сколько единиц признака даёт каждый вид?",
  };
}

/** Подпись суммарного признака («всего цветков»), если норма — «на объект» */
export function inferFeatureSumLabel(columnLabel: string): string {
  const onObject = columnLabel.match(/^(.+?)\s+на\s+\S+/i);
  if (onObject) return onObject[1].trim();
  return columnLabel;
}
