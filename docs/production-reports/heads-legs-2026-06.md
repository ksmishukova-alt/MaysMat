# Heads-Legs publication status — 2026-06

## Summary

The Heads-Legs branch has published patterns 1–4 in the child route.

Current child route limit:

`HEADS_LEGS_CHILD_ROUTE_MAX_NUMBER = 31`

This means tasks 1.01 through 4.05 are available in the child route, corresponding to catalog tasks №1–31.

## Published scope

Published in child route:

- Pattern 1 — base heads-and-legs replacement model;
- Pattern 2 — value / quantity / cost model;
- Pattern 3 — production / “who did how much” model;
- Pattern 4 — transfer + score / plus-minus pilot.

Tasks 4.03–4.05 are now available without `?mode=methodist`.

## Not yet published

Pattern 5 is not published.

Tasks starting from catalog №32, including `heads-legs-5-01` and beyond, remain methodist-only / “coming soon” in the child route.

## QA and coverage

Current verified commit:

`6ad7fa7` — Publish heads-legs score pattern tasks 4.03-4.05

Coverage:

- 25 Playwright e2e tests;
- `qa:method-rules` — green;
- `qa:task-quality` — green;
- `qa:task-access` — green;
- `qa:smoke` — green;
- production smoke — passed.

## Status

Heads-Legs patterns 1–4 are published and covered.

## Next recommended step

Plan pattern 5 as a separate increment. Do not expand the child route further until pattern 5 passes audit, implementation, QA, e2e, and production smoke.
