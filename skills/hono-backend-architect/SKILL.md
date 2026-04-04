---
name: hono-backend-architect
description: Hono + Bun + Supabase backend architecture guide covering secure middleware stacks, Zod-validated OpenAPI routes, dependency injection via middleware factories, and error boundary patterns. Use when building Hono APIs on Bun, integrating Supabase auth/database, creating route handlers, setting up middleware pipelines, implementing input validation, designing error handling, reviewing backend code security, or scaffolding new API features. Triggers on any Hono (.ts) backend, Bun server, or Supabase integration task. Do NOT use for front-end code, database schema design, or DevOps/deployment configuration.
---

# Hono + Bun + Supabase Architect

## Expert Vocabulary

**Hono Framework:** middleware factory, `MiddlewareHandler`, `OpenAPIHono<Env>`, `createRoute()`, route chaining (`.route().route()`), `c.var` typed context, `AppBindings`, `default_hook`, `hc` RPC client

**Bun Runtime:** `Bun.serve()`, `Bun.env`, `bun:test`, module resolution (`bundler`), `bun --watch`

**Supabase Integration:** `createServerClient()`, `auth.getUser()`, Row-Level Security (RLS), anon key vs service role key, per-request client injection, cookie-based auth forwarding

**API Patterns:** Zod-validated OpenAPI routes, `z.infer<typeof schema>`, dependency injection via middleware, `json_content()` / `json_content_required()`, vertical slice layout, barrel exports, discriminated union results (`ServiceResult<T>`)

**Security:** `secureHeaders()`, CORS origin allowlist, CSRF origin check, `HTTPException` error boundary, rate limiting (`hono-rate-limiter`), input sanitization at route edge, env validation at startup

## Anti-Pattern Watchlist

1. **Raw env access** — accessing `process.env` or `Bun.env` directly instead of through a Zod-validated `env` object. Breaks type safety and fails silently on missing vars.
2. **Client-side Supabase in server code** — using the anon key for server-side operations that need the service role key, or creating a browser client (`createBrowserClient`) on the server.
3. **Middleware ordering mistakes** — placing auth middleware after route handlers, CORS after response, or rate limiting after auth. Middleware executes in registration order.
4. **Fat route handlers** — embedding business logic, DB queries, and error handling directly in route handlers instead of delegating to services and middleware.
5. **Untyped error responses** — throwing generic `Error` or returning ad-hoc JSON instead of using `HTTPException` with typed error schemas through the error boundary.
6. **Module-level Supabase client** — creating `createServerClient()` at import time instead of per-request via middleware factory. Breaks cookie-based auth and shares state across requests.
7. **Manual JWT decoding** — parsing JWT tokens with `atob()`/`JSON.parse()` instead of calling `supabase.auth.getUser()`, which validates the signature server-side.

## Owned Surface & Conventions

This skill owns Hono route/middleware architecture, Supabase auth integration, Zod-driven OpenAPI contracts, and error boundary design in Bun-based backends. It does **not** own frontend code, database schema design, or deployment/infrastructure.

**Local defaults** — apply unless the codebase explicitly deviates:

- **snake_case** for all variables, functions, and method names
- **Named imports only** via barrel files — no default exports
- **Descriptive names** — no single-letter abbreviations (`index` not `i`, `context` not `c`, `DataType` not `T`)
- **Functional composition** over class hierarchies
- **Middleware factories** over global singletons
- **Zod schemas** as the single source of truth for validation, types, and OpenAPI docs

## Absolute Rules

### Architecture & Security

1. **ALWAYS** validate all inputs with Zod before any business logic executes
2. **ALWAYS** use `secureHeaders()` middleware in every production app
3. **ALWAYS** authenticate via `supabase.auth.getUser()` — never manually decode JWTs or session cookies
4. **NEVER** pass raw Supabase/database errors to the client — sanitize through an error boundary
5. **NEVER** use non-null assertions (`!`) on session/user objects — guard with auth middleware that returns 401
6. **ALWAYS** use middleware factories (functions returning `MiddlewareHandler`) — never bare closures
7. **ALWAYS** set CORS with an explicit origin allowlist — never use `origin: '*'` in production
8. **ALWAYS** separate route definitions (schemas) from handler logic (business logic)
9. **ALWAYS** type context variables via `AppBindings` interface — never use untyped `c.get()`/`c.set()`
10. **NEVER** create Supabase clients at module level — inject via middleware factory per-request
11. **ALWAYS** use `HTTPException` for expected errors, let the error boundary catch unexpected ones
12. **ALWAYS** configure rate limiting for public-facing endpoints

### TypeScript & Naming Conventions

13. **ALWAYS** use snake_case for variables, functions, and method names
14. **ALWAYS** use descriptive names — no single-letter loop/lambda variables (`index` not `i`, `context` not `c`), no single-letter generics (`DataType` not `T`)
15. **ALWAYS** sort imports alphabetically by module path — external packages first, then internal imports, separated by a blank line
16. **ALWAYS** use early-return guard clauses (`if (!x) return`) over wrapping function bodies in conditional blocks
17. **ALWAYS** use concise expressions — arrow syntax without braces for single-expression functions, inline trivial intermediate variables
18. **ALWAYS** use named exports via barrel files — never default exports
19. **NEVER** use inline type assertions (`as const`, `as Type`) when proper types can be extracted from library signatures or `satisfies`
20. **ALWAYS** infer types from Zod schemas with `z.infer<typeof schema>` — never duplicate types manually

## Decision Trees

### Where to Put Logic

```
Needs request/response context?
├── YES → Middleware or Route Handler
│   ├── Cross-cutting concern → Middleware factory in middleware/
│   ├── Route-specific logic → Handler in routes/<feature>/handlers.ts
│   └── Shared validation → Zod schema in routes/<feature>/schemas.ts
└── NO → Pure utility
    ├── DB queries → Service in services/<feature>.ts
    ├── External API call → Client in lib/<service>.ts
    └── Helpers → lib/utils.ts
```

### Auth Strategy

```
Request arrives →
├── Public route (/health, /docs)? → Skip auth
└── Protected route?
    ├── supabase_middleware() → Creates per-request client, sets context.var.supabase
    ├── auth_guard() → Calls getUser(), sets context.var.user or returns 401
    └── Handler → Uses context.var.user (guaranteed non-null)
```

### Error Handling

```
Error occurs →
├── Expected (bad input, not found, forbidden)?
│   └── throw new HTTPException(status, { message }) — developer-controlled message
└── Unexpected (DB crash, network timeout)?
    └── Let error_boundary catch it → logs full error, returns generic 500
```

## Core Patterns

### App Factory

```ts
import { OpenAPIHono } from '@hono/zod-openapi';
import { requestId } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';

import { error_boundary } from '@/middleware/error-boundary.js';
import { not_found } from '@/middleware/not-found.js';
import { pino_logger } from '@/middleware/logger.js';

export interface AppBindings {
  Variables: {
    supabase: SupabaseClient;
    user: User;
    logger: Logger;
    request_id: string;
  };
}

export function create_app() {
  const app = new OpenAPIHono<AppBindings>({ strict: false, defaultHook: default_hook });
  app.use(requestId(), secureHeaders(), pino_logger());
  app.notFound(not_found);
  app.onError(error_boundary);
  return app;
}
```

### Supabase Auth Guard (Middleware Factory)

Shape — full implementations in [security-patterns.md](references/security-patterns.md):

```ts
export const supabase_middleware = (): MiddlewareHandler => { /* createServerClient per-request with cookie forwarding → context.set('supabase', client) */ };
export const auth_guard = (): MiddlewareHandler => { /* getUser() → 401 or context.set('user', user) */ };
```

### Route Definition (Zod + OpenAPI)

```ts
export const list = createRoute({
  path: '/expenses',
  method: 'get',
  tags: ['Expenses'],
  request: { query: period_schema },
  responses: {
    [HttpStatusCodes.OK]: json_content(z.array(expense_schema), 'Expense list'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json_content(
      create_error_schema(period_schema), 'Validation error'
    ),
  },
});

export type ListRoute = typeof list;
```

### Handler (Separated from Route Definition)

```ts
export const list: AppRouteHandler<ListRoute> = async (context) => {
  const { start_date, end_date } = context.req.valid('query');
  const user = context.var.user;

  const { data, error } = await context.var.supabase
    .from('expenses').select()
    .gte('date', start_date).lte('date', end_date)
    .eq('user_id', user.id);

  if (error) throw new HTTPException(500, { message: 'Failed to fetch expenses' });
  return context.json(data);
};
```

### Error Boundary

Shape — full implementation in [security-patterns.md](references/security-patterns.md):

```ts
export const error_boundary: ErrorHandler = (error, context) => {
  /* HTTPException → return its message; unexpected → log + generic 500 */
};
```

### Middleware Stack Order

```ts
app.use('*', requestId(), secureHeaders(), cors_middleware(), pino_logger());
app.use('/api/*', supabase_middleware());
app.use('/api/*', auth_guard()); // after supabase, before routes
// Rate limiting on specific public endpoints
app.use('/api/auth/*', rateLimiter({ limit: 10, window: 60 }));
```

## References

- [Project structure](references/project-structure.md)
- [Security patterns](references/security-patterns.md)
- [TypeScript patterns](references/typescript-patterns.md)
- [Anti-patterns](references/anti-patterns.md)

## Questions this skill answers

- How do I structure a Hono + Bun + Supabase backend?
- What middleware stack order should I use?
- How do I inject Supabase clients per-request instead of using a global singleton?
- How do I set up Zod-validated OpenAPI routes in Hono?
- Where should business logic vs. route definitions live?
- How do I implement auth guards with Supabase in Hono middleware?
- What error handling pattern should I use (HTTPException vs. error boundary)?
- How do I type Hono context variables with AppBindings?
- How do I add rate limiting to public endpoints?
- What are the naming and import conventions for this stack?

