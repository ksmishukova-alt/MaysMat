# Dirichlet readiness status — 2026-06

## Summary

Dirichlet core runners (guided F1, unlucky F3, remainders F4) are stable for review. No new tasks were published in this stabilization pass.

**Total child-route exposure:** 13 tasks across three branches (8 + 1 + 4).

---

## Published scope (child route)

### proof-dirichlet — 8 tasks (F1 guided)

| taskId | method | runner |
|--------|--------|--------|
| dirichlet-t1-01 | M1.01 | dirichlet-guided |
| dirichlet-t1-02 | M1.02 | dirichlet-guided |
| dirichlet-t1-06 | M1.06 | dirichlet-guided |
| dirichlet-t1-09 | M1.09 | dirichlet-guided |
| dirichlet-t1-10 | M1.10 | dirichlet-guided |
| dirichlet-t1-12 | M1.12 | dirichlet-guided |
| dirichlet-t1-13 | M1.13 | dirichlet-guided |
| dirichlet-t1-15 | M1.15 | dirichlet-guided |

### proof-unlucky — 1 task (F3)

| taskId | runner |
|--------|--------|
| dirichlet-t2-02 | dirichlet-unlucky |

Pipeline verified: intro → read → guarantee/worst-case → write_solution → finish.

### arith-remainders — 4 tasks (F4 pilot)

| taskId | method | runner | note |
|--------|--------|--------|------|
| dirichlet-t3-11 | M4.11 | dirichlet-remainders | rule screen, 12 objects / mod 11 |
| dirichlet-t3-22 | M4.22 | dirichlet-remainders | |
| dirichlet-t3-18 | M4.18 | dirichlet-remainders | compact houses (2001 > 2000) |
| dirichlet-t3-24 | M4.24 | dirichlet-remainders | progression profile 4 |

Remainder flow uses «домики для остатков» / houses model. Large modulus (t3-18) uses compact rendering — not thousands of full cells.

---

## Runners verified (local QA)

| Command | Result |
|---------|--------|
| `npm run qa:dirichlet` | green — 219 tasks, phase/support consistency |
| `npm run qa:runner-profile` | 0 errors — unlucky + remainders pipelines |
| `npm run qa:method-rules` | green — remainders childRoute guards |
| `npm run qa:task-access` | green — dirichlet child/methodist/archive guards |
| `npm run qa:smoke` | green — 8 dirichlet + 1 unlucky + 4 remainders |
| `npm run qa:task-quality` | green for child route — no blocking issues in visible route |
| `npm run test:e2e` | 37 passed (includes dirichlet via route smoke guards) |
| `npm run build` | green |

Representative routes checked via QA (not production browser tonight):

- `/branch/dirichlet` — 8 child tasks only
- `dirichlet-t2-02` — unlucky runner
- `dirichlet-t3-11`, `t3-18`, `t3-22`, `t3-24` — remainders runner + write_solution cards

---

## Production smoke

No dedicated Dirichlet production smoke script yet. Route/access guards verified locally.

Heads-Legs production dual-path smoke (same deploy) — **14/14 pass** on https://album-myshleniya.vercel.app.

---

## Blocked / not in child route

### Hidden (geometry / visual required)

| taskId | reason |
|--------|--------|
| dirichlet-t4-26 | `missing_visual_asset`, geometry |
| dirichlet-t4-45 | `missing_visual_asset`, geometry |
| dirichlet-t4-46 | `missing_visual_asset`, geometry |
| dirichlet-t4-47 | `missing_visual_asset`, geometry |

### methodistOnly (preview, not child route)

| taskId | note |
|--------|------|
| dirichlet-t4-14 | incomplete_condition cleared for methodist |
| dirichlet-t4-31 | external ref / answer key — methodist preview only |

### Archive / not mass-published

- `proof-constructions` branch: 63 archive tasks — visible only with archive toggle, not child route
- Tasks with `contains_external_reference` in catalog — not cleared for child route unless explicitly in `MANUAL_PUBLISHING`

### Out of scope (document only)

- Geometry SVG runner
- Graph/table/coloring runner
- Paper-construction full implementation

---

## QA task-quality snapshot

```
Total: 270 tasks
ready: 181, needsReview: 85, blocked: 4
Child-route visible: 45 (all branches)
Child route: no blocking issues (scan-task-quality)
```

Common backlog issue types (not child-route blockers): `too_hard_for_child_route`, `contains_external_reference`, `missing_visual_asset`.

---

## Not changed tonight

- `MANUAL_PUBLISHING` / publish tiers
- No new Dirichlet childRoute tasks
- No geometry/graph/paper runner implementation

---

## Next recommended increment

1. Optional: production smoke script for dirichlet-t2-02 + t3-11 (representative unlucky + remainders).
2. Keep geometry tasks (t4-26, t4-45–47) hidden until SVG runner exists.
3. Remainders Wave B: additional F4 tasks — methodistOnly first, not child route.
4. Do not mass-publish archive/constructions without explicit approval.

Verified baseline commit: `40bb833` (repo state; Dirichlet unchanged in this commit).
