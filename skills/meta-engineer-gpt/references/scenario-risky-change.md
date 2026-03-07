# Scenario - Risky change

## Use when

Use when the task touches security, privacy, money, deletion, permissions, compliance, or a widely shared primitive.

## Route next

- [domain-risk-and-safety.md](domain-risk-and-safety.md) - to define harm and prevention clearly
- [domain-observability-and-operations.md](domain-observability-and-operations.md) - to detect problems before users do
- [domain-correctness-and-verification.md](domain-correctness-and-verification.md) - to raise the evidence bar
- [finish-handoff.md](finish-handoff.md) - to leave clear review, rollout, and follow-up notes

## Questions

- What makes this change risky? Examples: auth path, money flow, destructive action, shared primitive
- What is the worst credible outcome, and how do you prevent it? Examples: leaked data, corrupt state, locked users out
- What extra verification, observability, or review does this deserve? Examples: audit log, pair review, staged rollout
- What is the safest way to limit blast radius if you are wrong? Examples: flag, guardrail, rollback, kill switch
