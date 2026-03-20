# Foundation - Constraints

## Use when

Compatibility, safety, performance, scale, rollout, policy, or environment limits materially shape the work.

## Route next

- [../scenarios/risky-change.md](../scenarios/risky-change.md) if the downside of being wrong is meaningful
- [../scenarios/performance.md](../scenarios/performance.md) if throughput, latency, or cost are the actual pressure
- [../domains/security.md](../domains/security.md) if failure could cause real harm

## Apply

- List hard constraints first: compatibility, latency, uptime, security, rollout, tooling, policy, environment.
- Treat constraints as design inputs, not annoyances.
- Model operating conditions: malformed input, slow dependencies, duplicate delivery, retries, partial rollout, restart mid-operation.
- Prefer designs that stay correct under expected failure conditions, not only under ideal timing.
- Call out any constraint that forces a compromise in structure or validation.

## Resolve explicitly

- Which limits are absolute?
- Which failure conditions must the design survive?
- What coordination or migration cost exists?
- What constraint is protecting the system even if it feels inconvenient?
