# Scenario — Integration

## Use when

The task depends on an external system, another team, or a new boundary between parts of the product.

## Route next

- [../domains/dependencies.md](../domains/dependencies.md) — to contain the new coupling
- [../domains/error-handling.md](../domains/error-handling.md) — to plan for slowness, invalid responses, and partial failure
- [../domains/reliability.md](../domains/reliability.md) — to harden the path across the boundary
- [../domains/architecture.md](../domains/architecture.md) — to place the integration in the right boundary
- [../domains/security.md](../domains/security.md) — if the integration can amplify harm when it drifts or fails

## Questions

- What outside system, team, or module must this work with, and what do they need from you? (e.g., stable contract, retries, idempotency)
- What is the handshake between the systems, and where can it drift? (e.g., schema, auth, timing, encoding, versioning)
- What happens when the other side is slow, wrong, or partially unavailable? (e.g., degrade, queue, retry, fail closed)
- What coupling are you introducing, and how will you keep it reversible? (e.g., adapter, versioning, feature flag, abstraction layer)
