# Scenario - Refactor

## Use when

The main goal is simplification, boundary cleanup, or reuse rather than new user-facing behavior.

## Route next

- [../domains/maintainability.md](../domains/maintainability.md) to reduce future change cost
- [../domains/architecture.md](../domains/architecture.md) to put the boundary in the right place
- [../domains/developer-experience.md](../domains/developer-experience.md) to make the correct maintenance path obvious
- [../domains/completeness.md](../domains/completeness.md) to catch all instances that need the same treatment
- [../domains/temporary-solutions.md](../domains/temporary-solutions.md) to avoid cosmetic churn that leaves the core mess intact

## Default posture

- Measure the pain removed, not the amount of code moved.
- Preserve behavior intentionally; if behavior changes, treat it as a feature or fix as well.
- Prefer deleting branches and collapsing concepts over merely redistributing them.
- Extract abstractions only where a stable rule or boundary exists.

## Resolve explicitly

- What pain disappears after this refactor?
- What invariant or behavior must remain identical?
- What becomes locally easier to reason about?
- What code can now be deleted?

## Minimum proof

- Behavior-preserving tests or equivalent comparison for the changed surface
- Reduced branching, duplication, or coupling in the edited area
- No leftover compatibility hacks without an explicit reason
