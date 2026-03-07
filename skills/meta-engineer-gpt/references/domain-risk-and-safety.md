# Domain - Risk and safety

## Use when

Use when the task can affect security, privacy, finances, trust, destructive actions, or broad system stability.

## Route next

- [domain-error-handling.md](domain-error-handling.md) - to shape safe failure and recovery paths
- [domain-observability-and-operations.md](domain-observability-and-operations.md) - to expose clear signals for incidents and near misses
- [finish-handoff.md](finish-handoff.md) - to leave explicit rollout and review expectations

## Questions

- What harm must this change make very unlikely? Examples: leaked data, lost money, broken trust, unsafe action
- What guardrail should exist before dangerous actions succeed? Examples: auth check, confirmation, validation, rate limit
- Where do humans need explicit visibility or approval? Examples: irreversible delete, privilege change, financial effect
- What would reduce blast radius if a bad assumption slips through? Examples: scoped rollout, quota, default deny, recovery script
