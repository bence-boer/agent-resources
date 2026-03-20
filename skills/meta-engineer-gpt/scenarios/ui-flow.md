# Scenario - UI flow

## Use when

The task changes screens, interactions, copy, visible states, or any part of the product that users directly experience.

## Route next

- [../domains/user-value.md](../domains/user-value.md) to articulate what the user should gain
- [../domains/workflow-fit.md](../domains/workflow-fit.md) to align the change with the surrounding journey
- [../domains/state-and-data.md](../domains/state-and-data.md) to model control state and derived behavior explicitly
- [../domains/visual-design.md](../domains/visual-design.md) to keep the implementation legible and accessible
- [../domains/error-handling.md](../domains/error-handling.md) and [../domains/performance.md](../domains/performance.md) to preserve trust and responsiveness

## Default posture

- Model the full state space of the flow, not only the ideal path.
- Derive control state from validated form or workflow state, not scattered booleans.
- Keep status, next action, and recovery obvious to the user.
- Design loading, disabled, empty, success, and error states as part of the feature.

## Resolve explicitly

- What should disable progression?
- What surrounding states exist around the interaction?
- What data or async dependencies gate action?
- What makes the flow feel complete instead of merely functional?

## Minimum proof

- Walkthrough of each major flow state
- Visible feedback for pending, error, and success paths
- No contradictory or stale UI state across refreshes or retries
