# Domain - Correctness and verification

## Use when

Use when the task changes behavior, invariants, permissions, calculations, or any path where confidence must be earned.

## Route next

- [foundation-quality-gates.md](foundation-quality-gates.md) - to enforce the universal finish line
- [finish-self-review.md](finish-self-review.md) - to challenge whatever still feels lucky or assumed

## Questions

- What are the few claims this change makes, and how will you verify each one? Examples: returns right data, blocks bad input, preserves state
- What test or check would catch the most embarrassing regression? Examples: permission leak, data loss, stale UI
- What manual verification is still required after automation passes? Examples: real user flow, browser behavior, rollout smoke test
- What evidence would falsify your current confidence? Examples: missing edge test, weird log, production mismatch
