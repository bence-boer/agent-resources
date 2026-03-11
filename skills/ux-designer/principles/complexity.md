# Principle — Complexity

Governs how essential and accidental complexity are identified and managed. Integrates Tesler's Law (every system has irreducible complexity that must be borne by either user or system) and Occam's Razor (the simplest adequate solution is preferred).

## Use when

Any design involves trade-offs between simplicity and capability, configuration depth, or feature density.

## Route next

- [cognitive-load.md](cognitive-load.md) — to measure the cognitive cost of current complexity
- [decision-architecture.md](decision-architecture.md) — to restructure complex option sets
- [user-psychology.md](user-psychology.md) — if complexity creates a learning barrier

## Rules

- Every system has irreducible complexity. The design question is whether the user bears it or the system absorbs it. Default to system-absorbed.
- For each element in the design, ask: "If I remove this, does the user lose the ability to complete their goal?" If no, remove it.
- When simplifying makes the common case effortless but the advanced case impossible, add a secondary path (advanced mode, settings, CLI) rather than burdening everyone.
- Simplification that reduces perceived simplicity is not simplification. Hiding a common action behind a menu "simplifies" the surface but complicates the task.
- A single multi-purpose element is worse than two purpose-clear elements when the user must determine which mode they are in.
- When users master simplified features, they attempt more complex tasks. Anticipate the escalation path, not just the initial use case.
- Complexity cost compounds. Each new element interacts with every existing element. The 20th feature is exponentially more costly than the 2nd.

## Questions

- What complexity in this interface is essential (inherent to the problem) versus accidental (introduced by design or implementation choices)? (e.g., a date range picker is essential for reports; a custom query builder is accidental if filters suffice)
- If this design were rebuilt with half the elements, what would remain and what would disappear? (e.g., prioritize: what is load-bearing vs decorative, core action vs edge case support)
- Where has "adding a feature" been chosen over "simplifying a flow"? (e.g., adding a toggle instead of fixing the default, adding a setting instead of auto-detecting, adding a tooltip instead of improving the label)
- What is the next capability the user will request after mastering the current design, and does the current structure accommodate it without a redesign? (e.g., bulk operations after single-item, automation after manual, customization after defaults)
