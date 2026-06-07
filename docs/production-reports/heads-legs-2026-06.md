# Heads-Legs publication status — 2026-06

## Summary

The Heads-Legs branch has published patterns 1–4 plus one pattern-5 transfer task in the child route.

Current child route:

- **32 published UI tasks** (UI #32 = `heads-legs-5-03`, transfer_replacement)
- `HEADS_LEGS_CHILD_ROUTE_MAX_NUMBER = 31` (auto-by-catalog); 5.3 is an allowlist exception with `routeOrder: 32`

## Published scope

Published in child route:

- Pattern 1 — base heads-and-legs replacement model;
- Pattern 2 — value / quantity / cost model;
- Pattern 3 — production / “who did how much” model;
- Pattern 4 — transfer + score / plus-minus pilot;
- **Pattern 5 (partial)** — `heads-legs-5-03` (Банты и Ранкоры) as **transfer_replacement**, not derive-base.

Tasks 4.03–4.05 and 5.03 are available without `?mode=methodist`.

## Not yet published

- **5.2** (`heads-legs-5-02`, Караван Бант и Дjav) — derive-base `unit_conversion`, methodist-only; dual-path assume.
- **5.6** (`heads-legs-5-06`, Световые мечи) — `publicationCandidate`, methodist-only preview; dual-path assume; not in child route.
- **5.5** (`heads-legs-5-05`) — blocked from child route.
- **5.7** (`heads-legs-5-07`) — blocked from child route.
- **Derive-base (Wave B)** — frozen; no derive-base tasks in child route.

Tasks UI #33+ remain “coming soon” in the child route.

## 2026-06 update

Published `heads-legs-5-03` as UI task **#32**.

This task is classified as **transfer_replacement**, not derive-base.

Derive-base remains frozen.

5.6 is still `publicationCandidate`; 5.5 and 5.7 remain blocked.

Verified commit: `1a5d257` — Publish heads-legs 5.03 transfer candidate as child route UI #32

Production smoke (https://album-myshleniya.vercel.app):

| Route | Result |
|-------|--------|
| `/branch/heads-legs` | Task 32 «Банты и Ранкоры» — «Начать», not «скоро» |
| `/tasks/heads-legs-5-03` | Opens without `?mode=methodist`; 4-screen transfer-flow |
| `/tasks/heads-legs-5-06` | Not published — «Задача недоступна» (methodist preview OK) |
| `/tasks/heads-legs-5-05` | Blocked — «Задача недоступна» |
| `/tasks/heads-legs-5-07` | Blocked — «Задача недоступна» |

## QA and coverage

Coverage:

- Playwright e2e (heads-legs child route + derive guard);
- `qa:method-rules` — green;
- `qa:task-access` — green;
- `qa:smoke` — green (32 child-route tasks);
- production smoke — **passed** (2026-06-05).

## Status

Heads-Legs child route = **32 tasks**. Pattern 5 derive-base remains frozen.

## Next recommended step

Do **not** publish 5.6 or 5.2 in child route yet. P1 backlog: single-path assume in published 1.x–3.x tasks — use dual-path or explicit training-path wording in a separate wave.

---

## 2026-06 update (dual-path derive-base)

Added dual-path assume for derive-base candidates **5.2** and **5.6**.

Both paths are now accepted and lead to separate word-solution branches.

5.2 and 5.6 remain **methodistOnly**; childRoute/allowlist unchanged.

Added screen-by-screen methodology audit for all 51 Heads-Legs tasks.

Verified commit: `f9b0e4f` — Add dual-path assume and screen methodology audit for heads-legs

Production smoke (https://album-myshleniya.vercel.app, post-`f9b0e4f`):

| Route | Result |
|-------|--------|
| `/tasks/heads-legs-5-03` | Published; 4-screen transfer-flow; no derive-text |
| `/tasks/heads-legs-5-02` | Not published — «Задача недоступна» |
| `/tasks/heads-legs-5-02?mode=methodist` | Dual-path assume; Jawa path → «Не хватает ног»; Bantu path → «Лишних ног»; branches do not mix |
| `/tasks/heads-legs-5-06` | Not published — «Задача недоступна» |
| `/tasks/heads-legs-5-06?mode=methodist` | Dual-path assume; Jedi path → «Не хватает кристаллов»; Sith path → «Лишних кристаллов» |

Production smoke — **passed** (2026-06-05, post-`f9b0e4f`).
