# Architecture

## Project Structure

```
ralph-agent-workspace/
├── server/                    # Hono API on Bun (port 3001)
│   └── src/
│       ├── index.ts           # Entry point — middleware stack + route mounting (chained)
│       ├── database.types.ts  # Auto-generated from Postgres schema (never edit manually)
│       ├── db.ts              # Typed Supabase client factory: createClient<Database>()
│       ├── env.ts             # Zod-validated environment config + build_agent_env()
│       ├── public.ts          # Re-exports AppType for frontend consumption
│       ├── routes/            # Hono route modules (auth, admin, features, projects, tasks, etc.)
│       ├── services/          # Business logic (pipeline, agent, watcher, chat, prompt, system)
│       ├── middleware/         # auth, admin, rate_limit, metrics, request_id
│       └── utils/             # logger, ssrf validation, feature utils
├── web/                       # SvelteKit frontend (port 3002, SPA mode)
│   └── src/
│       ├── routes/            # SvelteKit pages (+page.svelte, +layout.svelte)
│       └── lib/
│           ├── api/           # RPC client (hc<AppType>) + custom fetch wrapper
│           ├── types/index.ts # All types DERIVED via InferResponseType (never hand-written)
│           ├── auth.ts        # Passkey/WebAuthn client-side logic
│           └── components/    # Shared UI components
├── shared/                    # Legacy — being replaced by E2E type inference
├── supabase/supabase/
│   └── migrations/            # SQL migration files (applied by CI pipeline)
├── agents/
│   ├── prompts/               # System prompts for manager and ralph agents
│   ├── scripts/               # Spawn scripts and utilities
│   └── workspace/             # Agent working directories (progress.json, tasks.json)
├── e2e/                       # End-to-end tests
├── scripts/                   # Pre-commit hooks, utility scripts
└── .github/workflows/
    └── deploy-pi.yml          # CI/CD pipeline (self-hosted Pi runner)
```

## Request Flow

```
Browser → SvelteKit (3002) → Hono API (3001) → Supabase Postgres (5432 via Docker)
```

- SvelteKit runs in SPA mode (`ssr: false`). No server-side rendering. All data fetching happens
  client-side via `onMount` + polling.
- The Hono API uses the Supabase service-role key, bypassing RLS.
- Nginx handles HTTPS termination and reverse proxying in production.

## Type Flow (E2E Inference)

```
Postgres Schema
    ↓  supabase gen types typescript
database.types.ts (auto-generated)
    ↓  createClient<Database>()
Typed Supabase queries
    ↓  context.json(data) in chained Hono routes
AppType = typeof app
    ↓  export from server/src/public.ts
hc<AppType>(url) in frontend
    ↓  InferResponseType<Client['api']['X']['$get']>
Frontend types (derived, never declared)
```

Every type is derived from the database schema. When you add a column:
1. Write the migration
2. Apply it locally
3. Run `bun run gen-types`
4. Everything else infers automatically

## Deploy Pipeline

Triggered by push to `main`. Runs on a self-hosted GitHub Actions runner on the Raspberry Pi.

```
Push to main
  → git fetch origin main
  → git reset --hard origin/main        # DESTROYS any local changes not in the commit
  → bun install --frozen-lockfile        # Exact dependency resolution
  → Apply pending migrations             # docker exec supabase_db_supabase psql < migration.sql
  → PUBLIC_API_URL= bun --bun run build  # Web build (empty PUBLIC_API_URL = relative URLs)
  → touch .deploy-trigger                # systemd path unit watches this file
  → systemd restarts ralph-api + ralph-web services
  → Health check: curl http://localhost:3001/health (retry 5x with 2s sleep)
  → Rollback on failure: git reset --hard to previous commit
```

**Critical implications:**
- `git reset --hard` overwrites everything. Uncommitted work is destroyed.
- `bun install --frozen-lockfile` rejects lockfile drift. If `bun.lock` is out of date, CI fails.
- `PUBLIC_API_URL` is set empty at build time so SvelteKit uses relative URLs (not baked-in absolute URLs).
- `bun --bun run build` forces Bun runtime (not Node). `bun run` alone delegates to Node.
- Migrations run via `docker exec psql`, not Supabase CLI.
- Server restarts on every deploy — all in-memory state is lost.

## Constraints

**Single-tenant:** One workspace, one set of projects, one pipeline queue. All authenticated users
share the same data. Do not add multi-tenant isolation.

**No RLS:** The server uses the service-role key. Access control is enforced by `auth_middleware`
and `admin_middleware` at the API layer, not by Postgres policies.

**SSR disabled:** Do not enable SSR without first solving auth token forwarding to the Hono API.

**Resource-constrained:** The Raspberry Pi has limited CPU, memory, and disk. Agent concurrency is
capped via `MAX_CONCURRENT_AGENTS`. System alerts monitor disk (>80%/90%), memory (>85%/95%), and
CPU temperature (>70°C/80°C).
