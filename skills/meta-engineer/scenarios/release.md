# Scenario - Release

## Use when

The task changes deployment, rollout, migrations, environment, operations, or release sequencing.

## Route next

- [../domains/observability.md](../domains/observability.md) to define fast signals and operational breadcrumbs
- [../domains/reliability.md](../domains/reliability.md) to survive partial and failed deployments
- [../domains/completeness.md](../domains/completeness.md) to include backups, cleanup, docs, and validation steps
- [../domains/security.md](../domains/security.md) to protect the release path itself
- [../domains/testing.md](../domains/testing.md) to verify the release mechanics, not just the code

## Default posture

- Treat rollout, partial states, and recovery as first-class behavior.
- Sequence preconditions, rollout steps, verification, and rollback explicitly.
- Verify both the new code and the release mechanics.
- Leave breadcrumbs for operators, not only developers.

## Resolve explicitly

- What must happen before, during, and after release?
- What partial-release states are acceptable?
- What signal should fail first if the release is wrong?
- What is the rollback or repair path?

## Minimum proof

- Ordered release or migration plan
- Smoke validation for the changed runtime path
- Monitoring and rollback watchpoints called out explicitly
