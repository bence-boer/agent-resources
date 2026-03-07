# Domain - State and invariants

## Use when

Use when the task changes data meaning, state transitions, caches, synchronization, or restart behavior.

## Route next

- [domain-correctness-and-verification.md](domain-correctness-and-verification.md) - to prove the rules still hold in real execution
- [domain-observability-and-operations.md](domain-observability-and-operations.md) - to expose the right signals when state drifts
- [domain-completeness.md](domain-completeness.md) - to catch all readers, writers, and reconciliation paths

## Questions

- What state becomes newly possible, and which combinations must stay impossible? Examples: pending without owner, paid and failed, selected but deleted
- What invariant must hold before and after this change? Examples: totals match lines, ids stay unique, status transitions valid
- Where is truth stored, derived, cached, or duplicated? Examples: database, memory, URL, rendered view
- What happens if updates arrive twice, out of order, or after a restart? Examples: idempotent write, reconciliation, dedupe
