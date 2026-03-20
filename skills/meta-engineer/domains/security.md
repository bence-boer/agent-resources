# Domain - Security

## Use when

The task handles authentication, authorization, user data, external inputs, secrets, or trust boundaries.

## Route next

- [error-handling.md](error-handling.md) to shape safe failure and recovery paths
- [observability.md](observability.md) to expose clear signals for incidents and near misses
- [../finish/handoff.md](../finish/handoff.md) to leave explicit review and rollout expectations

## Apply

- Treat every external input as untrusted until validated.
- Authorize before side effects and scope permissions narrowly.
- Keep secrets and sensitive data out of logs, broad APIs, and client surfaces.
- Prefer deny-by-default, explicit allowlists, and minimized data exposure.
- Add guardrails or auditability before dangerous actions.

## Resolve explicitly

- What is the abuse case?
- What dangerous action requires an extra guardrail?
- What data must never cross this boundary?
- What permission is truly necessary?

## Minimum proof

- Auth or validation paths verified
- Sensitive-data handling reviewed explicitly
- Unsafe defaults removed or isolated behind strong controls
