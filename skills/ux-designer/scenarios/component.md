# Scenario — Component

## Use when

Designing an individual UI element: button, card, modal, form field, table, dropdown, toggle, or similar.

## Route next

- [../principles/interaction.md](../principles/interaction.md) — to define input behavior and timing
- [../principles/visual-hierarchy.md](../principles/visual-hierarchy.md) — to establish visual weight and role
- [../principles/accessibility.md](../principles/accessibility.md) — to ensure semantic markup and keyboard access

## Questions

- What states must this component express? (e.g., default, hover, active, focused, disabled, loading, error, selected, expanded, dragging)
- How does this component behave at different content lengths and viewport sizes? (e.g., text truncation, wrapping, responsive collapse, minimum/maximum dimensions)
- Where does this component appear in the tab order and what keyboard interactions does it support? (e.g., arrow key navigation, Enter/Space activation, Escape dismissal, focus trapping in modals)
- Does this component duplicate or conflict with an existing pattern, and if so, should it replace or extend it? (e.g., another button variant, overlapping modal usage, similar card layout)
