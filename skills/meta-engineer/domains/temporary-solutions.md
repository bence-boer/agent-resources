# Domain — Temporary solutions

## Use when

The easiest path is a workaround, a staged approach, or a local exception that could ossify into policy.

## Route next

- [maintainability.md](maintainability.md) — to search for the smallest durable alternative
- [security.md](security.md) — if the shortcut hides meaningful downside
- [../finish/self-review.md](../finish/self-review.md) — to challenge any rationale that sounds like hope instead of a plan

## Questions

- Are you about to create a temporary solution with no believable payback plan? (e.g., TODO branch, manual step, hardcoded exception, commented-out code)
- If this workaround survives a year, how much damage does it do? (e.g., hidden risk, churn, blocked extension, confusion, technical debt)
- What is the smallest durable solution instead? (e.g., explicit config, shared helper, one real invariant, proper migration)
- If you must stage the work, what boundary keeps stage one honest? (e.g., flag, adapter, isolated path, documented scope, expiration date)
