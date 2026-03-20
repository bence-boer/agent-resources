# Scenario — Contract change

## Use when

The task changes what one part of the system expects from another or what stored data now means.

## Route next

- [../domains/state-and-data.md](../domains/state-and-data.md) — to restate truth, transitions, and impossible combinations
- [../domains/correctness.md](../domains/correctness.md) — to verify both producers and consumers
- [../domains/completeness.md](../domains/completeness.md) — to catch all mirrored readers, writers, and cleanup work
- [../domains/observability.md](../domains/observability.md) — to watch the rollout and any drift
- [../domains/dependencies.md](../domains/dependencies.md) — to identify all consumers of the changed contract

## Questions

- What promise between parts of the system is changing? (e.g., payload shape, state meaning, ordering rule, event schema)
- Who consumes this promise today, and who could break tomorrow? (e.g., UI, jobs, tests, integrations, cached data)
- What must stay compatible, and for how long? (e.g., previous clients, stored data, phased rollout, external consumers)
- What migration, fallback, or cleanup path keeps this change safe? (e.g., dual-read, backfill, versioning, rollback script)
