# Principle — Visual Hierarchy

Governs how elements are arranged, grouped, and emphasized to guide attention. Integrates Gestalt laws (proximity, similarity, common region, uniform connectedness, Prägnanz), serial position effect, and Von Restorff isolation effect.

## Use when

Any design involves layout, grouping, emphasis, or visual organization of elements.

## Route next

- [cognitive-load.md](cognitive-load.md) — if visual density is creating overload
- [interaction.md](interaction.md) — to align visual weight with interactive importance
- [accessibility.md](accessibility.md) — to verify hierarchy is perceivable by all users

## Rules

- Elements that are related functionally must be proximate spatially. Space between groups must exceed space within groups.
- Visually similar elements (color, shape, size, typography) are perceived as functionally related. Use similarity intentionally: same styling = same role.
- Enclose related elements in shared containers (cards, borders, background fills) to create common regions. Avoid orphaned elements floating between groups.
- Use connecting lines, shared color bands, or visual flows to link elements that are spatially separated but logically connected.
- Favor the simplest visual form. When users encounter complex or ambiguous layouts, they default to the simplest interpretation — make that interpretation correct.
- Place critical actions and information at the start or end of sequences, menus, and lists. Middle positions receive least attention and recall.
- Make exactly one element per context visually distinct (size, color, elevation, whitespace) to draw attention. Multiple competing "standout" elements cancel each other.
- Use no more than 3 levels of typographic hierarchy per view (heading, subheading, body). Each additional level dilutes the hierarchy's signaling power.
- Reserve high-contrast treatments (bold color, large size, elevated shadow) for primary actions. Secondary actions must be visually subordinate.

## Questions

- If a new user sees this screen for 5 seconds, can they identify the primary action and the most important information? (e.g., scan test: cover everything except the hero area — is intent clear?)
- Are grouped elements perceivable as groups through proximity, containers, or visual similarity alone — without relying on labels? (e.g., would the grouping survive if all text were replaced with gray rectangles?)
- Where do two or more elements compete for the same visual priority, and which should yield? (e.g., two equally prominent buttons, multiple highlighted sections, competing status indicators)
- Does the visual hierarchy survive viewport changes, content length variations, and edge cases? (e.g., single item vs many, short text vs long, empty sections vs populated)
