# Scenario — Bug fix

## Use when

The task corrects broken behavior, invalid state, wrong output, or a reliability issue.

## Route next

- [../domains/correctness.md](../domains/correctness.md) — to prove the fix holds
- [../domains/completeness.md](../domains/completeness.md) — to search mirrored paths and second-order effects
- [../domains/state-and-data.md](../domains/state-and-data.md) — to restate the rule that was broken
- [../domains/observability.md](../domains/observability.md) — to catch any recurrence early
- [../domains/reliability.md](../domains/reliability.md) — to harden the path that failed

## Questions

- What exact invariant is broken, and how can you reproduce it reliably? (e.g., duplicate state, wrong total, lost input, invalid transition)
- Why did the system allow this bug to exist? (e.g., missing guard, split logic, stale assumption, absent test)
- Where else can the same pattern fail even if the symptom differs? (e.g., sibling route, mirrored UI, shared parser, similar query)
- What proof would convince you this bug is truly closed? (e.g., regression test, log check, multi-path reproduction)
