# Экранный аудит методологии «Головы и ноги» (51 задача)

Сгенерировано из player steps + канонической карты методов.

Перегенерация: `npm run generate:heads-legs-screen-audit`

Проверка: `npm run audit:heads-legs-screens`

## 1.1 — Звери и птицы

| Поле | Значение |
|---|---|
| taskId | `heads-legs-1-01` |
| primaryMethod | standard_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | {"type1":20,"type2":10} |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Объяснение метода | hl_intro | — | none |
| 2 | Представим, что все одного вида | hl_method_rule | — | low |
| 3 | Прочитай условие | read_condition | — | none |
| 4 | Кто участвует в задаче? | drag_select | entities из condition | none |
| 5 | Сколько ног у каждого? | table_input | answers из worksheetRows / table rows | low |
| 6 | Собери известные данные | worksheet_table | answers из worksheetRows / table rows | low |
| 7 | Выбери предположение | single_select | Птицы | medium |
| 8 | Пробная картина | worksheet_table | answers из worksheetRows / table rows | low |
| 9 | Сравнение и разница | worksheet_table | answers из worksheetRows / table rows | low |
| 10 | Шаг замены и ответ | worksheet_table | answers из worksheetRows / table rows | low |
| 11 | Запиши решение словами | word_solution | {"type1":20,"type2":10} | low |
| 12 | Что мы сделали? | auto_explanation | {"type1":20,"type2":10} | none |

## 1.2 — Цыплята и змеи

| Поле | Значение |
|---|---|
| taskId | `heads-legs-1-02` |
| primaryMethod | standard_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | 39 |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Представим, что все одного вида | hl_method_rule | — | low |
| 2 | Прочитай условие | read_condition | — | none |
| 3 | Кто участвует в задаче? | drag_select | entities из condition | none |
| 4 | Выбери предположение | single_select | Змеи | medium |
| 5 | Пробная картина | worksheet_table | answers из worksheetRows / table rows | low |
| 6 | Сравнение и разница | worksheet_table | answers из worksheetRows / table rows | low |
| 7 | Шаг замены и ответ | worksheet_table | answers из worksheetRows / table rows | low |
| 8 | Запиши решение словами | word_solution | 39 | low |
| 9 | Что мы сделали? | auto_explanation | 39 | none |

## 1.3 — Гусята и крокодильчики

| Поле | Значение |
|---|---|
| taskId | `heads-legs-1-03` |
| primaryMethod | standard_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | {"geese":150,"crocodiles":50} |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Представим, что все одного вида | hl_method_rule | — | low |
| 2 | Прочитай условие | read_condition | — | none |
| 3 | Кто участвует в задаче? | drag_select | entities из condition | none |
| 4 | Сколько ног у каждого? | table_input | answers из worksheetRows / table rows | low |
| 5 | Собери известные данные | worksheet_table | answers из worksheetRows / table rows | low |
| 6 | Выбери предположение | single_select | Гусята | medium |
| 7 | Пробная картина | worksheet_table | answers из worksheetRows / table rows | low |
| 8 | Сравнение и разница | worksheet_table | answers из worksheetRows / table rows | low |
| 9 | Шаг замены и ответ | worksheet_table | answers из worksheetRows / table rows | low |
| 10 | Запиши решение словами | word_solution | {"geese":150,"crocodiles":50} | low |
| 11 | Что мы сделали? | auto_explanation | {"geese":150,"crocodiles":50} | none |

## 1.4 — Жуки и пауки

| Поле | Значение |
|---|---|
| taskId | `heads-legs-1-04` |
| primaryMethod | standard_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | {"beetles":25,"spiders":15} |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Прочитай условие | read_condition | — | none |
| 2 | Кто участвует в задаче? | drag_select | entities из condition | none |
| 3 | Сколько ног у каждого? | table_input | answers из worksheetRows / table rows | low |
| 4 | Собери известные данные | worksheet_table | answers из worksheetRows / table rows | low |
| 5 | Какой шаг сейчас нужно сделать? | hl_choose_method | Зависит от этапа решения | low |
| 6 | Что мы сделали? | auto_explanation | {"beetles":25,"spiders":15} | none |

## 1.6 — Велосипедисты

| Поле | Значение |
|---|---|
| taskId | `heads-legs-1-06` |
| primaryMethod | standard_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | 3 двухколёсных |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Прочитай условие | read_condition | — | none |
| 2 | Запиши решение словами | word_solution | 3 двухколёсных | low |
| 3 | Что мы сделали? | auto_explanation | 3 двухколёсных | none |

## 1.7 — Велосипеды на парковке

| Поле | Значение |
|---|---|
| taskId | `heads-legs-1-07` |
| primaryMethod | standard_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | 4 трёхколёсных |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Прочитай условие | read_condition | — | none |
| 2 | Запиши решение словами | word_solution | 4 трёхколёсных | low |
| 3 | Что мы сделали? | auto_explanation | 4 трёхколёсных | none |

## 1.10 — Гномы и пони

| Поле | Значение |
|---|---|
| taskId | `heads-legs-1-10` |
| primaryMethod | standard_replacement |
| preludeType | derive_total_objects |
| solutionMode | standard_replacement |
| runner | DigitalTaskPlayer (legacy) |
| publish | reserve |
| expectedAnswer | {"gnomes":7,"ponies":10} |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | {"gnomes":7,"ponies":10} | low |

## 1.5 — Жуки и пауки: правые ноги

| Поле | Значение |
|---|---|
| taskId | `heads-legs-1-05` |
| primaryMethod | derived_feature |
| preludeType | derived_half_feature |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | {"beetles":38,"spiders":32} |
| alternativeStrategies | — |
| validationRisks | Кто участвует в задаче?: Для derive-задач шаг «кто участвует» не должен показываться |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Прочитай условие | read_condition | — | none |
| 2 | Кто участвует в задаче? | drag_select | entities из condition | medium |
| 3 | Норма у каждого вида | table_input | answers из worksheetRows / table rows | low |
| 4 | Собери известные данные | worksheet_table | answers из worksheetRows / table rows | low |
| 5 | Какой шаг сейчас нужно сделать? | hl_choose_method | Зависит от этапа решения | low |
| 6 | Что мы сделали? | auto_explanation | {"beetles":38,"spiders":32} | none |

## 1.8 — Мухи и слоны

| Поле | Значение |
|---|---|
| taskId | `heads-legs-1-08` |
| primaryMethod | text_ratio_answer |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | DigitalTaskPlayer (legacy) |
| publish | childRoute |
| expectedAnswer | 4:6 |
| alternativeStrategies | — |
| validationRisks | Legacy DigitalTaskPlayer: Ответ текстом «4:6», не два числа. Нужен отдельный answerTransform text. |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | 4:6 | high |

## 1.13 — Роботы AT-ST и AT-AT

| Поле | Значение |
|---|---|
| taskId | `heads-legs-1-13` |
| primaryMethod | standard_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | DigitalTaskPlayer (legacy) |
| publish | reserve |
| expectedAnswer | {"atst":9,"atat":3} |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | {"atst":9,"atat":3} | low |

## 2.1 — Клумбы около Лицея и Гимназии

| Поле | Значение |
|---|---|
| taskId | `heads-legs-2-01` |
| primaryMethod | value_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | {"lyceum":4,"gymnasium":7} |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Объяснение метода | hl_intro | — | none |
| 2 | Представим, что все одного вида | hl_method_rule | — | low |
| 3 | Прочитай условие | read_condition | — | none |
| 4 | Что участвует в задаче? | drag_select | entities из condition | none |
| 5 | Сколько цветков на клумбе у каждого? | table_input | answers из worksheetRows / table rows | low |
| 6 | Собери известные данные | worksheet_table | answers из worksheetRows / table rows | low |
| 7 | Выбери предположение | single_select | Клумбы у Лицея | medium |
| 8 | Пробная картина | worksheet_table | answers из worksheetRows / table rows | low |
| 9 | Сравнение и разница | worksheet_table | answers из worksheetRows / table rows | low |
| 10 | Шаг замены и ответ | worksheet_table | answers из worksheetRows / table rows | low |
| 11 | Проверь, что именно спрашивают | hl_question_check | сколько клумб около Лицея и сколько около Гимназии | none |
| 12 | Запиши решение словами | word_solution | {"lyceum":4,"gymnasium":7} | low |
| 13 | Что мы сделали? | auto_explanation | {"lyceum":4,"gymnasium":7} | none |

## 2.2 — Коробки с карандашами

| Поле | Значение |
|---|---|
| taskId | `heads-legs-2-02` |
| primaryMethod | value_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | {"large":15,"small":5} |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Представим, что все одного вида | hl_method_rule | — | low |
| 2 | Прочитай условие | read_condition | — | none |
| 3 | Что участвует в задаче? | drag_select | entities из condition | none |
| 4 | Сколько карандашей у каждого? | table_input | answers из worksheetRows / table rows | low |
| 5 | Собери известные данные | worksheet_table | answers из worksheetRows / table rows | low |
| 6 | Выбери предположение | single_select | Маленькие коробки | medium |
| 7 | Пробная картина | worksheet_table | answers из worksheetRows / table rows | low |
| 8 | Сравнение и разница | worksheet_table | answers из worksheetRows / table rows | low |
| 9 | Шаг замены и ответ | worksheet_table | answers из worksheetRows / table rows | low |
| 10 | Проверь, что именно спрашивают | hl_question_check | сколько больших и сколько маленьких коробок | none |
| 11 | Запиши решение словами | word_solution | {"large":15,"small":5} | low |
| 12 | Что мы сделали? | auto_explanation | {"large":15,"small":5} | none |

## 2.3 — Дроны-рабочие и дроны-пастухи

| Поле | Значение |
|---|---|
| taskId | `heads-legs-2-03` |
| primaryMethod | value_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | {"workers":63,"shepherds":75} |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Представим, что все одного вида | hl_method_rule | — | low |
| 2 | Прочитай условие | read_condition | — | none |
| 3 | Кто участвует в задаче? | drag_select | entities из condition | none |
| 4 | Сколько кредитов у каждого? | table_input | answers из worksheetRows / table rows | low |
| 5 | Собери известные данные | worksheet_table | answers из worksheetRows / table rows | low |
| 6 | Выбери предположение | single_select | Дроны-пастухи | medium |
| 7 | Пробная картина | worksheet_table | answers из worksheetRows / table rows | low |
| 8 | Сравнение и разница | worksheet_table | answers из worksheetRows / table rows | low |
| 9 | Шаг замены и ответ | worksheet_table | answers из worksheetRows / table rows | low |
| 10 | Проверь, что именно спрашивают | hl_question_check | сколько дронов каждого вида он купил | none |
| 11 | Запиши решение словами | word_solution | {"workers":63,"shepherds":75} | low |
| 12 | Что мы сделали? | auto_explanation | {"workers":63,"shepherds":75} | none |

## 2.4 — Пирожные по 100 и 125 рублей

| Поле | Значение |
|---|---|
| taskId | `heads-legs-2-04` |
| primaryMethod | value_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | 20 |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Прочитай условие | read_condition | — | none |
| 2 | Кто участвует в задаче? | drag_select | entities из condition | none |
| 3 | Сколько цена у каждого? | table_input | answers из worksheetRows / table rows | low |
| 4 | Собери известные данные | worksheet_table | answers из worksheetRows / table rows | low |
| 5 | Какой шаг сейчас нужно сделать? | hl_choose_method | Зависит от этапа решения | low |
| 6 | Что мы сделали? | auto_explanation | 20 | none |

## 2.5 — Коробки простых и цветных карандашей

| Поле | Значение |
|---|---|
| taskId | `heads-legs-2-05` |
| primaryMethod | value_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | 340 |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Прочитай условие | read_condition | — | none |
| 2 | Что участвует в задаче? | drag_select | entities из condition | none |
| 3 | Сколько карандашей у каждого? | table_input | answers из worksheetRows / table rows | low |
| 4 | Собери известные данные | worksheet_table | answers из worksheetRows / table rows | low |
| 5 | Какой шаг сейчас нужно сделать? | hl_choose_method | Зависит от этапа решения | low |
| 6 | Что мы сделали? | auto_explanation | 340 | none |

## 2.6 — Львята и тигрята

| Поле | Значение |
|---|---|
| taskId | `heads-legs-2-06` |
| primaryMethod | value_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | 10 тигрят |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Прочитай условие | read_condition | — | none |
| 2 | Запиши решение словами | word_solution | 10 тигрят | low |
| 3 | Что мы сделали? | auto_explanation | 10 тигрят | none |

## 2.7 — Собаки и кошки

| Поле | Значение |
|---|---|
| taskId | `heads-legs-2-07` |
| primaryMethod | value_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | {"dogs":6,"cats":4} |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Прочитай условие | read_condition | — | none |
| 2 | Запиши решение словами | word_solution | {"dogs":6,"cats":4} | low |
| 3 | Что мы сделали? | auto_explanation | {"dogs":6,"cats":4} | none |

## 1.9 — Дроиды и генерал Гривус

| Поле | Значение |
|---|---|
| taskId | `heads-legs-1-09` |
| primaryMethod | multi_limb_constraint |
| preludeType | multi_feature_balance |
| solutionMode | standard_replacement |
| runner | DigitalTaskPlayer (legacy) |
| publish | reserve |
| expectedAnswer | 7 дроидов |
| alternativeStrategies | — |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | 7 дроидов | low |

## 1.11 — Жирафы и страусы

| Поле | Значение |
|---|---|
| taskId | `heads-legs-1-11` |
| primaryMethod | compare_after_replacement |
| preludeType | none |
| solutionMode | compare_results |
| runner | DigitalTaskPlayer (legacy) |
| publish | reserve |
| expectedAnswer | 12 на сколько больше страусов |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | 12 на сколько больше страусов | low |

## 1.14 — Табуретки и стулья

| Поле | Значение |
|---|---|
| taskId | `heads-legs-1-14` |
| primaryMethod | standard_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | DigitalTaskPlayer (legacy) |
| publish | reserve |
| expectedAnswer | {"stools":12,"chairs":10} |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | {"stools":12,"chairs":10} | low |

## 3.2 — Пирожки мальчиков и девочек

| Поле | Значение |
|---|---|
| taskId | `heads-legs-3-02` |
| primaryMethod | enumeration |
| preludeType | missing_total_objects |
| solutionMode | enumeration |
| runner | HeadsLegsRunner / enumeration |
| publish | childRoute |
| expectedAnswer | {"boys":3,"girls":2} |
| alternativeStrategies | — |
| validationRisks | Кто участвует в задаче?: Для derive-задач шаг «кто участвует» не должен показываться |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Представим, что все сделали одинаково | hl_method_rule | — | low |
| 2 | Прочитай условие | read_condition | — | none |
| 3 | Кто участвует в задаче? | drag_select | entities из condition | medium |
| 4 | Сколько всего пирожков | worksheet_table | answers из worksheetRows / table rows | low |
| 5 | Оба вида участвуют | auto_explanation | {"boys":3,"girls":2} | none |
| 6 | Перебор: сколько мальчиков? | worksheet_table | answers из worksheetRows / table rows | low |
| 7 | Проверка | worksheet_table | answers из worksheetRows / table rows | low |
| 8 | Проверь, что именно спрашивают | hl_question_check | сколько мальчиков и сколько девочек | none |
| 9 | Запиши перебор и вывод | word_solution | {"boys":3,"girls":2} | low |
| 10 | Что мы сделали? | auto_explanation | {"boys":3,"girls":2} | none |

## 3.3 — Конфеты в классе

| Поле | Значение |
|---|---|
| taskId | `heads-legs-3-03` |
| primaryMethod | production_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | 15 девочек |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Объяснение метода | hl_intro | — | none |
| 2 | Представим, что все сделали одинаково | hl_method_rule | — | low |
| 3 | Прочитай условие | read_condition | — | none |
| 4 | Кто участвует в задаче? | drag_select | entities из condition | none |
| 5 | Сколько конфет у каждого? | table_input | answers из worksheetRows / table rows | low |
| 6 | Собери известные данные | worksheet_table | answers из worksheetRows / table rows | low |
| 7 | Выбери предположение | single_select | Мальчики | medium |
| 8 | Пробная картина | worksheet_table | answers из worksheetRows / table rows | low |
| 9 | Сравнение и разница | worksheet_table | answers из worksheetRows / table rows | low |
| 10 | Шаг замены и ответ | worksheet_table | answers из worksheetRows / table rows | low |
| 11 | Проверь, что именно спрашивают | hl_question_check | сколько девочек в классе | none |
| 12 | Запиши решение словами | word_solution | 15 девочек | low |
| 13 | Что мы сделали? | auto_explanation | 15 девочек | none |

## 3.4 — Снежинки

| Поле | Значение |
|---|---|
| taskId | `heads-legs-3-04` |
| primaryMethod | production_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | {"boys":10,"girls":20} |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Представим, что все сделали одинаково | hl_method_rule | — | low |
| 2 | Прочитай условие | read_condition | — | none |
| 3 | Кто участвует в задаче? | drag_select | entities из condition | none |
| 4 | Сколько снежинок у каждого? | table_input | answers из worksheetRows / table rows | low |
| 5 | Собери известные данные | worksheet_table | answers из worksheetRows / table rows | low |
| 6 | Выбери предположение | single_select | Мальчики | medium |
| 7 | Пробная картина | worksheet_table | answers из worksheetRows / table rows | low |
| 8 | Сравнение и разница | worksheet_table | answers из worksheetRows / table rows | low |
| 9 | Шаг замены и ответ | worksheet_table | answers из worksheetRows / table rows | low |
| 10 | Проверь, что именно спрашивают | hl_question_check | сколько мальчиков и сколько девочек | none |
| 11 | Запиши решение словами | word_solution | {"boys":10,"girls":20} | low |
| 12 | Что мы сделали? | auto_explanation | {"boys":10,"girls":20} | none |

## 3.5 — Совята и котята

| Поле | Значение |
|---|---|
| taskId | `heads-legs-3-05` |
| primaryMethod | compare_after_replacement |
| preludeType | none |
| solutionMode | compare_results |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | 4 мышей больше у котят |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Прочитай условие | read_condition | — | none |
| 2 | Кто участвует в задаче? | drag_select | entities из condition | none |
| 3 | Сколько мышей у каждого? | table_input | answers из worksheetRows / table rows | low |
| 4 | Собери известные данные | worksheet_table | answers из worksheetRows / table rows | low |
| 5 | На что отвечаем? | single_select | Сколько мышей поймали | none |
| 6 | Главный вопрос задачи | auto_explanation | 4 мышей больше у котят | none |
| 7 | Сравни, кто поймал больше мышей | worksheet_table | answers из worksheetRows / table rows | low |
| 8 | Кто поймал больше? | single_select | Котята — на 4 мышки больше | none |
| 9 | Какой шаг сейчас нужно сделать? | hl_choose_method | Зависит от этапа решения | low |
| 10 | Что мы сделали? | auto_explanation | 4 мышей больше у котят | none |

## 3.6 — Ученики съели конфеты

| Поле | Значение |
|---|---|
| taskId | `heads-legs-3-06` |
| primaryMethod | production_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | {"boys":15,"girls":10} |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Прочитай условие | read_condition | — | none |
| 2 | Запиши решение словами | word_solution | {"boys":15,"girls":10} | low |
| 3 | Что мы сделали? | auto_explanation | {"boys":15,"girls":10} | none |

## 3.7 — Яблоки на варенье

| Поле | Значение |
|---|---|
| taskId | `heads-legs-3-07` |
| primaryMethod | diagnostic_incomplete |
| preludeType | missing_total_objects |
| solutionMode | diagnostic |
| runner | HeadsLegsRunner / multiple_answers |
| publish | childRoute |
| expectedAnswer | 2 вариант(ов) |
| alternativeStrategies | — |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Прочитай условие | read_condition | — | none |
| 2 | Данные из условия | worksheet_table | answers из worksheetRows / table rows | low |
| 3 | Перебор мальчиков | auto_explanation | 2 вариант(ов) | none |
| 4 | Может ли быть 0 девочек? | single_select | Нет — девочек должно быть больше 0 | none |
| 5 | Вариант 1: один мальчик | worksheet_table | answers из worksheetRows / table rows | low |
| 6 | Вариант 2: три мальчика | worksheet_table | answers из worksheetRows / table rows | low |
| 7 | Сколько могло быть девочек? | single_select | 5 или 2 девочки | none |
| 8 | Запиши диагностический вывод | word_solution | 2 вариант(ов) | low |
| 9 | Что мы сделали? | auto_explanation | 2 вариант(ов) | none |

## 4.1 — Петя на турнире

| Поле | Значение |
|---|---|
| taskId | `heads-legs-4-01` |
| primaryMethod | score_plus_minus |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | 7 |
| alternativeStrategies | — |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Объяснение метода | hl_intro | — | none |
| 2 | Представим, что все одного типа | hl_method_rule | — | low |
| 3 | Шаг замены с отрицательными баллами | hl_score_replacement | — | low |
| 4 | Прочитай условие | read_condition | — | none |
| 5 | Кто участвует в задаче? | drag_select | entities из condition | none |
| 6 | Сколько баллов у каждого? | table_input | answers из worksheetRows / table rows | low |
| 7 | Собери известные данные | worksheet_table | answers из worksheetRows / table rows | low |
| 8 | Выбери предположение | single_select | Неверные ответы | none |
| 9 | Пробная картина | worksheet_table | answers из worksheetRows / table rows | low |
| 10 | Сравнение и разница | worksheet_table | answers из worksheetRows / table rows | low |
| 11 | Шаг замены и ответ | worksheet_table | answers из worksheetRows / table rows | low |
| 12 | Проверь, что именно спрашивают | hl_score_question_check | — | low |
| 13 | Запиши решение словами | word_solution | 7 | low |
| 14 | Что мы сделали? | auto_explanation | 7 | none |

## 4.2 — Оценки 2 и 3

| Поле | Значение |
|---|---|
| taskId | `heads-legs-4-02` |
| primaryMethod | score_ordinary |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | 3 |
| alternativeStrategies | — |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Представим, что все одного типа | hl_method_rule | — | low |
| 2 | Прочитай условие | read_condition | — | none |
| 3 | Кто участвует в задаче? | drag_select | entities из condition | none |
| 4 | Норма у каждого вида | table_input | answers из worksheetRows / table rows | low |
| 5 | Собери известные данные | worksheet_table | answers из worksheetRows / table rows | low |
| 6 | Выбери предположение | single_select | Двойки | none |
| 7 | Пробная картина | worksheet_table | answers из worksheetRows / table rows | low |
| 8 | Сравнение и разница | worksheet_table | answers из worksheetRows / table rows | low |
| 9 | Шаг замены и ответ | worksheet_table | answers из worksheetRows / table rows | low |
| 10 | Проверь, что именно спрашивают | hl_score_question_check | — | low |
| 11 | Запиши решение словами | word_solution | 3 | low |
| 12 | Что мы сделали? | auto_explanation | 3 | none |

## 4.3 — Открытки девочкам

| Поле | Значение |
|---|---|
| taskId | `heads-legs-4-03` |
| primaryMethod | transfer_replacement |
| preludeType | none |
| solutionMode | transfer |
| runner | HeadsLegsRunner / transfer |
| publish | childRoute |
| expectedAnswer | 1 |
| alternativeStrategies | — |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Прочитай условие | read_condition | — | none |
| 2 | Выбери пробное предположение | single_select | Представить, что все девочки получили по 2 открытки. | none |
| 3 | Запиши решение с пропусками | word_solution | 1 | low |
| 4 | Ответ | auto_explanation | 1 | none |

## 4.4 — Матчи двух команд

| Поле | Значение |
|---|---|
| taskId | `heads-legs-4-04` |
| primaryMethod | score_match_total |
| preludeType | none |
| solutionMode | match_total |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | 4 ничьих |
| alternativeStrategies | — |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Представим, что все одного типа | hl_method_rule | — | low |
| 2 | Сколько очков за матч вместе? | hl_match_total | — | low |
| 3 | Прочитай условие | read_condition | — | none |
| 4 | Кто участвует в задаче? | drag_select | entities из condition | none |
| 5 | Пробная картина | worksheet_table | answers из worksheetRows / table rows | low |
| 6 | Сравнение и разница | worksheet_table | answers из worksheetRows / table rows | low |
| 7 | Шаг замены и ответ | worksheet_table | answers из worksheetRows / table rows | low |
| 8 | Проверь, что именно спрашивают | hl_score_question_check | — | low |
| 9 | Запиши перебор и вывод | word_solution | 4 ничьих | low |
| 10 | Что мы сделали? | auto_explanation | 4 ничьих | none |

## 4.5 — Экзамен Васи

| Поле | Значение |
|---|---|
| taskId | `heads-legs-4-05` |
| primaryMethod | score_plus_minus |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / standard |
| publish | childRoute |
| expectedAnswer | 23 |
| alternativeStrategies | — |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Прочитай условие | read_condition | — | none |
| 2 | Кто участвует в задаче? | drag_select | entities из condition | none |
| 3 | Сколько баллов у каждого? | table_input | answers из worksheetRows / table rows | low |
| 4 | Собери известные данные | worksheet_table | answers из worksheetRows / table rows | low |
| 5 | Проверь, что именно спрашивают | hl_score_question_check | — | low |
| 6 | Шаг замены с отрицательными баллами | hl_score_replacement | — | low |
| 7 | Какой шаг сейчас нужно сделать? | hl_choose_method | Зависит от этапа решения | low |
| 8 | Что мы сделали? | auto_explanation | 23 | none |

## 5.1 — Антилопы и единороги

| Поле | Значение |
|---|---|
| taskId | `heads-legs-5-01` |
| primaryMethod | feature_switch_then_replace |
| preludeType | feature_switch |
| solutionMode | standard_replacement |
| runner | DigitalTaskPlayer (legacy) |
| publish | reserve |
| expectedAnswer | 9 единорогов |
| alternativeStrategies | — |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | 9 единорогов | low |

## 5.2 — Караван Бант и Джав

| Поле | Значение |
|---|---|
| taskId | `heads-legs-5-02` |
| primaryMethod | unit_conversion_then_replace |
| preludeType | unit_conversion |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / derive (derive) |
| publish | reserve |
| expectedAnswer | 34 Джавов |
| alternativeStrategies | assume через Банты; assume через Джавы |
| validationRisks | — |
| requiredFixes | FIXED: dual-path assume + ветвление word solution |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Прочитай условие | read_condition | — | none |
| 2 | Что сначала нужно получить? | hl_derive_prelude | preludeDeriveAnswer + feature norms + totals из ruleInstance | none |
| 3 | Знакомый метод | hl_intro | — | none |
| 4 | Выбери предположение | hl_dual_path_assume | Банты / Джавы | none |
| 5 | Проверь вопрос задачи | hl_question_check | сколько Джав едет на Бантах | none |
| 6 | Запиши решение словами | word_solution | 34 Джавов | low |
| 7 | Что мы сделали? | auto_explanation | 34 Джавов | none |

## 5.3 — Банты и Ранкоры

| Поле | Значение |
|---|---|
| taskId | `heads-legs-5-03` |
| primaryMethod | transfer_replacement |
| preludeType | none |
| solutionMode | transfer |
| runner | HeadsLegsRunner / transfer |
| publish | publicationCandidate |
| expectedAnswer | {"rankors":17,"bants":12} |
| alternativeStrategies | — |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Прочитай условие | read_condition | — | none |
| 2 | Выбери метод | single_select | А. Представить, что все существа одного вида. | none |
| 3 | Запиши решение с пропусками | word_solution | {"rankors":17,"bants":12} | low |
| 4 | Ответ | auto_explanation | {"rankors":17,"bants":12} | none |

## 5.4 — Имперские истребители и X-Wing

| Поле | Значение |
|---|---|
| taskId | `heads-legs-5-04` |
| primaryMethod | compare_after_replacement |
| preludeType | none |
| solutionMode | compare_results |
| runner | DigitalTaskPlayer (legacy) |
| publish | reserve |
| expectedAnswer | 2 имперских больше |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | 2 имперских больше | low |

## 5.5 — Водолазы и осьминоги

| Поле | Значение |
|---|---|
| taskId | `heads-legs-5-05` |
| primaryMethod | limb_decompose |
| preludeType | limb_decompose |
| solutionMode | unsupported_for_now |
| runner | DigitalTaskPlayer (legacy) |
| publish | blocked |
| expectedAnswer | 7 осьминогов |
| alternativeStrategies | — |
| validationRisks | blocked — не должна открываться в childRoute |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | 7 осьминогов | low |

## 5.6 — Световые мечи

| Поле | Значение |
|---|---|
| taskId | `heads-legs-5-06` |
| primaryMethod | common_resource_then_replace |
| preludeType | common_resource |
| solutionMode | standard_replacement |
| runner | HeadsLegsRunner / derive (derive) |
| publish | publicationCandidate |
| expectedAnswer | 2 мечей Джедаев |
| alternativeStrategies | assume через мечи Джедаев; assume через мечи Ситхов |
| validationRisks | — |
| requiredFixes | FIXED: dual-path assume + ветвление word solution |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Прочитай условие | read_condition | — | none |
| 2 | Что сначала нужно получить? | hl_derive_prelude | preludeDeriveAnswer + feature norms + totals из ruleInstance | none |
| 3 | Знакомый метод | hl_intro | — | none |
| 4 | Выбери предположение | hl_dual_path_assume | мечи Джедаев / мечи Ситхов | none |
| 5 | Проверь вопрос задачи | hl_question_check | сколько мечей Джедаев изготовил мастер | none |
| 6 | Запиши решение словами | word_solution | 2 мечей Джедаев | low |
| 7 | Что мы сделали? | auto_explanation | 2 мечей Джедаев | none |

## 5.7 — Падаваны, Джедаи и Ситхи

| Поле | Значение |
|---|---|
| taskId | `heads-legs-5-07` |
| primaryMethod | key_condition_equality |
| preludeType | key_condition_equality |
| solutionMode | unsupported_for_now |
| runner | DigitalTaskPlayer (legacy) |
| publish | blocked |
| expectedAnswer | {"sith":7,"jedi":14} |
| alternativeStrategies | — |
| validationRisks | blocked — не должна открываться в childRoute |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | {"sith":7,"jedi":14} | low |

## 6.1 — Дарт Вейдер и пленники

| Поле | Значение |
|---|---|
| taskId | `heads-legs-6-01` |
| primaryMethod | triple_type_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | DigitalTaskPlayer (legacy) |
| publish | reserve |
| expectedAnswer | 228 генералов |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | 228 генералов | low |

## 6.2 — Дроиды на Звезде Смерти

| Поле | Значение |
|---|---|
| taskId | `heads-legs-6-02` |
| primaryMethod | triple_type_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | DigitalTaskPlayer (legacy) |
| publish | reserve |
| expectedAnswer | {"mechanics":13,"medics":13,"soldiers":66} |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | {"mechanics":13,"medics":13,"soldiers":66} | low |

## 6.3 — Залпы по кораблям

| Поле | Значение |
|---|---|
| taskId | `heads-legs-6-03` |
| primaryMethod | multiple_answers |
| preludeType | none |
| solutionMode | multiple_answers |
| runner | DigitalTaskPlayer (legacy) |
| publish | reserve |
| expectedAnswer | 3 вариант(ов) |
| alternativeStrategies | — |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | 3 вариант(ов) | low |

## 6.4 — Столы с ящиками

| Поле | Значение |
|---|---|
| taskId | `heads-legs-6-04` |
| primaryMethod | triple_type_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | DigitalTaskPlayer (legacy) |
| publish | reserve |
| expectedAnswer | 3 |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | 3 | low |

## 3.1 — Третьеклассники и пятиклассники

| Поле | Значение |
|---|---|
| taskId | `heads-legs-3-01` |
| primaryMethod | diagnostic_incomplete |
| preludeType | missing_total_objects |
| solutionMode | diagnostic |
| runner | DigitalTaskPlayer (legacy) |
| publish | reserve |
| expectedAnswer | диагностический вывод |
| alternativeStrategies | — |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | диагностический вывод | low |

## 6.5 — Йода, Оби-Ван и Квай-Гон

| Поле | Значение |
|---|---|
| taskId | `heads-legs-6-05` |
| primaryMethod | multiple_answers |
| preludeType | none |
| solutionMode | multiple_answers |
| runner | DigitalTaskPlayer (legacy) |
| publish | reserve |
| expectedAnswer | 3 вариант(ов) |
| alternativeStrategies | — |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | 3 вариант(ов) | low |

## 7.6 — Одноголовые сороконожки и пятиголовые драконы

| Поле | Значение |
|---|---|
| taskId | `heads-legs-7-06` |
| primaryMethod | diagnostic_incomplete |
| preludeType | missing_total_objects |
| solutionMode | diagnostic |
| runner | DigitalTaskPlayer (legacy) |
| publish | methodistOnly |
| expectedAnswer | диагностический вывод |
| alternativeStrategies | — |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | диагностический вывод | low |

## 7.1 — Утята и утконосики

| Поле | Значение |
|---|---|
| taskId | `heads-legs-7-01` |
| primaryMethod | key_condition_equality |
| preludeType | key_condition_equality |
| solutionMode | standard_replacement |
| runner | DigitalTaskPlayer (legacy) |
| publish | reserve |
| expectedAnswer | {"ducklings":222,"platypus":111} |
| alternativeStrategies | — |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | {"ducklings":222,"platypus":111} | low |

## 7.2 — Трехколесные и четырехколесные велосипеды

| Поле | Значение |
|---|---|
| taskId | `heads-legs-7-02` |
| primaryMethod | key_condition_equality |
| preludeType | key_condition_equality |
| solutionMode | standard_replacement |
| runner | DigitalTaskPlayer (legacy) |
| publish | reserve |
| expectedAnswer | {"threeWheel":16,"fourWheel":12} |
| alternativeStrategies | — |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | {"threeWheel":16,"fourWheel":12} | low |

## 7.3 — Треугольники и пятиугольники

| Поле | Значение |
|---|---|
| taskId | `heads-legs-7-03` |
| primaryMethod | standard_replacement |
| preludeType | none |
| solutionMode | standard_replacement |
| runner | DigitalTaskPlayer (legacy) |
| publish | reserve |
| expectedAnswer | 14 фигур |
| alternativeStrategies | Второй assume-путь возможен математически — проверить single_select assume |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | 14 фигур | low |

## 7.4 — Двухголовые сороконожки и трехголовые драконы

| Поле | Значение |
|---|---|
| taskId | `heads-legs-7-04` |
| primaryMethod | key_condition_equality |
| preludeType | key_condition_equality |
| solutionMode | standard_replacement |
| runner | DigitalTaskPlayer (legacy) |
| publish | reserve |
| expectedAnswer | 6 ног у дракона |
| alternativeStrategies | — |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | 6 ног у дракона | low |

## 7.5 — Одноголовые сороконожки и четырехголовые драконы

| Поле | Значение |
|---|---|
| taskId | `heads-legs-7-05` |
| primaryMethod | key_condition_equality |
| preludeType | key_condition_equality |
| solutionMode | standard_replacement |
| runner | DigitalTaskPlayer (legacy) |
| publish | reserve |
| expectedAnswer | 10 ног у дракона |
| alternativeStrategies | — |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | 10 ног у дракона | low |

## 7.7 — Лошади и верблюды

| Поле | Значение |
|---|---|
| taskId | `heads-legs-7-07` |
| primaryMethod | key_condition_equality |
| preludeType | key_condition_equality |
| solutionMode | standard_replacement |
| runner | DigitalTaskPlayer (legacy) |
| publish | reserve |
| expectedAnswer | 20 животных |
| alternativeStrategies | — |
| validationRisks | — |
| requiredFixes | — |

### Экраны

| # | Title | Kind | Expected | Risk |
|---:|---|---|---|---|
| 1 | Legacy DigitalTaskPlayer | legacy_digital | 20 животных | low |
