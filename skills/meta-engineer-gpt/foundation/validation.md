# Foundation - Validation

## Use when

Every task where correctness must be proven, not assumed.

## Route next

- [../domains/invariants.md](../domains/invariants.md) if behavior is defined by rules or transitions
- [../domains/correctness.md](../domains/correctness.md) if claims must be mapped to evidence
- [../domains/testing.md](../domains/testing.md) if you need to choose the right proof surface

## Apply

- Break the change into claims. A claim without proof is still a guess.
- Prefer prevention over detection: types, schemas, parsers, exhaustive switches, restrictive constructors, and boundary validation.
- For each important claim, choose at least one proof surface: static, test, runtime guard, or operational signal.
- Verify mirrored paths and nearby variants, not only the path named in the task.
- When proof is expensive, target the smallest check that reliably prevents the bug class.

## Resolve explicitly

- What can be proven before runtime?
- What must be exercised in tests?
- What still requires runtime or rollout evidence?
- Which missing proof would make the current design too risky?
