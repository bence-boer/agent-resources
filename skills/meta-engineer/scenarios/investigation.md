# Scenario — Investigation

## Use when

The next right move is to explain what exists, why it behaves that way, and where the real cause probably lives.

## Route next

- [../domains/architecture.md](../domains/architecture.md) — to reason about boundaries and ownership
- [../domains/state-and-data.md](../domains/state-and-data.md) — to inspect truth, transitions, and impossible states
- [../domains/observability.md](../domains/observability.md) — to identify what evidence the system exposes or hides
- [../domains/correctness.md](../domains/correctness.md) — to verify claims against actual behavior

## Questions

- What do you need to explain before you earn the right to change anything? (e.g., current flow, invariant, ownership boundary, data lifecycle)
- What evidence distinguishes symptom from cause? (e.g., logs, reproduction, history, diff, data inspection)
- Where could the real problem live besides the obvious file? (e.g., caller, data contract, retry logic, upstream state)
- What would you inspect next if your first theory is wrong? (e.g., adjacent workflow, previous release, fallback path, race condition)
