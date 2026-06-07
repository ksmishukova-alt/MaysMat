/**
 * Экранный аудит методологии «Головы и ноги» (51 задача).
 * Сгенерировано: scripts/generate-heads-legs-screen-audit.ts
 * Не редактировать вручную — перегенерировать npm run generate:heads-legs-screen-audit
 */
import type { TaskScreenMethodologyAudit } from "./screen-methodology-audit-types";

export type { ScreenMethodologyAuditItem, TaskScreenMethodologyAudit } from "./screen-methodology-audit-types";

export const HEADS_LEGS_SCREEN_METHODOLOGY_AUDIT: TaskScreenMethodologyAudit[] = [
  {
    "taskId": "heads-legs-1-01",
    "methodTaskId": "1.1",
    "title": "Звери и птицы",
    "primaryMethod": "standard_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "{\"type1\":20,\"type2\":10}",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Объяснение метода",
        "screenKind": "hl_intro",
        "riskLevel": "none",
        "childAction": "Прочитать методическую рамку и продолжить",
        "expectedAnswer": "—",
        "whyThisStepExists": "Связка prelude → знакомый метод замены.",
        "validationRule": "Без проверки."
      },
      {
        "screenNumber": 2,
        "screenTitle": "Представим, что все одного вида",
        "screenKind": "hl_method_rule",
        "riskLevel": "low",
        "childAction": "Взаимодействие: hl_method_rule",
        "expectedAnswer": "—",
        "whyThisStepExists": "Шаг runner.",
        "validationRule": "hl_method_rule"
      },
      {
        "screenNumber": 3,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 4,
        "screenTitle": "Кто участвует в задаче?",
        "screenKind": "drag_select",
        "riskLevel": "none",
        "childAction": "Выбрать участников задачи",
        "expectedAnswer": "entities из condition",
        "whyThisStepExists": "Модель: кто участвует.",
        "validationRule": "Множественный выбор по entities."
      },
      {
        "screenNumber": 5,
        "screenTitle": "Сколько ног у каждого?",
        "screenKind": "table_input",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 6,
        "screenTitle": "Собери известные данные",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 7,
        "screenTitle": "Выбери предположение",
        "screenKind": "single_select",
        "riskLevel": "medium",
        "childAction": "Представим, что все 30 животных — …",
        "expectedAnswer": [
          "Птицы"
        ],
        "whyThisStepExists": "Выбор вида для пробной картины.",
        "validationRule": "single_select: correct=Птицы",
        "possibleWrongButReasonableAnswers": [
          "Второй вид — математически возможен другой путь assume"
        ],
        "alternativeValidPath": true
      },
      {
        "screenNumber": 8,
        "screenTitle": "Пробная картина",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 9,
        "screenTitle": "Сравнение и разница",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 10,
        "screenTitle": "Шаг замены и ответ",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 11,
        "screenTitle": "Запиши решение словами",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "{\"type1\":20,\"type2\":10}",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 12,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "{\"type1\":20,\"type2\":10}",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-1-02",
    "methodTaskId": "1.2",
    "title": "Цыплята и змеи",
    "primaryMethod": "standard_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "39",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Представим, что все одного вида",
        "screenKind": "hl_method_rule",
        "riskLevel": "low",
        "childAction": "Взаимодействие: hl_method_rule",
        "expectedAnswer": "—",
        "whyThisStepExists": "Шаг runner.",
        "validationRule": "hl_method_rule"
      },
      {
        "screenNumber": 2,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 3,
        "screenTitle": "Кто участвует в задаче?",
        "screenKind": "drag_select",
        "riskLevel": "none",
        "childAction": "Выбрать участников задачи",
        "expectedAnswer": "entities из condition",
        "whyThisStepExists": "Модель: кто участвует.",
        "validationRule": "Множественный выбор по entities."
      },
      {
        "screenNumber": 4,
        "screenTitle": "Выбери предположение",
        "screenKind": "single_select",
        "riskLevel": "medium",
        "childAction": "Представим, что все 120 детёнышей — …",
        "expectedAnswer": [
          "Змеи"
        ],
        "whyThisStepExists": "Выбор вида для пробной картины.",
        "validationRule": "single_select: correct=Змеи",
        "possibleWrongButReasonableAnswers": [
          "Второй вид — математически возможен другой путь assume"
        ],
        "alternativeValidPath": true
      },
      {
        "screenNumber": 5,
        "screenTitle": "Пробная картина",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 6,
        "screenTitle": "Сравнение и разница",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 7,
        "screenTitle": "Шаг замены и ответ",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 8,
        "screenTitle": "Запиши решение словами",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "39",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 9,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "39",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-1-03",
    "methodTaskId": "1.3",
    "title": "Гусята и крокодильчики",
    "primaryMethod": "standard_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "{\"geese\":150,\"crocodiles\":50}",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Представим, что все одного вида",
        "screenKind": "hl_method_rule",
        "riskLevel": "low",
        "childAction": "Взаимодействие: hl_method_rule",
        "expectedAnswer": "—",
        "whyThisStepExists": "Шаг runner.",
        "validationRule": "hl_method_rule"
      },
      {
        "screenNumber": 2,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 3,
        "screenTitle": "Кто участвует в задаче?",
        "screenKind": "drag_select",
        "riskLevel": "none",
        "childAction": "Выбрать участников задачи",
        "expectedAnswer": "entities из condition",
        "whyThisStepExists": "Модель: кто участвует.",
        "validationRule": "Множественный выбор по entities."
      },
      {
        "screenNumber": 4,
        "screenTitle": "Сколько ног у каждого?",
        "screenKind": "table_input",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 5,
        "screenTitle": "Собери известные данные",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 6,
        "screenTitle": "Выбери предположение",
        "screenKind": "single_select",
        "riskLevel": "medium",
        "childAction": "Представим, что все 200 детёнышей — …",
        "expectedAnswer": [
          "Гусята"
        ],
        "whyThisStepExists": "Выбор вида для пробной картины.",
        "validationRule": "single_select: correct=Гусята",
        "possibleWrongButReasonableAnswers": [
          "Второй вид — математически возможен другой путь assume"
        ],
        "alternativeValidPath": true
      },
      {
        "screenNumber": 7,
        "screenTitle": "Пробная картина",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 8,
        "screenTitle": "Сравнение и разница",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 9,
        "screenTitle": "Шаг замены и ответ",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 10,
        "screenTitle": "Запиши решение словами",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "{\"geese\":150,\"crocodiles\":50}",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 11,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "{\"geese\":150,\"crocodiles\":50}",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-1-04",
    "methodTaskId": "1.4",
    "title": "Жуки и пауки",
    "primaryMethod": "standard_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "{\"beetles\":25,\"spiders\":15}",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 2,
        "screenTitle": "Кто участвует в задаче?",
        "screenKind": "drag_select",
        "riskLevel": "none",
        "childAction": "Выбрать участников задачи",
        "expectedAnswer": "entities из condition",
        "whyThisStepExists": "Модель: кто участвует.",
        "validationRule": "Множественный выбор по entities."
      },
      {
        "screenNumber": 3,
        "screenTitle": "Сколько ног у каждого?",
        "screenKind": "table_input",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 4,
        "screenTitle": "Собери известные данные",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 5,
        "screenTitle": "Какой шаг сейчас нужно сделать?",
        "screenKind": "hl_choose_method",
        "riskLevel": "low",
        "childAction": "Выбрать следующий шаг метода из hub (профиль 3+)",
        "expectedAnswer": "Зависит от этапа решения",
        "whyThisStepExists": "Снятие опоры: ребёнок выбирает шаг.",
        "validationRule": "Сопоставление stepId с текущим этапом worksheets."
      },
      {
        "screenNumber": 6,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "{\"beetles\":25,\"spiders\":15}",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-1-06",
    "methodTaskId": "1.6",
    "title": "Велосипедисты",
    "primaryMethod": "standard_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "3 двухколёсных",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 2,
        "screenTitle": "Запиши решение словами",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "3 двухколёсных",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 3,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "3 двухколёсных",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-1-07",
    "methodTaskId": "1.7",
    "title": "Велосипеды на парковке",
    "primaryMethod": "standard_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "4 трёхколёсных",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 2,
        "screenTitle": "Запиши решение словами",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "4 трёхколёсных",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 3,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "4 трёхколёсных",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-1-10",
    "methodTaskId": "1.10",
    "title": "Гномы и пони",
    "primaryMethod": "standard_replacement",
    "preludeType": "derive_total_objects",
    "solutionMode": "standard_replacement",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "reserve",
    "expectedAnswer": "{\"gnomes\":7,\"ponies\":10}",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "{\"gnomes\":7,\"ponies\":10}",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "17 голов + 54 ноги → нужен prelude «сколько участников». Reserve."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "reserve"
  },
  {
    "taskId": "heads-legs-1-05",
    "methodTaskId": "1.5",
    "title": "Жуки и пауки: правые ноги",
    "primaryMethod": "derived_feature",
    "preludeType": "derived_half_feature",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "{\"beetles\":38,\"spiders\":32}",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 2,
        "screenTitle": "Кто участвует в задаче?",
        "screenKind": "drag_select",
        "riskLevel": "medium",
        "childAction": "Выбрать участников задачи",
        "expectedAnswer": "entities из condition",
        "whyThisStepExists": "Модель: кто участвует.",
        "validationRule": "Множественный выбор по entities.",
        "notes": "Для derive-задач шаг «кто участвует» не должен показываться"
      },
      {
        "screenNumber": 3,
        "screenTitle": "Норма у каждого вида",
        "screenKind": "table_input",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 4,
        "screenTitle": "Собери известные данные",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 5,
        "screenTitle": "Какой шаг сейчас нужно сделать?",
        "screenKind": "hl_choose_method",
        "riskLevel": "low",
        "childAction": "Выбрать следующий шаг метода из hub (профиль 3+)",
        "expectedAnswer": "Зависит от этапа решения",
        "whyThisStepExists": "Снятие опоры: ребёнок выбирает шаг.",
        "validationRule": "Сопоставление stepId с текущим этапом worksheets."
      },
      {
        "screenNumber": 6,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "{\"beetles\":38,\"spiders\":32}",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [
      "Кто участвует в задаче?: Для derive-задач шаг «кто участвует» не должен показываться"
    ],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-1-08",
    "methodTaskId": "1.8",
    "title": "Мухи и слоны",
    "primaryMethod": "text_ratio_answer",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "4:6",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "4:6",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "high",
        "notes": "Ответ текстом «4:6», не два числа. Нужен отдельный answerTransform text."
      }
    ],
    "validationRisks": [
      "Legacy DigitalTaskPlayer: Ответ текстом «4:6», не два числа. Нужен отдельный answerTransform text."
    ],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-1-13",
    "methodTaskId": "1.13",
    "title": "Роботы AT-ST и AT-AT",
    "primaryMethod": "standard_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "reserve",
    "expectedAnswer": "{\"atst\":9,\"atat\":3}",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "{\"atst\":9,\"atat\":3}",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "12 роботов явно; AT-ST vs AT-AT. Кандидат publication после legacy→pilot."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "reserve"
  },
  {
    "taskId": "heads-legs-2-01",
    "methodTaskId": "2.1",
    "title": "Клумбы около Лицея и Гимназии",
    "primaryMethod": "value_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "{\"lyceum\":4,\"gymnasium\":7}",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Объяснение метода",
        "screenKind": "hl_intro",
        "riskLevel": "none",
        "childAction": "Прочитать методическую рамку и продолжить",
        "expectedAnswer": "—",
        "whyThisStepExists": "Связка prelude → знакомый метод замены.",
        "validationRule": "Без проверки."
      },
      {
        "screenNumber": 2,
        "screenTitle": "Представим, что все одного вида",
        "screenKind": "hl_method_rule",
        "riskLevel": "low",
        "childAction": "Взаимодействие: hl_method_rule",
        "expectedAnswer": "—",
        "whyThisStepExists": "Шаг runner.",
        "validationRule": "hl_method_rule"
      },
      {
        "screenNumber": 3,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 4,
        "screenTitle": "Что участвует в задаче?",
        "screenKind": "drag_select",
        "riskLevel": "none",
        "childAction": "Выбрать участников задачи",
        "expectedAnswer": "entities из condition",
        "whyThisStepExists": "Модель: кто участвует.",
        "validationRule": "Множественный выбор по entities."
      },
      {
        "screenNumber": 5,
        "screenTitle": "Сколько цветков на клумбе у каждого?",
        "screenKind": "table_input",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 6,
        "screenTitle": "Собери известные данные",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 7,
        "screenTitle": "Выбери предположение",
        "screenKind": "single_select",
        "riskLevel": "medium",
        "childAction": "Представим, что все 11 клумб — …",
        "expectedAnswer": [
          "Клумбы у Лицея"
        ],
        "whyThisStepExists": "Выбор вида для пробной картины.",
        "validationRule": "single_select: correct=Клумбы у Лицея",
        "possibleWrongButReasonableAnswers": [
          "Второй вид — математически возможен другой путь assume"
        ],
        "alternativeValidPath": true
      },
      {
        "screenNumber": 8,
        "screenTitle": "Пробная картина",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 9,
        "screenTitle": "Сравнение и разница",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 10,
        "screenTitle": "Шаг замены и ответ",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 11,
        "screenTitle": "Проверь, что именно спрашивают",
        "screenKind": "hl_question_check",
        "riskLevel": "none",
        "childAction": "Подтвердить, что именно спрашивает задача",
        "expectedAnswer": "сколько клумб около Лицея и сколько около Гимназии",
        "whyThisStepExists": "Question-check перед записью ответа.",
        "validationRule": "Подтверждение без альтернатив."
      },
      {
        "screenNumber": 12,
        "screenTitle": "Запиши решение словами",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "{\"lyceum\":4,\"gymnasium\":7}",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 13,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "{\"lyceum\":4,\"gymnasium\":7}",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-2-02",
    "methodTaskId": "2.2",
    "title": "Коробки с карандашами",
    "primaryMethod": "value_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "{\"large\":15,\"small\":5}",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Представим, что все одного вида",
        "screenKind": "hl_method_rule",
        "riskLevel": "low",
        "childAction": "Взаимодействие: hl_method_rule",
        "expectedAnswer": "—",
        "whyThisStepExists": "Шаг runner.",
        "validationRule": "hl_method_rule"
      },
      {
        "screenNumber": 2,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 3,
        "screenTitle": "Что участвует в задаче?",
        "screenKind": "drag_select",
        "riskLevel": "none",
        "childAction": "Выбрать участников задачи",
        "expectedAnswer": "entities из condition",
        "whyThisStepExists": "Модель: кто участвует.",
        "validationRule": "Множественный выбор по entities."
      },
      {
        "screenNumber": 4,
        "screenTitle": "Сколько карандашей у каждого?",
        "screenKind": "table_input",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 5,
        "screenTitle": "Собери известные данные",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 6,
        "screenTitle": "Выбери предположение",
        "screenKind": "single_select",
        "riskLevel": "medium",
        "childAction": "Представим, что все объекты — …",
        "expectedAnswer": [
          "Маленькие коробки"
        ],
        "whyThisStepExists": "Выбор вида для пробной картины.",
        "validationRule": "single_select: correct=Маленькие коробки",
        "possibleWrongButReasonableAnswers": [
          "Второй вид — математически возможен другой путь assume"
        ],
        "alternativeValidPath": true
      },
      {
        "screenNumber": 7,
        "screenTitle": "Пробная картина",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 8,
        "screenTitle": "Сравнение и разница",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 9,
        "screenTitle": "Шаг замены и ответ",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 10,
        "screenTitle": "Проверь, что именно спрашивают",
        "screenKind": "hl_question_check",
        "riskLevel": "none",
        "childAction": "Подтвердить, что именно спрашивает задача",
        "expectedAnswer": "сколько больших и сколько маленьких коробок",
        "whyThisStepExists": "Question-check перед записью ответа.",
        "validationRule": "Подтверждение без альтернатив."
      },
      {
        "screenNumber": 11,
        "screenTitle": "Запиши решение словами",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "{\"large\":15,\"small\":5}",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 12,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "{\"large\":15,\"small\":5}",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-2-03",
    "methodTaskId": "2.3",
    "title": "Дроны-рабочие и дроны-пастухи",
    "primaryMethod": "value_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "{\"workers\":63,\"shepherds\":75}",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Представим, что все одного вида",
        "screenKind": "hl_method_rule",
        "riskLevel": "low",
        "childAction": "Взаимодействие: hl_method_rule",
        "expectedAnswer": "—",
        "whyThisStepExists": "Шаг runner.",
        "validationRule": "hl_method_rule"
      },
      {
        "screenNumber": 2,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 3,
        "screenTitle": "Кто участвует в задаче?",
        "screenKind": "drag_select",
        "riskLevel": "none",
        "childAction": "Выбрать участников задачи",
        "expectedAnswer": "entities из condition",
        "whyThisStepExists": "Модель: кто участвует.",
        "validationRule": "Множественный выбор по entities."
      },
      {
        "screenNumber": 4,
        "screenTitle": "Сколько кредитов у каждого?",
        "screenKind": "table_input",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 5,
        "screenTitle": "Собери известные данные",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 6,
        "screenTitle": "Выбери предположение",
        "screenKind": "single_select",
        "riskLevel": "medium",
        "childAction": "Представим, что все объекты — …",
        "expectedAnswer": [
          "Дроны-пастухи"
        ],
        "whyThisStepExists": "Выбор вида для пробной картины.",
        "validationRule": "single_select: correct=Дроны-пастухи",
        "possibleWrongButReasonableAnswers": [
          "Второй вид — математически возможен другой путь assume"
        ],
        "alternativeValidPath": true
      },
      {
        "screenNumber": 7,
        "screenTitle": "Пробная картина",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 8,
        "screenTitle": "Сравнение и разница",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 9,
        "screenTitle": "Шаг замены и ответ",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 10,
        "screenTitle": "Проверь, что именно спрашивают",
        "screenKind": "hl_question_check",
        "riskLevel": "none",
        "childAction": "Подтвердить, что именно спрашивает задача",
        "expectedAnswer": "сколько дронов каждого вида он купил",
        "whyThisStepExists": "Question-check перед записью ответа.",
        "validationRule": "Подтверждение без альтернатив."
      },
      {
        "screenNumber": 11,
        "screenTitle": "Запиши решение словами",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "{\"workers\":63,\"shepherds\":75}",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 12,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "{\"workers\":63,\"shepherds\":75}",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-2-04",
    "methodTaskId": "2.4",
    "title": "Пирожные по 100 и 125 рублей",
    "primaryMethod": "value_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "20",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 2,
        "screenTitle": "Кто участвует в задаче?",
        "screenKind": "drag_select",
        "riskLevel": "none",
        "childAction": "Выбрать участников задачи",
        "expectedAnswer": "entities из condition",
        "whyThisStepExists": "Модель: кто участвует.",
        "validationRule": "Множественный выбор по entities."
      },
      {
        "screenNumber": 3,
        "screenTitle": "Сколько цена у каждого?",
        "screenKind": "table_input",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 4,
        "screenTitle": "Собери известные данные",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 5,
        "screenTitle": "Какой шаг сейчас нужно сделать?",
        "screenKind": "hl_choose_method",
        "riskLevel": "low",
        "childAction": "Выбрать следующий шаг метода из hub (профиль 3+)",
        "expectedAnswer": "Зависит от этапа решения",
        "whyThisStepExists": "Снятие опоры: ребёнок выбирает шаг.",
        "validationRule": "Сопоставление stepId с текущим этапом worksheets."
      },
      {
        "screenNumber": 6,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "20",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-2-05",
    "methodTaskId": "2.5",
    "title": "Коробки простых и цветных карандашей",
    "primaryMethod": "value_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "340",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 2,
        "screenTitle": "Что участвует в задаче?",
        "screenKind": "drag_select",
        "riskLevel": "none",
        "childAction": "Выбрать участников задачи",
        "expectedAnswer": "entities из condition",
        "whyThisStepExists": "Модель: кто участвует.",
        "validationRule": "Множественный выбор по entities."
      },
      {
        "screenNumber": 3,
        "screenTitle": "Сколько карандашей у каждого?",
        "screenKind": "table_input",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 4,
        "screenTitle": "Собери известные данные",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 5,
        "screenTitle": "Какой шаг сейчас нужно сделать?",
        "screenKind": "hl_choose_method",
        "riskLevel": "low",
        "childAction": "Выбрать следующий шаг метода из hub (профиль 3+)",
        "expectedAnswer": "Зависит от этапа решения",
        "whyThisStepExists": "Снятие опоры: ребёнок выбирает шаг.",
        "validationRule": "Сопоставление stepId с текущим этапом worksheets."
      },
      {
        "screenNumber": 6,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "340",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-2-06",
    "methodTaskId": "2.6",
    "title": "Львята и тигрята",
    "primaryMethod": "value_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "10 тигрят",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 2,
        "screenTitle": "Запиши решение словами",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "10 тигрят",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 3,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "10 тигрят",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-2-07",
    "methodTaskId": "2.7",
    "title": "Собаки и кошки",
    "primaryMethod": "value_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "{\"dogs\":6,\"cats\":4}",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 2,
        "screenTitle": "Запиши решение словами",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "{\"dogs\":6,\"cats\":4}",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 3,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "{\"dogs\":6,\"cats\":4}",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-1-09",
    "methodTaskId": "1.9",
    "title": "Дроиды и генерал Гривус",
    "primaryMethod": "multi_limb_constraint",
    "preludeType": "multi_feature_balance",
    "solutionMode": "standard_replacement",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "reserve",
    "expectedAnswer": "7 дроидов",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "7 дроидов",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "Не heads-legs в лоб; custom worksheets. Reserve до unified multi-feature runner."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "reserve"
  },
  {
    "taskId": "heads-legs-1-11",
    "methodTaskId": "1.11",
    "title": "Жирафы и страусы",
    "primaryMethod": "compare_after_replacement",
    "preludeType": "none",
    "solutionMode": "compare_results",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "reserve",
    "expectedAnswer": "12 на сколько больше страусов",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "12 на сколько больше страусов",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "Сравнение «кого больше и на сколько» после замены."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "reserve"
  },
  {
    "taskId": "heads-legs-1-14",
    "methodTaskId": "1.14",
    "title": "Табуретки и стулья",
    "primaryMethod": "standard_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "reserve",
    "expectedAnswer": "{\"stools\":12,\"chairs\":10}",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "{\"stools\":12,\"chairs\":10}",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "120 ног включает людей; custom runner. Reserve."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "reserve"
  },
  {
    "taskId": "heads-legs-3-02",
    "methodTaskId": "3.2",
    "title": "Пирожки мальчиков и девочек",
    "primaryMethod": "enumeration",
    "preludeType": "missing_total_objects",
    "solutionMode": "enumeration",
    "runner": "HeadsLegsRunner / enumeration",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "{\"boys\":3,\"girls\":2}",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Представим, что все сделали одинаково",
        "screenKind": "hl_method_rule",
        "riskLevel": "low",
        "childAction": "Взаимодействие: hl_method_rule",
        "expectedAnswer": "—",
        "whyThisStepExists": "Шаг runner.",
        "validationRule": "hl_method_rule"
      },
      {
        "screenNumber": 2,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 3,
        "screenTitle": "Кто участвует в задаче?",
        "screenKind": "drag_select",
        "riskLevel": "medium",
        "childAction": "Выбрать участников задачи",
        "expectedAnswer": "entities из condition",
        "whyThisStepExists": "Модель: кто участвует.",
        "validationRule": "Множественный выбор по entities.",
        "notes": "Для derive-задач шаг «кто участвует» не должен показываться"
      },
      {
        "screenNumber": 4,
        "screenTitle": "Сколько всего пирожков",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 5,
        "screenTitle": "Оба вида участвуют",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "{\"boys\":3,\"girls\":2}",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      },
      {
        "screenNumber": 6,
        "screenTitle": "Перебор: сколько мальчиков?",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 7,
        "screenTitle": "Проверка",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 8,
        "screenTitle": "Проверь, что именно спрашивают",
        "screenKind": "hl_question_check",
        "riskLevel": "none",
        "childAction": "Подтвердить, что именно спрашивает задача",
        "expectedAnswer": "сколько мальчиков и сколько девочек",
        "whyThisStepExists": "Question-check перед записью ответа.",
        "validationRule": "Подтверждение без альтернатив."
      },
      {
        "screenNumber": 9,
        "screenTitle": "Запиши перебор и вывод",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "{\"boys\":3,\"girls\":2}",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 10,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "{\"boys\":3,\"girls\":2}",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [
      "Кто участвует в задаче?: Для derive-задач шаг «кто участвует» не должен показываться"
    ],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-3-03",
    "methodTaskId": "3.3",
    "title": "Конфеты в классе",
    "primaryMethod": "production_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "15 девочек",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Объяснение метода",
        "screenKind": "hl_intro",
        "riskLevel": "none",
        "childAction": "Прочитать методическую рамку и продолжить",
        "expectedAnswer": "—",
        "whyThisStepExists": "Связка prelude → знакомый метод замены.",
        "validationRule": "Без проверки."
      },
      {
        "screenNumber": 2,
        "screenTitle": "Представим, что все сделали одинаково",
        "screenKind": "hl_method_rule",
        "riskLevel": "low",
        "childAction": "Взаимодействие: hl_method_rule",
        "expectedAnswer": "—",
        "whyThisStepExists": "Шаг runner.",
        "validationRule": "hl_method_rule"
      },
      {
        "screenNumber": 3,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 4,
        "screenTitle": "Кто участвует в задаче?",
        "screenKind": "drag_select",
        "riskLevel": "none",
        "childAction": "Выбрать участников задачи",
        "expectedAnswer": "entities из condition",
        "whyThisStepExists": "Модель: кто участвует.",
        "validationRule": "Множественный выбор по entities."
      },
      {
        "screenNumber": 5,
        "screenTitle": "Сколько конфет у каждого?",
        "screenKind": "table_input",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 6,
        "screenTitle": "Собери известные данные",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 7,
        "screenTitle": "Выбери предположение",
        "screenKind": "single_select",
        "riskLevel": "medium",
        "childAction": "Представим, что все 30 девочек — …",
        "expectedAnswer": [
          "Мальчики"
        ],
        "whyThisStepExists": "Выбор вида для пробной картины.",
        "validationRule": "single_select: correct=Мальчики",
        "possibleWrongButReasonableAnswers": [
          "Второй вид — математически возможен другой путь assume"
        ],
        "alternativeValidPath": true
      },
      {
        "screenNumber": 8,
        "screenTitle": "Пробная картина",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 9,
        "screenTitle": "Сравнение и разница",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 10,
        "screenTitle": "Шаг замены и ответ",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 11,
        "screenTitle": "Проверь, что именно спрашивают",
        "screenKind": "hl_question_check",
        "riskLevel": "none",
        "childAction": "Подтвердить, что именно спрашивает задача",
        "expectedAnswer": "сколько девочек в классе",
        "whyThisStepExists": "Question-check перед записью ответа.",
        "validationRule": "Подтверждение без альтернатив."
      },
      {
        "screenNumber": 12,
        "screenTitle": "Запиши решение словами",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "15 девочек",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 13,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "15 девочек",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-3-04",
    "methodTaskId": "3.4",
    "title": "Снежинки",
    "primaryMethod": "production_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "{\"boys\":10,\"girls\":20}",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Представим, что все сделали одинаково",
        "screenKind": "hl_method_rule",
        "riskLevel": "low",
        "childAction": "Взаимодействие: hl_method_rule",
        "expectedAnswer": "—",
        "whyThisStepExists": "Шаг runner.",
        "validationRule": "hl_method_rule"
      },
      {
        "screenNumber": 2,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 3,
        "screenTitle": "Кто участвует в задаче?",
        "screenKind": "drag_select",
        "riskLevel": "none",
        "childAction": "Выбрать участников задачи",
        "expectedAnswer": "entities из condition",
        "whyThisStepExists": "Модель: кто участвует.",
        "validationRule": "Множественный выбор по entities."
      },
      {
        "screenNumber": 4,
        "screenTitle": "Сколько снежинок у каждого?",
        "screenKind": "table_input",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 5,
        "screenTitle": "Собери известные данные",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 6,
        "screenTitle": "Выбери предположение",
        "screenKind": "single_select",
        "riskLevel": "medium",
        "childAction": "Представим, что все 30 девочек — …",
        "expectedAnswer": [
          "Мальчики"
        ],
        "whyThisStepExists": "Выбор вида для пробной картины.",
        "validationRule": "single_select: correct=Мальчики",
        "possibleWrongButReasonableAnswers": [
          "Второй вид — математически возможен другой путь assume"
        ],
        "alternativeValidPath": true
      },
      {
        "screenNumber": 7,
        "screenTitle": "Пробная картина",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 8,
        "screenTitle": "Сравнение и разница",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 9,
        "screenTitle": "Шаг замены и ответ",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 10,
        "screenTitle": "Проверь, что именно спрашивают",
        "screenKind": "hl_question_check",
        "riskLevel": "none",
        "childAction": "Подтвердить, что именно спрашивает задача",
        "expectedAnswer": "сколько мальчиков и сколько девочек",
        "whyThisStepExists": "Question-check перед записью ответа.",
        "validationRule": "Подтверждение без альтернатив."
      },
      {
        "screenNumber": 11,
        "screenTitle": "Запиши решение словами",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "{\"boys\":10,\"girls\":20}",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 12,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "{\"boys\":10,\"girls\":20}",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-3-05",
    "methodTaskId": "3.5",
    "title": "Совята и котята",
    "primaryMethod": "compare_after_replacement",
    "preludeType": "none",
    "solutionMode": "compare_results",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "4 мышей больше у котят",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 2,
        "screenTitle": "Кто участвует в задаче?",
        "screenKind": "drag_select",
        "riskLevel": "none",
        "childAction": "Выбрать участников задачи",
        "expectedAnswer": "entities из condition",
        "whyThisStepExists": "Модель: кто участвует.",
        "validationRule": "Множественный выбор по entities."
      },
      {
        "screenNumber": 3,
        "screenTitle": "Сколько мышей у каждого?",
        "screenKind": "table_input",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 4,
        "screenTitle": "Собери известные данные",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 5,
        "screenTitle": "На что отвечаем?",
        "screenKind": "single_select",
        "riskLevel": "none",
        "childAction": "Что нужно сравнить в конце задачи?",
        "expectedAnswer": [
          "Сколько мышей поймали"
        ],
        "whyThisStepExists": "Проверка понимания / выбор метода.",
        "validationRule": "single_select: correct=Сколько мышей поймали",
        "alternativeValidPath": false
      },
      {
        "screenNumber": 6,
        "screenTitle": "Главный вопрос задачи",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "4 мышей больше у котят",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      },
      {
        "screenNumber": 7,
        "screenTitle": "Сравни, кто поймал больше мышей",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 8,
        "screenTitle": "Кто поймал больше?",
        "screenKind": "single_select",
        "riskLevel": "none",
        "childAction": "Кто поймал больше мышек?",
        "expectedAnswer": [
          "Котята — на 4 мышки больше"
        ],
        "whyThisStepExists": "Проверка понимания / выбор метода.",
        "validationRule": "single_select: correct=Котята — на 4 мышки больше",
        "alternativeValidPath": false
      },
      {
        "screenNumber": 9,
        "screenTitle": "Какой шаг сейчас нужно сделать?",
        "screenKind": "hl_choose_method",
        "riskLevel": "low",
        "childAction": "Выбрать следующий шаг метода из hub (профиль 3+)",
        "expectedAnswer": "Зависит от этапа решения",
        "whyThisStepExists": "Снятие опоры: ребёнок выбирает шаг.",
        "validationRule": "Сопоставление stepId с текущим этапом worksheets."
      },
      {
        "screenNumber": 10,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "4 мышей больше у котят",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-3-06",
    "methodTaskId": "3.6",
    "title": "Ученики съели конфеты",
    "primaryMethod": "production_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "{\"boys\":15,\"girls\":10}",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 2,
        "screenTitle": "Запиши решение словами",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "{\"boys\":15,\"girls\":10}",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 3,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "{\"boys\":15,\"girls\":10}",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-3-07",
    "methodTaskId": "3.7",
    "title": "Яблоки на варенье",
    "primaryMethod": "diagnostic_incomplete",
    "preludeType": "missing_total_objects",
    "solutionMode": "diagnostic",
    "runner": "HeadsLegsRunner / multiple_answers",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "2 вариант(ов)",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 2,
        "screenTitle": "Данные из условия",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 3,
        "screenTitle": "Перебор мальчиков",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "2 вариант(ов)",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      },
      {
        "screenNumber": 4,
        "screenTitle": "Может ли быть 0 девочек?",
        "screenKind": "single_select",
        "riskLevel": "none",
        "childAction": "Подходит ли вариант, где девочек нет?",
        "expectedAnswer": [
          "Нет — девочек должно быть больше 0"
        ],
        "whyThisStepExists": "Проверка понимания / выбор метода.",
        "validationRule": "single_select: correct=Нет — девочек должно быть больше 0",
        "alternativeValidPath": false
      },
      {
        "screenNumber": 5,
        "screenTitle": "Вариант 1: один мальчик",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 6,
        "screenTitle": "Вариант 2: три мальчика",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 7,
        "screenTitle": "Сколько могло быть девочек?",
        "screenKind": "single_select",
        "riskLevel": "none",
        "childAction": "Какой вывод верен?",
        "expectedAnswer": [
          "5 или 2 девочки"
        ],
        "whyThisStepExists": "Проверка понимания / выбор метода.",
        "validationRule": "single_select: correct=5 или 2 девочки",
        "alternativeValidPath": false
      },
      {
        "screenNumber": 8,
        "screenTitle": "Запиши диагностический вывод",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "2 вариант(ов)",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 9,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "2 вариант(ов)",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-4-01",
    "methodTaskId": "4.1",
    "title": "Петя на турнире",
    "primaryMethod": "score_plus_minus",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "7",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Объяснение метода",
        "screenKind": "hl_intro",
        "riskLevel": "none",
        "childAction": "Прочитать методическую рамку и продолжить",
        "expectedAnswer": "—",
        "whyThisStepExists": "Связка prelude → знакомый метод замены.",
        "validationRule": "Без проверки."
      },
      {
        "screenNumber": 2,
        "screenTitle": "Представим, что все одного типа",
        "screenKind": "hl_method_rule",
        "riskLevel": "low",
        "childAction": "Взаимодействие: hl_method_rule",
        "expectedAnswer": "—",
        "whyThisStepExists": "Шаг runner.",
        "validationRule": "hl_method_rule"
      },
      {
        "screenNumber": 3,
        "screenTitle": "Шаг замены с отрицательными баллами",
        "screenKind": "hl_score_replacement",
        "riskLevel": "low",
        "childAction": "Взаимодействие: hl_score_replacement",
        "expectedAnswer": "—",
        "whyThisStepExists": "Шаг runner.",
        "validationRule": "hl_score_replacement"
      },
      {
        "screenNumber": 4,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 5,
        "screenTitle": "Кто участвует в задаче?",
        "screenKind": "drag_select",
        "riskLevel": "none",
        "childAction": "Выбрать участников задачи",
        "expectedAnswer": "entities из condition",
        "whyThisStepExists": "Модель: кто участвует.",
        "validationRule": "Множественный выбор по entities."
      },
      {
        "screenNumber": 6,
        "screenTitle": "Сколько баллов у каждого?",
        "screenKind": "table_input",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 7,
        "screenTitle": "Собери известные данные",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 8,
        "screenTitle": "Выбери предположение",
        "screenKind": "single_select",
        "riskLevel": "none",
        "childAction": "Представим, что все 10 объектов — …",
        "expectedAnswer": [
          "Неверные ответы"
        ],
        "whyThisStepExists": "Выбор вида для пробной картины.",
        "validationRule": "single_select: correct=Неверные ответы",
        "alternativeValidPath": false
      },
      {
        "screenNumber": 9,
        "screenTitle": "Пробная картина",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 10,
        "screenTitle": "Сравнение и разница",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 11,
        "screenTitle": "Шаг замены и ответ",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 12,
        "screenTitle": "Проверь, что именно спрашивают",
        "screenKind": "hl_score_question_check",
        "riskLevel": "low",
        "childAction": "Взаимодействие: hl_score_question_check",
        "expectedAnswer": "—",
        "whyThisStepExists": "Шаг runner.",
        "validationRule": "hl_score_question_check"
      },
      {
        "screenNumber": 13,
        "screenTitle": "Запиши решение словами",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "7",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 14,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "7",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-4-02",
    "methodTaskId": "4.2",
    "title": "Оценки 2 и 3",
    "primaryMethod": "score_ordinary",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "3",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Представим, что все одного типа",
        "screenKind": "hl_method_rule",
        "riskLevel": "low",
        "childAction": "Взаимодействие: hl_method_rule",
        "expectedAnswer": "—",
        "whyThisStepExists": "Шаг runner.",
        "validationRule": "hl_method_rule"
      },
      {
        "screenNumber": 2,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 3,
        "screenTitle": "Кто участвует в задаче?",
        "screenKind": "drag_select",
        "riskLevel": "none",
        "childAction": "Выбрать участников задачи",
        "expectedAnswer": "entities из condition",
        "whyThisStepExists": "Модель: кто участвует.",
        "validationRule": "Множественный выбор по entities."
      },
      {
        "screenNumber": 4,
        "screenTitle": "Норма у каждого вида",
        "screenKind": "table_input",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 5,
        "screenTitle": "Собери известные данные",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 6,
        "screenTitle": "Выбери предположение",
        "screenKind": "single_select",
        "riskLevel": "none",
        "childAction": "Представим, что все 10 объектов — …",
        "expectedAnswer": [
          "Двойки"
        ],
        "whyThisStepExists": "Выбор вида для пробной картины.",
        "validationRule": "single_select: correct=Двойки",
        "alternativeValidPath": false
      },
      {
        "screenNumber": 7,
        "screenTitle": "Пробная картина",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 8,
        "screenTitle": "Сравнение и разница",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 9,
        "screenTitle": "Шаг замены и ответ",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 10,
        "screenTitle": "Проверь, что именно спрашивают",
        "screenKind": "hl_score_question_check",
        "riskLevel": "low",
        "childAction": "Взаимодействие: hl_score_question_check",
        "expectedAnswer": "—",
        "whyThisStepExists": "Шаг runner.",
        "validationRule": "hl_score_question_check"
      },
      {
        "screenNumber": 11,
        "screenTitle": "Запиши решение словами",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "3",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 12,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "3",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-4-03",
    "methodTaskId": "4.3",
    "title": "Открытки девочкам",
    "primaryMethod": "transfer_replacement",
    "preludeType": "none",
    "solutionMode": "transfer",
    "runner": "HeadsLegsRunner / transfer",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "1",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 2,
        "screenTitle": "Выбери пробное предположение",
        "screenKind": "single_select",
        "riskLevel": "none",
        "childAction": "Какое пробное предположение подходит для этого шага?",
        "expectedAnswer": [
          "Представить, что все девочки получили по 2 открытки."
        ],
        "whyThisStepExists": "Выбор вида для пробной картины.",
        "validationRule": "single_select: correct=Представить, что все девочки получили по 2 открытки.",
        "alternativeValidPath": false
      },
      {
        "screenNumber": 3,
        "screenTitle": "Запиши решение с пропусками",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "1",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 4,
        "screenTitle": "Ответ",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "1",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-4-04",
    "methodTaskId": "4.4",
    "title": "Матчи двух команд",
    "primaryMethod": "score_match_total",
    "preludeType": "none",
    "solutionMode": "match_total",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "4 ничьих",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Представим, что все одного типа",
        "screenKind": "hl_method_rule",
        "riskLevel": "low",
        "childAction": "Взаимодействие: hl_method_rule",
        "expectedAnswer": "—",
        "whyThisStepExists": "Шаг runner.",
        "validationRule": "hl_method_rule"
      },
      {
        "screenNumber": 2,
        "screenTitle": "Сколько очков за матч вместе?",
        "screenKind": "hl_match_total",
        "riskLevel": "low",
        "childAction": "Взаимодействие: hl_match_total",
        "expectedAnswer": "—",
        "whyThisStepExists": "Шаг runner.",
        "validationRule": "hl_match_total"
      },
      {
        "screenNumber": 3,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 4,
        "screenTitle": "Кто участвует в задаче?",
        "screenKind": "drag_select",
        "riskLevel": "none",
        "childAction": "Выбрать участников задачи",
        "expectedAnswer": "entities из condition",
        "whyThisStepExists": "Модель: кто участвует.",
        "validationRule": "Множественный выбор по entities."
      },
      {
        "screenNumber": 5,
        "screenTitle": "Пробная картина",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 6,
        "screenTitle": "Сравнение и разница",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 7,
        "screenTitle": "Шаг замены и ответ",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 8,
        "screenTitle": "Проверь, что именно спрашивают",
        "screenKind": "hl_score_question_check",
        "riskLevel": "low",
        "childAction": "Взаимодействие: hl_score_question_check",
        "expectedAnswer": "—",
        "whyThisStepExists": "Шаг runner.",
        "validationRule": "hl_score_question_check"
      },
      {
        "screenNumber": 9,
        "screenTitle": "Запиши перебор и вывод",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "4 ничьих",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 10,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "4 ничьих",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-4-05",
    "methodTaskId": "4.5",
    "title": "Экзамен Васи",
    "primaryMethod": "score_plus_minus",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / standard",
    "publishRecommendation": "childRoute",
    "expectedAnswer": "23",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 2,
        "screenTitle": "Кто участвует в задаче?",
        "screenKind": "drag_select",
        "riskLevel": "none",
        "childAction": "Выбрать участников задачи",
        "expectedAnswer": "entities из condition",
        "whyThisStepExists": "Модель: кто участвует.",
        "validationRule": "Множественный выбор по entities."
      },
      {
        "screenNumber": 3,
        "screenTitle": "Сколько баллов у каждого?",
        "screenKind": "table_input",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 4,
        "screenTitle": "Собери известные данные",
        "screenKind": "worksheet_table",
        "riskLevel": "low",
        "childAction": "Ввести числа / формулы в таблицу",
        "expectedAnswer": "answers из worksheetRows / table rows",
        "whyThisStepExists": "Пробный расчёт или перенос данных из условия.",
        "validationRule": "Числовое / formula совпадение по строкам."
      },
      {
        "screenNumber": 5,
        "screenTitle": "Проверь, что именно спрашивают",
        "screenKind": "hl_score_question_check",
        "riskLevel": "low",
        "childAction": "Взаимодействие: hl_score_question_check",
        "expectedAnswer": "—",
        "whyThisStepExists": "Шаг runner.",
        "validationRule": "hl_score_question_check"
      },
      {
        "screenNumber": 6,
        "screenTitle": "Шаг замены с отрицательными баллами",
        "screenKind": "hl_score_replacement",
        "riskLevel": "low",
        "childAction": "Взаимодействие: hl_score_replacement",
        "expectedAnswer": "—",
        "whyThisStepExists": "Шаг runner.",
        "validationRule": "hl_score_replacement"
      },
      {
        "screenNumber": 7,
        "screenTitle": "Какой шаг сейчас нужно сделать?",
        "screenKind": "hl_choose_method",
        "riskLevel": "low",
        "childAction": "Выбрать следующий шаг метода из hub (профиль 3+)",
        "expectedAnswer": "Зависит от этапа решения",
        "whyThisStepExists": "Снятие опоры: ребёнок выбирает шаг.",
        "validationRule": "Сопоставление stepId с текущим этапом worksheets."
      },
      {
        "screenNumber": 8,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "23",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "childRoute"
  },
  {
    "taskId": "heads-legs-5-01",
    "methodTaskId": "5.1",
    "title": "Антилопы и единороги",
    "primaryMethod": "feature_switch_then_replace",
    "preludeType": "feature_switch",
    "solutionMode": "standard_replacement",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "reserve",
    "expectedAnswer": "9 единорогов",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "9 единорогов",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "Derive-base кандидат Wave C. Не публиковать до runner."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "reserve"
  },
  {
    "taskId": "heads-legs-5-02",
    "methodTaskId": "5.2",
    "title": "Караван Бант и Джав",
    "primaryMethod": "unit_conversion_then_replace",
    "preludeType": "unit_conversion",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / derive (derive)",
    "publishRecommendation": "reserve",
    "expectedAnswer": "34 Джавов",
    "alternativeValidStrategies": [
      "assume через Банты",
      "assume через Джавы"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 2,
        "screenTitle": "Что сначала нужно получить?",
        "screenKind": "hl_derive_prelude",
        "riskLevel": "none",
        "childAction": "Выбрать prelude-действие, ввести выведенное число, нормы признака и totals",
        "expectedAnswer": "preludeDeriveAnswer + feature norms + totals из ruleInstance",
        "whyThisStepExists": "Prelude типа «unit_conversion» — получить недостающие данные до замены.",
        "validationRule": "Строгое числовое совпадение с ruleInstance / preludeFeatureNorms."
      },
      {
        "screenNumber": 3,
        "screenTitle": "Знакомый метод",
        "screenKind": "hl_intro",
        "riskLevel": "none",
        "childAction": "Прочитать методическую рамку и продолжить",
        "expectedAnswer": "—",
        "whyThisStepExists": "Связка prelude → знакомый метод замены.",
        "validationRule": "Без проверки."
      },
      {
        "screenNumber": 4,
        "screenTitle": "Выбери предположение",
        "screenKind": "hl_dual_path_assume",
        "riskLevel": "none",
        "childAction": "Выбрать вид для пробной картины (оба пути допустимы)",
        "expectedAnswer": [
          "Банты",
          "Джавы"
        ],
        "whyThisStepExists": "Начало метода замены: «представим, что все одного вида».",
        "validationRule": "Оба варианта принимаются; word solution ветвится по выбору.",
        "alternativeValidPath": true,
        "notes": "Исправлено: убран субъективный «удобнее»."
      },
      {
        "screenNumber": 5,
        "screenTitle": "Проверь вопрос задачи",
        "screenKind": "hl_question_check",
        "riskLevel": "none",
        "childAction": "Подтвердить, что именно спрашивает задача",
        "expectedAnswer": "сколько Джав едет на Бантах",
        "whyThisStepExists": "Question-check перед записью ответа.",
        "validationRule": "Подтверждение без альтернатив."
      },
      {
        "screenNumber": 6,
        "screenTitle": "Запиши решение словами",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "34 Джавов",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 7,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "34 Джавов",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [
      "FIXED: dual-path assume + ветвление word solution"
    ],
    "publicationStatus": "reserve"
  },
  {
    "taskId": "heads-legs-5-03",
    "methodTaskId": "5.3",
    "title": "Банты и Ранкоры",
    "primaryMethod": "transfer_replacement",
    "preludeType": "none",
    "solutionMode": "transfer",
    "runner": "HeadsLegsRunner / transfer",
    "publishRecommendation": "publicationCandidate",
    "expectedAnswer": "{\"rankors\":17,\"bants\":12}",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 2,
        "screenTitle": "Выбери метод",
        "screenKind": "single_select",
        "riskLevel": "none",
        "childAction": "Какой метод здесь подходит?",
        "expectedAnswer": [
          "А. Представить, что все существа одного вида."
        ],
        "whyThisStepExists": "Проверка понимания / выбор метода.",
        "validationRule": "single_select: correct=А. Представить, что все существа одного вида.",
        "alternativeValidPath": false
      },
      {
        "screenNumber": 3,
        "screenTitle": "Запиши решение с пропусками",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "{\"rankors\":17,\"bants\":12}",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 4,
        "screenTitle": "Ответ",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "{\"rankors\":17,\"bants\":12}",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "publicationCandidate"
  },
  {
    "taskId": "heads-legs-5-04",
    "methodTaskId": "5.4",
    "title": "Имперские истребители и X-Wing",
    "primaryMethod": "compare_after_replacement",
    "preludeType": "none",
    "solutionMode": "compare_results",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "reserve",
    "expectedAnswer": "2 имперских больше",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "2 имперских больше",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "Стандартная замена + compare."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "reserve"
  },
  {
    "taskId": "heads-legs-5-05",
    "methodTaskId": "5.5",
    "title": "Водолазы и осьминоги",
    "primaryMethod": "limb_decompose",
    "preludeType": "limb_decompose",
    "solutionMode": "unsupported_for_now",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "blocked",
    "expectedAnswer": "7 осьминогов",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "7 осьминогов",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "methodistOnly/blocked. Не reserve."
      }
    ],
    "validationRisks": [
      "blocked — не должна открываться в childRoute"
    ],
    "requiredFixes": [],
    "publicationStatus": "blocked"
  },
  {
    "taskId": "heads-legs-5-06",
    "methodTaskId": "5.6",
    "title": "Световые мечи",
    "primaryMethod": "common_resource_then_replace",
    "preludeType": "common_resource",
    "solutionMode": "standard_replacement",
    "runner": "HeadsLegsRunner / derive (derive)",
    "publishRecommendation": "publicationCandidate",
    "expectedAnswer": "2 мечей Джедаев",
    "alternativeValidStrategies": [
      "assume через мечи Джедаев",
      "assume через мечи Ситхов"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Прочитай условие",
        "screenKind": "read_condition",
        "riskLevel": "none",
        "childAction": "Прочитать условие и нажать «Прочитал, дальше»",
        "expectedAnswer": "—",
        "whyThisStepExists": "Ориентация в задаче перед методом.",
        "validationRule": "Кнопка продолжения без проверки содержания."
      },
      {
        "screenNumber": 2,
        "screenTitle": "Что сначала нужно получить?",
        "screenKind": "hl_derive_prelude",
        "riskLevel": "none",
        "childAction": "Выбрать prelude-действие, ввести выведенное число, нормы признака и totals",
        "expectedAnswer": "preludeDeriveAnswer + feature norms + totals из ruleInstance",
        "whyThisStepExists": "Prelude типа «common_resource» — получить недостающие данные до замены.",
        "validationRule": "Строгое числовое совпадение с ruleInstance / preludeFeatureNorms."
      },
      {
        "screenNumber": 3,
        "screenTitle": "Знакомый метод",
        "screenKind": "hl_intro",
        "riskLevel": "none",
        "childAction": "Прочитать методическую рамку и продолжить",
        "expectedAnswer": "—",
        "whyThisStepExists": "Связка prelude → знакомый метод замены.",
        "validationRule": "Без проверки."
      },
      {
        "screenNumber": 4,
        "screenTitle": "Выбери предположение",
        "screenKind": "hl_dual_path_assume",
        "riskLevel": "none",
        "childAction": "Выбрать вид для пробной картины (оба пути допустимы)",
        "expectedAnswer": [
          "мечи Джедаев",
          "мечи Ситхов"
        ],
        "whyThisStepExists": "Начало метода замены: «представим, что все одного вида».",
        "validationRule": "Оба варианта принимаются; word solution ветвится по выбору.",
        "alternativeValidPath": true,
        "notes": "Исправлено: убран субъективный «удобнее»."
      },
      {
        "screenNumber": 5,
        "screenTitle": "Проверь вопрос задачи",
        "screenKind": "hl_question_check",
        "riskLevel": "none",
        "childAction": "Подтвердить, что именно спрашивает задача",
        "expectedAnswer": "сколько мечей Джедаев изготовил мастер",
        "whyThisStepExists": "Question-check перед записью ответа.",
        "validationRule": "Подтверждение без альтернатив."
      },
      {
        "screenNumber": 6,
        "screenTitle": "Запиши решение словами",
        "screenKind": "word_solution",
        "riskLevel": "low",
        "childAction": "Заполнить пропуски в тексте решения",
        "expectedAnswer": "2 мечей Джедаев",
        "whyThisStepExists": "Развёрнутая запись метода замены.",
        "validationRule": "validateWordSolutionFull: blanks + expression format"
      },
      {
        "screenNumber": 7,
        "screenTitle": "Что мы сделали?",
        "screenKind": "auto_explanation",
        "riskLevel": "none",
        "childAction": "Прочитать эталон решения",
        "expectedAnswer": "2 мечей Джедаев",
        "whyThisStepExists": "Preview / ответ после записи.",
        "validationRule": "Без проверки."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [
      "FIXED: dual-path assume + ветвление word solution"
    ],
    "publicationStatus": "publicationCandidate"
  },
  {
    "taskId": "heads-legs-5-07",
    "methodTaskId": "5.7",
    "title": "Падаваны, Джедаи и Ситхи",
    "primaryMethod": "key_condition_equality",
    "preludeType": "key_condition_equality",
    "solutionMode": "unsupported_for_now",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "blocked",
    "expectedAnswer": "{\"sith\":7,\"jedi\":14}",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "{\"sith\":7,\"jedi\":14}",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "Blocked до ratio runner или algebra."
      }
    ],
    "validationRisks": [
      "blocked — не должна открываться в childRoute"
    ],
    "requiredFixes": [],
    "publicationStatus": "blocked"
  },
  {
    "taskId": "heads-legs-6-01",
    "methodTaskId": "6.1",
    "title": "Дарт Вейдер и пленники",
    "primaryMethod": "triple_type_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "reserve",
    "expectedAnswer": "228 генералов",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "228 генералов",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "228 генералов — исправленный вопрос."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "reserve"
  },
  {
    "taskId": "heads-legs-6-02",
    "methodTaskId": "6.2",
    "title": "Дроиды на Звезде Смерти",
    "primaryMethod": "triple_type_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "reserve",
    "expectedAnswer": "{\"mechanics\":13,\"medics\":13,\"soldiers\":66}",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "{\"mechanics\":13,\"medics\":13,\"soldiers\":66}",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "Reserve stage 6."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "reserve"
  },
  {
    "taskId": "heads-legs-6-03",
    "methodTaskId": "6.3",
    "title": "Залпы по кораблям",
    "primaryMethod": "multiple_answers",
    "preludeType": "none",
    "solutionMode": "multiple_answers",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "reserve",
    "expectedAnswer": "3 вариант(ов)",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "3 вариант(ов)",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "3 допустимых состава флота."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "reserve"
  },
  {
    "taskId": "heads-legs-6-04",
    "methodTaskId": "6.4",
    "title": "Столы с ящиками",
    "primaryMethod": "triple_type_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "reserve",
    "expectedAnswer": "3",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "3",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "Reserve."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "reserve"
  },
  {
    "taskId": "heads-legs-3-01",
    "methodTaskId": "3.1",
    "title": "Третьеклассники и пятиклассники",
    "primaryMethod": "diagnostic_incomplete",
    "preludeType": "missing_total_objects",
    "solutionMode": "diagnostic",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "reserve",
    "expectedAnswer": "диагностический вывод",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "диагностический вывод",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "Данных не хватает без допущения. Не replacement в лоб."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "reserve"
  },
  {
    "taskId": "heads-legs-6-05",
    "methodTaskId": "6.5",
    "title": "Йода, Оби-Ван и Квай-Гон",
    "primaryMethod": "multiple_answers",
    "preludeType": "none",
    "solutionMode": "multiple_answers",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "reserve",
    "expectedAnswer": "3 вариант(ов)",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "3 вариант(ов)",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "Несколько распределений лет обучения."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "reserve"
  },
  {
    "taskId": "heads-legs-7-06",
    "methodTaskId": "7.6",
    "title": "Одноголовые сороконожки и пятиголовые драконы",
    "primaryMethod": "diagnostic_incomplete",
    "preludeType": "missing_total_objects",
    "solutionMode": "diagnostic",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "methodistOnly",
    "expectedAnswer": "диагностический вывод",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "диагностический вывод",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "Диагностика: данных не хватает для unique answer."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "methodistOnly"
  },
  {
    "taskId": "heads-legs-7-01",
    "methodTaskId": "7.1",
    "title": "Утята и утконосики",
    "primaryMethod": "key_condition_equality",
    "preludeType": "key_condition_equality",
    "solutionMode": "standard_replacement",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "reserve",
    "expectedAnswer": "{\"ducklings\":222,\"platypus\":111}",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "{\"ducklings\":222,\"platypus\":111}",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "Stage 7 — ключевое условие."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "reserve"
  },
  {
    "taskId": "heads-legs-7-02",
    "methodTaskId": "7.2",
    "title": "Трехколесные и четырехколесные велосипеды",
    "primaryMethod": "key_condition_equality",
    "preludeType": "key_condition_equality",
    "solutionMode": "standard_replacement",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "reserve",
    "expectedAnswer": "{\"threeWheel\":16,\"fourWheel\":12}",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "{\"threeWheel\":16,\"fourWheel\":12}",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "Reserve stage 7."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "reserve"
  },
  {
    "taskId": "heads-legs-7-03",
    "methodTaskId": "7.3",
    "title": "Треугольники и пятиугольники",
    "primaryMethod": "standard_replacement",
    "preludeType": "none",
    "solutionMode": "standard_replacement",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "reserve",
    "expectedAnswer": "14 фигур",
    "alternativeValidStrategies": [
      "Второй assume-путь возможен математически — проверить single_select assume"
    ],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "14 фигур",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "Algebra candidate сильный."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "reserve"
  },
  {
    "taskId": "heads-legs-7-04",
    "methodTaskId": "7.4",
    "title": "Двухголовые сороконожки и трехголовые драконы",
    "primaryMethod": "key_condition_equality",
    "preludeType": "key_condition_equality",
    "solutionMode": "standard_replacement",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "reserve",
    "expectedAnswer": "6 ног у дракона",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "6 ног у дракона",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "Structural custom."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "reserve"
  },
  {
    "taskId": "heads-legs-7-05",
    "methodTaskId": "7.5",
    "title": "Одноголовые сороконожки и четырехголовые драконы",
    "primaryMethod": "key_condition_equality",
    "preludeType": "key_condition_equality",
    "solutionMode": "standard_replacement",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "reserve",
    "expectedAnswer": "10 ног у дракона",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "10 ног у дракона",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "25 существ, головы поровну."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "reserve"
  },
  {
    "taskId": "heads-legs-7-07",
    "methodTaskId": "7.7",
    "title": "Лошади и верблюды",
    "primaryMethod": "key_condition_equality",
    "preludeType": "key_condition_equality",
    "solutionMode": "standard_replacement",
    "runner": "DigitalTaskPlayer (legacy)",
    "publishRecommendation": "reserve",
    "expectedAnswer": "20 животных",
    "alternativeValidStrategies": [],
    "screens": [
      {
        "screenNumber": 1,
        "screenTitle": "Legacy DigitalTaskPlayer",
        "screenKind": "legacy_digital",
        "childAction": "Прохождение legacy-шагов из task.steps",
        "expectedAnswer": "20 животных",
        "whyThisStepExists": "Reserve / blocked — unified runner не подключён.",
        "validationRule": "Legacy step validators",
        "riskLevel": "low",
        "notes": "Stage 7 финал."
      }
    ],
    "validationRisks": [],
    "requiredFixes": [],
    "publicationStatus": "reserve"
  }
] as TaskScreenMethodologyAudit[];

export function getScreenMethodologyAudit(taskIdOrMethodId: string): TaskScreenMethodologyAudit | undefined {
  return HEADS_LEGS_SCREEN_METHODOLOGY_AUDIT.find(
    (r) => r.taskId === taskIdOrMethodId || r.methodTaskId === taskIdOrMethodId,
  );
}
