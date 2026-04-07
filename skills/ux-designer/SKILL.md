---
name: ux-designer
description: >
  UX design thinking framework applying cognitive load theory (Sweller), Fitts's Law, Hick's Law,
  Gestalt perception, Peak-End Rule (Kahneman), and Tesler's Law to interface design, user flows,
  component design, and system feedback patterns. Use when designing new screens, redesigning
  interfaces, creating UI components, optimizing flows, planning navigation and information
  architecture, designing error/loading/empty states, reviewing UX, or evaluating accessibility.
  Triggers on UX, UI design, interaction design, usability, or design review tasks. Also triggers
  when users say 'make this better', 'this feels off', 'help with the layout', or ask about forms,
  dashboards, or modals. Do NOT use for CSS/HTML implementation, component library API selection,
  visual/graphic design production (logos, illustration), brand identity, or front-end code authoring.
---

# UX Designer

Observe first, then decide with evidence. Load only the files matching the current task. Answer every question in each loaded file before making design decisions.

## Expert Vocabulary Payload

**Cognitive Architecture:**
Miller's Law (7±2 chunking), cognitive load theory (Sweller) — intrinsic vs extraneous load, working memory constraints, selective attention, change blindness, recognition over recall

**Interaction Physics:**
Fitts's Law (target acquisition: MT = a + b·log₂(2D/W)), Doherty Threshold (<400ms response), Hick's Law (choice-reaction time: RT = a + b·log₂(n)), thumb zone (Hoober), minimum touch target (44×44px WCAG AAA, 48×48dp Material), accidental activation spacing (≥8dp)

**Perceptual Organization:**
Gestalt laws — proximity, similarity, common region, continuity, closure, Prägnanz (simplest interpretation), serial position effect, Von Restorff isolation effect (distinctiveness), F-pattern / Z-pattern scanning

**Behavioral Psychology:**
Jakob's Law (mental model transfer), Peak-End Rule (Kahneman), Goal-Gradient Effect (acceleration near completion), Zeigarnik Effect (incomplete task persistence), Paradox of the Active User (Carroll & Rosson — users skip instructions), anchoring bias, satisficing (Simon), choice overload (Schwartz)

**System Design:**
Tesler's Law (conservation of complexity — irreducible complexity absorbed by system or user), Postel's Law (accept liberally, send conservatively), progressive disclosure, information architecture (Morville & Rosenfeld), card sorting / tree testing (IA validation), skeleton screens (perceived performance), optimistic UI

## Anti-Pattern Watchlist

Scan every design decision against these before committing.

### 1. Mystery Meat Navigation
**Detection:** Icons without visible text labels. Hover-only tooltips as the sole label mechanism. Users hesitate or mis-click navigation items.
**Resolution:** Pair every navigation icon with a text label. Icon-only is acceptable only for universal standards (close ✕, search 🔍) validated with real users.

### 2. Kitchen Sink Dashboard
**Detection:** A single view presents >12 distinct information groups, multiple competing CTAs, or requires scrolling past 3+ viewport heights.
**Resolution:** Apply 5±2 chunking. Identify the 3–5 metrics driving the user's next action. Defer remaining content behind tabs, expandable sections, or secondary views. One primary action per viewport.

### 3. Confirmation Fatigue
**Detection:** Confirmation dialogs on routine, reversible actions (archive, move, toggle). Users develop "click-through" muscle memory and confirm destructive actions without reading.
**Resolution:** Reserve confirmation dialogs for irreversible or high-cost actions only. For reversible actions, use undo toasts: execute immediately, offer a 5–8 second undo window.

### 4. Error Message Void
**Detection:** Error states show "Something went wrong," a status code, or blank space with no explanation and no recovery path.
**Resolution:** Every error answers three questions: What happened? Why? What can the user do? Format: "[What went wrong]. [Why, if useful]. [Recovery action]."

### 5. Zombie State
**Detection:** Empty, loading, error, timeout, or permission-denied states are undesigned — blank areas, browser defaults, or raw error text.
**Resolution:** Design all five async states (idle, loading, success, error, empty) for every data-driven view. Empty states guide toward first action. Loading states use skeleton screens for >1s delays. No state is "just temporary."

### 6. Frankenpattern
**Detection:** The same action uses different interaction patterns across the app (inline edit here, modal edit there, page-level edit elsewhere).
**Resolution:** Audit all instances of each action type. Choose one pattern per action class. Apply consistently. Converge highest-traffic flows first when inheriting inconsistent codebases.

### 7. Choice Paralysis Layout
**Detection:** Settings, filters, or configuration screens present >7 equal-weight options in a flat list with no grouping, no defaults, and no recommendations.
**Resolution:** Apply Hick's Law: group into 3–5 categories. Pre-select sensible defaults. Mark recommended options. Use progressive disclosure to hide advanced settings.

## Absolute Rules

1. **ALWAYS** provide system feedback within 400ms of user action (Doherty Threshold).
2. **ALWAYS** provide exactly one primary action per view or modal.
3. **ALWAYS** group related items using proximity, borders, or shared backgrounds (Gestalt common region).
4. **ALWAYS** chunk ungrouped items into groups of 5±2 or fewer.
5. **ALWAYS** design all five async states: idle, loading, success, error, empty.
6. **ALWAYS** preserve user input across error recovery and navigation.
7. **ALWAYS** make touch/click targets at least 44×44px with ≥8px spacing between adjacent targets.
8. **ALWAYS** place the most important items at the start or end of sequences (serial position effect).
9. **ALWAYS** make the default option the safest and most common action.
10. **NEVER** rely solely on color to communicate state or meaning — pair with icon, shape, or text.
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
| A new screen, view, or page | [new-screen.md](references/scenarios/new-screen.md) | visual-hierarchy, cognitive-load, decision-architecture, user-psychology, accessibility |
| Redesigning an existing interface | [redesign.md](references/scenarios/redesign.md) | user-psychology, visual-hierarchy, cognitive-load, complexity |
| An individual UI component | [component.md](references/scenarios/component.md) | interaction, visual-hierarchy, accessibility |
| A multi-step user flow or journey | [flow.md](references/scenarios/flow.md) | progress-motivation, decision-architecture, feedback-perception, cognitive-load |
| Navigation or information architecture | [navigation.md](references/scenarios/navigation.md) | cognitive-load, user-psychology, visual-hierarchy |
| Error, loading, empty, or success states | [feedback-states.md](references/scenarios/feedback-states.md) | feedback-perception, interaction, complexity |
| Design output format example | [output.md](references/finish/output.md) | Use this format to communicate UI designs |

All principle files live under `references/principles/`. Scenario files include "Route next" links.

## Context Questions

Answer these before making any design decisions:

- Who is the user, what is their skill level, and what are they trying to accomplish? (e.g., first-time visitor completing onboarding, power user managing bulk operations, admin configuring system settings)
- What existing mental models does the user bring from other products they use daily? (e.g., spreadsheet-like data management, social media feed patterns, email inbox triage workflows)
- What is the primary success metric for this interface? (e.g., task completion rate, time to first action, error recovery rate, return usage frequency)
- What device, viewport, and input method constraints apply? (e.g., touch-only mobile, keyboard-heavy desktop, mixed tablet, assistive technology)
- What technical constraints limit the design? (e.g., API response times, offline capability, real-time data requirements, existing component library)
- What environment context affects design density and tone? (e.g., B2B enterprise favoring efficiency and data density, B2C consumer favoring time-to-value and delight, internal tool prioritizing speed over polish)

## Examples

### BAD — Generic design rationale

> "I'll put the form fields in a clean layout with good spacing. The buttons will be at the bottom. I'll add validation messages. It should look modern and professional."

No evidence cited. No principles applied. "Clean," "good," "modern" are aesthetic preferences that route to the statistical average of all forms, not design decisions.

### GOOD — Evidence-based design rationale

> "The checkout form groups fields into 3 chunks (shipping, payment, review) per Miller's Law — each chunk has ≤5 fields. The primary CTA ('Place Order') is a full-width 48px-tall button at the bottom of the viewport — largest target, easiest reach per Fitts's Law. Destructive action ('Cancel Order') is separated by 24px and uses ghost styling to reduce accidental activation. The payment step uses real-time inline validation (Postel's Law: accept '4111-1111-1111-1111' and '4111111111111111') and shows a confirmation summary before charging (Peak-End Rule: highest-anxiety moment gets maximum clarity). Empty cart state shows last-viewed items with 'Add to Cart' CTAs rather than a blank page."

Every decision cites a principle. Specific measurements replace vague adjectives. States are designed, not assumed.

## Finish Review

Before finalizing any design decision, handoff, or implementation, answer these:

- Does this design comply with every absolute rule in this file? (Check each of the 15 rules against the current design.)
- What is the weakest state in the design (empty, error, loading, edge case), and is it fully designed or merely assumed to work? (Test: 0 items, 1 item, 100 items, error, timeout.)
- If a user encountered this design for the first time with no introduction, could they complete the primary task without confusion? (5-second test: can they identify what to do first?)
- What would a user with the least technical skill in the target audience struggle with? (Jargon labels, complex configuration, unclear navigation, non-obvious next step.)
- What did you design for the common case that breaks under the uncommon case? (Long names, RTL text, extreme data volumes, slow network, concurrent users, expired sessions.)
- Which design choice was driven by implementation convenience rather than user need, and is that trade-off acceptable?
- If another designer inherits this work, what decision would they reverse without understanding the reasoning? Document the rationale.

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
- "This feels off, can you help?"
- "What pattern should I use: modal, drawer, or page?"
- "Redesign this settings page"
- "Help me with this onboarding flow"
