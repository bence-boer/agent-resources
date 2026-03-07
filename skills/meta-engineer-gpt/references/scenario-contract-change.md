# Scenario - Contract change

## Use when

Use when the task changes what one part of the system expects from another or what stored data now means.

## Route next

- [domain-state-and-invariants.md](domain-state-and-invariants.md) - to restate truth, transitions, and impossible combinations
- [domain-correctness-and-verification.md](domain-correctness-and-verification.md) - to verify both producers and consumers
- [domain-observability-and-operations.md](domain-observability-and-operations.md) - to watch the rollout and any drift
- [domain-completeness.md](domain-completeness.md) - to catch all mirrored readers, writers, and cleanup work

## Questions

- What promise between parts of the system is changing? Examples: payload shape, state meaning, ordering rule
- Who consumes this promise today, and who could break tomorrow? Examples: UI, jobs, tests, integrations
- What must stay compatible, and for how long? Examples: previous clients, stored data, phased rollout
- What migration, fallback, or cleanup path keeps this change safe? Examples: dual-read, backfill, versioning
