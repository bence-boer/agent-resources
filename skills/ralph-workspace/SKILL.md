---
name: ralph-workspace
description: >
  Comprehensive development guide for the ralph-agent-workspace monorepo — an AI agent orchestration
  platform built with Hono (Bun), SvelteKit 5, and Supabase Postgres, deployed to a self-hosted
  Raspberry Pi. Use when working on ANY file in this repository including backend routes and services,
  frontend pages and components, database migrations, agent prompts and scripts, CI/CD pipeline, or
  deployment configuration. Provides architectural mental models, decision frameworks, pre-implementation
  checklists, and scenario-specific patterns to prevent recurring failure modes. Triggers on all tasks
  in the ralph-agent-workspace codebase.
---

# Ralph Workspace — Development Mental Model

This skill encodes the accumulated architectural wisdom from building this system across 51 iterations.
It provides a thinking framework — not just rules, but the questions to ask and the mental steps to
take before, during, and after any change.

## The System in One Paragraph

Ralph is a single-tenant AI agent orchestration platform. Users create projects and features. A
**manager agent** decomposes features into tasks. Approved tasks are executed by **ralph agents** via
CLI tools (Copilot CLI or Gemini CLI). The server orchestrates this pipeline with concurrency limits.
Everything runs on a Raspberry Pi — resources are finite, restarts are frequent, and every process
costs real capacity. The database is the only durable truth. The frontend polls for state.

## The Core Mental Model

Three principles govern every decision in this codebase:

**1. The database is the single source of truth.**
In-memory state is ephemeral. The server restarts on every deploy. Maps, Sets, counters, and running
processes vanish. Any state that matters must be in Postgres. Any state read from memory must be
reconcilable with the database on startup.

**2. Types flow in one direction: Database → Server → Frontend.**
The database schema generates TypeScript types. Hono route chains carry those types to the API
contract. The frontend's RPC client infers response types from that contract. No hand-written
interfaces. No parallel type definitions. If you add a column, regenerate types — everything else
follows.

**3. The Raspberry Pi is the constraint.**
There is no auto-scaling. Every spawned process, every polling interval, every in-memory buffer is a
cost. Agent concurrency is hard-capped. Log buffers are capped. Timeouts are mandatory. Design for
graceful degradation, not infinite capacity.

## Before You Touch Any Code

Run this mental survey before every task. Skip nothing.

### 1. Do I Understand What Exists?

- Read the actual code, not just file names. Assumptions from naming are wrong often enough to matter.
- Check the database schema as it actually is: `docker exec supabase_db_supabase psql -U postgres -d postgres -c "\d table_name"`
- Check what migrations have been applied vs what files exist on disk.
- Search globally for the pattern you're about to change: `grep -rn 'pattern' server/src/ web/src/`

### 2. What Is the Full Path From My Change to the Running System?

Code on disk is not code in production. Trace the path:
- Code → commit → push → GitHub Actions → `git reset --hard` on Pi → `bun install` → migrations applied → `bun build` → systemd restart → health check
- If your change involves a migration, it runs via `docker exec psql`, not Supabase CLI.
- If your change involves environment variables, they must be in the systemd unit file on the Pi AND validated in `env.ts`.

### 3. Where Else Does This Pattern Exist?

The #1 source of incomplete fixes: changing one instance of a pattern while three others remain.
Before fixing anything, search the entire codebase for the same pattern. Fix all instances or
document why some were intentionally left.

### 4. What Breaks If the Server Restarts Mid-Operation?

Every deploy triggers `git reset --hard` followed by a service restart. In-memory state is destroyed.
If your feature relies on something surviving a restart, it must be in the database. If it spawns
processes, those processes become orphans — plan for reconciliation on startup.

### 5. Am I Adding a New Dependency?

Do not add libraries without explicit approval. The dependency surface is intentionally small:
Hono, SvelteKit, Supabase client, Zod, and minimal utilities. Each addition is a maintenance burden
on a resource-constrained deployment target.

## The Implementation Survey

When you know what to build, answer these questions to choose the right approach:

### Adding an API Endpoint

- Does a route file for this domain already exist? Add to it rather than creating a new file.
- Is the route chained (`.get().post().patch()`) or standalone? It MUST be chained for E2E type inference.
- Does every input get validated? Zod schema for body, UUID validation for params, query param parsing.
- Does every Supabase mutation check `.error`? Silent failures are the default.
- Is the response shape `context.json(data)` for success and `context.json({ error: { code, message } })` for failure?
- Will the response type be inferable by the frontend RPC client?

→ For full backend patterns, read [references/backend.md](references/backend.md)

### Adding a Frontend Page or Component

- Is this Svelte 5? Use `$state()`, `$derived()`, `$effect()`, `$props()`. Zero legacy patterns.
- Will this file exceed 200 lines? Extract subcomponents before it gets there, not after.
- Does it poll for data? Use `setInterval` inside `$effect` with cleanup. Reconcile by key with `Object.assign`, never replace arrays wholesale.
- Does it use CSS custom properties correctly? Check exact variable names against `+layout.svelte`.
- Does it handle mobile? Every flex container needs `min-width: 0`. Every text container needs `overflow-wrap: break-word`.

→ For full frontend patterns, read [references/frontend.md](references/frontend.md)

### Adding a Database Migration

- Is the migration file named `YYYYMMDDHHMMSS_description.sql`?
- Is the SQL idempotent? Use `IF NOT EXISTS`, `DO $$ BEGIN ... END $$` blocks.
- If adding a nullable column, does the Zod schema use `.nullable().optional()` (not just `.optional()`)?
- If adding an enum value, does the frontend also handle it in switch statements and display logic?
- After creating the file, test it manually: `docker exec supabase_db_supabase psql -U postgres -d postgres -f -`
- After applying, regenerate types: `bun run gen-types`

→ For full data layer patterns, read [references/data-layer.md](references/data-layer.md)

### Modifying the Agent Pipeline

- Does this change respect the concurrency cap (`MAX_CONCURRENT_AGENTS`)?
- Does every `increment_agent_count()` have a matching `decrement_agent_count()` in a `finally` block?
- Does the cancel/abort path also decrement?
- Are spawned processes killed by process group (`-pid`), not just parent PID?
- Is the agent's environment built via `build_agent_env()` (allowlist), never `...process.env` (leak)?
- Is user-supplied content in prompts delimited with `<user_input>` tags?

→ For full agent system patterns, read [references/agent-system.md](references/agent-system.md)

### Touching Security-Sensitive Code

- Auth, session management, rate limiting, agent spawning, environment variables, URL handling, or
  admin endpoints all qualify as security-sensitive.
- Read [references/security.md](references/security.md) before making any changes.

## The Verification Discipline

Writing code is ~30% of the work. The rest is verification. This is not optional.

### Step 1: Type Check

```bash
cd server && bun run --bun tsc --noEmit    # Must be 0 errors
cd ../web && bun run check                  # Must be 0 errors (warnings OK)
```

### Step 2: Lint

```bash
bun run lint    # Must pass — no eslint-disable allowed, no inline-config
```

### Step 3: Commit

- Format: `[verb] [feature/action] [context]` — imperative, under 50 chars, no period
- Only commit after verification passes. One logical change per commit.
- If fixing a flaw in a recent commit on the same branch: `git commit --amend` or `--fixup` + rebase.

### Step 4: Push and Monitor CI

```bash
git push
gh run list --limit 1 --json status,conclusion   # Poll until completed
gh run view --log-failed                          # If failed, investigate
```

### Step 5: Verify the Live Deployment

```bash
curl -sf https://agents.benceboer.com/health
```

Test your specific change against the live URL. A task is NOT complete until it works in production.
If you cannot test end-to-end (e.g., authenticated flows), explicitly state what was verified and
what remains untestable.

## Thinking Traps to Avoid

These are the recurring meta-cognitive failures observed across 51 iterations:

**"It compiles, so it works."**
TypeScript catches type errors, not logic errors. A route can type-check perfectly while returning
the wrong data, missing a middleware, or breaking a state machine transition. Always verify behavior,
not just compilation.

**"I fixed the one instance I found."**
If you found a bug in one place, search for the same pattern everywhere. The same mistake was made
in multiple places more often than not.

**"The migration file exists, so the table exists."**
Migration files are text. They must be applied to the database, recorded in `schema_migrations`,
and verified in the actual schema. Check all three.

**"In-memory state will persist."**
It won't. The server restarts on every deploy. Design for restart resilience from the start, not
as a bug fix later.

**"The first fix is the complete fix."**
Plan for at least two passes. The first fix addresses the immediate symptom. The second addresses
the systemic pattern. Budget time for both.

**"Mobile works because desktop works."**
Mobile overflow is caused by rigid-width children in flex containers. `min-width: 0` on flex
children and `overflow-x: hidden` on containers are required at every nesting level, not just the
outermost.

## Scenario Navigation

Read only the references relevant to your current task:

| Task | Reference |
|------|-----------|
| Understanding system architecture, deploy pipeline, project structure | [architecture.md](references/architecture.md) |
| Backend routes, services, middleware, environment, error handling | [backend.md](references/backend.md) |
| Frontend pages, components, CSS, polling, state management | [frontend.md](references/frontend.md) |
| Database migrations, schema, types, E2E type inference | [data-layer.md](references/data-layer.md) |
| Agent pipeline, spawning, concurrency, prompts | [agent-system.md](references/agent-system.md) |
| Auth, rate limiting, SSRF, environment sandboxing, prompt injection | [security.md](references/security.md) |
| Linting, testing, git practices, CI/CD verification | [quality.md](references/quality.md) |
