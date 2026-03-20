# Domain - State and data

## Use when

The task changes data meaning, state transitions, schemas, caches, synchronization, or restart behavior.

## Route next

- [invariants.md](invariants.md) to encode the core rules explicitly
- [correctness.md](correctness.md) to prove the rules still hold in real execution
- [observability.md](observability.md) to expose the right signals when state drifts
- [completeness.md](completeness.md) to catch all readers, writers, and reconciliation paths

## Apply

- Model the full state space explicitly.
- Enumerate every dependency of a state or decision at the point of use.
- Prefer one authoritative source of truth. Derived state should be computed, not tracked in parallel unless there is a strong reason and synchronization proof.
- Construct state from validated inputs at well-defined boundaries. Prefer building it once over accumulating it across distant steps.
- Use enums, unions, or explicit variants instead of boolean bundles when state combinations matter.
- Plan persistence, refresh, retry, and reconciliation behavior up front.

## Resolve explicitly

- What are ALL valid states and impossible combinations?
- What disables progression or submission?
- Where does data enter, become trusted, get stored, and get read?
- What happens on duplicate, reordered, stale, or interrupted updates?
- What state is derived and should not be stored?

## Minimum proof

- Explicit state model or state table exists for the changed area
- All dependencies of key state are accounted for
- Boundaries validate and normalize incoming data
- Transition and edge-case coverage exists where state changes matter
