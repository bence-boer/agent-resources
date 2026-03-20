# Domain - Temporary solutions

## Use when

The easiest path is a workaround, staged approach, or local exception that could ossify into policy.

## Route next

- [maintainability.md](maintainability.md) to search for the smallest durable alternative
- [security.md](security.md) if the shortcut hides meaningful downside
- [../finish/self-review.md](../finish/self-review.md) to challenge any rationale that sounds like hope instead of a plan

## Apply

- Prefer the smallest durable fix.
- If staging is necessary, isolate it behind a clear boundary, flag, or adapter.
- Track deliberate debt explicitly and give it an honest removal condition.
- Never let a temporary branch become new source of truth.
- Reject shortcuts that only hide the same failure class.

## Resolve explicitly

- Is this debt intentional and bounded, or accidental?
- What exact event removes the temporary path?
- What damage occurs if it survives?
- What is the smallest durable alternative?

## Minimum proof

- Temporary path is isolated and explicit
- Removal condition is real rather than aspirational
- Stage-one behavior does not corrupt the long-term design
