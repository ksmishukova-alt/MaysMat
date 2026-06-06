# ТЗ: progressionProfile для паттерна 3 «Кто сколько сделал»

> Версия: 1.0 · Июнь 2025  
> Предусловие: паттерны 1–2 покрыты progressionProfile, MethodRuleScreen, QA и e2e (`af277c8`, cleanup `8a9f76c`).

---

## Контекст

Паттерн 3 — два вида участников, каждый делает / получает / собирает **разное количество**, известно **общее количество результата** (иногда — и участников).

Это тот же **метод замены**, но в новом контексте: решённые задачи, пирожки, конфеты, снежинки, мыши, яблоки. Ребёнок должен понять, что метод не зависит от сюжета.

**Pilot-задачи:** 3.1–3.7 (`heads-legs-3-01` … `heads-legs-3-07`).

---

## 1. Аудит полноты условий (выполнен до реализации)

| ID | Задача | totalParticipants | totalResult | firstResult | secondResult | unique answer | requiresPositiveBothKinds | completenessStatus | Режим runner |
|----|--------|:-----------------:|:-----------:|:-----------:|:------------:|:-------------:|:-------------------------:|--------------------|--------------|
| **3.1** | Третьеклассники и пятиклассники | ✗ | 42 задачи | 3 | 5 | ✗ (9+3 или 4+6) | ✓ | `incomplete_condition` | **diagnostic** |
| **3.2** | Пирожки | ✗ (18 пирожков) | 18 | 3 (дев.) | 4 (мал.) | ✓ (3 м, 2 д) | ✓ | `complete_unique_answer` | **enumeration** → profile 2 |
| **3.3** | Конфеты в классе | 30 | 75 | 2 (м) | 3 (д) | ✓ (15 дев.) | ✓ | `complete_unique_answer` | **profile 1** (первая полная замена) |
| **3.4** | Снежинки | 30 | 530 | 15 (м) | 19 (д) | ✓ (10 м, 20 д) | ✓ | `complete_unique_answer` | profile 2 |
| **3.5** | Совята и котята | 34 | 172 мыши | 7 (сов.) | 4 (кот.) | ✓ (сравнение: котята +4) | ✓ | `complete_unique_answer` | profile 3 + `answerTransform: compare_results` |
| **3.6** | Ученики съели конфеты | 25 | 95 | 3 (м) | 5 (д) | ✓ (15 м, 10 д) | ✓ | `complete_unique_answer` | profile 3 |
| **3.7** | Яблоки на варенье | ✗ | 26 | 4 (д) | 6 (м) | ✗ (5 или 2 дев.) | ✓ | `complete_multiple_answers` | profile 4 + `multi_set` |

### Выводы аудита

1. **3.1 не использовать как profile 1** — нет «сколько всего учеников»; уже есть diagnostic-flow (`steps-3-1.ts`, `answers.ts: diagnostic`).
2. **Profile 1 (первая полная замена): 3.3** — есть и участники, и результат, единственный ответ, классический метод.
3. **3.2** — уникальный ответ есть, но без `totalParticipants`; runner: перебор (уже `enumeration` в `task-flow.ts`), не классическая замена.
4. **3.5** — после нахождения 12 совят / 22 котят вопрос задачи про **сравнение мышей** (`buildSteps35Secondary`); нужен `answerTransform: compare_results`.
5. **3.7** — явно «Сколько **могло** быть девочек?»; `multi_set: [{girls:5}, {girls:2}]`, режим D.
6. Во всех задачах, где названы оба вида участников, **`requiresPositiveBothKinds: true`**.

### Что спрашивают

| ID | questionAsks |
|----|--------------|
| 3.1 | — (диагностика: данных не хватает) |
| 3.2 | сколько мальчиков и сколько девочек |
| 3.3 | сколько девочек в классе |
| 3.4 | сколько мальчиков и сколько девочек |
| 3.5 | кто поймал больше мышек и на сколько |
| 3.6 | сколько мальчиков и сколько девочек |
| 3.7 | сколько могло быть девочек (два варианта) |

---

## 2. Особое правило: нулевые участники

```ts
requiresPositiveBothKinds?: boolean; // true → ответы с 0 участников любого вида отклоняются
```

Применять для всех pilot-задач 3.2–3.7.

---

## 3. Методическое правило

**Название:** Кто сколько сделал?  
**Якорь:** Сначала представим, что все участники сделали одинаково.

**fullRule** (11 шагов): см. постановку заказчика — от «найдём участников» до «проверим, что спрашивают».

**ruleId:** `heads-legs-production-base`

**Пример ruleInstance для 3.6:**

```
totalParticipants: 25, totalResult: 95
firstKind: мальчики, firstResult: 3
secondKind: девочки, secondResult: 5
resultName: конфет, assumeKind: мальчики
replacementStep: 2, questionAsks: сколько мальчиков и сколько девочек
requiresPositiveBothKinds: true
completenessStatus: complete_unique_answer
```

---

## 4. Модель данных

```ts
type TaskCompletenessStatus =
  | "complete_unique_answer"
  | "complete_multiple_answers"
  | "incomplete_condition"
  | "requires_positive_participants_constraint";

interface HeadsLegsProductionRuleInstance {
  ruleId: "heads-legs-production-base";
  totalParticipants?: number;
  totalResult: number;
  firstKind: string;
  firstResult: number;
  secondKind: string;
  secondResult: number;
  resultName: string;
  assumeKind: string;
  replacementStep: number;
  questionAsks: string;
  requiresPositiveBothKinds?: boolean;
  completenessStatus: TaskCompletenessStatus;
  answerTransform?: {
    type: "compare_results" | "difference_between_results" | "none";
    resultLabel?: string;
  };
}
```

Источник аудита: `src/data/heads-legs/production-pattern/completeness-audit.ts`

---

## 5. progressionProfile (рекомендация после аудита)

| methodTaskId | progressionProfile | showRuleScreen | Примечание |
|--------------|-------------------|----------------|------------|
| 3.1 | — | — | diagnostic, не childRoute regular |
| 3.2 | 2 | true | enumeration-flow |
| 3.3 | **1** | true | первая полная замена |
| 3.4 | 2 | true | |
| 3.5 | 3 | false | hub + compare_results |
| 3.6 | **4** | false | word_solution |
| 3.7 | 4 | false | word_solution + multi_set |

> Альтернатива: 3.6 как profile 4 (word_solution-only) — см. пример текстового решения в постановке.

---

## 6. Неполные / неоднозначные задачи

| Статус | Задачи | Действие |
|--------|--------|----------|
| diagnostic | 3.1 | Не переводить в обычный childRoute-flow; экран «Можно ли решить точно?» |
| enumeration | 3.2 | Перебор, не притворяться классической заменой без totalParticipants |
| multiple_answers | 3.7 | `solutionMode: D`, явно «найди все варианты» |

Ребёнок **не дополняет условие** числом, которое является частью решения.

---

## 7. QA (`npm run qa:method-rules`)

Добавить секцию **heads-legs production pattern**:

- [ ] registry `heads-legs-production-base`
- [ ] pilot 3.1–3.7: ruleInstance + progressionProfile (кроме 3.1 diagnostic)
- [ ] `replacementStep = abs(secondResult - firstResult)`
- [ ] childRoute + обычная → `complete_unique_answer`
- [ ] `requiresPositiveBothKinds` → QA на отклонение 0
- [ ] без `totalParticipants` → не обычная childRoute-замена (3.1, 3.2, 3.7)
- [ ] multiple answers → `solutionMode = D` / `multi_set`
- [ ] `questionAsks` заполнен
- [ ] non-pilot regression (напр. `heads-legs-3-10` или задача вне pilot)

---

## 8. E2E (минимум)

| Сценарий | Задача |
|----------|--------|
| Полный rule-flow | **3.3** (не 3.1) |
| Hub production | 3.4 или 3.5 |
| word_solution production | 3.6 |
| requiresPositiveBothKinds | 3.2 или 3.4 — 0 не принимается |
| diagnostic / multiple | 3.1 и/или 3.7 |
| non-pilot regression | задача вне pilot 3.x |

---

## 9. Definition of Done

- [ ] Аудит 3.1–3.7 зафиксирован (`completeness-audit.ts` + этот документ)
- [ ] ruleInstance для корректных задач
- [ ] progressionProfile для pilot 3.2–3.7
- [ ] 3.1 diagnostic, 3.7 multiple — не в обычном childRoute-flow
- [ ] MethodRuleScreen «Кто сколько сделал?»
- [ ] «Запутался? Вспомни правило»
- [ ] Шаг «Проверить, что именно спрашивают»
- [ ] QA + build зелёные
- [ ] e2e на ключевые сценарии
- [ ] Остальные задачи ветки не сломаны

---

## 10. Не входит в итерацию

- progressionProfile на все 51 задачи
- paper-mode
- Star Wars / сложные задачи
- паттерны 4–7
- изменение публикационной логики всей ветки

---

## Главная мысль

**Сначала математическая корректность, потом runner.** Паттерн 3 нельзя механически копировать с 1–2: есть неполные условия, несколько решений и запрет нулевых участников.
