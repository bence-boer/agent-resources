# Foundation - Scope

## Use when

The ask is ambiguous, broad, or likely to sprawl.

## Route next

- [constraints.md](constraints.md) if hard limits also shape the solution
- [../scenarios/new-feature.md](../scenarios/new-feature.md) if the work introduces new behavior
- [../scenarios/bug-fix.md](../scenarios/bug-fix.md) if the work closes a known defect

## Apply

- Define in-scope surfaces, adjacent surfaces, and explicit non-goals.
- Identify all coupled surfaces that must be rechecked: API and UI, create and edit, client and server, success and failure, loading and empty, migration and rollback.
- Choose the smallest complete outcome worth shipping.
- Prefer one coherent change over a pile of unrelated opportunistic edits.
- If staging is necessary, define the honest stage boundary up front.

## Resolve explicitly

- What is the minimum complete result?
- What must not change?
- What tightly coupled work cannot be deferred?
- What work is intentionally not included?
