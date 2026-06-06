import type { UnluckyModel } from "./types";

/** Модели «метод неудачника» по methodTaskId M3.x */
export const UNLUCKY_MODELS: Record<string, UnluckyModel> = {
  "M3.2": {
    variant: "threshold",
    goal: "получить два шарика одного цвета",
    goalPhrase:
      "Нужно гарантировать, что среди выбранных шариков обязательно найдутся два шарика одного цвета.",
    categories: [
      { id: "black", label: "чёрный", emoji: "⚫", maxInWorstCase: 1 },
      { id: "white", label: "белый", emoji: "⚪", maxInWorstCase: 1 },
    ],
    maxPerCategoryWithoutSuccess: 1,
    maxWithoutSuccess: 2,
    answer: 3,
    itemLabel: "шарик",
    itemLabelGenitive: "шариков",
    worstCaseHint: "Можно вынуть по одному шарику каждого цвета — одинаковых ещё нет.",
    explanation: [
      "Если очень не повезёт, можно вынуть один чёрный и один белый шарик.",
      "Тогда двух одинаковых ещё нет.",
      "Значит, 2 шариков недостаточно.",
      "Если вынуть ещё один шарик, он обязательно совпадёт по цвету с одним из уже вынутых.",
      "Поэтому нужно вынуть 3 шарика.",
    ],
    writeSolutionLines: [
      {
        template: "Если очень не повезёт, можно вынуть [ ] и [ ] шарик.",
        blanks: [
          { id: "m32-w1", type: "object", accept: ["1 чёрный", "чёрный", "1"] },
          { id: "m32-w2", type: "object", accept: ["1 белый", "белый", "1"] },
        ],
      },
      {
        template: "Двух одинаковых ещё нет. Значит, [ ] шариков недостаточно.",
        blanks: [{ id: "m32-w3", type: "number", accept: 2 }],
      },
      {
        template: "Если вынуть ещё [ ] шарик, он обязательно совпадёт по цвету с одним из уже вынутых.",
        blanks: [{ id: "m32-w4", type: "number", accept: 1 }],
      },
      {
        template: "Поэтому нужно вынуть [ ] шарика.",
        blanks: [{ id: "m32-w5", type: "number", accept: 3 }],
      },
    ],
  },
  "M3.3": {
    variant: "threshold",
    goal: "получить не менее 10 шаров одного цвета",
    goalPhrase:
      "Нужно гарантировать, что среди вынутых шаров будет не менее 10 шаров одного цвета.",
    categories: [
      { id: "red", label: "красный", emoji: "🔴", maxInWorstCase: 9 },
      { id: "blue", label: "синий", emoji: "🔵", maxInWorstCase: 9 },
      { id: "yellow", label: "жёлтый", emoji: "🟡", maxInWorstCase: 9 },
      { id: "black", label: "чёрный", emoji: "⚫", maxInWorstCase: 5 },
      { id: "white", label: "белый", emoji: "⚪", maxInWorstCase: 5 },
    ],
    maxWithoutSuccess: 37,
    answer: 38,
    itemLabel: "шар",
    itemLabelGenitive: "шаров",
    worstCaseHint: "По 9 красных, синих и жёлтых, плюс несколько чёрных и белых — десяти одного цвета ещё нет.",
    explanation: [
      "Если вынуть 37 шаров, можно получить по 9 красных, синих и жёлтых и ещё 5 чёрных и белых.",
      "Десяти шаров одного цвета при этом ещё нет.",
      "Если вынуть 38 шаров, среди красных, синих и жёлтых будет не меньше 28.",
      "28 > 3·9, значит одного из этих цветов будет не меньше 10.",
    ],
    writeSolutionLines: [
      {
        template: "Если вынуть [ ] шаров, можно получить по 9 красных, синих и жёлтых.",
        blanks: [{ id: "m33-w1", type: "number", accept: 37 }],
      },
      {
        template: "Десяти шаров одного цвета ещё нет. Значит, [ ] шаров недостаточно.",
        blanks: [{ id: "m33-w2", type: "number", accept: 37 }],
      },
      {
        template: "Если вынуть [ ] шаров, среди красных, синих и жёлтых будет не меньше 28.",
        blanks: [{ id: "m33-w3", type: "number", accept: 38 }],
      },
      {
        template: "28 > 3·9, значит одного из этих цветов будет не меньше 10. Ответ: [ ].",
        blanks: [{ id: "m33-w4", type: "number", accept: 38 }],
      },
    ],
  },
  "M3.4": {
    variant: "threshold",
    goal: "чтобы хоть в одной карточке был угадан хоть один номер",
    goalPhrase:
      "Нужно гарантировать, что хотя бы в одной купленной карточке окажется хотя бы один угаданный номер.",
    categories: [
      { id: "g1", label: "карточка с номерами 1–6", emoji: "🎫", maxInWorstCase: 1 },
      { id: "g2", label: "карточка с номерами 7–12", emoji: "🎫", maxInWorstCase: 1 },
      { id: "g3", label: "карточка с номерами 13–18", emoji: "🎫", maxInWorstCase: 1 },
      { id: "g4", label: "карточка с номерами 19–24", emoji: "🎫", maxInWorstCase: 1 },
      { id: "g5", label: "карточка с номерами 25–30", emoji: "🎫", maxInWorstCase: 1 },
      { id: "g6", label: "карточка с номерами 31–36", emoji: "🎫", maxInWorstCase: 1 },
      { id: "g7", label: "карточка с номерами 37–42", emoji: "🎫", maxInWorstCase: 1 },
    ],
    maxWithoutSuccess: 7,
    answer: 8,
    itemLabel: "карточка",
    itemLabelGenitive: "карточек",
    worstCaseHint:
      "Семью карточками можно «накрыть» 42 номера — семь выигрышных номеров могут оказаться среди незачёркнутых.",
    explanation: [
      "Семью карточками можно зачеркнуть не более 42 различных номеров.",
      "Тогда не менее семи выигрышных номеров могут нигде не быть зачёркнуты.",
      "Все шесть выигрышных могут оказаться среди этих «непокрытых» номеров.",
      "Восьмой карточки достаточно, чтобы зачеркнуть ещё один блок — гарантия появляется.",
    ],
    writeSolutionLines: [
      {
        template: "Семью карточками можно зачеркнуть не более 42 номеров — [ ] карточек может не хватить.",
        blanks: [{ id: "m34-w1", type: "number", accept: 7 }],
      },
      {
        template: "Тогда все [ ] выигрышных номеров могут оказаться незачёркнутыми.",
        blanks: [{ id: "m34-w2", type: "number", accept: 6 }],
      },
      {
        template: "Значит, [ ] карточек недостаточно. Нужно купить [ ] карточек.",
        blanks: [
          { id: "m34-w3", type: "number", accept: 7 },
          { id: "m34-w4", type: "number", accept: 8 },
        ],
      },
    ],
  },
  "M3.5": {
    variant: "threshold",
    goal: "найти три шарика различных цветов",
    goalPhrase:
      "Нужно гарантировать, что среди вытащенных шариков найдутся три шарика различных цветов.",
    categories: [
      { id: "color-a", label: "одного цвета (максимум)", emoji: "🔴", maxInWorstCase: 75 },
      { id: "color-b", label: "второго цвета", emoji: "🔵", maxInWorstCase: 12 },
      { id: "color-c", label: "третьего цвета (в худшем случае 0)", emoji: "🟢", maxInWorstCase: 0 },
    ],
    maxWithoutSuccess: 87,
    answer: 88,
    itemLabel: "шарик",
    itemLabelGenitive: "шариков",
    worstCaseHint: "87 шариков могут быть только двух цветов — например, 75 + 12.",
    explanation: [
      "Шариков каждого цвета не меньше 12.",
      "Значит, двух цветов вместе — не больше 111 − 24 = 87.",
      "87 шариков могут быть только двух цветов.",
      "88 шариков уже обязаны дать минимум три различных цвета.",
    ],
    writeSolutionLines: [
      {
        template: "[ ] шариков могут быть только двух цветов — нужного результата ещё нет.",
        blanks: [{ id: "m35-w1", type: "number", accept: 87 }],
      },
      {
        template: "Значит, [ ] шариков недостаточно.",
        blanks: [{ id: "m35-w2", type: "number", accept: 87 }],
      },
      {
        template: "А [ ] шариков уже гарантируют три различных цвета.",
        blanks: [{ id: "m35-w3", type: "number", accept: 88 }],
      },
    ],
  },
  "M3.1": {
    variant: "deduction",
    goal: "назвать все 5 монет, которые Петя вытащил",
    goalPhrase: "Нужно понять, какие именно 5 монет лежали в кармане у Пети.",
    categories: [
      { id: "one", label: "монеты «1 рубль» в выборке", emoji: "🪙", maxInWorstCase: 2 },
      { id: "two", label: "монеты «2 рубля» в выборке", emoji: "💰", maxInWorstCase: 2 },
    ],
    maxWithoutSuccess: 4,
    answer: 5,
    itemLabel: "монета",
    itemLabelGenitive: "монет",
    worstCaseHint:
      "Из условий: монет не «1 рубль» не больше двух, монет не «2 рубля» — не больше трёх. Из пяти вытащенных — три рублёвые и две двухрублёвые.",
    explanation: [
      "Среди любых трёх монет есть «1 рубль» — значит, монет другого достоинства не больше двух.",
      "Среди любых четырёх монет есть «2 рубля» — монет не «2 рубля» не больше трёх.",
      "Среди пяти вытащенных монет: три «1 рубль» и две «2 рубля».",
      "Других монет в кармане быть не может.",
    ],
  },
};

export const UNLUCKY_METHOD_TASK_IDS = Object.keys(UNLUCKY_MODELS);
