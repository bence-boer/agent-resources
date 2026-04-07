# Principle — Interaction

Governs how users physically interact with the interface. Integrates Fitts's Law (target acquisition scales with distance and inversely with size), Doherty Threshold (sub-400ms feedback sustains productivity), and Flow (balanced challenge and control maintain immersion).

## Use when

Any design involves clickable/tappable elements, input fields, drag operations, animations, or time-sensitive responses.

## Route next

- [feedback-perception.md](feedback-perception.md) — to shape emotional response to interactions
- [accessibility.md](accessibility.md) — to verify keyboard and assistive technology support
- [visual-hierarchy.md](visual-hierarchy.md) — to align interactive prominence with visual weight

## Rules

- Beyond the 44×44px minimum (see Absolute Rules in [SKILL.md](../../SKILL.md)), space adjacent targets by at least 8px. Frequently used targets should be larger, not smaller.
- Place high-frequency actions in easy-reach zones (thumb zones on mobile, center-left on desktop). Destructive actions require deliberate reach.
- System response is perceived at three thresholds: **0.1s** (instantaneous — no feedback needed), **1.0s** (flow maintained — no indicator needed, but do not exceed), **10.0s** (attention limit — progress indicator required). Beyond the 400ms Doherty Threshold (see Absolute Rules in [SKILL.md](../../SKILL.md)), operations exceeding 1 second need a progress indicator. Operations exceeding 10 seconds need elapsed time or estimated remaining time.
- Immediate actions (toggle, select, navigate) must produce instant visual change. Async actions (save, submit, fetch) must show pending state immediately, result when complete.
- Never trigger destructive, irreversible, or high-impact actions on a single unconfirmed click. Require either confirmation, undo window, or a two-step interaction.
- Animations must serve function: guide attention, show spatial relationships, indicate state change. Decorative animation without informational purpose is noise. Respect `prefers-reduced-motion`.
- Hover states must not be the sole mechanism for revealing content or actions on any interface that supports touch input.
- Keyboard focus must be visible, follow logical reading order, and never become trapped in an inescapable region (except intentional focus traps like modals).
- Scroll position must be preserved on back-navigation and after inline actions. Losing scroll context forces the user to re-find their place.

## Mobile and Touch Environments

Mobile design is governed by the physical constraints of the device and the context of the user.

- **Thumb zones:** Design for one-handed use by placing primary actions in the lower third of the screen. The upper corners are the hardest to reach — place low-frequency or navigation-only elements there.
- **Haptic feedback:** Use subtle vibrations to confirm actions or signal errors, providing a tactile layer that supplements visual cues. Especially valuable in noisy or visually-busy environments.
- **Context-appropriate keyboards:** Trigger the correct virtual keyboard based on field type — numeric for phone numbers, email for email addresses, URL for web addresses. Reduces input effort and prevents format errors.
- **Touch vs pointer:** Hover states must not be the sole mechanism for revealing content. Touch has no hover. Design for tap-first, hover-as-enhancement.

## Questions

- What is the most frequently used action, and is it the easiest to reach and the largest target? (e.g., primary CTA placement, submit button position, navigation item spacing)
- Where might the user expect instant response but experience a delay, and what intermediate state fills the gap? (e.g., form submission, data loading, filter application, search execution)
- What happens if the user double-clicks, rage-clicks, or interacts faster than the system responds? (e.g., duplicate submissions, state corruption, queued actions, debounce behavior)
- Does every interactive element have visible feedback for hover, focus, active, and disabled states? (e.g., missing focus rings, indistinguishable disabled state, hover with no visual change)
- On mobile, are primary actions within the thumb zone, and do any critical interactions rely on hover? (See Mobile and Touch Environments above.)
