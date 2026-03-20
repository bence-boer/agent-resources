# Scenario - Risky change

## Use when

The task touches security, privacy, money, deletion, permissions, compliance, or a widely shared primitive.

## Route next

- [../domains/security.md](../domains/security.md) to define threats and prevention clearly
- [../domains/invariants.md](../domains/invariants.md) to capture the rule that must never drift
- [../domains/reliability.md](../domains/reliability.md) and [../domains/observability.md](../domains/observability.md) to limit blast radius and detect issues quickly
- [../domains/correctness.md](../domains/correctness.md) and [../domains/testing.md](../domains/testing.md) to raise the evidence bar

## Default posture

- Raise the evidence bar above normal feature work.
- Fail closed by default.
- Minimize blast radius with flags, staged rollout, scoping, or explicit guardrails.
- Add auditability or strong diagnostics where harm would be expensive.

## Resolve explicitly

- What is the worst credible outcome?
- What guardrail must exist before the dangerous action succeeds?
- What is the rollback or recovery path?
- Who should review or monitor this change?

## Minimum proof

- Security or permission verification for the risky path
- Failure-path validation under representative bad conditions
- Rollout guardrail and operational watchpoints
