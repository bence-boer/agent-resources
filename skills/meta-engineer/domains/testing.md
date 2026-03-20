# Domain - Testing

## Use when

The task needs proof of correctness, behavior verification, or regression prevention.

## Route next

- [correctness.md](correctness.md) to map claims to concrete evidence
- [completeness.md](completeness.md) to catch paths and edge cases that are easy to skip
- [reliability.md](reliability.md) to verify failure and recovery behavior

## Apply

- Test rules, contracts, and state transitions, not implementation trivia.
- Cover the state space of the changed area, not only the observed example.
- Test boundaries: zero, one, max, max plus one, null, empty, malformed, duplicate, concurrent, and reordered where relevant.
- Write the regression that would have caught this bug class and nearby siblings when practical.
- Use integration tests where the boundary matters more than helper internals.
- Let types and schemas reduce runtime surface, then test the remaining runtime risk.

## Resolve explicitly

- What bug class should now be hard to reintroduce?
- Which allowed and forbidden paths matter?
- What belongs at unit, integration, or end-to-end level?
- What negative case matters more than the happy path?
- If the implementation is refactored but the contract is preserved, should these tests still pass?

## Minimum proof

- Targeted automated tests for the changed rule set
- Clear failure meaning if the rule regresses
- Runtime boundaries covered where untrusted input still exists
- State-space coverage is broader than the single triggering case
