# User Interface — Building or Modifying UI

The UI is the product. Everything else is infrastructure.

→ Also read: [user-experience](../qualities/user-experience.md), [maintainability](../qualities/maintainability.md)

1. Am I using the framework's current idioms, not legacy or deprecated patterns? (e.g., current reactivity system, current component API, current state primitives)
2. Is this component small enough to understand at a glance, and focused on a single responsibility? (e.g., extraction candidates, line count limits, clear prop interfaces)
3. Does this component handle all visual states: loading, empty, error, partial, and success? (e.g., skeleton screens, empty state messages, error boundaries)
4. Is the styling consistent with the existing design system and responsive across screen sizes? (e.g., design tokens, mobile-first, overflow handling, min-width on flex children)
5. Does the component clean up after itself? (e.g., intervals cleared, subscriptions removed, event listeners detached, observers disconnected)
6. Is the data flow through this component explicit and traceable? (e.g., props down, events up, no hidden global state, clear derivation chains)
7. What is the user's interaction flow, and does every step give appropriate feedback? (e.g., hover states, loading indicators, success/error confirmations, disabled states)
