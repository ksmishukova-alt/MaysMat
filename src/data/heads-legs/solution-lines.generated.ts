/** AUTO-GENERATED — scripts/generate-heads-legs-content.mjs */
import type { SolutionLine } from "./types";

export const HEADS_LEGS_SOLUTION_LINES: Record<string, SolutionLine[]> = {
  "1.1": [
    {
      "template": "Представим, что все [30] животных были [птицами].",
      "blanks": [
        {
          "id": "1.1-b-0-0",
          "type": "number",
          "accept": [
            "30",
            30
          ]
        },
        {
          "id": "1.1-b-0-1",
          "type": "object",
          "accept": [
            "птицами"
          ]
        }
      ]
    },
    {
      "template": "Тогда ног было бы [30 x 2 = 60].",
      "blanks": [
        {
          "id": "1.1-b-1-0",
          "type": "expression",
          "accept": [
            "30 x 2 = 60"
          ]
        }
      ]
    },
    {
      "template": "По условию ног [100].",
      "blanks": [
        {
          "id": "1.1-b-2-0",
          "type": "number",
          "accept": [
            "100",
            100
          ]
        }
      ]
    },
    {
      "template": "Не хватает [100 - 60 = 40] ног.",
      "blanks": [
        {
          "id": "1.1-b-3-0",
          "type": "expression",
          "accept": [
            "100 - 60 = 40"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Один зверь добавляет [4 - 2 = 2] ноги.",
      "blanks": [
        {
          "id": "1.1-b-4-0",
          "type": "expression",
          "accept": [
            "4 - 2 = 2"
          ]
        }
      ]
    },
    {
      "template": "Значит, зверей было [40 ÷ 2 = 20].",
      "blanks": [
        {
          "id": "1.1-b-5-0",
          "type": "expression",
          "accept": [
            "40 ÷ 2 = 20"
          ]
        }
      ]
    },
    {
      "template": "Птиц было [30 - 20 = 10].",
      "blanks": [
        {
          "id": "1.1-b-6-0",
          "type": "expression",
          "accept": [
            "30 - 20 = 10"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [20 зверей и 10 птиц].",
      "blanks": [
        {
          "id": "1.1-b-7-0",
          "type": "object",
          "accept": [
            "20 зверей и 10 птиц"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "1.2": [
    {
      "template": "Представим, что все [120] детёнышей были [змеями].",
      "blanks": [
        {
          "id": "1.2-b-0-0",
          "type": "number",
          "accept": [
            "120",
            120
          ]
        },
        {
          "id": "1.2-b-0-1",
          "type": "object",
          "accept": [
            "змеями"
          ]
        }
      ]
    },
    {
      "template": "Тогда ног было бы [0].",
      "blanks": [
        {
          "id": "1.2-b-1-0",
          "type": "number",
          "accept": [
            "0",
            0
          ]
        }
      ]
    },
    {
      "template": "По условию ног [162].",
      "blanks": [
        {
          "id": "1.2-b-2-0",
          "type": "number",
          "accept": [
            "162",
            162
          ]
        }
      ]
    },
    {
      "template": "Один цыплёнок добавляет [2] ноги.",
      "blanks": [
        {
          "id": "1.2-b-3-0",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        }
      ]
    },
    {
      "template": "Поэтому цыплят было [162 ÷ 2 = 81].",
      "blanks": [
        {
          "id": "1.2-b-4-0",
          "type": "expression",
          "accept": [
            "162 ÷ 2 = 81"
          ]
        }
      ]
    },
    {
      "template": "Значит, змей было [120 - 81 = 39].",
      "blanks": [
        {
          "id": "1.2-b-5-0",
          "type": "expression",
          "accept": [
            "120 - 81 = 39"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Ответ: [39 змей].",
      "blanks": [
        {
          "id": "1.2-b-6-0",
          "type": "object",
          "accept": [
            "39 змей"
          ]
        }
      ]
    }
  ],
  "1.3": [
    {
      "template": "Представим, что все [200] детёнышей были [гусятами].",
      "blanks": [
        {
          "id": "1.3-b-0-0",
          "type": "number",
          "accept": [
            "200",
            200
          ]
        },
        {
          "id": "1.3-b-0-1",
          "type": "object",
          "accept": [
            "гусятами"
          ]
        }
      ]
    },
    {
      "template": "Тогда ног было бы [200 x 2 = 400].",
      "blanks": [
        {
          "id": "1.3-b-1-0",
          "type": "expression",
          "accept": [
            "200 x 2 = 400"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "По условию ног [500].",
      "blanks": [
        {
          "id": "1.3-b-2-0",
          "type": "number",
          "accept": [
            "500",
            500
          ]
        }
      ]
    },
    {
      "template": "Лишних ног получилось [500 - 400 = 100].",
      "blanks": [
        {
          "id": "1.3-b-3-0",
          "type": "expression",
          "accept": [
            "500 - 400 = 100"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Один крокодильчик добавляет [4 - 2 = 2] ноги.",
      "blanks": [
        {
          "id": "1.3-b-4-0",
          "type": "expression",
          "accept": [
            "4 - 2 = 2"
          ]
        }
      ]
    },
    {
      "template": "Крокодильчиков было [100 ÷ 2 = 50].",
      "blanks": [
        {
          "id": "1.3-b-5-0",
          "type": "expression",
          "accept": [
            "100 ÷ 2 = 50"
          ]
        }
      ]
    },
    {
      "template": "Гусят было [200 - 50 = 150].",
      "blanks": [
        {
          "id": "1.3-b-6-0",
          "type": "expression",
          "accept": [
            "200 - 50 = 150"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Ответ: [150 гусят и 50 крокодильчиков].",
      "blanks": [
        {
          "id": "1.3-b-7-0",
          "type": "conclusion",
          "accept": [
            "150 гусят и 50 крокодильчиков"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "1.4": [
    {
      "template": "Представим, что все [40] существ были [жуками].",
      "blanks": [
        {
          "id": "1.4-b-0-0",
          "type": "number",
          "accept": [
            "40",
            40
          ]
        },
        {
          "id": "1.4-b-0-1",
          "type": "object",
          "accept": [
            "жуками"
          ]
        }
      ]
    },
    {
      "template": "Тогда ног было бы [40 x 6 = 240].",
      "blanks": [
        {
          "id": "1.4-b-1-0",
          "type": "expression",
          "accept": [
            "40 x 6 = 240"
          ]
        }
      ]
    },
    {
      "template": "По условию ног [270].",
      "blanks": [
        {
          "id": "1.4-b-2-0",
          "type": "number",
          "accept": [
            "270",
            270
          ]
        }
      ]
    },
    {
      "template": "Лишних ног [270 - 240 = 30].",
      "blanks": [
        {
          "id": "1.4-b-3-0",
          "type": "expression",
          "accept": [
            "270 - 240 = 30"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Один паук добавляет [8 - 6 = 2] ноги.",
      "blanks": [
        {
          "id": "1.4-b-4-0",
          "type": "expression",
          "accept": [
            "8 - 6 = 2"
          ]
        }
      ]
    },
    {
      "template": "Пауков было [30 ÷ 2 = 15].",
      "blanks": [
        {
          "id": "1.4-b-5-0",
          "type": "expression",
          "accept": [
            "30 ÷ 2 = 15"
          ]
        }
      ]
    },
    {
      "template": "Жуков было [40 - 15 = 25].",
      "blanks": [
        {
          "id": "1.4-b-6-0",
          "type": "expression",
          "accept": [
            "40 - 15 = 25"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [25 жуков и 15 пауков].",
      "blanks": [
        {
          "id": "1.4-b-7-0",
          "type": "object",
          "accept": [
            "25 жуков и 15 пауков"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "1.5": [
    {
      "template": "У жука [6] ног, значит правых ног [3].",
      "blanks": [
        {
          "id": "1.5-b-0-0",
          "type": "number",
          "accept": [
            "6",
            6
          ]
        },
        {
          "id": "1.5-b-0-1",
          "type": "number",
          "accept": [
            "3",
            3
          ]
        }
      ]
    },
    {
      "template": "У паука [8] ног, значит правых ног [4].",
      "blanks": [
        {
          "id": "1.5-b-1-0",
          "type": "number",
          "accept": [
            "8",
            8
          ]
        },
        {
          "id": "1.5-b-1-1",
          "type": "number",
          "accept": [
            "4",
            4
          ]
        }
      ]
    },
    {
      "template": "Представим, что все [70] существ были [жуками].",
      "blanks": [
        {
          "id": "1.5-b-2-0",
          "type": "number",
          "accept": [
            "70",
            70
          ]
        },
        {
          "id": "1.5-b-2-1",
          "type": "object",
          "accept": [
            "жуками"
          ]
        }
      ]
    },
    {
      "template": "Тогда правых ног было бы [70 x 3 = 210].",
      "blanks": [
        {
          "id": "1.5-b-3-0",
          "type": "expression",
          "accept": [
            "70 x 3 = 210"
          ]
        }
      ]
    },
    {
      "template": "По условию правых ног [242].",
      "blanks": [
        {
          "id": "1.5-b-4-0",
          "type": "number",
          "accept": [
            "242",
            242
          ]
        }
      ]
    },
    {
      "template": "Лишних правых ног [242 - 210 = 32].",
      "blanks": [
        {
          "id": "1.5-b-5-0",
          "type": "expression",
          "accept": [
            "242 - 210 = 32"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Один паук добавляет [4 - 3 = 1] правую ногу.",
      "blanks": [
        {
          "id": "1.5-b-6-0",
          "type": "expression",
          "accept": [
            "4 - 3 = 1"
          ]
        }
      ]
    },
    {
      "template": "Пауков было [32 ÷ 1 = 32].",
      "blanks": [
        {
          "id": "1.5-b-7-0",
          "type": "expression",
          "accept": [
            "32 ÷ 1 = 32"
          ]
        }
      ]
    },
    {
      "template": "Жуков было [70 - 32 = 38].",
      "blanks": [
        {
          "id": "1.5-b-8-0",
          "type": "expression",
          "accept": [
            "70 - 32 = 38"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [38 жуков и 32 паука].",
      "blanks": [
        {
          "id": "1.5-b-9-0",
          "type": "object",
          "accept": [
            "38 жуков и 32 паука"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "1.6": [
    {
      "template": "Представим, что все [35] велосипедистов ехали на [двухколёсных] велосипедах.",
      "blanks": [
        {
          "id": "1.6-b-0-0",
          "type": "number",
          "accept": [
            "35",
            35
          ]
        },
        {
          "id": "1.6-b-0-1",
          "type": "object",
          "accept": [
            "двухколёсных"
          ]
        }
      ]
    },
    {
      "template": "Тогда колёс было бы [35 x 2 = 70].",
      "blanks": [
        {
          "id": "1.6-b-1-0",
          "type": "expression",
          "accept": [
            "35 x 2 = 70"
          ]
        }
      ]
    },
    {
      "template": "По условию колёс [102].",
      "blanks": [
        {
          "id": "1.6-b-2-0",
          "type": "number",
          "accept": [
            "102",
            102
          ]
        }
      ]
    },
    {
      "template": "Лишних колёс [102 - 70 = 32].",
      "blanks": [
        {
          "id": "1.6-b-3-0",
          "type": "expression",
          "accept": [
            "102 - 70 = 32"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Один трёхколёсный велосипед добавляет [3 - 2 = 1] колесо.",
      "blanks": [
        {
          "id": "1.6-b-4-0",
          "type": "expression",
          "accept": [
            "3 - 2 = 1"
          ]
        }
      ]
    },
    {
      "template": "Трёхколёсных велосипедов было [32].",
      "blanks": [
        {
          "id": "1.6-b-5-0",
          "type": "number",
          "accept": [
            "32",
            32
          ]
        }
      ]
    },
    {
      "template": "Двухколёсных велосипедов было [35 - 32 = 3].",
      "blanks": [
        {
          "id": "1.6-b-6-0",
          "type": "expression",
          "accept": [
            "35 - 32 = 3"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [3 двухколёсных велосипеда].",
      "blanks": [
        {
          "id": "1.6-b-7-0",
          "type": "conclusion",
          "accept": [
            "3 двухколёсных велосипеда"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "1.7": [
    {
      "template": "Представим, что все [42] велосипеда были [двухколёсными].",
      "blanks": [
        {
          "id": "1.7-b-0-0",
          "type": "number",
          "accept": [
            "42",
            42
          ]
        },
        {
          "id": "1.7-b-0-1",
          "type": "object",
          "accept": [
            "двухколёсными"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Тогда колёс было бы [42 x 2 = 84].",
      "blanks": [
        {
          "id": "1.7-b-1-0",
          "type": "expression",
          "accept": [
            "42 x 2 = 84"
          ]
        }
      ]
    },
    {
      "template": "По условию колёс [88].",
      "blanks": [
        {
          "id": "1.7-b-2-0",
          "type": "number",
          "accept": [
            "88",
            88
          ]
        }
      ]
    },
    {
      "template": "Лишних колёс [88 - 84 = 4].",
      "blanks": [
        {
          "id": "1.7-b-3-0",
          "type": "expression",
          "accept": [
            "88 - 84 = 4"
          ]
        }
      ]
    },
    {
      "template": "Один трёхколёсный велосипед добавляет [1] колесо.",
      "blanks": [
        {
          "id": "1.7-b-4-0",
          "type": "number",
          "accept": [
            "1",
            1
          ]
        }
      ]
    },
    {
      "template": "Трёхколёсных велосипедов было [4 ÷ 1 = 4].",
      "blanks": [
        {
          "id": "1.7-b-5-0",
          "type": "expression",
          "accept": [
            "4 ÷ 1 = 4"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [4 трёхколёсных велосипеда].",
      "blanks": [
        {
          "id": "1.7-b-6-0",
          "type": "conclusion",
          "accept": [
            "4 трёхколёсных велосипеда"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "1.8": [
    {
      "template": "Представим, что все [10] игроков были [слонами].",
      "blanks": [
        {
          "id": "1.8-b-0-0",
          "type": "number",
          "accept": [
            "10",
            10
          ]
        },
        {
          "id": "1.8-b-0-1",
          "type": "object",
          "accept": [
            "слонами"
          ]
        }
      ]
    },
    {
      "template": "Тогда ног было бы [10 x 4 = 40].",
      "blanks": [
        {
          "id": "1.8-b-1-0",
          "type": "expression",
          "accept": [
            "10 x 4 = 40"
          ]
        }
      ]
    },
    {
      "template": "По условию ног [48].",
      "blanks": [
        {
          "id": "1.8-b-2-0",
          "type": "number",
          "accept": [
            "48",
            48
          ]
        }
      ]
    },
    {
      "template": "Лишних ног [48 - 40 = 8].",
      "blanks": [
        {
          "id": "1.8-b-3-0",
          "type": "expression",
          "accept": [
            "48 - 40 = 8"
          ]
        }
      ]
    },
    {
      "template": "Одна муха добавляет [6 - 4 = 2] ноги.",
      "blanks": [
        {
          "id": "1.8-b-4-0",
          "type": "expression",
          "accept": [
            "6 - 4 = 2"
          ]
        }
      ]
    },
    {
      "template": "Мух было [8 ÷ 2 = 4].",
      "blanks": [
        {
          "id": "1.8-b-5-0",
          "type": "expression",
          "accept": [
            "8 ÷ 2 = 4"
          ]
        }
      ]
    },
    {
      "template": "Слонов было [10 - 4 = 6].",
      "blanks": [
        {
          "id": "1.8-b-6-0",
          "type": "expression",
          "accept": [
            "10 - 4 = 6"
          ]
        }
      ]
    },
    {
      "template": "Ответ в формате МУХИ:СЛОНЫ: [4:6].",
      "blanks": [
        {
          "id": "1.8-b-7-0",
          "type": "object",
          "accept": [
            "4:6"
          ]
        }
      ]
    }
  ],
  "1.9": [
    {
      "template": "У каждого существа по [2] ноги, поэтому всего существ [20 ÷ 2 = 10].",
      "blanks": [
        {
          "id": "1.9-b-0-0",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        },
        {
          "id": "1.9-b-0-1",
          "type": "expression",
          "accept": [
            "20 ÷ 2 = 10"
          ]
        }
      ]
    },
    {
      "template": "Представим, что все [10] существ были [дроидами].",
      "blanks": [
        {
          "id": "1.9-b-1-0",
          "type": "number",
          "accept": [
            "10",
            10
          ]
        },
        {
          "id": "1.9-b-1-1",
          "type": "object",
          "accept": [
            "дроидами"
          ]
        }
      ]
    },
    {
      "template": "Тогда рук было бы [10 x 2 = 20].",
      "blanks": [
        {
          "id": "1.9-b-2-0",
          "type": "expression",
          "accept": [
            "10 x 2 = 20"
          ]
        }
      ]
    },
    {
      "template": "По условию рук [26].",
      "blanks": [
        {
          "id": "1.9-b-3-0",
          "type": "number",
          "accept": [
            "26",
            26
          ]
        }
      ]
    },
    {
      "template": "Лишних рук [26 - 20 = 6].",
      "blanks": [
        {
          "id": "1.9-b-4-0",
          "type": "expression",
          "accept": [
            "26 - 20 = 6"
          ]
        }
      ]
    },
    {
      "template": "Один генерал Гривус добавляет [4 - 2 = 2] руки.",
      "blanks": [
        {
          "id": "1.9-b-5-0",
          "type": "expression",
          "accept": [
            "4 - 2 = 2"
          ]
        }
      ]
    },
    {
      "template": "Генералов Гривусов было [6 ÷ 2 = 3].",
      "blanks": [
        {
          "id": "1.9-b-6-0",
          "type": "expression",
          "accept": [
            "6 ÷ 2 = 3"
          ]
        }
      ]
    },
    {
      "template": "Дроидов было [10 - 3 = 7].",
      "blanks": [
        {
          "id": "1.9-b-7-0",
          "type": "expression",
          "accept": [
            "10 - 3 = 7"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [7 дроидов].",
      "blanks": [
        {
          "id": "1.9-b-8-0",
          "type": "object",
          "accept": [
            "7 дроидов"
          ]
        }
      ]
    }
  ],
  "1.10": [
    {
      "template": "Представим, что все [17] голов принадлежали [гномам].",
      "blanks": [
        {
          "id": "1.10-b-0-0",
          "type": "number",
          "accept": [
            "17",
            17
          ]
        },
        {
          "id": "1.10-b-0-1",
          "type": "object",
          "accept": [
            "гномам"
          ]
        }
      ]
    },
    {
      "template": "Тогда ног было бы [17 x 2 = 34].",
      "blanks": [
        {
          "id": "1.10-b-1-0",
          "type": "expression",
          "accept": [
            "17 x 2 = 34"
          ]
        }
      ]
    },
    {
      "template": "По условию ног [54].",
      "blanks": [
        {
          "id": "1.10-b-2-0",
          "type": "number",
          "accept": [
            "54",
            54
          ]
        }
      ]
    },
    {
      "template": "Лишних ног [54 - 34 = 20].",
      "blanks": [
        {
          "id": "1.10-b-3-0",
          "type": "expression",
          "accept": [
            "54 - 34 = 20"
          ]
        }
      ]
    },
    {
      "template": "Один пони добавляет [4 - 2 = 2] ноги.",
      "blanks": [
        {
          "id": "1.10-b-4-0",
          "type": "expression",
          "accept": [
            "4 - 2 = 2"
          ]
        }
      ]
    },
    {
      "template": "Пони было [20 ÷ 2 = 10].",
      "blanks": [
        {
          "id": "1.10-b-5-0",
          "type": "expression",
          "accept": [
            "20 ÷ 2 = 10"
          ]
        }
      ]
    },
    {
      "template": "Гномов было [17 - 10 = 7].",
      "blanks": [
        {
          "id": "1.10-b-6-0",
          "type": "expression",
          "accept": [
            "17 - 10 = 7"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [7 гномов и 10 пони].",
      "blanks": [
        {
          "id": "1.10-b-7-0",
          "type": "object",
          "accept": [
            "7 гномов и 10 пони"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "1.11": [
    {
      "template": "У каждого животного [2] глаза, значит животных было [64 ÷ 2 = 32].",
      "blanks": [
        {
          "id": "1.11-b-0-0",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        },
        {
          "id": "1.11-b-0-1",
          "type": "expression",
          "accept": [
            "64 ÷ 2 = 32"
          ]
        }
      ]
    },
    {
      "template": "Представим, что все [32] животных были [страусами].",
      "blanks": [
        {
          "id": "1.11-b-1-0",
          "type": "number",
          "accept": [
            "32",
            32
          ]
        },
        {
          "id": "1.11-b-1-1",
          "type": "object",
          "accept": [
            "страусами"
          ]
        }
      ]
    },
    {
      "template": "Тогда ног было бы [32 x 2 = 64].",
      "blanks": [
        {
          "id": "1.11-b-2-0",
          "type": "expression",
          "accept": [
            "32 x 2 = 64"
          ]
        }
      ]
    },
    {
      "template": "По условию ног [84].",
      "blanks": [
        {
          "id": "1.11-b-3-0",
          "type": "number",
          "accept": [
            "84",
            84
          ]
        }
      ]
    },
    {
      "template": "Лишних ног [84 - 64 = 20].",
      "blanks": [
        {
          "id": "1.11-b-4-0",
          "type": "expression",
          "accept": [
            "84 - 64 = 20"
          ]
        }
      ]
    },
    {
      "template": "Один жираф добавляет [4 - 2 = 2] ноги.",
      "blanks": [
        {
          "id": "1.11-b-5-0",
          "type": "expression",
          "accept": [
            "4 - 2 = 2"
          ]
        }
      ]
    },
    {
      "template": "Жирафов было [20 ÷ 2 = 10].",
      "blanks": [
        {
          "id": "1.11-b-6-0",
          "type": "expression",
          "accept": [
            "20 ÷ 2 = 10"
          ]
        }
      ]
    },
    {
      "template": "Страусов было [32 - 10 = 22].",
      "blanks": [
        {
          "id": "1.11-b-7-0",
          "type": "expression",
          "accept": [
            "32 - 10 = 22"
          ]
        }
      ]
    },
    {
      "template": "Страусов больше на [22 - 10 = 12].",
      "blanks": [
        {
          "id": "1.11-b-8-0",
          "type": "expression",
          "accept": [
            "22 - 10 = 12"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [страусов больше на 12].",
      "blanks": [
        {
          "id": "1.11-b-9-0",
          "type": "conclusion",
          "accept": [
            "страусов больше на 12"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "1.13": [
    {
      "template": "Всего роботов [12], всего ног [39].",
      "blanks": [
        {
          "id": "1.13-b-0-0",
          "type": "number",
          "accept": [
            "12",
            12
          ]
        },
        {
          "id": "1.13-b-0-1",
          "type": "number",
          "accept": [
            "39",
            39
          ]
        }
      ]
    },
    {
      "template": "Представим, что все роботы — AT-ST (по [3] ноги).",
      "blanks": [
        {
          "id": "1.13-b-1-0",
          "type": "number",
          "accept": [
            "3",
            3
          ]
        }
      ]
    },
    {
      "template": "Тогда ног было бы [12 × 3 = 36].",
      "blanks": [
        {
          "id": "1.13-b-2-0",
          "type": "expression",
          "accept": [
            "12 × 3 = 36"
          ]
        }
      ]
    },
    {
      "template": "Лишних ног [39 − 36 = 3].",
      "blanks": [
        {
          "id": "1.13-b-3-0",
          "type": "expression",
          "accept": [
            "39 − 36 = 3"
          ]
        }
      ]
    },
    {
      "template": "Замена одного AT-ST на AT-AT добавляет [1] ногу.",
      "blanks": [
        {
          "id": "1.13-b-4-0",
          "type": "number",
          "accept": [
            "1",
            1
          ]
        }
      ]
    },
    {
      "template": "Роботов AT-AT [3 ÷ 1 = 3], роботов AT-ST [12 − 3 = 9].",
      "blanks": [
        {
          "id": "1.13-b-5-0",
          "type": "expression",
          "accept": [
            "3 ÷ 1 = 3"
          ]
        },
        {
          "id": "1.13-b-5-1",
          "type": "expression",
          "accept": [
            "12 − 3 = 9"
          ]
        }
      ]
    },
    {
      "template": "Проверка: [9×3 + 3×4 = 39] ног.",
      "blanks": [
        {
          "id": "1.13-b-6-0",
          "type": "expression",
          "accept": [
            "9×3 + 3×4 = 39"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [9 роботов AT-ST и 3 робота AT-AT].",
      "blanks": [
        {
          "id": "1.13-b-7-0",
          "type": "expression",
          "accept": [
            "9 роботов AT-ST и 3 робота AT-AT"
          ]
        }
      ]
    }
  ],
  "1.14": [
    {
      "template": "На [22] предмета сели [22] человека.",
      "blanks": [
        {
          "id": "1.14-b-0-0",
          "type": "number",
          "accept": [
            "22",
            22
          ]
        },
        {
          "id": "1.14-b-0-1",
          "type": "number",
          "accept": [
            "22",
            22
          ]
        }
      ]
    },
    {
      "template": "У людей вместе было [22 x 2 = 44] ноги.",
      "blanks": [
        {
          "id": "1.14-b-1-0",
          "type": "expression",
          "accept": [
            "22 x 2 = 44"
          ]
        }
      ]
    },
    {
      "template": "Значит, у стульев и табуреток было [120 - 44 = 76] ног.",
      "blanks": [
        {
          "id": "1.14-b-2-0",
          "type": "expression",
          "accept": [
            "120 - 44 = 76"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Представим, что все [22] предмета были [трёхногими табуретками].",
      "blanks": [
        {
          "id": "1.14-b-3-0",
          "type": "number",
          "accept": [
            "22",
            22
          ]
        },
        {
          "id": "1.14-b-3-1",
          "type": "conclusion",
          "accept": [
            "трёхногими табуретками"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Тогда ног у мебели было бы [22 x 3 = 66].",
      "blanks": [
        {
          "id": "1.14-b-4-0",
          "type": "expression",
          "accept": [
            "22 x 3 = 66"
          ]
        }
      ]
    },
    {
      "template": "По расчету ног мебели [76].",
      "blanks": [
        {
          "id": "1.14-b-5-0",
          "type": "number",
          "accept": [
            "76",
            76
          ]
        }
      ]
    },
    {
      "template": "Лишних ног [76 - 66 = 10].",
      "blanks": [
        {
          "id": "1.14-b-6-0",
          "type": "expression",
          "accept": [
            "76 - 66 = 10"
          ]
        }
      ]
    },
    {
      "template": "Один стул добавляет [4 - 3 = 1] ногу.",
      "blanks": [
        {
          "id": "1.14-b-7-0",
          "type": "expression",
          "accept": [
            "4 - 3 = 1"
          ]
        }
      ]
    },
    {
      "template": "Стульев было [10].",
      "blanks": [
        {
          "id": "1.14-b-8-0",
          "type": "number",
          "accept": [
            "10",
            10
          ]
        }
      ]
    },
    {
      "template": "Табуреток было [22 - 10 = 12].",
      "blanks": [
        {
          "id": "1.14-b-9-0",
          "type": "expression",
          "accept": [
            "22 - 10 = 12"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [12 табуреток и 10 стульев].",
      "blanks": [
        {
          "id": "1.14-b-10-0",
          "type": "conclusion",
          "accept": [
            "12 табуреток и 10 стульев"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "2.1": [
    {
      "template": "Представим, что все клумбы были около [Гимназии].",
      "blanks": [
        {
          "id": "2.1-b-0-0",
          "type": "object",
          "accept": [
            "Гимназии"
          ]
        }
      ]
    },
    {
      "template": "Тогда цветков было бы [11 x 19 = 209].",
      "blanks": [
        {
          "id": "2.1-b-1-0",
          "type": "expression",
          "accept": [
            "11 x 19 = 209"
          ]
        }
      ]
    },
    {
      "template": "По условию цветков [225].",
      "blanks": [
        {
          "id": "2.1-b-2-0",
          "type": "number",
          "accept": [
            "225",
            225
          ]
        }
      ]
    },
    {
      "template": "Лишних цветков [225 - 209 = 16].",
      "blanks": [
        {
          "id": "2.1-b-3-0",
          "type": "expression",
          "accept": [
            "225 - 209 = 16"
          ]
        }
      ]
    },
    {
      "template": "Одна клумба около Лицея добавляет [23 - 19 = 4] цветка.",
      "blanks": [
        {
          "id": "2.1-b-4-0",
          "type": "expression",
          "accept": [
            "23 - 19 = 4"
          ]
        }
      ]
    },
    {
      "template": "Клумб около Лицея было [16 ÷ 4 = 4].",
      "blanks": [
        {
          "id": "2.1-b-5-0",
          "type": "expression",
          "accept": [
            "16 ÷ 4 = 4"
          ]
        }
      ]
    },
    {
      "template": "Клумб около Гимназии было [11 - 4 = 7].",
      "blanks": [
        {
          "id": "2.1-b-6-0",
          "type": "expression",
          "accept": [
            "11 - 4 = 7"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [4 клумбы около Лицея и 7 клумб около Гимназии].",
      "blanks": [
        {
          "id": "2.1-b-7-0",
          "type": "conclusion",
          "accept": [
            "4 клумбы около Лицея и 7 клумб около Гимназии"
          ]
        }
      ]
    }
  ],
  "2.2": [
    {
      "template": "Представим, что все [20] коробок были [маленькими].",
      "blanks": [
        {
          "id": "2.2-b-0-0",
          "type": "number",
          "accept": [
            "20",
            20
          ]
        },
        {
          "id": "2.2-b-0-1",
          "type": "object",
          "accept": [
            "маленькими"
          ]
        }
      ]
    },
    {
      "template": "Тогда карандашей было бы [20 x 6 = 120].",
      "blanks": [
        {
          "id": "2.2-b-1-0",
          "type": "expression",
          "accept": [
            "20 x 6 = 120"
          ]
        }
      ]
    },
    {
      "template": "По условию карандашей [210].",
      "blanks": [
        {
          "id": "2.2-b-2-0",
          "type": "number",
          "accept": [
            "210",
            210
          ]
        }
      ]
    },
    {
      "template": "Лишних карандашей [210 - 120 = 90].",
      "blanks": [
        {
          "id": "2.2-b-3-0",
          "type": "expression",
          "accept": [
            "210 - 120 = 90"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Одна большая коробка добавляет [12 - 6 = 6] карандашей.",
      "blanks": [
        {
          "id": "2.2-b-4-0",
          "type": "expression",
          "accept": [
            "12 - 6 = 6"
          ]
        }
      ]
    },
    {
      "template": "Больших коробок было [90 ÷ 6 = 15].",
      "blanks": [
        {
          "id": "2.2-b-5-0",
          "type": "expression",
          "accept": [
            "90 ÷ 6 = 15"
          ]
        }
      ]
    },
    {
      "template": "Маленьких коробок было [20 - 15 = 5].",
      "blanks": [
        {
          "id": "2.2-b-6-0",
          "type": "expression",
          "accept": [
            "20 - 15 = 5"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [15 больших коробок и 5 маленьких].",
      "blanks": [
        {
          "id": "2.2-b-7-0",
          "type": "conclusion",
          "accept": [
            "15 больших коробок и 5 маленьких"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "2.3": [
    {
      "template": "Представим, что все [138] дронов были [дронами-пастухами].",
      "blanks": [
        {
          "id": "2.3-b-0-0",
          "type": "number",
          "accept": [
            "138",
            138
          ]
        },
        {
          "id": "2.3-b-0-1",
          "type": "expression",
          "accept": [
            "дронами-пастухами"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Тогда покупка стоила бы [138 x 3 = 414] кредитов.",
      "blanks": [
        {
          "id": "2.3-b-1-0",
          "type": "expression",
          "accept": [
            "138 x 3 = 414"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "По условию заплатили [540] кредитов.",
      "blanks": [
        {
          "id": "2.3-b-2-0",
          "type": "number",
          "accept": [
            "540",
            540
          ]
        }
      ]
    },
    {
      "template": "Лишних кредитов [540 - 414 = 126].",
      "blanks": [
        {
          "id": "2.3-b-3-0",
          "type": "expression",
          "accept": [
            "540 - 414 = 126"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Один дрон-рабочий дороже на [5 - 3 = 2] кредита.",
      "blanks": [
        {
          "id": "2.3-b-4-0",
          "type": "expression",
          "accept": [
            "5 - 3 = 2"
          ]
        }
      ]
    },
    {
      "template": "Дронов-рабочих было [126 ÷ 2 = 63].",
      "blanks": [
        {
          "id": "2.3-b-5-0",
          "type": "expression",
          "accept": [
            "126 ÷ 2 = 63"
          ]
        }
      ]
    },
    {
      "template": "Дронов-пастухов было [138 - 63 = 75].",
      "blanks": [
        {
          "id": "2.3-b-6-0",
          "type": "expression",
          "accept": [
            "138 - 63 = 75"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Ответ: [63 дрона-рабочих и 75 дронов-пастухов].",
      "blanks": [
        {
          "id": "2.3-b-7-0",
          "type": "expression",
          "accept": [
            "63 дрона-рабочих и 75 дронов-пастухов"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "2.4": [
    {
      "template": "Представим, что все [45] пирожных стоили [100] рублей.",
      "blanks": [
        {
          "id": "2.4-b-0-0",
          "type": "number",
          "accept": [
            "45",
            45
          ]
        },
        {
          "id": "2.4-b-0-1",
          "type": "number",
          "accept": [
            "100",
            100
          ]
        }
      ]
    },
    {
      "template": "Тогда получили бы [45 x 100 = 4500] рублей.",
      "blanks": [
        {
          "id": "2.4-b-1-0",
          "type": "expression",
          "accept": [
            "45 x 100 = 4500"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "По условию получили [5000] рублей.",
      "blanks": [
        {
          "id": "2.4-b-2-0",
          "type": "number",
          "accept": [
            "5000",
            5000
          ]
        }
      ]
    },
    {
      "template": "Лишних рублей [5000 - 4500 = 500].",
      "blanks": [
        {
          "id": "2.4-b-3-0",
          "type": "expression",
          "accept": [
            "5000 - 4500 = 500"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Одно пирожное за 125 рублей дороже на [125 - 100 = 25] рублей.",
      "blanks": [
        {
          "id": "2.4-b-4-0",
          "type": "expression",
          "accept": [
            "125 - 100 = 25"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Пирожных по 125 рублей было [500 ÷ 25 = 20].",
      "blanks": [
        {
          "id": "2.4-b-5-0",
          "type": "expression",
          "accept": [
            "500 ÷ 25 = 20"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Ответ: [20 пирожных по 125 рублей].",
      "blanks": [
        {
          "id": "2.4-b-6-0",
          "type": "conclusion",
          "accept": [
            "20 пирожных по 125 рублей"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "2.5": [
    {
      "template": "Представим, что все [32] коробки были с [цветными] карандашами.",
      "blanks": [
        {
          "id": "2.5-b-0-0",
          "type": "number",
          "accept": [
            "32",
            32
          ]
        },
        {
          "id": "2.5-b-0-1",
          "type": "object",
          "accept": [
            "цветными"
          ]
        }
      ]
    },
    {
      "template": "Тогда карандашей было бы [32 x 16 = 512].",
      "blanks": [
        {
          "id": "2.5-b-1-0",
          "type": "expression",
          "accept": [
            "32 x 16 = 512"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "По условию карандашей [580].",
      "blanks": [
        {
          "id": "2.5-b-2-0",
          "type": "number",
          "accept": [
            "580",
            580
          ]
        }
      ]
    },
    {
      "template": "Лишних карандашей [580 - 512 = 68].",
      "blanks": [
        {
          "id": "2.5-b-3-0",
          "type": "expression",
          "accept": [
            "580 - 512 = 68"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Одна коробка простых карандашей добавляет [20 - 16 = 4] карандаша.",
      "blanks": [
        {
          "id": "2.5-b-4-0",
          "type": "expression",
          "accept": [
            "20 - 16 = 4"
          ]
        }
      ]
    },
    {
      "template": "Коробок с простыми карандашами было [68 ÷ 4 = 17].",
      "blanks": [
        {
          "id": "2.5-b-5-0",
          "type": "expression",
          "accept": [
            "68 ÷ 4 = 17"
          ]
        }
      ]
    },
    {
      "template": "В одной такой коробке [20] простых карандашей.",
      "blanks": [
        {
          "id": "2.5-b-6-0",
          "type": "number",
          "accept": [
            "20",
            20
          ]
        }
      ]
    },
    {
      "template": "Простых карандашей привезли [17 x 20 = 340].",
      "blanks": [
        {
          "id": "2.5-b-7-0",
          "type": "expression",
          "accept": [
            "17 x 20 = 340"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Ответ: [340 простых карандашей].",
      "blanks": [
        {
          "id": "2.5-b-8-0",
          "type": "conclusion",
          "accept": [
            "340 простых карандашей"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "2.6": [
    {
      "template": "Представим, что все [25] детёнышей были [тигрятами].",
      "blanks": [
        {
          "id": "2.6-b-0-0",
          "type": "number",
          "accept": [
            "25",
            25
          ]
        },
        {
          "id": "2.6-b-0-1",
          "type": "object",
          "accept": [
            "тигрятами"
          ]
        }
      ]
    },
    {
      "template": "Тогда котлет понадобилось бы [25 x 6 = 150].",
      "blanks": [
        {
          "id": "2.6-b-1-0",
          "type": "expression",
          "accept": [
            "25 x 6 = 150"
          ]
        }
      ]
    },
    {
      "template": "По условию котлет [210].",
      "blanks": [
        {
          "id": "2.6-b-2-0",
          "type": "number",
          "accept": [
            "210",
            210
          ]
        }
      ]
    },
    {
      "template": "Лишних котлет [210 - 150 = 60].",
      "blanks": [
        {
          "id": "2.6-b-3-0",
          "type": "expression",
          "accept": [
            "210 - 150 = 60"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Один львёнок получает на [10 - 6 = 4] котлеты больше.",
      "blanks": [
        {
          "id": "2.6-b-4-0",
          "type": "expression",
          "accept": [
            "10 - 6 = 4"
          ]
        }
      ]
    },
    {
      "template": "Львят было [60 ÷ 4 = 15].",
      "blanks": [
        {
          "id": "2.6-b-5-0",
          "type": "expression",
          "accept": [
            "60 ÷ 4 = 15"
          ]
        }
      ]
    },
    {
      "template": "Тигрят было [25 - 15 = 10].",
      "blanks": [
        {
          "id": "2.6-b-6-0",
          "type": "expression",
          "accept": [
            "25 - 15 = 10"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [10 тигрят].",
      "blanks": [
        {
          "id": "2.6-b-7-0",
          "type": "object",
          "accept": [
            "10 тигрят"
          ]
        }
      ]
    }
  ],
  "2.7": [
    {
      "template": "Представим, что все [10] животных были [кошками].",
      "blanks": [
        {
          "id": "2.7-b-0-0",
          "type": "number",
          "accept": [
            "10",
            10
          ]
        },
        {
          "id": "2.7-b-0-1",
          "type": "object",
          "accept": [
            "кошками"
          ]
        }
      ]
    },
    {
      "template": "Тогда сосисок понадобилось бы [10 x 5 = 50].",
      "blanks": [
        {
          "id": "2.7-b-1-0",
          "type": "expression",
          "accept": [
            "10 x 5 = 50"
          ]
        }
      ]
    },
    {
      "template": "По условию сосисок [56].",
      "blanks": [
        {
          "id": "2.7-b-2-0",
          "type": "number",
          "accept": [
            "56",
            56
          ]
        }
      ]
    },
    {
      "template": "Лишних сосисок [56 - 50 = 6].",
      "blanks": [
        {
          "id": "2.7-b-3-0",
          "type": "expression",
          "accept": [
            "56 - 50 = 6"
          ]
        }
      ]
    },
    {
      "template": "Одна собака получает на [6 - 5 = 1] сосиску больше.",
      "blanks": [
        {
          "id": "2.7-b-4-0",
          "type": "expression",
          "accept": [
            "6 - 5 = 1"
          ]
        }
      ]
    },
    {
      "template": "Собак было [6 ÷ 1 = 6].",
      "blanks": [
        {
          "id": "2.7-b-5-0",
          "type": "expression",
          "accept": [
            "6 ÷ 1 = 6"
          ]
        }
      ]
    },
    {
      "template": "Кошек было [10 - 6 = 4].",
      "blanks": [
        {
          "id": "2.7-b-6-0",
          "type": "expression",
          "accept": [
            "10 - 6 = 4"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [6 собак и 4 кошки].",
      "blanks": [
        {
          "id": "2.7-b-7-0",
          "type": "object",
          "accept": [
            "6 собак и 4 кошки"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "3.1": [
    {
      "template": "Всего было проверено [42] задачи.",
      "blanks": [
        {
          "id": "3.1-b-0-0",
          "type": "number",
          "accept": [
            "42",
            42
          ]
        }
      ]
    },
    {
      "template": "Один третьеклассник решил [3] задачи, а один пятиклассник — [5] задач.",
      "blanks": [
        {
          "id": "3.1-b-1-0",
          "type": "number",
          "accept": [
            "3",
            3
          ]
        },
        {
          "id": "3.1-b-1-1",
          "type": "number",
          "accept": [
            "5",
            5
          ]
        }
      ]
    },
    {
      "template": "В условии не сказано, сколько всего было [учеников].",
      "blanks": [
        {
          "id": "3.1-b-2-0",
          "type": "object",
          "accept": [
            "учеников"
          ]
        }
      ]
    },
    {
      "template": "При этом по смыслу участвовали и [третьеклассники], и [пятиклассники], поэтому количество каждого вида должно быть больше [0].",
      "blanks": [
        {
          "id": "3.1-b-3-0",
          "type": "object",
          "accept": [
            "третьеклассники"
          ],
          "placeholder": "…"
        },
        {
          "id": "3.1-b-3-1",
          "type": "object",
          "accept": [
            "пятиклассники"
          ],
          "placeholder": "…"
        },
        {
          "id": "3.1-b-3-2",
          "type": "number",
          "accept": [
            "0",
            0
          ]
        }
      ]
    },
    {
      "template": "Можно получить разные положительные варианты: [9 третьеклассников и 3 пятиклассника], потому что [9 x 3 + 3 x 5 = 42].",
      "blanks": [
        {
          "id": "3.1-b-4-0",
          "type": "conclusion",
          "accept": [
            "9 третьеклассников и 3 пятиклассника"
          ],
          "placeholder": "…"
        },
        {
          "id": "3.1-b-4-1",
          "type": "expression",
          "accept": [
            "9 x 3 + 3 x 5 = 42"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Можно также получить вариант: [4 третьеклассника и 6 пятиклассников], потому что [4 x 3 + 6 x 5 = 42].",
      "blanks": [
        {
          "id": "3.1-b-5-0",
          "type": "conclusion",
          "accept": [
            "4 третьеклассника и 6 пятиклассников"
          ],
          "placeholder": "…"
        },
        {
          "id": "3.1-b-5-1",
          "type": "expression",
          "accept": [
            "4 x 3 + 6 x 5 = 42"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Значит, единственный ответ найти [нельзя].",
      "blanks": [
        {
          "id": "3.1-b-6-0",
          "type": "conclusion",
          "accept": [
            "нельзя"
          ]
        }
      ]
    },
    {
      "template": "Чтобы задача стала обычной, нужно добавить условие: [сколько всего учеников участвовало].",
      "blanks": [
        {
          "id": "3.1-b-7-0",
          "type": "conclusion",
          "accept": [
            "сколько всего учеников участвовало"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "3.2": [
    {
      "template": "Всего пирожков было [9 x 2 = 18].",
      "blanks": [
        {
          "id": "3.2-b-0-0",
          "type": "expression",
          "accept": [
            "9 x 2 = 18"
          ]
        }
      ]
    },
    {
      "template": "Одна девочка испекла [3] пирожка, а один мальчик — [4] пирожка.",
      "blanks": [
        {
          "id": "3.2-b-1-0",
          "type": "number",
          "accept": [
            "3",
            3
          ]
        },
        {
          "id": "3.2-b-1-1",
          "type": "number",
          "accept": [
            "4",
            4
          ]
        }
      ]
    },
    {
      "template": "По условию участвовали и [девочки], и [мальчики], значит каждого вида было больше [0].",
      "blanks": [
        {
          "id": "3.2-b-2-0",
          "type": "object",
          "accept": [
            "девочки"
          ]
        },
        {
          "id": "3.2-b-2-1",
          "type": "object",
          "accept": [
            "мальчики"
          ]
        },
        {
          "id": "3.2-b-2-2",
          "type": "number",
          "accept": [
            "0",
            0
          ]
        }
      ]
    },
    {
      "template": "Проверим число мальчиков.",
      "blanks": []
    },
    {
      "template": "Если мальчиков [1], то они испекли [4] пирожка, осталось [18 - 4 = 14], а [14] не делится на [3].",
      "blanks": [
        {
          "id": "3.2-b-4-0",
          "type": "number",
          "accept": [
            "1",
            1
          ]
        },
        {
          "id": "3.2-b-4-1",
          "type": "number",
          "accept": [
            "4",
            4
          ]
        },
        {
          "id": "3.2-b-4-2",
          "type": "expression",
          "accept": [
            "18 - 4 = 14"
          ]
        },
        {
          "id": "3.2-b-4-3",
          "type": "number",
          "accept": [
            "14",
            14
          ]
        },
        {
          "id": "3.2-b-4-4",
          "type": "number",
          "accept": [
            "3",
            3
          ]
        }
      ]
    },
    {
      "template": "Если мальчиков [2], то они испекли [8] пирожков, осталось [10], а [10] не делится на [3].",
      "blanks": [
        {
          "id": "3.2-b-5-0",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        },
        {
          "id": "3.2-b-5-1",
          "type": "number",
          "accept": [
            "8",
            8
          ]
        },
        {
          "id": "3.2-b-5-2",
          "type": "number",
          "accept": [
            "10",
            10
          ]
        },
        {
          "id": "3.2-b-5-3",
          "type": "number",
          "accept": [
            "10",
            10
          ]
        },
        {
          "id": "3.2-b-5-4",
          "type": "number",
          "accept": [
            "3",
            3
          ]
        }
      ]
    },
    {
      "template": "Если мальчиков [3], то они испекли [12] пирожков, осталось [6], значит девочек было [6 ÷ 3 = 2].",
      "blanks": [
        {
          "id": "3.2-b-6-0",
          "type": "number",
          "accept": [
            "3",
            3
          ]
        },
        {
          "id": "3.2-b-6-1",
          "type": "number",
          "accept": [
            "12",
            12
          ]
        },
        {
          "id": "3.2-b-6-2",
          "type": "number",
          "accept": [
            "6",
            6
          ]
        },
        {
          "id": "3.2-b-6-3",
          "type": "expression",
          "accept": [
            "6 ÷ 3 = 2"
          ]
        }
      ]
    },
    {
      "template": "Проверка: [2 x 3 + 3 x 4 = 6 + 12 = 18].",
      "blanks": [
        {
          "id": "3.2-b-7-0",
          "type": "expression",
          "accept": [
            "2 x 3 + 3 x 4 = 6 + 12 = 18"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Значит, было [2] девочки и [3] мальчика.",
      "blanks": [
        {
          "id": "3.2-b-8-0",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        },
        {
          "id": "3.2-b-8-1",
          "type": "number",
          "accept": [
            "3",
            3
          ]
        }
      ]
    },
    {
      "template": "Ответ: [3 мальчика и 2 девочки].",
      "blanks": [
        {
          "id": "3.2-b-9-0",
          "type": "conclusion",
          "accept": [
            "3 мальчика и 2 девочки"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "3.3": [
    {
      "template": "Представим, что все [30] учеников были [мальчиками].",
      "blanks": [
        {
          "id": "3.3-b-0-0",
          "type": "number",
          "accept": [
            "30",
            30
          ]
        },
        {
          "id": "3.3-b-0-1",
          "type": "object",
          "accept": [
            "мальчиками"
          ]
        }
      ]
    },
    {
      "template": "Тогда конфет понадобилось бы [30 x 2 = 60].",
      "blanks": [
        {
          "id": "3.3-b-1-0",
          "type": "expression",
          "accept": [
            "30 x 2 = 60"
          ]
        }
      ]
    },
    {
      "template": "По условию конфет [75].",
      "blanks": [
        {
          "id": "3.3-b-2-0",
          "type": "number",
          "accept": [
            "75",
            75
          ]
        }
      ]
    },
    {
      "template": "Лишних конфет [75 - 60 = 15].",
      "blanks": [
        {
          "id": "3.3-b-3-0",
          "type": "expression",
          "accept": [
            "75 - 60 = 15"
          ]
        }
      ]
    },
    {
      "template": "Одна девочка получает на [3 - 2 = 1] конфету больше.",
      "blanks": [
        {
          "id": "3.3-b-4-0",
          "type": "expression",
          "accept": [
            "3 - 2 = 1"
          ]
        }
      ]
    },
    {
      "template": "Девочек было [15 ÷ 1 = 15].",
      "blanks": [
        {
          "id": "3.3-b-5-0",
          "type": "expression",
          "accept": [
            "15 ÷ 1 = 15"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [15 девочек].",
      "blanks": [
        {
          "id": "3.3-b-6-0",
          "type": "object",
          "accept": [
            "15 девочек"
          ]
        }
      ]
    }
  ],
  "3.4": [
    {
      "template": "Представим, что все [30] детей были [мальчиками].",
      "blanks": [
        {
          "id": "3.4-b-0-0",
          "type": "number",
          "accept": [
            "30",
            30
          ]
        },
        {
          "id": "3.4-b-0-1",
          "type": "object",
          "accept": [
            "мальчиками"
          ]
        }
      ]
    },
    {
      "template": "Тогда снежинок было бы [30 x 15 = 450].",
      "blanks": [
        {
          "id": "3.4-b-1-0",
          "type": "expression",
          "accept": [
            "30 x 15 = 450"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "По условию снежинок [530].",
      "blanks": [
        {
          "id": "3.4-b-2-0",
          "type": "number",
          "accept": [
            "530",
            530
          ]
        }
      ]
    },
    {
      "template": "Лишних снежинок [530 - 450 = 80].",
      "blanks": [
        {
          "id": "3.4-b-3-0",
          "type": "expression",
          "accept": [
            "530 - 450 = 80"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Одна девочка вырезает на [19 - 15 = 4] снежинки больше.",
      "blanks": [
        {
          "id": "3.4-b-4-0",
          "type": "expression",
          "accept": [
            "19 - 15 = 4"
          ]
        }
      ]
    },
    {
      "template": "Девочек было [80 ÷ 4 = 20].",
      "blanks": [
        {
          "id": "3.4-b-5-0",
          "type": "expression",
          "accept": [
            "80 ÷ 4 = 20"
          ]
        }
      ]
    },
    {
      "template": "Мальчиков было [30 - 20 = 10].",
      "blanks": [
        {
          "id": "3.4-b-6-0",
          "type": "expression",
          "accept": [
            "30 - 20 = 10"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [10 мальчиков и 20 девочек].",
      "blanks": [
        {
          "id": "3.4-b-7-0",
          "type": "conclusion",
          "accept": [
            "10 мальчиков и 20 девочек"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "3.5": [
    {
      "template": "Представим, что все [34] охотника были [котятами].",
      "blanks": [
        {
          "id": "3.5-b-0-0",
          "type": "number",
          "accept": [
            "34",
            34
          ]
        },
        {
          "id": "3.5-b-0-1",
          "type": "object",
          "accept": [
            "котятами"
          ]
        }
      ]
    },
    {
      "template": "Тогда они поймали бы [34 x 4 = 136] мышек.",
      "blanks": [
        {
          "id": "3.5-b-1-0",
          "type": "expression",
          "accept": [
            "34 x 4 = 136"
          ]
        }
      ]
    },
    {
      "template": "По условию поймали [172] мышки.",
      "blanks": [
        {
          "id": "3.5-b-2-0",
          "type": "number",
          "accept": [
            "172",
            172
          ]
        }
      ]
    },
    {
      "template": "Лишних мышек [172 - 136 = 36].",
      "blanks": [
        {
          "id": "3.5-b-3-0",
          "type": "expression",
          "accept": [
            "172 - 136 = 36"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Один совёнок ловит на [7 - 4 = 3] мышки больше.",
      "blanks": [
        {
          "id": "3.5-b-4-0",
          "type": "expression",
          "accept": [
            "7 - 4 = 3"
          ]
        }
      ]
    },
    {
      "template": "Совят было [36 ÷ 3 = 12].",
      "blanks": [
        {
          "id": "3.5-b-5-0",
          "type": "expression",
          "accept": [
            "36 ÷ 3 = 12"
          ]
        }
      ]
    },
    {
      "template": "Котят было [34 - 12 = 22].",
      "blanks": [
        {
          "id": "3.5-b-6-0",
          "type": "expression",
          "accept": [
            "34 - 12 = 22"
          ]
        }
      ]
    },
    {
      "template": "Совята поймали [12 x 7 = 84] мышки.",
      "blanks": [
        {
          "id": "3.5-b-7-0",
          "type": "expression",
          "accept": [
            "12 x 7 = 84"
          ]
        }
      ]
    },
    {
      "template": "Котята поймали [22 x 4 = 88] мышек.",
      "blanks": [
        {
          "id": "3.5-b-8-0",
          "type": "expression",
          "accept": [
            "22 x 4 = 88"
          ]
        }
      ]
    },
    {
      "template": "Котята поймали больше на [88 - 84 = 4] мышки.",
      "blanks": [
        {
          "id": "3.5-b-9-0",
          "type": "expression",
          "accept": [
            "88 - 84 = 4"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [котята поймали на 4 мышки больше].",
      "blanks": [
        {
          "id": "3.5-b-10-0",
          "type": "conclusion",
          "accept": [
            "котята поймали на 4 мышки больше"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "3.6": [
    {
      "template": "Представим, что все [25] учеников были [мальчиками].",
      "blanks": [
        {
          "id": "3.6-b-0-0",
          "type": "number",
          "accept": [
            "25",
            25
          ]
        },
        {
          "id": "3.6-b-0-1",
          "type": "object",
          "accept": [
            "мальчиками"
          ]
        }
      ]
    },
    {
      "template": "Тогда они съели бы [25 x 3 = 75] конфет.",
      "blanks": [
        {
          "id": "3.6-b-1-0",
          "type": "expression",
          "accept": [
            "25 x 3 = 75"
          ]
        }
      ]
    },
    {
      "template": "По условию съели [95] конфет.",
      "blanks": [
        {
          "id": "3.6-b-2-0",
          "type": "number",
          "accept": [
            "95",
            95
          ]
        }
      ]
    },
    {
      "template": "Лишних конфет [95 - 75 = 20].",
      "blanks": [
        {
          "id": "3.6-b-3-0",
          "type": "expression",
          "accept": [
            "95 - 75 = 20"
          ]
        }
      ]
    },
    {
      "template": "Одна девочка съедает на [5 - 3 = 2] конфеты больше.",
      "blanks": [
        {
          "id": "3.6-b-4-0",
          "type": "expression",
          "accept": [
            "5 - 3 = 2"
          ]
        }
      ]
    },
    {
      "template": "Девочек было [20 ÷ 2 = 10].",
      "blanks": [
        {
          "id": "3.6-b-5-0",
          "type": "expression",
          "accept": [
            "20 ÷ 2 = 10"
          ]
        }
      ]
    },
    {
      "template": "Мальчиков было [25 - 10 = 15].",
      "blanks": [
        {
          "id": "3.6-b-6-0",
          "type": "expression",
          "accept": [
            "25 - 10 = 15"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [15 мальчиков и 10 девочек].",
      "blanks": [
        {
          "id": "3.6-b-7-0",
          "type": "conclusion",
          "accept": [
            "15 мальчиков и 10 девочек"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "3.7": [
    {
      "template": "Девочки собирали по [4] яблока, мальчики — по [6] яблок.",
      "blanks": [
        {
          "id": "3.7-b-0-0",
          "type": "number",
          "accept": [
            "4",
            4
          ]
        },
        {
          "id": "3.7-b-0-1",
          "type": "number",
          "accept": [
            "6",
            6
          ]
        }
      ]
    },
    {
      "template": "Всего было [26] яблок.",
      "blanks": [
        {
          "id": "3.7-b-1-0",
          "type": "number",
          "accept": [
            "26",
            26
          ]
        }
      ]
    },
    {
      "template": "Будем подбирать число мальчиков так, чтобы остаток делился на [4].",
      "blanks": [
        {
          "id": "3.7-b-2-0",
          "type": "number",
          "accept": [
            "4",
            4
          ]
        }
      ]
    },
    {
      "template": "Если мальчик был [1], то мальчики собрали [6] яблок, осталось [26 - 6 = 20], значит девочек [20 ÷ 4 = 5].",
      "blanks": [
        {
          "id": "3.7-b-3-0",
          "type": "number",
          "accept": [
            "1",
            1
          ]
        },
        {
          "id": "3.7-b-3-1",
          "type": "number",
          "accept": [
            "6",
            6
          ]
        },
        {
          "id": "3.7-b-3-2",
          "type": "expression",
          "accept": [
            "26 - 6 = 20"
          ]
        },
        {
          "id": "3.7-b-3-3",
          "type": "expression",
          "accept": [
            "20 ÷ 4 = 5"
          ]
        }
      ]
    },
    {
      "template": "Если мальчиков было [3], то мальчики собрали [18] яблок, осталось [26 - 18 = 8], значит девочек [8 ÷ 4 = 2].",
      "blanks": [
        {
          "id": "3.7-b-4-0",
          "type": "number",
          "accept": [
            "3",
            3
          ]
        },
        {
          "id": "3.7-b-4-1",
          "type": "number",
          "accept": [
            "18",
            18
          ]
        },
        {
          "id": "3.7-b-4-2",
          "type": "expression",
          "accept": [
            "26 - 18 = 8"
          ]
        },
        {
          "id": "3.7-b-4-3",
          "type": "expression",
          "accept": [
            "8 ÷ 4 = 2"
          ]
        }
      ]
    },
    {
      "template": "Других подходящих положительных вариантов нет.",
      "blanks": []
    },
    {
      "template": "Ответ: девочек могло быть [5] или [2].",
      "blanks": [
        {
          "id": "3.7-b-6-0",
          "type": "number",
          "accept": [
            "5",
            5
          ]
        },
        {
          "id": "3.7-b-6-1",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        }
      ]
    }
  ],
  "4.1": [
    {
      "template": "Представим, что все [10] примеров Петя решил [неверно].",
      "blanks": [
        {
          "id": "4.1-b-0-0",
          "type": "number",
          "accept": [
            "10",
            10
          ]
        },
        {
          "id": "4.1-b-0-1",
          "type": "object",
          "accept": [
            "неверно"
          ]
        }
      ]
    },
    {
      "template": "Тогда он получил бы [10 x (-1) = -10] баллов.",
      "blanks": [
        {
          "id": "4.1-b-1-0",
          "type": "expression",
          "accept": [
            "10 x (-1) = -10"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "По условию он получил [11] баллов.",
      "blanks": [
        {
          "id": "4.1-b-2-0",
          "type": "number",
          "accept": [
            "11",
            11
          ]
        }
      ]
    },
    {
      "template": "Нужно поднять результат на [11 - (-10) = 21] балл.",
      "blanks": [
        {
          "id": "4.1-b-3-0",
          "type": "expression",
          "accept": [
            "11 - (-10) = 21"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Замена неверного ответа на верный меняет счет на [2 - (-1) = 3] балла.",
      "blanks": [
        {
          "id": "4.1-b-4-0",
          "type": "expression",
          "accept": [
            "2 - (-1) = 3"
          ]
        }
      ]
    },
    {
      "template": "Верных ответов было [21 ÷ 3 = 7].",
      "blanks": [
        {
          "id": "4.1-b-5-0",
          "type": "expression",
          "accept": [
            "21 ÷ 3 = 7"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [7 примеров Петя решил правильно].",
      "blanks": [
        {
          "id": "4.1-b-6-0",
          "type": "conclusion",
          "accept": [
            "7 примеров Петя решил правильно"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "4.2": [
    {
      "template": "Представим, что все [10] учеников получили [2].",
      "blanks": [
        {
          "id": "4.2-b-0-0",
          "type": "number",
          "accept": [
            "10",
            10
          ]
        },
        {
          "id": "4.2-b-0-1",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        }
      ]
    },
    {
      "template": "Тогда сумма оценок была бы [10 x 2 = 20].",
      "blanks": [
        {
          "id": "4.2-b-1-0",
          "type": "expression",
          "accept": [
            "10 x 2 = 20"
          ]
        }
      ]
    },
    {
      "template": "По условию сумма оценок [27].",
      "blanks": [
        {
          "id": "4.2-b-2-0",
          "type": "number",
          "accept": [
            "27",
            27
          ]
        }
      ]
    },
    {
      "template": "Не хватает [27 - 20 = 7].",
      "blanks": [
        {
          "id": "4.2-b-3-0",
          "type": "expression",
          "accept": [
            "27 - 20 = 7"
          ]
        }
      ]
    },
    {
      "template": "Одна тройка добавляет [3 - 2 = 1] балл к сумме.",
      "blanks": [
        {
          "id": "4.2-b-4-0",
          "type": "expression",
          "accept": [
            "3 - 2 = 1"
          ]
        }
      ]
    },
    {
      "template": "Троек было [7].",
      "blanks": [
        {
          "id": "4.2-b-5-0",
          "type": "number",
          "accept": [
            "7",
            7
          ]
        }
      ]
    },
    {
      "template": "Двоек было [10 - 7 = 3].",
      "blanks": [
        {
          "id": "4.2-b-6-0",
          "type": "expression",
          "accept": [
            "10 - 7 = 3"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [3 ученика получили 2].",
      "blanks": [
        {
          "id": "4.2-b-7-0",
          "type": "object",
          "accept": [
            "3 ученика получили 2"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "4.3": [
    {
      "template": "Представим, что все [12] девочек получили по [2] открытки.",
      "blanks": [
        {
          "id": "4.3-b-0-0",
          "type": "number",
          "accept": [
            "12",
            12
          ]
        },
        {
          "id": "4.3-b-0-1",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        }
      ]
    },
    {
      "template": "Тогда открыток было бы: [12 × 2 = 24].",
      "blanks": [
        {
          "id": "4.3-b-1-0",
          "type": "expression",
          "accept": [
            "12 × 2 = 24",
            "12 x 2 = 24"
          ]
        }
      ]
    },
    {
      "template": "По условию открыток [25].",
      "blanks": [
        {
          "id": "4.3-b-2-0",
          "type": "number",
          "accept": [
            "25",
            25
          ]
        }
      ]
    },
    {
      "template": "Разница: [25 − 24 = 1].",
      "blanks": [
        {
          "id": "4.3-b-3-0",
          "type": "expression",
          "accept": [
            "25 − 24 = 1",
            "25 - 24 = 1"
          ]
        }
      ]
    },
    {
      "template": "Девочка с 3 открытками получает на [3 − 2 = 1] открытку больше.",
      "blanks": [
        {
          "id": "4.3-b-4-0",
          "type": "expression",
          "accept": [
            "3 − 2 = 1",
            "3 - 2 = 1"
          ]
        }
      ]
    },
    {
      "template": "Значит, по 3 открытки получила [1 ÷ 1 = 1] девочка.",
      "blanks": [
        {
          "id": "4.3-b-5-0",
          "type": "expression",
          "accept": [
            "1 ÷ 1 = 1",
            "1 / 1 = 1"
          ]
        }
      ]
    }
  ],
  "4.4": [
    {
      "template": "Если в матче есть победитель, то вместе команды получают [4 + 1 = 5] очков.",
      "blanks": [
        {
          "id": "4.4-b-0-0",
          "type": "expression",
          "accept": [
            "4 + 1 = 5"
          ]
        }
      ]
    },
    {
      "template": "Если ничья, то вместе команды получают [2 + 2 = 4] очка.",
      "blanks": [
        {
          "id": "4.4-b-1-0",
          "type": "expression",
          "accept": [
            "2 + 2 = 4"
          ]
        }
      ]
    },
    {
      "template": "Представим, что все [10] матчей закончились [не вничью].",
      "blanks": [
        {
          "id": "4.4-b-2-0",
          "type": "number",
          "accept": [
            "10",
            10
          ]
        },
        {
          "id": "4.4-b-2-1",
          "type": "object",
          "accept": [
            "не вничью"
          ]
        }
      ]
    },
    {
      "template": "Тогда команды набрали бы [10 x 5 = 50] очков.",
      "blanks": [
        {
          "id": "4.4-b-3-0",
          "type": "expression",
          "accept": [
            "10 x 5 = 50"
          ]
        }
      ]
    },
    {
      "template": "По условию они набрали [46] очков.",
      "blanks": [
        {
          "id": "4.4-b-4-0",
          "type": "number",
          "accept": [
            "46",
            46
          ]
        }
      ]
    },
    {
      "template": "Нужно уменьшить результат на [50 - 46 = 4] очка.",
      "blanks": [
        {
          "id": "4.4-b-5-0",
          "type": "expression",
          "accept": [
            "50 - 46 = 4"
          ]
        }
      ]
    },
    {
      "template": "Одна ничья уменьшает общий счет на [5 - 4 = 1] очко.",
      "blanks": [
        {
          "id": "4.4-b-6-0",
          "type": "expression",
          "accept": [
            "5 - 4 = 1"
          ]
        }
      ]
    },
    {
      "template": "Ничьих было [4 ÷ 1 = 4].",
      "blanks": [
        {
          "id": "4.4-b-7-0",
          "type": "expression",
          "accept": [
            "4 ÷ 1 = 4"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [4 ничьи].",
      "blanks": [
        {
          "id": "4.4-b-8-0",
          "type": "object",
          "accept": [
            "4 ничьи"
          ]
        }
      ]
    }
  ],
  "4.5": [
    {
      "template": "Представим, что все [30] ответов были [неправильными].",
      "blanks": [
        {
          "id": "4.5-b-0-0",
          "type": "number",
          "accept": [
            "30",
            30
          ]
        },
        {
          "id": "4.5-b-0-1",
          "type": "object",
          "accept": [
            "неправильными"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Тогда Вася получил бы [30 x (-12) = -360] баллов.",
      "blanks": [
        {
          "id": "4.5-b-1-0",
          "type": "expression",
          "accept": [
            "30 x (-12) = -360"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "По условию он получил [77] баллов.",
      "blanks": [
        {
          "id": "4.5-b-2-0",
          "type": "number",
          "accept": [
            "77",
            77
          ]
        }
      ]
    },
    {
      "template": "Нужно поднять результат на [77 - (-360) = 437] баллов.",
      "blanks": [
        {
          "id": "4.5-b-3-0",
          "type": "expression",
          "accept": [
            "77 - (-360) = 437"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Замена неправильного ответа на правильный меняет счет на [7 - (-12) = 19] баллов.",
      "blanks": [
        {
          "id": "4.5-b-4-0",
          "type": "expression",
          "accept": [
            "7 - (-12) = 19"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Правильных ответов было [437 ÷ 19 = 23].",
      "blanks": [
        {
          "id": "4.5-b-5-0",
          "type": "expression",
          "accept": [
            "437 ÷ 19 = 23"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Ответ: [23 верных ответа].",
      "blanks": [
        {
          "id": "4.5-b-6-0",
          "type": "object",
          "accept": [
            "23 верных ответа"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "5.1": [
    {
      "template": "У каждого животного [4] ноги, значит животных было [88 ÷ 4 = 22].",
      "blanks": [
        {
          "id": "5.1-b-0-0",
          "type": "number",
          "accept": [
            "4",
            4
          ]
        },
        {
          "id": "5.1-b-0-1",
          "type": "expression",
          "accept": [
            "88 ÷ 4 = 22"
          ]
        }
      ]
    },
    {
      "template": "У единорога [1] рог, у антилопы [2] рога.",
      "blanks": [
        {
          "id": "5.1-b-1-0",
          "type": "number",
          "accept": [
            "1",
            1
          ]
        },
        {
          "id": "5.1-b-1-1",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        }
      ]
    },
    {
      "template": "Представим, что все [22] животных были [единорогами].",
      "blanks": [
        {
          "id": "5.1-b-2-0",
          "type": "number",
          "accept": [
            "22",
            22
          ]
        },
        {
          "id": "5.1-b-2-1",
          "type": "object",
          "accept": [
            "единорогами"
          ]
        }
      ]
    },
    {
      "template": "Тогда рогов было бы [22 x 1 = 22].",
      "blanks": [
        {
          "id": "5.1-b-3-0",
          "type": "expression",
          "accept": [
            "22 x 1 = 22"
          ]
        }
      ]
    },
    {
      "template": "По условию рогов [35].",
      "blanks": [
        {
          "id": "5.1-b-4-0",
          "type": "number",
          "accept": [
            "35",
            35
          ]
        }
      ]
    },
    {
      "template": "Лишних рогов [35 - 22 = 13].",
      "blanks": [
        {
          "id": "5.1-b-5-0",
          "type": "expression",
          "accept": [
            "35 - 22 = 13"
          ]
        }
      ]
    },
    {
      "template": "Одна антилопа добавляет [2 - 1 = 1] рог.",
      "blanks": [
        {
          "id": "5.1-b-6-0",
          "type": "expression",
          "accept": [
            "2 - 1 = 1"
          ]
        }
      ]
    },
    {
      "template": "Антилоп было [13].",
      "blanks": [
        {
          "id": "5.1-b-7-0",
          "type": "number",
          "accept": [
            "13",
            13
          ]
        }
      ]
    },
    {
      "template": "Единорогов было [22 - 13 = 9].",
      "blanks": [
        {
          "id": "5.1-b-8-0",
          "type": "expression",
          "accept": [
            "22 - 13 = 9"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [9 единорогов].",
      "blanks": [
        {
          "id": "5.1-b-9-0",
          "type": "object",
          "accept": [
            "9 единорогов"
          ]
        }
      ]
    }
  ],
  "5.2": [
    {
      "template": "Всего по песку бредет [54] пары ног, то есть [54 x 2 = 108] ног.",
      "blanks": [
        {
          "id": "5.2-b-0-0",
          "type": "number",
          "accept": [
            "54",
            54
          ]
        },
        {
          "id": "5.2-b-0-1",
          "type": "expression",
          "accept": [
            "54 x 2 = 108"
          ]
        }
      ]
    },
    {
      "template": "В караване [44] головы.",
      "blanks": [
        {
          "id": "5.2-b-1-0",
          "type": "number",
          "accept": [
            "44",
            44
          ]
        }
      ]
    },
    {
      "template": "Представим, что все [44] головы принадлежали [Джавам].",
      "blanks": [
        {
          "id": "5.2-b-2-0",
          "type": "number",
          "accept": [
            "44",
            44
          ]
        },
        {
          "id": "5.2-b-2-1",
          "type": "object",
          "accept": [
            "Джавам"
          ]
        }
      ]
    },
    {
      "template": "Тогда ног было бы [44 x 2 = 88].",
      "blanks": [
        {
          "id": "5.2-b-3-0",
          "type": "expression",
          "accept": [
            "44 x 2 = 88"
          ]
        }
      ]
    },
    {
      "template": "По условию ног [108].",
      "blanks": [
        {
          "id": "5.2-b-4-0",
          "type": "number",
          "accept": [
            "108",
            108
          ]
        }
      ]
    },
    {
      "template": "Лишних ног [108 - 88 = 20].",
      "blanks": [
        {
          "id": "5.2-b-5-0",
          "type": "expression",
          "accept": [
            "108 - 88 = 20"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Одна Банта добавляет [4 - 2 = 2] ноги.",
      "blanks": [
        {
          "id": "5.2-b-6-0",
          "type": "expression",
          "accept": [
            "4 - 2 = 2"
          ]
        }
      ]
    },
    {
      "template": "Бант было [20 ÷ 2 = 10].",
      "blanks": [
        {
          "id": "5.2-b-7-0",
          "type": "expression",
          "accept": [
            "20 ÷ 2 = 10"
          ]
        }
      ]
    },
    {
      "template": "Джав было [44 - 10 = 34].",
      "blanks": [
        {
          "id": "5.2-b-8-0",
          "type": "expression",
          "accept": [
            "44 - 10 = 34"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [34 Джавы].",
      "blanks": [
        {
          "id": "5.2-b-9-0",
          "type": "object",
          "accept": [
            "34 Джавы"
          ]
        }
      ]
    }
  ],
  "5.3": [
    {
      "template": "Представим, что все [29] существ были [Ранкорами].",
      "blanks": [
        {
          "id": "5.3-b-0-0",
          "type": "number",
          "accept": [
            "29",
            29
          ]
        },
        {
          "id": "5.3-b-0-1",
          "type": "object",
          "accept": [
            "Ранкорами"
          ]
        }
      ]
    },
    {
      "template": "Тогда зубов было бы [29 x 8 = 232].",
      "blanks": [
        {
          "id": "5.3-b-1-0",
          "type": "expression",
          "accept": [
            "29 x 8 = 232"
          ]
        }
      ]
    },
    {
      "template": "По условию зубов [352].",
      "blanks": [
        {
          "id": "5.3-b-2-0",
          "type": "number",
          "accept": [
            "352",
            352
          ]
        }
      ]
    },
    {
      "template": "Лишних зубов [352 - 232 = 120].",
      "blanks": [
        {
          "id": "5.3-b-3-0",
          "type": "expression",
          "accept": [
            "352 - 232 = 120"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Одна Банта добавляет [18 - 8 = 10] зубов.",
      "blanks": [
        {
          "id": "5.3-b-4-0",
          "type": "expression",
          "accept": [
            "18 - 8 = 10"
          ]
        }
      ]
    },
    {
      "template": "Бант было [120 ÷ 10 = 12].",
      "blanks": [
        {
          "id": "5.3-b-5-0",
          "type": "expression",
          "accept": [
            "120 ÷ 10 = 12"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Ранкоров было [29 - 12 = 17].",
      "blanks": [
        {
          "id": "5.3-b-6-0",
          "type": "expression",
          "accept": [
            "29 - 12 = 17"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [17 Ранкоров и 12 Бант].",
      "blanks": [
        {
          "id": "5.3-b-7-0",
          "type": "conclusion",
          "accept": [
            "17 Ранкоров и 12 Бант"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "5.4": [
    {
      "template": "Представим, что все [76] кораблей были [имперскими истребителями].",
      "blanks": [
        {
          "id": "5.4-b-0-0",
          "type": "number",
          "accept": [
            "76",
            76
          ]
        },
        {
          "id": "5.4-b-0-1",
          "type": "conclusion",
          "accept": [
            "имперскими истребителями"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Тогда крыльев было бы [76 x 2 = 152].",
      "blanks": [
        {
          "id": "5.4-b-1-0",
          "type": "expression",
          "accept": [
            "76 x 2 = 152"
          ]
        }
      ]
    },
    {
      "template": "По условию крыльев [226].",
      "blanks": [
        {
          "id": "5.4-b-2-0",
          "type": "number",
          "accept": [
            "226",
            226
          ]
        }
      ]
    },
    {
      "template": "Лишних крыльев [226 - 152 = 74].",
      "blanks": [
        {
          "id": "5.4-b-3-0",
          "type": "expression",
          "accept": [
            "226 - 152 = 74"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Один X-Wing добавляет [4 - 2 = 2] крыла.",
      "blanks": [
        {
          "id": "5.4-b-4-0",
          "type": "expression",
          "accept": [
            "4 - 2 = 2"
          ]
        }
      ]
    },
    {
      "template": "X-Wing было [74 ÷ 2 = 37].",
      "blanks": [
        {
          "id": "5.4-b-5-0",
          "type": "expression",
          "accept": [
            "74 ÷ 2 = 37"
          ]
        }
      ]
    },
    {
      "template": "Имперских истребителей было [76 - 37 = 39].",
      "blanks": [
        {
          "id": "5.4-b-6-0",
          "type": "expression",
          "accept": [
            "76 - 37 = 39"
          ]
        }
      ]
    },
    {
      "template": "Имперских было больше на [39 - 37 = 2].",
      "blanks": [
        {
          "id": "5.4-b-7-0",
          "type": "expression",
          "accept": [
            "39 - 37 = 2"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [имперских истребителей больше на 2].",
      "blanks": [
        {
          "id": "5.4-b-8-0",
          "type": "conclusion",
          "accept": [
            "имперских истребителей больше на 2"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "5.5": [
    {
      "template": "У водолаза [4] конечности: [2] руки и [2] ноги.",
      "blanks": [
        {
          "id": "5.5-b-0-0",
          "type": "number",
          "accept": [
            "4",
            4
          ]
        },
        {
          "id": "5.5-b-0-1",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        },
        {
          "id": "5.5-b-0-2",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        }
      ]
    },
    {
      "template": "У осьминога [8] конечностей, и все они считаются [ногами].",
      "blanks": [
        {
          "id": "5.5-b-1-0",
          "type": "number",
          "accept": [
            "8",
            8
          ]
        },
        {
          "id": "5.5-b-1-1",
          "type": "object",
          "accept": [
            "ногами"
          ]
        }
      ]
    },
    {
      "template": "Всего конечностей [120], а ног [88].",
      "blanks": [
        {
          "id": "5.5-b-2-0",
          "type": "number",
          "accept": [
            "120",
            120
          ]
        },
        {
          "id": "5.5-b-2-1",
          "type": "number",
          "accept": [
            "88",
            88
          ]
        }
      ]
    },
    {
      "template": "Значит, рук видно [120 - 88 = 32].",
      "blanks": [
        {
          "id": "5.5-b-3-0",
          "type": "expression",
          "accept": [
            "120 - 88 = 32"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Руки есть только у [водолазов], у каждого водолаза [2] руки.",
      "blanks": [
        {
          "id": "5.5-b-4-0",
          "type": "object",
          "accept": [
            "водолазов"
          ]
        },
        {
          "id": "5.5-b-4-1",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        }
      ]
    },
    {
      "template": "Водолазов было [32 ÷ 2 = 16].",
      "blanks": [
        {
          "id": "5.5-b-5-0",
          "type": "expression",
          "accept": [
            "32 ÷ 2 = 16"
          ]
        }
      ]
    },
    {
      "template": "У водолазов ног [16 x 2 = 32].",
      "blanks": [
        {
          "id": "5.5-b-6-0",
          "type": "expression",
          "accept": [
            "16 x 2 = 32"
          ]
        }
      ]
    },
    {
      "template": "Ног осьминогов было [88 - 32 = 56].",
      "blanks": [
        {
          "id": "5.5-b-7-0",
          "type": "expression",
          "accept": [
            "88 - 32 = 56"
          ]
        }
      ]
    },
    {
      "template": "У одного осьминога [8] ног.",
      "blanks": [
        {
          "id": "5.5-b-8-0",
          "type": "number",
          "accept": [
            "8",
            8
          ]
        }
      ]
    },
    {
      "template": "Осьминогов было [56 ÷ 8 = 7].",
      "blanks": [
        {
          "id": "5.5-b-9-0",
          "type": "expression",
          "accept": [
            "56 ÷ 8 = 7"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [7 осьминогов].",
      "blanks": [
        {
          "id": "5.5-b-10-0",
          "type": "object",
          "accept": [
            "7 осьминогов"
          ]
        }
      ]
    }
  ],
  "5.6": [
    {
      "template": "На каждый меч нужна [1] рукоять, значит всего мечей было [17].",
      "blanks": [
        {
          "id": "5.6-b-0-0",
          "type": "number",
          "accept": [
            "1",
            1
          ]
        },
        {
          "id": "5.6-b-0-1",
          "type": "number",
          "accept": [
            "17",
            17
          ]
        }
      ]
    },
    {
      "template": "Представим, что все [17] мечей были [мечами Джедаев].",
      "blanks": [
        {
          "id": "5.6-b-1-0",
          "type": "number",
          "accept": [
            "17",
            17
          ]
        },
        {
          "id": "5.6-b-1-1",
          "type": "object",
          "accept": [
            "мечами Джедаев"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Тогда кристаллов понадобилось бы [17 x 1 = 17].",
      "blanks": [
        {
          "id": "5.6-b-2-0",
          "type": "expression",
          "accept": [
            "17 x 1 = 17"
          ]
        }
      ]
    },
    {
      "template": "По условию кристаллов [32].",
      "blanks": [
        {
          "id": "5.6-b-3-0",
          "type": "number",
          "accept": [
            "32",
            32
          ]
        }
      ]
    },
    {
      "template": "Лишних кристаллов [32 - 17 = 15].",
      "blanks": [
        {
          "id": "5.6-b-4-0",
          "type": "expression",
          "accept": [
            "32 - 17 = 15"
          ]
        }
      ]
    },
    {
      "template": "Один меч Ситхов добавляет [2 - 1 = 1] кристалл.",
      "blanks": [
        {
          "id": "5.6-b-5-0",
          "type": "expression",
          "accept": [
            "2 - 1 = 1"
          ]
        }
      ]
    },
    {
      "template": "Мечей Ситхов было [15].",
      "blanks": [
        {
          "id": "5.6-b-6-0",
          "type": "number",
          "accept": [
            "15",
            15
          ]
        }
      ]
    },
    {
      "template": "Мечей Джедаев было [17 - 15 = 2].",
      "blanks": [
        {
          "id": "5.6-b-7-0",
          "type": "expression",
          "accept": [
            "17 - 15 = 2"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [2 меча Джедаев].",
      "blanks": [
        {
          "id": "5.6-b-8-0",
          "type": "object",
          "accept": [
            "2 меча Джедаев"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "5.7": [
    {
      "template": "Пусть Ситхов было [1 часть].",
      "blanks": [
        {
          "id": "5.7-b-0-0",
          "type": "object",
          "accept": [
            "1 часть"
          ]
        }
      ]
    },
    {
      "template": "Тогда красных мечей они получили [4] части.",
      "blanks": [
        {
          "id": "5.7-b-1-0",
          "type": "number",
          "accept": [
            "4",
            4
          ]
        }
      ]
    },
    {
      "template": "Чтобы зеленых мечей было столько же, Джедаев должно быть [2] части, потому что каждый Джедай получает по [2] меча.",
      "blanks": [
        {
          "id": "5.7-b-2-0",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        },
        {
          "id": "5.7-b-2-1",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        }
      ]
    },
    {
      "template": "Значит, отношение Ситхи:Джедаи равно [1:2].",
      "blanks": [
        {
          "id": "5.7-b-3-0",
          "type": "object",
          "accept": [
            "1:2"
          ]
        }
      ]
    },
    {
      "template": "Всего частей [1 + 2 = 3].",
      "blanks": [
        {
          "id": "5.7-b-4-0",
          "type": "expression",
          "accept": [
            "1 + 2 = 3"
          ]
        }
      ]
    },
    {
      "template": "Всего падаванов [21].",
      "blanks": [
        {
          "id": "5.7-b-5-0",
          "type": "number",
          "accept": [
            "21",
            21
          ]
        }
      ]
    },
    {
      "template": "Одна часть равна [21 ÷ 3 = 7].",
      "blanks": [
        {
          "id": "5.7-b-6-0",
          "type": "expression",
          "accept": [
            "21 ÷ 3 = 7"
          ]
        }
      ]
    },
    {
      "template": "Ситхов было [7].",
      "blanks": [
        {
          "id": "5.7-b-7-0",
          "type": "number",
          "accept": [
            "7",
            7
          ]
        }
      ]
    },
    {
      "template": "Джедаев было [7 x 2 = 14].",
      "blanks": [
        {
          "id": "5.7-b-8-0",
          "type": "expression",
          "accept": [
            "7 x 2 = 14"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [7 Ситхов и 14 Джедаев].",
      "blanks": [
        {
          "id": "5.7-b-9-0",
          "type": "conclusion",
          "accept": [
            "7 Ситхов и 14 Джедаев"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "6.1": [
    {
      "template": "Адмиралов было в два раза меньше, чем дипломатов, значит можно объединить [1 базу с адмиралами] и [2 базы с дипломатами].",
      "blanks": [
        {
          "id": "6.1-b-0-0",
          "type": "object",
          "accept": [
            "1 базу с адмиралами"
          ],
          "placeholder": "…"
        },
        {
          "id": "6.1-b-0-1",
          "type": "object",
          "accept": [
            "2 базы с дипломатами"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Такая группа из [3] баз дает [15 + 17 + 17 = 49] пленников.",
      "blanks": [
        {
          "id": "6.1-b-1-0",
          "type": "number",
          "accept": [
            "3",
            3
          ]
        },
        {
          "id": "6.1-b-1-1",
          "type": "expression",
          "accept": [
            "15 + 17 + 17 = 49"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Если бы все [40] баз были с генералами, пленников было бы [40 x 12 = 480].",
      "blanks": [
        {
          "id": "6.1-b-2-0",
          "type": "number",
          "accept": [
            "40",
            40
          ]
        },
        {
          "id": "6.1-b-2-1",
          "type": "expression",
          "accept": [
            "40 x 12 = 480"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "По условию пленников [571].",
      "blanks": [
        {
          "id": "6.1-b-3-0",
          "type": "number",
          "accept": [
            "571",
            571
          ]
        }
      ]
    },
    {
      "template": "Лишних пленников [571 - 480 = 91].",
      "blanks": [
        {
          "id": "6.1-b-4-0",
          "type": "expression",
          "accept": [
            "571 - 480 = 91"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Одна группа «1 база с адмиралами и 2 базы с дипломатами» вместо 3 генеральских баз добавляет [49 - 3 x 12 = 13] пленников.",
      "blanks": [
        {
          "id": "6.1-b-5-0",
          "type": "expression",
          "accept": [
            "49 - 3 x 12 = 13"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Таких групп было [91 ÷ 13 = 7].",
      "blanks": [
        {
          "id": "6.1-b-6-0",
          "type": "expression",
          "accept": [
            "91 ÷ 13 = 7"
          ]
        }
      ]
    },
    {
      "template": "Баз с адмиралами было [7], баз с дипломатами было [14].",
      "blanks": [
        {
          "id": "6.1-b-7-0",
          "type": "number",
          "accept": [
            "7",
            7
          ]
        },
        {
          "id": "6.1-b-7-1",
          "type": "number",
          "accept": [
            "14",
            14
          ]
        }
      ]
    },
    {
      "template": "Баз с генералами было [40 - 7 - 14 = 19].",
      "blanks": [
        {
          "id": "6.1-b-8-0",
          "type": "expression",
          "accept": [
            "40 - 7 - 14 = 19"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Ответ: было захвачено [19 x 12 = 228] генералов, то есть [19 баз с генералами].",
      "blanks": [
        {
          "id": "6.1-b-9-0",
          "type": "expression",
          "accept": [
            "19 x 12 = 228"
          ],
          "placeholder": "…"
        },
        {
          "id": "6.1-b-9-1",
          "type": "object",
          "accept": [
            "19 баз с генералами"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "6.2": [
    {
      "template": "Дроидов-механиков и дроидов-медиков [поровну].",
      "blanks": [
        {
          "id": "6.2-b-0-0",
          "type": "object",
          "accept": [
            "поровну"
          ]
        }
      ]
    },
    {
      "template": "Объединим одного механика и одного медика в пару.",
      "blanks": []
    },
    {
      "template": "В такой паре [2] дроида и [8 + 3 = 11] рук.",
      "blanks": [
        {
          "id": "6.2-b-2-0",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        },
        {
          "id": "6.2-b-2-1",
          "type": "expression",
          "accept": [
            "8 + 3 = 11"
          ]
        }
      ]
    },
    {
      "template": "Представим, что все [92] дроида были [солдатами].",
      "blanks": [
        {
          "id": "6.2-b-3-0",
          "type": "number",
          "accept": [
            "92",
            92
          ]
        },
        {
          "id": "6.2-b-3-1",
          "type": "object",
          "accept": [
            "солдатами"
          ]
        }
      ]
    },
    {
      "template": "Тогда рук было бы [92 x 2 = 184].",
      "blanks": [
        {
          "id": "6.2-b-4-0",
          "type": "expression",
          "accept": [
            "92 x 2 = 184"
          ]
        }
      ]
    },
    {
      "template": "По условию рук [275].",
      "blanks": [
        {
          "id": "6.2-b-5-0",
          "type": "number",
          "accept": [
            "275",
            275
          ]
        }
      ]
    },
    {
      "template": "Лишних рук [275 - 184 = 91].",
      "blanks": [
        {
          "id": "6.2-b-6-0",
          "type": "expression",
          "accept": [
            "275 - 184 = 91"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Пара «механик + медик» вместо двух солдат добавляет [11 - 2 x 2 = 7] рук.",
      "blanks": [
        {
          "id": "6.2-b-7-0",
          "type": "expression",
          "accept": [
            "11 - 2 x 2 = 7"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Таких пар было [91 ÷ 7 = 13].",
      "blanks": [
        {
          "id": "6.2-b-8-0",
          "type": "expression",
          "accept": [
            "91 ÷ 7 = 13"
          ]
        }
      ]
    },
    {
      "template": "Механиков было [13], медиков было [13].",
      "blanks": [
        {
          "id": "6.2-b-9-0",
          "type": "number",
          "accept": [
            "13",
            13
          ]
        },
        {
          "id": "6.2-b-9-1",
          "type": "number",
          "accept": [
            "13",
            13
          ]
        }
      ]
    },
    {
      "template": "Солдат было [92 - 13 - 13 = 66].",
      "blanks": [
        {
          "id": "6.2-b-10-0",
          "type": "expression",
          "accept": [
            "92 - 13 - 13 = 66"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Ответ: [13 механиков, 13 медиков и 66 солдат].",
      "blanks": [
        {
          "id": "6.2-b-11-0",
          "type": "conclusion",
          "accept": [
            "13 механиков, 13 медиков и 66 солдат"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "6.3": [
    {
      "template": "Представим, что все [11] кораблей были [истребителями].",
      "blanks": [
        {
          "id": "6.3-b-0-0",
          "type": "number",
          "accept": [
            "11",
            11
          ]
        },
        {
          "id": "6.3-b-0-1",
          "type": "object",
          "accept": [
            "истребителями"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Тогда залпов было бы [11 x 3 = 33].",
      "blanks": [
        {
          "id": "6.3-b-1-0",
          "type": "expression",
          "accept": [
            "11 x 3 = 33"
          ]
        }
      ]
    },
    {
      "template": "По условию залпов [61].",
      "blanks": [
        {
          "id": "6.3-b-2-0",
          "type": "number",
          "accept": [
            "61",
            61
          ]
        }
      ]
    },
    {
      "template": "Лишних залпов [61 - 33 = 28].",
      "blanks": [
        {
          "id": "6.3-b-3-0",
          "type": "expression",
          "accept": [
            "61 - 33 = 28"
          ]
        }
      ]
    },
    {
      "template": "Крейсер вместо истребителя добавляет [7 - 3 = 4] залпа.",
      "blanks": [
        {
          "id": "6.3-b-4-0",
          "type": "expression",
          "accept": [
            "7 - 3 = 4"
          ]
        }
      ]
    },
    {
      "template": "Флагман вместо истребителя добавляет [9 - 3 = 6] залпов.",
      "blanks": [
        {
          "id": "6.3-b-5-0",
          "type": "expression",
          "accept": [
            "9 - 3 = 6"
          ]
        }
      ]
    },
    {
      "template": "Нужно получить [28] лишних залпов из добавок [4] и [6].",
      "blanks": [
        {
          "id": "6.3-b-6-0",
          "type": "number",
          "accept": [
            "28",
            28
          ]
        },
        {
          "id": "6.3-b-6-1",
          "type": "number",
          "accept": [
            "4",
            4
          ]
        },
        {
          "id": "6.3-b-6-2",
          "type": "number",
          "accept": [
            "6",
            6
          ]
        }
      ]
    },
    {
      "template": "Подходят варианты: [7 крейсеров и 0 флагманов], [4 крейсера и 2 флагмана], [1 крейсер и 4 флагмана].",
      "blanks": [
        {
          "id": "6.3-b-7-0",
          "type": "conclusion",
          "accept": [
            "7 крейсеров и 0 флагманов"
          ],
          "placeholder": "…"
        },
        {
          "id": "6.3-b-7-1",
          "type": "conclusion",
          "accept": [
            "4 крейсера и 2 флагмана"
          ],
          "placeholder": "…"
        },
        {
          "id": "6.3-b-7-2",
          "type": "conclusion",
          "accept": [
            "1 крейсер и 4 флагмана"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Тогда истребителей соответственно: [4], [5], [6].",
      "blanks": [
        {
          "id": "6.3-b-8-0",
          "type": "number",
          "accept": [
            "4",
            4
          ]
        },
        {
          "id": "6.3-b-8-1",
          "type": "number",
          "accept": [
            "5",
            5
          ]
        },
        {
          "id": "6.3-b-8-2",
          "type": "number",
          "accept": [
            "6",
            6
          ]
        }
      ]
    },
    {
      "template": "Ответ: [4 истребителя, 7 крейсеров, 0 флагманов]; [5 истребителей, 4 крейсера, 2 флагмана]; [6 истребителей, 1 крейсер, 4 флагмана].",
      "blanks": [
        {
          "id": "6.3-b-9-0",
          "type": "conclusion",
          "accept": [
            "4 истребителя, 7 крейсеров, 0 флагманов"
          ],
          "placeholder": "…"
        },
        {
          "id": "6.3-b-9-1",
          "type": "conclusion",
          "accept": [
            "5 истребителей, 4 крейсера, 2 флагмана"
          ],
          "placeholder": "…"
        },
        {
          "id": "6.3-b-9-2",
          "type": "conclusion",
          "accept": [
            "6 истребителей, 1 крейсер, 4 флагмана"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "6.4": [
    {
      "template": "Столов с двумя ящиками столько же, сколько столов с одним и тремя ящиками [вместе].",
      "blanks": [
        {
          "id": "6.4-b-0-0",
          "type": "object",
          "accept": [
            "вместе"
          ]
        }
      ]
    },
    {
      "template": "Значит, столы с двумя ящиками составляют [половину] всех столов.",
      "blanks": [
        {
          "id": "6.4-b-1-0",
          "type": "object",
          "accept": [
            "половину"
          ]
        }
      ]
    },
    {
      "template": "Всего столов [16], значит столов с двумя ящиками [16 ÷ 2 = 8].",
      "blanks": [
        {
          "id": "6.4-b-2-0",
          "type": "number",
          "accept": [
            "16",
            16
          ]
        },
        {
          "id": "6.4-b-2-1",
          "type": "expression",
          "accept": [
            "16 ÷ 2 = 8"
          ]
        }
      ]
    },
    {
      "template": "У них ящиков [8 x 2 = 16].",
      "blanks": [
        {
          "id": "6.4-b-3-0",
          "type": "expression",
          "accept": [
            "8 x 2 = 16"
          ]
        }
      ]
    },
    {
      "template": "Остальные столы имеют [30 - 16 = 14] ящиков.",
      "blanks": [
        {
          "id": "6.4-b-4-0",
          "type": "expression",
          "accept": [
            "30 - 16 = 14"
          ]
        }
      ]
    },
    {
      "template": "Этих остальных столов [16 - 8 = 8].",
      "blanks": [
        {
          "id": "6.4-b-5-0",
          "type": "expression",
          "accept": [
            "16 - 8 = 8"
          ]
        }
      ]
    },
    {
      "template": "Если бы все они были с [1] ящиком, ящиков было бы [8].",
      "blanks": [
        {
          "id": "6.4-b-6-0",
          "type": "number",
          "accept": [
            "1",
            1
          ]
        },
        {
          "id": "6.4-b-6-1",
          "type": "number",
          "accept": [
            "8",
            8
          ]
        }
      ]
    },
    {
      "template": "Лишних ящиков [14 - 8 = 6].",
      "blanks": [
        {
          "id": "6.4-b-7-0",
          "type": "expression",
          "accept": [
            "14 - 8 = 6"
          ]
        }
      ]
    },
    {
      "template": "Стол с 3 ящиками вместо стола с 1 ящиком добавляет [3 - 1 = 2] ящика.",
      "blanks": [
        {
          "id": "6.4-b-8-0",
          "type": "expression",
          "accept": [
            "3 - 1 = 2"
          ]
        }
      ]
    },
    {
      "template": "Столов с тремя ящиками было [6 ÷ 2 = 3].",
      "blanks": [
        {
          "id": "6.4-b-9-0",
          "type": "expression",
          "accept": [
            "6 ÷ 2 = 3"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [3 стола с тремя ящиками].",
      "blanks": [
        {
          "id": "6.4-b-10-0",
          "type": "conclusion",
          "accept": [
            "3 стола с тремя ящиками"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "6.5": [
    {
      "template": "Представим, что все [30] лет обучал [Оби-Ван].",
      "blanks": [
        {
          "id": "6.5-b-0-0",
          "type": "number",
          "accept": [
            "30",
            30
          ]
        },
        {
          "id": "6.5-b-0-1",
          "type": "expression",
          "accept": [
            "Оби-Ван"
          ]
        }
      ]
    },
    {
      "template": "Тогда было бы обучено [30 x 20 = 600] юнлингов.",
      "blanks": [
        {
          "id": "6.5-b-1-0",
          "type": "expression",
          "accept": [
            "30 x 20 = 600"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "По условию обучено [643] юнлинга.",
      "blanks": [
        {
          "id": "6.5-b-2-0",
          "type": "number",
          "accept": [
            "643",
            643
          ]
        }
      ]
    },
    {
      "template": "Лишних юнлингов [643 - 600 = 43].",
      "blanks": [
        {
          "id": "6.5-b-3-0",
          "type": "expression",
          "accept": [
            "643 - 600 = 43"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Год Йоды вместо года Оби-Вана добавляет [23 - 20 = 3] юнлинга.",
      "blanks": [
        {
          "id": "6.5-b-4-0",
          "type": "expression",
          "accept": [
            "23 - 20 = 3"
          ]
        }
      ]
    },
    {
      "template": "Год Квай-Гона вместо года Оби-Вана добавляет [25 - 20 = 5] юнлингов.",
      "blanks": [
        {
          "id": "6.5-b-5-0",
          "type": "expression",
          "accept": [
            "25 - 20 = 5"
          ]
        }
      ]
    },
    {
      "template": "Нужно получить [43] из добавок [3] и [5].",
      "blanks": [
        {
          "id": "6.5-b-6-0",
          "type": "number",
          "accept": [
            "43",
            43
          ]
        },
        {
          "id": "6.5-b-6-1",
          "type": "number",
          "accept": [
            "3",
            3
          ]
        },
        {
          "id": "6.5-b-6-2",
          "type": "number",
          "accept": [
            "5",
            5
          ]
        }
      ]
    },
    {
      "template": "Подходящие варианты: [Йода 11 лет, Квай-Гон 2 года, Оби-Ван 17 лет]; [Йода 6 лет, Квай-Гон 5 лет, Оби-Ван 19 лет]; [Йода 1 год, Квай-Гон 8 лет, Оби-Ван 21 год].",
      "blanks": [
        {
          "id": "6.5-b-7-0",
          "type": "expression",
          "accept": [
            "Йода 11 лет, Квай-Гон 2 года, Оби-Ван 17 лет"
          ],
          "placeholder": "…"
        },
        {
          "id": "6.5-b-7-1",
          "type": "expression",
          "accept": [
            "Йода 6 лет, Квай-Гон 5 лет, Оби-Ван 19 лет"
          ],
          "placeholder": "…"
        },
        {
          "id": "6.5-b-7-2",
          "type": "expression",
          "accept": [
            "Йода 1 год, Квай-Гон 8 лет, Оби-Ван 21 год"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Ответ: возможны [3] варианта, единственного ответа нет.",
      "blanks": [
        {
          "id": "6.5-b-8-0",
          "type": "number",
          "accept": [
            "3",
            3
          ]
        }
      ]
    }
  ],
  "7.1": [
    {
      "template": "У утёнка [2] лапы, у утконосика [4] лапы.",
      "blanks": [
        {
          "id": "7.1-b-0-0",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        },
        {
          "id": "7.1-b-0-1",
          "type": "number",
          "accept": [
            "4",
            4
          ]
        }
      ]
    },
    {
      "template": "Лап у всех утят и у всех утконосиков [поровну].",
      "blanks": [
        {
          "id": "7.1-b-1-0",
          "type": "object",
          "accept": [
            "поровну"
          ]
        }
      ]
    },
    {
      "template": "Один утконосик дает столько же лап, сколько [2] утёнка.",
      "blanks": [
        {
          "id": "7.1-b-2-0",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        }
      ]
    },
    {
      "template": "Значит, утят было в [2] раза больше, чем утконосиков.",
      "blanks": [
        {
          "id": "7.1-b-3-0",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        }
      ]
    },
    {
      "template": "Всего детёнышей [333].",
      "blanks": [
        {
          "id": "7.1-b-4-0",
          "type": "number",
          "accept": [
            "333",
            333
          ]
        }
      ]
    },
    {
      "template": "Всего частей [2 + 1 = 3].",
      "blanks": [
        {
          "id": "7.1-b-5-0",
          "type": "expression",
          "accept": [
            "2 + 1 = 3"
          ]
        }
      ]
    },
    {
      "template": "Одна часть равна [333 ÷ 3 = 111].",
      "blanks": [
        {
          "id": "7.1-b-6-0",
          "type": "expression",
          "accept": [
            "333 ÷ 3 = 111"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Утконосиков было [111].",
      "blanks": [
        {
          "id": "7.1-b-7-0",
          "type": "number",
          "accept": [
            "111",
            111
          ]
        }
      ]
    },
    {
      "template": "Утят было [111 x 2 = 222].",
      "blanks": [
        {
          "id": "7.1-b-8-0",
          "type": "expression",
          "accept": [
            "111 x 2 = 222"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Ответ: [222 утёнка и 111 утконосиков].",
      "blanks": [
        {
          "id": "7.1-b-9-0",
          "type": "conclusion",
          "accept": [
            "222 утёнка и 111 утконосиков"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "7.2": [
    {
      "template": "У трехколесного велосипеда [3] колеса, у четырехколесного — [4] колеса.",
      "blanks": [
        {
          "id": "7.2-b-0-0",
          "type": "number",
          "accept": [
            "3",
            3
          ]
        },
        {
          "id": "7.2-b-0-1",
          "type": "number",
          "accept": [
            "4",
            4
          ]
        }
      ]
    },
    {
      "template": "Колес у всех трехколесных и у всех четырехколесных было [поровну].",
      "blanks": [
        {
          "id": "7.2-b-1-0",
          "type": "object",
          "accept": [
            "поровну"
          ]
        }
      ]
    },
    {
      "template": "Чтобы получить одинаковое число колес, можно взять [4] трехколесных и [3] четырехколесных велосипеда.",
      "blanks": [
        {
          "id": "7.2-b-2-0",
          "type": "number",
          "accept": [
            "4",
            4
          ]
        },
        {
          "id": "7.2-b-2-1",
          "type": "number",
          "accept": [
            "3",
            3
          ]
        }
      ]
    },
    {
      "template": "В такой группе велосипедов [4 + 3 = 7].",
      "blanks": [
        {
          "id": "7.2-b-3-0",
          "type": "expression",
          "accept": [
            "4 + 3 = 7"
          ]
        }
      ]
    },
    {
      "template": "Всего велосипедов [28].",
      "blanks": [
        {
          "id": "7.2-b-4-0",
          "type": "number",
          "accept": [
            "28",
            28
          ]
        }
      ]
    },
    {
      "template": "Таких групп было [28 ÷ 7 = 4].",
      "blanks": [
        {
          "id": "7.2-b-5-0",
          "type": "expression",
          "accept": [
            "28 ÷ 7 = 4"
          ]
        }
      ]
    },
    {
      "template": "Трехколесных велосипедов было [4 x 4 = 16].",
      "blanks": [
        {
          "id": "7.2-b-6-0",
          "type": "expression",
          "accept": [
            "4 x 4 = 16"
          ]
        }
      ]
    },
    {
      "template": "Четырехколесных велосипедов было [3 x 4 = 12].",
      "blanks": [
        {
          "id": "7.2-b-7-0",
          "type": "expression",
          "accept": [
            "3 x 4 = 12"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [16 трехколесных и 12 четырехколесных].",
      "blanks": [
        {
          "id": "7.2-b-8-0",
          "type": "conclusion",
          "accept": [
            "16 трехколесных и 12 четырехколесных"
          ],
          "placeholder": "…"
        }
      ]
    }
  ],
  "7.3": [
    {
      "template": "У одного треугольника [3] угла.",
      "blanks": [
        {
          "id": "7.3-b-0-0",
          "type": "number",
          "accept": [
            "3",
            3
          ]
        }
      ]
    },
    {
      "template": "У одного пятиугольника [5] углов.",
      "blanks": [
        {
          "id": "7.3-b-1-0",
          "type": "number",
          "accept": [
            "5",
            5
          ]
        }
      ]
    },
    {
      "template": "Один пятиугольник дает на [5 - 3 = 2] угла больше, чем один треугольник.",
      "blanks": [
        {
          "id": "7.3-b-2-0",
          "type": "expression",
          "accept": [
            "5 - 3 = 2"
          ]
        }
      ]
    },
    {
      "template": "Всего у пятиугольников на [14] углов больше.",
      "blanks": [
        {
          "id": "7.3-b-3-0",
          "type": "number",
          "accept": [
            "14",
            14
          ]
        }
      ]
    },
    {
      "template": "Значит, пятиугольников было [14 ÷ 2 = 7].",
      "blanks": [
        {
          "id": "7.3-b-4-0",
          "type": "expression",
          "accept": [
            "14 ÷ 2 = 7"
          ]
        }
      ]
    },
    {
      "template": "Треугольников было столько же, то есть [7].",
      "blanks": [
        {
          "id": "7.3-b-5-0",
          "type": "number",
          "accept": [
            "7",
            7
          ]
        }
      ]
    },
    {
      "template": "Всего фигур было [7 + 7 = 14].",
      "blanks": [
        {
          "id": "7.3-b-6-0",
          "type": "expression",
          "accept": [
            "7 + 7 = 14"
          ]
        }
      ]
    },
    {
      "template": "Ответ: [14 фигур].",
      "blanks": [
        {
          "id": "7.3-b-7-0",
          "type": "object",
          "accept": [
            "14 фигур"
          ]
        }
      ]
    }
  ],
  "7.4": [
    {
      "template": "Голов у всех сороконожек столько же, сколько у всех драконов.",
      "blanks": []
    },
    {
      "template": "Всего голов [36], значит у сороконожек [18] голов и у драконов [18] голов.",
      "blanks": [
        {
          "id": "7.4-b-1-0",
          "type": "number",
          "accept": [
            "36",
            36
          ]
        },
        {
          "id": "7.4-b-1-1",
          "type": "number",
          "accept": [
            "18",
            18
          ]
        },
        {
          "id": "7.4-b-1-2",
          "type": "number",
          "accept": [
            "18",
            18
          ]
        }
      ]
    },
    {
      "template": "Одна сороконожка имеет [2] головы, значит сороконожек было [18 ÷ 2 = 9].",
      "blanks": [
        {
          "id": "7.4-b-2-0",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        },
        {
          "id": "7.4-b-2-1",
          "type": "expression",
          "accept": [
            "18 ÷ 2 = 9"
          ]
        }
      ]
    },
    {
      "template": "Один дракон имеет [3] головы, значит драконов было [18 ÷ 3 = 6].",
      "blanks": [
        {
          "id": "7.4-b-3-0",
          "type": "number",
          "accept": [
            "3",
            3
          ]
        },
        {
          "id": "7.4-b-3-1",
          "type": "expression",
          "accept": [
            "18 ÷ 3 = 6"
          ]
        }
      ]
    },
    {
      "template": "У одной сороконожки [40] ног.",
      "blanks": [
        {
          "id": "7.4-b-4-0",
          "type": "number",
          "accept": [
            "40",
            40
          ]
        }
      ]
    },
    {
      "template": "У всех сороконожек ног [9 x 40 = 360].",
      "blanks": [
        {
          "id": "7.4-b-5-0",
          "type": "expression",
          "accept": [
            "9 x 40 = 360"
          ]
        }
      ]
    },
    {
      "template": "Всего ног [396].",
      "blanks": [
        {
          "id": "7.4-b-6-0",
          "type": "number",
          "accept": [
            "396",
            396
          ]
        }
      ]
    },
    {
      "template": "У всех драконов ног [396 - 360 = 36].",
      "blanks": [
        {
          "id": "7.4-b-7-0",
          "type": "expression",
          "accept": [
            "396 - 360 = 36"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "У одного дракона ног [36 ÷ 6 = 6].",
      "blanks": [
        {
          "id": "7.4-b-8-0",
          "type": "expression",
          "accept": [
            "36 ÷ 6 = 6"
          ]
        }
      ]
    },
    {
      "template": "Ответ: у трёхголового дракона [6] ног.",
      "blanks": [
        {
          "id": "7.4-b-9-0",
          "type": "number",
          "accept": [
            "6",
            6
          ]
        }
      ]
    }
  ],
  "7.5": [
    {
      "template": "У одноголовой сороконожки [1] голова, у дракона [4] головы.",
      "blanks": [
        {
          "id": "7.5-b-0-0",
          "type": "number",
          "accept": [
            "1",
            1
          ]
        },
        {
          "id": "7.5-b-0-1",
          "type": "number",
          "accept": [
            "4",
            4
          ]
        }
      ]
    },
    {
      "template": "Голов у всех сороконожек столько же, сколько у всех драконов.",
      "blanks": []
    },
    {
      "template": "Значит, сороконожек в [4] раза больше, чем драконов.",
      "blanks": [
        {
          "id": "7.5-b-2-0",
          "type": "number",
          "accept": [
            "4",
            4
          ]
        }
      ]
    },
    {
      "template": "Всего существ [25].",
      "blanks": [
        {
          "id": "7.5-b-3-0",
          "type": "number",
          "accept": [
            "25",
            25
          ]
        }
      ]
    },
    {
      "template": "Всего частей [4 + 1 = 5].",
      "blanks": [
        {
          "id": "7.5-b-4-0",
          "type": "expression",
          "accept": [
            "4 + 1 = 5"
          ]
        }
      ]
    },
    {
      "template": "Одна часть равна [25 ÷ 5 = 5].",
      "blanks": [
        {
          "id": "7.5-b-5-0",
          "type": "expression",
          "accept": [
            "25 ÷ 5 = 5"
          ]
        }
      ]
    },
    {
      "template": "Драконов было [5], сороконожек было [20].",
      "blanks": [
        {
          "id": "7.5-b-6-0",
          "type": "number",
          "accept": [
            "5",
            5
          ]
        },
        {
          "id": "7.5-b-6-1",
          "type": "number",
          "accept": [
            "20",
            20
          ]
        }
      ]
    },
    {
      "template": "У одной сороконожки [40] ног.",
      "blanks": [
        {
          "id": "7.5-b-7-0",
          "type": "number",
          "accept": [
            "40",
            40
          ]
        }
      ]
    },
    {
      "template": "У всех сороконожек ног [20 x 40 = 800].",
      "blanks": [
        {
          "id": "7.5-b-8-0",
          "type": "expression",
          "accept": [
            "20 x 40 = 800"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Всего ног [850].",
      "blanks": [
        {
          "id": "7.5-b-9-0",
          "type": "number",
          "accept": [
            "850",
            850
          ]
        }
      ]
    },
    {
      "template": "У всех драконов ног [850 - 800 = 50].",
      "blanks": [
        {
          "id": "7.5-b-10-0",
          "type": "expression",
          "accept": [
            "850 - 800 = 50"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "У одного дракона ног [50 ÷ 5 = 10].",
      "blanks": [
        {
          "id": "7.5-b-11-0",
          "type": "expression",
          "accept": [
            "50 ÷ 5 = 10"
          ]
        }
      ]
    },
    {
      "template": "Ответ: у четырёхголового дракона [10] ног.",
      "blanks": [
        {
          "id": "7.5-b-12-0",
          "type": "number",
          "accept": [
            "10",
            10
          ]
        }
      ]
    }
  ],
  "7.6": [
    {
      "template": "У одноголовой сороконожки [1] голова, у дракона [5] голов.",
      "blanks": [
        {
          "id": "7.6-b-0-0",
          "type": "number",
          "accept": [
            "1",
            1
          ]
        },
        {
          "id": "7.6-b-0-1",
          "type": "number",
          "accept": [
            "5",
            5
          ]
        }
      ]
    },
    {
      "template": "Голов у сороконожек и драконов [поровну], значит сороконожек в [5] раз больше, чем драконов.",
      "blanks": [
        {
          "id": "7.6-b-1-0",
          "type": "object",
          "accept": [
            "поровну"
          ]
        },
        {
          "id": "7.6-b-1-1",
          "type": "number",
          "accept": [
            "5",
            5
          ]
        }
      ]
    },
    {
      "template": "Но в условии не сказано, сколько всего [существ] или сколько всего [голов].",
      "blanks": [
        {
          "id": "7.6-b-2-0",
          "type": "object",
          "accept": [
            "существ"
          ]
        },
        {
          "id": "7.6-b-2-1",
          "type": "object",
          "accept": [
            "голов"
          ]
        }
      ]
    },
    {
      "template": "Поэтому можно получить разные ответы.",
      "blanks": []
    },
    {
      "template": "Например, если драконов [2], то сороконожек [10]. У сороконожек ног [10 x 40 = 400], на драконов остается [420 - 400 = 20], у одного дракона [20 ÷ 2 = 10] ног.",
      "blanks": [
        {
          "id": "7.6-b-4-0",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        },
        {
          "id": "7.6-b-4-1",
          "type": "number",
          "accept": [
            "10",
            10
          ]
        },
        {
          "id": "7.6-b-4-2",
          "type": "expression",
          "accept": [
            "10 x 40 = 400"
          ],
          "placeholder": "…"
        },
        {
          "id": "7.6-b-4-3",
          "type": "expression",
          "accept": [
            "420 - 400 = 20"
          ],
          "placeholder": "…"
        },
        {
          "id": "7.6-b-4-4",
          "type": "expression",
          "accept": [
            "20 ÷ 2 = 10"
          ]
        }
      ]
    },
    {
      "template": "Если дракон [1], то сороконожек [5]. У сороконожек ног [5 x 40 = 200], на дракона остается [420 - 200 = 220] ног.",
      "blanks": [
        {
          "id": "7.6-b-5-0",
          "type": "number",
          "accept": [
            "1",
            1
          ]
        },
        {
          "id": "7.6-b-5-1",
          "type": "number",
          "accept": [
            "5",
            5
          ]
        },
        {
          "id": "7.6-b-5-2",
          "type": "expression",
          "accept": [
            "5 x 40 = 200"
          ]
        },
        {
          "id": "7.6-b-5-3",
          "type": "expression",
          "accept": [
            "420 - 200 = 220"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Значит, единственный ответ найти [нельзя].",
      "blanks": [
        {
          "id": "7.6-b-6-0",
          "type": "conclusion",
          "accept": [
            "нельзя"
          ]
        }
      ]
    }
  ],
  "7.7": [
    {
      "template": "У лошади [0] горбов.",
      "blanks": [
        {
          "id": "7.7-b-0-0",
          "type": "number",
          "accept": [
            "0",
            0
          ]
        }
      ]
    },
    {
      "template": "У двугорбого верблюда [2] горба.",
      "blanks": [
        {
          "id": "7.7-b-1-0",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        }
      ]
    },
    {
      "template": "У одногорбого верблюда [1] горб.",
      "blanks": [
        {
          "id": "7.7-b-2-0",
          "type": "number",
          "accept": [
            "1",
            1
          ]
        }
      ]
    },
    {
      "template": "По условию лошадей столько же, сколько [двугорбых верблюдов].",
      "blanks": [
        {
          "id": "7.7-b-3-0",
          "type": "object",
          "accept": [
            "двугорбых верблюдов"
          ],
          "placeholder": "…"
        }
      ]
    },
    {
      "template": "Пара «лошадь + двугорбый верблюд» дает [0 + 2 = 2] горба на [2] животных.",
      "blanks": [
        {
          "id": "7.7-b-4-0",
          "type": "expression",
          "accept": [
            "0 + 2 = 2"
          ]
        },
        {
          "id": "7.7-b-4-1",
          "type": "number",
          "accept": [
            "2",
            2
          ]
        }
      ]
    },
    {
      "template": "То есть в такой паре на одно животное приходится как будто [1] горб.",
      "blanks": [
        {
          "id": "7.7-b-5-0",
          "type": "number",
          "accept": [
            "1",
            1
          ]
        }
      ]
    },
    {
      "template": "Одногорбый верблюд тоже дает [1] горб на [1] животное.",
      "blanks": [
        {
          "id": "7.7-b-6-0",
          "type": "number",
          "accept": [
            "1",
            1
          ]
        },
        {
          "id": "7.7-b-6-1",
          "type": "number",
          "accept": [
            "1",
            1
          ]
        }
      ]
    },
    {
      "template": "Значит, общее число животных равно числу [горбов].",
      "blanks": [
        {
          "id": "7.7-b-7-0",
          "type": "object",
          "accept": [
            "горбов"
          ]
        }
      ]
    },
    {
      "template": "Горбов [20], значит животных [20].",
      "blanks": [
        {
          "id": "7.7-b-8-0",
          "type": "number",
          "accept": [
            "20",
            20
          ]
        },
        {
          "id": "7.7-b-8-1",
          "type": "number",
          "accept": [
            "20",
            20
          ]
        }
      ]
    },
    {
      "template": "Ответ: [20 животных].",
      "blanks": [
        {
          "id": "7.7-b-9-0",
          "type": "object",
          "accept": [
            "20 животных"
          ]
        }
      ]
    }
  ]
} as Record<string, SolutionLine[]>;
