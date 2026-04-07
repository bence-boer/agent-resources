# Scenario — New Screen

## Use when

Designing a new view, page, or screen from scratch.

## Route next

- [../principles/visual-hierarchy.md](../principles/visual-hierarchy.md) — to establish layout and emphasis
- [../principles/cognitive-load.md](../principles/cognitive-load.md) — to manage information density
- [../principles/decision-architecture.md](../principles/decision-architecture.md) — to structure user choices
- [../principles/user-psychology.md](../principles/user-psychology.md) — to align with expectations
- [../principles/accessibility.md](../principles/accessibility.md) — to ensure inclusive design

## Pattern Selection

Choose the container pattern before designing content. The wrong container forces workarounds.

| Pattern | Use when | Avoid when |
| --- | --- | --- |
| **Modal (overlay)** | Single, self-contained task requiring immediate attention without breaking main page context (confirm deletion, edit one record, quick create) | Task has >3 fields, user needs background context, or task may take >30 seconds |
| **Side drawer** | Task is more complex than a modal but benefits from background context (filter a table, view item details, edit with reference to list) | Task requires full concentration or has many sub-steps |
| **Full page** | Complex, multi-step workflow requiring complete focus where previous screen context is no longer relevant | Task is simple enough for a modal or drawer |
| **Wizard** | Highly complex, infrequent, or unfamiliar tasks where breaking into linear steps reduces cognitive load (onboarding, system configuration, multi-part forms) | User performs this task frequently and needs speed over guidance |

## Questions

- What is the single most important thing the user should do or understand on this screen? (e.g., submit a form, scan a dashboard metric, select an item, acknowledge status)
- What information must be immediately visible versus available on demand? (e.g., summary vs detail, status vs history, primary vs secondary actions)
- How does this screen connect to what comes before and after it in the user's workflow? (e.g., entry points, exit paths, return paths, breadcrumb context)
- What state combinations can this screen exist in, and does each have a designed response? (e.g., first use/empty, populated, loading, partial data, error, permission denied, offline)
- Which container pattern (modal, drawer, full page, wizard) best fits this task's complexity and context needs? (See Pattern Selection above.)
