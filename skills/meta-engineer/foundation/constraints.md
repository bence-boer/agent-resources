# Foundation — Constraints

## Use when

Environment, performance, compatibility, safety, or rollout constraints materially shape the work.

## Route next

- [../scenarios/risky-change.md](../scenarios/risky-change.md) — if the downside of being wrong is meaningful
- [../scenarios/performance.md](../scenarios/performance.md) — if resources or scale are the real pressure
- [../domains/security.md](../domains/security.md) — if harm prevention matters as much as feature delivery

## Questions

- What hard limits shape the solution? (e.g., uptime, latency, budget, backward compatibility, hardware, resource caps)
- What failure modes or operating conditions must the design survive? (e.g., restart mid-task, partial rollout, bad input, resource exhaustion)
- What coordination costs matter here? (e.g., migration window, review load, docs churn, cross-team dependency)
- Which constraint feels annoying but is actually protecting the system? (e.g., strict types, slow rollout, explicit validation, file size limits)
