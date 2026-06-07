# Методико-архитектурная модель образовательной платформы

> Версия: 1.0 · Июнь 2025  
> Статус: **источник требований** для разработки новых задач, runner'ов и QA  
> Связанные документы: [TZ-heads-legs-methodology.md](./TZ-heads-legs-methodology.md), [guided-architecture-bank-mapping.md](./guided-architecture-bank-mapping.md)

---

## 1. Цель платформы

Платформа должна не просто вести ребёнка по задачам, а формировать **переносимый навык решения**.

Ребёнок должен постепенно научиться:

1. понимать метод;
2. узнавать структуру задачи;
3. выбирать подходящий метод;
4. выполнять шаги решения;
5. составлять арифметические примеры;
6. записывать решение словами;
7. решать похожие задачи без опоры;
8. переносить метод на новые сюжеты;
9. отличать задачи, где данных не хватает или ответов несколько;
10. решать часть задач альтернативным способом, например через уравнение.

---

## 2. Базовая архитектура задачи

У каждой задачи должны быть ключевые поля:

```ts
runnerKind
methodRule
ruleInstance
progressionProfile
expressionScaffoldLevel
solutionMode
publishTier
qaStatus
telemetryConfig
```

### runnerKind

Определяет, какой сценарий запускается.

```ts
type TaskRunnerKind =
  | "heads-legs-guided"
  | "dirichlet-guided"
  | "dirichlet-unlucky"
  | "dirichlet-remainders"
  | "dirichlet-geometry"
  | "dirichlet-graph"
  | "paper-construction"
  | "paper-generic"
  | "algebra-guided"
  | "unsupported";
```

Если задача не поддерживается текущей архитектурой, она **не должна** открываться через случайный runner. Лучше показать экран «задача пока не готова», чем обучать неправильной логике.

**В репозитории сейчас:** `src/lib/resolve-runner-kind.ts`, `src/data/runner-kind.ts`.

---

## 3. MethodRuleScreen — правило метода

У каждой темы или подтемы должно быть правило-ядро.

Примеры:

| Подтема | Якорная фраза |
|---------|---------------|
| Головы и ноги | Сначала представим самый простой случай: будто все объекты одного вида. |
| Остатки | Остаток всегда меньше числа, на которое делим. |
| Метод неудачника | Сначала представим самый неудачный расклад, где нужный результат ещё не случился. |
| Баллы / штрафы | Сначала представим, что все ответы были одного типа. |

Правило показывается:

1. перед первой задачей подтемы;
2. в первых задачах внутри сценария;
3. по кнопке «Запутался? Вспомни правило»;
4. в поздних задачах — только как справка.

**В репозитории сейчас:** `src/data/method-rules/`, `HeadsLegsMethodRuleScreen`.

---

## 4. ruleInstance — подстановка чисел из задачи

Правило должно показываться не абстрактно, а с числами конкретной задачи.

Пример для открыток (ordinary replacement, **не** score-runner):

```ts
ruleInstance: {
  ruleId: "heads-legs-base",
  totalObjects: 12,
  totalFeature: 25,
  firstKind: "по 2 открытки",
  firstFeature: 2,
  secondKind: "пo 3 открытки",
  secondFeature: 3,
  featureName: "открыток",
  assumeKind: "по 2 открытки",
  replacementStep: 1,
  objectsLabel: "девочек",
}
```

Ребёнок должен видеть:

> Если все 12 девочек получили по 2 открытки, было бы 12 × 2 = 24 открытки.

**Важно:** задачи ordinary replacement (открытки, оценки 2/3 без plus-minus) не оборачиваются в язык «баллы / прибавили или вычли». Пример: `heads-legs-4-03` → `transfer-pattern`, `heads-legs-base`.

---

## 5. Аудит задачи перед публикацией

Перед переводом задачи в детский маршрут нужно проверить:

1. Полное ли условие?
2. Есть ли единственный ответ?
3. Есть ли несколько ответов?
4. Не допускает ли задача нулевых участников, если по смыслу оба вида должны участвовать?
5. Что именно спрашивают?
6. Не нужен ли дополнительный шаг после промежуточного результата?
7. Подходит ли задача под текущий runner?
8. Не нужен ли отдельный solutionMode?

```ts
type TaskCompletenessStatus =
  | "complete_unique_answer"
  | "complete_multiple_answers"
  | "incomplete_condition"
  | "requires_positive_participants_constraint";
```

```ts
type SolutionMode =
  | "standard_replacement"
  | "diagnostic"
  | "enumeration"
  | "multiple_answers"
  | "compare_results"
  | "match_total"
  | "paper_solution";
```

Если задача имеет несколько ответов, нельзя вести её как задачу с одним ответом. Если данных не хватает, задача должна быть диагностической.

**В репозитории сейчас:** `completeness-audit.ts` (score/production), `src/data/task-publishing/`, `npm run qa:method-rules`.

---

## 6. progressionProfile — уровни самостоятельности

```ts
type ProgressionProfile = 1 | 2 | 3 | 4 | 5;
```

**В репозитории сейчас реализовано 1–4** для heads-legs pilot. Уровень 5 (бумага / полная самостоятельность) — целевой.

### Уровень 1 — полное объяснение

Первая задача темы или подтемы. До ~14 экранов: intro, rule, условие, участники, данные, assume, calc-1..3, question-check, word, preview.

### Уровень 2 — повтор метода

Шаги сохраняются, длинные объяснения убираются. Без intro.

### Уровень 3 — выбор следующего шага

Hub «Какой шаг сейчас нужно сделать?» → реальный worksheet/word-step. **Не декоративный.**

### Уровень 4 — составление примеров / перенос

Убираются «кто участвует» и «что известно». Сценарий: условие → (assume / выбор) → word_solution с пропусками → эталон.

**Пример в коде:** `transfer-pattern` для `4.3` — 4 экрана, profile 4.

### Уровень 5 — самостоятельное решение

Условие → поле решения или бумажный бланк → самопроверка → загрузка → эталон после проверки.

---

## 7. expressionScaffoldLevel — обучение записи примеров

```ts
type ExpressionScaffoldLevel =
  | "result_only"           // 12 × 2 = [24]
  | "one_operand_blank"     // 12 × [2] = 24
  | "assemble_expression"   // [12] [×] [2] [=] [24]
  | "write_expression"      // ребёнок пишет 12 × 2 = 24
  | "write_full_solution";
```

**Статус:** тип не введён в модель данных. Частично покрывается `worksheet_table` (formula prefix) и `word_solution`.

---

## 8. Обязательная фраза: «Запиши в виде примера»

Если платформа тренирует запись действия, нельзя спрашивать только «Сколько открыток было бы?» — ребёнок напишет `24`.

Нужно:

> Запиши это в виде примера.

> Запиши пример: сколько девочек × сколько открыток у каждой = сколько открыток всего.

---

## 9. Нормализация арифметической записи

В режиме `write_expression` нельзя проверять выражение как точную строку.

Для `12 × 2 = 24` принимать: `12 x 2 = 24`, `12 х 2 = 24`, `12 * 2 = 24`, `12·2=24`, `12 ⋅ 2 = 24`.

```ts
const OPERATOR_ALIASES = {
  multiply: ["×", "x", "х", "*", "·", "⋅"],
  divide: ["÷", "/", ":"],
  minus: ["−", "-", "–", "—"],
  plus: ["+"],
  equals: ["=", "＝"],
};
```

Если задание просит «запиши в виде примера», ответ `24` **не засчитывается**.

**Статус:** модуль `src/lib/expression-validation/` — **не реализован**. Частичная нормализация в `word-solution-validator.ts`.

---

## 10. Работа с ошибками

```ts
type ErrorKind =
  | "arithmetic_error"
  | "wrong_step"
  | "alternative_strategy"
  | "question_mismatch"
  | "answer_instead_of_expression"
  | "method_choice_error";
```

| Тип | Поведение |
|-----|-----------|
| Арифметическая ошибка | «Проверь только вычисление», не отправлять назад по методу |
| Альтернативное предположение | «Так тоже можно, но путь длиннее» |
| Неверный шаг | «Сначала найди разницу»; эскалация: подсказка → правило → «решить вместе» |
| Вопрос задачи | «Ты нашёл троек, но спрашивают про двойки» |
| Ответ вместо примера | «Число верное, запиши полный пример» |

**Статус:** error feedback engine — **не реализован** как единая система.

---

## 11. Подсказки и звёзды

```text
3 ★ — решил самостоятельно
2 ★ — одна мягкая подсказка
1 ★ — с правилом / подробной помощью
0 ★ — нужно повторение
```

Не снижать звёзды за: одну арифметическую ошибку, исправленную опечатку, корректный альтернативный путь, первую ошибку на новом типе.

**Статус:** hintPolicy как единая политика — **не реализована**. Звёзды фиксируются при `completeTask`, без учёта подсказок.

---

## 12. Телеметрия освоения навыков

```ts
interface TaskAttemptTelemetry {
  taskId: string;
  userId: string;
  attemptNumber: number;
  startedAt: string;
  completedAt?: string;
  hintsUsed: number;
  ruleOpenedCount: number;
  methodRuleOpenedCount: number;
  solutionExampleOpenedCount: number;
  wrongAnswersCount: number;
  arithmeticErrorsCount: number;
  wrongStepSelectionsCount: number;
  methodChoiceErrorsCount: number;
  usedBackButtonCount: number;
  restartedTask: boolean;
  finalStars: 0 | 1 | 2 | 3;
  completedWithHelp: boolean;
}
```

```ts
type MethodMasteryLevel =
  | "not_started"
  | "learned_with_full_support"
  | "solves_with_steps"
  | "chooses_next_step"
  | "builds_expressions"
  | "solves_independently"
  | "chooses_method_in_mixed_set"
  | "explains_to_others";
```

**Статус:** **не реализовано**. Есть `task-session` (stepIndex), без аналитики подсказок.

---

## 13–15. Выбор метода и смешанные задачи

После нескольких подтем — экран «Какой метод здесь подходит?» с вариантами только из изученных методов + объяснение «почему».

Смешанные блоки M1–M4: распознавание метода, не вычисления.

**Статус:** MethodChoiceStep и MixedPracticeBlock — **не реализованы**. Есть hub выбора **шага** (profile 3), не метода.

---

## 16–18. Резервные задачи, рандомизация, генератор

```ts
type TaskPoolRole = "core" | "reserve" | "challenge" | "diagnostic" | "mixed";
```

Генератор вариантов строит задачу через **скрытое решение**, не случайные числа.

**Статус:** poolRole / generator — **не реализованы**.

---

## 19. Алгебраический метод

```ts
solutionMethods: [
  { method: "replacement_method", isPrimary: true, runnerKind: "heads-legs-guided" },
  { method: "algebraic_method", isPrimary: false, runnerKind: "algebra-guided" },
];
```

Уровни A1–A3: готовая конструкция → собрать уравнение → записать самому.

**Статус:** `algebra-guided` в `TaskRunnerKind`, runner **не реализован**.

---

## 20. Навигация внутри задачи

На шагах после первого:

- **← Назад**
- **К условию**
- **Начать заново**

Условие закреплено сверху или доступно по кнопке.

**Статус:** реализовано в `HeadsLegsRunner` для progression-задач (с июня 2025).

---

## 21. Публикация задач

```ts
publishTier: "childRoute" | "training" | "methodistOnly" | "archive" | "hidden";
```

Задача в childRoute только если: `qaStatus = ready`, подходящий runner, ruleInstance, progressionProfile, solutionMode, ручной smoke, e2e, нет методических блокеров.

**В репозитории:** `src/data/task-publishing/config.ts`, `HEADS_LEGS_CHILD_ROUTE_MAX_NUMBER = 31` (4.03–4.05 в child route).

---

## 22. QA и e2e

QA проверяет: ruleInstance, progressionProfile, solutionMode, question check, answerTransform, multiple_answers / diagnostic, отсутствие служебных терминов в UI.

E2E: rule-flow, hub, word_solution, answerTransform, diagnostic, enumeration, regression.

**Команда:** `npm run qa:method-rules`, `npm run test:e2e`.

---

## 23. Порядок реализации

### Этап 1 — Документация методологии ✅

Файл: `docs/platform-methodology.md` (этот документ).

DoD: документ есть; новые задачи проверяются по нему.

### Этап 2 — Типы в модели данных

`ProgressionProfile` (5), `ExpressionScaffoldLevel`, `MethodMasteryLevel`, `TaskPoolRole`, `TaskAttemptTelemetry`, `ErrorKind`, `HintPolicy`.

DoD: типы описаны; fallback для старых задач.

### Этап 3 — Expression validation

`src/lib/expression-validation/` — нормализация операторов, проверка структуры, отличие результата от примера.

### Этап 4 — Error feedback engine

Типизированная обратная связь по `ErrorKind`.

### Этап 5 — Telemetry + hintPolicy + звёзды

Логирование подсказок/правил; звёзды = самостоятельность.

### Этапы 6–12 (следующие)

6. hintPolicy интеграция в UI  
7. MethodChoiceStep  
8. MixedPracticeBlock  
9. Reserve task pool  
10. Generator v1 (ordinary replacement)  
11. algebra-guided pilot  
12. Mastery reports  

---

## 24. Приоритет реализации

### Сейчас / ближайший этап

1. ~~Документация методологии~~
2. Expression validation
3. Error feedback engine
4. Telemetry
5. hintPolicy + звёзды

### Следующий этап

6. Reserve task pool  
7. MethodChoiceStep  
8. Mixed tasks  

### Позже

9. Generator v1  
10. algebra-guided  
11. Mastery reports  
12. Paper-mode (profile 5)  

---

## 25. Главный принцип

Платформа должна понимать:

1. каким методом ребёнок решает;
2. где он ошибся;
3. насколько самостоятельно он идёт;
4. нужна ли резервная задача;
5. готов ли он к смешанному блоку;
6. можно ли повышать уровень;
7. нужно ли вернуть к правилу;
8. можно ли дать сгенерированный вариант.

**Итоговая цель:** не пройти задачи, а сформировать переносимый навык решения.

---

## Приложение A. Соответствие репозиторию (снимок июнь 2025)

| Компонент | Статус |
|-----------|--------|
| `runnerKind` + `resolveRunnerKind` | ✅ |
| `methodRule` + `ruleInstance` | ✅ heads-legs, remainders |
| `progressionProfile` 1–4 | ✅ pilot patterns 1–4 |
| `progressionProfile` 5 | ⬜ |
| `transfer-pattern` (4.03) | ✅ 4 экрана, base rule |
| score-pattern (4.1, 4.2, 4.4, 4.5) | ✅ |
| `publishTier` / `qaStatus` | ✅ частично |
| `expressionScaffoldLevel` | ⬜ |
| `expression-validation` | ⬜ |
| Error feedback engine | ⬜ |
| Telemetry / mastery | ⬜ |
| MethodChoiceStep | ⬜ |
| Mixed blocks | ⬜ |
| Generator v1 | ⬜ |
| algebra-guided | ⬜ |
| Навигация Назад/К условию/Заново | ✅ HeadsLegsRunner |
