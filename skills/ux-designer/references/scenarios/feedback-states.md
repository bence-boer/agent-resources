# Scenario — Feedback & States

## Use when

Designing system responses: error handling, loading indicators, empty states, success confirmation, or notification systems.

## Route next

- [../principles/feedback-perception.md](../principles/feedback-perception.md) — to shape emotional response and timing
- [../principles/interaction.md](../principles/interaction.md) — to define feedback timing and behavior
- [../principles/complexity.md](../principles/complexity.md) — to manage state explosion

## Questions

- For each async operation, what does the user see during: initiation, processing, success, partial success, failure, and timeout? (e.g., optimistic update vs spinner, inline vs toast notification, retry vs error page)
- Does the error message tell the user what happened, why, and what they can do about it? (e.g., "Connection lost. Your changes are saved locally and will sync when reconnected." vs "Error 500")
- What is the empty state experience, and does it guide toward the first action? (e.g., illustration with CTA, sample data, import option, contextual help)
- How are concurrent or cascading state changes handled without confusing the user? (e.g., stacking notifications, replacing vs queuing toasts, coalescing rapid updates, prioritizing destructive over informational)
