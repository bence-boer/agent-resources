# Foundation - Constraints

## Use when

Use when environment, performance, compatibility, safety, or rollout constraints materially shape the work.

## Route next

- [scenario-risky-change.md](scenario-risky-change.md) - if the downside of being wrong is meaningful
- [scenario-performance-or-capacity.md](scenario-performance-or-capacity.md) - if resources or scale are the real pressure
- [domain-risk-and-safety.md](domain-risk-and-safety.md) - if harm prevention matters as much as feature delivery

## Questions

- What hard limits shape the solution? Examples: uptime, latency, budget, backward compatibility
- What failure modes or operating conditions must the design survive? Examples: restart mid-task, partial rollout, bad input
- What coordination costs matter here? Examples: migration window, review load, docs churn
- Which constraint feels annoying but is actually protecting the system? Examples: strict types, slow rollout, explicit validation
