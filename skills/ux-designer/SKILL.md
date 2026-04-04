---
name: ux-designer
description: >
  UX design thinking framework combining evidence-based design principles with structured
  self-questioning for interface design, user flows, component design, and system feedback patterns.
  Use when designing new screens or views, redesigning existing interfaces, creating UI components,
  optimizing user flows, planning navigation and information architecture, designing error/loading/empty
  states, reviewing UX decisions, or evaluating accessibility and interaction quality. Triggers on any
  UX, UI design, user experience, interface design, interaction design, usability, or design review task.
  Triggers when users say 'make this better', 'this feels off', 'help with the layout', or ask about
  forms, dashboards, or modals. Do NOT use for CSS/HTML implementation, component library API selection,
  visual/graphic design production (logos, illustration), brand identity work, or front-end code authoring.
---

# UX Designer

Observe first, then decide with evidence. Load only the files matching the current task. Answer every question in each loaded file before making design decisions.

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

1. **Always start** with the Context Questions below.
2. **Add if needed:** existing interface to evaluate → [audit.md](references/foundation/audit.md).
3. **Pick one scenario** from the matrix below.
4. **Add only the principle files** that match the design surface. Scenario files suggest which.
5. **Always finish** with the Finish Review section at the end of this file.

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

All principle files live under `references/principles/`. Scenario files include "Route next" links.

## Context Questions

Answer these before making any design decisions:

- Who is the user, what is their skill level, and what are they trying to accomplish? (e.g., first-time visitor completing onboarding, power user managing bulk operations, admin configuring system settings)
- What existing mental models does the user bring from other products they use daily? (e.g., spreadsheet-like data management, social media feed patterns, email inbox triage workflows)
- What is the primary success metric for this interface? (e.g., task completion rate, time to first action, error recovery rate, return usage frequency)
- What device, viewport, and input method constraints apply? (e.g., touch-only mobile, keyboard-heavy desktop, mixed tablet, assistive technology)
- What technical constraints limit the design? (e.g., API response times, offline capability, real-time data requirements, existing component library)

## Finish Review

Before finalizing any design decision, handoff, or implementation, answer these:

- Does this design comply with every absolute rule in this file? (Check each of the 15 rules against the current design: feedback timing, single primary action, grouping, chunking, async states, input preservation, target sizes, positioning, defaults, color independence, destructive placement, recognition over recall, flow interruption, recommended defaults, status visibility.)
- What is the weakest state in the design (empty, error, loading, edge case), and is it fully designed or merely assumed to work? (Test: what does this look like with 0 items, 1 item, 100 items, an error, a timeout?)
- If a user encountered this design for the first time with no introduction, could they complete the primary task without confusion? (The 5-second test: can they identify what to do first?)
- What would a user with the least technical skill in the target audience struggle with? (e.g., jargon labels, complex configuration, unclear navigation, non-obvious next step)
- What did you design for the common case that breaks under the uncommon case? (e.g., long names, RTL text, extreme data volumes, slow network, concurrent users, expired sessions)
- Which design choice was driven by implementation convenience rather than user need, and is that trade-off acceptable? (e.g., showing a spinner because the API is slow vs caching locally because the user should not wait)
- If another designer inherits this work, what decision would they reverse without understanding the reasoning? (e.g., non-obvious grouping choice, intentional asymmetry, counter-intuitive navigation structure — document the rationale.)

## Questions this skill answers

- "Design a new screen for this feature"
- "Review this interface"
- "How should I handle loading states?"
- "Improve this user flow"
- "What's wrong with this UI?"
- "Design an error state"
- "Help me with navigation structure"
- "Make this form more usable"
- "Audit this page's accessibility"
- "How should I lay out this dashboard?"
