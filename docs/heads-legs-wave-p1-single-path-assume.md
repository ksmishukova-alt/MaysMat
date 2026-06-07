# Wave P1: single-path assume cleanup (childRoute 1.x–3.x)

Мини-проект **после** dual-path fix 5.2/5.6. **Не меняет** childRoute, allowlist, публикацию.

## Правило волны

Если оба пути математически корректны: либо dual-path runner, либо explicitTrainingPath с честной формулировкой. Запрещено: «удобнее» при single-path validation.

Перегенерация: `npm run generate:heads-legs-wave-p1`

## Сводка

| Метрика | Значение |
|---|---|
| Задач stages 1–3 (все) | 27 |
| childRoute scope | 26 |
| **P1 fix candidates** (2-й путь + single-path) | **7** |
| Уже OK (dual/explicit/no assume) | 1 |
| Defer (legacy/special) | 17 |

## P1 fix candidates (приоритет волны)

| UI | ID | taskId | 2-й путь | Сейчас | Рекомендация | Риск | Решение |
|---:|---|---|---|---|---|---|---|
| 1 | 1.1 | `heads-legs-1-01` | yes | single_path_assume | explicit_training_path | medium | pending — explicit_training_path (profile 1) |
| 3 | 1.3 | `heads-legs-1-03` | yes | single_path_assume | explicit_training_path | medium | pending — explicit_training_path (profile 2) |
| 11 | 2.1 | `heads-legs-2-01` | yes | single_path_assume | explicit_training_path | medium | pending — explicit_training_path (profile 1) |
| 12 | 2.2 | `heads-legs-2-02` | yes | single_path_assume | explicit_training_path | medium | pending — explicit_training_path (profile 2) |
| 13 | 2.3 | `heads-legs-2-03` | yes | single_path_assume | explicit_training_path | medium | pending — explicit_training_path (profile 2) |
| 22 | 3.3 | `heads-legs-3-03` | yes | single_path_assume | explicit_training_path | medium | pending — explicit_training_path (profile 1) |
| 23 | 3.4 | `heads-legs-3-04` | yes | single_path_assume | explicit_training_path | medium | pending — explicit_training_path (profile 2) |

## Полная таблица (childRoute 1.x–3.x)

| UI | ID | title | 2-й путь | runner | рекомендация | риск | решение |
|---:|---|---|---|---|---|---|---|
| 1 | 1.1 | Звери и птицы | yes | single_path_assume | explicit_training_path | medium | pending — explicit_training_path (profile 1) |
| 2 | 1.2 | Цыплята и змеи | special | single_path_assume | explicit_training_path | low | pending — explicit: тренируем через цыплят (змеи дают 0 ног) |
| 3 | 1.3 | Гусята и крокодильчики | yes | single_path_assume | explicit_training_path | medium | pending — explicit_training_path (profile 2) |
| 4 | 1.4 | Жуки и пауки | yes | no_assume | defer_special_flow | low | pending — выбрать dual_path или explicit_training_path |
| 5 | 1.6 | Велосипедисты | yes | no_assume | defer_special_flow | low | pending — выбрать dual_path или explicit_training_path |
| 6 | 1.7 | Велосипеды на парковке | yes | no_assume | defer_special_flow | low | pending — выбрать dual_path или explicit_training_path |
| 7 | 1.10 | Гномы и пони | yes | legacy_digital | defer_special_flow | high | pending — выбрать dual_path или explicit_training_path |
| 8 | 1.5 | Жуки и пауки: правые ноги | special | no_assume | defer_special_flow | low | pending — derived_half_feature; assume вне scope классической замены |
| 9 | 1.8 | Мухи и слоны | special | legacy_digital | defer_legacy | high | pending — миграция DigitalTaskPlayer → progression pilot |
| 10 | 1.13 | Роботы AT-ST и AT-AT | yes | legacy_digital | defer_special_flow | high | pending — выбрать dual_path или explicit_training_path |
| 11 | 2.1 | Клумбы около Лицея и Гимназии | yes | single_path_assume | explicit_training_path | medium | pending — explicit_training_path (profile 1) |
| 12 | 2.2 | Коробки с карандашами | yes | single_path_assume | explicit_training_path | medium | pending — explicit_training_path (profile 2) |
| 13 | 2.3 | Дроны-рабочие и дроны-пастухи | yes | single_path_assume | explicit_training_path | medium | pending — explicit_training_path (profile 2) |
| 14 | 2.4 | Пирожные по 100 и 125 рублей | yes | no_assume | defer_special_flow | low | pending — выбрать dual_path или explicit_training_path |
| 15 | 2.5 | Коробки простых и цветных карандашей | yes | no_assume | defer_special_flow | low | pending — выбрать dual_path или explicit_training_path |
| 16 | 2.6 | Львята и тигрята | yes | no_assume | defer_special_flow | low | pending — выбрать dual_path или explicit_training_path |
| 17 | 2.7 | Собаки и кошки | yes | no_assume | defer_special_flow | low | pending — выбрать dual_path или explicit_training_path |
| 18 | 1.9 | Дроиды и генерал Гривус | no | legacy_digital | defer_special_flow | none | pending — выбрать dual_path или explicit_training_path |
| 19 | 1.11 | Жирафы и страусы | yes | legacy_digital | defer_special_flow | high | pending — выбрать dual_path или explicit_training_path |
| 20 | 1.14 | Табуретки и стулья | yes | legacy_digital | defer_special_flow | high | pending — выбрать dual_path или explicit_training_path |
| 21 | 3.2 | Пирожки мальчиков и девочек | no | no_assume | already_ok | none | no change |
| 22 | 3.3 | Конфеты в классе | yes | single_path_assume | explicit_training_path | medium | pending — explicit_training_path (profile 1) |
| 23 | 3.4 | Снежинки | yes | single_path_assume | explicit_training_path | medium | pending — explicit_training_path (profile 2) |
| 24 | 3.5 | Совята и котята | yes | no_assume | defer_special_flow | low | pending — выбрать dual_path или explicit_training_path |
| 25 | 3.6 | Ученики съели конфеты | yes | no_assume | defer_special_flow | low | pending — выбрать dual_path или explicit_training_path |
| 26 | 3.7 | Яблоки на варенье | special | no_assume | defer_special_flow | low | pending — multiple_answers / diagnostic |

## Representative tasks для e2e/smoke (предложение)

- **1.1** — base pattern, profile 1, эталон explicit_training или dual_path
- **2.1** — value pattern, profile 1
- **3.3** — production pattern, profile 1

## Вне scope этой волны

- 4.x / 5.x (4.3 уже explicit_training; 5.2/5.6 dual_path methodistOnly)
- legacy reserve в childRoute (1.8) — отдельная миграция
- blocked 5.5/5.7