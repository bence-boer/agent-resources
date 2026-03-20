# Domain - Workflow fit

## Use when

The task touches multi-step flows, handoffs, approvals, retries, or navigation between states.

## Route next

- [user-value.md](user-value.md) to keep the workflow anchored in user benefit
- [error-handling.md](error-handling.md) to cover failure and recovery inside the flow
- [completeness.md](completeness.md) to catch mirrored paths and adjacent states

## Apply

- Model the end-to-end flow including loading, unchanged, invalid, submitting, success, error, and interruption.
- Derive controls from validated workflow state instead of scattered booleans.
- Keep status and next action obvious at every step.
- Preserve work and recovery when interruption is plausible.
- Align new behavior with existing navigation, terminology, and feedback patterns unless there is a clear reason not to.

## Resolve explicitly

- What should disable, block, defer, or auto-advance?
- What happens immediately before and after this step?
- What surrounding states need first-class handling?
- Does this reduce friction or merely move it?

## Minimum proof

- Walkthrough of each major flow state
- No contradictory control behavior across states
- Recovery path exists for interruption or failure where it matters
