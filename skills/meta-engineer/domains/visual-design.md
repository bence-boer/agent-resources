# Domain - Visual design

## Use when

The task involves UI components, layout, styling, or anything the user sees.

## Route next

- [user-value.md](user-value.md) to anchor visual decisions in user outcomes
- [workflow-fit.md](workflow-fit.md) to ensure the design serves the flow, not only the screen
- [developer-experience.md](developer-experience.md) to keep visual primitives maintainable

## Apply

- Reuse the design system and native, accessible primitives first.
- Make hierarchy, status, and affordances obvious.
- Design all meaningful states: default, empty, loading, disabled, error, success.
- Avoid custom visual machinery unless existing primitives cannot serve.
- Keep accessibility and interaction quality part of the implementation, not post-processing.

## Resolve explicitly

- What is the primary action, secondary action, and warning state?
- What must be visible in empty, loading, error, and disabled states?
- What accessibility behavior must hold?
- What visual complexity is unnecessary?

## Minimum proof

- Major visual states reviewed
- Accessibility regressions considered as part of implementation
- Intent remains obvious without extra explanation
