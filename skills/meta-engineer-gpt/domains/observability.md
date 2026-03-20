# Domain - Observability

## Use when

The task affects production diagnosis, metrics, logging, traces, rollout confidence, or operational experience.

## Route next

- [performance.md](performance.md) to measure the real resource story before and after
- [security.md](security.md) if missing signals could turn a bug into an incident
- [../finish/handoff.md](../finish/handoff.md) to leave operators and reviewers the signals they should watch

## Apply

- Add signals that explain failures and state transitions, not just noise.
- Ensure important failures are diagnosable from logs, metrics, traces, or explicit outputs.
- Log or expose identifiers, boundary decisions, and external call outcomes when they matter.
- Define what success and failure should look like after rollout.
- Avoid silent failure paths.

## Resolve explicitly

- What signal should appear first if this breaks?
- What breadcrumb is needed to reconstruct the path?
- What metric or log proves the change works in production?
- What would alert too late?

## Minimum proof

- Meaningful diagnostics exist for the changed path
- Silent failure paths were removed or surfaced
- Rollout or triage has at least one trustworthy signal
