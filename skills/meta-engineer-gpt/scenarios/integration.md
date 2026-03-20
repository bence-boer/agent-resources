# Scenario - Integration

## Use when

The task depends on an external system, another team, or a new boundary between parts of the product.

## Route next

- [../domains/dependencies.md](../domains/dependencies.md) to contain the new coupling
- [../domains/invariants.md](../domains/invariants.md) to restate the contract precisely
- [../domains/error-handling.md](../domains/error-handling.md) and [../domains/reliability.md](../domains/reliability.md) to survive bad boundary behavior
- [../domains/architecture.md](../domains/architecture.md) to place the integration in the right layer
- [../domains/security.md](../domains/security.md) if the integration can amplify harm when it drifts or fails

## Default posture

- Model the boundary: contract, auth, timing, retries, idempotency, and failure semantics.
- Localize the external choice behind a stable interface or adapter.
- Treat slow, wrong, partial, and unavailable responses as primary design cases.
- Avoid leaking protocol or vendor assumptions across the codebase.

## Resolve explicitly

- What does the other side promise?
- What happens if it violates that promise?
- What coupling is being introduced?
- What is the rollback or disconnection story?

## Minimum proof

- Contract validation at the boundary
- Representative failure-path verification
- Bounded blast radius if the integration misbehaves
