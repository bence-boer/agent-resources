# Foundation - Quality gates

## Use when

Use before asking for review, merging, releasing, or declaring the work complete.

## Route next

- [finish-self-review.md](finish-self-review.md) - to inspect the remaining weak spots with fresh skepticism
- [finish-handoff.md](finish-handoff.md) - if someone else must review, deploy, or extend the change

## Questions

- What must be checked before you trust this change at all? Examples: types, tests, lint, build
- What must be exercised beyond the happy path? Examples: invalid input, timeout, concurrency, retry
- Where else does this pattern exist, and did you inspect those places? Examples: same component, shared helper, parallel workflow
- Can a new engineer change this safely after reading it once? Examples: clear naming, shallow nesting, explicit boundaries
