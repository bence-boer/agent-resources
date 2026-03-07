# Domain — Observability

## Use when

The task affects production diagnosis, metrics, logging, traces, rollout confidence, or operational experience.

## Route next

- [performance.md](performance.md) — to measure the real resource story before and after
- [security.md](security.md) — if missing signals could turn a bug into an incident
- [../finish/handoff.md](../finish/handoff.md) — to leave operators and reviewers the signals they should watch

## Questions

- If this breaks in production, what signal appears first? (e.g., log, metric, trace, support complaint, alert, health check)
- What should be measurable after this change? (e.g., success rate, queue depth, latency, adoption, error rate)
- What operational task becomes easier or harder because of this design? (e.g., triage, rollback, cleanup, on-call diagnosis, capacity planning)
- Where do you need more breadcrumbs, not more noise? (e.g., state transition logs, correlation IDs, explicit error context, request traces)
- Could you reconstruct the sequence of events leading to a failure from the logs alone? (e.g., request flow, state changes, external call results, decision points)
