# Scenario — Refactor

## Use when

The main goal is simplification, boundary cleanup, or reuse rather than new user-facing capability.

## Route next

- [../domains/maintainability.md](../domains/maintainability.md) — to optimize for readability and change cost
- [../domains/architecture.md](../domains/architecture.md) — to choose better boundaries and ownership lines
- [../domains/developer-experience.md](../domains/developer-experience.md) — to make the correct maintenance path obvious
- [../domains/completeness.md](../domains/completeness.md) — to catch all instances that need the same treatment
- [../domains/temporary-solutions.md](../domains/temporary-solutions.md) — to avoid cosmetic churn that leaves the core mess intact

## Questions

- What pain is the refactor supposed to remove, not just rearrange? (e.g., branching sprawl, hidden coupling, duplicate logic, scattered state)
- What behavior must stay identical while the structure improves? (e.g., API shape, timing, permissions, test output)
- What new structure makes future changes cheaper or safer? (e.g., smaller units, clearer boundaries, shared invariant)
- How will you know this is simplification rather than churn? (e.g., fewer concepts, less duplication, easier test setup, smaller files)
