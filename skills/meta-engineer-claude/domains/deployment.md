# Deployment — Getting Code to Production Safely

Code on your machine is not code in production. Mind the gap at every step.

→ Also read: [reliability](../qualities/reliability.md), [observability](../qualities/observability.md)

1. What is the full path from my code change to the running system, and have I verified each step? (e.g., build, test, deploy, migrate, restart, health check)
2. What happens if the deployment fails or is interrupted at each stage? (e.g., rollback strategy, partial migration, inconsistent state between services)
3. Does this change require any manual steps, and are they documented and tested? (e.g., environment variables, database migrations, config changes, DNS updates)
4. How will I verify that this specific change is working in production? (e.g., health checks, smoke tests, log observation, user-facing verification)
5. What is the rollback plan if this change causes problems in production? (e.g., revert commit, migration rollback, feature flag, traffic routing)
