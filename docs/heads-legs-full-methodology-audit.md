# Головы и ноги: каноническая методология банка 51 задачи

> **Машиночитаемый источник:** `src/data/heads-legs/full-methodology-audit.ts`  
> **QA:** `npm run qa:method-rules` (секция `full methodology audit`)  
> **Pattern 5 runner:** ЗАМОРОЖЕН до согласования по этой карте.

---

## 1. Главный принцип

Больше не назначаем runner по старому `patternId`.

Старый `patternId` остаётся только справочным полем. Реальная методология задачи определяется по связке:

```ts
primaryMethod + preludeType + solutionMode + progressionProfile + expressionScaffoldLevel
```

Именно эта связка должна определять:

* какой runner использовать;
* сколько экранов нужно;
* нужен ли предварительный шаг;
* нужно ли просить ребёнка выбрать метод;
* нужно ли собирать примеры;
* можно ли публиковать задачу в child route;
* нужна ли задача как reserve / blocked / methodistOnly.

---

# 2. Методические типы задач

## A. standard_replacement

Обычный метод «представим, что все одного вида».

Дано:

* два вида объектов;
* общее количество объектов;
* общий признак;
* вклад каждого вида.

Пример:

```text
Всего 30 голов и 100 ног.
У птицы 2 ноги, у зверя 4.
```

---

## B. value_replacement

Тот же метод замены, но признак — не ноги, а стоимость, цветы, карандаши, сосиски и т.д.

Пример:

```text
20 коробок, в больших по 12 карандашей, в маленьких по 6.
Всего 210 карандашей.
```

---

## C. production_replacement

Тот же метод, но вклад связан с тем, кто сколько сделал/съел/собрал.

Пример:

```text
Мальчики съели по 3 конфеты, девочки — по 5.
```

---

## D. score / plus-minus

Задачи с очками, штрафами, оценками, выигрышами/проигрышами.

Подтипы:

* `score_ordinary`;
* `score_plus_minus`;
* `score_match_total`.

---

## E. transfer_replacement

Задача на перенос знакомого метода в новый сюжет.

Все данные уже есть в условии. Никакого предварительного вывода нет.

Runner должен быть коротким:

1. условие;
2. выбор метода;
3. запись примеров;
4. ответ.

Примеры:

* 4.3 Открытки девочкам;
* 5.3 Банты и Ранкоры.

---

## F. derive / prelude + replacement

Перед обычной заменой нужно вывести недостающее значение.

Подтипы:

* `derive_total_objects`;
* `unit_conversion`;
* `feature_switch`;
* `common_resource`;
* `derived_half_feature`.

Пример:

```text
Сначала 54 пары ног → 108 ног.
Потом обычная замена.
```

---

## G. compare_after_replacement

Сначала решаем методом замены, потом отвечаем на дополнительный вопрос:

* кого больше;
* на сколько больше;
* сколько осталось;
* какой итоговый показатель.

---

## H. enumeration / multiple_answers / diagnostic

Не все задачи должны решаться одним числовым ответом.

* `enumeration` — перебор вариантов;
* `multiple_answers` — несколько решений;
* `diagnostic_incomplete` — данных не хватает.

---

## I. special / blocked

Задачи, которые пока нельзя пускать через обычный runner:

* `limb_decompose`;
* `key_condition_equality`;
* `ratio/equality`;
* `triple_type_replacement`;
* `multi_limb_constraint`.

---

# 3. Уровни самостоятельности

## Profile 1

Первое знакомство с методом.

Много экранов, правило, полная опора.

## Profile 2

Повтор метода.

Правило ещё показывается, но объяснений меньше.

## Profile 3

Ребёнок выбирает следующий шаг.

Например:

```text
Что сейчас нужно сделать?
А. Представить, что все одного вида.
Б. Найти разницу.
В. Проверить вопрос.
```

## Profile 4

Перенос и самостоятельная запись.

Нет лишних экранов «кто участвует» и «что известно». Ребёнок читает условие, выбирает метод и записывает примеры.

## Profile 5

Бумага / самостоятельное решение / смешанные задачи.

Пока для этого банка как основной child route-уровень не внедрён.

---

# 4. Каноническая карта всех 51 задач

|  № | id              | methodTaskId | Название                                         | Метод                        | Prelude                | Режим                | Profile | Scaffold            | Публикация           | Методический вывод                                                                      |
| -: | --------------- | ------------ | ------------------------------------------------ | ---------------------------- | ---------------------- | -------------------- | ------: | ------------------- | -------------------- | --------------------------------------------------------------------------------------- |
|  1 | heads-legs-1-01 | 1.1          | Звери и птицы                                    | standard_replacement         | none                   | standard_replacement |       1 | one_operand_blank   | childRoute           | Эталон первой задачи. Полный rule-flow.                                                 |
|  2 | heads-legs-1-02 | 1.2          | Цыплята и змеи                                   | standard_replacement         | none                   | standard_replacement |       2 | one_operand_blank   | childRoute           | Повтор метода в компактном виде.                                                        |
|  3 | heads-legs-1-03 | 1.3          | Гусята и крокодильчики                           | standard_replacement         | none                   | standard_replacement |       2 | one_operand_blank   | childRoute           | Оба вида в ответе, оба > 0.                                                             |
|  4 | heads-legs-1-04 | 1.4          | Жуки и пауки                                     | standard_replacement         | none                   | standard_replacement |       3 | write_expression    | childRoute           | Hub выбора следующего шага.                                                             |
|  5 | heads-legs-1-06 | 1.6          | Велосипедисты                                    | standard_replacement         | none                   | standard_replacement |       4 | write_expression    | childRoute           | Почти самостоятельная запись решения.                                                   |
|  6 | heads-legs-1-07 | 1.7          | Велосипеды на парковке                           | standard_replacement         | none                   | standard_replacement |       4 | write_expression    | childRoute           | Profile 4, короткий сценарий.                                                           |
|  7 | heads-legs-1-10 | 1.10         | Гномы и пони                                     | standard_replacement         | derive_total_objects   | standard_replacement |       3 | write_expression    | reserve              | Нужен prelude: 17 голов = 17 участников. Пока reserve.                                  |
|  8 | heads-legs-1-05 | 1.5          | Жуки и пауки: правые ноги                        | derived_feature              | derived_half_feature   | standard_replacement |       3 | write_expression    | childRoute           | Особенность: правые ноги = половина ног. Не derive-base, а derived_feature внутри base. |
|  9 | heads-legs-1-08 | 1.8          | Мухи и слоны                                     | text_ratio_answer            | none                   | standard_replacement |       3 | write_full_solution | childRoute           | Ответ в формате счёта 4:6. Нужен answerTransform text.                                  |
| 10 | heads-legs-1-13 | 1.13         | Роботы AT-ST и AT-AT                             | standard_replacement         | none                   | standard_replacement |       3 | write_full_solution | reserve              | Обычная замена, но legacy/mode C. После миграции можно вернуть.                         |
| 11 | heads-legs-2-01 | 2.1          | Клумбы около Лицея и Гимназии                    | value_replacement            | none                   | standard_replacement |       1 | assemble_expression | childRoute           | Первый value-паттерн.                                                                   |
| 12 | heads-legs-2-02 | 2.2          | Коробки с карандашами                            | value_replacement            | none                   | standard_replacement |       2 | one_operand_blank   | childRoute           | Повтор value.                                                                           |
| 13 | heads-legs-2-03 | 2.3          | Дроны-рабочие и дроны-пастухи                    | value_replacement            | none                   | standard_replacement |       2 | write_expression    | childRoute           | Value p2, уже ближе к записи выражений.                                                 |
| 14 | heads-legs-2-04 | 2.4          | Пирожные по 100 и 125 рублей                     | value_replacement            | none                   | standard_replacement |       3 | write_expression    | childRoute           | Hub выбора шага.                                                                        |
| 15 | heads-legs-2-05 | 2.5          | Коробки простых и цветных карандашей             | value_replacement            | none                   | standard_replacement |       3 | write_full_solution | childRoute           | Есть answerTransform: нашли коробки, отвечаем карандашами.                              |
| 16 | heads-legs-2-06 | 2.6          | Львята и тигрята                                 | value_replacement            | none                   | standard_replacement |       4 | write_expression    | childRoute           | Profile 4, короткая самостоятельная запись.                                             |
| 17 | heads-legs-2-07 | 2.7          | Собаки и кошки                                   | value_replacement            | none                   | standard_replacement |       4 | assemble_expression | childRoute           | Хорошая задача для сборки примеров.                                                     |
| 18 | heads-legs-1-09 | 1.9          | Дроиды и генерал Гривус                          | multi_limb_constraint        | multi_feature_balance  | standard_replacement |       3 | write_full_solution | reserve              | Два признака: ноги + руки. Нужен unified multi-feature runner.                          |
| 19 | heads-legs-1-11 | 1.11         | Жирафы и страусы                                 | compare_after_replacement    | none                   | compare_results      |       3 | write_full_solution | reserve              | После замены нужно сравнить «кого больше и на сколько».                                 |
| 20 | heads-legs-1-14 | 1.14         | Табуретки и стулья                               | standard_replacement         | none                   | standard_replacement |       3 | write_full_solution | reserve              | Люди сидят на предметах, общее число ног включает людей. Нужен custom/clarified runner. |
| 21 | heads-legs-3-02 | 3.2          | Пирожки мальчиков и девочек                      | enumeration                  | missing_total_objects  | enumeration          |       3 | write_full_solution | childRoute           | Нет общего числа участников; решается перебором.                                        |
| 22 | heads-legs-3-03 | 3.3          | Конфеты в классе                                 | production_replacement       | none                   | standard_replacement |       1 | one_operand_blank   | childRoute           | Первый production-паттерн.                                                              |
| 23 | heads-legs-3-04 | 3.4          | Снежинки                                         | production_replacement       | none                   | standard_replacement |       3 | write_expression    | childRoute           | Production hub.                                                                         |
| 24 | heads-legs-3-05 | 3.5          | Совята и котята                                  | compare_after_replacement    | none                   | compare_results      |       3 | write_full_solution | childRoute           | Production + compare_results.                                                           |
| 25 | heads-legs-3-06 | 3.6          | Ученики съели конфеты                            | production_replacement       | none                   | standard_replacement |       4 | write_expression    | childRoute           | Profile 4, самостоятельная запись.                                                      |
| 26 | heads-legs-3-07 | 3.7          | Яблоки на варенье                                | diagnostic_incomplete        | missing_total_objects  | diagnostic           |       3 | write_full_solution | childRoute           | Несколько вариантов; нельзя вести как unique answer.                                    |
| 27 | heads-legs-4-01 | 4.1          | Петя на турнире                                  | score_plus_minus             | none                   | standard_replacement |       1 | one_operand_blank   | childRoute           | Первый plus/minus score.                                                                |
| 28 | heads-legs-4-02 | 4.2          | Оценки 2 и 3                                     | score_ordinary               | none                   | standard_replacement |       2 | write_expression    | childRoute           | Критичен question-check: нашли тройки, спрашивают двойки.                               |
| 29 | heads-legs-4-03 | 4.3          | Открытки девочкам                                | transfer_replacement         | none                   | transfer             |       4 | write_expression    | childRoute           | Transfer-эталон: 4 экрана, base rule, не score.                                         |
| 30 | heads-legs-4-04 | 4.4          | Матчи двух команд                                | score_match_total            | none                   | match_total          |       2 | write_full_solution | childRoute           | Особый score: победа+поражение = 5, ничья = 4.                                          |
| 31 | heads-legs-4-05 | 4.5          | Экзамен Васи                                     | score_plus_minus             | none                   | standard_replacement |       3 | write_full_solution | childRoute           | Plus/minus hub: +7 и −12.                                                               |
| 32 | heads-legs-5-01 | 5.1          | Антилопы и единороги                             | feature_switch_then_replace  | feature_switch         | standard_replacement |       3 | write_full_solution | reserve              | Сначала ноги → число животных, потом рога. Derive-base кандидат Wave C.                 |
| 33 | heads-legs-5-02 | 5.2          | Караван Бант и Джав                              | unit_conversion_then_replace | unit_conversion        | standard_replacement |       2 | write_full_solution | reserve              | Сначала 54 пары ног → 108 ног. Настоящий derive-base.                                   |
| 34 | heads-legs-5-03 | 5.3          | Банты и Ранкоры                                  | transfer_replacement         | none                   | transfer             |       4 | write_expression    | publicationCandidate | Не derive-base: все данные уже есть. Transfer + method choice.                          |
| 35 | heads-legs-5-04 | 5.4          | Имперские истребители и X-Wing                   | compare_after_replacement    | none                   | compare_results      |       3 | write_expression    | reserve              | Стандартная замена + сравнение/дополнительный итог.                                     |
| 36 | heads-legs-5-05 | 5.5          | Водолазы и осьминоги                             | limb_decompose               | limb_decompose         | unsupported_for_now  |       4 | write_full_solution | blocked              | Нужен limb_decompose runner. Не replacement в лоб.                                      |
| 37 | heads-legs-5-06 | 5.6          | Световые мечи                                    | common_resource_then_replace | common_resource        | standard_replacement |       2 | write_expression    | publicationCandidate | Настоящий derive-base: общий ресурс/рукояти → дальше замена.                            |
| 38 | heads-legs-5-07 | 5.7          | Падаваны, Джедаи и Ситхи                         | key_condition_equality       | key_condition_equality | unsupported_for_now  |       4 | write_full_solution | blocked              | Ratio/equality. Нужен отдельный runner или algebra.                                     |
| 39 | heads-legs-6-01 | 6.1          | Дарт Вейдер и пленники                           | triple_type_replacement      | none                   | standard_replacement |       3 | write_full_solution | reserve              | Три вида объектов. Нужен triple-type runner.                                            |
| 40 | heads-legs-6-02 | 6.2          | Дроиды на Звезде Смерти                          | triple_type_replacement      | none                   | standard_replacement |       3 | write_full_solution | reserve              | Три вида. Stage 6 reserve.                                                              |
| 41 | heads-legs-6-03 | 6.3          | Залпы по кораблям                                | multiple_answers             | none                   | multiple_answers     |       3 | write_full_solution | reserve              | Несколько допустимых составов. Enumeration-like.                                        |
| 42 | heads-legs-6-04 | 6.4          | Столы с ящиками                                  | triple_type_replacement      | none                   | standard_replacement |       3 | write_full_solution | reserve              | Три вида столов. Нужен triple-type runner.                                              |
| 43 | heads-legs-3-01 | 3.1          | Третьеклассники и пятиклассники                  | diagnostic_incomplete        | missing_total_objects  | diagnostic           |       3 | write_full_solution | reserve              | Данных не хватает без допущения. Не обычная замена.                                     |
| 44 | heads-legs-6-05 | 6.5          | Йода, Оби-Ван и Квай-Гон                         | multiple_answers             | none                   | multiple_answers     |       3 | write_full_solution | reserve              | Несколько распределений. Требует multiple_answers flow.                                 |
| 45 | heads-legs-7-06 | 7.6          | Одноголовые сороконожки и пятиголовые драконы    | diagnostic_incomplete        | missing_total_objects  | diagnostic           |       4 | write_full_solution | methodistOnly        | Нет числа существ; данных не хватает для unique answer.                                 |
| 46 | heads-legs-7-01 | 7.1          | Утята и утконосики                               | key_condition_equality       | key_condition_equality | standard_replacement |       3 | write_full_solution | reserve              | Ключевое условие равенства. Нужен equality/ratio runner.                                |
| 47 | heads-legs-7-02 | 7.2          | Трёхколёсные и четырёхколёсные велосипеды        | key_condition_equality       | key_condition_equality | standard_replacement |       3 | write_full_solution | reserve              | Ключевое условие равенства, не обычная замена.                                          |
| 48 | heads-legs-7-03 | 7.3          | Треугольники и пятиугольники                     | standard_replacement         | none                   | standard_replacement |       3 | write_full_solution | reserve              | По структуре проще, но stage 7; можно рассмотреть как reserve после миграции.           |
| 49 | heads-legs-7-04 | 7.4          | Двухголовые сороконожки и трёхголовые драконы    | key_condition_equality       | key_condition_equality | standard_replacement |       3 | write_full_solution | reserve              | Equality/ratio runner.                                                                  |
| 50 | heads-legs-7-05 | 7.5          | Одноголовые сороконожки и четырёхголовые драконы | key_condition_equality       | key_condition_equality | standard_replacement |       3 | write_full_solution | reserve              | Equality/ratio runner.                                                                  |
| 51 | heads-legs-7-07 | 7.7          | Лошади и верблюды                                | key_condition_equality       | key_condition_equality | standard_replacement |       3 | write_full_solution | reserve              | Равенство лошадей и двугорбых верблюдов; не обычная замена.                             |

---

# 5. Рекомендуемый порядок прохождения

Порядок строится по методу, а не по старому номеру pattern.

## Фаза A — base replacement

1. 1.1 Звери и птицы
2. 1.2 Цыплята и змеи
3. 1.3 Гусята и крокодильчики
4. 1.4 Жуки и пауки
5. 1.6 Велосипедисты
6. 1.7 Велосипеды на парковке

Задачи 1.5, 1.8, 1.10 и другие похожие не ставить в основной поток сразу: они требуют дополнительных экранов или answerTransform.

---

## Фаза B — value replacement

1. 2.1 Клумбы
2. 2.2 Коробки с карандашами
3. 2.3 Дроны
4. 2.4 Пирожные
5. 2.5 Коробки карандашей
6. 2.6 Львята и тигрята
7. 2.7 Собаки и кошки

---

## Фаза C — production

1. 3.3 Конфеты в классе
2. 3.4 Снежинки
3. 3.6 Ученики съели конфеты
4. 3.2 Пирожки мальчиков и девочек
5. 3.5 Совята и котята
6. 3.7 Яблоки на варенье

---

## Фаза D — score

1. 4.2 Оценки 2 и 3
2. 4.1 Петя на турнире
3. 4.5 Экзамен Васи
4. 4.4 Матчи двух команд

---

## Фаза E — transfer

1. 4.3 Открытки девочкам
2. 5.3 Банты и Ранкоры

Эти задачи не учат новый метод. Они проверяют: узнаёт ли ребёнок старый метод в новом сюжете.

---

## Фаза F — derive-base

1. 5.2 Караван Бант и Джав
2. 5.6 Световые мечи
3. 5.1 Антилопы и единороги

Эти задачи вводить только после готовности prelude runner.

---

## Фаза G — compare / special

1. 5.4 Истребители и X-Wing
2. 1.11 Жирафы и страусы

---

## Фаза H — reserve base variants

1. 1.5 Жуки и пауки: правые ноги
2. 1.13 Роботы AT-ST и AT-AT
3. 1.10 Гномы и пони
4. 1.8 Мухи и слоны
5. 1.9 Дроиды и генерал Гривус
6. 1.14 Табуретки и стулья

---

## Фаза I — stage 6

1. 6.1 Дарт Вейдер и пленники
2. 6.2 Дроиды на Звезде Смерти
3. 6.4 Столы с ящиками
4. 6.3 Залпы по кораблям
5. 6.5 Йода, Оби-Ван и Квай-Гон

---

## Фаза J — stage 7

1. 7.3 Треугольники и пятиугольники
2. 7.1 Утята и утконосики
3. 7.2 Трёхколёсные и четырёхколёсные велосипеды
4. 7.4 Двухголовые сороконожки и трёхголовые драконы
5. 7.5 Одноголовые сороконожки и четырёхголовые драконы
6. 7.7 Лошади и верблюды
7. 7.6 Одноголовые сороконожки и пятиголовые драконы

---

## Фаза K — blocked / diagnostic

1. 5.5 Водолазы и осьминоги — blocked до limb_decompose runner.
2. 5.7 Падаваны, Джедаи и Ситхи — blocked до ratio/equality runner.
3. 3.1 Третьеклассники и пятиклассники — diagnostic/reserve, данных не хватает.

---

# 6. Что делать с текущим childRoute

Сейчас опубликованы задачи 1–31, но методически не все они равнозначны.

Для стабильного production можно оставить как есть, но новая методология говорит:

* childRoute как факт публикации ≠ методический core;
* часть текущих опубликованных задач должна быть отмечена как legacy/reserve внутри отчёта;
* новые публикации после №31 делать только по канонической карте.

---

# 7. Guards (реализовано в коде)

## 7.1. Назначение runner

Runner назначается по `primaryMethod + preludeType + solutionMode`, не по `legacy patternId`.

## 7.2. Guard против ошибки 5.3

`npm run qa:method-rules`: если `primaryMethod = transfer_replacement` и `preludeType = none`, задача не может открываться через derive-base runner.

## 7.3. Guard против преждевременной публикации

* `blocked` / `methodistOnly` → не childRoute
* `publicationCandidate` → только через `PUBLICATION_CANDIDATE_CHILD_ROUTE_ALLOWLIST` после smoke + e2e
* `reserve` в childRoute → warning (legacy tolerated)

## 7.4. Guard по pattern 5

Pattern 5 заморожен: 5.1–5.7 не публикуются без отдельного решения. 5.3 — только `publicationCandidate` (transfer).

---

# 8. Следующие шаги разработки

1. **Подключить full audit как guard** — ✅ `full-methodology-audit.ts` + QA
2. **5.3 runtime** — transfer-flow (4 экрана), не derive-base — ✅
3. **Wave B** — не начинать до smoke 5.3
4. **publicationCandidate** — smoke + e2e, затем allowlist
5. **Derive-base pilot** — начинать с 5.2 / 5.6 / 5.1, не с 5.3

---

# 9. Главный вывод

Банк 51 задачи нужно вести не как линейный список patternId, а как карту методов.

Главная ошибка, которую мы предотвращаем:

```text
Задача стоит в pattern 5 → значит это derive-base.
```

Правильно:

```text
Сначала смотрим математическую природу задачи.
Потом назначаем runner.
Потом решаем, можно ли публиковать.
```
