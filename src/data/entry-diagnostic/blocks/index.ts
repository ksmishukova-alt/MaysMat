import { makePlanTask, makeReadingTask, makeTask, makeExpressionTask, toBlock, type BlockSeed } from "../seed-helpers";

const B01 = "block-01";
const seeds: BlockSeed[] = [
  {
    blockId: B01,
    blockIndex: 1,
    title: "Чтение условия",
    skill: "reading_comprehension",
    runnerKind: "reading_comprehension_visual",
    miniGameId: "pojmat",
    tasks: [
      makeReadingTask(
        B01,
        "D1",
        "У Маши 12 яблок, у Пети 8. Сколько всего яблок у детей?",
        "О чём спрашивают в задаче?",
        [
          { id: "together", label: "Сколько яблок у Маши и Пети вместе?" },
          { id: "masha", label: "Сколько яблок у Маши?" },
          { id: "peti", label: "Сколько яблок у Пети?" },
          { id: "extra", label: "Сколько яблок лишние?" },
        ],
        "together",
        ["reading_error", "question_focus_error"],
      ),
      makeReadingTask(
        B01,
        "D2",
        "В корзине 24 конфеты: 10 шоколадных, остальные — карамельки. Сколько карамелек?",
        "Какой вопрос подходит к задаче?",
        [
          { id: "caramel", label: "Сколько карамелек в корзине?" },
          { id: "choco", label: "Сколько шоколадных конфет?" },
          { id: "total", label: "Сколько конфет всего?" },
          { id: "extra", label: "Сколько конфет лишних?" },
        ],
        "caramel",
        ["reading_error", "data_error"],
      ),
      makeReadingTask(
        B01,
        "D3",
        "На полке 5 красных, 7 синих и 3 зелёных книг. Сколько книг не красных?",
        "Какой ответ подходит к вопросу?",
        [
          { id: "not_red", label: "Сколько книг не красных?" },
          { id: "red", label: "Сколько красных книг?" },
          { id: "blue", label: "Сколько синих книг?" },
          { id: "green", label: "Сколько зелёных книг?" },
        ],
        "not_red",
        ["reading_error", "extra_data_error", "question_focus_error"],
      ),
    ],
  },
  {
    blockId: "block-02",
    blockIndex: 2,
    title: "Сложение и вычитание в сюжете",
    skill: "story_add_sub",
    runnerKind: "story_add_sub_visual",
    miniGameId: "parkomat",
    tasks: [
      makeTask("block-02", "D1", "Треть от 12 конфет — сколько?", { value: 4 }, [
        { type: "numericEquals", field: "value", value: 4 },
      ], ["operation_error", "unit_error"]),
      makeTask("block-02", "D2", "87 − 49 = ?", { value: 38 }, [
        { type: "numericEquals", field: "value", value: 38 },
      ], ["calculation_error", "borrow_error"]),
      makeTask("block-02", "D3", "232 + 197 − 68 = ?", { value: 361 }, [
        { type: "numericEquals", field: "value", value: 361 },
      ], ["operation_error", "calculation_error"]),
    ],
  },
  {
    blockId: "block-03",
    blockIndex: 3,
    title: "Сложение и вычитание столбиком",
    skill: "column_add_sub",
    runnerKind: "column_add_sub_visual",
    miniGameId: "razryad",
    tasks: [
      makeTask("block-03", "D1", "324 + 251 = ?", { value: 575 }, [
        { type: "numericEquals", field: "value", value: 575 },
      ], ["carry_error", "alignment_error"]),
      makeTask("block-03", "D2", "478 + 356 = ?", { value: 834 }, [
        { type: "numericEquals", field: "value", value: 834 },
      ], ["carry_error", "alignment_error"]),
      makeTask("block-03", "D3", "5030 − 486 = ?", { value: 4544 }, [
        { type: "numericEquals", field: "value", value: 4544 },
      ], ["borrow_error", "zero_borrow_error"]),
    ],
  },
  {
    blockId: "block-04",
    blockIndex: 4,
    title: "Умножение",
    skill: "multiplication",
    runnerKind: "column_multiplication_visual",
    miniGameId: "warehouse",
    tasks: [
      makeTask("block-04", "D1", "7 × 8 = ?", { value: 56 }, [
        { type: "numericEquals", field: "value", value: 56 },
      ], ["multiplication_fact_error"]),
      makeTask("block-04", "D2", "24 × 3 = ?", { value: 72 }, [
        { type: "numericEquals", field: "value", value: 72 },
      ], ["partial_product_error"]),
      makeTask("block-04", "D3", "112 × 23 = ?", { value: 2576 }, [
        { type: "numericEquals", field: "value", value: 2576 },
      ], ["shift_error", "sum_partial_products_error"]),
    ],
  },
  {
    blockId: "block-05",
    blockIndex: 5,
    title: "Деление",
    skill: "division",
    runnerKind: "long_division_visual",
    miniGameId: "bubbles",
    tasks: [
      makeTask("block-05", "D1", "56 : 7 = ?", { value: 8 }, [
        { type: "numericEquals", field: "value", value: 8 },
      ], ["quotient_place_error"]),
      makeTask("block-05", "D2", "84 : 4 = ?", { value: 21 }, [
        { type: "numericEquals", field: "value", value: 21 },
      ], ["quotient_length_error"]),
      makeTask("block-05", "D3", "936 : 24 = ?", { value: 39 }, [
        { type: "numericEquals", field: "value", value: 39 },
      ], ["first_partial_dividend_error", "remainder_error"]),
    ],
  },
  {
    blockId: "block-06",
    blockIndex: 6,
    title: "Остаток и округление",
    skill: "remainder_interpretation",
    runnerKind: "remainder_interpretation_visual",
    miniGameId: "station",
    tasks: [
      makeTask("block-06", "D1", "17 : 5 — какой остаток?", { value: 2 }, [
        { type: "numericEquals", field: "value", value: 2 },
      ], ["remainder_missing_error"]),
      makeTask("block-06", "D2", "43 : 6 — сколько полных шестёрок?", { value: 7 }, [
        { type: "numericEquals", field: "value", value: 7 },
      ], ["rounding_down_error"]),
      makeTask(
        "block-06",
        "D3",
        "Нужно 50 банок, в упаковке 6. Сколько упаковок купить?",
        { value: 9 },
        [{ type: "numericEquals", field: "value", value: 9 }],
        ["rounding_up_error", "question_focus_error"],
      ),
    ],
  },
  {
    blockId: "block-07",
    blockIndex: 7,
    title: "Порядок действий",
    skill: "order_of_operations",
    runnerKind: "expression_order_visual_with_embedded_calculation",
    miniGameId: "parade",
    tasks: [
      makeExpressionTask("block-07", "D1", "48 : 6 + 7 × 4 − 1 = ?", 35, [
        "order_error",
        "calculation_error",
      ]),
      makeExpressionTask("block-07", "D2", "9500 × 806 : 589 − 489 = ?", 12511, [
        "order_error",
        "computation_error",
      ]),
      makeExpressionTask("block-07", "D3", "2400 : 60 + 15 = ?", 55, [
        "order_error",
        "calculation_error",
      ]),
    ],
  },
  {
    blockId: "block-08",
    blockIndex: 8,
    title: "План текстовой задачи",
    skill: "text_problem_plan",
    runnerKind: "text_problem_plan_visual",
    miniGameId: "mouse-route",
    tasks: [
      makePlanTask("block-08", "D1", "Купили 2 пачки по 6 карандашей. Сколько карандашей?", 2, [
        "action_count_error",
        "plan_error",
      ]),
      makePlanTask("block-08", "D2", "Было 40 яблок, съели 12, принесли 8. Сколько стало?", 3, [
        "action_count_error",
      ]),
      makePlanTask(
        "block-08",
        "D3",
        "Цена выросла на 20%, потом упала на 10%. Сколько стоит сейчас?",
        4,
        ["action_count_error", "plan_error"],
      ),
    ],
  },
  {
    blockId: "block-09",
    blockIndex: 9,
    title: "Путь, скорость, время",
    skill: "motion",
    runnerKind: "motion_model_visual",
    miniGameId: "time-path",
    tasks: [
      makeTask("block-09", "D1", "60 км за 2 ч. Скорость?", { value: 30 }, [
        { type: "numericEquals", field: "value", value: 30 },
      ], ["formula_error"]),
      makeTask("block-09", "D2", "90 км со скоростью 45 км/ч. Время?", { value: 2 }, [
        { type: "numericEquals", field: "value", value: 2 },
      ], ["unit_error"]),
      makeTask("block-09", "D3", "Встречное движение: 120 км, 40 и 20 км/ч. Через сколько часов?", { value: 2 }, [
        { type: "numericEquals", field: "value", value: 2 },
      ], ["model_error"]),
    ],
  },
  {
    blockId: "block-10",
    blockIndex: 10,
    title: "Геометрия на сетке",
    skill: "geometry",
    runnerKind: "geometry_grid_visual",
    miniGameId: "fence-tile",
    tasks: [
      makeTask("block-10", "D1", "Прямоугольник 3×4. Периметр?", { value: 14 }, [
        { type: "numericEquals", field: "value", value: 14 },
      ], ["perimeter_area_confusion"]),
      makeTask("block-10", "D2", "Квадрат со стороной 5. Площадь?", { value: 25 }, [
        { type: "numericEquals", field: "value", value: 25 },
      ], ["perimeter_area_confusion"]),
      makeTask("block-10", "D3", "Комната 4×6 м, плитка 1×1 м. Сколько плиток?", { value: 24 }, [
        { type: "numericEquals", field: "value", value: 24 },
      ], ["count_error"]),
    ],
  },
  {
    blockId: "block-11",
    blockIndex: 11,
    title: "Дроби",
    skill: "fractions",
    runnerKind: "fraction_model_visual",
    miniGameId: "cheese-share",
    tasks: [
      makeTask("block-11", "D1", "1/2 от 10 = ?", { value: 5 }, [
        { type: "numericEquals", field: "value", value: 5 },
      ], ["fraction_model_error"]),
      makeTask("block-11", "D2", "3/4 от 20 = ?", { value: 15 }, [
        { type: "numericEquals", field: "value", value: 15 },
      ], ["fraction_model_error"]),
      makeTask("block-11", "D3", "2/3 + 1/6 (числитель итога)", { value: 5 }, [
        { type: "numericEquals", field: "value", value: 5 },
      ], ["common_denominator_error"]),
    ],
  },
  {
    blockId: "block-12",
    blockIndex: 12,
    title: "Проценты",
    skill: "percents",
    runnerKind: "percent_model_visual",
    miniGameId: "percentomat",
    tasks: [
      makeTask("block-12", "D1", "10% от 200 = ?", { value: 20 }, [
        { type: "numericEquals", field: "value", value: 20 },
      ], ["percent_model_error"]),
      makeTask("block-12", "D2", "25% от 80 = ?", { value: 20 }, [
        { type: "numericEquals", field: "value", value: 20 },
      ], ["percent_model_error"]),
      makeTask("block-12", "D3", "Скидка 17% на 500 ₽. Сколько заплатить?", { value: 415 }, [
        { type: "numericEquals", field: "value", value: 415 },
      ], ["percent_model_error", "calculation_error"]),
    ],
  },
  {
    blockId: "block-13",
    blockIndex: 13,
    title: "Логика если-то",
    skill: "logic",
    runnerKind: "logic_if_then_visual",
    miniGameId: "advocate",
    tasks: [
      makeTask("block-13", "D1", "Все кошки — млекопитающие. Мурка — кошка. Мурка — млекопитающее?", { value: 1 }, [
        { type: "numericEquals", field: "value", value: 1 },
      ], ["logic_error"]),
      makeTask("block-13", "D2", "Если идёт дождь, асфальт мокрый. Асфальт сухой. Шёл дождь?", { value: 0 }, [
        { type: "numericEquals", field: "value", value: 0 },
      ], ["converse_error"]),
      makeTask("block-13", "D3", "Некоторые A — B. Все B — C. Верно ли: некоторые A — C?", { value: 1 }, [
        { type: "numericEquals", field: "value", value: 1 },
      ], ["logic_chain_error"]),
    ],
  },
  {
    blockId: "block-14",
    blockIndex: 14,
    title: "Системный перебор",
    skill: "systematic_search",
    runnerKind: "systematic_search_visual",
    miniGameId: "code-chest",
    tasks: [
      makeTask("block-14", "D1", "Сколько двузначных чисел с цифрами 1 и 2?", { value: 4 }, [
        { type: "numericEquals", field: "value", value: 4 },
      ], ["search_incomplete"]),
      makeTask("block-14", "D2", "Сумма двух костей 7. Сколько пар?", { value: 6 }, [
        { type: "numericEquals", field: "value", value: 6 },
      ], ["duplicate_count_error"]),
      makeTask("block-14", "D3", "Трёхзначный код, цифры 1-3 без повтора. Сколько кодов?", { value: 6 }, [
        { type: "numericEquals", field: "value", value: 6 },
      ], ["search_incomplete"]),
    ],
  },
  {
    blockId: "block-15",
    blockIndex: 15,
    title: "Закономерности и циклы",
    skill: "patterns",
    runnerKind: "pattern_cycle_visual",
    miniGameId: "catch-repeat",
    tasks: [
      makeTask("block-15", "D1", "Цикл ▲●■. 7-й символ (1=▲,2=●,3=■)?", { value: 1 }, [
        { type: "numericEquals", field: "value", value: 1 },
      ], ["cycle_error"]),
      makeTask("block-15", "D2", "50-й элемент цикла длины 4 — это 2-й. Номер?", { value: 2 }, [
        { type: "numericEquals", field: "value", value: 2 },
      ], ["remainder_cycle_error"]),
      makeTask("block-15", "D3", "107 в цикле из 5 элементов — позиция (1-5)?", { value: 2 }, [
        { type: "numericEquals", field: "value", value: 2 },
      ], ["remainder_zero_error"]),
    ],
  },
];

export const ENTRY_DIAGNOSTIC_BLOCKS = seeds.map(toBlock);

export const ENTRY_DIAGNOSTIC_BLOCK_COUNT = ENTRY_DIAGNOSTIC_BLOCKS.length;
export const ENTRY_DIAGNOSTIC_MAX_SCORE = 90;

export function getBlockById(blockId: string) {
  return ENTRY_DIAGNOSTIC_BLOCKS.find((b) => b.blockId === blockId);
}

export function getBlockByIndex(index: number) {
  return ENTRY_DIAGNOSTIC_BLOCKS.find((b) => b.blockIndex === index);
}

export const ALL_RUNNER_KINDS = [
  "reading_comprehension_visual",
  "story_add_sub_visual",
  "column_add_sub_visual",
  "column_multiplication_visual",
  "long_division_visual",
  "remainder_interpretation_visual",
  "expression_order_visual_with_embedded_calculation",
  "text_problem_plan_visual",
  "motion_model_visual",
  "geometry_grid_visual",
  "fraction_model_visual",
  "percent_model_visual",
  "logic_if_then_visual",
  "systematic_search_visual",
  "pattern_cycle_visual",
] as const;
