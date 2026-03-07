# Domain - Observability and operations

## Use when

Use when the task affects production diagnosis, metrics, logging, traces, rollout confidence, or on-call experience.

## Route next

- [domain-performance-and-cost.md](domain-performance-and-cost.md) - to measure the real resource story before and after the change
- [domain-risk-and-safety.md](domain-risk-and-safety.md) - if missing signals could turn a bug into an incident
- [finish-handoff.md](finish-handoff.md) - to leave operators and reviewers the signals they should watch

## Questions

- If this breaks in production, what signal appears first? Examples: log, metric, trace, support complaint
- What should be measurable after this change? Examples: success rate, queue depth, latency, adoption
- What operational task becomes easier or harder because of this design? Examples: triage, rollback, cleanup, on-call diagnosis
- Where do you need more breadcrumbs, not more noise? Examples: state transition logs, correlation ids, explicit errors
