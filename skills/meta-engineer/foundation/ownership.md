# Foundation - Ownership

## Use when

Every task that affects real users, operators, or future maintainers.

## Route next

- [../domains/user-value.md](../domains/user-value.md) if the task changes user-visible behavior or trust
- [../domains/maintainability.md](../domains/maintainability.md) if the task changes code shape, boundaries, or future change cost
- [../finish/self-review.md](../finish/self-review.md) when you need to decide whether the work is actually done

## Apply

- Own the behavior after merge, not just the diff.
- Prefer fixes that remove the bug class, misuse opportunity, or hidden coupling.
- Do not preserve broken structure just because it already exists.
- If another engineer extends this in six months, the correct path should be obvious.
- Delete or simplify tightly coupled mess while you are in the area if leaving it would preserve the same failure class.

## Resolve explicitly

- What failure would be least defensible after this ships?
- Where are you tempted to stop early?
- What future maintenance cost are you creating or eliminating?
- What evidence would make this safe to hand to someone else?
