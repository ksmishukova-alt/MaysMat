# Entry Diagnostic v2 — plan (PR track)

## PR 1 — каркас + data-driven flow ✅

- [x] `/diagnostic`, `/diagnostic/run`, `/diagnostic/result`, `/diagnostic/play/[slug]`
- [x] Types, 15×3 seed tasks, 16 mini-game configs + specs
- [x] Session + telemetry events (localStorage)
- [x] Validation + scoring + report engine
- [x] Runner registry (15 компонентов) + data-driven `RunnerCore`
- [x] Mini-game registry + semantic targets per game
- [x] Full flow: intro → 15 blocks (3 tasks + mini-game + block summary) → report
- [x] `npm run qa:entry-diagnostic`, `npm run test:entry-diagnostic`
- [x] E2e: landing, full 1–15, play mode, a11y

## PR 2 — интерактивные runner-boards + 16 mini-game ✅

- [x] 15 интерактивных досок по методологии (`runners/boards/`)
- [x] Встроенный вычислительный помощник (столбик / ×÷)
- [x] 16 отдельных mini-game-компонентов с уникальной темой и layout
- [x] Registry проверяет уникальность компонентов
- [x] visual_board во всех задачах (default + plan + expression)
- [x] E2e full 1–15 проходит с новыми компонентами

## PR 3 — polish (optional)

Replace generic frame with specialized components:

- reading_comprehension_visual
- story_add_sub_visual
- column_add_sub_visual
- column_multiplication_visual
- long_division_visual (RU school notation)

## PR 3 — runners 6–10

- remainder, expression+embedded calculators, text plan, motion, geometry

## PR 4 — runners 11–15 + mini-game polish

- fraction, percent, logic, search, pattern
- Rich mini-game mechanics per brand spec

## PR 5 — tests

- unit: validation edge cases from TZ
- integration: runner registry
- e2e: full 1–15, diagnostic/play mini-games, a11y/responsive

## Data-driven rule

New tasks = edit `src/data/entry-diagnostic/blocks/` only unless new `runnerKind`.
