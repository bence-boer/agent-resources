# Scenario — Release

## Use when

The task changes deployment, rollout, migrations, environment, operations, or release sequencing.

## Route next

- [../domains/observability.md](../domains/observability.md) — to define fast signals and operational breadcrumbs
- [../domains/reliability.md](../domains/reliability.md) — to survive partial and failed deployments
- [../domains/completeness.md](../domains/completeness.md) — to include backups, cleanup, docs, and validation steps
- [../domains/security.md](../domains/security.md) — to protect the release path itself
- [../domains/testing.md](../domains/testing.md) — to verify the release mechanics, not just the code

## Questions

- What has to happen before, during, and after release for this to be safe? (e.g., backup, migration, smoke test, health check)
- What partial-release states are possible, and are they acceptable? (e.g., old client and new server, data mid-backfill, cache stale)
- How will you detect problems quickly after release? (e.g., health check, dashboard, support signal, error rate spike)
- What rollback or repair path exists if the first release goes badly? (e.g., revert, disable flag, restore data, run cleanup)
