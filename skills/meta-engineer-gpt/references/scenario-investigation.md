# Scenario - Investigation

## Use when

Use when the next right move is to explain what exists, why it behaves that way, and where the real cause probably lives.

## Route next

- [domain-architecture-fit.md](domain-architecture-fit.md) - to reason about boundaries and ownership
- [domain-state-and-invariants.md](domain-state-and-invariants.md) - to inspect truth, transitions, and impossible states
- [domain-observability-and-operations.md](domain-observability-and-operations.md) - to identify what evidence the system exposes or hides

## Questions

- What do you need to explain before you earn the right to change anything? Examples: current flow, invariant, ownership boundary
- What evidence distinguishes symptom from cause? Examples: logs, reproduction, history, diff
- Where could the real problem live besides the obvious file? Examples: caller, data contract, retry logic
- What would you inspect next if your first theory is wrong? Examples: adjacent workflow, previous release, fallback path
