# Data Modeling — Schema, Migrations, Data Integrity

The schema is the foundation. Mistakes here cascade everywhere.

→ Also read: [reliability](../qualities/reliability.md), [maintainability](../qualities/maintainability.md)

1. Does this schema change accurately model the real-world domain, with appropriate constraints? (e.g., NOT NULL, foreign keys, check constraints, unique indexes)
2. Is the migration idempotent and safe to run multiple times? (e.g., IF NOT EXISTS, conditional blocks, no destructive operations without guards)
3. How does this schema change affect the existing type generation and downstream consumers? (e.g., type regeneration, API contract changes, frontend type updates)
4. What happens to existing data when this migration runs? (e.g., backfill strategy, default values, null handling for new columns)
5. Does this schema support the queries that will be run against it efficiently? (e.g., indexes for common lookups, avoiding full table scans, denormalization trade-offs)
6. Are the state transitions in this model explicit and guarded? (e.g., enum values as state machines, valid transitions documented, transition guards)
7. What is the cascade behavior when parent records are deleted? (e.g., cascade vs restrict vs set null, intentional orphan handling)
