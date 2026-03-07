# Scenario - Refactor

## Use when

Use when the main goal is simplification, boundary cleanup, or reuse rather than new user-facing capability.

## Route next

- [domain-architecture-fit.md](domain-architecture-fit.md) - to choose better boundaries and ownership lines
- [domain-maintainability.md](domain-maintainability.md) - to optimize for readability and change cost
- [domain-extensibility.md](domain-extensibility.md) - to keep the next requirement from undoing the refactor
- [domain-temporary-solutions.md](domain-temporary-solutions.md) - to avoid cosmetic churn that leaves the core mess intact

## Questions

- What pain is the refactor supposed to remove, not just rearrange? Examples: branching sprawl, hidden coupling, duplicate logic
- What behavior must stay identical while the structure improves? Examples: API shape, timing, permissions
- What new structure makes future changes cheaper or safer? Examples: smaller units, clearer boundaries, shared invariant
- How will you know this is simplification rather than churn? Examples: fewer concepts, less duplication, easier test setup
