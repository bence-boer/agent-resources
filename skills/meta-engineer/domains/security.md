# Domain — Security

## Use when

The task handles authentication, authorization, user data, external inputs, secrets, or trust boundaries.

## Route next

- [error-handling.md](error-handling.md) — to shape safe failure and recovery paths
- [observability.md](observability.md) — to expose clear signals for incidents and near misses
- [../finish/handoff.md](../finish/handoff.md) — to leave explicit review and rollout expectations

## Questions

- How could a motivated, malicious user exploit this? (e.g., injection attacks, missing authorization, rate limit bypass, CSRF, privilege escalation)
- Am I exposing or logging sensitive data anywhere? (e.g., PII in query params, secrets in logs, verbose error messages, keys in client bundles)
- Are all inputs validated and all external data treated with suspicion? (e.g., strict schema validation, sanitized HTML, safe deserialization, allowlisted values)
- What guardrail must exist before dangerous actions succeed? (e.g., auth check, confirmation dialog, validation, rate limit, audit trail)
- Does this follow least privilege for data access and permissions? (e.g., data minimization, scoped tokens, explicit allowlists, need-to-know basis)
- What harm must this change make very unlikely? (e.g., leaked data, lost money, broken trust, irreversible damage, unauthorized access)
