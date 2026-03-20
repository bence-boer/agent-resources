# Foundation — Audit

## Use when

An existing interface needs evaluation before making changes.

## Route next

- [../scenarios/redesign.md](../scenarios/redesign.md) — if the audit reveals systemic issues
- [../scenarios/feedback-states.md](../scenarios/feedback-states.md) — if state handling is the primary gap
- [../scenarios/navigation.md](../scenarios/navigation.md) — if findability or structure is the primary issue

## Questions

- What are users actually doing versus what the design intended? (e.g., skipping steps, using workarounds, ignoring primary CTAs, misinterpreting labels)
- Where do users hesitate, backtrack, or abandon? (e.g., form field confusion, unclear navigation, missing confirmation, unexpected state transitions)
- What information is present but invisible due to hierarchy or placement? (e.g., buried settings, unnoticed status indicators, overlooked help text)
- Which elements violate the absolute rules in SKILL.md? (Audit each: feedback timing, primary action clarity, grouping, chunking, async states, input preservation, target sizes, positioning, defaults, color independence, destructive action placement, recall vs recognition, flow interruptions, default options, status visibility)
- What is working well that must be preserved? (e.g., established user habits, reliable interaction patterns, learned navigation paths)
