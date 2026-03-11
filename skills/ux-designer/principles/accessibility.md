# Principle — Accessibility

Governs inclusive design ensuring the interface is usable by people with diverse abilities, devices, and contexts. Accessibility is not a separate phase — it is a constraint on all other principles.

## Use when

Every design task. Always consult this file alongside other principles.

## Route next

- [visual-hierarchy.md](visual-hierarchy.md) — to verify hierarchy is perceivable without color
- [interaction.md](interaction.md) — to verify keyboard and assistive technology support
- [cognitive-load.md](cognitive-load.md) — to reduce cognitive barriers

## Rules

- Color contrast: minimum 4.5:1 for normal text, 3:1 for large text (≥18px or ≥14px bold), and 3:1 for interactive component boundaries and meaningful graphics.
- Never use color as the sole indicator. Pair with icon, shape, text label, pattern, or position change. (e.g., error: red + icon + text; success: green + checkmark + text)
- Every interactive element must be operable by keyboard alone. Tab order follows visual reading order. Focus indicator is always visible.
- Images that convey information: descriptive alt text. Decorative images: empty alt (`alt=""`). Complex visuals (charts, diagrams): extended description or data table.
- Form inputs must have associated labels (not just placeholders). Error messages must be programmatically linked to their fields (`aria-describedby`).
- Use semantic HTML elements (`nav`, `main`, `aside`, `button`, heading levels) before adding ARIA roles. ARIA supplements semantics; it does not replace them.
- Modals and popover content must trap focus while open and return focus to the trigger element when closed.
- Content must be readable and functional at 200% zoom. Layouts must not require horizontal scrolling at 320px viewport width.
- Auto-advancing content must be pausable. Session timeouts must warn and offer extension. Time limits must be adjustable.

## Questions

- Can a user who cannot see color distinguish all states, groups, and actions in this design? (Test by converting to grayscale — does meaning survive?)
- Can a keyboard-only user complete every task in a logical sequence, with visible focus at every step? (Tab through the page — is every interactive element reachable? Is focus order logical?)
- What does a screen reader announce for each interactive element, and is it sufficient to understand purpose and state? (e.g., "Button: Submit", "Link: View project details", "Checkbox: Enable notifications, checked")
- At 200% browser zoom or on a 320px-wide viewport, does any content overflow, overlap, or become inaccessible? (e.g., truncated labels, overlapping elements, horizontal scrollbar, hidden actions)
