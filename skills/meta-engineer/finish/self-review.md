# Finish — Self-review

## Use when

After implementation and verification, before declaring the task complete.

## Route next

- [handoff.md](handoff.md) — if another person or agent must review, deploy, or extend the change

## Questions

- What must pass before you trust this change? (e.g., types, tests, lint, build, manual verification)
- What must be exercised beyond the happy path? (e.g., invalid input, timeout, concurrency, empty state, retry, error recovery)
- Where else does this pattern exist, and did you inspect those places? (e.g., same component, shared helper, parallel workflow, mirrored UI)
- If you were reviewing this cold, what would worry you first? (e.g., hidden assumption, missing test, awkward coupling, unclear intent)
- What part still feels hand-wavy or lucky instead of engineered? (e.g., timing, ordering, fallback, docs gap, edge case)
- What evidence makes you comfortable shipping this now? (e.g., reproducible test, clean diff, verified behavior, confirmed requirements)
- What single improvement would most strengthen this change before you stop? (e.g., clearer abstraction, regression check, better recovery, documentation)
