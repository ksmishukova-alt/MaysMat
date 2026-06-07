# ТЗ: progressionProfile для паттерна 5 «Сначала нужно понять, что именно считаем»

> Версия: 1.0 · Июнь 2026  
> Предусловие: паттерны 1–4 опубликованы (`HEADS_LEGS_CHILD_ROUTE_MAX_NUMBER = 31`, report `docs/production-reports/heads-legs-2026-06.md`).  
> **Статус: аудит выполнен, реализация runner — только после согласования этого документа.**

---

## Контекст

Паттерн 5 — **тот же метод замены**, но перед заменой ребёнок должен:

1. понять, **какой признак** сейчас считаем (ноги, рога, зубы, крылья, кристаллы…);
2. при необходимости **получить скрытое общее число** (животных из ног, ног из пар, мечей из рукоятей);
3. иногда **переключить признак** или **разложить смешанные величины** (конечности vs ноги).

Методичка (сложность 5): *«Дополнительный признак или скрытое общее количество»*.

**Pilot-задачи:** 5.1–5.7 (`heads-legs-5-01` … `heads-legs-5-07`, catalog №32–38).

**Аудит в коде:** `src/data/heads-legs/pattern-5/completeness-audit.ts`

---

## 1. Сводная таблица аудита

| ID | catalog № | Задача | derivationKind | unique | completenessStatus | solutionMode | profile | publish |
|----|:---------:|--------|----------------|:------:|--------------------|--------------|:-------:|---------|
| **5.1** | 32 | Антилопы и единороги | feature_switch_then_replace | ✓ | complete_unique_answer | standard_replacement | 3 | **reserve** |
| **5.2** | 33 | Караван Бант и Джав | unit_conversion_then_replace | ✓ | complete_unique_answer | standard_replacement | 2 | **reserve** |
| **5.3** | 34 | Банты и Ранкоры | standard_replace | ✓ | complete_unique_answer | standard_replacement | 2 | **childRouteCandidate** |
| **5.4** | 35 | Имперские и X-Wing | compare_after_replace | ✓ | complete_unique_answer | compare_results | 3 | **reserve** |
| **5.5** | 36 | Водолазы и осьминоги | limb_decompose | ✓ | complete_unique_answer | unsupported_for_now | 4 | **methodistOnly** *(blocked_until_runner)* |
| **5.6** | 37 | Световые мечи | common_resource_then_replace | ✓ | complete_unique_answer | standard_replacement | 2 | **childRouteCandidate** |
| **5.7** | 38 | Падаваны, Джедаи, Ситхи | ratio_equality | ✓ | methodically_unclear | unsupported_for_now | 4 | **blocked** |

### Проверка по чеклисту

| ID | Полное условие | Единств. ответ | Оба вида > 0 | Что спрашивают | Промежуточный ≠ ответ | Станд. замена | Отд. режим |
|----|:--------------:|:-------------:|:------------:|----------------|----------------------|:-------------:|:----------:|
| 5.1 | ✓ | ✓ | ✓ | единорогов | ✓ 22 животных | после prelude | feature switch |
| 5.2 | ✓ | ✓ | ✓ | Джавов | ✓ 108 ног | после prelude | пары → ноги |
| 5.3 | ✓ | ✓ | ✓ | оба вида | ✗ | ✓ | — |
| 5.4 | ✓ | ✓ | ✓ | сравнение | ✓ 39/37 | ✓ + compare | compare_results |
| 5.5 | ✓ | ✓ | ✓ | осьминогов | ✓ 16 водолазов | ✗ | limb_decompose |
| 5.6 | ✓ | ✓ | ✓ | мечей Джедаев | ✓ 17 мечей | после prelude | common resource |
| 5.7 | ✓ | ✓* | ✓ | оба вида | ✓ ratio | ✗ | ratio_equality |

\* Математически единственный ответ; pedagogically **не** классическая замена.

---

## 2. Математический разбор по задачам

### 5.1 — Антилопы и единороги

| Поле | Значение |
|------|----------|
| Условие | 88 ног, 35 рогов; 4 ноги у каждого |
| Prelude | 88 ÷ 4 = **22** животных |
| Замена | по рогам: 1 (единорог) vs 2 (антилопа), assume единороги |
| Расчёт | 22×1=22; diff 13; step 1 → 13 антилоп, **9 единорогов** |
| Ответ | **9 единорогов** (не пара 13+9) |
| Solution lines | 10 строк, mode C |
| Custom guided | `steps-5-1.ts` (worksheets + intro) |

### 5.2 — Караван Бант и Джав

| Поле | Значение |
|------|----------|
| Prelude | 54×2 = **108** ног; **44** головы |
| Замена | 2 (Джав) vs 4 (Банта с ездоком) |
| Расчёт | 44×2=88; diff 20; step 2 → 10 Бант, **34 Джава** |
| Ответ | **34 Джава** |

### 5.3 — Банты и Ранкоры *(эталон pilot)*

| Поле | Значение |
|------|----------|
| totalParticipants | **29** |
| totalFeature | **352** зуба |
| Замена | 8 (Ранкор) vs 18 (Бант) |
| Расчёт | 29×8=232; diff 120; step 10 → 12 Бант, **17 Ранкоров** |
| Ответ | **17 Ранкоров и 12 Бант** |

### 5.4 — Имперские истребители и X-Wing

| Поле | Значение |
|------|----------|
| totalParticipants | **76** кораблей |
| totalFeature | **226** крыльев |
| Замена | 2 vs 4 крыла |
| Промежуточный | 39 имперских, 37 X-Wing |
| Ответ | **имперских больше на 2** (compare_results) |

### 5.5 — Водолазы и осьминоги

| Поле | Значение |
|------|----------|
| Декомпозиция | 120 конечностей − 88 ног = **32** руки водолазов |
| Водолазы | 32÷2 = **16**; их ног 32 |
| Осьминоги | (88−32)÷8 = **7** |
| Ответ | **7 осьминогов** |
| Custom guided | `steps-5-5.ts` |

**Важно:** метод «все одного вида по ногам» **не работает** без осознания рук.

### 5.6 — Световые мечи

| Поле | Значение |
|------|----------|
| Prelude | 17 рукоятей → **17** мечей |
| Замена | 1 кристалл (Джедай) vs 2 (Ситх) |
| Расчёт | 17×1=17; diff 15; step 1 → 15 Ситхов, **2** меча Джедаев |
| Ответ | **2 меча Джедаев** |

### 5.7 — Падаваны, Джедаи и Ситхи *(blocked)*

| Поле | Значение |
|------|----------|
| totalParticipants | **21** падаван |
| Условие | красных мечей = зелёных |
| Метод | отношение **1:2** (Ситх:Джедай); 21÷3=7 → **7 Ситхов, 14 Джедаев** |
| Альтернатива | уравнение 4s = 2(21−s) |
| Методичка | *«удобнее равенство мечей, а не лишние ноги»* |

**Решение:** `unsupported_for_now` / **`blocked`**. Это пропорциональная (ratio) модель, не обычная замена. **Не публиковать в childRoute до отдельного ratio/equality runner** (mini-runner или отдельный solutionMode).

---

## 3. MethodRule: новый или продолжение?

### Вывод

**Не создавать полностью новую методику.** Паттерн 5 — **не новый метод**, а **усложнение стандартной замены**:

> Перед заменой ребёнок должен **вывести недостающий общий признак** из условия.

Методическая формула для ребёнка:

1. **Сначала получи недостающие данные.**
2. **Потом решай знакомым методом замены.**

Технически: **`heads-legs-derive-base`** = prelude + `heads-legs-base`.

- Якорь: *«Сначала разберись, что именно считаем — потом применяй замену.»*
- Наследует логику шагов 5–10 из base rule (assume → trial → diff → step → divide → answer).
- Добавляет шаги 1–4 prelude (зависят от `derivationKind`).

```ts
interface HeadsLegsDeriveRuleInstance {
  ruleId: "heads-legs-derive-base";
  derivationKind: Pattern5DerivationKind;
  /** После prelude — те же поля, что у base/production */
  totalParticipants?: number;
  derivedTotalObjects?: number;
  replacementFeature: string;
  replacementFeatureTotal: number;
  firstKind: string;
  secondKind: string;
  firstFeature: number;
  secondFeature: number;
  replacementStep: number;
  questionAsks: string;
  requiresPositiveBothKinds: boolean;
  completenessStatus: Pattern5CompletenessStatus;
  /** Для compare_after_replace */
  answerTransform?: { type: "compare_results"; ... };
  /** Для ratio_equality (5.7) — отдельный sub-flow */
  ratioConstraint?: { equalTotals: string };
}
```

---

## 4. progressionProfile и runner-flow

| Задача | recommendedProfile | recommendedFlow | Экраны (черновик) |
|--------|:------------------:|-----------------|-------------------|
| 5.3 | **2** | progression | read → rule (short) → assume → calc → answer |
| 5.6 | **2** | progression | read → **derive (рукояти)** → rule → assume → calc → answer |
| 5.1 | **3** | custom_worksheets + hub | read → **feature switch intro** → worksheets → hub? → word C |
| 5.2 | **2** | progression | read → **unit conversion** → assume → calc → answer |
| 5.4 | **3** | progression | read → assume → calc → **compare** → word |
| 5.5 | **4** | custom_worksheets | read → **limb intro** → worksheets → word C |
| 5.7 | **4** | word_solution | read → **ratio scaffold** → word C *(blocked)* |

### Transfer / write_expression

Ни одна задача 5.x **не** рекомендуется как transfer-pattern (в отличие от 4.03): все требуют либо progression с prelude, либо длинного word_solution mode C.

---

## 5. Publish recommendations

| Решение | Задачи | Когда |
|---------|--------|-------|
| **childRouteCandidate** | 5.3, 5.6 | После runner + e2e + smoke (5.3 — Wave A, 5.6 — Wave B) |
| **reserve** | 5.1, 5.2, 5.4 | Prelude или compare после эталонов 5.3/5.6 |
| **methodistOnly** *(blocked_until_runner)* | 5.5 | `unsupported_for_now` — **не reserve**; нужен экран limb_decompose |
| **blocked** | 5.7 | Ratio/equality — **не публиковать в childRoute** до отдельного ratio runner |
| **methodistOnly** | все 5.x *сейчас* | До завершения pattern-5 increment |
| **archive** | — | нет |

### Правило классификации publish

- **`reserve`** — задача готова к использованию в детском маршруте, но идёт не в первой волне.
- **`unsupported_for_now` + `methodistOnly`** — отложена до отдельного runner; **не может быть reserve**.
- **`blocked`** — методически не heads-legs replacement (5.7).

**Не поднимать `HEADS_LEGS_CHILD_ROUTE_MAX_NUMBER` выше 31**, пока pattern 5 не пройдёт полный цикл (audit → runner → QA → e2e → production smoke).

---

## 6. Риски и проверки (п. 7 аудита)

| Риск | Задачи | Решение |
|------|--------|---------|
| Насильно притянуты к HL | 5.2–5.7 (Star Wars) | Модели корректны; сюжет не ломает математику |
| Лучше уравнением | 5.7, частично 5.1 | 5.7 — blocked; 5.1 — prelude вместо системы уравнений |
| Несколько методов | 5.7 | needsMethodChoice: ratio vs replacement |
| Выбор метода ребёнком | 5.7 | Hub только после согласования; иначе один scaffold |
| «Не heads-legs» | **5.5** | Отдельный limb_decompose flow, не score/production |

---

## 7. Флаги реализации (из аудита)

| ID | needsRunnerChange | needsExpressionValidation | needsMethodChoice | suggestedE2E |
|----|:-----------------:|:-------------------------:|:-----------------:|--------------|
| 5.1 | ✓ | ✓ | ✗ | feature switch → 9 единорогов |
| 5.2 | ✓ | ✓ | ✗ | 54×2=108 → 34 Джава |
| 5.3 | ✓ | ✓ | ✗ | классическая замена 17+12 |
| 5.4 | ✓ | ✓ | ✗ | compare: имперских +2 |
| 5.5 | ✓ | ✓ | ✗ | limb: 7 осьминогов *(methodistOnly до runner)* |
| 5.6 | ✓ | ✓ | ✗ | рукояти → 2 меча Джедаев |
| 5.7 | ✓ | ✓ | **✓** | ratio 7+14 *(blocked)* |

---

## 8. План инкрементов (после согласования)

### Wave A — `heads-legs-derive-base` pilot (только 5.3)

1. Реализовать **`heads-legs-derive-base`** как prelude + replacement (на базе `heads-legs-base`).
2. Подключить **только 5.3** как первую `childRouteCandidate`.
3. Добавить `ruleInstance` / `progressionProfile: 2` для 5.3.
4. Проверить, что **5.5** (`methodistOnly`) и **5.7** (`blocked`) остаются вне childRoute.
5. QA: **`unsupported_for_now` не может попасть в childRoute**.
6. e2e только на **5.3** + non-pilot regression.
7. **`HEADS_LEGS_CHILD_ROUTE_MAX_NUMBER` не поднимать** в Wave A.

### Wave B — 5.6 (common resource prelude)

### Wave C — 5.1, 5.2 (preludes: feature switch, unit conversion)

### Wave D — 5.4 (compare_results, profile 3)

### Wave E — 5.5 (limb_decompose — отдельный runner, затем пересмотр publish)

### Wave F — 5.7 (ratio/equality mini-runner или permanent block)

---

## 9. Definition of Done (этот документ)

- [x] Все 7 задач паттерна 5 перечислены (№32–38)
- [x] Математический разбор по каждой
- [x] completenessStatus + solutionMode
- [x] publish recommendation
- [x] Вывод по MethodRule / runner / profile
- [x] `completeness-audit.ts` создан
- [x] ТЗ создано
- [ ] **Согласование заказчиком** — gate перед кодом runner

---

## 10. Связанные артеfacts

| Файл | Назначение |
|------|------------|
| `src/data/heads-legs/pattern-5/completeness-audit.ts` | Машиночитаемый аудит |
| `src/data/heads-legs/guided/custom/steps-5-1.ts` | Черновик UI 5.1 |
| `src/data/heads-legs/guided/custom/steps-5-5.ts` | Черновик UI 5.5 |
| `src/data/heads-legs/solution-lines.generated.ts` | Эталоны word_solution |
| `content/import/method-heads-legs.txt` | Методичка §5.1–5.7 |
| `docs/production-reports/heads-legs-2026-06.md` | Статус patterns 1–4 |
