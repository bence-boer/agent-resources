# Scenario - New feature

## Use when

The task adds a capability rather than only correcting or reorganizing existing behavior.

## Route next

- [../domains/user-value.md](../domains/user-value.md) to define why the feature deserves to exist
- [../domains/workflow-fit.md](../domains/workflow-fit.md) to make the feature feel native to existing flows
- [../domains/invariants.md](../domains/invariants.md) to define the new rules and states explicitly
- [../domains/error-handling.md](../domains/error-handling.md) to design failure and recovery with the happy path
- [../domains/maintainability.md](../domains/maintainability.md) and [../domains/extensibility.md](../domains/extensibility.md) to keep the new surface honest

## Default posture

- Define the user or system gain and required data and state model before writing the implementation.
- Keep the feature native to existing flow, language, and contracts.
- Design non-happy paths at the same time as the happy path.
- Add abstractions only when they remove future misuse or duplicated policy.

## Resolve explicitly

- What new state, invariant, or contract does this feature introduce?
- What makes the first release complete rather than merely present?
- What support, operational, or maintenance burden does it create?
- What legitimate extension is close enough to shape the design now?

## Minimum proof

- Explicit state and rule model for the new capability
- At least one end-to-end or equivalent flow proving the feature works
- Failure states handled with visible recovery or next steps
- Contract, copy, or docs updated when behavior changes
