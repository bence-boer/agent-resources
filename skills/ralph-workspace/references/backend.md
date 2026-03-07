# Backend Patterns

## Hono Route Structure

All routes MUST be method-chained for E2E type inference:

```typescript
// CORRECT — chained methods, type flows through
export const projects_routes = new Hono<AppBindings>()
    .get('/', async (context) => {
        const { data, error } = await supabase.from('projects').select('*');
        if (error) return context.json({ error: { code: 500, message: 'Internal server error' } }, 500);
        return context.json(data);
    })
    .post('/', zValidator('json', create_project_schema), async (context) => {
        const body = context.req.valid('json');
        // ...
        return context.json(data, 201);
    });

// WRONG — standalone calls, AppType loses route type information
const routes = new Hono<AppBindings>();
routes.get('/', handler);  // Type information is lost
routes.post('/', handler); // Cannot be inferred by frontend RPC client
```

## Middleware Stack Order

Applied in `index.ts`, order matters:

1. `request_id_middleware` — generates 8-char correlation ID
2. `rate_limit(100, 60_000)` — global rate limit
3. `cors({ origin: CORS_ORIGINS })` — CORS from env allowlist
4. Stricter rate limits on specific route prefixes (auth: 10/min, chat: 20/min, spawn: 5/min)
5. `auth_middleware` — validates session cookie, sets `user` and `role` in context
6. `admin_middleware` — checks `role === 'admin'` on admin routes

## Input Validation

**Request body:** Zod schemas via `zValidator('json', schema)` middleware.

```typescript
const create_feature_schema = z.object({
    project_id: z.string().uuid(),
    name: z.string().min(1).max(200),
    description: z.string().nullable().optional() // nullable for DB compat
});
```

**URL params:** UUID validation before any database query.

```typescript
const id = context.req.param('id');
if (!is_valid_uuid(id)) {
    return context.json({ error: { code: 400, message: 'Invalid ID format' } }, 400);
}
```

**Query params:** Parse and validate explicitly.

**Critical rule:** Whenever a database column is nullable, the Zod schema MUST use
`.nullable().optional()`. `.optional()` alone rejects explicit `null` values sent by the frontend.

## Error Handling

**Client-facing:** Generic messages. Never expose database errors, stack traces, or internal state.

```typescript
// CORRECT
return context.json({ error: { code: 500, message: 'Internal server error' } }, 500);

// WRONG — leaks DB internals
return context.json({ error: { code: 500, message: error.message } }, 500);
```

**Server-side:** Structured logging with full context.

```typescript
logger.error('Failed to create feature', {
    service: 'features',
    project_id,
    error: String(error)
});
```

**Supabase mutations fail silently.** ALWAYS check `.error`:

```typescript
const { data, error } = await supabase.from('features').insert({ ... }).select().single();
if (error) {
    logger.error('Insert failed', { service: 'features', error: error.message });
    return context.json({ error: { code: 500, message: 'Internal server error' } }, 500);
}
```

## Service Layer

Business logic lives in `services/`, not in route handlers. Routes handle HTTP concerns (parsing,
validation, response formatting). Services handle domain logic.

Extract a service when:
- Route handlers import from other route modules (cross-route dependency)
- Business logic exceeds ~20 lines in a handler
- Logic needs to be called from multiple routes or from non-HTTP contexts (e.g., watcher polling)

## Environment Configuration

All environment variables are validated at startup via Zod in `env.ts`:

```typescript
const env_schema = z.object({
    SUPABASE_URL: z.string().url(),
    SUPABASE_KEY: z.string().min(1),
    PORT: z.coerce.number().default(3001),
    MAX_CONCURRENT_AGENTS: z.coerce.number().default(3),
    // ...
});
export const env = env_schema.parse(process.env);
```

If `parseInt()` or `Number()` returns NaN, you won't notice until production. Zod's `z.coerce`
catches this at startup.

## Structured Logging

Use `logger` from `utils/logger.ts`. JSON output to stdout/stderr.

```typescript
logger.info('Pipeline started', { service: 'pipeline', feature_id });
logger.error('Agent crashed', { service: 'agent', task_id, exit_code });
```

Conventions:
- Always include `{ service: 'X' }` to identify the subsystem
- Request handlers include `{ route: 'GET /api/...' }`
- `LOG_LEVEL` env var controls minimum level (default: `info`)
- `warn`/`error` → stderr; `debug`/`info` → stdout

## SSE (Server-Sent Events)

Chat uses SSE for streaming. Key requirements:
- Bun's HTTP server needs explicit `idleTimeout: 0` (or large value) to prevent SSE connections
  from being killed by the default idle timeout
- Use raw `new Response(stream)` with `ReadableStream`, not framework wrappers
- Set `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`

## Naming Conventions

- Variables/functions: `snake_case`
- Types/interfaces: `PascalCase`
- Enum members: `UPPER_CASE`
- Files: `kebab-case.ts` (e.g., `auth-login.ts`, `pipeline-service.ts`)
- Components: `PascalCase.svelte`
