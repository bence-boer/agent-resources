---
name: supabase-postgres-best-practices
description: "Postgres performance optimization and best practices from Supabase. Covers sequential scan elimination, index-only scans, partial/composite indexes, query plan analysis (EXPLAIN ANALYZE), connection pooling (PgBouncer), Row-Level Security (RLS), vacuum/analyze tuning, WAL configuration, and locking strategies. Use when writing SQL, reviewing schemas, debugging slow queries, configuring connection pools, implementing RLS, or optimizing Postgres-specific features. Triggers on \"my query is slow\", \"how should I index this\", \"database is timing out\", \"help with Postgres\", or any Supabase DB performance question. Do NOT use for application-level ORM patterns or non-Postgres databases."
license: MIT
metadata:
  author: supabase
  version: "1.2.0"
  organization: Supabase
  date: January 2026
  abstract: Comprehensive Postgres performance optimization guide for developers using Supabase and Postgres. Contains performance rules across 8 categories, prioritized by impact from critical (query performance, connection management) to incremental (advanced features). Each rule includes detailed explanations, incorrect vs. correct SQL examples, query plan analysis, and specific performance metrics to guide automated optimization and code generation.
---

# Supabase Postgres Best Practices

Route by topic to the matching reference file. Each file contains incorrect/correct SQL pairs, EXPLAIN output, and Supabase-specific notes.

## Expert Vocabulary

- **Query Optimization**: sequential scan, index-only scan, bitmap scan, EXPLAIN ANALYZE, query planner, cost estimation, Seq Scan, Index Scan, Bitmap Heap Scan, nested loop, hash join, merge join
- **Indexing**: B-tree, GIN, GiST, BRIN, partial index, composite index, covering index (INCLUDE), index bloat, multi-column index, expression index, unique index
- **Connection Management**: PgBouncer, transaction mode, session mode, connection pooling, prepared statements, idle timeout, connection limits, pool exhaustion
- **Security**: Row Level Security (RLS), service role, anon key, `auth.uid()`, security definer, security invoker, policy evaluation, column-level privileges, `GRANT`/`REVOKE`
- **Maintenance**: VACUUM, ANALYZE, autovacuum, WAL (Write-Ahead Log), dead tuples, table bloat, `pg_stat_statements`, `pg_stat_user_tables`, statistics target
- **Locking**: advisory locks, `SKIP LOCKED`, deadlock prevention, lock escalation, row-level locks, `FOR UPDATE`, `FOR SHARE`, short transactions
- **Schema**: primary key selection, UUID vs serial, check constraints, foreign key indexes, table partitioning, range/list/hash partitioning, identifier casing

## Owned Surface

This skill covers Postgres performance, schema design, security, and operational tuning for Supabase-hosted and standard Postgres databases. It applies to SQL written directly, through Supabase client libraries, or via migration files.

**Non-goals**: application-level ORM patterns, non-Postgres databases, Supabase Edge Functions, Supabase Storage, client-side caching strategies, Supabase Auth configuration beyond RLS integration.

## Common Mistakes

1. **Missing indexes on foreign keys used in JOINs** — Postgres does NOT auto-index foreign keys. Every FK column used in JOINs or WHERE clauses needs an explicit index. See [schema-foreign-key-indexes.md](references/schema-foreign-key-indexes.md).
2. **Using `SELECT *` through RLS policies** — forces full-row evaluation on every policy check even when only a few columns are needed. Specify columns explicitly. See [security-rls-performance.md](references/security-rls-performance.md).
3. **Not using connection pooling for serverless** — each serverless invocation opens a new connection; without PgBouncer, connection limits exhaust in minutes. See [conn-pooling.md](references/conn-pooling.md).
4. **N+1 query patterns through the API** — fetching a list then querying each item individually. Use JOINs or batch queries instead. See [data-n-plus-one.md](references/data-n-plus-one.md).
5. **Over-permissive RLS policies** — policies using `true` or overly broad conditions silently bypass row-level security. Always scope to `auth.uid()` or explicit role checks. See [security-rls-basics.md](references/security-rls-basics.md).
6. **Sequential scans on large tables** — missing or wrong index type causes full table scans. Use EXPLAIN ANALYZE to detect. See [query-missing-indexes.md](references/query-missing-indexes.md).
7. **Ignoring VACUUM/ANALYZE** — stale statistics cause the query planner to choose bad plans; dead tuple accumulation causes table bloat. See [monitor-vacuum-analyze.md](references/monitor-vacuum-analyze.md).

## Routing Index

Route by intent to the matching reference file. Files are grouped by category in priority order.

### 1. Query Performance — CRITICAL

| Intent | File |
|--------|------|
| Table has no index, sequential scans on large tables | [query-missing-indexes.md](references/query-missing-indexes.md) |
| Index only a subset of rows (WHERE filter on index) | [query-partial-indexes.md](references/query-partial-indexes.md) |
| Multi-column index ordering, leading column selection | [query-composite-indexes.md](references/query-composite-indexes.md) |
| Index-only scans, INCLUDE columns to avoid heap fetches | [query-covering-indexes.md](references/query-covering-indexes.md) |
| Choosing B-tree vs GIN vs GiST vs BRIN for a column type | [query-index-types.md](references/query-index-types.md) |

### 2. Connection Management — CRITICAL

| Intent | File |
|--------|------|
| Setting up PgBouncer, transaction vs session mode | [conn-pooling.md](references/conn-pooling.md) |
| Max connections, pool sizing, connection exhaustion | [conn-limits.md](references/conn-limits.md) |
| Idle connection cleanup, timeout configuration | [conn-idle-timeout.md](references/conn-idle-timeout.md) |
| Prepared statements with PgBouncer transaction mode | [conn-prepared-statements.md](references/conn-prepared-statements.md) |

### 3. Security & RLS — CRITICAL

| Intent | File |
|--------|------|
| Writing RLS policies, `auth.uid()`, policy structure | [security-rls-basics.md](references/security-rls-basics.md) |
| RLS policy performance, avoiding full-row evaluation | [security-rls-performance.md](references/security-rls-performance.md) |
| GRANT/REVOKE, column-level privileges, role management | [security-privileges.md](references/security-privileges.md) |

### 4. Schema Design — HIGH

| Intent | File |
|--------|------|
| Primary key selection, UUID vs serial vs identity | [schema-primary-keys.md](references/schema-primary-keys.md) |
| Indexing foreign key columns for JOINs and cascades | [schema-foreign-key-indexes.md](references/schema-foreign-key-indexes.md) |
| Choosing data types, avoiding unnecessary casts | [schema-data-types.md](references/schema-data-types.md) |
| CHECK, NOT NULL, UNIQUE, exclusion constraints | [schema-constraints.md](references/schema-constraints.md) |
| Table partitioning (range, list, hash) for large tables | [schema-partitioning.md](references/schema-partitioning.md) |
| Identifier casing, quoted vs unquoted names | [schema-lowercase-identifiers.md](references/schema-lowercase-identifiers.md) |

### 5. Concurrency & Locking — MEDIUM-HIGH

| Intent | File |
|--------|------|
| Application-level locks, pg_advisory_lock patterns | [lock-advisory.md](references/lock-advisory.md) |
| Preventing deadlocks, consistent lock ordering | [lock-deadlock-prevention.md](references/lock-deadlock-prevention.md) |
| Keeping transactions short to reduce lock duration | [lock-short-transactions.md](references/lock-short-transactions.md) |
| Queue processing, SKIP LOCKED for concurrent workers | [lock-skip-locked.md](references/lock-skip-locked.md) |

### 6. Data Access Patterns — MEDIUM

| Intent | File |
|--------|------|
| Bulk inserts, COPY vs multi-row INSERT | [data-batch-inserts.md](references/data-batch-inserts.md) |
| Eliminating N+1 queries, batching fetches | [data-n-plus-one.md](references/data-n-plus-one.md) |
| Cursor-based vs offset pagination | [data-pagination.md](references/data-pagination.md) |
| INSERT ON CONFLICT (upsert) patterns | [data-upsert.md](references/data-upsert.md) |

### 7. Monitoring & Diagnostics — LOW-MEDIUM

| Intent | File |
|--------|------|
| Reading EXPLAIN ANALYZE output, understanding costs | [monitor-explain-analyze.md](references/monitor-explain-analyze.md) |
| Identifying slow queries with pg_stat_statements | [monitor-pg-stat-statements.md](references/monitor-pg-stat-statements.md) |
| VACUUM, ANALYZE, autovacuum tuning, dead tuple cleanup | [monitor-vacuum-analyze.md](references/monitor-vacuum-analyze.md) |

### 8. Advanced Features — LOW

| Intent | File |
|--------|------|
| Full-text search with tsvector, GIN indexes, ts_rank | [advanced-full-text-search.md](references/advanced-full-text-search.md) |
| JSONB indexing, GIN operators, containment queries | [advanced-jsonb-indexing.md](references/advanced-jsonb-indexing.md) |

### Meta / Contributing

| File | Purpose |
|------|---------|
| [_sections.md](references/_sections.md) | Category definitions and priority levels |
| [_contributing.md](references/_contributing.md) | Writing guidelines for new reference files |
| [_template.md](references/_template.md) | Template for creating new reference files |

## Reference File Format

Each rule file contains:
- Brief explanation of why it matters
- Incorrect SQL example with explanation
- Correct SQL example with explanation
- EXPLAIN output or performance metrics (where applicable)
- Supabase-specific notes (when applicable)

## Questions this skill answers

- Why is my Postgres query slow and how do I fix it?
- How should I index this table or query?
- What does EXPLAIN ANALYZE output mean for my query plan?
- How do I eliminate sequential scans on large tables?
- How do I configure PgBouncer connection pooling with Supabase?
- What are best practices for Row-Level Security (RLS) policies?
- How do I tune vacuum and analyze settings?
- When should I use partial indexes vs. composite indexes?
- How do I reduce lock contention in concurrent writes?
- What monitoring queries help diagnose Postgres performance issues?
