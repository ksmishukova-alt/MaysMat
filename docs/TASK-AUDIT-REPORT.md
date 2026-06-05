# Отчёт тестирования задач (2026-06-05)

Автоматический аудит + эвристики UI/UX, методологии (L1–L5, flow F1–F10), падежи, парсинг модели.

| Блок | Всего | ОК | С замечаниями |
|------|------:|---:|--------------:|
| Дирихле (methodology-bank) | 218 | 218 | 0 |
| Головы и ноги | 51 | 51 | 0 |
| Прочие (legacy) | 3 | — | — |

**Легенда:** 🔴 ошибка/блокер · 🟡 предупреждение · 🔵 замечание · **ОК** — замечаний нет

---

## Дирихле — methodology-bank

| № | ID | Статус |
|---|-----|--------|
| M0.1 | `dirichlet-t1-01` | **ОК** |
| M0.2 | `dirichlet-t1-02` | **ОК** |
| M0.3 | `dirichlet-t1-03` | **ОК** |
| M0.4 | `dirichlet-t1-07` | **ОК** |
| M1.1 | `dirichlet-t1-04` | **ОК** |
| M1.2 | `dirichlet-t1-05` | **ОК** |
| M1.3 | `dirichlet-t1-06` | **ОК** |
| M1.4 | `dirichlet-t1-08` | **ОК** |
| M1.5 | `dirichlet-t1-13` | **ОК** |
| M2.1 | `dirichlet-t1-09` | **ОК** |
| M2.2 | `dirichlet-t1-10` | **ОК** |
| M2.3 | `dirichlet-t1-11` | **ОК** |
| M2.4 | `dirichlet-t1-12` | **ОК** |
| M2.5 | `dirichlet-t1-14` | **ОК** |
| M2.6 | `dirichlet-t1-15` | **ОК** |
| M2.7 | `dirichlet-t1-16` | **ОК** |
| M3.1 | `dirichlet-t2-01` | **ОК** |
| M3.2 | `dirichlet-t2-02` | **ОК** |
| M3.3 | `dirichlet-t2-03` | **ОК** |
| M3.4 | `dirichlet-t2-04` | **ОК** |
| M3.5 | `dirichlet-t2-05` | **ОК** |
| M4.1 | `dirichlet-t3-01` | **ОК** |
| M4.2 | `dirichlet-t3-02` | **ОК** |
| M4.3 | `dirichlet-t3-03` | **ОК** |
| M4.4 | `dirichlet-t3-04` | **ОК** |
| M4.5 | `dirichlet-t3-05` | **ОК** |
| M4.6 | `dirichlet-t3-06` | **ОК** |
| M4.7 | `dirichlet-t3-07` | **ОК** |
| M4.8 | `dirichlet-t3-08` | **ОК** |
| M4.9 | `dirichlet-t3-09` | **ОК** |
| M4.10 | `dirichlet-t3-10` | **ОК** |
| M4.11 | `dirichlet-t3-11` | **ОК** |
| M4.12 | `dirichlet-t3-12` | **ОК** |
| M4.13 | `dirichlet-t3-13` | **ОК** |
| M4.14 | `dirichlet-t3-14` | **ОК** |
| M4.15 | `dirichlet-t3-15` | **ОК** |
| M4.16 | `dirichlet-t3-16` | **ОК** |
| M4.17 | `dirichlet-t3-17` | **ОК** |
| M4.18 | `dirichlet-t3-18` | **ОК** |
| M4.19 | `dirichlet-t3-19` | **ОК** |
| M4.20 | `dirichlet-t3-20` | **ОК** |
| M4.21 | `dirichlet-t3-21` | **ОК** |
| M4.22 | `dirichlet-t3-22` | **ОК** |
| M4.23 | `dirichlet-t3-23` | **ОК** |
| M5.1 | `dirichlet-t4-01` | **ОК** |
| M5.2 | `dirichlet-t4-02` | **ОК** |
| M5.3 | `dirichlet-t4-03` | **ОК** |
| M5.4 | `dirichlet-t8-01` | **ОК** |
| M5.5 | `dirichlet-t4-04` | **ОК** |
| M5.6 | `dirichlet-t4-05` | **ОК** |
| M5.7 | `dirichlet-t4-06` | **ОК** |
| M5.8 | `dirichlet-t4-07` | **ОК** |
| M5.9 | `dirichlet-t4-08` | **ОК** |
| M5.10 | `dirichlet-t4-09` | **ОК** |
| M5.11 | `dirichlet-t4-10` | **ОК** |
| M5.12 | `dirichlet-t4-11` | **ОК** |
| M5.13 | `dirichlet-t4-12` | **ОК** |
| M5.14 | `dirichlet-t4-13` | **ОК** |
| M5.15 | `dirichlet-t4-14` | **ОК** |
| M5.16 | `dirichlet-t4-15` | **ОК** |
| M5.17 | `dirichlet-t4-16` | **ОК** |
| M5.18 | `dirichlet-t4-17` | **ОК** |
| M5.19 | `dirichlet-t4-18` | **ОК** |
| M5.20 | `dirichlet-t4-19` | **ОК** |
| M5.21 | `dirichlet-t4-20` | **ОК** |
| M5.22 | `dirichlet-t4-21` | **ОК** |
| M5.23 | `dirichlet-t4-22` | **ОК** |
| M5.24 | `dirichlet-t4-23` | **ОК** |
| M5.25 | `dirichlet-t4-24` | **ОК** |
| M5.26 | `dirichlet-t4-25` | **ОК** |
| M5.27 | `dirichlet-t4-26` | **ОК** |
| M5.28 | `dirichlet-t4-27` | **ОК** |
| M5.29 | `dirichlet-t4-28` | **ОК** |
| M5.30 | `dirichlet-t4-29` | **ОК** |
| M5.31 | `dirichlet-t4-30` | **ОК** |
| M5.32 | `dirichlet-t4-31` | **ОК** |
| M5.33 | `dirichlet-t4-32` | **ОК** |
| M5.34 | `dirichlet-t4-33` | **ОК** |
| M5.35 | `dirichlet-t4-34` | **ОК** |
| M5.36 | `dirichlet-t4-35` | **ОК** |
| M5.37 | `dirichlet-t4-36` | **ОК** |
| M5.38 | `dirichlet-t4-37` | **ОК** |
| M5.39 | `dirichlet-t4-38` | **ОК** |
| M5.40 | `dirichlet-t4-39` | **ОК** |
| M5.41 | `dirichlet-t4-40` | **ОК** |
| M5.42 | `dirichlet-t4-41` | **ОК** |
| M5.43 | `dirichlet-t4-42` | **ОК** |
| M5.44 | `dirichlet-t4-43` | **ОК** |
| M5.45 | `dirichlet-t4-44` | **ОК** |
| M5.46 | `dirichlet-t4-45` | **ОК** |
| M5.47 | `dirichlet-t4-46` | **ОК** |
| M5.48 | `dirichlet-t4-47` | **ОК** |
| M5.49 | `dirichlet-t4-48` | **ОК** |
| M5.50 | `dirichlet-t4-49` | **ОК** |
| M5.51 | `dirichlet-t4-50` | **ОК** |
| M5.52 | `dirichlet-t4-51` | **ОК** |
| M5.53 | `dirichlet-t4-52` | **ОК** |
| M5.54 | `dirichlet-t4-53` | **ОК** |
| M5.55 | `dirichlet-t4-54` | **ОК** |
| M6.1 | `dirichlet-t5-01` | **ОК** |
| M6.2 | `dirichlet-t5-02` | **ОК** |
| M6.3 | `dirichlet-t5-03` | **ОК** |
| M6.4 | `dirichlet-t5-04` | **ОК** |
| M6.5 | `dirichlet-t5-05` | **ОК** |
| M6.6 | `dirichlet-t5-06` | **ОК** |
| M6.7 | `dirichlet-t5-07` | **ОК** |
| M6.8 | `dirichlet-t5-08` | **ОК** |
| M6.9 | `dirichlet-t5-09` | **ОК** |
| M6.10 | `dirichlet-t5-10` | **ОК** |
| M6.11 | `dirichlet-t5-11` | **ОК** |
| M6.12 | `dirichlet-t5-12` | **ОК** |
| M6.13 | `dirichlet-t5-13` | **ОК** |
| M6.14 | `dirichlet-t5-14` | **ОК** |
| M6.15 | `dirichlet-t5-15` | **ОК** |
| M6.16 | `dirichlet-t5-16` | **ОК** |
| M6.17 | `dirichlet-t5-17` | **ОК** |
| M6.18 | `dirichlet-t5-18` | **ОК** |
| M6.19 | `dirichlet-t5-19` | **ОК** |
| M6.20 | `dirichlet-t5-20` | **ОК** |
| M7.1 | `dirichlet-t6-01` | **ОК** |
| M7.2 | `dirichlet-t6-02` | **ОК** |
| M7.3 | `dirichlet-t6-03` | **ОК** |
| M7.4 | `dirichlet-t6-04` | **ОК** |
| M7.5 | `dirichlet-t6-05` | **ОК** |
| M7.6 | `dirichlet-t6-06` | **ОК** |
| M7.7 | `dirichlet-t6-07` | **ОК** |
| M7.8 | `dirichlet-t6-08` | **ОК** |
| M7.9 | `dirichlet-t6-09` | **ОК** |
| M7.10 | `dirichlet-t6-10` | **ОК** |
| M7.11 | `dirichlet-t6-11` | **ОК** |
| M7.12 | `dirichlet-t6-12` | **ОК** |
| M7.13 | `dirichlet-t6-13` | **ОК** |
| M7.14 | `dirichlet-t6-14` | **ОК** |
| M7.15 | `dirichlet-t6-15` | **ОК** |
| M7.16 | `dirichlet-t6-16` | **ОК** |
| M7.17 | `dirichlet-t6-17` | **ОК** |
| M7.18 | `dirichlet-t6-18` | **ОК** |
| M7.19 | `dirichlet-t6-19` | **ОК** |
| M7.20 | `dirichlet-t6-20` | **ОК** |
| M7.21 | `dirichlet-t6-21` | **ОК** |
| M7.22 | `dirichlet-t6-22` | **ОК** |
| M7.23 | `dirichlet-t6-23` | **ОК** |
| M7.24 | `dirichlet-t6-24` | **ОК** |
| M7.25 | `dirichlet-t6-25` | **ОК** |
| M7.26 | `dirichlet-t6-26` | **ОК** |
| M7.27 | `dirichlet-t6-27` | **ОК** |
| M7.28 | `dirichlet-t6-28` | **ОК** |
| M7.29 | `dirichlet-t6-29` | **ОК** |
| M7.30 | `dirichlet-t6-30` | **ОК** |
| M7.31 | `dirichlet-t6-31` | **ОК** |
| M7.32 | `dirichlet-t6-32` | **ОК** |
| M7.33 | `dirichlet-t6-33` | **ОК** |
| M7.34 | `dirichlet-t6-34` | **ОК** |
| M8.1 | `dirichlet-t7-01` | **ОК** |
| M8.2 | `dirichlet-t7-02` | **ОК** |
| M9.1 | `dirichlet-t9-01` | **ОК** |
| M9.2 | `dirichlet-t9-02` | **ОК** |
| M9.3 | `dirichlet-t9-03` | **ОК** |
| M9.4 | `dirichlet-t9-04` | **ОК** |
| M9.5 | `dirichlet-t9-05` | **ОК** |
| M9.6 | `dirichlet-t9-06` | **ОК** |
| M9.7 | `dirichlet-t9-07` | **ОК** |
| M9.8 | `dirichlet-t9-08` | **ОК** |
| M9.9 | `dirichlet-t9-09` | **ОК** |
| M9.10 | `dirichlet-t9-10` | **ОК** |
| M9.11 | `dirichlet-t9-11` | **ОК** |
| M9.12 | `dirichlet-t9-12` | **ОК** |
| M9.13 | `dirichlet-t9-13` | **ОК** |
| M9.14 | `dirichlet-t9-14` | **ОК** |
| M9.15 | `dirichlet-t9-15` | **ОК** |
| M9.16 | `dirichlet-t9-16` | **ОК** |
| M9.17 | `dirichlet-t9-17` | **ОК** |
| M9.18 | `dirichlet-t9-18` | **ОК** |
| M9.19 | `dirichlet-t9-19` | **ОК** |
| M9.20 | `dirichlet-t9-20` | **ОК** |
| M9.21 | `dirichlet-t9-21` | **ОК** |
| M9.22 | `dirichlet-t9-22` | **ОК** |
| M9.23 | `dirichlet-t9-23` | **ОК** |
| M9.24 | `dirichlet-t9-24` | **ОК** |
| M9.25 | `dirichlet-t9-25` | **ОК** |
| M9.26 | `dirichlet-t9-26` | **ОК** |
| M9.27 | `dirichlet-t9-27` | **ОК** |
| M9.28 | `dirichlet-t9-28` | **ОК** |
| M9.29 | `dirichlet-t9-29` | **ОК** |
| M9.30 | `dirichlet-t9-30` | **ОК** |
| M9.31 | `dirichlet-t9-31` | **ОК** |
| M9.32 | `dirichlet-t9-32` | **ОК** |
| M9.33 | `dirichlet-t9-33` | **ОК** |
| M9.34 | `dirichlet-t9-34` | **ОК** |
| M9.35 | `dirichlet-t9-35` | **ОК** |
| M9.36 | `dirichlet-t9-36` | **ОК** |
| M9.37 | `dirichlet-t9-37` | **ОК** |
| M9.38 | `dirichlet-t9-38` | **ОК** |
| M9.39 | `dirichlet-t9-39` | **ОК** |
| M9.40 | `dirichlet-t9-40` | **ОК** |
| M9.41 | `dirichlet-t9-41` | **ОК** |
| M9.42 | `dirichlet-t9-42` | **ОК** |
| M9.43 | `dirichlet-t9-43` | **ОК** |
| M9.44 | `dirichlet-t9-44` | **ОК** |
| M9.45 | `dirichlet-t9-45` | **ОК** |
| M9.46 | `dirichlet-t9-46` | **ОК** |
| M9.47 | `dirichlet-t9-47` | **ОК** |
| M9.48 | `dirichlet-t9-48` | **ОК** |
| M9.49 | `dirichlet-t9-49` | **ОК** |
| M9.50 | `dirichlet-t9-50` | **ОК** |
| M9.51 | `dirichlet-t9-51` | **ОК** |
| M9.52 | `dirichlet-t9-52` | **ОК** |
| M9.53 | `dirichlet-t9-53` | **ОК** |
| M9.54 | `dirichlet-t9-54` | **ОК** |
| M9.55 | `dirichlet-t9-55` | **ОК** |
| M9.56 | `dirichlet-t9-56` | **ОК** |
| M9.57 | `dirichlet-t9-57` | **ОК** |
| M9.58 | `dirichlet-t9-58` | **ОК** |
| M9.59 | `dirichlet-t9-59` | **ОК** |
| M9.60 | `dirichlet-t9-60` | **ОК** |
| M9.61 | `dirichlet-t9-61` | **ОК** |
| M9.62 | `dirichlet-t9-62` | **ОК** |
| M9.63 | `dirichlet-t9-63` | **ОК** |

**Итого:** 218 задач — **ОК:** 218, **с замечаниями:** 0


---

## Головы и ноги

| № | ID | Статус |
|---|-----|--------|
| 1.1 | `heads-legs-1-01` | **ОК** |
| 1.2 | `heads-legs-1-02` | **ОК** |
| 1.3 | `heads-legs-1-03` | **ОК** |
| 1.4 | `heads-legs-1-04` | **ОК** |
| 1.5 | `heads-legs-1-05` | **ОК** |
| 1.6 | `heads-legs-1-06` | **ОК** |
| 1.7 | `heads-legs-1-07` | **ОК** |
| 1.8 | `heads-legs-1-08` | **ОК** |
| 1.9 | `heads-legs-1-09` | **ОК** |
| 1.10 | `heads-legs-1-10` | **ОК** |
| 1.11 | `heads-legs-1-11` | **ОК** |
| 1.13 | `heads-legs-1-13` | **ОК** |
| 1.14 | `heads-legs-1-14` | **ОК** |
| 2.1 | `heads-legs-2-01` | **ОК** |
| 2.2 | `heads-legs-2-02` | **ОК** |
| 2.3 | `heads-legs-2-03` | **ОК** |
| 2.4 | `heads-legs-2-04` | **ОК** |
| 2.5 | `heads-legs-2-05` | **ОК** |
| 2.6 | `heads-legs-2-06` | **ОК** |
| 2.7 | `heads-legs-2-07` | **ОК** |
| 3.1 | `heads-legs-3-01` | **ОК** |
| 3.2 | `heads-legs-3-02` | **ОК** |
| 3.3 | `heads-legs-3-03` | **ОК** |
| 3.4 | `heads-legs-3-04` | **ОК** |
| 3.5 | `heads-legs-3-05` | **ОК** |
| 3.6 | `heads-legs-3-06` | **ОК** |
| 3.7 | `heads-legs-3-07` | **ОК** |
| 4.1 | `heads-legs-4-01` | **ОК** |
| 4.2 | `heads-legs-4-02` | **ОК** |
| 4.3 | `heads-legs-4-03` | **ОК** |
| 4.4 | `heads-legs-4-04` | **ОК** |
| 4.5 | `heads-legs-4-05` | **ОК** |
| 5.1 | `heads-legs-5-01` | **ОК** |
| 5.2 | `heads-legs-5-02` | **ОК** |
| 5.3 | `heads-legs-5-03` | **ОК** |
| 5.4 | `heads-legs-5-04` | **ОК** |
| 5.5 | `heads-legs-5-05` | **ОК** |
| 5.6 | `heads-legs-5-06` | **ОК** |
| 5.7 | `heads-legs-5-07` | **ОК** |
| 6.1 | `heads-legs-6-01` | **ОК** |
| 6.2 | `heads-legs-6-02` | **ОК** |
| 6.3 | `heads-legs-6-03` | **ОК** |
| 6.4 | `heads-legs-6-04` | **ОК** |
| 6.5 | `heads-legs-6-05` | **ОК** |
| 7.1 | `heads-legs-7-01` | **ОК** |
| 7.2 | `heads-legs-7-02` | **ОК** |
| 7.3 | `heads-legs-7-03` | **ОК** |
| 7.4 | `heads-legs-7-04` | **ОК** |
| 7.5 | `heads-legs-7-05` | **ОК** |
| 7.6 | `heads-legs-7-06` | **ОК** |
| 7.7 | `heads-legs-7-07` | **ОК** |

**Итого:** 51 задач — **ОК:** 51, **с замечаниями:** 0


---

## Прочие задачи

| № | ID | Статус |
|---|-----|--------|
| fairy-caves-01 | `fairy-caves-01` | **ОК** |
| fairy-caves-02 | `fairy-caves-02` | **ОК** |
| fairy-caves-03 | `fairy-caves-03` | **ОК** |

**Итого:** 3 задач — **ОК:** 3, **с замечаниями:** 0


---

## Системные проблемы (сквозные)

1. **F5/F10 без N/M** — у части геометрических задач compare-шаг формальный (нет явных N, M в условии).
2. **Legacy fairy-caves** — старый runner без guided methodology-bank.

## Рекомендации по приоритету

1. Ручная вычитка L4–L5 задач с «См. задачу …» в ключе (внешние ссылки методички).
2. Прогнать `npm run qa:entity-emojis` после правок эмодзи.
3. F1 compare, conclusionText F4/F7 и generic-категории закрыты (218/218 ОК в `qa:task-audit`).
