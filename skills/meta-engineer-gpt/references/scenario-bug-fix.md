# Scenario - Bug fix

## Use when

Use when the task corrects broken behavior, invalid state, wrong output, or a reliability issue.

## Route next

- [domain-completeness.md](domain-completeness.md) - to search mirrored paths and second-order effects
- [domain-state-and-invariants.md](domain-state-and-invariants.md) - to restate the rule that was broken
- [domain-correctness-and-verification.md](domain-correctness-and-verification.md) - to prove the fix holds
- [domain-observability-and-operations.md](domain-observability-and-operations.md) - to catch any recurrence early

## Questions

- What exact invariant is broken, and how can you reproduce it reliably? Examples: duplicate state, wrong total, lost input
- Why did the system allow this bug to exist? Examples: missing guard, split logic, stale assumption
- Where else can the same pattern fail even if the symptom differs? Examples: sibling route, mirrored UI, shared parser
- What proof would convince you this bug is truly closed? Examples: regression test, log check, multi-path reproduction
