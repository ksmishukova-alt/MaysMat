# Wave P1 — remaining screen-audit warnings

Source: `npm run audit:heads-legs-screens` (post-`40bb833`, verified 2026-06-08 overnight stabilization).

**9 warnings, 0 errors.** Это backlog, не блокер публикации.

Правило классификации — см. Wave P1 audit (`docs/heads-legs-wave-p1-single-path-assume.md`).

---

## 1. heads-legs-1-01 (1.1) — Звери и птицы

| Field | Value |
|-------|-------|
| **publish status** | childRoute |
| **warning text** | `childRoute: assume single-path (P1): Выбери предположение` |
| **why it remains** | Wave P1 fix **уже в runner** (`explicitTrainingPath`). Audit-скрипт всё ещё предупреждает о medium-risk assume для любого childRoute single_select, не проверяя runtime fix. |
| **recommended action** | **leave as-is** (runtime OK) или в P1.2 ослабить warning в `audit-heads-legs-screens.ts` для задач с `hasExplicitTrainingPath()` |
| **risk level** | **low** |

---

## 2. heads-legs-1-02 (1.2) — Цыплята и змеи

| Field | Value |
|-------|-------|
| **publish status** | childRoute |
| **warning text** | `childRoute: assume single-path (P1): Выбери предположение` |
| **why it remains** | Не входила в Wave P1 (7 задач). Второй путь «все змеи» математически тривиален (0 ног) — нужна **особая pedagogy**, не dual-path. |
| **recommended action** | **explicitTrainingPath** (copy-only, special case: «тренируем через цыплят») |
| **risk level** | **low** |

---

## 3. heads-legs-1-03 (1.3) — Гусята и крокодильчики

| Field | Value |
|-------|-------|
| **publish status** | childRoute |
| **warning text** | `childRoute: assume single-path (P1): Выбери предположение` |
| **why it remains** | Wave P1 fix **уже в runner**. Warning — audit noise (см. 1.01). |
| **recommended action** | **leave as-is** (runtime OK) или suppress audit warning |
| **risk level** | **low** |

---

## 4. heads-legs-1-08 (1.8) — Мухи и слоны

| Field | Value |
|-------|-------|
| **publish status** | childRoute (legacy reserve) |
| **warning text** | `childRoute legacy tolerated: Legacy DigitalTaskPlayer` |
| **why it remains** | Старый `DigitalTaskPlayer`, не progression pilot. Миграция на unified runner — отдельная волна. |
| **recommended action** | **needs custom runner** / **reserve only** — не трогать в P1.2 assume cleanup |
| **risk level** | **medium** (legacy UX, не assume wording) |

---

## 5. heads-legs-2-01 (2.1) — Клумбы

| Field | Value |
|-------|-------|
| **publish status** | childRoute |
| **warning text** | `childRoute: assume single-path (P1): Выбери предположение` |
| **why it remains** | Wave P1 fix **уже в runner**. Audit noise. |
| **recommended action** | **leave as-is** (runtime OK) или suppress audit warning |
| **risk level** | **low** |

---

## 6. heads-legs-2-02 (2.2) — Коробки с карандашами

| Field | Value |
|-------|-------|
| **publish status** | childRoute |
| **warning text** | `childRoute: assume single-path (P1): Выбери предположение` |
| **why it remains** | Wave P1 fix **уже в runner**. Audit noise. |
| **recommended action** | **leave as-is** (runtime OK) или suppress audit warning |
| **risk level** | **low** |

---

## 7. heads-legs-2-03 (2.3) — Дроны

| Field | Value |
|-------|-------|
| **publish status** | childRoute |
| **warning text** | `childRoute: assume single-path (P1): Выбери предположение` |
| **why it remains** | Wave P1 fix **уже в runner**. Audit noise. |
| **recommended action** | **leave as-is** (runtime OK) или suppress audit warning |
| **risk level** | **low** |

---

## 8. heads-legs-3-03 (3.3) — Конфеты в классе

| Field | Value |
|-------|-------|
| **publish status** | childRoute |
| **warning text** | `childRoute: assume single-path (P1): Выбери предположение` |
| **why it remains** | Wave P1 fix **уже в runner**. Audit noise. |
| **recommended action** | **leave as-is** (runtime OK) или suppress audit warning |
| **risk level** | **low** |

---

## 9. heads-legs-3-04 (3.4) — Снежинки

| Field | Value |
|-------|-------|
| **publish status** | childRoute |
| **warning text** | `childRoute: assume single-path (P1): Выбери предположение` |
| **why it remains** | Wave P1 fix **уже в runner**. Audit noise. |
| **recommended action** | **leave as-is** (runtime OK) или suppress audit warning |
| **risk level** | **low** |

---

# Wave P1.2 recommendation

**Do not implement without explicit approval.** No childRoute / allowlist / publication changes.

## Tasks safe for copy-only explicitTrainingPath

| methodTaskId | taskId | note |
|--------------|--------|------|
| **1.2** | heads-legs-1-02 | Special pedagogy: train through chickens; snake path is trivial (0 legs). Extend `explicit-training-paths.ts` or dedicated override. |

## Tasks that need dualPath

| methodTaskId | note |
|--------------|------|
| *(none in P1.2 scope)* | Early childRoute 1.x–3.x intentionally stay single-path training. Dual-path remains for **5.2 / 5.6** (methodistOnly, already done). |

## Tasks that should stay reserve / leave as-is

| methodTaskId | taskId | reason |
|--------------|--------|--------|
| 1.8 | heads-legs-1-08 | Legacy DigitalTaskPlayer — migrate separately |
| 1.9–1.14 | various | Reserve / custom worksheets (see full-methodology-audit warnings) |
| 1.01, 1.3, 2.1–2.3, 3.3, 3.4 | fixed in P1 | Runtime OK; only audit warning cleanup optional |

## Tasks that require new runner

| methodTaskId | taskId | reason |
|--------------|--------|--------|
| 1.5 | heads-legs-1-05 | `derived_half_feature` — assume outside classic replacement |
| 1.8 | heads-legs-1-08 | Legacy → progression pilot migration |
| 3.2 | heads-legs-3-02 | enumeration-flow (different screen sequence) |
| 3.7 | heads-legs-3-07 | multiple_answers / diagnostic |

## Audit tooling (optional P1.2 hygiene)

- Update `scripts/audit-heads-legs-screens.ts`: skip `mediumAssume` warning when `hasExplicitTrainingPath(methodTaskId)` — reduces 7 false positives to **2 real** (1.2 + legacy 1.8).

## E2E tasks to cover in P1.2

| taskId | why |
|--------|-----|
| heads-legs-1-02 | New special-case explicit training copy |
| heads-legs-1-03 | Regression (already P1; optional) |
| Production re-run | `SMOKE_BASE_URL=… npm run smoke:explicit-training` after deploy of `40bb833` |

## Out of scope for P1.2

- derive-base Wave B publication (5.2, 5.6 in childRoute)
- `PUBLICATION_CANDIDATE_CHILD_ROUTE_ALLOWLIST` changes
- Publishing 5.5, 5.7, or new UI #33+
- Mass dual-path for stages 1–3

---

**Next human decision:** approve or reject Wave P1.2 plan above.
