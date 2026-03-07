# Foundation — Ownership

## Use when

Every task that affects real users, operators, or future maintainers.

## Route next

- [../domains/user-value.md](../domains/user-value.md) — if the task changes user-visible behavior or perceived quality
- [../domains/maintainability.md](../domains/maintainability.md) — if the task affects code shape, structure, or future edits
- [../finish/self-review.md](../finish/self-review.md) — when you need to test your own conviction before stopping

## Questions

- If this ships and breaks, what outcome would you be least willing to defend? (e.g., silent data loss, confusing state, broken trust, locked-out users)
- What would make you proud to own this change six months from now? (e.g., easy extension, obvious intent, calm operations, clean structure)
- Where are you tempted to stop early, and what unfinished edge would that leave behind? (e.g., only happy path, one instance fixed, no rollback story, missing validation)
- Who inherits this after you, and what do they need from you now? (e.g., clean structure, explicit constraints, trustworthy verification, documented decisions)
