# Principle — Decision Architecture

Governs how choices are presented and structured. Integrates Hick's Law (decision time increases logarithmically with choice count), choice overload (excess options paralyze), and Pareto Principle (80% of value from 20% of options).

## Use when

Any design involves menus, option lists, settings, configuration, filters, or any point where the user must choose.

## Route next

- [cognitive-load.md](cognitive-load.md) — if choices contribute to information overload
- [user-psychology.md](user-psychology.md) — to align choices with user expectations and biases
- [progress-motivation.md](progress-motivation.md) — if choices occur within a multi-step flow

## Rules

- When response time matters, minimize visible options. Every additional choice adds decision time logarithmically.
- For option sets exceeding 5 items, provide categorization, search/filter, or progressive disclosure. Never present a flat list of 20+ ungrouped items.
- When a sensible default exists, pre-select it. Label it as recommended when appropriate. Never force selection when the common case is predictable.
- Enable direct comparison when users must evaluate alternatives side-by-side (e.g., pricing tiers, product variants, configuration options).
- Structure complex decisions as sequential smaller decisions. A 3-step wizard with 3 choices per step is faster than 1 screen with 27 options.
- Highlight the recommended option through visual emphasis: subtle background, "Most popular" badge, or size differentiation — not by disabling alternatives.
- Remove options that fewer than 5% of users need from the primary view. Place them in advanced or secondary menus.

## Questions

- At the point of highest choice density, how many options are simultaneously visible, and can this be reduced? (e.g., menu items, filter options, configuration fields, feature toggles)
- For each decision point, does a sensible default exist that serves the majority of users? (e.g., most common country, standard plan, default sort order, typical configuration)
- Can any multi-option choice be restructured as a series of binary or small choices? (e.g., "Pick from 15 templates" → "What type?" then "Which style?" then "Which color?")
- What is the cost of choosing wrong, and does the interface make it proportionally easy to reverse? (e.g., undo for low-cost, confirmation for medium-cost, explicit review for high-cost)
