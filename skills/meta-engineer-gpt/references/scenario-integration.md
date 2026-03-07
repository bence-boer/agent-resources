# Scenario - Integration

## Use when

Use when the task depends on an external system, another team, or a new boundary between parts of the product.

## Route next

- [domain-workflow-fit.md](domain-workflow-fit.md) - to keep the integration coherent inside the wider flow
- [domain-error-handling.md](domain-error-handling.md) - to plan for slowness, invalid responses, and partial failure
- [domain-dependencies-and-surface-area.md](domain-dependencies-and-surface-area.md) - to contain the new coupling
- [domain-risk-and-safety.md](domain-risk-and-safety.md) - if the integration can amplify harm when it drifts or fails

## Questions

- What outside system, team, or module must this work with, and what do they need from you? Examples: stable contract, retries, idempotency
- What is the handshake between the systems, and where can it drift? Examples: schema, auth, timing, encoding
- What happens when the other side is slow, wrong, or partially unavailable? Examples: degrade, queue, retry, fail closed
- What coupling are you introducing, and how will you keep it reversible? Examples: adapter, versioning, feature flag
