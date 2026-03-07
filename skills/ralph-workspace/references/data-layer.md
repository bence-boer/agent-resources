# Data Layer Patterns

## Database Access

Use the typed Supabase client:

```typescript
import type { Database } from './database.types';
const supabase = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_KEY);
```

The `Database` type is auto-generated from the Postgres schema. Never edit `database.types.ts`
manually.

### Regenerating Types

```bash
bun run gen-types
```

This runs `supabase gen types typescript --db-url "postgresql://postgres:postgres@localhost:54322/postgres"`
and writes to `server/src/database.types.ts`.

A pre-commit hook automatically regenerates types if the local DB is running. If it's not running,
the hook silently continues (types may be stale).

## Schema Conventions

### Enums as State Machines

Status fields use Postgres enums:

```sql
CREATE TYPE feature_status AS ENUM ('Draft', 'Submitted', 'Planning', 'In_Progress', 'Complete', 'Failed');
CREATE TYPE task_status AS ENUM ('Pending', 'Approved', 'In_Progress', 'Complete', 'Failed');
```

**Trade-off:** Enums are type-safe but rigid. Adding a new value requires a migration
(`ALTER TYPE ... ADD VALUE`). Removing or renaming values is complex. Accept this trade-off for
the type safety it provides.

### State Transitions (Optimistic Locking)

Always guard state transitions with the expected current state:

```typescript
const { data, error } = await supabase
    .from('tasks')
    .update({ status: 'Complete' })
    .eq('id', task_id)
    .eq('status', 'In_Progress')  // Only transition from expected state
    .select()
    .single();

if (!data) {
    // Task was not in expected state — likely a race condition
    logger.warn('State transition failed', { task_id, expected: 'In_Progress', target: 'Complete' });
}
```

This prevents double-completion races where two processes try to complete the same task.

### Cascade Deletes

Foreign keys use `ON DELETE CASCADE` throughout the hierarchy:

```
projects → features → tasks → agent_runs
                    → resources
```

Deleting a project cascades through features, tasks, resources, and agent runs. This is intentional
for a single-tenant system where "delete project" means "delete everything related."

### Nullable Columns

If a database column is `TEXT` (nullable by default), the corresponding Zod schema must use
`.nullable().optional()`:

```typescript
// Column: description TEXT (nullable)
description: z.string().nullable().optional()
//                       ^^^^^^^^^ accepts null
//                                 ^^^^^^^^^^ accepts omission
```

`.optional()` alone rejects `null`. This is the Zod-Postgres impedance mismatch — apply it
mechanically for every nullable column.

## Migration Practices

### File Naming

```
YYYYMMDDHHMMSS_description.sql
```

Example: `20260221160000_add_cli_column.sql`

### Idempotent SQL

```sql
-- Use DO blocks for operations that might already exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'feature_status') THEN
        CREATE TYPE feature_status AS ENUM ('Draft', 'Submitted');
    END IF;
END $$;

-- Use IF NOT EXISTS for tables and indexes
CREATE TABLE IF NOT EXISTS projects ( ... );
CREATE INDEX IF NOT EXISTS idx_features_project ON features(project_id);

-- For constraints
ALTER TABLE features ADD CONSTRAINT IF NOT EXISTS check_cli
    CHECK (cli IS NULL OR cli IN ('copilot', 'gemini'));
```

### Verification After Migration

```bash
# Check what migrations the DB thinks have been applied
docker exec supabase_db_supabase psql -U postgres -d postgres -c \
  "SELECT version, name FROM supabase_migrations.schema_migrations ORDER BY version"

# Check actual schema
docker exec supabase_db_supabase psql -U postgres -d postgres -c "\d table_name"

# Compare against files on disk
ls -la supabase/supabase/migrations/
```

A migration exists in reality only when ALL THREE are true:
1. The `.sql` file exists on disk
2. Its version is recorded in `schema_migrations`
3. The actual database schema reflects the changes

### Testing Migrations Locally

Before pushing, apply the migration manually:

```bash
docker exec supabase_db_supabase psql -U postgres -d postgres < supabase/supabase/migrations/YOUR_MIGRATION.sql
```

Note: Multi-statement `-c` strings behave unpredictably. Run one statement at a time or pipe a file.

## The E2E Type Chain

### Why It Exists

The project previously had three independent type definitions for the same data: SQL schema,
server `types.ts` (~184 lines of hand-written interfaces), and frontend type files (~240 lines).
Every column addition required updates in 3–4 places. Drift was inevitable and caused silent `null`
returns from Supabase PostgREST.

### How It Works

1. **Database schema** → `supabase gen types typescript` → `database.types.ts`
2. **Typed Supabase client** → `createClient<Database>()` → queries return exact row types
3. **Chained Hono routes** → `context.json(data)` → return type inferred from query result
4. **AppType export** → `typeof app` captures full route tree with all paths and response types
5. **Frontend RPC client** → `hc<AppType>()` → method calls are fully typed
6. **Frontend types** → `InferResponseType<...>` → types derived from API, never declared

### Keeping the Chain Intact

- **Routes must be chained.** Standalone `routes.get(...)` loses type information.
- **Return `context.json(data)` directly.** Don't transform the data into a new shape that breaks
  inference.
- **The `ExtractSuccess<T>` helper** strips error union variants for frontend use:
  ```typescript
  type ExtractSuccess<T> = Exclude<T, { error: unknown }>;
  ```
- **Enum types** come from `Database['public']['Enums']['feature_status']`, not hand-written unions.
- **The `shared/` package is legacy.** New code should derive types from the chain, not from shared.

### When to Regenerate

Run `bun run gen-types` after:
- Any migration that adds/removes/modifies columns, tables, or enums
- Before committing if you suspect type drift
- The pre-commit hook does this automatically if the local DB is running
