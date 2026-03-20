# Domain - Architecture

## Use when

The task touches boundaries between layers, services, modules, teams, or sources of truth.

## Route next

- [state-and-data.md](state-and-data.md) to ground the design in truth and transitions
- [dependencies.md](dependencies.md) to contain coupling and blast radius
- [maintainability.md](maintainability.md) to make the boundary legible in code shape

## Apply

- Put each responsibility at the boundary with the right data, lifecycle, and ownership.
- Keep side effects at edges when practical; keep core rules pure and testable.
- Dependencies should flow one way. Avoid circular or implicit shared-state coupling.
- Trace the data: where it originates, how it is validated, where it is transformed, and where it is consumed.
- Avoid cross-layer leakage of transport, storage, or vendor details.
- Prefer boundaries that can be replaced, tested, or extended without touching unrelated callers.
- Reject designs that create a second source of truth or timing-based coupling.

## Resolve explicitly

- Which layer owns this rule?
- What data crosses the boundary and in what validated form?
- What coupling is being introduced or removed?
- What transformation or dependency can be eliminated?
- If this pattern spread, would it improve or degrade the codebase?

## Minimum proof

- Clear owning module or layer
- Boundary validation or tests where the contract matters
- No ambiguous ownership for the same rule or state
