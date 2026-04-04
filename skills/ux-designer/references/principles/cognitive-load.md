# Principle — Cognitive Load

Governs how much mental effort the interface demands. Integrates Miller's Law (7±2 working memory limit), chunking, selective attention, and working memory constraints.

## Use when

Any design involves information display, form inputs, option lists, or multi-element layouts.

## Route next

- [visual-hierarchy.md](visual-hierarchy.md) — to organize grouped information spatially
- [decision-architecture.md](decision-architecture.md) — if choices contribute to overload
- [complexity.md](complexity.md) — if inherent complexity cannot be reduced further

## Rules

- Beyond the 5±2 chunking rule (see Absolute Rules in [SKILL.md](../../SKILL.md)), label each group with a clear heading and limit group depth to two levels. Flat groups are easier to scan than nested ones.
- Distinguish intrinsic load (task-relevant effort) from extraneous load (interface-imposed effort). Reduce only extraneous load.
- Show only information the user needs for the current step. Defer secondary details behind progressive disclosure (expandable sections, detail views, tooltips).
- Keep navigation and recurring controls in stable positions. Spatial consistency reduces scan time.
- Beyond the recognition-over-recall rule (see Absolute Rules in [SKILL.md](../../SKILL.md)), prefer icons paired with labels, autocomplete, recent-items lists, and visible option sets over blank text fields, memorized codes, or undiscoverable shortcuts.
- Support selective attention: one focal point per viewport. Competing animations, banners, or alerts fragment attention.
- Mark visited/completed items distinctly so users do not re-process already-seen content.

## Questions

- What is the user's working memory load at the most complex point in this design? (Count distinct items they must hold simultaneously: field values, option states, contextual rules, visible status indicators)
- Where does the interface impose extraneous load that does not help the user accomplish their goal? (e.g., decorative elements competing for attention, redundant labels, unnecessary confirmation steps, jargon-heavy copy)
- What information can be chunked, summarized, or deferred without hiding something critical? (e.g., collapsing metadata, summarizing long lists with "and N more", progressive form sections)
- If the user looks away for 30 seconds and returns, can they re-orient without re-reading everything? (e.g., persistent state indicators, clear section headings, saved scroll position, active step highlight)
- Where does the design force recall instead of offering recognition? (e.g., requiring typed IDs, memorized navigation paths, remembering which tab had what content)
