/** Парсинг модели «зайцы/клетки» для генерации overrides и карточек */

function extractInts(text) {
  const out = [];
  for (const m of text.matchAll(/\d[\d\s]*\d|\d+/g)) {
    const n = Number(m[0].replace(/\s/g, ""));
    if (!Number.isNaN(n)) out.push(n);
  }
  return out;
}

/** Подпись из answer key — отбраковка обрывков парсера */
function isValidFromKeyLabel(label) {
  const s = label.trim();
  if (s.length < 4 || s.length > 52) return false;
  if (/^(это|сортам|елок и|команд)$/i.test(s)) return false;
  if (/^го\s/i.test(s)) return false;
  if (/^команд/i.test(s) && s.length < 12) return false;
  if (/\sи$/i.test(s) && s.length < 10) return false;
  if (/^\d/.test(s)) return false;
  if (/так как|диагонали|баллы начисля|соседние|светлых|попарных|могут\./i.test(s)) return false;
  if (/^[А-ЯЁ][а-яё]+\.$/.test(s) && s.length < 14) return false;
  return true;
}

function cleanFromKeyLabel(raw) {
  return cleanEntityPhrase(
    raw
      .replace(/[«»""]/g, "")
      .split(/[.,!?]| так как /i)[0]
      .trim(),
  );
}

function capLabel(label) {
  if (!label) return label;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Стабильный id по подписи карточки (не оставляем from-key в generated) */
function entityId(label, role) {
  const s = label.toLowerCase();
  if (/остатк/.test(s)) return "remainders";
  if (/разност/.test(s)) return "numbers";
  if (/сорт|категори/.test(s)) return "categories";
  if (/^цвет/.test(s)) return "colors";
  if (/день недели/.test(s)) return "weekdays";
  if (/дни года/.test(s)) return "year-days";
  if (/месяц/.test(s)) return "months";
  if (/возраст/.test(s)) return "ages";
  if (/турист/.test(s)) return "tourists";
  if (/монет/.test(s)) return "coins";
  if (/ученик|школьник/.test(s)) return "students";
  if (/футболист|игрок/.test(s)) return "players";
  if (/шар/.test(s)) return "balls";
  if (/ёлк|елк|игол/.test(s)) return "trees";
  if (/двузначн|натуральн|числ/.test(s)) return "numbers";
  if (/част|разбиен|позици/.test(s)) return "parts";
  if (/крест|таблиц|строк/.test(s)) return "table-rows";
  if (/конструктор|каркас/.test(s)) return "construction";
  if (/закрашен/.test(s)) return "marked";
  if (/клетк|доск/.test(s)) return "objects";
  if (/(?<![а-яё])жител|москвич/.test(s)) return "residents";
  if (/гриб/.test(s)) return "mushrooms";
  if (/ящик|короб/.test(s)) return "boxes";
  return role === "rabbit" ? "objects" : "categories";
}

function mapEntities(list, role) {
  return list.map(({ id, label }) => {
    const clean = capLabel(cleanEntityPhrase(label));
    const finalLabel = clean.length >= 2 ? clean : label;
    return {
      label: finalLabel,
      id: id === "from-key" ? entityId(finalLabel, role) : id,
    };
  });
}

/** Очищает фразу-сущность из ключа методички */
function cleanEntityPhrase(raw) {
  return raw
    .replace(/[«»""]/g, "")
    .replace(/\s*(?:—|–|-)\s*(?:это\s+)?(?:зайц|кролик|клетк).*$/i, "")
    .replace(/^(?:пусть\s+|тогда\s+у\s+нас\s+|а\s+|нашими\s+|наши\s+|это\s+)/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Явные «X — клетки / Y — зайцы» из answer_key (методичка).
 */
function extractMethodologyEntities(answerKey) {
  const key = answerKey.replace(/\s+/g, " ");
  let rabbits = null;
  let cells = null;

  for (const sent of key.split(/(?<=[.!?])\s+/)) {
    const cellM = sent.match(/([а-яё0-9×²\s-]{3,44}?)\s*[—–-]\s*(?:это\s+)?(?:(?:«|")?клетк)/i);
    const rabbitM = sent.match(
      /([а-яё0-9×²\s-]{3,44}?)\s*[—–-]\s*(?:это\s+)?(?:(?:«|")?(?:зайц|кролик))/i,
    );
    if (cellM) {
      const label = capLabel(cleanEntityPhrase(cellM[1]));
      if (isValidFromKeyLabel(label)) cells = label;
    }
    if (rabbitM) {
      const label = capLabel(cleanEntityPhrase(rabbitM[1]));
      if (isValidFromKeyLabel(label)) rabbits = label;
    }
  }

  const rem = key.match(/остатк[^.]{0,40}?делени[ие]\s+на\s+(\d+)/i);
  if (rem) cells = `Остатки при делении на ${rem[1]}`;

  const rabbitBe = key.match(
    /([а-яё\s\d]{4,44}?)\s+(?:должн|будут|явля(?:ются|ются))\s+(?:быть\s+)?(?:(?:нашими|наши)\s+)?(?:«|")?кролик/i,
  );
  if (rabbitBe) {
    const label = capLabel(cleanEntityPhrase(rabbitBe[1]));
    if (isValidFromKeyLabel(label)) rabbits = label;
  }

  const rabbitQuote = key.match(
    /(\d+\s+[а-яё«""\w\s-]{2,30}?|[а-яё]{4,30})\s*[-—–]\s*["«]?кролик/i,
  );
  if (rabbitQuote && !rabbits) {
    const label = capLabel(cleanEntityPhrase(rabbitQuote[1]));
    if (isValidFromKeyLabel(label)) rabbits = label;
  }

  const cellSlots = key.match(/(\d+)\s+клетк(?:ам|ами|а\b|е\b|и\b|у\b|ой\b|ок\b)/i);
  if (cellSlots && !cells) {
    const n = cellSlots[1];
    if (/разност/i.test(key)) cells = `Различные разности (1…${n})`;
    else if (/сорт/i.test(key)) cells = "Сорта / категории";
    else cells = `${n} групп из условия`;
  }

  if (/разност/i.test(key) && /кролик|зайц/i.test(key) && !rabbits) {
    rabbits = "Попарные разности";
  }

  const colorsRabbit = key.match(/шары[^.]{0,40}?(?:кролик|зайц)/i);
  const colorsCell = key.match(/цвет[^.]{0,30}?(?:клетк)/i);
  if (colorsRabbit && !rabbits) rabbits = "Шарики";
  if (colorsCell && !cells) cells = "Цвета";

  return { rabbits, cells };
}

/** Главное существительное из условия (если ключ молчит) */
function inferRabbitFromCondition(condition) {
  const rules = [
    [/таблиц[^\n]*?(\d+)\s*[×x*]\s*(\d+)/i, "numbers", "Числа в таблице"],
    [/доск[^\n]*?(\d+)\s*[×x*]\s*(\d+)/i, "objects", "Клетки доски"],
    [/(\d[\d\s]*)\s+двузначн/i, "numbers", "Двузначные числа"],
    [/(\d[\d\s]*)\s+натуральн/i, "numbers", "Натуральные числа"],
    [/(\d[\d\s]*)\s+цел(?:ых|ые)\s+чис/i, "numbers", "Целые числа"],
    [/(\d[\d\s]*)\s+чис/i, "numbers", "Числа из условия"],
    [/(\d[\d\s]*)\s+точ/i, "points", "Точки"],
    [/(\d[\d\s]*)\s+отрез/i, "points", "Отрезки"],
    [/(\d[\d\s]*)\s+разност/i, "numbers", "Разности чисел"],
    [/(\d[\d\s]*)\s+пар/i, "objects", "Пары элементов"],
    [/(\d[\d\s]*)\s+многоугольник/i, "parts", "Многоугольники"],
    [/(\d[\d\s]*)\s+треугольник/i, "parts", "Треугольники"],
    [/(\d[\d\s]*)\s+прямоугольник/i, "rects", "Прямоугольники"],
    [/(\d[\d\s]*)\s+фигур/i, "pieces", "Фигуры"],
    [/(\d[\d\s]*)\s+вершин/i, "points", "Вершины"],
    [/(\d[\d\s]*)\s+реб/i, "links", "Рёбра / связи"],
    [/(\d[\d\s]*)\s+клет/i, "objects", "Клетки из условия"],
    [/(\d[\d\s]*)\s+закрашен/i, "marked", "Закрашенные клетки"],
    [/(\d[\d\s]*)\s+билет/i, "objects", "Билеты"],
    [/(\d[\d\s]*)\s+участник/i, "people", "У участников"],
    [/(\d[\d\s]*)\s+команд/i, "players", "Команды"],
    [/(\d[\d\s]*)\s+студент/i, "students", "Студенты"],
    [/(\d[\d\s]*)\s+дет/i, "people", "Дети"],
    [/(\d[\d\s]*)\s+сл/i, "objects", "Слова"],
    [/(\d[\d\s]*)\s+букв/i, "objects", "Буквы"],
    [/(\d[\d\s]*)\s+слова/i, "objects", "Слова"],
    [/миллион\s+ёлок|миллион\s+елок/i, "trees", "Ёлки"],
    [/шестерен/i, "objects", "Положения шестерёнок"],
    [/шестерён/i, "objects", "Положения шестерёнок"],
    [/квадрат[^\n]*?(\d+)\s*[×x*]\s*(\d+)/i, "objects", "Клетки квадрата"],
    [/разбиен|разрез/i, "parts", "Части разбиения"],
    [/раскрас/i, "marked", "Закрашенные клетки"],
    [/ферз|ладь|конь|слон/i, "pieces", "Фигуры на доске"],
    [/вершин.*граф|граф.*вершин/i, "points", "Вершины графа"],
    [/ребр.*граф|граф.*реб/i, "links", "Рёбра графа"],
  ];

  for (const [re, id, label] of rules) {
    if (re.test(condition)) return { id, label };
  }

  const nMatch = condition.match(
    /(\d[\d\s]*)\s+([а-яё-]{4,}(?:ов|ей|ам|ями|ы|и|а|ей|ом|ах|ю))/i,
  );
  if (nMatch) {
    const word = nMatch[2].toLowerCase();
    if (!/^(докаж|верно|можно|найд|име|буд|есть|был|все|люб|кажд)/.test(word)) {
      const label = capLabel(nMatch[2]);
      if (label.length >= 4 && label.length <= 40) return { id: "objects", label };
    }
  }

  return null;
}

function fallbackRabbitLabel(condition, flowId) {
  const fromCond = inferRabbitFromCondition(condition);
  if (fromCond) return [fromCond];

  const byFlow = {
    F4_REMAINDERS: { id: "numbers", label: "Числа / величины" },
    F5_GEOMETRY_PARTITION: { id: "objects", label: "Объекты на фигуре или доске" },
    F6_TABLE_SUMS: { id: "numbers", label: "Числа в таблице" },
    F7_GRAPH_RELATIONS: { id: "objects", label: "Элементы / пары из условия" },
    F8_COLOR_RAMSEY: { id: "marked", label: "Закрашенные элементы" },
    F10_ADVANCED: { id: "objects", label: "Объекты доказательства" },
    F2_GENERALIZED: { id: "objects", label: "Предметы для подсчёта" },
    F3_UNLUCKY: { id: "objects", label: "Вынимаемые предметы" },
  };

  const fb = byFlow[flowId] ?? { id: "objects", label: "Предметы из условия" };
  return [fb];
}

function fallbackCellLabel(condition, flowId, answerKey) {
  const rem = (condition + answerKey).match(/делени[ие]\s+на\s+(\d+)|остатк[^.]{0,20}?на\s+(\d+)/i);
  if (rem) {
    const d = rem[1] ?? rem[2];
    return [{ id: "remainders", label: `Остатки при делении на ${d}` }];
  }

  const byFlow = {
    F1_DIRECT: { id: "categories", label: "Группы по признаку из условия" },
    F2_GENERALIZED: { id: "categories", label: "Группы для оценки «не более k»" },
    F3_UNLUCKY: { id: "colors", label: "Варианты раскладки (худший случай)" },
    F4_REMAINDERS: { id: "remainders", label: "Остатки при делении" },
    F5_GEOMETRY_PARTITION: { id: "parts", label: "Части разбиения фигуры" },
    F6_TABLE_SUMS: { id: "table-rows", label: "Клетки / блоки таблицы" },
    F7_GRAPH_RELATIONS: { id: "links", label: "Связи и пары элементов" },
    F8_COLOR_RAMSEY: { id: "colors", label: "Раскраски / цвета" },
    F10_ADVANCED: { id: "construction", label: "Варианты построения" },
  };

  const fb = byFlow[flowId] ?? { id: "categories", label: "Категории («клетки»)" };
  return [fb];
}

function inferRabbits(condition, answerKey, flowId) {
  const extracted = extractMethodologyEntities(answerKey);
  if (extracted.rabbits) {
    return mapEntities([{ id: "from-key", label: extracted.rabbits }], "rabbit");
  }

  const fromKey = answerKey.match(
    /(?:кролик|зайц)[^\n]{0,80}?(?:это|—|-)\s*([«""]?[а-яёa-z\s/]+[»""]?)/i,
  );
  if (fromKey) {
    const label = cleanFromKeyLabel(fromKey[1]);
    if (isValidFromKeyLabel(label)) {
      return mapEntities([{ id: "from-key", label: capLabel(label) }], "rabbit");
    }
  }

  const rules = [
    [/турист/i, "tourists", "Туристы"],
    [/ученик|школьник|класс/i, "students", "Ученики"],
    [/монет/i, "coins", "Монеты"],
    [/ёлок|елок|дерев/i, "trees", "Ёлки"],
    [/футболист|игрок/i, "players", "Игроки"],
    [/автомобил|машин/i, "cars", "Автомобили"],
    [/конфет/i, "candies", "Конфеты"],
    [/гриб/i, "mushrooms", "Грибники"],
    [/ящик/i, "boxes", "Ящики"],
    [/шарик/i, "balls", "Шарики"],
    [/человек|люд/i, "people", "Люди"],
    [/москвич|(?<![а-яё])жител(?:и|ей|я|ем|ь)?(?![а-яё])/i, "residents", "Жители"],
    [/отрезк|точк/i, "points", "Точки / отрезки"],
    [/спич/i, "matches", "Спички"],
    [/сапог/i, "boots", "Сапоги"],
    [/яблок|сорт/i, "apples", "Ящики с яблоками"],
    [/рабоч/i, "workers", "Рабочие"],
    [/школьник/i, "pupils", "Школьники"],
    [/фишек|фишк/i, "chips", "Фишки"],
    [/шахматн.*фигур|фигур.*шахмат/i, "pieces", "Шахматные фигуры"],
    [/закрашен/i, "marked", "Закрашенные клетки"],
    [/прямоугольник/i, "rects", "Прямоугольники из условия"],
    [/детал.*конструктор|скобк/i, "parts", "Детали конструктора"],
    [/таблиц/i, "numbers", "Числа в таблице"],
    [/двузначн/i, "numbers", "Двузначные числа"],
    [/натуральн\s+чис/i, "numbers", "Натуральные числа"],
    [/цел(?:ых|ые)\s+чис/i, "numbers", "Целые числа"],
    [/разност/i, "numbers", "Разности"],
    [/билет/i, "objects", "Билеты"],
    [/вершин/i, "points", "Вершины"],
    [/ребр/i, "links", "Рёбра"],
    [/многоугольник/i, "parts", "Многоугольники"],
    [/треугольник/i, "parts", "Треугольники"],
    [/ферз|ладь|конь/i, "pieces", "Шахматные фигуры"],
    [/квадрат[^\n]*?\d+\s*[×x*]\s*\d+/i, "objects", "Клетки квадрата"],
    [/шестерен/i, "objects", "Положения шестерёнок"],
  ];

  const found = [];
  for (const [re, id, label] of rules) {
    if (re.test(condition) && !found.some((f) => f.id === id)) found.push({ id, label });
  }
  if (found.length > 0) return mapEntities(found.slice(0, 2), "rabbit");

  return mapEntities(fallbackRabbitLabel(condition, flowId), "rabbit");
}

function inferCells(condition, answerKey, flowId) {
  const extracted = extractMethodologyEntities(answerKey);
  if (extracted.cells) {
    return mapEntities([{ id: "from-key", label: extracted.cells }], "cell");
  }

  const fromKey = answerKey.match(
    /(?:клетк|короб)[^\n]{0,80}?(?:это|—|-)\s*([«""]?[а-яёa-z0-9\s/.,–-]+[»""]?)/i,
  );
  if (fromKey) {
    const label = cleanFromKeyLabel(fromKey[1]);
    if (isValidFromKeyLabel(label)) {
      return mapEntities([{ id: "from-key", label: capLabel(label) }], "cell");
    }
  }

  if (/день недели/i.test(condition + answerKey)) return [{ id: "weekdays", label: "Дни недели" }];
  if (/месяц/i.test(condition) && /родил/i.test(condition)) return [{ id: "months", label: "Месяцы года" }];
  if (/день года|дня года|день рождения/i.test(condition + answerKey)) {
    return [{ id: "year-days", label: "Дни года" }];
  }
  if (/достоинств|тип.*монет|коп\.?\)/i.test(condition)) {
    return [{ id: "coin-types", label: "Типы монет" }];
  }
  if (/иголок|игол/i.test(condition)) {
    return [{ id: "needle-counts", label: "Число иголок на ёлке" }];
  }
  if (/сорт.*яблок|яблок.*сорт/i.test(condition)) {
    return [{ id: "categories", label: "Сорта яблок" }];
  }
  if (/двух разных цветов|цветов:.*черн/i.test(condition)) {
    return [{ id: "colors", label: "Цвета шариков" }];
  }
  if (/шахмат/i.test(condition)) {
    return [{ id: "categories", label: "Клетки шахматной доски" }];
  }
  if (/таблиц.*13|13×13|13\s*[×x]\s*13/i.test(condition)) {
    return [{ id: "table-rows", label: "Кресты (строка + столбец)" }];
  }
  if (/квадрат.*6\s*[×*]\s*6|6\s*[×*]\s*6/i.test(condition)) {
    return [{ id: "parts", label: "Клетки квадрата 6×6" }];
  }
  if (/квадрат.*9\s*[×*]\s*9|9\s*[×*]\s*9/i.test(condition) && /закрашен/i.test(condition)) {
    return [{ id: "parts", label: "Позиции для закрашенных клеток" }];
  }
  if (/чёрн.*бел|бел.*чёрн/i.test(condition)) {
    return [{ id: "colors", label: "Чёрные и белые клетки" }];
  }
  if (/каркас|куб.*2\s*[×*]\s*2/i.test(condition)) {
    return [{ id: "construction", label: "Рёбра каркаса куба" }];
  }
  if (/возраст|(?:\d+\s*лет\b)/i.test(condition) && /турист|человек|родил|одногод|младш|старш/i.test(condition)) {
    return [{ id: "ages", label: "Возможные возрасты" }];
  }
  if (/остат/i.test(condition + answerKey) || flowId === "F4_REMAINDERS") {
    return [{ id: "remainders", label: "Остатки при делении" }];
  }
  if (/раскрас|однотон/i.test(condition + answerKey) || flowId === "F8_COLOR_RAMSEY") {
    return [{ id: "colors", label: "Раскраски / цвета" }];
  }
  if (/разбиен|част|плоскост|фигур/i.test(condition) || flowId === "F5_GEOMETRY_PARTITION") {
    return [{ id: "parts", label: "Части разбиения" }];
  }
  if (/таблиц|строк|столбц|сумм/i.test(condition) || flowId === "F6_TABLE_SUMS") {
    return [{ id: "table-rows", label: "Строки / суммы таблицы" }];
  }
  if (/связ|ребр|вершин|граф/i.test(condition) || flowId === "F7_GRAPH_RELATIONS") {
    return [{ id: "links", label: "Связи / пары" }];
  }
  if (flowId === "F10_ADVANCED") return mapEntities([{ id: "construction", label: "Варианты построения" }], "cell");
  return mapEntities(fallbackCellLabel(condition, flowId, answerKey), "cell");
}

function inferCounts(condition, answerKey, flowId) {
  const nums = extractInts(condition);
  const keyNums = extractInts(answerKey);
  let n = null;
  let m = null;
  let k = null;
  let minInCell = null;

  const WORD_N = {
    одно: 1,
    одного: 1,
    двух: 2,
    двумя: 2,
    трёх: 3,
    трех: 3,
    четырёх: 4,
    четырех: 4,
    пяти: 5,
    шести: 6,
    шесть: 6,
    семи: 7,
    семь: 7,
    восьми: 8,
    восемь: 8,
    девяти: 9,
    десяти: 10,
    одиннадцати: 11,
    двенадцати: 12,
  };

  const wordN = condition.match(
    /(?:любых|дано|даны|из|есть)\s+(\d+|одного|двух|тр[её]х|четыр[её]х|пяти|шести|шесть|семи|семь|восьми|восемь|девяти|десяти|одиннадцати|двенадцати)\s+(?:различн|натуральн|двузначн|цел)/i,
  );
  if (wordN) {
    const w = wordN[1].toLowerCase();
    n = n ?? (WORD_N[w] ?? (Number(w) || null));
  }

  const distinctN = condition.match(/(\d+)\s+различн/i);
  if (distinctN) n = n ?? Number(distinctN[1]);

  const pairCount = answerKey.match(/(\d+)\s+пар\b/i);
  if (pairCount && /разност/i.test(condition + answerKey)) n = Number(pairCount[1]);

  const remDiv = (condition + answerKey).match(/(?:остатк[^.]{0,40}?|делени[ие]\s+)на\s+(\d+)/i);
  if (remDiv) m = m ?? Number(remDiv[1]);

  if (/три\s+одинаков/i.test(condition)) minInCell = 3;
  if (/два\s+числ/i.test(condition) && /разност/i.test(condition)) minInCell = minInCell ?? 2;

  const nMatch = condition.match(
    /(\d+)\s+(?:турист|ученик|школьник|человек|монет|ёлок|елок|игрок|автомобил|конфет|гриб|ящик|шарик|сапог|отрезк|точк|спич|фиш)/i,
  );
  if (nMatch) n = Number(nMatch[1]);

  const ageMatch =
    condition.match(/(?:старш[\s\S]*?|максимум[\s\S]*?)(\d+)[\s\S]*?(?:младш[\s\S]*?|минимум[\s\S]*?)(\d+)/i) ??
    condition.match(/от\s+(\d+)\s+.*?\s+(\d+)\s+лет/i);
  if (ageMatch) {
    const hi = Math.max(Number(ageMatch[1]), Number(ageMatch[2]));
    const lo = Math.min(Number(ageMatch[1]), Number(ageMatch[2]));
    m = hi - lo + 1;
    if (n == null && /(\d+)\s+турист/i.test(condition)) {
      n = Number(condition.match(/(\d+)\s+турист/i)[1]);
    }
  }

  if (/день недели/i.test(condition)) m = 7;
  if (/месяц/i.test(condition)) m = 12;
  if (/день года|366/i.test(condition + answerKey)) m = 366;

  const variants = answerKey.match(/(\d+)\s*вариант/i);
  if (variants) m = Number(variants[1]);

  const cellsInKey = answerKey.match(/(\d+)\s*клет/i);
  if (cellsInKey) m = Number(cellsInKey[1]);

  const coinTypes = condition.match(/(\d+),\s*(\d+),\s*(\d+),\s*(\d+)/);
  if (coinTypes) m = 4;

  const needleCap = condition.match(/не\s+более\s+(\d[\d\s]*\d|\d+)/i);
  if (needleCap) m = Number(needleCap[1].replace(/\s/g, "")) + 1;

  if (/миллион/i.test(condition) && n == null) n = 1_000_000;

  const minMatch = answerKey.match(/не\s+менее\s+(\d+)|минимум\s+(\d+)|(\d+)\s+одинаков/i);
  if (minMatch && minInCell == null) {
    minInCell = Number(minMatch[1] ?? minMatch[2] ?? minMatch[3]);
  }

  const kMatch = answerKey.match(/не\s+более\s+(\d+)|каждого.*?(\d+)/i);
  if (kMatch) k = Number(kMatch[1] ?? kMatch[2]);

  if (n == null && nums.length > 0) n = Math.max(...nums.slice(0, 5));
  if (m == null && keyNums.length > 0) {
    const range = answerKey.match(/(\d+)\s*[–-]\s*(\d+)/);
    if (range) m = Math.abs(Number(range[2]) - Number(range[1])) + 1;
  }

  if (flowId === "F2_GENERALIZED" && minInCell != null && k == null) k = minInCell - 1;

  if (flowId === "F1_DIRECT") {
    const krol = answerKey.match(/(\d+)\s+кролик/i);
    if (krol) n = n ?? Number(krol[1]);

    if (/шестерен/i.test(condition)) {
      const teeth = condition.match(/(\d+)\s+зуб/i);
      if (teeth) n = n ?? Number(teeth[1]);
      const positions = answerKey.match(/ещё\s+(\d+)\s+положен/i);
      if (positions) n = n ?? Number(positions[1]) + 1;
      const badMax = answerKey.match(/не\s+более\s+(\d+)/i);
      if (badMax) m = m ?? Number(badMax[1]);
    }

    if (/одиннадцат[а-яё]*\s+групп|1\+2\+[^=]+=\s*66/i.test(answerKey.replace(/\s/g, ""))) {
      m = m ?? 11;
      const people = condition.match(/(\d+)\s+челов/i);
      if (people) n = n ?? Number(people[1]) * 2;
    }

    if (/спич/i.test(condition) && /не\s+всегда/i.test(condition + answerKey)) {
      const sp = answerKey.match(/(\d+)\s+спич/i);
      if (sp) n = n ?? Number(sp[1]);
      m = m ?? 2;
    }

    if (/гриб/i.test(condition)) {
      const people = condition.match(/(\d+)\s+челов/i);
      if (people) {
        n = n ?? Number(people[1]);
        m = m ?? Number(people[1]);
      }
    }

    if (/366\s+дней|366\s*\*/i.test(answerKey)) {
      m = m ?? 366;
      n = n ?? 10000;
    }
  }

  return { n, m, k, minInCell };
}

function cleanConclusionPhrase(text) {
  return text
    .replace(/[«»""]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\.$/, "");
}

function inferConclusion(condition, answerKey, flowId) {
  const combined = `${condition}\n${answerKey}`;

  const answerPart = answerKey.match(/Ответ:\s*([^\.]+)/i)?.[1]?.trim();
  if (answerPart && answerPart.length < 80) return cleanConclusionPhrase(answerPart);

  const hence = answerKey.match(
    /(?:значит|следовательно|получаем|таким образом|отсюда следует),?\s*([^\.!?]{12,110})/i,
  );
  if (hence?.[1]) {
    const phrase = cleanConclusionPhrase(hence[1]);
    if (phrase.length >= 12 && phrase.length <= 100) return phrase;
  }

  const keyBody = answerKey.replace(/^[\s\S]*?ключ:\s*/i, "").trim();
  const sentences = keyBody
    .split(/(?<=[.!?])\s+/)
    .filter(
      (s) =>
        s.length > 18 &&
        s.length < 120 &&
        !/^(автор|ответ|пусть|будем|рассмотрим|предположим)/i.test(s),
    );
  if (sentences.length) {
    const last = sentences[sentences.length - 1];
    const cleaned = cleanConclusionPhrase(last);
    if (cleaned.length >= 12 && !/^это\s/i.test(cleaned)) return cleaned;
  }

  if (flowId === "F4_REMAINDERS") {
    if (/разност.*делит|делит.*на\s+11/i.test(combined)) {
      return "найдутся два числа с одинаковым остатком — разность делится на 11";
    }
    if (/одно.*делит.*другое|делит.*на другое/i.test(condition)) {
      return "можно выбрать два числа, одно из которых делит другое";
    }
    if (/сумм.*делит|три\s+числ/i.test(combined) && /остатк|делени/i.test(answerKey)) {
      return "можно выбрать три числа с одинаковым остатком — сумма делится на 3";
    }
    if (/три\s+одинаков.*разност/i.test(condition)) {
      return "найдутся три одинаковые попарные разности";
    }
    if (/докаж/i.test(condition) && /остатк/i.test(answerKey)) {
      return "найдутся два числа с одинаковыми остатками при делении";
    }
  }

  if (flowId === "F7_GRAPH_RELATIONS") {
    if (/открытк/i.test(condition)) {
      return "найдутся двое участников, пославших открытки друг другу";
    }
    if (/рукопожати/i.test(condition)) {
      return "найдутся двое, пожавшие друг другу руки";
    }
    if (/знаком/i.test(condition)) {
      return "найдутся двое с общим знакомым или нужная пара связей";
    }
    if (/турист|посетил/i.test(condition)) {
      return "найдутся два объекта с совпадающим набором посещений";
    }
    if (/докаж/i.test(condition)) {
      const target = condition.match(/докаж(?:ите|и|ь|ем|а)?\s*,?\s*что\s+([^\.]{10,90})/i)?.[1];
      if (target) return cleanConclusionPhrase(target);
      return "утверждение доказано через подсчёт связей и Дирихле";
    }
  }

  if (/разност.*делит/i.test(combined)) {
    return "найдутся два числа с одинаковым остатком — разность делится на делитель";
  }
  if (/сумм.*делит/i.test(combined) || (/сумм/i.test(condition) && /делени/i.test(answerKey))) {
    return "можно выбрать три числа с одинаковым остатком — сумма делится на 3";
  }
  if (/три\s+одинаков/i.test(condition)) return "найдутся три одинаковые разности";
  if (/одногодк/i.test(combined)) return "найдутся одногодки";
  if (/имен.*фамили|фамили.*имен/i.test(condition)) {
    return "найдутся двое с одинаковыми именем и фамилией";
  }
  if (/одинаков/i.test(condition)) return "найдутся два одинаковых по выбранному признаку";
  if (/докаж/i.test(condition)) {
    const prove = condition.match(/докаж(?:ите|и|ь|ем|а)?\s*,?\s*что\s+([^\.]{10,90})/i)?.[1];
    if (prove) return cleanConclusionPhrase(prove);
    if (/делит/i.test(condition)) {
      const div = condition.match(/дел(?:ит|ится)\s+на\s+(\d+)/i)?.[1];
      if (div) return `найдётся число, которое делится на ${div}`;
    }
    return "утверждение верно по принципу Дирихле";
  }
  return "в одной клетке окажется не меньше двух предметов";
}

export function parseTaskModel(task, flowId) {
  const condition = task.statement ?? "";
  const answerKey = task.answer_key ?? "";
  return {
    rabbits: inferRabbits(condition, answerKey, flowId),
    cells: inferCells(condition, answerKey, flowId),
    counts: inferCounts(condition, answerKey, flowId),
    compareOp: "gt",
    conclusionText: inferConclusion(condition, answerKey, flowId),
  };
}

function blank(methodTaskId, li, bi, type, accept, placeholder) {
  return {
    id: `${methodTaskId.replace(/\./g, "-")}-p${li}-${bi}`,
    type,
    accept: Array.isArray(accept) ? accept : [accept],
    placeholder,
  };
}

export function buildEnrichedProofLines(model, flowId, methodTaskId) {
  const rLabel = model.rabbits[0]?.label ?? "предметы";
  const cLabel = model.cells[0]?.label ?? "категории";
  const { n, m, k, minInCell } = model.counts;
  const min = minInCell ?? 2;
  const lines = [];

  lines.push({
    template: "Зайцы — это [что раскладываем].",
    blanks: [blank(methodTaskId, lines.length, 0, "object", rLabel, "предметы")],
  });
  lines.push({
    template: "Клетки — это [куда раскладываем].",
    blanks: [blank(methodTaskId, lines.length, 0, "object", cLabel, "категории")],
  });

  if (flowId === "F3_UNLUCKY") {
    lines.push({
      template: "Худший случай: без гарантии можно взять [максимум].",
      blanks: [
        blank(methodTaskId, lines.length, 0, "number", k ?? min - 1, "число"),
      ],
    });
    lines.push({
      template: "Добавляем ещё один предмет → [вывод].",
      blanks: [
        blank(methodTaskId, lines.length, 0, "conclusion", model.conclusionText, "…"),
      ],
    });
    return lines;
  }

  if (n != null) {
    lines.push({
      template: "Число зайцев N = [N].",
      blanks: [blank(methodTaskId, lines.length, 0, "number", n, "N")],
    });
  }
  if (m != null) {
    lines.push({
      template: "Число клеток M = [M].",
      blanks: [blank(methodTaskId, lines.length, 0, "number", m, "M")],
    });
  }

  if (flowId === "F2_GENERALIZED" && k != null && m != null) {
    lines.push({
      template: "Если в каждой клетке не более [k], всего не больше [M×k].",
      blanks: [
        blank(methodTaskId, lines.length, 0, "number", k, "k"),
        blank(methodTaskId, lines.length, 1, "expression", `${m * k}`, `${m}×${k}`),
      ],
    });
  } else if (n != null && m != null) {
    lines.push({
      template: "Сравнение: N [?] M → переполнение.",
      blanks: [
        blank(
          methodTaskId,
          lines.length,
          0,
          "object",
          n > m ? ">" : "≥",
          ">",
        ),
      ],
    });
  }

  lines.push({
    template: "Вывод: [итог].",
    blanks: [
      blank(methodTaskId, lines.length, 0, "conclusion", model.conclusionText, "…"),
    ],
  });

  return lines;
}

export function buildProofCardOrder(model, flowId) {
  const { n, m } = model.counts;
  const items = [
    { id: "step-rabbits", text: `Зайцы — ${model.rabbits[0]?.label ?? "предметы"}` },
    { id: "step-cells", text: `Клетки — ${model.cells[0]?.label ?? "категории"}` },
  ];

  if (flowId === "F3_UNLUCKY") {
    items.push({ id: "step-worst", text: "Строим самый неудачный случай" });
    items.push({ id: "step-plus1", text: "Добавляем один предмет — гарантия" });
  } else {
    if (n != null && m != null) {
      items.push({ id: "step-counts", text: `Считаем N = ${n} и M = ${m}` });
    } else {
      items.push({ id: "step-counts", text: "Считаем N и M из условия" });
    }
    items.push({ id: "step-compare", text: "Сравниваем: зайцев больше, чем клеток" });
  }

  items.push({
    id: "step-conclude",
    text: `Вывод: ${model.conclusionText.slice(0, 72)}${model.conclusionText.length > 72 ? "…" : ""}`,
  });

  return items;
}
