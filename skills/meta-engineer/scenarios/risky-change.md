# Scenario — Risky change

## Use when

The task touches security, privacy, money, deletion, permissions, compliance, or a widely shared primitive.

## Route next

- [../domains/security.md](../domains/security.md) — to define threats and prevention clearly
- [../domains/reliability.md](../domains/reliability.md) — to harden failure paths
- [../domains/observability.md](../domains/observability.md) — to detect problems before users do
- [../domains/correctness.md](../domains/correctness.md) — to raise the evidence bar
- [../domains/testing.md](../domains/testing.md) — to prove safety with concrete verification

## Questions

- What makes this change risky? (e.g., auth path, money flow, destructive action, shared primitive, trust boundary)
- What is the worst credible outcome, and how do you prevent it? (e.g., leaked data, corrupt state, locked users out, financial loss)
- What extra verification, observability, or review does this deserve? (e.g., audit log, pair review, staged rollout, manual sign-off)
- What is the safest way to limit blast radius if you are wrong? (e.g., flag, guardrail, rollback, kill switch, scoped deployment)
