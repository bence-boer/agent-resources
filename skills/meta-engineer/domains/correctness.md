# Domain — Correctness

## Use when

The task changes behavior, invariants, permissions, calculations, or any path where confidence must be earned.

## Route next

- [testing.md](testing.md) — to design verification that catches real failures
- [completeness.md](completeness.md) — to prove all relevant paths were exercised
- [../finish/self-review.md](../finish/self-review.md) — to challenge whatever still feels lucky or assumed

## Questions

- What are the few claims this change makes, and how will you verify each one? (e.g., returns right data, blocks bad input, preserves state)
- What test or check would catch the most embarrassing regression? (e.g., permission leak, data loss, stale UI, broken flow)
- What manual verification is still required after automation passes? (e.g., real user flow, browser behavior, rollout smoke test)
- What evidence would falsify your current confidence? (e.g., missing edge test, unexpected log, production mismatch)
- Have you tested actual behavior, not just that it compiles and lints? (e.g., exercising the flow, running integration tests, checking rendered output)
