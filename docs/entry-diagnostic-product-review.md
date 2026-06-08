# Entry Diagnostic v2 — продуктовая проверка

## Ссылки

| Что | URL |
|-----|-----|
| **PR** | _(заполнится после push)_ |
| **Preview (Vercel)** | _(комментарий бота в PR после деплоя)_ |
| **Production** | https://album-myshleniya.vercel.app/diagnostic _(после merge)_ |

## Локальный запуск

```bash
cd album-myshleniya
npm install
npm run dev
```

Откройте в браузере:

| Страница | URL |
|----------|-----|
| Старт диагностики | http://localhost:3000/diagnostic |
| Прохождение | http://localhost:3000/diagnostic/run |
| Итоговый отчёт | http://localhost:3000/diagnostic/result |
| Мини-игра «ПойМАТ!» (play) | http://localhost:3000/diagnostic/play/pojmat |
| Другая мини-игра | http://localhost:3000/diagnostic/play/counting-road |

**Быстрый режим** (короткие таймеры мини-игр, для QA): в консоли браузера  
`localStorage.setItem('entry-diagnostic-fast','1')` и перезагрузить страницу.

Пункт **«Диагностика»** 🩺 есть в нижней навигации приложения.

## Как пройти вручную

1. `/diagnostic` → «Перейти к диагностике» → «Начать диагностику».
2. В каждом из **15 блоков**: 3 задания (уровни 1–3) → мини-игра → экран «Блок N завершён» → «Следующий блок».
3. После блока 15 → «К отчёту» → `/diagnostic/result`.
4. Мини-игры в режиме **play** (без сессии): `/diagnostic/play/<slug>` — список slug в `src/data/entry-diagnostic/mini-games/index.ts`.

## Команды QA / test (повторить перед проверкой)

```bash
npm run qa:entry-diagnostic
npm run test:entry-diagnostic
npm run build
npx playwright test e2e/entry-diagnostic.spec.ts
npx playwright test e2e/entry-diagnostic-responsive.spec.ts
```

Скриншоты для PR (dev-сервер должен быть запущен):

```bash
npx tsx scripts/capture-entry-diagnostic-screenshots.ts
```

## Мобильная проверка (руками)

E2e на 390×844 не заменяет UX-оценку. На телефоне или в DevTools (iPhone 12 / 390px):

- [ ] Landing: кнопка «Перейти к диагностике» не перекрыта нижним nav.
- [ ] Runner: поля ввода и кнопка «Дальше» доступны без горизонтального скролла.
- [ ] Столбик / деление: схема читается, цифры не обрезаны.
- [ ] Мини-игра: цель кликабельна, таймер виден.
- [ ] Block summary и отчёт: списки блоков прокручиваются.

## Чеклист продуктовой проверки

- [ ] Нет технических слов в детском UI: runner, telemetry, validation, placeholder, errorCluster, debug, seed, D1/D2/D3, challenge, play.
- [ ] Русские тексты, падежи, единицы измерения.
- [ ] Названия мини-игр и кнопки понятны ребёнку.
- [ ] Логика блоков и методическая корректность заданий.
- [ ] Визуальная понятность досок (столбик, деление, геометрия, дроби).

## Скриншоты

См. `docs/product-review/entry-diagnostic/*.png`:

1. `01-landing` — старт `/diagnostic`
2. `02-block1-runner-reading` — runner блока 1 (чтение условия)
3. `03-column-add-sub-runner` — столбик
4. `04-long-division-runner` — деление
5. `05-minigame-pojmat` — «МышМат: ПойМАТ!»
6. `06-minigame-counting-road` — «Счётная дорога»
7. `07-block-summary` — summary блока
8. `08-final-report` — итоговый отчёт
9. `09-mobile-landing` — мобильный landing

## Коммиты инкремента

- `6f4c710` — Entry Diagnostic v2, полный flow 15 блоков (PR 1+2)
- `faa670a` — polish: runner boards, mini-games, telemetry (PR 3)
- _(UI copy для продуктовой проверки — отдельный commit в PR)_
