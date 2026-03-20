# Domain - Invariants

## Use when

The task is defined by business rules, permissions, calculations, state transitions, or combinations that must stay impossible.

## Route next

- [state-and-data.md](state-and-data.md) to encode the rule into the model
- [correctness.md](correctness.md) to prove the rule actually holds
- [testing.md](testing.md) to cover allowed and forbidden cases

## Apply

- State the rule as something that must always be true.
- Represent invalid states as unrepresentable where practical: enums, unions, parsers, constructors, exhaustive handling.
- Keep validation at boundaries and constructors, not scattered across callers.
- Derive data from the source of truth instead of storing reactive and imperative copies of the same thing.
- Make transitions explicit and guarded.
- If a cluster of booleans is really a mode or state machine, replace it with a better representation.

## Resolve explicitly

- What must be true before and after this code runs?
- What inputs or combinations are impossible or forbidden?
- Where is the single source of truth?
- What transition or event is allowed to mutate this rule?
- What would force the compiler or tests to fail if this rule drifts?

## Minimum proof

- Rule represented in type, schema, or guard form
- Tests for allowed and forbidden cases
- No duplicate truth without an explicit synchronization proof
- Exhaustive handling where the model admits variants
