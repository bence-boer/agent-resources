# Scenario — Flow

## Use when

Designing a multi-step user journey, wizard, onboarding, or sequential process.

## Route next

- [../principles/progress-motivation.md](../principles/progress-motivation.md) — to sustain engagement through steps
- [../principles/decision-architecture.md](../principles/decision-architecture.md) — to structure per-step choices
- [../principles/feedback-perception.md](../principles/feedback-perception.md) — to shape experience at peaks and endpoints
- [../principles/cognitive-load.md](../principles/cognitive-load.md) — to manage per-step information density

## Questions

- What is the minimum number of steps required, and can any be eliminated, combined, or deferred? (e.g., combine name+email into one step, defer optional fields to later, auto-detect what can be inferred)
- At each step, can the user understand where they are, what is needed, and how far remains? (e.g., progress indicators, step labels, estimated completion, back navigation)
- What happens when the user abandons mid-flow, loses connection, or returns later? (e.g., draft saving, session recovery, resume from last step, graceful timeout)
- Where in the flow is user frustration most likely, and what design intervention reduces it? (e.g., complex form field, ambiguous choice, long wait, unexpected requirement)
