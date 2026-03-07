# Integration — Cross-System and Cross-Module Boundaries

Boundaries are where bugs hide. Make every crossing explicit and defensive.

→ Also read: [security](../qualities/security.md), [reliability](../qualities/reliability.md)

1. Is the contract between the two sides explicit, typed, and validated at the boundary? (e.g., shared types, schema validation, protocol documentation)
2. What happens when the other side is unavailable, slow, or returns unexpected data? (e.g., timeouts, fallbacks, circuit breakers, validation of external data)
3. Am I leaking internal abstractions across the boundary? (e.g., database types in API responses, implementation details in error messages, internal IDs exposed)
4. Is the data crossing this boundary sanitized, validated, and transformed appropriately? (e.g., input sanitization, output serialization, format conversion)
5. How will this integration be tested in isolation from the other system? (e.g., mocks, stubs, contract tests, integration test environments)
6. If this integration changes or breaks, what is the blast radius? (e.g., feature degradation, full outage, data corruption, silent failures)
