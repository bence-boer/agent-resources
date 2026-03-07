# Scenario - Release change

## Use when

Use when the task changes deployment, rollout, migrations, environment, operations, or release sequencing.

## Route next

- [domain-risk-and-safety.md](domain-risk-and-safety.md) - to think through the cost of a bad release
- [domain-observability-and-operations.md](domain-observability-and-operations.md) - to define fast signals and operational breadcrumbs
- [domain-completeness.md](domain-completeness.md) - to include backups, cleanup, docs, and validation steps
- [finish-handoff.md](finish-handoff.md) - to leave reviewers and operators the exact context they need

## Questions

- What has to happen before, during, and after release for this to be safe? Examples: backup, migration, smoke test
- What partial-release states are possible, and are they acceptable? Examples: old client and new server, data mid-backfill, cache stale
- How will you detect problems quickly after release? Examples: health check, dashboard, support signal
- What rollback or repair path exists if the first release goes badly? Examples: revert, disable flag, restore data, run cleanup
