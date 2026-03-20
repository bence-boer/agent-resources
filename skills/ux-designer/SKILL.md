---
name: ux-designer
description: >
  UX design thinking framework combining evidence-based design principles with structured
  self-questioning for interface design, user flows, component design, and system feedback patterns.
  Use when designing new screens or views, redesigning existing interfaces, creating UI components,
  optimizing user flows, planning navigation and information architecture, designing error/loading/empty
  states, reviewing UX decisions, or evaluating accessibility and interaction quality. Triggers on any
  UX, UI design, user experience, interface design, interaction design, usability, or design review task.
---

# UX Designer

A structured thinking framework for user experience design. Integrates evidence-based design principles as hard constraints with self-questioning to ensure thorough, user-centered decisions.

Do not read everything. Read only the files matching the current task. Answer every question in each loaded file before making design decisions.

## Absolute Rules

1. **ALWAYS** provide system feedback within 400ms of user action.
2. **ALWAYS** provide exactly one primary action per view or modal.
3. **ALWAYS** group related items using proximity, borders, or shared backgrounds.
4. **ALWAYS** chunk ungrouped items into groups of 5±2 or fewer.
5. **ALWAYS** design all four async states: empty, loading, error, success.
6. **ALWAYS** preserve user input across error recovery and navigation.
7. **ALWAYS** make touch/click targets at least 44×44px with adequate spacing.
8. **ALWAYS** place the most important items at the start or end of sequences.
9. **ALWAYS** make the default option the safest and most common action.
10. **NEVER** rely solely on color to communicate state or meaning.
11. **NEVER** place destructive actions adjacent to high-frequency actions.
12. **NEVER** require users to recall information across screens — recognition over recall.
13. **NEVER** interrupt active user flow for non-critical information.
14. **NEVER** present decisions without a recommended default when one exists.
15. **NEVER** hide system status during operations that exceed 1 second.

## Decision Tree

```
What type of UX work?
├── Designing something new
│   ├── Full screen or view → new-screen scenario
│   ├── Individual element → component scenario
│   └── Multi-step process → flow scenario
├── Improving something existing
│   ├── Major rethink → redesign scenario
│   ├── Navigation or structure → navigation scenario
│   └── States and responses → feedback-states scenario
└── Reviewing or auditing → start at foundation/audit.md
```

## Routing Order

1. **Always start** with [context.md](references/foundation/context.md).
2. **Add if needed:** existing interface to evaluate → [audit.md](references/foundation/audit.md).
3. **Pick one scenario** from the matrix below.
4. **Add only the principle files** that match the design surface. Scenario files suggest which.
5. **Always finish** with [review.md](references/finish/review.md).

## Scenario Routing Matrix

| If the task is mostly… | Start here | Usually add |
| --- | --- | --- |
| A new screen, view, or page | [new-screen.md](references/scenarios/new-screen.md) | visual-hierarchy, cognitive-load, decision-architecture, user-psychology |
| Redesigning an existing interface | [redesign.md](references/scenarios/redesign.md) | user-psychology, visual-hierarchy, cognitive-load, complexity |
| An individual UI component | [component.md](references/scenarios/component.md) | interaction, visual-hierarchy, accessibility |
| A multi-step user flow or journey | [flow.md](references/scenarios/flow.md) | progress-motivation, decision-architecture, feedback-perception, cognitive-load |
| Navigation or information architecture | [navigation.md](references/scenarios/navigation.md) | cognitive-load, user-psychology, visual-hierarchy |
| Error, loading, empty, or success states | [feedback-states.md](references/scenarios/feedback-states.md) | feedback-perception, interaction, complexity |
| Design output format example | [references/finish/output.md](references/finish/output.md) | Use this format to communicate UI designs |

All principle files live in [references/principles/](references/principles/). Scenario files include "Route next" links.

## Working Rule

Observe first, question deeply, decide with evidence. Every design choice should trace to either a principle or a user need — preferably both.
