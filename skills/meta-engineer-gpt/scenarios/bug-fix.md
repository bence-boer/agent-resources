# Scenario - Bug fix

## Use when

The task corrects broken behavior, invalid state, wrong output, or a reliability issue.

## Route next

- [../domains/invariants.md](../domains/invariants.md) to restate the rule that was broken
- [../domains/correctness.md](../domains/correctness.md) to prove the fix holds
- [../domains/completeness.md](../domains/completeness.md) to search sibling paths and second-order effects
- [../domains/state-and-data.md](../domains/state-and-data.md) and [../domains/reliability.md](../domains/reliability.md) to prevent recurrence
- [../domains/observability.md](../domains/observability.md) if recurrence would be expensive to miss

## Default posture

- Reproduce the failure or restate the broken invariant before touching the fix.
- Fix the rule that allowed the bug, not only the observed input.
- Search for sibling paths with the same failure class.
- Add proof that would have caught this bug and nearby variants.

## Resolve explicitly

- Why was this bug possible?
- What exact invariant was broken?
- Where else can the same rule fail in a slightly different shape?
- What is the smallest design change that prevents recurrence?

## Minimum proof

- Regression test or equivalent automated proof
- Verification of mirrored or sibling paths
- Observable error surfacing if silent recurrence would be costly
