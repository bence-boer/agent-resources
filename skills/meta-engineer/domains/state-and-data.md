# Domain — State and data

## Use when

The task changes data meaning, state transitions, schemas, caches, synchronization, or restart behavior.

## Route next

- [correctness.md](correctness.md) — to prove the rules still hold in real execution
- [observability.md](observability.md) — to expose the right signals when state drifts
- [completeness.md](completeness.md) — to catch all readers, writers, and reconciliation paths

## Questions

- What state becomes newly possible, and which combinations must stay impossible? (e.g., pending without owner, paid and failed, selected but deleted)
- What invariant must hold before and after this change? (e.g., totals match lines, IDs stay unique, status transitions valid)
- Where is truth stored, derived, cached, or duplicated? (e.g., database, memory, URL, rendered view, local storage)
- What happens if updates arrive twice, out of order, or after a restart? (e.g., idempotent write, reconciliation, dedupe, replay safety)
- Does the data model accurately represent the domain, not just the current UI? (e.g., correct entities, normalized relationships, enum as state machine)
- What migration path keeps existing data safe while the schema evolves? (e.g., backfill, dual-read, verification, rollback script, idempotent migration)
